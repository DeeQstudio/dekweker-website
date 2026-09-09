import { afterEach, describe, expect, it, vi } from "vitest";
import { verifiedArtist, verifiedEvents, verifiedReleases } from "@/content/verified";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import nextConfig from "../next.config";
import { artistEntityGraph, breadcrumbSchema, ids, profilePageSchema } from "@/lib/seo/schema";
import { pageMetadata, siteUrl } from "@/lib/seo/site";

describe("canonical and sitemap integrity", () => {
  it("uses one normalized production origin", () => {
    expect(siteUrl).toBe("https://kwkr.be");
    const metadata = pageMetadata({ title: "Test", path: "/muziek" });
    expect(metadata.alternates?.canonical).toBe("https://kwkr.be/muziek");
    expect(metadata.openGraph?.url).toBe("https://kwkr.be/muziek");
  });

  it("publishes every release and event exactly once", async () => {
    const entries = await sitemap();
    const urls = entries.map((entry) => entry.url);
    expect(new Set(urls).size).toBe(urls.length);
    for (const release of verifiedReleases) expect(urls).toContain(`${siteUrl}/muziek/${release.slug}`);
    for (const event of verifiedEvents) expect(urls).toContain(`${siteUrl}/live/${event.slug}`);
  });

  it("keeps permanent redirect sources out of the sitemap and includes their destinations", async () => {
    const urls = (await sitemap()).map((entry) => entry.url);
    expect(urls).toContain(`${siteUrl}/`);
    const redirects = await nextConfig.redirects!();
    for (const source of ["/contact", "/archief", "/live/wijkplanken-plukketuffer-2026"]) {
      const redirect = redirects.find((item) => item.source === source);
      expect(redirect?.permanent).toBe(true);
      expect(urls).not.toContain(`${siteUrl}${source}`);
      expect(urls).toContain(`${siteUrl}${redirect?.destination}`);
    }
  });

  it("keeps the profile identity consistent with the site-wide entity", () => {
    const profile = profilePageSchema(verifiedArtist).mainEntity;
    const person = artistEntityGraph(verifiedArtist)["@graph"].find((item) => item["@id"] === ids.person);
    expect(profile["@id"]).toBe(ids.person);
    expect(profile.name).toBe(verifiedArtist.name);
    expect(profile.alternateName).toBe(verifiedArtist.legalName);
    expect(profile.sameAs).toEqual(person?.sameAs);
    expect(profile.name).toBe(person?.name);
  });

  it("links breadcrumb parents and the current page to canonical URLs", () => {
    const breadcrumb = breadcrumbSchema([{ name: "Home", path: "/" }, { name: "Muziek", path: "/muziek" }, { name: "Lekt Em", path: "/muziek/lekt-em" }]);
    expect(breadcrumb.itemListElement.map((item) => [item.position, item.item])).toEqual([
      [1, `${siteUrl}/`], [2, `${siteUrl}/muziek`], [3, `${siteUrl}/muziek/lekt-em`]
    ]);
  });
});

describe("crawler access by deployment environment", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("allows production crawling and advertises the canonical sitemaps", () => {
    vi.stubEnv("VERCEL_ENV", "production");
    expect(robots().rules).toEqual([{ userAgent: "*", allow: "/", disallow: ["/api/"] }]);
    expect(robots().sitemap).toEqual([`${siteUrl}/sitemap.xml`, `${siteUrl}/image-sitemap.xml`]);
  });

  it("blocks preview deployments even when built with NODE_ENV=production", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("VERCEL_ENV", "preview");
    expect(robots().rules).toEqual([{ userAgent: "*", disallow: "/" }]);
    expect(robots().sitemap).toBeUndefined();
  });
});
