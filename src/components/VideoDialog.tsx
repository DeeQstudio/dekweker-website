"use client";

import { useRef, useState } from "react";

export function VideoDialog({ url, title }: { url: string; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [playing, setPlaying] = useState(false);
  const youtubeId = new URL(url).searchParams.get("v");
  if (!youtubeId) return <a className="text-link" href={url} target="_blank" rel="noopener noreferrer">Bekijk de video</a>;
  return <>
    <a className="text-link video-dialog-trigger" href={url} target="_blank" rel="noopener noreferrer" onClick={(event) => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      event.currentTarget.focus();
      setPlaying(true);
      dialog.current?.showModal();
    }}>Bekijk de videoclip</a>
    <dialog className="video-dialog" ref={dialog} aria-label={`Videoclip: ${title}`} onClose={() => setPlaying(false)}>
      <div><span>{title}</span><button type="button" onClick={() => dialog.current?.close()}>Sluiten</button></div>
      {playing ? <iframe src={`https://www.youtube-nocookie.com/embed/${encodeURIComponent(youtubeId)}?autoplay=1&rel=0`} title={title} allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen /> : null}
    </dialog>
  </>;
}
