# Phase 5 - Prioritised Action Plan

Scoring method: Impact x Confidence x Effort, with brand and implementation risk considered.

Priority definitions:

- P0: broken/severe/blocking
- P1: high impact, high confidence
- P2: worthwhile improvement
- P3: optional refinement

## Issue Register

| ID | Priority | Category | Affected URL(s) | Evidence | User Impact | SEO Impact | Accessibility Impact | Performance Impact | Confidence | Effort | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SEO-001 | P1 | Canonical | `/` | Crawl found canonical `https://www.rebirtharete.example/` on live homepage. | Trust issue if inspected; no direct UX impact. | High; canonical points away from live domain. | None. | None. | High | Low | Low | Set canonical to `https://www.the-rebirth.co.uk/`. |
| SEO-002 | P1 | Sitemap | `/sitemap.xml` | Live `sitemap.xml` returns 404; robots has no sitemap line. | None. | Medium; weak explicit discovery. | None. | None. | High | Low | Low | Add `sitemap.xml` and reference it in `robots.txt`. |
| A11Y-001 | P1 | Accessibility | `/` | Lighthouse color contrast failure for orange eyebrow labels on light backgrounds. | Some users may struggle to read small section labels. | None. | High. | None. | High | Low | Low | Use dark text for light-section eyebrow labels while retaining orange accent line; keep orange on dark sections. |
| UX-001 | P1 | Content hierarchy | `/` | Baseline H1 is philosophical, not service/outcome-led. | Visitors may not immediately understand the offer. | Medium; weak on-page intent. | None. | None. | High | Medium | Medium | Make hero outcome-led; move philosophy lower. |
| UX-002 | P1 | Service clarity | `/` | Services exist but purchasable routes/options are not scannable enough. | Higher cognitive load before enquiry. | Medium. | None. | None. | High | Medium | Low | Create clear 1-to-1 PT, online coaching, nutrition/accountability service cards with enquiry anchors. |
| UX-003 | P1 | Proof hierarchy | `/` | No genuine proof assets in repo; baseline feedback cards are abstract. | Less confidence before enquiry. | Low-to-medium. | None. | None. | High | Low | Low | Add truthful progress/process section; do not fabricate client results. |
| SEO-003 | P2 | Social metadata | `/` | Crawl found no Open Graph or Twitter metadata. | Poor link preview control. | Low. | None. | None. | High | Low | Low | Add OG/Twitter metadata using visible brand facts and existing logo/hero image. |
| SEO-004 | P2 | Structured data | `/` | Crawl found no JSON-LD. | None visible. | Low-to-medium entity clarity opportunity. | None. | None. | High | Low | Low | Add conservative WebSite/Organization JSON-LD only; no fake ratings/address. |
| CONTENT-001 | P2 | Trust/content | Footer/form | Repository contains placeholder email, review URL, service area, and QR/review destination. | Can reduce trust if live. | Medium if placeholders are indexed or used. | None. | None. | High | Unknown | Medium | Do not invent replacements; request verified contact/review/service-area details. |
| PERF-001 | P2 | Image delivery | Logo/Phil images | Lighthouse image delivery insight estimates savings from oversized logo and Phil image. | Small perceived-load improvement possible. | None. | None. | Low-to-medium. | Medium | Medium | Low | Consider smaller logo variants and tighter image sizes later; not urgent due strong baseline scores. |
| SEO-005 | P3 | Redirects | HTTP/non-www variants | `http://the-rebirth.co.uk/` uses two-hop redirect to final www HTTPS URL. | None for most users. | Minor. | None. | Minor. | Medium | Hosting-level | Medium | If hosting allows, simplify to one-hop redirect. |

## Implementation Scope for This Pass

Implement now:

- SEO-001 canonical
- SEO-002 sitemap/robots
- A11Y-001 contrast
- UX-001 homepage hierarchy
- UX-002 service clarity
- UX-003 truthful progress/proof framework
- SEO-003 social metadata
- SEO-004 conservative JSON-LD

Do not implement now:

- CONTENT-001 because real contact/review/location data is required.
- PERF-001 because baseline Lighthouse performance is already strong and image changes require asset generation decisions.
- SEO-005 because it is hosting/CDN redirect configuration outside the repository.

## Risk Notes

- The local working tree already contains the homepage hierarchy implementation from the previous task. Phase 6 should preserve that work and add only the evidence-supported technical fixes above.
- No fake testimonials, transformations, reviews, ratings, addresses, opening hours, or local claims should be added.
