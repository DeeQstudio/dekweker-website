"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState, type CSSProperties } from "react";
import type { Release } from "@/lib/content/types";
import { fullReleaseCredit } from "@/lib/content/release-credit";
import { VideoDialog } from "./VideoDialog";

export function RecordExplorer({ releases }: { releases: Release[] }) {
  const [active, setActive] = useState(0);
  const [credits, setCredits] = useState(false);
  const startX = useRef<number | null>(null);
  const current = releases[active];
  if (!current) return null;

  function select(index: number) {
    setActive((index + releases.length) % releases.length);
    setCredits(false);
  }

  return <div className="record-explorer">
    <div className="record-deck" aria-label="Blader door de releases" onTouchStart={(event) => { startX.current = event.touches[0]?.clientX ?? null; }} onTouchEnd={(event) => {
      const touch = event.changedTouches[0];
      if (startX.current === null || !touch) return;
      const distance = touch.clientX - startX.current;
      if (Math.abs(distance) > 55) select(active + (distance < 0 ? 1 : -1));
      startX.current = null;
    }}>
      {releases.map((release, index) => <button type="button" key={release.slug} className={`record-object${index === active ? " is-selected" : ""}${index === active && credits ? " is-flipped" : ""}`} style={{ "--record-offset": index - active, "--record-order": releases.length - Math.abs(index - active) } as CSSProperties} onClick={() => index === active ? setCredits(!credits) : select(index)} aria-label={index === active ? `${credits ? "Toon cover" : "Bekijk credits"} van ${release.title}` : `Selecteer ${release.title}`} aria-pressed={index === active}>
        <span className="record-sleeve">
          <span className="record-front">{release.coverImage ? <Image src={release.coverImage} alt={`Cover van ${release.title}`} fill sizes="(max-width: 760px) 72vw, 36vw" /> : <span>{release.title}</span>}</span>
          <span className="record-back" aria-hidden={!(index === active && credits)}><span>{release.title}</span><strong>{fullReleaseCredit(release)}</strong>{release.producer ? <span>Productie: {release.producer}</span> : null}<span>{release.releaseYear}</span><small>Klik om de cover te bekijken</small></span>
        </span>
      </button>)}
    </div>
    <div className="record-info" key={current.slug}>
      <p className="eyebrow">{current.kind} · {current.releaseYear}</p>
      <h2>{current.title}</h2>
      <p className="record-credit">{fullReleaseCredit(current)}{current.producer ? ` · Productie: ${current.producer}` : ""}</p>
      <div className="record-listen">{current.links.slice(0, 2).map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</div>
      <Link className="text-link" href={`/muziek/${current.slug}`}>Track, credits &amp; luisterlinks</Link>
      {current.videoUrl ? <VideoDialog url={current.videoUrl} title={current.title} /> : null}
      <button type="button" className="record-credit-toggle" onClick={() => setCredits(!credits)} aria-pressed={credits}>{credits ? "Cover bekijken" : "Hoes omdraaien"}</button>
    </div>
    <div className="record-selector" role="group" aria-label="Kies een release">
      {releases.map((release, index) => <button type="button" key={release.slug} aria-pressed={index === active} onClick={() => select(index)} onKeyDown={(event) => {
        if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
        event.preventDefault();
        const next = (index + (event.key === "ArrowRight" ? 1 : -1) + releases.length) % releases.length;
        select(next);
        (event.currentTarget.parentElement?.children[next] as HTMLButtonElement)?.focus();
      }}><span>{release.title}</span><small>{release.releaseYear}</small></button>)}
    </div>
    <span className="sr-only" aria-live="polite">Geselecteerd: {current.title}</span>
  </div>;
}
