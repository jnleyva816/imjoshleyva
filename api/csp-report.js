import { clientIp, rateLimit } from "./_lib/guard.js";

// Browsers post here when the Content-Security-Policy (or the report-only
// Trusted Types policy) blocks something. Reports land in the Vercel logs.
const overLimit = rateLimit("csp", { max: 30, windowSeconds: 600 });
const MAX_BYTES = 64 * 1024;

const short = (value, max = 200) => (typeof value === "string" ? value.slice(0, max) : undefined);

async function readBody(req) {
  if (req.body !== undefined && req.body !== null && req.body !== "") {
    return Buffer.isBuffer(req.body) ? req.body.toString() : req.body;
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BYTES) break;
    chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString();
}

/** One shape for both the Reporting API and the older report-uri format. */
export function normalize(payload) {
  const reports = Array.isArray(payload) ? payload : [payload];
  return reports
    .map((report) => {
      const legacy = report?.["csp-report"];
      if (legacy) {
        return {
          directive: legacy["effective-directive"] || legacy["violated-directive"],
          blocked: legacy["blocked-uri"],
          page: legacy["document-uri"],
          source: legacy["source-file"],
          line: legacy["line-number"],
          sample: legacy["script-sample"],
          disposition: legacy.disposition,
        };
      }
      if (report?.type === "csp-violation" && report.body) {
        const body = report.body;
        return {
          directive: body.effectiveDirective,
          blocked: body.blockedURL,
          page: body.documentURL,
          source: body.sourceFile,
          line: body.lineNumber,
          sample: body.sample,
          disposition: body.disposition,
        };
      }
      return null;
    })
    .filter(Boolean)
    .map((report) => Object.fromEntries(Object.entries(report).map(([key, value]) => [key, typeof value === "number" ? value : short(value)])));
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end();
  }
  if (await overLimit(clientIp(req))) return res.status(429).end();

  let payload;
  try {
    const body = await readBody(req);
    payload = typeof body === "string" ? JSON.parse(body) : body;
  } catch {
    return res.status(400).end();
  }

  for (const report of normalize(payload).slice(0, 10)) {
    console.warn("csp-violation", JSON.stringify(report));
  }
  return res.status(204).end();
}
