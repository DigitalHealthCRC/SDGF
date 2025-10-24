#!/bin/bash

###############################################################################
# Cloudflare Worker Deployment Script
#
# This script automates the deployment of the ChatKit token generation worker
# with validation and error checking.
###############################################################################

set -e  # Exit on error

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No colour

# Script directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

###############################################################################
# Helper Functions
###############################################################################

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

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

###############################################################################
# Pre-deployment Checks
###############################################################################

print_header "Pre-deployment Checks"

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi
print_success "Node.js installed: $(node --version)"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed"
    exit 1
fi
print_success "npm installed: $(npm --version)"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    print_error "package.json not found"
    exit 1
fi
print_success "package.json found"

# Check if wrangler.toml exists
if [ ! -f "wrangler.toml" ]; then
    print_error "wrangler.toml not found"
    exit 1
fi
print_success "wrangler.toml found"

###############################################################################
# Install Dependencies
###############################################################################

print_header "Installing Dependencies"

if [ ! -d "node_modules" ]; then
    print_info "Installing npm packages..."
    npm install
    print_success "Dependencies installed"
else
    print_info "Checking for updates..."
    npm install
    print_success "Dependencies up to date"
fi

###############################################################################
# Check Wrangler Authentication
###############################################################################

print_header "Checking Cloudflare Authentication"

if ! npx wrangler whoami &> /dev/null; then
    print_warning "Not logged in to Cloudflare"
    print_info "Please log in to Cloudflare..."
    npx wrangler login

    if ! npx wrangler whoami &> /dev/null; then
        print_error "Authentication failed"
        exit 1
    fi
fi

print_success "Authenticated to Cloudflare"
npx wrangler whoami

###############################################################################
# Check Secrets Configuration
###############################################################################

print_header "Checking Secrets Configuration"

print_info "Checking if OPENAI_API_KEY is set..."
if npx wrangler secret list 2>/dev/null | grep -q "OPENAI_API_KEY"; then
    print_success "OPENAI_API_KEY is configured"
else
    print_warning "OPENAI_API_KEY is not set"
    echo ""
    read -p "Would you like to set it now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npx wrangler secret put OPENAI_API_KEY
    else
        print_error "OPENAI_API_KEY is required for deployment"
        exit 1
    fi
fi

print_info "Checking if CHATKIT_WORKFLOW_ID is set..."
if npx wrangler secret list 2>/dev/null | grep -q "CHATKIT_WORKFLOW_ID"; then
    print_success "CHATKIT_WORKFLOW_ID is configured"
else
    print_warning "CHATKIT_WORKFLOW_ID is not set"
    echo ""
    read -p "Would you like to set it now? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        npx wrangler secret put CHATKIT_WORKFLOW_ID
    else
        print_error "CHATKIT_WORKFLOW_ID is required for deployment"
        exit 1
    fi
fi

###############################################################################
# Optional: KV Namespace Setup
###############################################################################

print_header "Optional: KV Namespace for Rate Limiting"

if grep -q "# \[\[kv_namespaces\]\]" wrangler.toml; then
    print_info "KV namespace is not enabled (optional)"
    echo ""
    read -p "Would you like to enable KV-based rate limiting? (y/n) " -n 1 -r
    echo ""
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_info "Creating KV namespace..."
        KV_OUTPUT=$(npx wrangler kv:namespace create "RATE_LIMIT_KV")
        KV_ID=$(echo "$KV_OUTPUT" | grep -oP 'id = "\K[^"]+')

        if [ -n "$KV_ID" ]; then
            print_success "KV namespace created: $KV_ID"
            print_info "Please manually update wrangler.toml with:"
            echo ""
            echo "[[kv_namespaces]]"
            echo "binding = \"RATE_LIMIT_KV\""
            echo "id = \"$KV_ID\""
            echo ""
            read -p "Press Enter to continue after updating wrangler.toml..."
        fi
    fi
else
    print_success "KV namespace is enabled"
fi

###############################################################################
# Validate Worker Code
###############################################################################

print_header "Validating Worker Code"

if [ ! -f "worker.js" ]; then
    print_error "worker.js not found"
    exit 1
fi
print_success "worker.js found"

# Check for syntax errors (basic check)
if node -c worker.js 2>/dev/null; then
    print_success "No syntax errors detected"
else
    print_error "Syntax errors found in worker.js"
    exit 1
fi

###############################################################################
# Deploy to Cloudflare
###############################################################################

print_header "Deploying to Cloudflare"

print_info "Starting deployment..."
echo ""

if npx wrangler deploy; then
    print_success "Deployment successful!"
    echo ""

    # Get deployment URL
    DEPLOYMENT_INFO=$(npx wrangler deployments list --json 2>/dev/null || echo "{}")

    print_header "Deployment Complete"
    echo ""
    print_success "Your worker is now live!"
    echo ""
    print_info "Worker URL:"
    echo "https://synd-dgf-chatkit-token.YOUR-SUBDOMAIN.workers.dev"
    echo ""
    print_warning "Next steps:"
    echo "1. Copy the worker URL above"
    echo "2. Update WORKER_URL in ../chatbot-assets/chatbot.js"
    echo "3. Commit and push to deploy the chatbot to your website"
    echo ""

else
    print_error "Deployment failed"
    exit 1
fi

###############################################################################
# Post-deployment Testing
###############################################################################

print_header "Post-deployment Testing"

echo ""
read -p "Would you like to test the deployed worker? (y/n) " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter your worker URL: " WORKER_URL

    if [ -n "$WORKER_URL" ]; then
        print_info "Testing worker endpoint..."

        RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$WORKER_URL" \
            -H "Content-Type: application/json" \
            -H "Origin: https://digitalhealthcrc.github.io")

        HTTP_CODE=$(echo "$RESPONSE" | tail -n1)
        BODY=$(echo "$RESPONSE" | head -n-1)

        if [ "$HTTP_CODE" = "200" ]; then
            print_success "Worker is responding correctly (HTTP 200)"
            echo ""
            print_info "Response:"
            echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
        else
            print_error "Worker returned HTTP $HTTP_CODE"
            echo ""
            print_info "Response:"
            echo "$BODY"
        fi
    fi
fi

###############################################################################
# Summary
###############################################################################

print_header "Deployment Summary"

echo ""
print_success "Cloudflare Worker deployed successfully"
echo ""
echo "Configuration:"
echo "  • Worker name: synd-dgf-chatkit-token"
echo "  • Secrets configured: OPENAI_API_KEY, CHATKIT_WORKFLOW_ID"
echo "  • Rate limiting: $(grep -q "^\[\[kv_namespaces\]\]" wrangler.toml && echo "Enabled (KV)" || echo "Basic (in-memory)")"
echo ""
echo "Monitoring:"
echo "  • Live logs: npx wrangler tail"
echo "  • Deployments: npx wrangler deployments list"
echo "  • Dashboard: https://dash.cloudflare.com"
echo ""

print_info "Deployment complete!"
