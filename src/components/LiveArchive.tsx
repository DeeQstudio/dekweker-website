"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { LiveEvent } from "@/lib/content/types";
import { formatEventDateCompact } from "@/lib/content/events";

export function LiveArchive({ events }: { events: LiveEvent[] }) {
  const [year, setYear] = useState("Alles");
  const [active, setActive] = useState(events[0]?.slug);
  const years = ["Alles", ...new Set(events.map((event) => event.startDate.slice(0, 4)))];
  const filtered = events.filter((event) => year === "Alles" || event.startDate.startsWith(year));
  const selected = filtered.find((event) => event.slug === active) ?? filtered[0];
  return <div className="live-archive">
    <div className="archive-heading"><h2>Livearchief</h2><div className="archive-filters" role="group" aria-label="Filter optredens op jaar">{years.map((item) => <button type="button" key={item} aria-pressed={year === item} onClick={() => setYear(item)}>{item}</button>)}</div></div>
    <div className="archive-body">
      <div className="archive-preview">{selected?.image ? <Image key={selected.slug} src={selected.image} alt={`De Kweker tijdens ${selected.title}`} fill sizes="(max-width: 760px) 90vw, 44vw" /> : null}<p>{selected?.venue}<span>{selected?.city}</span></p></div>
      <div className="archive-rows">{filtered.map((event) => <Link key={event.slug} href={`/live/${event.slug}`} className={selected?.slug === event.slug ? "is-active" : ""} onMouseEnter={() => setActive(event.slug)} onFocus={() => setActive(event.slug)}><time dateTime={event.startDate}>{formatEventDateCompact(event)}</time><h3>{event.title}</h3><span>{event.venue} · {event.city}</span></Link>)}</div>
    </div><span className="sr-only" role="status">{filtered.length} optredens weergegeven</span>
  </div>;
}
