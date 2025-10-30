// SynD ChatKit widget bootstrap – safe version
(() => {
  const WORKER_URL =
    "https://synd-dgf-chatkit-token.synd-dgf.workers.dev";

  // wait for body
  function onReady(fn) {
    if (document.body) return fn();
    const obs = new MutationObserver(() => {
      if (document.body) {
        obs.disconnect();
        fn();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }

  onReady(async () => {
    // avoid duplicates
    if (document.querySelector("openai-chatkit")) return;

    // global config (must exist before element creation)
    window.OpenAIChatKitConfig = {
      api: {
        async getClientSecret() {
          const res = await fetch(WORKER_URL, { method: "POST" });
          const data = await res.json();
          return data.client_secret;
        },
      },
      header: {
        title: { text: "SynD Assistant" },
      },
      theme: {
        colorScheme: "dark",
        color: {
          accent: {
            primary: "#0d9488",
            level: 2,
          },
        },
        radius: "round",
        typography: {
          fontFamily: "'Inter', sans-serif",
        },
      },
      composer: {
        placeholder: "Ask SynD Assistant anything about the SynD framework…",
      },
      startScreen: {
        greeting: "Welcome to SynD Assistant! How can we help with synthetic data today?",
        prompts: [
          {
            label: "SynD overview",
            prompt: "Give me a high-level overview of the SynD Synthetic Health Data Governance Framework.",
            icon: "sparkle",
          },
          {
            label: "Risk assessment",
            prompt: "Help me plan a re-identification risk assessment for a new synthetic dataset.",
            icon: "shield-check",
          },
          {
            label: "Share safely",
            prompt: "What controls should I consider before sharing synthetic health data?",
            icon: "lock-open",
          },
        ],
      },
    };

    // create element
    const el = document.createElement("openai-chatkit");
    el.dataset.colorScheme = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";

    Object.assign(el.style, {
      position: "fixed",
      bottom: "24px",
      right: "24px",
      width: "400px",
      height: "600px",
      zIndex: "9999",
      borderRadius: "16px",
      boxShadow: "0 12px 32px rgba(0,0,0,0.4)",
      overflow: "hidden",
    });

    document.body.appendChild(el);

    if (typeof el.setOptions === "function") {
      el.setOptions(window.OpenAIChatKitConfig);
    } else {
      // ensure options applied once custom element upgrades
      customElements.whenDefined("openai-chatkit").then(() => {
        const upgraded = document.querySelector("openai-chatkit");
        upgraded?.setOptions(window.OpenAIChatKitConfig);
      });
    }
  });
})();
