/**
 * Simplified Cloudflare Worker for ChatKit Sessions
 *
 * This version is easier to understand while still being functional.
 * Uses direct API call since openai.chatkit.sessions doesn't exist in SDK yet.
 */

export default {
  async fetch(request, env) {
    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': request.headers.get('Origin') || 'https://digitalhealthcrc.github.io',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    // Handle preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only allow POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders }
      });
    }

    try {
      // Call OpenAI ChatKit Sessions API directly
      const response = await fetch('https://api.openai.com/v1/chatkit/sessions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
          'OpenAI-Beta': 'chatkit-1'
        },
        body: JSON.stringify({
          user: 'anonymous',
          workflow: { id: env.CHATKIT_WORKFLOW_ID }
        })
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('OpenAI API error:', response.status, error);
        throw new Error(`OpenAI returned ${response.status}`);
      }

      const session = await response.json();

      return new Response(JSON.stringify({
        client_secret: session.client_secret
      }), {
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });

    } catch (error) {
      console.error('Error creating session:', error);

      return new Response(JSON.stringify({
        error: 'Failed to create chat session',
        message: error.message
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders
        }
      });
    }
  }
};
