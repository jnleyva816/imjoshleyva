import { useRef, useState } from "react";
import site from "../content/site";
import Turnstile from "./ui/Turnstile";
import CopyEmail from "./ui/CopyEmail";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const field =
  "mt-2 block w-full rounded-md border border-line bg-raised px-3.5 py-3 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-moss focus:outline-none aria-[invalid=true]:border-error";
const label = "font-mono text-[11px] uppercase tracking-[0.16em] text-muted";

function check({ name = "", email = "", message = "" }) {
  const errors = {};
  if (!name.trim()) errors.name = "Tell me your name.";
  if (!email.trim()) errors.email = "I need an email to reply to.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = "That email doesn't look right.";
  }
  if (message.trim().length < 10) errors.message = "Say a bit more, at least 10 characters.";
  return errors;
}

function Field({ id, text, error, children }) {
  return (
    <div className="block">
      <label htmlFor={id} className={label}>
        {text}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-sm font-medium text-error">
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4 shrink-0" fill="currentColor">
            <path d="M8 1.5a6.5 6.5 0 100 13 6.5 6.5 0 000-13zM7.25 4.5h1.5v4.5h-1.5V4.5zm0 6h1.5V12h-1.5v-1.5z" />
          </svg>
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default function Contact() {
  const [status, setStatus] = useState("idle");
  const [problem, setProblem] = useState("");
  const [errors, setErrors] = useState({});
  const challenge = useRef(null);

  const clear = (event) => {
    const { name } = event.target;
    if (errors[name]) setErrors((current) => ({ ...current, [name]: undefined }));
  };
  const aria = (name) => ({
    id: `contact-${name}`,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `contact-${name}-error` : undefined,
    onInput: clear,
  });

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    if (data._honey) {
      setStatus("sent");
      return;
    }

    const found = check(data);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      form.elements[first]?.focus();
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch(site.contact.endpoint, {
        method: "POST",
        signal: AbortSignal.timeout(20000),
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          message: data.message,
          token: data["cf-turnstile-response"],
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok || String(body.success) === "false") {
        throw new Error(res.status === 429 ? "busy" : "failed");
      }
      form.reset();
      swapTo("sent");
    } catch (error) {
      challenge.current?.reset();
      setProblem(error.message === "busy" ? "That's a lot of messages in a short time." : "That didn't go through.");
      setStatus("error");
    }
  }

  // Starts false so the pre-rendered form matches the first client render;
  // after that, swapping between form and thanks plays .swap-in.
  const [swapped, setSwapped] = useState(false);
  const swapTo = (next) => {
    setSwapped(true);
    setStatus(next);
  };

  return (
    <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-16">
      {status === "sent" ? (
        <div
          key="sent"
          role="status"
          className="swap-in rounded-md border border-line bg-raised p-8"
        >
          <p className="font-display text-2xl tracking-tight text-ink">Thanks, it's on its way.</p>
          <p className="mt-3 text-muted">
            Your message is in my inbox. I'll reply to the address you gave.
          </p>
          <button type="button" className="btn btn-quiet mt-6" onClick={() => swapTo("idle")}>
            Send another
          </button>
        </div>
      ) : (
        <form
          key="form"
          onSubmit={onSubmit}
          noValidate
          aria-busy={status === "sending"}
          className={`grid gap-6 ${swapped ? "swap-in" : ""}`}
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <Field id="contact-name" text="Name" error={errors.name}>
              <input
                className={field}
                name="name"
                autoComplete="name"
                required
                maxLength={120}
                {...aria("name")}
              />
            </Field>
            <Field id="contact-email" text="Email" error={errors.email}>
              <input
                className={field}
                type="email"
                name="email"
                autoComplete="email"
                required
                maxLength={200}
                {...aria("email")}
              />
            </Field>
          </div>
          <Field id="contact-message" text="Message" error={errors.message}>
            <textarea
              className={`${field} min-h-40 resize-y`}
              name="message"
              required
              maxLength={5000}
              {...aria("message")}
            />
          </Field>
          <input
            type="text"
            name="_honey"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="hidden"
          />
          {turnstileSiteKey ? <Turnstile siteKey={turnstileSiteKey} ref={challenge} /> : null}
          <div className="flex flex-wrap items-center gap-4">
            <button type="submit" className="btn btn-fill" disabled={status === "sending"}>
              {status === "sending" ? "Sending…" : "Send message"}
            </button>
            {status === "error" ? (
              <p role="alert" className="text-sm font-medium text-error">
                {problem} Email me at{" "}
                <a className="text-link" href={`mailto:${site.email}`}>
                  {site.email}
                </a>
                .
              </p>
            ) : null}
          </div>
        </form>
      )}

      <aside className="space-y-6 text-sm md:border-l md:border-line md:pl-8">
        <div>
          <p className={label}>Email</p>
          <a className="text-link mt-2 inline-block break-all text-ink" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <div className="mt-3">
            <CopyEmail className="btn btn-quiet px-3 py-2 text-[0.85rem]" />
          </div>
        </div>
        <div>
          <p className={label}>Elsewhere</p>
          <ul className="mt-2 space-y-1.5">
            {site.social.map((link) => (
              <li key={link.href}>
                <a className="text-link text-ink" href={link.href} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </div>
  );
}
