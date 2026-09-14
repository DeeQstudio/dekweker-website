import Image from "next/image";
import Link from "next/link";
import type { Release } from "@/lib/content/types";
import { fullReleaseCredit, releaseRelationshipLabel } from "@/lib/content/release-credit";

export function ReleaseCard({ release, priority = false }: { release: Release; priority?: boolean }) {
  const relationship = releaseRelationshipLabel(release);
  const eyebrow = relationship === "feature" ? "Feature" : relationship === "appearance" ? "Appearance" : release.kind;

  return (
    <article className="release-card">
      <Link href={`/muziek/${release.slug}`} className="release-art" aria-label={`Open ${release.title}`}>
        {release.coverImage ? <Image src={release.coverImage} alt={`Cover van ${release.title}`} fill quality={90} sizes="(max-width: 560px) 90vw, (max-width: 760px) 44vw, (max-width: 1100px) 30vw, 320px" preload={priority} /> : <div className="release-art-fallback">8000</div>}
        <span className="release-index">{release.releaseYear}</span>
      </Link>
      <div className="release-card-copy">
        <p className="eyebrow">{eyebrow}</p>
        <h3><Link href={`/muziek/${release.slug}`}>{release.title}</Link></h3>
        <p>{fullReleaseCredit(release)}</p>
      </div>
    </article>
  );
}
