import type { Metadata } from "next";
import { ReleaseCard } from "@/components/ReleaseCard";
import { RecordExplorer } from "@/components/RecordExplorer";
import { getReleases } from "@/lib/content/repository";
import { isFeatureAppearanceForSiteArtist, isPrimaryReleaseForSiteArtist } from "@/lib/content/release-credit";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Muziek",
  path: "/muziek",
  description: "Officiële muziek van De Kweker uit Brugge: eigen releases en tracks waarop hij als feature te horen is."
});

export default async function MusicPage() {
  const releases = await getReleases();
  const ownReleases = releases.filter(isPrimaryReleaseForSiteArtist);
  const features = releases.filter(isFeatureAppearanceForSiteArtist);

  return (
    <div className="page-shell music-experience-page">
      <header className="page-hero music-page-hero" data-scroll-scene>
        <div data-reveal>
          <p className="eyebrow eyebrow-accent">Discografie</p>
          <h1 className="page-title">MUZIEK.</h1>
          <p className="page-intro">Van Moed(ig)er tot Lekt Em. De eigen tracks van De Kweker en de samenwerkingen.</p>
        </div>
      </header>

      <section className="record-experience-section" aria-label="Interactieve discografie"><RecordExplorer releases={ownReleases} /></section>

      <section className="page-content catalog-block">
        <div className="catalog-heading" data-reveal>
          <div><h2>EIGEN RELEASES.</h2></div>
        </div>
        <div className="catalog-grid" data-reveal>
          {ownReleases.map((release, index) => <ReleaseCard key={release.slug} release={release} priority={index < 2} />)}
        </div>
      </section>

      {features.length ? (
        <section className="page-content catalog-block catalog-secondary">
          <div className="catalog-heading" data-reveal>
            <div><p className="eyebrow">Features</p><h2>OOK TE HOREN OP.</h2></div>
          </div>
          <div className="catalog-grid catalog-grid-features" data-reveal>
            {features.map((release) => <ReleaseCard key={release.slug} release={release} />)}
          </div>
        </section>
      ) : null}
    </div>
  );
}
