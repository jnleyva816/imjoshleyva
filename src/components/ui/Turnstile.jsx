import { useEffect, useImperativeHandle, useRef } from "react";

const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let loading;
function loadScript() {
  loading ??= new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SCRIPT;
    script.async = true;
    script.onload = () => resolve(window.turnstile);
    script.onerror = reject;
    document.head.append(script);
  });
  return loading;
}

/**
 * Cloudflare Turnstile. Stays invisible unless Cloudflare wants an
 * interaction. It adds a `cf-turnstile-response` field to the parent form.
 */
export default function Turnstile({ siteKey, ref }) {
  const container = useRef(null);
  const widget = useRef(null);

  useImperativeHandle(ref, () => ({
    reset: () => widget.current != null && window.turnstile?.reset(widget.current),
  }));

  useEffect(() => {
    let cancelled = false;
    loadScript()
      .then((turnstile) => {
        if (cancelled || !container.current) return;
        widget.current = turnstile.render(container.current, {
          sitekey: siteKey,
          appearance: "interaction-only",
          theme: "auto",
          size: "flexible",
        });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
      if (widget.current != null) window.turnstile?.remove(widget.current);
      widget.current = null;
    };
  }, [siteKey]);

  return <div ref={container} />;
}
