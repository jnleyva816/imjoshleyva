const RESEND_URL = "https://api.resend.com/emails";
const TURNSTILE_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 120, email: 200, message: 5000 };
const RATE = { max: 5, windowSeconds: 600 };

// Per-instance fallback when Redis isn't configured. Warm instances are
// reused, so this still slows a script down, but it isn't a global limit.
const recent = new Map();

function clientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  return (
    (typeof forwarded === "string" && forwarded.split(",")[0].trim()) ||
    req.headers["x-real-ip"] ||
    req.socket?.remoteAddress ||
    "unknown"
  );
}

async function countInRedis(key) {
  const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
  if (!url || !token) return null;
  try {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, RATE.windowSeconds, "NX"],
      ]),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error(`upstash_${response.status}`);
    const [incr] = await response.json();
    return Number(incr.result);
  } catch (error) {
    console.error("contact: rate limit store unavailable", error);
    return null;
  }
}

function countInMemory(key) {
  const now = Date.now();
  if (recent.size > 1000) {
    for (const [k, v] of recent) if (v.resetAt <= now) recent.delete(k);
  }
  const entry = recent.get(key);
  if (!entry || entry.resetAt <= now) {
    recent.set(key, { count: 1, resetAt: now + RATE.windowSeconds * 1000 });
    return 1;
  }
  entry.count += 1;
  return entry.count;
}

async function overLimit(ip) {
  const key = `contact:${ip}`;
  const count = (await countInRedis(key)) ?? countInMemory(key);
  return count > RATE.max;
}

async function passesTurnstile(token, ip) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) return true;
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

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true;
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false;
  }
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  if (!sameOrigin(req)) {
    return res.status(403).json({ success: false, message: "Forbidden" });
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
      return res
        .status(502)
        .json({ success: false, message: "Could not send", reason: detail.name || `resend_${response.status}` });
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
