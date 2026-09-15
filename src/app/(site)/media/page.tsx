import Image from "next/image";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PhotoGallery } from "@/components/PhotoGallery";
import { ClipPlayer } from "@/components/ClipPlayer";
import { getArtist, getEvents, getPress, getVideos, getReleases } from "@/lib/content/repository";
import { formatEventDate } from "@/lib/content/events";
import { videoSchema } from "@/lib/seo/schema";
import { pageMetadata } from "@/lib/seo/site";

export const metadata: Metadata = pageMetadata({
  title: "Media & pers",
  path: "/media",
  description: "Pers, interviews, videoclips, livebeelden en officiële profielen van De Kweker uit Brugge."
});

export default async function MediaPage() {
  const [artist, events, press, videos, releases] = await Promise.all([getArtist(), getEvents(), getPress(), getVideos(), getReleases()]);
  const mediaLead = events.find((event) => event.slug === "wijklanken-plukketuffer-2026");
  return (
    <div className="page-shell">
      {videos.map((video) => <JsonLd key={video.slug} data={videoSchema(video)} />)}
      <header className="page-hero index-hero">
        <div><p className="eyebrow eyebrow-accent">Media</p><h1 className="page-title">BEELD.<br />PERS.</h1><p className="page-intro">Videoclips, livebeelden, interviews en officiële kanalen.</p></div>
      </header>

      {mediaLead?.image ? (
        <section className="media-lead-grid">
          <div className="media-lead-photo" data-depth="24"><Image src={mediaLead.image} alt={`De Kweker live tijdens ${mediaLead.title}`} fill priority sizes="(max-width: 900px) 100vw, 58vw" /></div>
          <div className="media-lead-copy"><p className="eyebrow eyebrow-accent">{formatEventDate(mediaLead)}</p><h2>WIJKLANKEN.</h2><p>{mediaLead.description}</p></div>
        </section>
      ) : null}

      <section className="page-content gallery-section"><div className="catalog-heading"><h2>Beeldarchief</h2><p>Open een beeld om het op groot formaat te bekijken.</p></div><PhotoGallery photos={[{ src: artist.portraitImage, title: "De Kweker", caption: "Portret · Brugge" }, ...events.filter((event) => event.image && event.slug !== "villa-west-de-kweker-friends-2026").slice(0, 3).map((event) => ({ src: event.image!, title: event.title, caption: `${event.venue} · ${event.city}` }))]} /></section>

      <section className="page-content">
        <div className="catalog-heading"><div><p className="eyebrow">Video</p><h2>KIJK.</h2></div><p>Officiële clips en video’s waarin De Kweker te horen of te zien is.</p></div>
        <div className="video-grid">
          {videos.map((video) => (
            <article key={video.slug} className="video-card">
              <ClipPlayer video={video} cover={releases.find((release) => release.videoUrl?.includes(video.youtubeId))?.coverImage ?? artist.pressImage} title={video.title} />
              <div className="video-card-copy"><p className="eyebrow">Video</p><h3>{video.title}</h3></div>
            </article>
          ))}
        </div>
      </section>

      <section className="page-content media-press-section">
        <div className="catalog-heading"><div><p className="eyebrow">Pers</p><h2>GESCHREVEN.</h2></div><p>Interviews en artikels rond de muziek.</p></div>
        <div className="press-grid">
          {press[0] ? (
            <a className="press-lead" href={press[0].url} target="_blank" rel="noopener noreferrer">
              {press[0].image ? <Image src={press[0].image} alt="De Kweker in Krant van West-Vlaanderen" fill sizes="(max-width: 900px) 100vw, 62vw" /> : null}
              <div className="press-lead-copy"><p className="eyebrow">{press[0].publisher}</p><h3>{press[0].title}</h3><span className="text-link">Lees artikel</span></div>
            </a>
          ) : null}
          <div className="press-list">
            {press.slice(1).map((item) => <a className="press-item" key={item.slug} href={item.url} target="_blank" rel="noopener noreferrer"><span>{item.publisher}</span><strong>{item.title}</strong></a>)}
          </div>
        </div>
      </section>

      <section className="page-content media-channels">
        <div className="catalog-heading"><div><p className="eyebrow">Officieel</p><h2>KANALEN.</h2></div><p>De profielen die rechtstreeks bij De Kweker horen.</p></div>
        <div className="profile-links">{artist.links.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer">{link.label}</a>)}</div>
      </section>
    </div>
  );
}
