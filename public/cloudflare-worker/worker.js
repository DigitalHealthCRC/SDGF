/**
 * Cloudflare Worker for OpenAI ChatKit Session Generation
 *
 * This worker securely generates session tokens for the ChatKit widget
 * without exposing your OpenAI API key to the client.
 *
 * Uses direct API call to ChatKit Sessions endpoint since the SDK doesn't
 * include this endpoint yet.
 *
 * Security features:
 * - CORS protection
 * - Request validation
 * - Error handling
 */

// Rate limiting window
const WINDOW_MS = 60 * 1000; // 1 minute fixed window
// Basic in-memory fallback limiter (per isolate)
const memLimits = new Map(); // key -> { count, windowStart }

function parseIntSafe(v, def) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : def;
}

function parseOriginQuotas(json, def) {
  try {
    const obj = JSON.parse(json || '{}');
    const map = new Map();
    for (const [k, v] of Object.entries(obj)) {
      const n = parseIntSafe(v, def);
      map.set(k, n);
    }
    return map;
  } catch {
    return new Map();
  }
}

function bucketKey(prefix, parts, now = Date.now()) {
  const bucket = Math.floor(now / WINDOW_MS);
  return `${prefix}:${parts.join(':')}:${bucket}`;
}

async function kvIncrementAndCheck(kv, key, limit, ttlMs) {
  // Soft increment: read-modify-write with TTL; not strongly consistent but good enough for minute windows
  const current = parseInt(await kv.get(key, 'text') || '0', 10) || 0;
  if (current >= limit) return { allowed: false, count: current };
  const newCount = current + 1;
  const ttlSec = Math.max(60, Math.ceil(ttlMs / 1000));
  await kv.put(key, String(newCount), { expirationTtl: ttlSec });
  return { allowed: true, count: newCount };
}

function memIncrementAndCheck(map, key, limit, now = Date.now()) {
  let entry = map.get(key);
  const bucketStart = now - (now % WINDOW_MS);
  if (!entry || (now - entry.windowStart) >= WINDOW_MS) {
    entry = { count: 0, windowStart: bucketStart };
  }
  if (entry.count >= limit) {
    map.set(key, entry);
    return { allowed: false, count: entry.count };
  }
  entry.count += 1;
  map.set(key, entry);
  return { allowed: true, count: entry.count };
}

export default {
  async fetch(request, env) {
    // CORS configuration
    const DEFAULT_ORIGIN = 'https://digitalhealthcrc.github.io';
    const allowedHosts = new Set([
      'digitalhealthcrc.github.io',
      'localhost:8000',
      '127.0.0.1:8000'
    ]);

    const origin = request.headers.get('Origin');
    let allowOrigin = DEFAULT_ORIGIN;
    try {
      if (origin) {
        const u = new URL(origin);
        if (allowedHosts.has(u.host) && (u.protocol === 'https:' || u.host.startsWith('localhost') || u.host.startsWith('127.0.0.1'))) {
          allowOrigin = `${u.protocol}//${u.host}`;
        }
      }
    } catch {}

    const corsHeaders = {
      'Access-Control-Allow-Origin': allowOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Client-ID',
      'Access-Control-Max-Age': '86400',
      'Vary': 'Origin'
    };

    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders
      });
    }

    // Only allow POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({
        error: 'Method not allowed',
        message: 'Only POST requests are accepted'
      }), {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }

    try {
      // Rate limiting (KV-backed with in-memory fallback)
      const clientIdHeader = request.headers.get('X-Client-ID');
      const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
      const originHost = (() => {
        try { return origin ? new URL(origin).host : 'unknown'; } catch { return 'unknown'; }
      })();

      const defaultOriginQuota = parseIntSafe(env.DEFAULT_ORIGIN_QUOTA, 120);
      const perClientLimit = parseIntSafe(env.CLIENT_PER_MIN_LIMIT, 0); // 0 disables
      const originQuotas = parseOriginQuotas(env.ORIGIN_QUOTAS_JSON, defaultOriginQuota);
      const originLimit = originQuotas.get(originHost) || defaultOriginQuota;

      const nowTs = Date.now();
      const ttlMs = WINDOW_MS - (nowTs % WINDOW_MS);

      // Build keys
      const originKey = bucketKey('rate:origin', [originHost], nowTs);
      const clientKey = clientIdHeader ? bucketKey('rate:client', [originHost, clientIdHeader], nowTs)
                                       : bucketKey('rate:ip', [originHost, ip], nowTs);

      let allowed = true;
      let which = '';

      if (env.RATE_LIMIT_KV) {
        // Origin bucket
        const o = await kvIncrementAndCheck(env.RATE_LIMIT_KV, originKey, originLimit, ttlMs);
        allowed = o.allowed;
        which = 'origin';
        // Client bucket (if enabled)
        if (allowed && perClientLimit > 0) {
          const c = await kvIncrementAndCheck(env.RATE_LIMIT_KV, clientKey, perClientLimit, ttlMs);
          allowed = c.allowed;
          which = allowed ? which : 'client';
        }
      } else {
        // Fallback to in-memory
        const o = memIncrementAndCheck(memLimits, originKey, originLimit, nowTs);
        allowed = o.allowed;
        which = 'origin';
        if (allowed && perClientLimit > 0) {
          const c = memIncrementAndCheck(memLimits, clientKey, perClientLimit, nowTs);
          allowed = c.allowed;
          which = allowed ? which : 'client';
        }
      }

      if (!allowed) {
        return new Response(JSON.stringify({
          error: 'Rate limit exceeded',
          message: 'Too many requests. Please try again later.',
          scope: which
        }), {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store, no-cache, must-revalidate',
            'Retry-After': String(Math.ceil(ttlMs / 1000)),
            ...corsHeaders
          }
        });
      }
      // Validate environment variables
      if (!env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
      }
      if (!env.CHATKIT_WORKFLOW_ID) {
        throw new Error('CHATKIT_WORKFLOW_ID not configured');
      }

      // Get unique client ID from request header (generated per browser)
      const clientId = request.headers.get('X-Client-ID');

      // Call OpenAI ChatKit Sessions API directly
      // Reference: https://openai.github.io/chatkit-js/guides/authentication/
      const sessionResponse = await fetch('https://api.openai.com/v1/chatkit/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'chatkit_beta=v1'
        },
        body: JSON.stringify({
          user: clientId || 'anonymous', // Use client ID to isolate conversations per browser
          workflow: {
            id: env.CHATKIT_WORKFLOW_ID
          }
        })
      });

      if (!sessionResponse.ok) {
        const errorData = await sessionResponse.json().catch(() => ({}));
        console.error('OpenAI API error:', sessionResponse.status, errorData);
        throw new Error(`OpenAI API returned ${sessionResponse.status}: ${JSON.stringify(errorData)}`);
      }

      const session = await sessionResponse.json();

      // Return client secret for ChatKit widget
      return new Response(JSON.stringify({
        client_secret: session.client_secret
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store, no-cache, must-revalidate',
          'Vary': 'Origin',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('Error creating ChatKit session:', error);

      // Return error response
      return new Response(JSON.stringify({
        error: 'Internal server error',
        message: 'Failed to create chat session. Please try again later.',
        details: env.DEBUG === 'true' ? error.message : undefined
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          'Vary': 'Origin',
          ...corsHeaders
        }
      });
    }
  }
};
