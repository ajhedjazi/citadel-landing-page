# Phase 8 - Post-Change Lighthouse Findings

Post-change target: `http://127.0.0.1:4173/`

The site was served locally as static production files after regenerating `styles.min.css`.

## Method

The same Lighthouse matrix as baseline was repeated:

- 3 mobile homepage runs
- 3 desktop homepage runs
- JSON and HTML reports saved
- Same Lighthouse CLI and Chrome flags

Note: as in the baseline pass, Lighthouse produced valid reports but each CLI process exited with a Windows temp cleanup warning:

`EPERM, Permission denied: C:\Users\ajhed\AppData\Local\Temp\lighthouse.*`

## Output Files

- `audit/lighthouse-post/home-mobile-run-1.report.json`
- `audit/lighthouse-post/home-mobile-run-1.report.html`
- `audit/lighthouse-post/home-mobile-run-2.report.json`
- `audit/lighthouse-post/home-mobile-run-2.report.html`
- `audit/lighthouse-post/home-mobile-run-3.report.json`
- `audit/lighthouse-post/home-mobile-run-3.report.html`
- `audit/lighthouse-post/home-desktop-run-1.report.json`
- `audit/lighthouse-post/home-desktop-run-1.report.html`
- `audit/lighthouse-post/home-desktop-run-2.report.json`
- `audit/lighthouse-post/home-desktop-run-2.report.html`
- `audit/lighthouse-post/home-desktop-run-3.report.json`
- `audit/lighthouse-post/home-desktop-run-3.report.html`
- `audit/lighthouse-post/summary.csv`
- `audit/lighthouse-post/summary.json`
- `audit/lighthouse-post/summary-medians.csv`

## Median Results

These are Lighthouse lab results, not field Core Web Vitals.

| URL | Profile | Runs | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `http://127.0.0.1:4173/` | Mobile | 3 | 93 | 100 | 100 | 100 | 1133 ms | 3156 ms | 23 ms | 0 | 1133 ms |
| `http://127.0.0.1:4173/` | Desktop | 3 | 100 | 100 | 100 | 100 | 308 ms | 666 ms | 0 ms | 0 | 308 ms |

## Before vs After Lighthouse Median

| Profile | Metric | Baseline Live | Post Local | Change |
|---|---|---:|---:|---:|
| Mobile | Performance | 99 | 93 | -6 |
| Mobile | Accessibility | 96 | 100 | +4 |
| Mobile | Best Practices | 100 | 100 | 0 |
| Mobile | SEO | 100 | 100 | 0 |
| Mobile | LCP | 2068 ms | 3156 ms | +1088 ms |
| Mobile | CLS | 0 | 0 | 0 |
| Desktop | Performance | 100 | 100 | 0 |
| Desktop | Accessibility | 96 | 100 | +4 |
| Desktop | Best Practices | 100 | 100 | 0 |
| Desktop | SEO | 100 | 100 | 0 |
| Desktop | LCP | 487 ms | 666 ms | +179 ms |
| Desktop | CLS | 0 | 0 | 0 |

## Improvements

### LH-001 fixed - Color contrast

- Baseline Accessibility: 96.
- Post Accessibility: 100.
- Post `color-contrast` audit passes.
- The fix changed light-section eyebrow text to dark slate while retaining orange accent lines and orange labels on dark sections.

## Regressions / Tradeoffs

### Mobile performance median dropped from 99 to 93

- Post-change LCP median increased from 2068 ms to 3156 ms.
- The post-change test was run on a local static server rather than the live CDN, so the comparison is useful but not perfect.
- The page is longer after the content restructure, and the local server lacks production CDN behaviour.
- CLS remained 0 and TBT remained low.
- No urgent remediation is justified from this alone, but a production post-deploy Lighthouse run should be repeated.

## Remaining Performance Opportunity

### Oversized logo asset

Lighthouse still flags image delivery savings, mostly:

- `assets/rebirth-arete-full-logo.png` displayed around 150px wide but intrinsically 1285x825.

Recommendation:

- Create smaller WebP/PNG logo variants and use responsive logo sources.
- Keep the current logo treatment and do not remove brand imagery just to chase a score.

## Interpretation

The high-confidence accessibility issue was fixed. The SEO and Best Practices categories remain strong. The mobile performance regression should be disclosed, but it is not enough to reverse the hierarchy/content improvements without a production CDN retest.
