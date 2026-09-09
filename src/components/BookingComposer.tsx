"use client";

import { useState, type FormEvent } from "react";
import { buildBookingMail } from "@/lib/ui/booking-mail";

const intents = ["Optreden", "Samenwerking", "Pers"] as const;

export function BookingComposer() {
  const [intent, setIntent] = useState<typeof intents[number]>("Optreden");
  const [prepared, setPrepared] = useState(false);
  function compose(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const values = new FormData(event.currentTarget);
    window.location.href = buildBookingMail(intent, { name: String(values.get("name") ?? ""), message: String(values.get("message") ?? ""), date: String(values.get("date") ?? ""), location: String(values.get("location") ?? "") });
    setPrepared(true);
  }
  return <section className="booking-composer" id="aanvraag" aria-labelledby="booking-compose-title">
    <div className="booking-compose-intro"><p className="eyebrow">Rechtstreeks contact</p><h2 id="booking-compose-title">De Kweker<br />boeken</h2><a href="mailto:info@kwkr.be">info@kwkr.be</a><p>Stel je aanvraag hieronder samen. Je verstuurt die daarna vanuit je eigen mailapp.</p></div>
    <form onSubmit={compose} action="mailto:info@kwkr.be" method="post" encType="text/plain">
      <fieldset className="booking-intents"><legend>Waarover wil je contact opnemen?</legend>{intents.map((item) => <label key={item}><input type="radio" name="intent" value={item} checked={intent === item} onChange={() => { setIntent(item); setPrepared(false); }} /><span>{item}</span></label>)}</fieldset>
      <label className="compose-field">Naam of organisatie<input name="name" autoComplete="organization" required placeholder="Wie neemt contact op?" /></label>
      {intent === "Optreden" ? <div className="compose-pair"><label className="compose-field">Datum <small>optioneel</small><input type="date" name="date" /></label><label className="compose-field">Locatie <small>optioneel</small><input name="location" placeholder="Stad of venue" /></label></div> : null}
      <label className="compose-field">{intent === "Pers" ? "Onderwerp en deadline" : intent === "Samenwerking" ? "Je idee en eventuele luisterlink" : "Vertel over je event"}<textarea name="message" rows={3} required placeholder={intent === "Optreden" ? "Type event, timing, budget…" : "Waarover gaat je aanvraag?"} /></label>
      <button className="compose-submit" type="submit">Open in je mailapp</button>
      <p className="compose-note" role="status">{prepared ? "Je mailapp is aangevraagd. Controleer en verstuur daar je bericht. Je kunt ook rechtstreeks mailen naar info@kwkr.be." : "Deze website slaat je invoer niet op."}</p>
    </form>
  </section>;
}
