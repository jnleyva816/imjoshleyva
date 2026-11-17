import { useEffect, useState } from "react";
import site from "../../content/site";

const format = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: site.timeZone.id,
});

/** "12:13 PM in Florida", ticking once a minute on the minute. */
export default function LocalTime({ className = "" }) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    let timer;
    const tick = () => {
      setNow(new Date());
      timer = setTimeout(tick, 60000 - (Date.now() % 60000) + 50);
    };
    timer = setTimeout(tick, 60000 - (Date.now() % 60000) + 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <span aria-hidden="true" className="live-dot size-1.5 rounded-full bg-moss" />
      <time dateTime={now.toISOString()}>
        {format.format(now)} in {site.timeZone.place}
      </time>
    </span>
  );
}
