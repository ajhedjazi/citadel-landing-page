# Phase 0 - Repository Inspection

Date: 2026-07-08

## Current Repository State

- Branch: `main`
- Remote: `https://github.com/ajhedjazi/citadel-landing-page.git`
- Current HEAD: `ea4d59c Apply new Rebirth Areté fitness brand colour palette`
- Working tree at this phase: uncommitted changes exist from the previous homepage/audit pass:
  - `index.html`
  - `styles.css`
  - `styles.min.css`
  - `robots.txt`
  - `sitemap.xml`
  - `audit/`
- Baseline evidence source: live production site `https://www.the-rebirth.co.uk/`.
- Post-change candidate source: local working tree served as static production files.

The working tree was already modified before this stricter audit brief was received. No app-code edits were made for this new pass before completing repository inspection, asset inventory, and baseline evidence review.

## Stack

- Framework: none detected.
- Application type: static single-page site.
- Package manager: none detected.
- Production dependencies: none detected.
- Build system: no repository-native build system or package script.
- Homepage entry point: `index.html`.
- Public route map:
  - `/`
  - same-page hash anchors only.
- Route generation method: static file.

## Available Commands

No `package.json`, lockfile, or framework config exists. Therefore no repository scripts exist for:

- build
- lint
- typecheck
- tests

Audit/build commands selected without modifying production dependencies:

- CSS production asset generation:
  - `npx --yes lightningcss-cli --minify styles.css --output-file styles.min.css`
- Static local serving:
  - `npx --yes http-server . -p 4173 -c-1 --silent`
- Lighthouse:
  - `npx --yes lighthouse <url> ...`
- HTML validation advisory:
  - `npx --yes html-validate@latest index.html`
- Custom audit-only scripts:
  - `audit/crawl-site.mjs`
  - `audit/summarize-lighthouse.mjs`
  - `audit/competitor-snapshot.mjs`

Audit-only tooling was added under `audit/`. No production dependencies were added.

## Architecture

- Shared layout components: static HTML fragments inside `index.html`.
- Navigation: sticky header with same-page hash links.
- Footer: static footer with logo panel, contact panel, review/QR panel.
- Component system: CSS class-based static components.
- JavaScript:
  - `script.js` source
  - `script.min.js` served
  - smooth scrolling for same-page anchors
  - sticky header scrolled state
  - current-year injection
  - active nav state with `IntersectionObserver`
- Forms:
  - Netlify-style static enquiry form with honeypot field.
  - No custom client-side submission code.
  - Crawls must not submit this form.

## Styling System

- Source stylesheet: `styles.css`
- Served stylesheet: `styles.min.css`
- Styling architecture: global CSS with reusable section/card/form/nav/footer classes.
- Design tokens: CSS variables in `:root`.

Current approved palette tokens:

- `--color-dark: #1E2A33`
- `--color-accent: #FFB347`
- `--color-white: #FFFFFF`
- `--color-soft: #F2F5F7`
- `--color-muted: #C9D3DC`
- derived dark/accent hover tokens are also present.

## Fonts

Local font files:

- `assets/fonts/inter-latin.woff2`
- `assets/fonts/playfair-display-latin.woff2`

Both are declared with `font-display: swap`.

## Image Handling

- Static image assets under `assets/`.
- Hero image is CSS background with AVIF/WebP/JPEG `image-set`.
- Phil image uses `<picture>` with AVIF/WebP/JPEG sources.
- QR image is a static PNG.
- Logo is currently a large PNG reused in header/footer.

## Metadata / SEO Implementation

- Metadata is hard-coded in `index.html`.
- Canonical is hard-coded in `index.html`.
- Open Graph/Twitter metadata are hard-coded in `index.html` in the current working tree.
- JSON-LD is hard-coded in `index.html` in the current working tree.
- `robots.txt` and `sitemap.xml` exist in the current working tree.
- No analytics scripts detected.
- No hreflang detected.

## Redirects / Deployment

- No deployment configuration detected:
  - no `netlify.toml`
  - no `_redirects`
  - no `vercel.json`
  - no Render config
- Live HTTP headers suggest the site is served behind Cloudflare/Render, but redirect/caching config is not controlled in this repository.
- Hosting-level redirect changes cannot be implemented from this repo unless a deployment config is added and supported by the host.

## Existing Tests / Lint / Typecheck

- No test framework detected.
- No lint/typecheck commands detected.
- `html-validate` can be run as advisory only; it flags existing project conventions such as lowercase doctype and self-closing void tags.

## Known Constraints

- No real client testimonials, transformation imagery, measurable outcomes, or approved case studies are present in the repository.
- Contact email remains a placeholder in the repository.
- Google review link remains a generic placeholder (`https://google.com`) in the repository.
- Service area/location details are not verified in the repository.
- Some image assets are generic stock-like fitness/coaching imagery and should not be treated as proof.
- The full-size `phil.jpg` is very large and should not be used directly in production.

## Proposed Audit Methodology

1. Treat the live site as baseline.
2. Treat the local working tree as the post-change candidate.
3. Reuse existing audit scripts and evidence where still applicable.
4. Add the missing Phase 0B asset inventory.
5. Update audit documentation to the stricter required naming and 6+1 architecture.
6. Implement only high-confidence changes after baseline evidence and prioritisation.
7. Verify with the same crawl and Lighthouse method before final reporting.
