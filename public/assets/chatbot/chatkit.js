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
      theme: {
        brandColor: "#0d9488",
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
  });
})();
