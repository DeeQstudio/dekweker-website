# SEO-controle kwkr.be — 7 september 2026

## Vastgestelde situatie op productie

De live website is via HTTP gecontroleerd, naast de door de eigenaar aangeleverde Search Console-screenshots. Er is geen rechtstreekse toegang tot URL-inspectie of de Google-index gebruikt.

- Alle 22 oorspronkelijke sitemap-URL's gaven HTTP 200, een eigen canonical en server-gerenderde hoofdinhoud met één H1. Geen daarvan had een noindex-metatag of X-Robots-Tag-blokkade.
- robots.txt en beide sitemaps waren bereikbaar. robots.txt liet de inhoud crawlen.
- HTTP, www en afsluitende slashes verwijzen permanent naar HTTPS zonder www. Sommige gecombineerde varianten hebben twee stappen; de geteste ketens eindigen correct zonder lus.
- Onbekende pagina's, muziek- en liveslugs geven een echte HTTP 404.
- `/contact` en `/archief` stonden in de sitemap maar hadden geen inkomende links vanuit de andere sitemap-pagina's. Hun inhoud overlapte met `/booking` en `/live`.
- De muziekinhoud was erg beknopt: circa 20–34 woorden hoofdinhoud per release. Dit is een inhoudelijk verbeterpunt, geen bewezen oorzaak van niet-indexering. Google hanteert geen minimumwoordenaantal voor indexering.

## Betekenis van de aangeleverde meldingen

### Pagina met omleiding: 7

| URL uit Search Console | Live resultaat bij controle |
| --- | --- |
| `https://www.kwkr.be/muziek` | 308 naar `https://kwkr.be/muziek`, daarna 200 |
| `http://kwkr.be/` | 308 naar `https://kwkr.be/`, daarna 200 |
| `https://kwkr.be/muziek/` | 308 naar `/muziek`, daarna 200 |
| `https://www.kwkr.be/muziek/` | Twee 308-stappen naar `https://kwkr.be/muziek`, daarna 200 |
| `http://www.kwkr.be/` | Twee 308-stappen naar `https://kwkr.be/`, daarna 200 |
| `https://www.kwkr.be/` | 308 naar `https://kwkr.be/`, daarna 200 |
| `https://kwkr.be/muziek/verroader` | Nu rechtstreeks 200 met eigen canonical; melding is gebaseerd op de crawl van 21 augustus |

De alternatieve URL's hoeven niet geïndexeerd te worden. Verwijder correcte redirects niet om de teller te verlagen. De rapportage kan achterlopen op de live situatie. Zie [Google: pagina-indexering](https://support.google.com/webmasters/answer/7440203).

### Gevonden, momenteel niet geïndexeerd: 17

De screenshot toont de eerste 10: `/archief`, `/booking`, `/contact`, `/de-kweker`, `/live` en de vijf live-detailpagina's. De overige zeven URL's zijn niet zichtbaar. Bij alle zichtbare voorbeelden staat de laatste crawl op N.v.t.

