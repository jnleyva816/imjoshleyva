import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import pdf from "../assets/JoshuaLeyvaResume.pdf";
import site from "../content/site";
import projects from "../data/projectsData";
import { ease } from "../lib/motion";
import { homeHref, projectHref } from "../lib/paths";
import { useTheme } from "../lib/theme";
import { OPEN_EVENT, shortcutLabel } from "../lib/commandMenu";

function go(href) {
  const target = homeHref(href);
  if (target.startsWith("#")) {
    document.querySelector(target)?.scrollIntoView({ behavior: "smooth" });
    history.replaceState(null, "", target);
  } else {
    window.location.assign(target);
  }
}

const open = (href) => window.open(href, "_blank", "noopener,noreferrer");

function useCommands(toggleTheme, isDarkMode, setNote) {
  return useMemo(
    () => [
      ...site.nav
        .filter((item) => !item.external)
        .map((item) => ({ group: "Go to", label: item.label, run: () => go(item.href) })),
      { group: "Pages", label: "Résumé", hint: "/resume", run: () => window.location.assign("/resume") },
      ...projects
        .filter((project) => project.caseStudy)
        .map((project) => ({
          group: "Pages",
          label: `Case study: ${project.title}`,
          run: () => window.location.assign(projectHref(project)),
        })),
      {
        group: "Actions",
        label: "Copy email address",
        hint: site.email,
        keep: true,
        run: async () => {
          try {
            await navigator.clipboard.writeText(site.email);
            setNote("Copied. It's on your clipboard.");
          } catch {
            setNote(`Couldn't copy. It's ${site.email}`);
          }
        },
      },
      { group: "Actions", label: "Email me", run: () => window.location.assign(`mailto:${site.email}`) },
      {
        group: "Actions",
        label: "Download résumé (PDF)",
        run: () => {
          const link = Object.assign(document.createElement("a"), { href: pdf, download: "JoshuaLeyvaResume.pdf" });
          link.click();
        },
      },
      {
        group: "Actions",
        label: isDarkMode ? "Switch to light mode" : "Switch to dark mode",
        keywords: "theme dark light",
        run: () => toggleTheme(),
      },
      ...site.social.map((item) => ({ group: "Links", label: item.label, external: true, run: () => open(item.href) })),
    ],
    [toggleTheme, isDarkMode, setNote],
  );
}

// "resume" finds "Résumé".
const fold = (text) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

const matches = (command, query) => {
  if (!query) return true;
  const haystack = fold(`${command.label} ${command.group} ${command.keywords ?? ""}`);
  return fold(query)
    .split(/\s+/)
    .every((word) => haystack.includes(word));
};

// null until the menu first opens, then whether /api/ask has a model behind it.
function useAskReady(isOpen) {
  const [ready, setReady] = useState(null);
  useEffect(() => {
    if (!isOpen || ready !== null) return;
    fetch("/api/ask")
      .then((response) => (response.ok ? response.json() : { configured: false }))
      .then((data) => setReady(data.configured === true))
      .catch(() => setReady(false));
  }, [isOpen, ready]);
  return ready === true;
}

async function fetchAnswer(question) {
  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await response.json().catch(() => ({}));
    if (response.ok && data.answer) return { status: "done", text: data.answer };
    return { status: "error", text: data.message || "Couldn't get an answer right now." };
  } catch {
    return { status: "error", text: "Couldn't reach the site. Check your connection." };
  }
}

