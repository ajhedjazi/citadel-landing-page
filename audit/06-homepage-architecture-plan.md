# Phase 6 - Homepage Architecture Plan

Date: 2026-07-08

Source evidence:

- Repository inspection confirms a static one-page site with same-page anchors.
- Asset inventory confirms genuine hero imagery, Phil photography, approved service copy, and approved biography copy.
- Asset inventory does not confirm testimonials, transformation images, measurable outcomes, app screenshots, formal credentials, or local service-area claims.
- Baseline crawl and audit show service/outcome clarity should move above brand philosophy.

## Mandated 6+1 Structure

Exactly six major content sections followed by one compact final CTA band:

1. Hero
2. Reality Check
3. Ways to Work
4. How Coaching Works
5. Real Progress
6. Coach & Philosophy
7. Compact Final CTA band

Footer remains site chrome, not a major homepage content section.

## Section Plan

| Section | ID | Purpose | Content source | Implementation notes |
|---|---|---|---|---|
| Hero | `top` | Immediate outcome and service clarity. | Approved service copy and hero imagery. | Lead with getting fitter, losing weight, building strength, feeling better. Mention 1-to-1 PT and online coaching. No unverified location copy. |
| Reality Check | `reality-check` | Recognise the core frustration once. | Existing anti-restart/consistency copy. | Merge starting/stopping, all-or-nothing behaviour, unclear plan, and life interruptions into one concise section. |
| Ways to Work | `ways-to-work` | Clear offer navigation. | Approved service copy. | Cards for 1-to-1 personal training, online coaching, and nutrition/accountability support. All route to one enquiry form. |
| How Coaching Works | `how-it-works` | Truthful process proof. | Existing process descriptions. | Use typographic steps only: starting point, plan, check-ins, adjustments. Do not show fake app/screenshots. |
| Real Progress | `progress` | Outcome/proof framework without fake proof. | Genuine coaching outcomes from approved copy. | Use truthful progress markers: consistency, strength/fitness, weight-loss habits, confidence. Preserve reusable card architecture for future proof assets. |
| Coach & Philosophy | `about` | Human authority and brand differentiation. | Phil image and approved biography/philosophy copy. | Merge Phil bio with Rebirth/Arete meaning. Do not claim formal credentials or local authority not verified. |
| Compact Final CTA | `enquire` | One obvious next step. | Existing Netlify form. | Preserve one form and all fields, but make it the single unified enquiry flow. |

## Navigation Plan

Header anchors:

- `#reality-check` -> Reality
- `#ways-to-work` -> Coaching
- `#how-it-works` -> How it works
- `#about` -> Phil
- `#enquire` -> Enquire

Hero secondary CTA should point to `#ways-to-work`.

## Production Visibility Rules

- No public placeholders for testimonials, transformation galleries, app screenshots, dashboard screens, or measurable outcomes.
- No invented client names, numbers, ratings, reviews, before/after claims, service locations, or formal credentials.
- Placeholder footer contact/review details remain documented as unresolved content risks; replacements require verified details.

## Content Movement

| Old location/theme | New location |
|---|---|
| `#fit` "Is this you?" | Merge into `#reality-check`. |
| `#services` service cards | Rename/reframe as `#ways-to-work`. |
| Current `#progress` process cards | Move into `#how-it-works`. |
| Current `#approach` philosophy section | Merge into `#about`. |
| Current abstract proof cards | Replace with truthful Real Progress cards. |
| Current full enquiry section | Retain as compact final CTA band with one form. |

## Acceptance Checks

- One H1.
- Exactly six major homepage content sections inside `main` before final CTA.
- One final CTA/enquiry band.
- Header links resolve to existing IDs.
- No duplicate IDs.
- Form labels remain associated with controls.
- No fabricated proof, locations, credentials, or testimonials.
- CSS remains within the existing token/class system.
