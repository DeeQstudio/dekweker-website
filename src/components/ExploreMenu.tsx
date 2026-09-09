"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const destinations = [
  { title: "Muziek", href: "/muziek", caption: "Releases & samenwerkingen" },
  { title: "Live", href: "/live", caption: "Shows & livearchief" },
  { title: "Media", href: "/media", caption: "Foto’s, clips & interviews" },
  { title: "De Kweker", href: "/de-kweker", caption: "Joey De Queecker · Brugge" },
  { title: "Booking", href: "/booking", caption: "Optredens, features & pers" }
];

export function ExploreMenu({ images }: { images: string[] }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const pathname = usePathname();
  const [active, setActive] = useState(0);
  useEffect(() => { dialog.current?.close(); }, [pathname]);
  return <>
    <button type="button" className="explore-trigger" onClick={() => dialog.current?.showModal()} aria-haspopup="dialog">Menu<span aria-hidden="true" className="menu-glyph"><i /><i /></span></button>
    <dialog ref={dialog} className="explore-dialog" aria-label="Verken De Kweker">
      <div className="explore-top"><Link href="/" className="wordmark" onClick={() => dialog.current?.close()}>DE KWEKER</Link><button type="button" onClick={() => dialog.current?.close()}>Sluiten</button></div>
      <div className="explore-body"><nav aria-label="Verken de website">{destinations.map((item, index) => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined} onMouseEnter={() => setActive(index)} onFocus={() => setActive(index)} onClick={() => dialog.current?.close()} data-active={index === active}>{item.title}</Link>)}</nav>
        <div className="explore-preview" aria-hidden="true">{destinations.map((item, index) => images[index] ? <Image key={item.href} src={images[index]!} alt="" fill sizes="(max-width: 760px) 1px, 40vw" className={index === active ? "is-active" : ""} /> : null)}<span>{destinations[active]?.caption}</span></div>
      </div>
      <div className="explore-bottom"><span>West-Vlaamse rap uit Brugge</span><a href="mailto:info@kwkr.be">info@kwkr.be</a></div>
    </dialog>
  </>;
}
