import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";

// Kept eager on purpose: lazy-loading it added a request that delayed LCP.
export default function Telemetry() {
  return (
    <>
      <Analytics />
      <SpeedInsights />
    </>
  );
}
