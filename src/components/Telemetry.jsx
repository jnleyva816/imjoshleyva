import { useSyncExternalStore } from "react";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

function subscribe(onChange) {
  document.addEventListener("prerenderingchange", onChange);
  return () => document.removeEventListener("prerenderingchange", onChange);
}

// public/speculation-rules.json prerenders pages on hover; a page only counts
// as a visit once someone actually opens it.
const isShown = () => !document.prerendering;

// Kept eager on purpose: lazy-loading it added a request that delayed LCP.
export default function Telemetry() {
  const shown = useSyncExternalStore(subscribe, isShown, () => false);
  if (!shown) return null;

  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
