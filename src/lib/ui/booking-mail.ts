export type BookingIntent = "Optreden" | "Samenwerking" | "Pers";

export function buildBookingMail(intent: BookingIntent, values: { name: string; message: string; date?: string; location?: string }) {
  const body = [
    `Aanvraag: ${intent}`,
    `Naam / organisatie: ${values.name.trim()}`,
    intent === "Optreden" ? `Datum: ${values.date || "Nog te bepalen"}\nLocatie: ${values.location?.trim() || "Nog te bepalen"}` : "",
    `\n${values.message.trim()}`
  ].filter(Boolean).join("\n");
  return `mailto:info@kwkr.be?subject=${encodeURIComponent(`${intent} De Kweker`)}&body=${encodeURIComponent(body)}`;
}
