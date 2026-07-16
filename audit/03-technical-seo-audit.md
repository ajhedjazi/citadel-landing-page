# Phase 3 - Technical SEO Audit

Evidence sources:

- Repository inspection: `audit/00-repository-inspection.md`
- Baseline crawl: `audit/baseline-crawl.csv`
- Baseline Lighthouse: `audit/lighthouse-baseline/summary-medians.csv`

## Crawlability and Indexability

- The live homepage returns `200` and is indexable.
- `robots.txt` returns `200` and allows all crawling.
- No robots meta noindex or X-Robots-Tag noindex was detected.
- `sitemap.xml` returns `404`.
- There is no sitemap declared in `robots.txt`.

Finding: the site is crawlable, but sitemap discovery is missing.

## URL Architecture

- Canonical live URL appears to be `https://www.the-rebirth.co.uk/`.
- `http://www.the-rebirth.co.uk/` redirects to the HTTPS www URL.
- `https://the-rebirth.co.uk/` redirects to the HTTPS www URL.
- `http://the-rebirth.co.uk/` redirects through non-www HTTPS before www HTTPS, creating a two-hop chain.

Finding: host canonicalisation generally works, but one common variant uses a two-hop chain controlled by hosting/CDN configuration.

## Canonicals

- The live homepage canonical points to `https://www.rebirtharete.example/`.
- This is a high-confidence SEO defect because the only indexable production URL declares a placeholder canonical domain.

Recommendation: update the canonical to `https://www.the-rebirth.co.uk/`.

## Metadata

Baseline live metadata:

- Title: `Rebirth Areté | Personal Training, Weight Loss & Mindset Coaching`
- Meta description: `Premium personal training, weight loss and mindset coaching from Rebirth Areté for people ready to stop restarting and raise their standard.`

Issues:

- Homepage metadata mentions the service category, but the on-page H1 does not.
- No Open Graph metadata detected.
- No Twitter/social card metadata detected.

Recommendation: keep metadata human-readable and service-led; add OG/Twitter metadata with the approved brand image.

## On-Page Structure

- Baseline live H1 count: 1.
- Baseline live H1: `For the part of you that knows you could be doing better.`
- H2 count: 5.
- Heading order concern: no.

Finding: HTML heading structure is technically acceptable, but the baseline H1 is too abstract for the commercial intent.

Recommendation: make the H1 explicit about fitness outcomes while preserving the Rebirth philosophy lower on the page.

## Internal Linking

- Single-page anchor navigation is present.
- No broken internal links were detected.
- No orphan pages were detected because there is only one indexable URL.

Recommendation: preserve anchor navigation and ensure any new anchors remain valid.

## Images

- Baseline live images have alt attributes.
- Lighthouse image delivery found potential savings:
  - oversized logo PNG used at small display sizes
  - Phil AVIF larger than required in some viewport contexts

Recommendation: do not remove brand imagery for score-chasing. Consider smaller logo variants later. Current priority is contrast and SEO correctness.

## Structured Data

- No JSON-LD structured data detected.

Recommendation: add conservative WebSite and Organization schema only using facts visible in the site:

- name
- URL
- logo
- Instagram URL

Do not add reviews, aggregate ratings, opening hours, prices, address, qualifications, or service area without verified content.

## Mobile SEO and Rendering

- Viewport meta is present.
- Lighthouse mobile SEO scored 100.
- No hidden essential content issue was detected in the crawl.

## Local Relevance

- The repository currently contains only placeholder service-area text: `In-person and online coaching`.
- No verified Hull/Hessle/East Riding address or service-area claim is present in the repository.

Recommendation: do not add local keyword targeting until the client confirms truthful location/service-area information.

## Technical SEO Priority Summary

1. Fix placeholder canonical.
2. Add sitemap and robots sitemap reference.
3. Add social metadata.
4. Add conservative JSON-LD schema.
5. Keep content hierarchy service-led.
6. Document unresolved placeholder contact/review details as content risks.
