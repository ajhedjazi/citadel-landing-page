# Phase 8 - Post-Change Verification

Date: 2026-07-08

Local verification target: `http://127.0.0.1:4173/`

Production baseline target: `https://www.the-rebirth.co.uk/`

## Commands Run

Static asset generation:

```powershell
npx --yes lightningcss-cli --minify styles.css --output-file styles.min.css
npx --yes terser script.js --compress --mangle --output script.min.js
```

Local production-like static serve:

```powershell
npx --yes http-server . -p 4173 -c-1 --silent
```

Post-change crawl:

```powershell
node audit/crawl-site.mjs http://127.0.0.1:4173/ post
```

Post-change Lighthouse matrix:

```powershell
npx --yes lighthouse http://127.0.0.1:4173/ --output=json --output=html --output-path="audit/lighthouse-post/home-mobile-run-1" --chrome-flags="--headless=new --no-sandbox" --quiet
npx --yes lighthouse http://127.0.0.1:4173/ --preset=desktop --output=json --output=html --output-path="audit/lighthouse-post/home-desktop-run-1" --chrome-flags="--headless=new --no-sandbox" --quiet
```

The same Lighthouse command pattern was run for 3 mobile and 3 desktop passes.

## Build / Lint / Test Status

| Check | Result | Notes |
|---|---|---|
| Repository-native build | Not available | No `package.json` or build scripts exist. Static assets were regenerated instead. |
| Repository-native lint | Not available | No lint script exists. |
| Repository-native typecheck | Not available | No TypeScript or typecheck script exists. |
| Repository-native tests | Not available | No test framework exists. |
| CSS minification | Passed | `styles.min.css` regenerated. |
| JS minification | Passed | `script.min.js` regenerated. |
| Static serve | Passed | `curl.exe -I http://127.0.0.1:4173/` returned `200 OK`. |
| Structural HTML check | Passed | No duplicate IDs, no missing anchors, JSON-LD parsed. |
| `git diff --check` | Passed | Only Git line-ending warnings were reported. |
| `html-validate` advisory | Failed | Existing conventions: lowercase doctype and self-closing HTML void tags. No accessibility/anchor/schema issues were reported by this check. |

## Crawl Before Vs After

| Metric | Baseline live | Post local | Notes |
|---|---:|---:|---|
| Crawled HTML URLs | 1 | 1 | Single-page static site. |
| Indexable HTML URLs | 1 | 1 | No noindex detected. |
| 3xx URLs | 0 | 0 | Crawl set only. |
| 4xx URLs | 0 | 0 | No broken public route found. |
| 5xx URLs | 0 | 0 | No server error found. |
| Broken links | 0 | 0 | Controlled crawl did not submit forms. |
| Missing canonical | 0 | 0 | Canonical tag exists in both. |
| Non-self canonical | 1 | 1 | Baseline was a real issue: placeholder canonical. Post local is expected because localhost canonical correctly points to production. |
| Missing meta descriptions | 0 | 0 | Present both before and after. |
| Missing Open Graph metadata | 1 | 0 | Fixed. |
| Missing Twitter metadata | 1 | 0 | Fixed. |
| Missing structured data | 1 | 0 | Fixed with conservative Organization/WebSite JSON-LD. |
| Images missing alt | 0 | 0 | Preserved. |

Post-crawl caveats:

- `sitemapMembership: no`, `non-https`, and `non-www` are expected in the local crawl because the verified canonical and sitemap point to `https://www.the-rebirth.co.uk/`.
- Static inspection confirms the canonical is now `https://www.the-rebirth.co.uk/`.
- The production sitemap and robots changes are present in the repo but require deployment before live validation.

## Lighthouse Before Vs After

These are Lighthouse lab results, not real-user field data.

| Profile | URL | Runs | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| Baseline mobile | `https://www.the-rebirth.co.uk/` | 3 | 99 | 96 | 100 | 100 | 870 ms | 2055 ms | 29 ms | 0 | 1037 ms |
| Post mobile | `http://127.0.0.1:4173/` | 3 | 93 | 100 | 100 | 100 | 1135 ms | 3155 ms | 30 ms | 0 | 1135 ms |
| Baseline desktop | `https://www.the-rebirth.co.uk/` | 3 | 100 | 96 | 100 | 100 | 242 ms | 468 ms | 0 ms | 0 | 321 ms |
| Post desktop | `http://127.0.0.1:4173/` | 3 | 100 | 100 | 100 | 100 | 307 ms | 665 ms | 0 ms | 0 | 307 ms |

## Regressions And Tradeoffs

- Mobile Performance decreased from 99 to 93, with LCP increasing from about 2.06s to about 3.16s in lab conditions.
- Likely causes: more above-the-fold/header text, fuller homepage content, and local/static test-condition differences versus the live production host.
- Accessibility improved from 96 to 100 after fixing the contrast issue.
- CLS remained 0.
- Desktop Performance remained 100.

Further performance remediation is not urgent, but the next best optimisation would be generating smaller approved logo assets and reviewing hero image LCP behaviour after deployment.

## Visual QA

Screenshots captured:

- `audit/post-home-desktop.png`
- `audit/post-home-mobile.png`

Manual visual inspection confirmed:

- Header brand is visible on desktop and mobile.
- Hero communicates fitness outcomes in the first viewport.
- Mobile nav and CTAs fit without overlap.
- The 6+1 homepage order is visible and coherent.

## Final Section Order

Structural check result:

```text
top > reality-check > ways-to-work > how-it-works > progress > about > enquire
```

This matches the mandated six major sections plus one compact final CTA band.
