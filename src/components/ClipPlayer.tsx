"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { VideoItem } from "@/lib/content/types";

export function ClipPlayer({ video, cover, title }: { video: VideoItem; cover: string; title: string }) {
  const [playing, setPlaying] = useState(false);
  const trigger = useRef<HTMLAnchorElement>(null);
  const close = useRef<HTMLButtonElement>(null);

  function stopVideo() {
    setPlaying(false);
    requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
  }

  useEffect(() => {
    if (!playing) return;
    close.current?.focus({ preventScroll: true });
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPlaying(false);
        requestAnimationFrame(() => trigger.current?.focus({ preventScroll: true }));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [playing]);

  return (
    <div className={`clip-player${playing ? " is-playing" : ""}`}>
      {playing ? (
        <>
          <iframe src={`https://www.youtube-nocookie.com/embed/${video.youtubeId}?autoplay=1&rel=0`} title={video.title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
          <button ref={close} className="clip-close" onClick={stopVideo}>Sluit video <span aria-hidden="true">×</span></button>
        </>
      ) : (
        <a ref={trigger} href={`https://www.youtube.com/watch?v=${video.youtubeId}`} target="_blank" rel="noopener noreferrer" onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          event.preventDefault();
          setPlaying(true);
        }} aria-label={`Bekijk de videoclip van ${title}`}>
          <Image src={cover} alt={`Cover van ${title}`} fill sizes="(max-width: 760px) 92vw, 42vw" />
          <span className="clip-play"><span>Speel de videoclip</span><small>{title}</small></span>
        </a>
      )}
    </div>
  );
}
