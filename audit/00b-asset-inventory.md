# Phase 0B - Genuine Asset Inventory

Date: 2026-07-08

This inventory covers assets present in the repository and approved content visible in the current site. It does not infer credentials, testimonials, outcomes, or service areas from filenames or strategy notes.

## Summary

| Asset / Content Type | Status | Notes |
|---|---|---|
| Rebirth Areté logo | USABLE NOW | `assets/rebirth-arete-full-logo.png`; large PNG, visually approved, but oversized for header/footer display. |
| Small emblem/logo | NEEDS REVIEW | `assets/logo.png`, `assets/logo-96.webp`; appears related but not currently primary treatment. |
| Hero photography | USABLE NOW | `hero-desktop.*`, `hero-mobile.*`; already used by approved site. |
| Coach photography | USABLE NOW | `phil-560.*`, `phil-840.*`; genuine Phil image already used. |
| Full-resolution Phil image | NEEDS REVIEW | `phil.jpg` is 12.3 MB and should not be used directly. Existing optimised variants are preferred. |
| QR code | NEEDS REVIEW | `google-review-qr.png`; usable visually, but target/review destination needs verification. |
| Training/coaching stock-like imagery | NEEDS REVIEW | `training-session.jpg`, `movement-screen.jpg`, `coach-assessment.jpg`, `app-tracking.jpg`, `gym-detail.jpg`, `diagnostic-coaching-hero.png`; usable only as generic visual atmosphere if approved, not proof. |
| Client photography | MISSING | No verified client photo assets found. |
| Transformation imagery | MISSING | No before/after or transformation proof found. |
| Testimonials | MISSING | No genuine testimonials found in repository. |
| Feedback screenshots | MISSING | No approved feedback screenshots found. |
| Client stories | MISSING | No verified client stories found. |
| Measurable outcomes | MISSING | No verified client outcome stats found. |
| App/check-in/dashboard screenshots | NEEDS REVIEW | `app-tracking.jpg` appears generic and should not be represented as Phil's actual coaching system without approval. |
| Habit/workout programming screens | MISSING | No verified screenshots of actual coaching workflow found. |
| Approved service copy | USABLE NOW | Existing page copy verifies 1:1 PT, online coaching, nutrition guidance, mindset/accountability. |
| Approved biography content | USABLE NOW | Existing copy supports Phil's own weight-loss experience and learning from an experienced trainer drawing on 30 years' coaching experience. |
| Credentials | MISSING | No formal qualifications, awards, certifications, or credentials found. |
| Location/service-area information | NEEDS REVIEW | Existing text says `In-person and online coaching`; no verified Hull/Hessle/East Riding claim in repository. |
| Contact email | NEEDS REVIEW | `hello@rebirtharete.example` is a placeholder. |
| Google review URL | NEEDS REVIEW | Footer link is `https://google.com`; needs real review link. |

## Image Asset Detail

| File | Dimensions | Size | Classification | Notes |
|---|---:|---:|---|---|
| `assets/rebirth-arete-full-logo.png` | 1285x825 | 196 KB | USABLE NOW | Approved logo, but oversized for rendered header/footer size. |
| `assets/logo.png` | 248x276 | 61 KB | NEEDS REVIEW | Secondary mark; not the current approved full logo treatment. |
| `assets/logo-96.webp` | unknown | 2.7 KB | NEEDS REVIEW | Small logo variant, likely useful if visually approved. |
| `assets/favicon.png` | 48x48 | 1.5 KB | USABLE NOW | Existing favicon. |
| `assets/hero-desktop.jpg` | 1717x916 | 129 KB | USABLE NOW | Current approved hero fallback. |
| `assets/hero-desktop.avif` | unknown | 61 KB | USABLE NOW | Current approved hero source. |
| `assets/hero-desktop.webp` | unknown | 82 KB | USABLE NOW | Current approved hero source. |
| `assets/hero-mobile.jpg` | 1200x640 | 75 KB | USABLE NOW | Current approved mobile hero fallback. |
| `assets/hero-mobile.avif` | unknown | 40 KB | USABLE NOW | Current approved mobile hero source. |
| `assets/hero-mobile.webp` | unknown | 50 KB | USABLE NOW | Current approved mobile hero source. |
| `assets/phil-560.avif` | unknown | 54 KB | USABLE NOW | Optimised coach photo. |
| `assets/phil-560.webp` | unknown | 81 KB | USABLE NOW | Optimised coach photo. |
| `assets/phil-840.jpg` | 840x840 | 152 KB | USABLE NOW | Fallback coach photo. |
| `assets/phil-840.avif` | unknown | 118 KB | USABLE NOW | Optimised coach photo. |
| `assets/phil-840.webp` | unknown | 176 KB | USABLE NOW | Optimised coach photo. |
| `assets/phil.jpg` | 4096x4096 | 12.3 MB | NEEDS REVIEW | Too large for direct site use. |
| `assets/google-review-qr.png` | 360x360 | 591 B | NEEDS REVIEW | QR code should not be recoloured; destination needs verification. |
| `assets/training-session.jpg` | 996x558 | 115 KB | NEEDS REVIEW | Generic training image; do not use as client proof. |
| `assets/movement-screen.jpg` | 1920x716 | 63 KB | NEEDS REVIEW | Generic movement/coaching image; do not use as proof. |
| `assets/coach-assessment.jpg` | 612x408 | 49 KB | NEEDS REVIEW | Generic coaching assessment image. |
| `assets/app-tracking.jpg` | 2000x1125 | 338 KB | NEEDS REVIEW | Generic app/health tracking image; do not imply actual Phil system unless approved. |
| `assets/gym-detail.jpg` | 1333x768 | 115 KB | NEEDS REVIEW | Generic gym environment image. |
| `assets/diagnostic-coaching-hero.png` | 1717x916 | 1.9 MB | NEEDS REVIEW | Large generated/stock-like coaching image; not currently used. |

## Genuine Copy Inventory

### USABLE NOW

- Personal training.
- Online coaching.
- Weight loss support.
- Practical nutrition guidance.
- Mindset/accountability/feedback.
- Stopping repeated restarts.
- Rebirth as the daily chance to start again.
- Areté as holding yourself to a higher standard without pretending to be perfect.
- Phil's approach shaped by his own battles with weight loss.
- Phil learned from an experienced trainer drawing on 30 years of coaching experience.

### NEEDS REVIEW

- Exact service area/location.
- Exact enquiry/consultation naming.
- Real email address.
- Real Google review URL.
- QR code destination.

### MISSING

- Verified client testimonials.
- Verified measurable outcomes.
- Verified transformation images.
- Verified client case studies.
- Verified app/check-in/process screenshots.
- Formal qualifications/certifications/credentials.

## Implementation Implications

- Production homepage must not show fake proof placeholders.
- Process/proof sections should be typographic and explanation-led until genuine proof assets exist.
- The architecture can include reusable proof/process card classes, but not public fake content.
- Any local/location SEO copy should wait for verified service-area details.
