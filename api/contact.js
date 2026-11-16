const RESEND_URL = "https://api.resend.com/emails";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LIMITS = { name: 120, email: 200, message: 5000 };

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

  const name = clean(body.name, LIMITS.name);
  const email = clean(body.email, LIMITS.email);
  const message = clean(body.message, LIMITS.message);

  if (!name || !EMAIL_RE.test(email) || message.length < 10) {
    return res.status(400).json({ success: false, message: "Missing or invalid fields" });
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

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("contact: request to Resend failed", error);
    return res.status(502).json({ success: false, message: "Could not send" });
  }
}
