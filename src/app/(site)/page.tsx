import Image from "next/image";
import Link from "next/link";
import { LiveStage } from "@/components/LiveStage";
import { RecordExplorer } from "@/components/RecordExplorer";
import { getArtist, getEvents, getPress, getReleases } from "@/lib/content/repository";
import { formatEventDateCompact } from "@/lib/content/events";
import { fullReleaseCredit, isFeatureAppearanceForSiteArtist, isPrimaryReleaseForSiteArtist } from "@/lib/content/release-credit";

import "./home.css";

export default async function HomePage() {
  const [artist, releases, events, press] = await Promise.all([
    getArtist(),
    getReleases(),
    getEvents(),
    getPress()
  ]);

  const own = releases.filter(isPrimaryReleaseForSiteArtist);
  const lead = own[0];
  const feature = releases.find(isFeatureAppearanceForSiteArtist);
  const dominus = events.find((event) => event.slug === "dominus-mma-iv-2025");
  const villaWest = events.find((event) => event.slug === "villa-west-de-kweker-friends-2026");
  const liveItems = events.slice(0, 5).map((event) => ({
    slug: event.slug,
    title: event.title,
    meta: `${event.venue} · ${event.city}`,
    date: formatEventDateCompact(event),
    status: event.appearanceType === "surprise" ? "Surprise" : event.status === "past" ? "Archief" : "Live",
    image: event.image
  }));

  return (
    <div className="home-page">
      <section className="home-hero" data-scroll-scene>
        <div className="home-hero-media" data-depth="12">
          <Image src={artist.heroImage} alt="De Kweker in Brugge" fill preload sizes="(max-width: 1100px) 160vh, 100vw" />
        </div>
        <div className="home-hero-shade" aria-hidden="true" />
        <div className="home-hero-inner">
          <div className="home-hero-main" data-reveal>
            <p className="eyebrow eyebrow-accent">West-Vlaamse rap uit Brugge</p>
            <h1 className="home-hero-title"><span>DE</span><span>KWEKER</span></h1>
            <p className="home-hero-lede">8000 zonder vertaling.</p>
            <div className="hero-actions">
              <a className="hero-listen" href="#muziek">Beluister de muziek</a>
              <Link className="text-link" href="/booking">Een optreden boeken</Link>
            </div>
          </div>
          <div className="hero-bottomline">
            <span>Eigen taal.<br /><strong>Eigen verhaal.</strong></span>
            {lead ? <Link className="hero-record" href={`/muziek/${lead.slug}`}>
              {lead.coverImage ? <Image src={lead.coverImage} alt="" width={52} height={52} /> : null}
              <span><small>Al gehoord?</small><strong>{lead.title}</strong></span>
            </Link> : null}
          </div>
        </div>
      </section>

      <section className="home-music" id="muziek" aria-labelledby="home-music-title">
        <div className="music-section-top"><h2 id="home-music-title">De muziek</h2><Link className="text-link" href="/muziek">Alle releases</Link></div>
        <RecordExplorer releases={own} />
        {feature ? <div className="home-feature" data-reveal>
          <p className="eyebrow">Ook te horen op</p>
          <Link href={`/muziek/${feature.slug}`}>
            {feature.coverImage ? <Image src={feature.coverImage} alt="" width={56} height={56} /> : null}
            <span><strong>{feature.title}</strong><small>{fullReleaseCredit(feature)}</small></span>
          </Link>
          <span className="eyebrow">{feature.releaseYear}</span>
        </div> : null}
      </section>

      <section className="section section-live">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow eyebrow-accent">Op het podium</p><h2>DE KWEKER<br /><span className="live-title-accent">LIVE.</span></h2></div>
          <div className="section-heading-aside"><p>Van Café Bambino tot Dominus. Bekijk de optredens, gastshows en foto’s van de voorbije avonden.</p><Link className="text-link" href="/live">Het livearchief</Link></div>
        </div>
        <LiveStage events={liveItems} />
        <div className="live-booking-line"><p>De Kweker op jouw podium?</p><Link className="text-link" href="/booking">Praktisch &amp; booking</Link></div>
      </section>

      <section className="bio-scene" data-scroll-scene>
        <div className="bio-scene-media" data-depth="16">
          <Image src={artist.portraitImage} alt="Portret van De Kweker" fill sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
        <div className="bio-scene-copy" data-reveal>
          <p className="eyebrow eyebrow-accent">Joey De Queecker</p>
          <blockquote>8000<br /><span>ZIT ERIN.</span></blockquote>
          <p>{artist.shortBio}</p>
          <Link className="text-link" href="/de-kweker">Wie is De Kweker?</Link>
        </div>
      </section>

      <section className="section media-section">
        <div className="section-heading" data-reveal>
          <div><p className="eyebrow eyebrow-accent">Foto’s, clips &amp; pers</p><h2>IN BEELD.</h2></div>
          <div className="section-heading-aside"><Link className="text-link" href="/media">Alle beelden en artikels</Link></div>
        </div>
        <div className="media-collage" data-scroll-scene>
          {dominus?.image ? (
            <Link className="media-shot media-shot-live" href={`/live/${dominus.slug}`} data-depth="20">
              <Image src={dominus.image} alt={`De Kweker live tijdens ${dominus.title}`} fill sizes="(max-width: 900px) 100vw, 47vw" />
              <span>Live · {formatEventDateCompact(dominus)}</span>
            </Link>
          ) : null}
          {villaWest?.image ? (
            <Link className="media-shot media-shot-poster" href={`/live/${villaWest.slug}`} data-depth="12">
              <Image src={villaWest.image} alt={`Affiche van ${villaWest.title}`} fill sizes="(max-width: 900px) 48vw, 24vw" />
              <span>{villaWest.title}</span>
            </Link>
          ) : null}
          {press[0]?.image ? (
            <a className="media-shot media-shot-press" href={press[0].url} target="_blank" rel="noopener noreferrer" data-depth="17">
              <Image src={press[0].image} alt="Persfoto De Kweker" fill sizes="(max-width: 900px) 48vw, 25vw" />
              <span>Pers</span>
            </a>
          ) : null}
        </div>
      </section>

      <section className="home-booking">
        <div className="home-booking-intro"><h2>DE KWEKER<br />OP DE AFFICHE?</h2><div><p>Voor een optreden, een feature of een interview: je mail komt rechtstreeks bij De Kweker terecht.</p><Link className="text-link" href="/booking">Booking &amp; contact</Link></div></div>
        <a className="home-booking-address" href="mailto:info@kwkr.be">info@kwkr.be</a>
      </section>
    </div>
  );
}
