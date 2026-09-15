import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { getArtist, getEvents, getPress, getReleases } from "@/lib/content/repository";
import { isPrimaryReleaseForSiteArtist } from "@/lib/content/release-credit";
import { profilePageSchema } from "@/lib/seo/schema";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Over De Kweker | West-Vlaamse rapper uit Brugge",
  path: "/de-kweker",
  image: "/assets/social/og-de-kweker-1200x630.jpg",
  imageAlt: "De Kweker · Brugge 8000 · KWKR",
  description: "Officiële artiestenpagina van De Kweker, West-Vlaamse rapper uit Brugge (8000): bio, identiteit en geverifieerde kanalen."
});

export default async function ArtistPage() {
  const [artist, press, releases, events] = await Promise.all([getArtist(), getPress(), getReleases(), getEvents()]);
  const interview = press.find((item) => item.slug === "kw-interview");
  const ownReleases = releases.filter(isPrimaryReleaseForSiteArtist);
  const live = events.find((event) => event.slug === "dominus-mma-iv-2025");
  return (
    <div className="page-shell artist-page">
      <JsonLd data={profilePageSchema(artist)} />
      <section className="profile-hero">
        <div className="profile-hero-media" data-depth="23"><Image src={artist.heroImage} alt="De Kweker in Brugge" fill priority sizes="100vw" /></div>
        <div className="profile-hero-overlay" aria-hidden="true" />
        <div className="profile-hero-copy"><p className="eyebrow eyebrow-accent">De Kweker / Brugge 8000</p><h1>DE<br />KWEKER.</h1><p>{artist.tagline}</p></div>
      </section>

      <section className="artist-biography" aria-labelledby="artist-name">
        <figure className="artist-portrait">
          <div><Image src={artist.portraitImage} alt="Portret van Joey De Queecker, De Kweker" fill sizes="(max-width: 760px) 86vw, 40vw" /></div>
          <figcaption>De Kweker <span>Brugge, België</span></figcaption>
        </figure>
        <div className="artist-introduction">
          <p className="artist-label">Achter de artiestennaam</p>
          <h2 id="artist-name">Joey<br />De Queecker</h2>
          <p className="artist-lead">De Kweker schrijft en rapt in het West-Vlaams. Zijn thuisstad Brugge hoor je terug in zijn taal en zijn verhalen.</p>
          <div className="artist-biography-detail">
            <p>Persoonlijke tracks en harde observaties. Onder de naam De Kweker brengt Joey De Queecker muziek in het Brugs, met 8000 als verwijzing naar zijn thuisstad.</p>
            {interview ? <a className="artist-interview" href={interview.url} target="_blank" rel="noopener noreferrer"><span>Het gesprek met</span><strong>{interview.publisher}</strong><span className="artist-inline-link">Lees het interview</span></a> : null}
          </div>
        </div>
      </section>

      <section className="artist-records" aria-labelledby="artist-records-title">
        <div className="artist-records-heading"><h2 id="artist-records-title">De muziek</h2><p>Eigen releases en samenwerkingen met onder anderen King Skam, P@FF1 en Den Onbekenden Soldaat.</p></div>
        <div className="artist-record-shelf">
          {ownReleases.map((release) => <Link className="artist-record" key={release.slug} href={`/muziek/${release.slug}`}>
            <div className="artist-record-cover">{release.coverImage ? <Image src={release.coverImage} alt={`Cover van ${release.title}`} fill sizes="(max-width: 760px) 42vw, 23vw" /> : null}</div>
            <h3>{release.title}</h3><span>{release.releaseYear}</span>
          </Link>)}
        </div>
        <Link className="artist-inline-link" href="/muziek">De volledige discografie</Link>
      </section>

      <section className="artist-live" aria-labelledby="artist-live-title">
        <div className="artist-live-copy"><p className="artist-label">De Kweker live</p><h2 id="artist-live-title">Op het<br />podium</h2><p>Van Villa Bota en De Kelk in Brugge tot Café Bambino in Roeselare en de Koninklijke Stallingen in Oostende.</p><Link className="artist-inline-link" href="/live">Optredens &amp; livebeelden</Link></div>
        {live?.image ? <Link className="artist-live-image" href={`/live/${live.slug}`}><Image src={live.image} alt={`De Kweker tijdens ${live.title}`} fill sizes="(max-width: 760px) 100vw, 65vw" /><span>{live.title}<small>{live.city}, {new Date(live.startDate).getUTCFullYear()}</small></span></Link> : null}
      </section>

      <section className="artist-connections" aria-labelledby="artist-connections-title">
        <div><h2 id="artist-connections-title">De Kweker online</h2><p>Voor een optreden, feature of persaanvraag: <Link href="/booking">booking &amp; contact</Link>.</p></div>
        <div className="artist-socials">{artist.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</div>
      </section>
    </div>
  );
}
