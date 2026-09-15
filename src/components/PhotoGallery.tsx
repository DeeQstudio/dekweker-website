"use client";

import Image from "next/image";
import { useRef, useState } from "react";

export type GalleryPhoto = { src: string; title: string; caption?: string };

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState(0);
  const dialog = useRef<HTMLDialogElement>(null);
  const current = photos[active];
  function move(amount: number) { setActive((value) => (value + amount + photos.length) % photos.length); }
  if (!current) return null;
  return <>
    <div className="photo-gallery">
      {photos.map((photo, index) => <button className="photo-print" type="button" key={photo.src} onClick={(event) => { event.currentTarget.focus(); setActive(index); dialog.current?.showModal(); }} aria-label={`Vergroot: ${photo.title}`}>
        <span className="photo-print-image"><Image src={photo.src} alt={photo.title} fill sizes="(max-width: 700px) 90vw, 44vw" /></span>
        <span className="photo-print-caption"><strong>{photo.title}</strong><small>{photo.caption ?? "Foto vergroten"}</small></span>
      </button>)}
    </div>
    <dialog ref={dialog} className="photo-dialog" aria-label="Fotogalerij" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={(event) => {
      if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
    }}>
      <div className="photo-dialog-toolbar"><span aria-live="polite">{active + 1} van {photos.length}</span><button type="button" onClick={() => dialog.current?.close()}>Sluiten</button></div>
      <div className="photo-dialog-image"><Image key={current.src} src={current.src} alt={current.title} fill sizes="95vw" /></div>
      <div className="photo-dialog-footer"><button type="button" onClick={() => move(-1)}>Vorige</button><p aria-live="polite">{current.title}<small>{current.caption}</small></p><button type="button" onClick={() => move(1)}>Volgende</button></div>
    </dialog>
  </>;
}
