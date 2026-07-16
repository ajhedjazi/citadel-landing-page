# Phase 1 - Baseline Crawl Findings

Baseline target: `https://www.the-rebirth.co.uk/`

## Method

- Same-origin crawl only.
- Discovery sources used:
  - `https://www.the-rebirth.co.uk/robots.txt`
  - `https://www.the-rebirth.co.uk/sitemap.xml`
  - repository route `/`
  - homepage internal links
  - recursively discovered same-origin links
- Forms were not submitted.
- `mailto:`, `tel:`, fragments, and non-HTTP schemes were ignored.
- Tracking query parameters were normalised.
- Crawl was intentionally low volume and low concurrency.

## Output Files

- `audit/baseline-crawl.csv`
- `audit/baseline-crawl.json`
- `audit/baseline-link-errors.csv`
- `audit/baseline-metadata-matrix.csv`
- `audit/baseline-crawl-summary.json`

## Summary

| Metric | Baseline |
|---|---:|
| Crawled HTML URLs | 1 |
| Indexable HTML URLs | 1 |
| 3xx URLs in crawl set | 0 |
| 4xx URLs in crawl set | 0 |
| 5xx URLs in crawl set | 0 |
| Broken links detected | 0 |
| Missing canonicals | 0 |
| Non-self canonicals | 1 |
| Missing meta descriptions | 0 |
| Missing Open Graph metadata | 1 |
| Missing Twitter metadata | 1 |
| Missing structured data | 1 |
| Images missing alt text | 0 |

## Robots and Sitemap

- `robots.txt`: `200 OK`
- Robots content:
  - `User-agent: *`
  - `Allow: /`
- `sitemap.xml`: `404 Not Found`
- No sitemap URL was declared in `robots.txt`.

## URL Variant Checks

Manual header checks showed:

- `http://www.the-rebirth.co.uk/` redirects to `https://www.the-rebirth.co.uk/`.
- `https://the-rebirth.co.uk/` redirects to `https://www.the-rebirth.co.uk/`.
- `http://the-rebirth.co.uk/` redirects first to `https://the-rebirth.co.uk/`, then to `https://www.the-rebirth.co.uk/`.

The non-www HTTP variant therefore has a two-hop redirect chain. This is not severe for a single-page site, but a direct one-hop canonical redirect would be cleaner if hosting controls allow it.

## Page Findings

### `https://www.the-rebirth.co.uk/`

- Status: `200`
- Indexable: yes
- Title: `Rebirth Areté | Personal Training, Weight Loss & Mindset Coaching`
- Meta description: present, 140 characters
- H1 count: 1
- H1 text: `For the part of you that knows you could be doing better.`
- H2 count: 5
- Approximate visible word count: 558
- Images: 4
- Missing image alt text: 0

## Evidence-Based Issues

### CRAWL-001 - Canonical points to placeholder domain

- Evidence: homepage canonical is `https://www.rebirtharete.example/`.
- Impact: high SEO risk because the only indexable page declares a different placeholder canonical URL.
- Confidence: high.

### CRAWL-002 - Sitemap missing

- Evidence: `https://www.the-rebirth.co.uk/sitemap.xml` returns `404`.
- Impact: low-to-medium for a one-page site, but it weakens explicit URL discovery and should be fixed.
- Confidence: high.

### CRAWL-003 - No Open Graph or Twitter metadata

- Evidence: crawler found no `og:*` or `twitter:*` metadata.
- Impact: social sharing previews may be poor or inconsistent.
- Confidence: high.

### CRAWL-004 - No structured data

- Evidence: zero JSON-LD blocks detected.
- Impact: missed opportunity for basic WebSite/Organization-style entity clarity. Avoid LocalBusiness schema unless truthful business address/service area data is supplied.
- Confidence: high.

### CRAWL-005 - Homepage commercial proposition is weak in H1

- Evidence: baseline H1 is philosophical: `For the part of you that knows you could be doing better.`
- Impact: UX/content clarity issue more than a crawlability issue. The title and description mention PT/weight loss, but the primary on-page heading does not immediately state the service or concrete fitness outcome.
- Confidence: high.

## Non-Issues Observed

- No broken internal links were found.
- No broken external links were found by the controlled crawl.
- No duplicate titles/descriptions were possible in the crawl set because there is only one indexable HTML URL.
- No missing alt text was found in the live HTML.
