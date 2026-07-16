# Phase 3 - Evidence-Led Audit

Date: 2026-07-08

Evidence used:

- Repository inspection: `audit/00-repository-inspection.md`
- Genuine asset inventory: `audit/00b-asset-inventory.md`
- Baseline crawl: `audit/baseline-crawl.json`
- Baseline Lighthouse: `audit/lighthouse-baseline/summary.json`
- Live homepage content and rendered HTML inspection
- Limited competitor snapshot: `audit/competitor-snapshot.json`

## A. Technical SEO

| Area | Evidence | Finding | Priority |
|---|---|---|---|
| Crawlability | Baseline crawl reached 1 HTML URL with status 200. | The live site is crawlable as a single-page static site. | None |
| Indexability | Crawl reports 1 indexable URL. | Homepage is indexable. | None |
| Canonical | Live canonical is `https://www.rebirtharete.example/`; self-canonical is `no`. | The only indexable page declares a placeholder canonical outside the live domain. | P1 |
| Sitemap | `https://www.the-rebirth.co.uk/sitemap.xml` returned 404 during baseline crawl. | Explicit sitemap discovery is missing. | P1 |
| Robots | `robots.txt` is reachable and allows crawling, but does not declare sitemap on live baseline. | Robots is not blocking, but discovery can be improved. | P2 |
| URL variants | Manual header checks showed a two-hop redirect for `http://the-rebirth.co.uk/`. | Minor hosting-level redirect cleanup opportunity. | P3 |
| Metadata | Title and description are present; OG/Twitter metadata missing on live baseline. | Search snippet basics exist, but social previews are uncontrolled. | P2 |
| Structured data | Crawl found 0 JSON-LD blocks. | Missed conservative entity clarity opportunity. | P2 |
| Heading/content intent | H1 is philosophical: "For the part of you that knows you could be doing better." | Service and outcome intent are less clear than the title/description. | P1 |
| Internal linking | Same-page navigation only; no broken links detected. | Appropriate for a one-page site. | None |
| Image SEO | 4 live images; 0 missing alt text. | Alt coverage is acceptable. | None |
| Local relevance | Repository does not verify Hull, Hessle, or East Riding service area claims. | Do not add geographic copy until verified. | Constraint |

Technical SEO conclusion: the live site is not blocked from crawling, but the placeholder canonical is a high-confidence issue. The rest of the SEO work is mostly clarity and metadata, not a need for structural rebuild.

## B. UX/UI And Content Hierarchy

### Key Questions

| Question | Evidence-led answer |
|---|---|
| Can a new visitor quickly tell what the business does? | Partially. The title/description help, but the live H1 leads with philosophy rather than personal training, online coaching, weight loss, strength, or fitness. |
| Are concrete fitness outcomes clear? | Not quickly enough. Weight loss and coaching appear, but "get fitter", "build strength", and "feel better physically" need to be made explicit above the fold. |
| Are service options clear? | Partially. 1-to-1 and online coaching are present in approved copy, but the homepage should make them scannable as distinct ways to work. |
| Does the visitor recognise themselves? | Yes, the anti-restart positioning is strong. It needs one definitive section rather than repeated fragments. |
| Is the homepage repeating the same psychological idea? | Yes. Restarting, rebuilding, consistency, standards, and mindset appear as adjacent standalone ideas. |
| Is proof visible and credible? | Weak. Asset inventory found no testimonials, transformations, measurable outcomes, or client stories. The site should use truthful progress/process proof without pretending client proof exists. |
| Is the coaching experience understandable? | Partially. It should explain starting point, plan, check-ins, and adjustments in a single process section. |
| Is the coach visible and credible? | Yes, Phil photography and approved biography copy exist. Formal credentials are not verified. |
| Is enquiry obvious? | Yes, the form is present. Conversion should use one unified enquiry path. |
| Does philosophy differentiate rather than obscure? | Baseline: it obscures too early. Recommendation: move philosophy into Coach & Philosophy after the practical offer is clear. |
| Are CTAs repetitive or fragmented? | The site should keep one primary enquiry path and use section links into it. |
| Is mobile deliberately designed? | Existing responsive CSS is solid. The new structure should keep compact cards, avoid long manifesto sections, and keep CTAs visible. |

