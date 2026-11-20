import { clientIp, hasSharedStore, isProduction, rateLimit, sameOrigin } from "./_lib/guard.js";

const RESEND_URL = "https://api.resend.com/emails";
const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 120, email: 200, message: 5000 };
const RATE = { max: 5, windowSeconds: 600 };

const overLimit = rateLimit("contact", RATE);

async function passesTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  // Skipped only outside production, so local dev and previews work without keys.
  if (!secret) return !isProduction();
  if (!token) return false;
  try {
    const response = await fetch(TURNSTILE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(5000),
    });
    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("contact: Turnstile verification failed", error);
    return false;
  }
}

const AUTOREPLY = {
  subject: "Got your message",
  text: "Hi,\n\nThanks for writing through joshleyva.dev. Your message reached me, and I usually reply within a couple of days.\n\nJosh",
};

// Fixed wording on purpose: nothing the sender typed goes into a message
// addressed to whatever email they entered.
async function sendAutoreply({ apiKey, from, to, replyTo }) {
  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: replyTo, ...AUTOREPLY }),
      signal: AbortSignal.timeout(10000),
    });
    if (!response.ok) console.error("contact: auto-reply failed", response.status);
  } catch (error) {
    console.error("contact: auto-reply failed", error);
  }
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
}

function clean(value, max) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  if (!sameOrigin(req)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
  }

  // A per-instance count is no limit at all on serverless, so production
  // refuses to run without a shared store.
  if (isProduction() && !hasSharedStore()) {
    console.error("contact: no shared rate-limit store (UPSTASH_REDIS_REST_URL/TOKEN) in production");
    return res.status(503).json({ success: false, message: "Contact form is not configured" });
  }

  const body = typeof req.body === "object" && req.body !== null ? req.body : {};

  if (body._honey) {
    return res.status(200).json({ success: true });
  }

  const ip = clientIp(req);
  if (await overLimit(ip)) {
    res.setHeader("Retry-After", String(RATE.windowSeconds));
    return res.status(429).json({ success: false, message: "Too many messages. Try again later." });
  }

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const message = clean(body.message, LIMITS.message);

  if (!name || !EMAIL_RE.test(email) || message.length < 10) {
    return res.status(400).json({ success: false, message: "Missing or invalid fields" });
  }

  if (!(await passesTurnstile(clean(body.token, 2048), ip))) {
    return res.status(403).json({ success: false, message: "Verification failed" });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) {
    console.error("contact: RESEND_API_KEY or CONTACT_TO_EMAIL is not set");
    return res.status(500).json({ success: false, message: "Contact form is not configured" });
  }

  const from = process.env.CONTACT_FROM_EMAIL || "Portfolio <onboarding@resend.dev>";
  const subject = `Portfolio message from ${name}`;
  const text = `${message}\n\n— ${name} <${email}>`;
  const html = `<p>${escapeHtml(message).replace(/\n/g, "<br>")}</p><p>— ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>`;

  try {
    const response = await fetch(RESEND_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject, text, html }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      const detail = await response.json().catch(() => ({}));
      console.error("contact: Resend responded", response.status, detail);
      return res.status(502).json({ success: false, message: "Could not send" });
    }

    // Needs a verified sending domain; Resend's shared sender only reaches the account owner.
    if (process.env.CONTACT_AUTOREPLY === "true" && process.env.CONTACT_FROM_EMAIL) {
      await sendAutoreply({ apiKey, from, to: email, replyTo: to });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("contact: request to Resend failed", error);
    return res.status(502).json({ success: false, message: "Could not send" });
  }
}
