# Longevity One — Brand Guidelines for Claude Code

> Source of truth: Visual Identity Guidelines.pdf in project files
> Claude Code must follow every rule here on every component it creates.
> When in doubt: look at https://www.cliniquelaprairie.com and ask "does this feel that level of luxury?"

---

## Brand Essence

- **Display name:** Longevity One (two words, space between)
- **Georgian logo name:** Longevity One — logo/brand assets ONLY, never in body copy
- **Tagline (en):** The Art of Living Longer
- **Tagline (ka):** დღეგრძელობის ხელოვნება
- **Category:** Preventive Medicine Center — luxury longevity clinic
- **Positioning:** Georgian-first, internationally minded. Ancient Greek aesthetic meets cutting-edge science.
- **Voice:** Authoritative. Warm. Precise. Never clinical in a cold way. Never overpromising.
- **Visual mood:** Editorial. Timeless. Classical sculpture. Cream, brown, occasional burnt orange.

---

## Colour System

### Tailwind config (copy exactly into tailwind.config.ts)

```typescript
colors: {
  bone:   '#E7DECC',
  brown: {
    DEFAULT: '#422922',
    dark:    '#2a1a14',
    light:   '#6b4a3a',
  },
  orange: {
    DEFAULT: '#D45800',
    light:   '#e07a33',
    dark:    '#a84600',
  },
  blue: {
    DEFAULT: '#AFD1E6',
    light:   '#cce3f0',
    dark:    '#7fb5d4',
  },
  black: '#000000',
},
```

### Usage rules

- **Bone `#E7DECC`** — primary background on all pages. Conveys warmth and luxury. Use it everywhere.
- **Brown `#422922`** — all headings and body text. Never use pure black (`#000`) for text.
- **Orange `#D45800`** — CTAs, price highlights, hover underlines, logo accent. Never as a large background area.
- **Blue `#AFD1E6`** — subtle UI states, badges, secondary information. Very sparingly.
- **Black `#000000`** — high-contrast dark sections and poster-style compositions only.

### Forbidden
- No gradients between any brand colours
- No colour outside this palette
- Never pure grey — use bone tinted or brown tinted
- Check contrast before using orange on brown (may fail WCAG AA at small sizes)

---

## Typography

### Font: Mersad — 9 weights, self-hosted

All files live in `/public/fonts/mersad/`. Filenames are all lowercase.

### Complete @font-face declarations for globals.css

```css
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/mersad/mersad-thin.woff2') format('woff2');
  font-weight: 100;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/mersad/mersad-extralight.woff2') format('woff2');
  font-weight: 200;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/mersad/mersad-light.woff2') format('woff2');
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/mersad/mersad-regular.woff2') format('woff2');
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/mersad/mersad-medium.woff2') format('woff2');
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/mersad/mersad-semibold.woff2') format('woff2');
  font-weight: 600;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/mersad/mersad-bold.woff2') format('woff2');
  font-weight: 700;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/mersad/mersad-extrabold.woff2') format('woff2');
  font-weight: 800;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Mersad';
  src: url('/fonts/mersad/mersad-black.woff2') format('woff2');
  font-weight: 900;
  font-style: normal;
  font-display: swap;
}
```

### Complete Tailwind typography config

```typescript
// In tailwind.config.ts theme.extend:
fontFamily: {
  sans: ['Mersad', 'system-ui', 'sans-serif'],
},
fontWeight: {
  thin:       '100',
  extralight: '200',
  light:      '300',
  normal:     '400',
  medium:     '500',
  semibold:   '600',
  bold:       '700',
  extrabold:  '800',
  black:      '900',
},
fontSize: {
  display:    ['clamp(3rem, 8vw, 7rem)',     { lineHeight: '1.05', letterSpacing: '-0.02em' }],
  'display-sm': ['clamp(2rem, 5vw, 4rem)',   { lineHeight: '1.1',  letterSpacing: '-0.01em' }],
  heading:    ['clamp(1.5rem, 3vw, 2.5rem)', { lineHeight: '1.15' }],
  'body-lg':  ['1.125rem', { lineHeight: '1.7' }],
  body:       ['1rem',     { lineHeight: '1.7' }],
  caption:    ['0.75rem',  { lineHeight: '1.5', letterSpacing: '0.15em' }],
},
transitionTimingFunction: {
  luxury: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
  reveal: 'cubic-bezier(0.76, 0, 0.24, 1)',
},
```

### Typography usage patterns

| Use case | Size | Weight | Notes |
|---|---|---|---|
| Hero headline | display | black (900) | Bone on dark, brown on bone |
| Section heading | display-sm | semibold (600) | Brown |
| Sub-heading | heading | bold (700) | Brown |
| Eyebrow / label | caption | thin (100) | Uppercase, tracking 0.15em |
| Body text | body | regular (400) | Brown, line-height 1.7 |
| Large body / intro | body-lg | light (300) | Brown, generous line-height |
| Navigation | caption | medium (500) | Uppercase, tracked |
| Price / highlight | heading | black (900) | Orange |
| Pull quote | display-sm | extralight (200) | Brown, italic feel without italic |

---

## Logo

- **On Georgian pages:** use Longevity One version (logo asset)
- **On English pages:** use Longevity One version (logo asset)
- **Minimum sizes:** 120px (full lockup), 80px (compact), 32px (icon only)
- **Exclusion zone:** clear space equal to the height of the "L" in LONGEVITY on all sides
- **On dark backgrounds:** bone-white version of logo
- **On bone/light backgrounds:** dark-brown version of logo
- **Never:** stretch, rotate, recolour, add shadow, place on busy background without overlay
- **In code:** logo is an SVG or next/image — never recreated with text/CSS