### Homepage Content Classification

| Existing content/theme | Classification | Reason |
|---|---|---|
| Fitness outcomes: weight loss, strength, getting back in shape, feeling better | KEEP | Core conversion clarity and search intent. |
| 1-to-1 personal training and online coaching | KEEP | Verified by existing approved service copy. |
| Nutrition guidance and accountability | KEEP | Supported by approved copy, but should be framed as support within coaching rather than an invented standalone product. |
| Repeated restarting/inconsistency/all-or-nothing behaviour | MERGE | Strong differentiator, but should live once in Reality Check. |
| "Rebirth" and "Arete" philosophy | MERGE | Valuable brand meaning, but it belongs inside Coach & Philosophy, not a separate oversized section. |
| Abstract proof cards without client evidence | REMOVE/MERGE | Do not imply testimonial-style proof. Replace with truthful progress markers. |
| Process ideas: assessment, plan, check-ins, adjustments | KEEP | Needed for trust and comprehension. Put in How Coaching Works. |
| Coach biography and Phil image | KEEP | Genuine and humanising. |
| Fake or generic process screenshots | REMOVE | Asset inventory did not verify real app or check-in screenshots. |
| Separate proof/transformation gallery | REMOVE for now | No genuine assets exist. Preserve future component capacity only. |

## C. Accessibility

Automated Lighthouse found one consistent accessibility failure on the live baseline:

- `color-contrast`: small orange eyebrow labels on light backgrounds fail contrast.
- Reported examples include `#ffb347` on `#f2f5f7` and `#ffffff`.
- Accessibility score median: 96 on mobile and desktop.

Manual/code inspection:

- One H1 exists on the live page.
- Form controls have visible labels.
- The form includes a honeypot but no destructive client-side submission logic.
- Same-page navigation uses standard anchors.
- Focus styles are present.
- `prefers-reduced-motion` is respected in CSS and smooth scrolling script.
- No manual screen-reader validation was performed, so no screen-reader claims are made.

Accessibility conclusion: the main evidence-backed fix is contrast for light-section eyebrow labels. The redesign should preserve labels, keyboard focus, reduced-motion handling, and semantic section headings.

## D. Performance

Baseline Lighthouse medians:

| Profile | Performance | FCP | LCP | TBT | CLS | Speed Index |
|---|---:|---:|---:|---:|---:|---:|
| Mobile | 99 | 870 ms | 2055 ms | 29 ms | 0 | 1037 ms |
| Desktop | 100 | 242 ms | 468 ms | 0 ms | 0 | 321 ms |

Evidence-backed performance notes:

- The site is already fast in lab conditions.
- Lighthouse flags image delivery as an opportunity, not a severe bottleneck.
- The large full logo PNG is displayed much smaller than its intrinsic dimensions.
- Optimised hero and Phil variants exist and should remain preferred over original large images.
- No heavy JavaScript, hydration, analytics, or third-party script bottleneck was found.
- No CLS problem was observed.

Performance conclusion: preserve the static, low-JS implementation. Do not chase marginal Lighthouse gains at the expense of brand clarity or truthful content.

## Audit Conclusion

The highest-confidence work is not a rebuild. It is a simplification:

1. Fix the canonical/sitemap/social/schema issues.
2. Fix the contrast issue.
3. Reorder homepage content so fitness outcomes and service paths come first.
4. Consolidate repeated psychological messaging into one Reality Check.
5. Use a truthful process/progress system instead of fabricated proof.
6. Merge Phil and the Rebirth Arete philosophy into one human authority section.
