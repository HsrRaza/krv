# KRV Builders SEO Implementation Plan

## Goals

Target high-intent local searches for KRV Builders & Developers in Ramanagara, Karnataka:

- builders in Ramanagara
- construction company in Ramanagara
- Vastu house plan designers near me
- building contractors Ramanagara
- architectural structural design Ramanagara
- turnkey construction Karnataka

## Metadata Architecture

- Define a single environment-driven site origin with `NEXT_PUBLIC_SITE_URL` and a documented production fallback.
- Set root metadata for the business name, local service description, title templates, canonical URLs, language, and keyword-aligned descriptions.
- Add route-level metadata for Home, Services, Work In Progress, Gallery, About, and Contact.
- Keep `/admin`, `/admin/login`, and admin child routes out of the public metadata and sitemap surface.
- Add Open Graph and Twitter card metadata using the existing logo as a stable fallback image, with absolute URLs derived from the site origin.

## Structured Data

- Add a reusable local business JSON-LD graph in the root layout containing `LocalBusiness`, `Organization`, `PostalAddress`, `GeoCoordinates`, opening hours, telephone, email, service area, and same-as links where available.
- Add `WebSite` and `WebPage` entities through the root/page metadata strategy.
- Add `Service` and `ItemList` JSON-LD on the services and gallery routes where the visible page content supports it.
- Escape serialized JSON-LD before injecting it into native script tags, following the installed Next.js guidance.

## Crawl And Indexation

- Generate `/sitemap.xml` with the six public routes and stable priorities/change frequencies.
- Generate `/robots.txt` allowing public routes, disallowing `/admin/`, and pointing crawlers to the sitemap.
- Use the configured site origin for canonical URLs, sitemap URLs, Open Graph URLs, and structured data IDs.
- Avoid indexing admin and authentication surfaces.

## Local SEO Signals

- Use Ramanagara, Karnataka consistently in titles, descriptions, headings, address schema, service area, and contact copy.
- Use the office address currently shown on the Contact page.
- Use approximate Ramanagara office-area coordinates in `GeoCoordinates`; replace with verified Google Business Profile coordinates before launch if they differ.

## Validation

1. Run `npm run build` and confirm static generation of `/sitemap.xml` and `/robots.txt`.
2. Run `npm run dev` and inspect generated `<title>`, canonical, Open Graph, Twitter, and JSON-LD tags in an integrated browser.
3. Fetch `/sitemap.xml` and `/robots.txt` and verify public URLs and admin exclusions.
4. Parse each JSON-LD script as JSON and validate required schema fields using Schema Markup Validator / Google Rich Results conventions.
5. Confirm no admin URL is included in the sitemap and no page emits a relative canonical or social image URL.
