import { describe, expect, it } from "vitest";
import { buildBookingMail } from "../src/lib/ui/booking-mail";

describe("booking email draft", () => {
  it("preserves accents, paragraphs and URL characters without adding mail headers", () => {
    const url = new URL(buildBookingMail("Optreden", { name: "Café & Co", date: "2026-12-12", location: "Brugge", message: "Show om 20u.\nBudget: €500 & btw?\nhttps://example.com/?x=1&bcc=other" }));
    expect(url.protocol).toBe("mailto:");
    expect(url.pathname).toBe("info@kwkr.be");
    expect([...url.searchParams.keys()]).toEqual(["subject", "body"]);
    expect(url.searchParams.get("body")).toContain("Café & Co\nDatum: 2026-12-12\nLocatie: Brugge");
    expect(url.searchParams.get("body")).toContain("€500 & btw?\nhttps://example.com/?x=1&bcc=other");
  });

  it("keeps only relevant fields when the contact purpose changes", () => {
    const press = new URL(buildBookingMail("Pers", { name: "Redactie", message: "Interview", date: "2026-12-12", location: "Brugge" }));
    expect(press.searchParams.get("subject")).toBe("Pers De Kweker");
    expect(press.searchParams.get("body")).not.toContain("Datum:");
    expect(press.searchParams.get("body")).not.toContain("Locatie:");
    const performance = new URL(buildBookingMail("Optreden", { name: "Organisatie", message: "Info" }));
    expect(performance.searchParams.get("body")).toContain("Datum: Nog te bepalen\nLocatie: Nog te bepalen");
  });
});
