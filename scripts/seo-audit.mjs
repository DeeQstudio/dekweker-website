// Read-only HTTP audit. Use a running production build or the deployed site.
// This checks technical signals, not Google's private index or ranking decisions.
const canonicalOrigin = "https://kwkr.be";
const target = new URL(process.argv[2] ?? canonicalOrigin);
if (!["http:", "https:"].includes(target.protocol)) throw new Error("Use an HTTP(S) origin.");
const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };
const decode = (text) => text.replace(/&(?:amp|quot|apos|lt|gt|#\d+|#x[\da-f]+);/gi, (entity) => {
  const named = { "&amp;": "&", "&quot;": '"', "&apos;": "'", "&lt;": "<", "&gt;": ">" };
  if (named[entity]) return named[entity];
  return String.fromCodePoint(entity.startsWith("&#x") ? parseInt(entity.slice(3), 16) : parseInt(entity.slice(2), 10));
});
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w-]+)\s*=\s*["']([^"']*)["']/g)].map((m) => [m[1].toLowerCase(), decode(m[2])]));
const tags = (html, tag) => [...html.matchAll(new RegExp(`<${tag}\\b[^>]*>`, "gi"))].map((m) => attributes(m[0]));
const textContent = (html) => decode(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "").replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
const request = (path, method = "GET") => fetch(new URL(path, target.origin), {
  method, redirect: "manual", signal: AbortSignal.timeout(20000)
});

const robots = await request("/robots.txt");
const robotsText = await robots.text();
check(robots.status === 200, `robots.txt: HTTP ${robots.status}`);
check(!/^Disallow:\s*\/\s*$/im.test(robotsText), "robots.txt blocks the entire site");
for (const path of ["/sitemap.xml", "/image-sitemap.xml"]) {
  check(robotsText.includes(`Sitemap: ${canonicalOrigin}${path}`), `robots.txt missing ${path}`);
}

const sitemap = await request("/sitemap.xml");
const xml = await sitemap.text();
check(sitemap.status === 200, `sitemap.xml: HTTP ${sitemap.status}`);
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => decode(m[1]));
check(urls.length > 0, "Sitemap contains no URLs");
check(urls.length === new Set(urls).size, "Sitemap contains duplicates");
const pages = [];

for (const url of urls) {
  const parsed = new URL(url);
  check(parsed.origin === canonicalOrigin && !parsed.search && !parsed.hash, `Noncanonical sitemap URL: ${url}`);
  const response = await request(parsed.pathname);
  const html = await response.text();
  const meta = tags(html, "meta");
  const canonical = tags(html, "link").filter((item) => item.rel === "canonical");
  const title = textContent(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? "");
  const description = meta.filter((item) => item.name === "description");
  const robotsRules = [response.headers.get("x-robots-tag") ?? "", ...meta.filter((m) => /^(robots|googlebot)$/i.test(m.name ?? "")).map((m) => m.content)].join(",");
  const main = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)?.[1] ?? "";
  const visible = textContent(main);
  check(response.status === 200, `${parsed.pathname}: HTTP ${response.status}, expected 200 without redirect`);
  check(response.headers.get("content-type")?.includes("text/html"), `${parsed.pathname}: not HTML`);
  let canonicalHref;
  try { canonicalHref = new URL(canonical[0]?.href).href; } catch { /* Report invalid canonical below. */ }
  check(canonical.length === 1 && canonicalHref === parsed.href, `${parsed.pathname}: missing, duplicate or mismatched canonical`);
  check(!/\b(noindex|none)\b/i.test(robotsRules), `${parsed.pathname}: noindex directive`);
  check(Boolean(title), `${parsed.pathname}: missing title`);
  check(description.length === 1 && Boolean(description[0].content), `${parsed.pathname}: missing or duplicate description`);
  check((main.match(/<h1\b/gi) ?? []).length === 1, `${parsed.pathname}: expected one H1 in main content`);
  check(visible.length > 0, `${parsed.pathname}: no server-rendered main content`);
  const schemas = [];
  for (const match of html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)) {
    try { schemas.push(JSON.parse(match[1])); } catch { failures.push(`${parsed.pathname}: invalid JSON-LD`); }
  }
  if (/^\/(muziek|live)\/.+/.test(parsed.pathname)) {
    const breadcrumb = schemas.find((schema) => schema["@type"] === "BreadcrumbList");
    check(breadcrumb?.itemListElement?.at(-1)?.item === parsed.href, `${parsed.pathname}: missing or mismatched breadcrumb`);
  }
  const links = tags(html, "a").flatMap(({ href }) => {
    if (!href) return [];
    const linked = new URL(href, url);
    return linked.origin === canonicalOrigin ? [linked.pathname] : [];
  });
  pages.push({ path: parsed.pathname, status: response.status, title, description: description[0]?.content, words: visible.split(/\s+/).filter(Boolean).length, links });
}

