# Phase 2 - Baseline Lighthouse Findings

Baseline target: `https://www.the-rebirth.co.uk/`

## Method

The baseline crawl found one indexable public HTML page, so Lighthouse was run against the homepage only.

Commands used:

```powershell
npx --yes lighthouse https://www.the-rebirth.co.uk/ --output=json --output=html --output-path="audit/lighthouse-baseline/home-mobile-run-1" --chrome-flags="--headless=new --no-sandbox" --quiet
npx --yes lighthouse https://www.the-rebirth.co.uk/ --preset=desktop --output=json --output=html --output-path="audit/lighthouse-baseline/home-desktop-run-1" --chrome-flags="--headless=new --no-sandbox" --quiet
```

The same command pattern was repeated for 3 mobile and 3 desktop runs.

Note: Lighthouse produced valid JSON and HTML reports for all six runs, but each CLI process exited with a Windows temp cleanup warning:

`EPERM, Permission denied: C:\Users\ajhed\AppData\Local\Temp\lighthouse.*`

The reports were still written and parsed successfully.

## Output Files

- `audit/lighthouse-baseline/home-mobile-run-1.report.json`
- `audit/lighthouse-baseline/home-mobile-run-1.report.html`
- `audit/lighthouse-baseline/home-mobile-run-2.report.json`
- `audit/lighthouse-baseline/home-mobile-run-2.report.html`
- `audit/lighthouse-baseline/home-mobile-run-3.report.json`
- `audit/lighthouse-baseline/home-mobile-run-3.report.html`
- `audit/lighthouse-baseline/home-desktop-run-1.report.json`
- `audit/lighthouse-baseline/home-desktop-run-1.report.html`
- `audit/lighthouse-baseline/home-desktop-run-2.report.json`
- `audit/lighthouse-baseline/home-desktop-run-2.report.html`
- `audit/lighthouse-baseline/home-desktop-run-3.report.json`
- `audit/lighthouse-baseline/home-desktop-run-3.report.html`
- `audit/lighthouse-baseline/summary.csv`
- `audit/lighthouse-baseline/summary.json`
- `audit/lighthouse-baseline/summary-medians.csv`

## Median Results

These are Lighthouse lab results, not field Core Web Vitals.

| URL | Profile | Runs | Performance | Accessibility | Best Practices | SEO | FCP | LCP | TBT | CLS | Speed Index |
|---|---|---:|---:|---:|---:|---:|---:|---:|---:|---:|---:|
| `https://www.the-rebirth.co.uk/` | Mobile | 3 | 99 | 96 | 100 | 100 | 870 ms | 2055 ms | 29 ms | 0 | 1037 ms |
| `https://www.the-rebirth.co.uk/` | Desktop | 3 | 100 | 96 | 100 | 100 | 242 ms | 468 ms | 0 ms | 0 | 321 ms |

## Run-to-Run Notes

- Mobile performance scores: 98, 99, 99. Median: 99.
- Desktop performance scores: 100, 100, 100. Median: 100.
- CLS was consistently 0.
- TBT was negligible.

## Accessibility Finding

### LH-001 - Low contrast eyebrow text on light backgrounds

- Evidence: Lighthouse `color-contrast` audit failed.
- Example baseline selectors:
  - `section#about > div.container > div.section-copy > p.eyebrow`
  - `main#main > section#services > div.container > p.eyebrow`
- Example contrast values reported:
  - `#ffb347` on `#f2f5f7`: 1.62:1
  - `#ffb347` on `#ffffff`: 1.78:1
- Impact: accessibility issue for small uppercase eyebrow labels on light sections.
- Confidence: high.

## Performance Findings

### LH-002 - Image delivery opportunities are present but not severe

- Evidence: Lighthouse `image-delivery-insight` estimated about 146 KiB potential savings in one mobile run.
- Main candidates:
  - `assets/rebirth-arete-full-logo.png` displayed much smaller than intrinsic size.
  - `assets/phil-840.avif` larger than required for some mobile/tablet display sizes.
- Impact: low-to-medium. Baseline performance is already strong, but smaller logo variants or responsive logo sources would be cleaner.
- Confidence: medium.

## SEO and Best-Practice Findings

- Lighthouse SEO category scored 100, but this does not catch the live placeholder canonical found by the crawler.
- Best Practices scored 100.
- No render-blocking or main-thread bottleneck required urgent remediation.

## Interpretation

The baseline site is technically fast in Lighthouse lab conditions. The strongest Lighthouse-supported remediation is accessibility contrast for small orange eyebrow labels on light backgrounds. The strongest SEO issue remains the crawler-discovered placeholder canonical, not a Lighthouse failure.
