# Phase 7 - Post-Change Crawl Findings

Post-change target: `http://127.0.0.1:4173/`

The site was served locally as static production files after regenerating `styles.min.css`.

## Output Files

- `audit/post-crawl.csv`
- `audit/post-crawl.json`
- `audit/post-link-errors.csv`
- `audit/post-metadata-matrix.csv`
- `audit/post-crawl-summary.json`

## Summary

| Metric | Baseline Live | Post Local |
|---|---:|---:|
| Crawled HTML URLs | 1 | 1 |
| Indexable HTML URLs | 1 | 1 |
| 3xx URLs in crawl set | 0 | 0 |
| 4xx URLs in crawl set | 0 | 0 |
| 5xx URLs in crawl set | 0 | 0 |
| Broken links detected | 0 | 0 |
| Missing canonicals | 0 | 0 |
| Missing meta descriptions | 0 | 0 |
| Missing Open Graph metadata | 1 | 0 |
| Missing Twitter metadata | 1 | 0 |
| Missing structured data | 1 | 0 |
| Images missing alt text | 0 | 0 |

## Canonical Note

The local post-change crawl reports `selfCanonical: no` because the local URL is `http://127.0.0.1:4173/` and the canonical correctly points to the intended production URL:

`https://www.the-rebirth.co.uk/`

This should become self-canonical once deployed to the production domain.

## Post-Change Homepage Evidence

- Title: `Rebirth Areté | Personal Training & Online Coaching`
- Meta description: `Personal training and online coaching from Rebirth Areté for people who want to get fitter, lose weight, build strength and feel better in themselves.`
- H1 count: 1
- H1 text: `Get fitter. Lose weight. Build strength. Feel better in yourself.`
- H2 count: 7
- Approximate visible word count: 618
- Open Graph metadata: present
- Twitter metadata: present
- Structured data blocks: 1
- JSON-LD parse success: yes
- Broken links: 0

## Improvements Confirmed by Crawl

- Homepage canonical changed from placeholder domain to production domain.
- Homepage proposition is now explicit in the H1.
- Meta description now includes personal training, online coaching, getting fitter, weight loss, strength, and feeling better.
- Social metadata added.
- Conservative JSON-LD added.
- No duplicate IDs or missing anchor targets were detected by local structural checks.

## Remaining Crawl/Content Risks

- Production deployment must include `robots.txt` and `sitemap.xml` for the sitemap fix to be externally visible.
- Contact email, Google review destination, QR code target, and service-area copy still need verified client details.
- No genuine testimonial/transformation proof exists in the repository, so proof remains process-based rather than outcome-evidence-based.
