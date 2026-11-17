import { useSyncExternalStore } from "react";
import site from "../../content/site";

const format = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: site.timeZone.id,
});

function subscribe(onChange) {
  let timer;
  const schedule = () => {
    timer = setTimeout(() => {
      onChange();
      schedule();
    }, 60000 - (Date.now() % 60000) + 50);
  };
  schedule();
  return () => clearTimeout(timer);
}

const currentMinute = () => Math.floor(Date.now() / 60000);

/** "12:13 PM in Florida", ticking once a minute on the minute. */
export default function LocalTime({ className = "" }) {
  // null in the pre-rendered HTML: the build doesn't know the visitor's time.
  const minute = useSyncExternalStore(subscribe, currentMinute, () => null);
  const now = minute == null ? null : new Date(minute * 60000);

  return (
    <span className={`inline-flex items-center gap-2 ${now ? "" : "invisible"} ${className}`}>
      <span aria-hidden="true" className="live-dot size-1.5 rounded-full bg-moss" />
      <time dateTime={now?.toISOString()}>
        {now ? format.format(now) : "12:00 PM"} in {site.timeZone.place}
      </time>
    </span>
  );
}
