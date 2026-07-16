# Phase 5 - Prioritised Action Plan

Date: 2026-07-08

Scoring method: Impact x Confidence x Effort, adjusted for brand risk and implementation risk.

Priority definitions:

- P0: broken, severe, or blocking
- P1: high impact and high confidence
- P2: worthwhile improvement
- P3: optional refinement

## Issue Register

| ID | Priority | Category | Affected URL(s) | Evidence | User Impact | SEO Impact | Accessibility Impact | Performance Impact | Confidence | Effort | Risk | Recommendation |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| SEO-001 | P1 | Canonical | `/` | Baseline crawl found live canonical `https://www.rebirtharete.example/`. | Low visible impact, but weakens trust if inspected. | High; canonical points away from live domain. | None. | None. | High | Low | Low | Set canonical to `https://www.the-rebirth.co.uk/`. |
| SEO-002 | P1 | Sitemap/robots | `/sitemap.xml`, `/robots.txt` | Live sitemap returned 404; robots did not declare a sitemap. | None direct. | Medium; weak explicit discovery. | None. | None. | High | Low | Low | Add a single-URL sitemap and declare it in robots. |
| A11Y-001 | P1 | Contrast | Homepage light-section eyebrow labels | Lighthouse failed color contrast on orange text over white/soft backgrounds. | Some users may struggle to read section labels. | None. | High. | None. | High | Low | Low | Use dark eyebrow text on light sections and keep orange accent line. |
| UX-001 | P1 | Hero clarity | `/` | Baseline H1 is philosophical rather than service/outcome-led. | Visitors may not quickly understand the offer. | Medium; weaker search-intent alignment. | None. | None. | High | Medium | Medium | Lead with fitness outcomes and verified service types. |
| UX-002 | P1 | Structural repetition | `/` | Audit found restarting, consistency, standards, rebuilding, and philosophy repeated across adjacent sections. | Cognitive load and slower conversion. | Low-to-medium. | None. | None. | High | Medium | Low | Consolidate into one Reality Check and one Coach & Philosophy section. |
| UX-003 | P1 | Service clarity | `/` | Approved copy verifies 1-to-1 PT and online coaching, but baseline offer navigation is not the main structure. | Visitors may not know which path fits them. | Medium. | None. | None. | High | Medium | Low | Add a clear Ways to Work section with one unified enquiry flow. |
| UX-004 | P1 | Process proof | `/` | Asset inventory found no verified app/check-in screenshots; current site needs clearer process explanation. | Lower trust before enquiry. | Low. | None. | None. | High | Medium | Low | Use truthful typographic process: starting point, plan, check-ins, adjustments. |
| UX-005 | P1 | Outcome/proof clarity | `/` | No verified testimonials, transformations, measurable outcomes, or client stories exist. | Lower confidence, but fake proof would be worse. | Low-to-medium. | None. | None. | High | Medium | Low | Create a truthful Real Progress section using genuine coaching outcomes and future-proof component structure without public placeholders. |
| SEO-003 | P2 | Social metadata | `/` | Crawl found no OG or Twitter metadata on live baseline. | Poor preview control when shared. | Low. | None. | None. | High | Low | Low | Add OG/Twitter metadata using current brand facts and hero image. |
| SEO-004 | P2 | Structured data | `/` | Crawl found 0 JSON-LD blocks. | None visible. | Low-to-medium entity clarity opportunity. | None. | None. | High | Low | Low | Add conservative Organization/WebSite JSON-LD only; do not add fake address, ratings, or reviews. |
| CONTENT-001 | P2 | Contact/trust | Footer/form | Repository contains placeholder email, generic Google review URL, and unverified service area. | Can reduce trust if published unchanged. | Medium. | None. | None. | High | Unknown | Medium | Do not invent replacements; request verified email, review URL, and service area. |
| PERF-001 | P2 | Image delivery | Header/footer logo, responsive images | Lighthouse flags image delivery opportunities; logo intrinsic size is much larger than rendered size. | Small load improvement possible. | None. | None. | Low-to-medium. | Medium | Medium | Low | Defer asset generation; baseline performance is already strong. |
| SEO-005 | P3 | Redirects | HTTP/non-www variants | Manual checks found `http://the-rebirth.co.uk/` redirects via two hops. | Minimal. | Minor. | None. | Minor. | Medium | Hosting-level | Medium | Simplify to one-hop redirect if hosting config allows. |

## Implementation Scope For This Pass

Implement now:

- SEO-001 canonical
- SEO-002 sitemap/robots
- A11Y-001 contrast
- UX-001 hero clarity
- UX-002 structural simplification
- UX-003 service clarity
- UX-004 truthful process proof
- UX-005 truthful outcome/proof framework
- SEO-003 social metadata
- SEO-004 conservative JSON-LD

Document but do not invent:

- CONTENT-001 verified contact/review/location details
- PERF-001 smaller logo variants
- SEO-005 hosting/CDN redirect cleanup

## Risk Notes

- The working tree already contained uncommitted changes from a previous homepage/audit pass before this stricter brief arrived. This pass treats the live site as baseline and the local static files as the implementation candidate.
- No testimonials, transformations, review ratings, software screenshots, formal credentials, locations, or measurable client outcomes should be added unless genuine approved assets are supplied.