Dit betekent dat Google de URL kent maar nog niet heeft gecrawld volgens deze rapportage. De publieke HTTP-controle kan niet vaststellen waarom Google de crawl uitstelt. Interne links, serverbeschikbaarheid en een consistente sitemap zijn controleerbaar; een crawl of indexering afdwingen kan niet. Zie [Google: crawling- en indexeringsvragen](https://developers.google.com/search/help/crawling-index-faq).

### Gecrawld, momenteel niet geïndexeerd: 4

- `https://www.kwkr.be/favicon.ico`
- `https://www.kwkr.be/manifest.webmanifest`
- `https://www.kwkr.be/favicon.ico?favicon.2sr8mvau867c1.ico`
- `https://www.kwkr.be/de-kweker`

De eerste drie zijn technische bestanden, geen inhoudspagina's die een eigen zoekresultaat nodig hebben. Ze blijven bereikbaar, zodat browser en crawler ze kunnen gebruiken. Alle vier www-URL's geven nu een 308 naar de overeenkomstige URL zonder www, die 200 geeft. De gemelde crawl van de www-bio dateert van 2 april 2026. Inspecteer de actuele canonical `https://kwkr.be/de-kweker`.

## Wijzigingen in deze werkmap

- Contactinformatie samengebracht op Booking; `/contact` verwijst permanent naar `/booking`.
- Het volledige podiumarchief blijft op Live; `/archief` verwijst permanent naar `/live`.
- De sitemap bevat 20 inhoudspagina's en geen van deze redirectbronnen. Releases hebben een echte wijzigingsdatum voor deze inhoudsupdate; data worden niet elke build vernieuwd.
- Bio uitgebreid met bestaande identiteit, releases, optredens en persverwijzingen, plus relevante interne links. De persoonsgegevens in de sitebrede markup en ProfilePage gebruiken dezelfde artiestennaam en hetzelfde stabiele ID.
- Booking verduidelijkt het aanbod en geeft aparte aanwijzingen voor shows, features en persaanvragen.
- Alle zeven releases hebben specifieke beschrijvingen. Extra productiecredits voor V(err)oader, Alles of Niets en Moed(ig)er zijn gecontroleerd aan de bestaande Pokoe-artikels en staan zichtbaar op de pagina. Publicatiedata van persartikels zijn niet gebruikt om onbekende releasedata in te vullen.
- Muziek- en live-details krijgen zichtbare broodkruimels met bijpassende BreadcrumbList-markup en links naar de bio of booking.
- Herhaalbare HTTP-audit toegevoegd voor sitemaps, canonicals, robots-directives, unieke metadata, serverinhoud, interne bereikbaarheid, JSON-LD-syntaxis, afbeeldingen, redirects en echte 404's.
- Typecontrole genereert voortaan eerst de actuele Next.js-routetypes, zodat verwijderde routes geen verouderde buildfouten veroorzaken.

Bronnen voor de extra release-informatie: [V(err)oader](https://pokoemagazine.nl/de-kweker-verroader/), [Alles of Niets](https://pokoemagazine.nl/de-kweker-ft-king-skam-alles-of-niets/), [Moed(ig)er](https://pokoemagazine.nl/de-kweker-moediger/). De biografie verwijst naar het bestaande [interview in KW](https://kw.be/nieuws/cultuur/muziek/joey-de-kweker-de-queecker-31-rapt-in-het-brugs-mijn-moeilijke-jeugd-vormt-een-belangrijke-inspiratie/).

## Controleren en opvolgen

Uitgevoerde verificatie op 7 september 2026: de volledige `npm run verify` slaagde met Node 22.23.2, inclusief 35 tests in 9 testbestanden en de Next.js-productiebuild. De HTTP-audit tegen die lokaal gestarte productiebuild slaagde voor alle 20 sitemap-pagina's, hun interne bereikbaarheid, sitemap-afbeeldingen, canonicals, JSON-LD-syntaxis, redirects en onbekende routes. `git diff --check` gaf geen fouten. De wijzigingen zijn op dat moment nog niet gepubliceerd; Google-indexering is niet bevestigd.

1. Draai `npm run verify` voor repository-QA, routetypes, TypeScript, ESLint, tests en de productiebuild.
2. Start de productiebuild met `npm run start -- --port 3127` en voer in een tweede terminal `npm run seo:audit -- http://localhost:3127` uit. De audit verwacht indexeerbare productie-output; development- en preview-output hoort crawlers te blokkeren. Canonicals blijven ook lokaal naar kwkr.be wijzen.
3. Publiceer de beoordeelde wijzigingen en draai daarna `npm run seo:audit` tegen kwkr.be. Een lokale geslaagde test bewijst niet dat de wijzigingen al live staan.
4. Controleer in Search Console dat `https://kwkr.be/sitemap.xml` succesvol verwerkt wordt. Dien hem in als hij nog ontbreekt of vraag verwerking van de bijgewerkte sitemap aan. De image-sitemap staat eveneens in robots.txt.
5. Gebruik URL-inspectie en de live test voor `https://kwkr.be/`, `/de-kweker`, `/muziek`, `/booking` en `/live`. Controleer crawltoegang, HTTP-respons, gerenderde inhoud en de door Google gekozen canonical. Vraag indexering één keer aan voor belangrijke bijgewerkte URL's waar nodig.
6. Test de bio en een release met [Google Rich Results Test](https://search.google.com/test/rich-results). De lokale JSON-LD-controle bewijst syntaxis en geselecteerde relaties; zij vervangt Googles featurevalidatie niet.
7. Bewaar de volledige URL-export van de 17 gevonden pagina's en beoordeel na hercrawlen opnieuw. Eenzelfde URL voortdurend indienen versnelt het proces niet. Correct omgeleide URL's en technische bestanden hoeven niet op nul uit te komen.

## Vindbaarheid en het Google-paneel

De pagina's richten zich op de artiestennaam, West-Vlaamse rap uit Brugge, specifieke releases en het boeken van De Kweker. De precieze commerciële zoekprioriteiten moeten nog door de eigenaar worden bevestigd. Meet daarna vertoningen, klikken en zoekopdrachten in Search Console; een lokale technische test meet geen ranking.

Een artiestenpaneel wordt door Google automatisch opgebouwd uit informatie op het web. Consistente officiële profielen, dezelfde artiestenidentiteit en onafhankelijke publicaties kunnen helpen bij herkenning. De website biedt daarvoor duidelijke gegevens en `sameAs`-verwijzingen. Er is geen garantie op een paneel of een nummer 1-positie. Als een paneel verschijnt, kan de artiest het claimen en informatie corrigeren. Zie [Google: over kennisvensters](https://support.google.com/knowledgepanel/answer/9163198) en [richtlijnen voor gestructureerde gegevens](https://developers.google.com/search/docs/appearance/structured-data/sd-policies).

Controleer zelf of Spotify, YouTube, Instagram, VI.BE, MusicBrainz en andere beheerde profielen waar mogelijk naar `https://kwkr.be/` verwijzen. Er zijn tijdens deze werkzaamheden geen externe profielen gewijzigd, berichten verstuurd of Search Console-validaties gestart.
