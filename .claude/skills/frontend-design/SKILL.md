# LongevityOne — Brand Guidelines for Claude Code

> Source of truth: Visual Identity Guidelines.pdf in project files
> Claude Code must follow these rules on every component it creates

---

## Brand Essence

- **Tagline:** The Art of Living Longer
- **Category:** Preventive Medicine Center — luxury longevity clinic
- **Positioning:** Georgian-first, internationally minded. Ancient Greek aesthetic meets cutting-edge science.
- **Voice:** Authoritative. Warm. Precise. Never clinical in a cold way. Never overpromising.
- **Visual mood:** Editorial. Timeless. Classical sculpture. Cream, brown, occasional burnt orange.

---

## Colour System

Use these as Tailwind custom colours in tailwind.config.ts:

```typescript
// tailwind.config.ts
colors: {
  'bone': '#E7DECC',      // Primary background — use most
  'brown': '#422922',     // Primary text and headings
  'orange': '#D45800',    // Accent — use sparingly
  'blue': '#AFD1E6',      // Secondary accent
  'black': '#000000',     // High-contrast elements
}
```

### Usage rules
- **Bone white (`#E7DECC`):** Primary background on all pages. Conveys warmth and luxury.
- **Dark brown (`#422922`):** All headings and body text. Never pure black for text.
- **Burnt orange (`#D45800`):** CTAs, price highlights, hover underlines, logo accent. Never use as a large background area.
- **Light blue (`#AFD1E6`):** Subtle UI states, badges, secondary information. Use very sparingly.
- **Black (`#000000`):** High-contrast overlays (dark sections), certain poster-style compositions.

### Forbidden
- No gradients between brand colours
- No colour not in this palette
- Burnt orange on dark brown background — check contrast before use
- Never use grey — use bone white lightened or dark brown lightened

---

## Typography

### Font: Mersad
Self-host all weights in `/public/fonts/`. Load via @font-face in globals.css.

```css
/* globals.css */
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/Mersad-Thin.woff2') format('woff2');
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/Mersad-Regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/Mersad-SemiBold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/Mersad-Black.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
/* Georgian script uses the same Mersad family */
```

### Tailwind typography scale
```typescript
// tailwind.config.ts
fontFamily: {
  sans: ['Mersad', 'system-ui', 'sans-serif'],
},
fontSize: {
  'display': ['clamp(3rem, 8vw, 7rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
  'display-sm': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.01em' }],
  'heading': ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.15' }],
  'body-lg': ['1.125rem', { lineHeight: '1.7' }],
  'body': ['1rem', { lineHeight: '1.7' }],
  'caption': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.1em' }],
}
```

### Usage patterns
- **Page hero headline:** Display size, Mersad Black (900), bone-white on dark or dark-brown on bone
- **Section headings:** Display-sm, Mersad Semi-bold (600), dark-brown
- **Eyebrow text:** Caption size, Mersad Thin (100), tracked wide (0.2em), uppercase
- **Body text:** Body size, Mersad Regular (400), dark-brown
- **Price/highlight:** Heading size, Mersad Black, burnt-orange
- **Navigation:** Caption size, Mersad Regular, uppercase, tracked

---

## Logo

- **English version and Georgian version** both exist — use ka version on Georgian pages, en on English
- **Minimum sizes:** 120px (full lockup), 80px (compact), 32px (icon only)
- **Exclusion zone:** clear space equal to the height of the "L" in LONGEVITY on all sides
- **On dark backgrounds:** use bone-white version
- **On bone/light backgrounds:** use dark-brown version
- **Never:** stretch, rotate, recolour, add shadow, place on busy background without overlay

---

## Imagery Style

The brand uses classical Greek and Roman sculpture as its visual language:
- Discobolus (discus thrower) — movement, athletic peak
- Classical busts and portraits — intellectual authority, timeless beauty
- Amphora silhouette — heritage, craft, containment

### Photographic treatment
- Desaturated or monochrome with bone-white tint overlay
- High contrast, dramatic crop — faces often cropped at brow or chin
- Never corporate stock photography (handshakes, stethoscopes on white backgrounds)
- Scientific imagery: clean macro shots of cells, DNA, lab equipment — minimal, precise
- Nature: mountains, water — only if connecting to Georgia's landscape specifically

### Image composition in code
```typescript
// Always use next/image
// Always crop dramatically — never show full frame if a tight crop is possible
// Use aspect-ratio classes in Tailwind, not fixed pixel heights
<Image
  src={imageUrl}
  alt={alt_ka || alt_en}
  fill
  className="object-cover object-center"
  priority // only for above-fold
/>
```

---

## Spacing & Layout

- **Max content width:** 1400px (`max-w-screen-xl`)
- **Section padding:** 80px top/bottom on desktop, 48px on mobile (`py-20 md:py-32`)
- **Grid:** 12-column on desktop, 4-column on mobile
- **Gutter:** 24px on desktop, 16px on mobile
- **Generous whitespace is not wasted space — it is luxury**

---

## UI Component Style

### Buttons
```typescript
// Primary CTA
className="bg-orange text-bone px-8 py-4 text-caption uppercase tracking-widest
           hover:bg-brown transition-colors duration-300"

// Secondary / Ghost
className="border border-brown text-brown px-8 py-4 text-caption uppercase tracking-widest
           hover:bg-brown hover:text-bone transition-colors duration-300"

// Never use rounded-full on buttons — sharp corners only
// Never use box shadows
```

### Cards
```typescript
// Service or package card
className="bg-bone border border-brown/10 p-8
           hover:border-brown/30 transition-colors duration-500"
// No rounded corners (or very subtle: rounded-sm)
// No shadows
```

### Navigation
```typescript
// Top navigation
// - Logo left
// - Links centre (desktop) or hamburger (mobile)
// - "Book" CTA button right (burnt orange, always visible)
// - Transparent on hero, bone-white background on scroll (GSAP ScrollTrigger)
// - Language toggle (ka / en) beside Book button
```

### Forms
```typescript
// Input fields
className="bg-transparent border-b border-brown/40 pb-2 w-full
           text-brown placeholder:text-brown/40
           focus:outline-none focus:border-brown transition-colors"
// Bottom-border only — luxury editorial style
// No background fill, no rounded borders
```

---

## Tone of Voice (for content in code, error states, loading text)

**Georgian:** warm, respectful, uses "თქვენ" (formal you), authoritative medical language
**English:** confident, precise, editorial — "Your biological age." not "Find out how old your body is!"

### Micro-copy examples
- Button: "დაჯავშნეთ / Book" (not "Click here" / "Submit")
- Error: "დაფიქსირდა შეცდომა. გთხოვთ სცადოთ ხელახლა." (not "Error 500")
- Loading: "იტვირთება..." (not "Loading...")
- Empty state: "შინაარსი მალე დაემატება." (not "No content found")

---

## Forbidden UI Patterns

- No carousels with visible arrows/bullets (use seamless scroll or pinned GSAP)
- No modal popups except cookie consent and booking
- No countdown timers or "limited offer" urgency tactics — this is premium, not e-commerce
- No chatbots or live chat widgets
- No star ratings
- No social proof widgets (Trustpilot, etc.) — use editorial testimonials instead
- No stock icons — use Lucide (minimal) or custom SVG only
- No rounded-full pill buttons
- No gradient text effects
- No animations on first render (above-fold content appears instantly, animation starts on scroll)
