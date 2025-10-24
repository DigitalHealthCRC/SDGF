/**
 * SynD-DGF ChatKit Widget JavaScript
 *
 * Handles ChatKit initialization, token management, and UI interactions
 */

(function() {
  'use strict';

  // Configuration
  const CONFIG = {
    // Cloudflare Worker URL (deployed)
    WORKER_URL: 'https://synd-dgf-chatkit-token.synd-dgf.workers.dev',

    // Local testing URL (uncomment for local development)
    // WORKER_URL: 'http://localhost:8787',

    // Session token cache duration (15 minutes)
    TOKEN_CACHE_DURATION: 15 * 60 * 1000,

    // Retry configuration
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    // Conversation persistence (thread) TTL in days
    THREAD_TTL_DAYS: 7,
    CHATKIT_READY_TIMEOUT: 10000,
    CHATKIT_CONFIG: {}
  };

  class SyndChatbot {
    constructor() {
      this.isOpen = false;
      this.isInitialized = false;
      this.sessionToken = null;
      this.tokenExpiry = null;
      this.retryCount = 0;
      this.threadId = null;
      this.chatkitWidget = null;
      this.keydownHandler = null;

      this.init();
    }

    /**
     * Initialize the chatbot UI
     */
  init() {
      // Create chat bubble
      this.createChatBubble();

      // Create chat widget
      this.createChatWidget();

      // Load widget state from localStorage
      this.loadState();

      // Listen for storage events (multi-tab sync)
      window.addEventListener('storage', (e) => {
        if (e.key === 'synd-chat-open') {
          this.isOpen = e.newValue === 'true';
          this.updateUI();
        }
      });

      // Global ESC to close
      this.keydownHandler = (e) => {
        if (e.key === 'Escape' && this.isOpen) this.close();
      };
      document.addEventListener('keydown', this.keydownHandler);
    }

    /**
     * Create the chat bubble button
     */
    createChatBubble() {
      const bubble = document.createElement('button');
      bubble.className = 'synd-chat-bubble';
      bubble.setAttribute('aria-label', 'Open chat assistant');
      bubble.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      `;

      bubble.addEventListener('click', () => this.toggle());

      document.body.appendChild(bubble);
      this.bubble = bubble;
    }

    /**
     * Create the chat widget container
     */
    createChatWidget() {
      const widget = document.createElement('div');
      widget.className = 'synd-chat-widget';
      widget.setAttribute('role', 'dialog');
      widget.setAttribute('aria-labelledby', 'synd-chat-title');
      widget.setAttribute('aria-modal', 'true');
      widget.setAttribute('tabindex', '-1');
      widget.innerHTML = `
        <div class="synd-chat-header">
          <div class="synd-chat-header-content">
            <div class="synd-chat-avatar" aria-hidden="true">
              <span class="synd-chat-avatar-initials">DZ</span>
            </div>
            <div class="synd-chat-header-text">
              <h3 id="synd-chat-title">Assistant</h3>
              <p>Synthetic Data Governance Framework AI Assistant</p>
            </div>
          </div>
          <div class="synd-chat-actions">
            <button class="synd-chat-new" aria-label="Start new chat" title="Start new conversation">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 5v14M5 12h14"></path>
              </svg>
            </button>
            <button class="synd-chat-close" aria-label="Close chat">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
        <div class="synd-chat-body" id="synd-chat-body">
          <div class="synd-chat-loading">
            <div class="synd-chat-spinner"></div>
            <p>Initialising assistant...</p>
          </div>
        </div>
      `;

      // Close button handler
      const closeBtn = widget.querySelector('.synd-chat-close');
      closeBtn.addEventListener('click', () => this.close());

      // New chat button handler
      const newChatBtn = widget.querySelector('.synd-chat-new');
      newChatBtn.addEventListener('click', () => this.startNewChat());

      document.body.appendChild(widget);
      this.widget = widget;
      this.bodyEl = widget.querySelector('#synd-chat-body');

    }

    /**
     * Start a new chat conversation
     */
    startNewChat() {
      if (confirm('Start a new conversation? Your current chat history will be cleared.')) {
        this.clearThread();
        if (this.chatkitWidget && this.chatkitWidget.setThreadId) {
          this.chatkitWidget.setThreadId(null);
        }
        if (this.bodyEl) {
          this.bodyEl.innerHTML = `
            <div class=\"synd-chat-loading\">
              <div class=\"synd-chat-spinner\"></div>
              <p>Initialising assistant...</p>
            </div>
          `;
        }
        if (this.isInitialized) {
          this.initializeChatKit();
        }
      }
    }

    /**
     * Toggle chat open/closed
     */
    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    /**
     * Open the chat widget
     */
    async open() {
      this.isOpen = true;
      this.saveState();
      this.updateUI();

        // Initialize ChatKit if not already done
        if (!this.isInitialized) {
          await this.initializeChatKit();
        }
      // Focus dialog for accessibility
      if (this.widget) {
        try { this.widget.focus(); } catch {}
      }
    }

    /**
     * Close the chat widget
     */
    close() {
      this.isOpen = false;
      this.saveState();
      this.updateUI();
    }

    /**
     * Update UI based on state
     */
    updateUI() {
      if (this.isOpen) {
        this.widget.classList.add('open');
        this.bubble.classList.add('open');
        this.bubble.setAttribute('aria-label', 'Close chat assistant');
      } else {
        this.widget.classList.remove('open');
        this.bubble.classList.remove('open');
        this.bubble.setAttribute('aria-label', 'Open chat assistant');
      }
    }

    /**
     * Save state to localStorage
     */
    saveState() {
      try {
        localStorage.setItem('synd-chat-open', this.isOpen);
      } catch (e) {
        console.warn('Could not save chat state:', e);
      }
    }

    /**
     * Load state from localStorage
     */
    loadState() {
      try {
        const savedState = localStorage.getItem('synd-chat-open');
        if (savedState === 'true') {
          this.open();
        }
      } catch (e) {
        console.warn('Could not load chat state:', e);
      }
    }

    /**
     * Save thread ID to localStorage for persistence across pages
     */
    saveThreadId(threadId) {
      try {
        this.threadId = threadId;
        if (threadId) {
          localStorage.setItem('synd-chat-thread-id', threadId);
          console.log('Thread ID saved:', threadId);
        }
      } catch (e) {
        console.warn('Could not save thread ID:', e);
      }
    }

    /**
     * Load thread ID from localStorage
     */
    loadThreadId() {
      try {
        const savedThreadId = localStorage.getItem('synd-chat-thread-id');
        if (savedThreadId) {
          this.threadId = savedThreadId;
          console.log('Thread ID loaded:', savedThreadId);
          return savedThreadId;
        }
      } catch (e) {
        console.warn('Could not load thread ID:', e);
      }
      return null;
    }

    /**
     * Clear thread ID to start a new conversation
     */
    clearThread() {
      try {
        this.threadId = null;
        localStorage.removeItem('synd-chat-thread-id');
        localStorage.removeItem('synd-chat-thread');
        console.log('Thread ID cleared');

        // Reset ChatKit widget with new thread
        if (this.chatkitWidget && this.chatkitWidget.setThreadId) {
          this.chatkitWidget.setThreadId(null);
        }
      } catch (e) {
        console.warn('Could not clear thread ID:', e);
      }
    }

    /**
     * Initialize ChatKit widget
     */
    async initializeChatKit() {
      try {
        console.log('Initializing ChatKit...');

        // Wait for ChatKit custom element to be defined
        await this.waitForChatKit();
        console.log('ChatKit element defined');

        // Create the chatkit widget element
        const chatkit = document.createElement('openai-chatkit');
        chatkit.style.width = '100%';
        chatkit.style.height = '100%';

        // Store reference to chatkit widget
        this.chatkitWidget = chatkit;

        // Configure the widget with getClientSecret callback
        const options = {
          api: {
            getClientSecret: async (existingSecret) => {
              console.log('ChatKit requesting client secret...');
              try {
                const clientSecret = await this.getClientSecret();
                console.log('Client secret provided to ChatKit');
                return clientSecret;
              } catch (error) {
                console.error('Error in getClientSecret callback:', error);
                throw error;
              }
            }
          },
          ...CONFIG.CHATKIT_CONFIG
        };
        chatkit.setOptions(options);

        // Clear body and mount the widget
        this.bodyEl.innerHTML = '';
        this.bodyEl.appendChild(chatkit);

        // Listen for thread changes to persist thread ID
        chatkit.addEventListener('chatkit.thread.change', (event) => {
          console.log('Thread changed:', event.detail);
          if (event.detail && event.detail.threadId) {
            this.saveThreadId(event.detail.threadId);
          }
        });

        // Load existing thread ID and restore conversation
        const existingThreadId = this.loadThreadId();
        if (existingThreadId) {
          console.log('Restoring previous conversation...');
          // Use setTimeout to ensure ChatKit is fully initialized
          setTimeout(() => {
            if (chatkit.setThreadId) {
              chatkit.setThreadId(existingThreadId);
              console.log('Previous conversation restored');
            }
          }, 500);
        }

        this.isInitialized = true;
        console.log('ChatKit widget mounted successfully');

      } catch (error) {
        console.error('Failed to initialize ChatKit:', error);
        this.showError(error.message);
      }
    }

    /**
     * Wait until the ChatKit custom element is registered
     */
    async waitForChatKit() {
      if (customElements.get('openai-chatkit')) {
        return;
      }
      const timeoutMs = CONFIG.CHATKIT_READY_TIMEOUT;
      await Promise.race([
        customElements.whenDefined('openai-chatkit'),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Chat assistant failed to load. Please refresh the page.')), timeoutMs))
      ]);
    }

    /**
     * Get client secret from Cloudflare Worker
     */
    async getClientSecret() {
      // Check if we have a valid cached token
      if (this.sessionToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
        console.log('Using cached session token');
        return this.sessionToken;
      }

      // Fetch new token with retry logic
      return this.fetchTokenWithRetry();
    }

    /**
     * Fetch token with exponential backoff retry
     */
    async fetchTokenWithRetry() {
      for (let attempt = 0; attempt < CONFIG.MAX_RETRIES; attempt++) {
        try {
          const response = await fetch(CONFIG.WORKER_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Client-ID': this.getClientId()
            },
            credentials: 'omit'
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();

          // Cache the token
          this.sessionToken = data.client_secret;
          this.tokenExpiry = Date.now() + CONFIG.TOKEN_CACHE_DURATION;

          console.log('Successfully fetched session token');
          return data.client_secret;

        } catch (error) {
          console.error(`Token fetch attempt ${attempt + 1} failed:`, error);

          // If this was the last attempt, throw
          if (attempt === CONFIG.MAX_RETRIES - 1) {
            throw new Error(`Failed to get session token after ${CONFIG.MAX_RETRIES} attempts: ${error.message}`);
          }

          // Wait before retrying (exponential backoff + jitter)
          const base = CONFIG.RETRY_DELAY * Math.pow(2, attempt);
          const jitter = Math.floor(Math.random() * 300);
          await this.sleep(base + jitter);
      }
    }
    }

    /**
     * Get or create a client ID for rate limiting
     */
    getClientId() {
      try {
        let clientId = localStorage.getItem('synd-chat-client-id');
        if (!clientId) {
          clientId = this.generateUUID();
          localStorage.setItem('synd-chat-client-id', clientId);
        }
        return clientId;
      } catch (e) {
        return this.generateUUID();
      }
    }

    /**
     * Generate a simple UUID
     */
    generateUUID() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }

    /**
     * Sleep utility
     */
    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Show error state
     */
    showError(message) {
      this.bodyEl.innerHTML = `
        <div class="synd-chat-error">
          <div class="synd-chat-error-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3>Connection error</h3>
          <p>${this.escapeHtml(message)}</p>
          <p style="font-size: 12px; margin-top: 8px;">Please check your internet connection and try again.</p>
          <button onclick="location.reload()">Reload page</button>
        </div>
      `;
    }

    /**
     * Escape HTML to prevent XSS
     */
    escapeHtml(text) {
      const div = document.createElement('div');
      div.textContent = text;
      return div.innerHTML;
    }
  }

  // Initialize chatbot when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      window.syndChatbot = new SyndChatbot();
    });
  } else {
    window.syndChatbot = new SyndChatbot();
  }

})();