---

## Imagery Style

Classical Greek and Roman sculpture is the brand's visual language:
- **Discobolus** (discus thrower) — movement, athletic peak, elite performance
- **Classical busts/portraits** — intellectual authority, timeless beauty
- **Amphora silhouette** — heritage, craft, containment

### Photographic treatment
- Desaturated or monochrome with bone-white tint overlay
- High contrast, dramatic crop — faces often cropped at brow or chin for editorial effect
- Never corporate stock photography (no handshakes, stethoscopes on white backgrounds)
- Scientific imagery: clean macro shots of cells, DNA, lab equipment — minimal and precise
- Georgian landscape only when specifically relevant to Georgia context

### In code — always
```typescript
// Always next/image, always dramatic crop, always WebP
<Image
  src={sanityImageUrl}
  alt={alt_ka || alt_en}    // Georgian alt first
  fill
  className="object-cover object-center"
  priority={isAboveFold}    // true only for hero
  sizes="(max-width: 768px) 100vw, 50vw"
/>
```

---

## Spacing & Layout

```typescript
// Tailwind spacing additions:
spacing: {
  section:    '5rem',    // 80px — standard section padding
  'section-lg': '8rem', // 128px — hero and feature sections
},
maxWidth: {
  site: '1400px',       // max-w-site — wrap all content
},
```

- Section padding: `py-section md:py-section-lg`
- Content wrapper: `max-w-site mx-auto px-6 md:px-12`
- Grid: 12 columns desktop, 4 columns mobile — use CSS grid not flex for page layouts
- **Generous whitespace is not wasted space — it is luxury**

---

## UI Component Patterns

### Buttons
```typescript
// Primary CTA — orange fill
className={cn(
  "inline-flex items-center px-8 py-4",
  "text-caption font-medium uppercase tracking-widest",
  "bg-orange text-bone",
  "transition-colors duration-300 ease-luxury",
  "hover:bg-brown",
  // Never rounded-full — sharp corners only
  // Never box-shadow
)}

// Secondary / Ghost — outline
className={cn(
  "inline-flex items-center px-8 py-4",
  "text-caption font-medium uppercase tracking-widest",
  "border border-brown text-brown bg-transparent",
  "transition-colors duration-300 ease-luxury",
  "hover:bg-brown hover:text-bone",
)}
```

### Cards
```typescript
// Service or package card
className={cn(
  "bg-bone border border-brown/10 p-8",
  "transition-colors duration-500 ease-luxury",
  "hover:border-brown/30",
  // No rounded corners (or max rounded-sm)
  // No shadows
)}
```

### Navigation
```typescript
// - Logo left
// - Nav links centre (desktop) / hamburger (mobile)  
// - Language toggle (ka/en) + Book CTA — right
// - Transparent background on hero
// - bone background appears on scroll (GSAP ScrollTrigger)
// - Book button: always visible, always orange
// - All nav links: caption size, medium weight, uppercase, tracked
```

### Form inputs
```typescript
// Bottom-border only — luxury editorial style
className={cn(
  "bg-transparent border-b border-brown/40 pb-2 w-full",
  "text-brown placeholder:text-brown/40 font-light",
  "focus:outline-none focus:border-brown",
  "transition-colors duration-300",
  // No background fill, no rounded borders, no full border box
)}
```

### Dividers
```typescript
// Thin horizontal rule between sections
className="w-full h-px bg-brown/10"
// Or
className="w-16 h-px bg-orange" // accent divider under headings
```

---

## Tone of Voice — Micro-copy

**Georgian:** formal "თქვენ/თქვენი", authoritative medical language, warm not cold
**English:** confident, precise, editorial — short declarative sentences

### Examples
| Context | Georgian | English |
|---|---|---|
| Primary CTA | დაჯავშნეთ | Book |
| Secondary CTA | გაიგეთ მეტი | Learn more |
| Loading | იტვირთება... | Loading... |
| Error | დაფიქსირდა შეცდომა. გთხოვთ სცადოთ ხელახლა. | Something went wrong. Please try again. |
| Success | მადლობა. ჩვენ მალე დაგიკავშირდებით. | Thank you. We'll be in touch shortly. |
| Empty state | შინაარსი მალე დაემატება. | Coming soon. |
| Form consent | ვეთანხმები მონაცემთა დამუშავებას | I consent to data processing |

### Content lint rule — formal imperative (`-თ`)

All Georgian CTAs and instructions must use the **formal plural imperative** (ending in `-თ`),
never the informal singular. A Georgian imperative ending in a vowel without a trailing `-თ`
is a **warning**.

| ❌ Informal (singular) | ✅ Formal (plural) |
|---|---|
| ნახე | ნახეთ |
| გაიცანი | გაიცანით |
| გაიგე | გაიგეთ |
| დაიწყე | დაიწყეთ |
| მიიღე | მიიღეთ |
| აღმოაჩინე | აღმოაჩინეთ |

Audit both Sanity content and hardcoded component strings before publishing.

---

## Forbidden UI Patterns — never implement these

- No carousels with visible arrows/dots (use seamless GSAP scroll or pinned sections)
- No modal popups except cookie consent and booking embed
- No countdown timers or "limited offer" urgency
- No chatbots or live chat
- No star ratings
- No social proof widgets (Trustpilot etc.) — use editorial testimonials only
- No stock icons — Lucide (minimal set) or custom SVG only
- No `rounded-full` on buttons or cards
- No box shadows on any element
- No gradient text effects
- No animations on first render (above-fold content appears instantly)
- No sticky elements other than navbar
- No horizontal scroll on any page