export default function CommandMenu({ startOpen = false }) {
  const reduce = useReducedMotion();
  const { toggleTheme, isDarkMode } = useTheme();
  const [isOpen, setOpen] = useState(startOpen);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [note, setNote] = useState("");
  const input = useRef(null);
  const list = useRef(null);
  const returnFocus = useRef(startOpen ? document.activeElement : null);

  const [answer, setAnswer] = useState(null);
  const askReady = useAskReady(isOpen);
  const commands = useCommands(toggleTheme, isDarkMode, setNote);
  const question = query.trim();
  const ask = async () => {
    setAnswer({ question, status: "loading", text: "" });
    const result = await fetchAnswer(question);
    setAnswer((current) => (current?.question === question ? { question, ...result } : current));
  };
  const results = [
    ...commands.filter((command) => matches(command, query)),
    ...(askReady && question.length >= 3
      ? [{ group: "Ask", label: `Ask about Josh: “${question}”`, hint: "AI", keep: true, run: ask }]
      : []),
  ];
  const current = Math.min(active, Math.max(results.length - 1, 0));

  const show = useCallback(() => {
    returnFocus.current = document.activeElement;
    setQuery("");
    setActive(0);
    setNote("");
    setAnswer(null);
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    returnFocus.current?.focus?.();
  }, []);

  useEffect(() => {
    const onKey = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (isOpen) close();
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_EVENT, show);
    };
  }, [isOpen, show, close]);

  useEffect(() => {
    if (isOpen) input.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    list.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [current, isOpen]);

  const run = async (command) => {
    if (!command) return;
    if (!command.keep) close();
    await command.run();
  };

  const onKeyDown = (event) => {
    if (event.key === "ArrowDown" || (event.key === "Tab" && !event.shiftKey)) {
      event.preventDefault();
      setActive((current + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp" || (event.key === "Tab" && event.shiftKey)) {
      event.preventDefault();
      setActive((current - 1 + results.length) % Math.max(results.length, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      run(results[current]);
    } else if (event.key === "Escape") {
      event.preventDefault();
      close();
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <m.div
          key="command-menu"
          className="fixed inset-0 z-[60] flex items-start justify-center bg-paper/60 px-4 pt-[14vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.18 }}
          onMouseDown={(event) => event.target === event.currentTarget && close()}
        >
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Command menu"
            className="w-full max-w-lg overflow-hidden rounded-xl border border-line bg-raised shadow-[0_30px_80px_-30px_rgba(27,25,22,0.45)]"
            initial={reduce ? false : { opacity: 0, y: -8, scale: 0.98, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={reduce ? undefined : { opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.22, ease }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span aria-hidden="true" className="font-mono text-sm text-muted">
                ›
              </span>
              <input
                ref={input}
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setActive(0);
                  setNote("");
                  setAnswer(null);
                }}
                onKeyDown={onKeyDown}
                placeholder={askReady ? "Jump somewhere, or ask anything about me…" : "Jump to a section, copy my email, switch theme…"}
                className="h-14 w-full bg-transparent text-base text-ink placeholder:text-muted/70 focus:outline-none"
                role="combobox"
                aria-expanded="true"
                aria-controls="command-list"
                aria-activedescendant={results.length ? `command-${current}` : undefined}
                aria-autocomplete="list"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden shrink-0 rounded border border-line px-1.5 py-0.5 font-mono text-[10px] text-muted sm:block">
                Esc
              </kbd>
            </div>

            {answer ? (
              <div className="max-h-[50vh] overflow-y-auto px-5 py-4" aria-live="polite" aria-busy={answer.status === "loading"}>
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted">You asked</p>
                <p className="mt-1 text-[0.95rem] text-ink">{answer.question}</p>
                <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-moss">Answer</p>
                {answer.status === "loading" ? (
                  <p className="mt-1 text-[0.95rem] text-muted">
                    <span className="live-dot mr-2 inline-block size-1.5 rounded-full bg-moss align-middle" aria-hidden="true" />
                    Reading the site…
                  </p>
                ) : (
                  <p className={`mt-1 whitespace-pre-line text-[0.95rem] leading-relaxed ${answer.status === "error" ? "text-muted" : "text-ink"}`}>
                    {answer.text}
                  </p>
                )}
                <p className="mt-4 text-xs text-muted">
                  Written by an AI from what's on this site, so it can be wrong. For anything important,{" "}
                  <a className="text-link" href={`mailto:${site.email}`}>
                    email me
                  </a>
                  .
                </p>
              </div>
            ) : null}

            <ul ref={list} id="command-list" hidden={Boolean(answer)} role="listbox" aria-label="Commands" className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-3 py-6 text-center text-sm text-muted">Nothing matches “{query}”.</li>
              ) : null}
              {results.map((command, index) => {
                const heading = command.group !== results[index - 1]?.group ? command.group : null;
                const selected = index === current;
                return (
                  <li key={`${command.group}-${command.label}`} role="presentation">
                    {heading ? (
                      <p className="px-3 pb-1 pt-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted first:pt-1">
                        {heading}
                      </p>
                    ) : null}
                    <div
                      id={`command-${index}`}
                      role="option"
                      aria-selected={selected}
                      onMouseMove={() => setActive(index)}
                      onClick={() => run(command)}
                      className={`flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2.5 text-[0.95rem] transition-colors ${
                        selected ? "bg-moss/10 text-ink" : "text-muted"
                      }`}
                    >
                      <span>{command.label}</span>
                      <span className="truncate font-mono text-[11px] text-muted">
                        {command.hint ?? (command.external ? "↗" : "")}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] text-muted">
              <span role="status">{note || "↑↓ to move · Enter to choose"}</span>
              <span>{shortcutLabel}</span>
            </div>
          </m.div>
        </m.div>
      ) : null}
    </AnimatePresence>
  );
}
