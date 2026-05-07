# Video / Motion Background Specs — Longevity One Homepage

Reference: [Clinique La Prairie](https://www.cliniquelaprairie.com) style — slow cinematic loops, luxury medical aesthetic, muted color grading.

---

## General Technical Requirements

| Property | Value |
|---|---|
| **Format** | MP4 (H.264) for web, WebM (VP9) as fallback |
| **Frame rate** | 24fps (cinematic) or 30fps |
| **Bitrate** | 4–6 Mbps desktop, 1.5–2 Mbps mobile variant |
| **Loop** | Seamless — first and last frames should match |
| **Duration** | 8–15 seconds per loop |
| **Audio** | None (muted, no audio track to reduce file size) |
| **Color palette** | Bone white (#E7DECC), dark brown (#422922), burnt orange (#D45800) — grade footage to match |
| **Color grading** | Desaturated warm tones, low contrast, slight grain for luxury feel |
| **Motion** | Slow, deliberate — 0.25× to 0.5× real-time. No fast cuts or shaky cam. |

### Deliver Two Versions Per Video

| Version | Resolution | Max file size |
|---|---|---|
| **Desktop** | 1920 × 1080 px (16:9) | ≤ 8 MB |
| **Mobile** | 1080 × 1920 px (9:16) or 1080 × 1080 (1:1) | ≤ 4 MB |

> Mobile versions will be cropped via `object-fit: cover` — keep subject centered.

---

## Section-by-Section Specs

---

### 1. HERO — Full-Screen Background Video

| Property | Value |
|---|---|
| **Section height** | `100vh` (full viewport) |
| **CSS class** | `absolute inset-0` — fills entire section |
| **Overlay** | `bg-bone-white/60` semi-transparent + `backdrop-blur-[2px]` |
| **Video filter** | `grayscale(100%) contrast(1.1) brightness(1.2)` applied via CSS |
| **File name** | `hero-bg.mp4` / `hero-bg.webm` |
| **Desktop resolution** | **1920 × 1080** (16:9) |
| **Mobile resolution** | **1080 × 1920** (9:16) |
| **Duration** | 12–15 seconds, seamless loop |
| **Focal point** | Dead center (text overlays center of screen) |

**Content direction:**
Slow aerial or tracking shot of a luxury medical/wellness interior — think warm-toned marble corridors, natural light filtering through floor-to-ceiling windows, a pristine treatment room with warm wood and stone textures. Alternatively: macro shots of nature (water rippling, light through leaves) that evoke precision and calm. No faces needed — environment only.

**Safe zone:** Keep the center 60% of the frame clean/subtle — large heading text ("Master Your Biological Time") sits here. Visual interest should be in the periphery.

---

### 2. JOURNEY — Right-Side Decorative Motion

| Property | Value |
|---|---|
| **Section height** | ~600–900px (content-dependent) |
| **CSS class** | `absolute right-0 top-0 w-1/2 h-full` — right half only |
| **Overlay** | `opacity-15 grayscale mix-blend-multiply` |
| **File name** | `journey-bg.mp4` / `journey-bg.webm` |
| **Desktop resolution** | **960 × 1080** (half-width, 8:9) |
| **Mobile resolution** | Not needed (hidden on mobile, or use 1080×1080 square) |
| **Duration** | 10 seconds, seamless loop |

**Content direction:**
Abstract slow-motion of scientific/medical imagery — DNA helix rotating, molecular structures floating, soft bokeh lights moving upward, or a close-up of precision equipment with subtle mechanical motion. Very soft and barely visible at 15% opacity — texture more than content.

**Safe zone:** Entire left half is unused. Keep interesting details in the right 50%.

---

### 3. PILLARS — Full-Width Atmospheric Texture

| Property | Value |
|---|---|
| **Section height** | ~500–800px |
| **Background** | Dark brown (#422922) solid color behind video |
| **CSS class** | `absolute inset-0` — full section coverage |
| **Overlay** | `opacity-10 grayscale mix-blend-overlay` |
| **File name** | `pillars-bg.mp4` / `pillars-bg.webm` |
| **Desktop resolution** | **1920 × 1080** (16:9) |
| **Mobile resolution** | **1080 × 1080** (1:1) |
| **Duration** | 10 seconds, seamless loop |

**Content direction:**
Very subtle atmospheric motion — slow-moving particles, gently drifting smoke or fog, abstract light caustics on a dark surface, or microscopic cell division footage. This sits at just 10% opacity on a dark brown background, so it should be predominantly light tones on a dark field (the overlay blend will pick up the highlights).

**Safe zone:** Text is centered (heading) and in a 3-column grid below. Keep the motion uniform — no strong focal point.

---

### 4. SCIENCE — Right-Side Detail Motion

| Property | Value |
|---|---|
| **Section height** | ~500–700px |
| **CSS class** | `absolute right-0 bottom-0 w-1/3 h-full` — right third only |
| **Overlay** | `opacity-10 grayscale` |
| **File name** | `science-bg.mp4` / `science-bg.webm` |
| **Desktop resolution** | **640 × 1080** (1:1.7, roughly right third) |
| **Mobile resolution** | Not needed (hidden on mobile) |
| **Duration** | 10 seconds, seamless loop |

**Content direction:**
Close-up of diagnostic technology in action — a body scanner rotating, data visualization on a screen, or a PNOE metabolic testing mask with subtle breathing motion. Could also be abstract: a slow pulse of light, oscillating waveforms, or a heartbeat visualization. Very subtle at 10% opacity.

**Safe zone:** Left two-thirds are content (text + tech grid). All visual interest in the right third.

---

### 5. TEAM — Full Background Video (New)

| Property | Value |
|---|---|
| **Section height** | ~400–600px |
| **Background** | Dark brown (#422922) solid color behind video |
| **CSS class** | `absolute inset-0` (to be added) |
| **Overlay** | `opacity-15 grayscale mix-blend-overlay` (to be added) |
| **File name** | `team-bg.mp4` / `team-bg.webm` |
| **Desktop resolution** | **1920 × 1080** (16:9) |
| **Mobile resolution** | **1080 × 1080** (1:1) |
| **Duration** | 10 seconds, seamless loop |

**Content direction:**
Soft-focus footage of a medical team in a luxury clinic setting — white coats, warm lighting, collaborative discussion around a table, or walking through a modern corridor. Alternatively: slow pan across framed credentials, a stethoscope on a marble surface, hands writing notes. The human element matters here but keep it aspirational, not clinical.

**Safe zone:** All text is centered. Keep visual interest at the edges/periphery.

---

### 6. CTA — Dramatic Full Background

| Property | Value |
|---|---|
| **Section height** | ~400–600px |
| **Background** | Black (#000000) solid behind video |
| **CSS class** | `absolute inset-0 scale-110` — slightly zoomed for parallax feel |
| **Overlay** | `opacity-40 grayscale mix-blend-overlay` |
| **Video filter** | Grayscale applied via CSS |
| **File name** | `cta-bg.mp4` / `cta-bg.webm` |
| **Desktop resolution** | **2112 × 1188** (1920×1080 + 10% for scale-110) |
| **Mobile resolution** | **1188 × 2112** (9:16 + 10%) |
| **Duration** | 12 seconds, seamless loop |

**Content direction:**
The most dramatic section — slow-motion of a human silhouette in moody lighting, a person exhaling in cold air (visible breath), slow heartbeat monitoring visualization, or an extreme close-up of an eye with data reflections. This is at 40% opacity — the highest visibility of all background videos — so composition matters more here. Think cinematic, almost like a movie trailer frame.

**Safe zone:** Text is centered, large heading ("Stop Guessing. Start Measuring."). Keep the subject slightly off-center or use even lighting with no harsh focal points.

---

## File Placement

```
public/
  videos/
    hero-bg.mp4
    hero-bg.webm
    hero-bg-mobile.mp4
    journey-bg.mp4
    journey-bg.webm
    pillars-bg.mp4
    pillars-bg.webm
    science-bg.mp4
    science-bg.webm
    team-bg.mp4
    team-bg.webm
    cta-bg.mp4
    cta-bg.webm
    cta-bg-mobile.mp4
```

## Poster Images (Fallbacks)

Each video needs a matching still frame as a poster/fallback:

```
public/
  images/
    hero-bg.jpg       ← already referenced in code
    journey-bg.jpg    ← already referenced
    pillars-bg.jpg    ← already referenced
    science-bg.jpg    ← already referenced
    team-bg.jpg       ← new
    cta-bg.jpg        ← already referenced
```

**Poster specs:** Same resolution as desktop video, JPEG quality 80, ≤ 200 KB each.

---

## AI Video Generation Prompts

If using **Runway Gen-3**, **Pika**, **Kling**, or **Sora**, use these prompts:

### Hero
> Slow cinematic tracking shot through a luxury wellness clinic interior, warm natural light filtering through floor-to-ceiling windows onto marble surfaces, golden hour tones, shallow depth of field, no people visible, 4K, 24fps, 12 seconds

### Journey
> Abstract macro shot of DNA double helix rotating slowly in warm amber light, soft bokeh particles floating upward, dark background, scientific yet elegant, 4K, 24fps, 10 seconds

### Pillars
> Microscopic view of cells dividing in warm-toned lighting, soft particle effects, dark background with highlights, abstract biological motion, luxury medical aesthetic, 4K, 24fps, 10 seconds

### Science
> Close-up of modern diagnostic equipment with subtle LED indicators pulsing, precision medical technology, warm metallic tones, shallow depth of field, slow pan, 4K, 24fps, 10 seconds

### Team
> Soft-focus slow-motion of medical professionals in white coats walking through a modern clinic with warm wood and marble interiors, natural light, collaborative atmosphere, 4K, 24fps, 10 seconds

### CTA
> Dramatic close-up of a human silhouette in moody side-lighting, subtle breath visible in cool air, cinematic contrast, dark background, aspirational and powerful, 4K, 24fps, 12 seconds

---

## Implementation Notes

Once videos are generated and placed in `public/videos/`, the code will be updated to:

1. Replace `<div>` background-image elements with `<video>` tags
2. Add `autoPlay muted loop playsInline` attributes
3. Use `poster` attribute pointing to the JPEG fallback
4. Add `<source>` tags for WebM (primary) and MP4 (fallback)
5. Keep all existing CSS filters and opacity overlays
6. Add `prefers-reduced-motion` media query to show poster-only for accessibility
