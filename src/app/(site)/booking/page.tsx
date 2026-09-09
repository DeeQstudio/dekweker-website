import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { getEvents } from "@/lib/content/repository";
import { pageMetadata } from "@/lib/seo/site";
import { BookingComposer } from "@/components/BookingComposer";

export const metadata: Metadata = pageMetadata({
  title: "De Kweker boeken | West-Vlaamse rapper uit Brugge",
  path: "/booking",
  description: "De Kweker boeken voor een clubshow, festival of support? Neem rechtstreeks contact op met de West-Vlaamse rapper uit Brugge. Ook voor features en pers."
});

export default async function BookingPage() {
  const bookingImage = (await getEvents()).find((event) => event.slug === "dominus-mma-iv-2025")?.image;
  return (
    <div className="page-shell booking-page">
      <section className="booking-page-hero" data-scroll-scene>
        {bookingImage ? <div className="booking-page-image" data-depth="26"><Image src={bookingImage} alt="De Kweker live op het podium" fill priority sizes="100vw" /></div> : null}
        <div className="booking-page-shade" aria-hidden="true" />
        <div className="booking-page-copy" data-reveal>
          <p className="eyebrow eyebrow-accent">Booking / shows / features / pers</p>
          <h1>DE KWEKER<br /><span>OP JOUW EVENT?</span></h1>
          <p>Voor clubshows, festivals, support, features en pers. Mail rechtstreeks naar info@kwkr.be.</p>
          <a className="button" href="#aanvraag">Stel je aanvraag samen</a>
        </div>
      </section>
      <BookingComposer />
      <section className="booking-notes">
        <div><h2>Live</h2><p>West-Vlaamse rap op jouw podium. Het livearchief omvat shows in Brugge, Roeselare en Oostende.</p><Link className="text-link" href="/live">Optredens bekijken</Link></div>
        <div><h2>Samenwerken</h2><p>Stuur je idee, een demo of luisterlink en de beoogde planning mee bij je aanvraag.</p><Link className="text-link" href="/muziek">De muziek beluisteren</Link></div>
        <div><h2>Pers</h2><p>Vermeld voor een interview het medium, het onderwerp en je deadline. Beeld en eerdere artikels vind je bij media.</p><Link className="text-link" href="/media">Beeld &amp; pers</Link></div>
      </section>
    </div>
  );
}