for (const page of pages) {
  check(pages.filter((other) => other.title === page.title).length === 1, `${page.path}: duplicate title`);
  check(pages.filter((other) => other.description === page.description).length === 1, `${page.path}: duplicate description`);
  check(page.path === "/" || pages.some((other) => other.path !== page.path && other.links.includes(page.path)), `${page.path}: no incoming link from another sitemap page`);
}
// Follow the actual link graph from Home; a group of orphan pages can link to itself.
const reachable = new Set(["/"]);
for (let size = -1; size !== reachable.size;) {
  size = reachable.size;
  for (const page of pages) if (reachable.has(page.path)) for (const link of page.links) reachable.add(link);
}
for (const page of pages) check(reachable.has(page.path), `${page.path}: unreachable from Home`);
const pagePaths = new Set(pages.map((page) => page.path));
for (const path of new Set(pages.flatMap((page) => page.links))) {
  if (pagePaths.has(path)) continue;
  const response = await request(path);
  check(response.status === 200, `Internal link ${path}: HTTP ${response.status}`);
  await response.body?.cancel();
}

const imageSitemap = await request("/image-sitemap.xml");
check(imageSitemap.status === 200, `image-sitemap.xml: HTTP ${imageSitemap.status}`);
const imageXml = await imageSitemap.text();
for (const match of imageXml.matchAll(/<loc>(.*?)<\/loc>/g)) {
  check(urls.includes(decode(match[1])), `Image sitemap page missing from main sitemap: ${match[1]}`);
}
for (const match of imageXml.matchAll(/<image:loc>(.*?)<\/image:loc>/g)) {
  const url = new URL(decode(match[1]));
  check(url.origin === canonicalOrigin, `Image has noncanonical origin: ${url}`);
  const response = await request(url.pathname, "HEAD");
  check(response.status === 200 && response.headers.get("content-type")?.startsWith("image/"), `Image not accessible: ${url.pathname} (HTTP ${response.status})`);
}

const redirects = new Map([
  ["/contact", "/booking"],
  ["/archief", "/live"],
  ["/live/wijkplanken-plukketuffer-2026", "/live/wijklanken-plukketuffer-2026"],
  ["/muziek/", "/muziek"]
]);
for (const [from, to] of redirects) {
  const response = await request(from);
  const location = response.headers.get("location");
  check([301, 308].includes(response.status) && location && new URL(location, target.origin).href === new URL(to, target.origin).href, `${from}: expected permanent redirect to ${to}, got ${response.status} ${location}`);
  check(pagePaths.has(to), `${from}: redirect target absent from sitemap`);
  check(!pagePaths.has(from), `${from}: redirect source appears in sitemap`);
  await response.body?.cancel();
}
for (const path of ["/seo-audit-nonexistent-page", "/muziek/seo-audit-nonexistent-release", "/live/seo-audit-nonexistent-event"]) {
  const response = await request(path);
  check(response.status === 404, `${path}: expected 404, got ${response.status} (possible soft 404)`);
  await response.body?.cancel();
}
if (target.origin === canonicalOrigin) {
  for (const origin of ["http://kwkr.be", "https://www.kwkr.be"]) {
    const response = await fetch(`${origin}/muziek`, { redirect: "manual", signal: AbortSignal.timeout(20000) });
    check([301, 308].includes(response.status) && response.headers.get("location") === `${canonicalOrigin}/muziek`, `${origin}: missing permanent canonical redirect`);
    await response.body?.cancel();
  }
}

console.table(pages.map(({ path, status, words }) => ({ path, status, words })));
if (failures.length) {
  console.error(`SEO audit failed for ${target.origin}:\n- ${failures.join("\n- ")}`);
  process.exitCode = 1;
} else {
  console.log(`SEO audit passed for ${target.origin}: ${pages.length} canonical pages, internal links, JSON-LD syntax, sitemap images, redirects and 404s. Google indexing and rich-result eligibility require separate inspection.`);
}
