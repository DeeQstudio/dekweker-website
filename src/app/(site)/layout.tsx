import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { RouteTransition } from "@/components/RouteTransition";
import { SiteIntro } from "@/components/SiteIntro";
import { SiteMotion } from "@/components/SiteMotion";
import { ExperienceMotion } from "@/components/ExperienceMotion";
import { getArtist, getEvents, getReleases } from "@/lib/content/repository";
import { artistEntityGraph } from "@/lib/seo/schema";

export default async function SiteLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const [artist, events, releases] = await Promise.all([getArtist(), getEvents(), getReleases()]);
  const liveImage = events.find((event) => event.slug === "dominus-mma-iv-2025")?.image ?? artist.heroImage;
  const menuImages = [releases.find((release) => release.slug === "lekt-em")?.coverImage ?? artist.heroImage, liveImage, artist.pressImage, artist.portraitImage, liveImage];

  return (
    <>
      <JsonLd data={artistEntityGraph(artist)} />
      <SiteIntro />
      <RouteTransition />
      <SiteMotion />
      <ExperienceMotion />
      <a className="skip-link" href="#main-content">Ga naar inhoud</a>
      <Header menuImages={menuImages} />
      <main id="main-content" tabIndex={-1}>{children}</main>
      <Footer />
    </>
  );
}
