import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import site from "../content/site";
import { ease } from "../lib/motion";
import Turnstile from "./ui/Turnstile";

const turnstileSiteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY;

const field =
  "mt-2 block w-full rounded-md border border-line bg-raised px-3.5 py-3 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-moss focus:outline-none";
const label = "font-mono text-[11px] uppercase tracking-[0.16em] text-muted";

export default function Contact() {
  const reduce = useReducedMotion();
  const [status, setStatus] = useState("idle");
  const [problem, setProblem] = useState("");
  const challenge = useRef(null);

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));

    if (data._honey) {
      setStatus("sent");
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
      setStatus("sent");
    } catch (error) {
      challenge.current?.reset();
      setProblem(error.message === "busy" ? "That's a lot of messages in a short time." : "That didn't go through.");
      setStatus("error");
    }
  }

  const swap = reduce
    ? {}
    : {
        initial: { opacity: 0, y: 8 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -8 },
        transition: { duration: 0.35, ease },
      };

  return (
    <div className="grid gap-12 md:grid-cols-[minmax(0,1fr)_16rem] md:gap-16">
      <AnimatePresence mode="wait" initial={false}>
        {status === "sent" ? (
          <motion.div
            key="sent"
            {...swap}
            role="status"
            className="rounded-md border border-line bg-raised p-8"
          >
            <p className="font-display text-2xl tracking-tight text-ink">Thanks, it's on its way.</p>
            <p className="mt-3 text-muted">
              Your message is in my inbox. I'll reply to the address you gave.
            </p>
            <button type="button" className="btn btn-quiet mt-6" onClick={() => setStatus("idle")}>
              Send another
            </button>
          </motion.div>
        ) : (
          <motion.form key="form" {...swap} onSubmit={onSubmit} className="grid gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="block">
                <span className={label}>Name</span>
                <input className={field} name="name" autoComplete="name" required maxLength={120} />
              </label>
              <label className="block">
                <span className={label}>Email</span>
                <input
                  className={field}
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  maxLength={200}
                />
              </label>
            </div>
            <label className="block">
              <span className={label}>Message</span>
              <textarea
                className={`${field} min-h-40 resize-y`}
                name="message"
                required
                minLength={10}
                maxLength={5000}
              />
            </label>
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
                <p role="alert" className="text-sm text-muted">
                  {problem} Email me at{" "}
                  <a className="text-link" href={`mailto:${site.email}`}>
                    {site.email}
                  </a>
                  .
                </p>
              ) : null}
            </div>
          </motion.form>
        )}
      </AnimatePresence>

      <aside className="space-y-6 text-sm md:border-l md:border-line md:pl-8">
        <div>
          <p className={label}>Email</p>
          <a className="text-link mt-2 inline-block break-all text-ink" href={`mailto:${site.email}`}>
            {site.email}
          </a>
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
