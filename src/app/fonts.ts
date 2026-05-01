import localFont from 'next/font/local'
import { Noto_Sans_Georgian, Allura, Playfair_Display } from 'next/font/google'

/**
 * Mersad — primary brand typeface (Latin).
 *
 * All 9 weights in one declaration so the browser always has the full
 * weight axis available and never synthesises bold or italic.
 *
 * preload: true — Next.js generates <link rel="preload"> for every file.
 * 9 × ~42 KB = ~378 KB served in parallel over HTTP/2 from Vercel CDN.
 * Acceptable for a luxury brand where typographic fidelity is non-negotiable.
 *
 * adjustFontFallback: 'Arial' — Next.js generates a metric-adjusted @font-face
 * for Arial (size-adjust, ascent-override, descent-override) so the swap from
 * fallback → Mersad causes no measurable layout shift (CLS ≈ 0).
 */
export const mersad = localFont({
  src: [
    { path: '../../public/fonts/mersad/mersad-thin.woff2',       weight: '100', style: 'normal' },
    { path: '../../public/fonts/mersad/mersad-extralight.woff2', weight: '200', style: 'normal' },
    { path: '../../public/fonts/mersad/mersad-light.woff2',      weight: '300', style: 'normal' },
    { path: '../../public/fonts/mersad/mersad-regular.woff2',    weight: '400', style: 'normal' },
    { path: '../../public/fonts/mersad/mersad-medium.woff2',     weight: '500', style: 'normal' },
    { path: '../../public/fonts/mersad/mersad-semibold.woff2',   weight: '600', style: 'normal' },
    { path: '../../public/fonts/mersad/mersad-bold.woff2',       weight: '700', style: 'normal' },
    { path: '../../public/fonts/mersad/mersad-extrabold.woff2',  weight: '800', style: 'normal' },
    { path: '../../public/fonts/mersad/mersad-black.woff2',      weight: '900', style: 'normal' },
  ],
  variable: '--font-mersad',
  display: 'swap',
  preload: true,
  adjustFontFallback: 'Arial',
  fallback: ['system-ui', 'Arial', 'sans-serif'],
})

/**
 * Noto Sans Georgian — Georgian script coverage.
 * Mersad covers Latin only (U+0000–U+024F). Georgian (U+10A0–U+10FF)
 * falls through to this font via unicode-range matching and the :lang(ka)
 * rules in globals.css.
 *
 * Only 3 weights — Georgian UI uses Regular/SemiBold; Light for body copy.
 */
export const fontGeorgian = Noto_Sans_Georgian({
  subsets: ['georgian'],
  weight: ['300', '400', '600'],
  variable: '--font-noto-georgian',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
})

/**
 * Playfair Display — editorial serif for pull quotes and italic accents.
 * Used sparingly; display: optional avoids any FOUT for non-critical content.
 */
export const fontDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'optional',
  preload: false,
  fallback: ['Georgia', 'serif'],
})

/**
 * Allura — script accent for signature moments ("Live well.").
 * Loaded on-demand; only appears in hero and select marketing copy.
 */
export const fontScript = Allura({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-allura',
  display: 'optional',
  preload: false,
  fallback: ['cursive'],
})
