"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExploreMenu } from "./ExploreMenu";

const nav = [
  ["Muziek", "/muziek"],
  ["Live", "/live"],
  ["Media", "/media"],
  ["Profiel", "/de-kweker"]
] as const;

function isCurrentRoute(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ menuImages }: { menuImages: string[] }) {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link href="/" className="wordmark" aria-label="De Kweker home">
        DE KWEKER<sup>8000</sup>
      </Link>
      <nav className="desktop-nav" aria-label="Hoofdnavigatie">
        {nav.map(([label, href]) => (
          <Link key={href} href={href} aria-current={isCurrentRoute(pathname, href) ? "page" : undefined}>
            {label}
          </Link>
        ))}
      </nav>
      <div className="header-actions">
        <Link className="header-booking" href="/booking" aria-current={isCurrentRoute(pathname, "/booking") ? "page" : undefined}>
          Booking
        </Link>
        <ExploreMenu images={menuImages} />
      </div>
    </header>
  );
}
