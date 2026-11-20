import { useEffect, useState } from "react";
import site from "../../content/site";

/**
 * Copies the email address. The button's own label changes to say it worked
 * (or that it didn't, with the address), and a polite live region repeats it
 * for screen readers.
 */
export default function CopyEmail({ className = "btn btn-quiet" }) {
  const [state, setState] = useState("idle");

  useEffect(() => {
    if (state === "idle") return undefined;
    const timer = setTimeout(() => setState("idle"), 2400);
    return () => clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setState("copied");
    } catch {
      setState("failed");
    }
  };

  const text = { idle: "Copy email", copied: "Copied", failed: "Couldn't copy" }[state];

  return (
    <>
      <button type="button" className={className} onClick={copy} title={site.email}>
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.4">
          {state === "copied" ? (
            <path d="M3 8.5l3 3 7-7" strokeLinecap="round" strokeLinejoin="round" />
          ) : (
            <>
              <rect x="5" y="5" width="8.5" height="8.5" rx="1.5" />
              <path d="M10.5 5V3.5A1.5 1.5 0 009 2H3.5A1.5 1.5 0 002 3.5V9a1.5 1.5 0 001.5 1.5H5" />
            </>
          )}
        </svg>
        {text}
      </button>
      <span role="status" className="sr-only">
        {state === "copied" ? `Copied ${site.email}` : state === "failed" ? `Couldn't copy. The address is ${site.email}` : ""}
      </span>
    </>
  );
}
