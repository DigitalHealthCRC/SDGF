#!/bin/bash

###############################################################################
# Cloudflare Worker Testing Script
#
# Tests the ChatKit token generation endpoint
###############################################################################

set -e

# Colours
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_header() {
    echo ""
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE}  $1${NC}"
    echo -e "${BLUE}========================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

###############################################################################
# Get Worker URL
###############################################################################

print_header "Cloudflare Worker Test Suite"

if [ -z "$1" ]; then
    echo "Usage: bash test-worker.sh <worker-url>"
    echo ""
    echo "Example:"
    echo "  bash test-worker.sh https://synd-dgf-chatkit-token.abc123.workers.dev"
    echo ""
    exit 1
fi

WORKER_URL="$1"

print_info "Testing worker: $WORKER_URL"
echo ""

###############################################################################
# Test 1: OPTIONS (CORS Preflight)
###############################################################################

print_header "Test 1: CORS Preflight (OPTIONS)"

RESPONSE=$(curl -s -w "\n%{http_code}" -X OPTIONS "$WORKER_URL" \
    -H "Origin: https://digitalhealthcrc.github.io" \
    -H "Access-Control-Request-Method: POST" \
    -H "Access-Control-Request-Headers: Content-Type")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
HEADERS=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "204" ]; then
    print_success "CORS preflight successful (HTTP 204)"

    if echo "$HEADERS" | grep -q "Access-Control-Allow-Origin"; then
        print_success "CORS headers present"
    else
        print_error "CORS headers missing"
    fi
else
    print_error "CORS preflight failed (HTTP $HTTP_CODE)"
fi

###############################################################################
# Test 2: GET Request (Should Fail)
###############################################################################

print_header "Test 2: GET Request (Should Reject)"

RESPONSE=$(curl -s -w "\n%{http_code}" -X GET "$WORKER_URL" \
    -H "Origin: https://digitalhealthcrc.github.io")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "405" ]; then
    print_success "Correctly rejected GET request (HTTP 405)"
else
    print_error "Unexpected response to GET request (HTTP $HTTP_CODE)"
fi

###############################################################################
# Test 3: POST Without Origin (Should Fail CORS)
###############################################################################

print_header "Test 3: POST Without Origin Header"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WORKER_URL" \
    -H "Content-Type: application/json")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

print_info "HTTP Status: $HTTP_CODE"
# May still work but without CORS headers

###############################################################################
# Test 4: POST With Valid Origin (Should Succeed)
###############################################################################

print_header "Test 4: Valid POST Request"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WORKER_URL" \
    -H "Content-Type: application/json" \
    -H "Origin: https://digitalhealthcrc.github.io")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
BODY=$(echo "$RESPONSE" | head -n-1)

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Request successful (HTTP 200)"

    # Parse JSON response
    if command -v jq &> /dev/null; then
        echo ""
        print_info "Response:"
        echo "$BODY" | jq .

        # Check for required fields
        if echo "$BODY" | jq -e '.client_secret' > /dev/null 2>&1; then
            print_success "client_secret present"
        else
            print_error "client_secret missing"
        fi

        if echo "$BODY" | jq -e '.session_id' > /dev/null 2>&1; then
            print_success "session_id present"
        else
            print_error "session_id missing"
        fi

        if echo "$BODY" | jq -e '.expires_at' > /dev/null 2>&1; then
            print_success "expires_at present"
        else
            print_error "expires_at missing"
        fi
    else
        echo ""
        print_info "Response (install jq for formatted output):"
        echo "$BODY"
    fi
else
    print_error "Request failed (HTTP $HTTP_CODE)"
    echo ""
    print_info "Error response:"
    if command -v jq &> /dev/null; then
        echo "$BODY" | jq .
    else
        echo "$BODY"
    fi
    echo ""

    # Common errors
    if [ "$HTTP_CODE" = "500" ]; then
        print_info "Possible causes:"
        echo "  • OPENAI_API_KEY not set or invalid"
        echo "  • CHATKIT_WORKFLOW_ID not set or invalid"
        echo "  • Workflow not published in Agent Builder"
        echo ""
        echo "Check secrets:"
        echo "  npx wrangler secret list"
    fi

    if [ "$HTTP_CODE" = "429" ]; then
        print_info "Rate limit exceeded. Wait 1 hour or enable KV-based rate limiting."
    fi
fi

###############################################################################
# Test 5: Multiple Rapid Requests (Rate Limiting)
###############################################################################

print_header "Test 5: Rate Limiting (5 rapid requests)"

SUCCESS_COUNT=0
RATE_LIMITED=0

for i in {1..5}; do
    RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WORKER_URL" \
        -H "Content-Type: application/json" \
        -H "Origin: https://digitalhealthcrc.github.io" \
        -H "X-Client-ID: test-client-$RANDOM")

    HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

    if [ "$HTTP_CODE" = "200" ]; then
        ((SUCCESS_COUNT++))
        echo -n "."
    elif [ "$HTTP_CODE" = "429" ]; then
        ((RATE_LIMITED++))
        echo -n "R"
    else
        echo -n "E"
    fi
done

echo ""
echo ""
print_info "Results: $SUCCESS_COUNT successful, $RATE_LIMITED rate-limited"

if [ $SUCCESS_COUNT -eq 5 ]; then
    print_success "All requests successful"
elif [ $RATE_LIMITED -gt 0 ]; then
    print_info "Rate limiting is working"
fi

###############################################################################
# Test 6: Invalid Origin (Should Allow But Track)
###############################################################################

print_header "Test 6: Request from Different Origin"

RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WORKER_URL" \
    -H "Content-Type: application/json" \
    -H "Origin: https://evil.com")

HTTP_CODE=$(echo "$RESPONSE" | tail -n1)

print_info "HTTP Status: $HTTP_CODE"
print_info "CORS will prevent browser from using response, but server may still process it"

###############################################################################
# Summary
###############################################################################

print_header "Test Summary"

echo "Worker URL: $WORKER_URL"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    print_success "Worker is operational and configured correctly"
    echo ""
    echo "Next steps:"
    echo "1. Update WORKER_URL in chatbot-assets/chatbot.js"
    echo "2. Add domain to OpenAI allowlist"
    echo "3. Deploy to GitHub Pages"
else
    print_error "Worker has configuration issues"
    echo ""
    echo "Debugging steps:"
    echo "1. Check secrets: npx wrangler secret list"
    echo "2. View logs: npx wrangler tail"
    echo "3. Verify workflow exists in Agent Builder"
    echo "4. Check OpenAI API key has ChatKit access"
fi

echo ""
print_info "For more help, see: ../CHATBOT_IMPLEMENTATION_GUIDE.md"
