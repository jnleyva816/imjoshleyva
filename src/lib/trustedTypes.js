// With Trusted Types required (see vercel.json), a plain string can't become a
// script URL. Vercel Analytics, Speed Insights, and Turnstile all add a
// <script src>, so this "default" policy lets exactly those through and
// leaves everything else blocked and reported. It has to exist before any of
// them run, so src/boot.jsx imports it first.
const allowed = [`${window.location.origin}/_vercel/`, "https://challenges.cloudflare.com/"];

if (window.trustedTypes?.createPolicy && !window.trustedTypes.defaultPolicy) {
  window.trustedTypes.createPolicy("default", {
    createScriptURL(url) {
      const absolute = new URL(url, window.location.href).href;
      return allowed.some((prefix) => absolute.startsWith(prefix)) ? url : null;
    },
  });
}
