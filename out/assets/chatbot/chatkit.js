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
        greeting: "Welcome to SynD Assistant! How can we help with synthetic data governace framework?",
        prompts: [
          {
            label: "Overview",
            prompt: "Give me a high-level overview of the SynD Synthetic Health Data Governance Framework.",
            icon: "sparkle",
          },
          {
            label: "Risk assessment",
            prompt: "Help me plan a re-identification risk assessment for a new synthetic dataset.",
            icon: "lifesaver",
          },
          {
            label: "Share safely",
            prompt: "What controls should I consider before sharing synthetic health data?",
            icon: "lightbulb",
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
      opacity: "0",
      visibility: "hidden",
      pointerEvents: "none",
      transform: "translateY(12px)",
      transition: "opacity 0.25s ease, transform 0.25s ease, visibility 0.25s ease",
    });

    document.body.appendChild(el);

    const launcher = document.createElement("button");
    launcher.type = "button";
    launcher.className = "synd-chat-launcher";
    const ICON_OPEN = '<span class="synd-chat-launcher__icon" aria-hidden="true">✶</span>';
    const ICON_CLOSE = '<span class="synd-chat-launcher__icon" aria-hidden="true">×</span>';
    launcher.innerHTML = ICON_OPEN;
    launcher.setAttribute("aria-label", "Open SynD Assistant chat");
    launcher.setAttribute("aria-expanded", "false");

    let isOpen = false;
    const setOpen = (next) => {
      isOpen = next;
      launcher.setAttribute("aria-expanded", String(isOpen));
      launcher.setAttribute("aria-label", isOpen ? "Minimise SynD Assistant chat" : "Open SynD Assistant chat");
      launcher.innerHTML = isOpen ? ICON_CLOSE : ICON_OPEN;
      if (isOpen) {
        el.dataset.open = "true";
        el.style.visibility = "visible";
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
        el.style.transform = "translateY(0)";
        setTimeout(() => el.focus?.(), 0);
      } else {
        delete el.dataset.open;
        el.style.opacity = "0";
        el.style.pointerEvents = "none";
        el.style.transform = "translateY(12px)";
        setTimeout(() => {
          if (!isOpen) {
            el.style.visibility = "hidden";
          }
        }, 250);
      }
    };

    launcher.addEventListener("click", () => {
      setOpen(!isOpen);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && isOpen) {
        setOpen(false);
        launcher.focus();
      }
    });

    setOpen(false);
    document.body.appendChild(launcher);

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
