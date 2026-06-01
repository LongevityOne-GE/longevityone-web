import localFont from 'next/font/local'
import { Noto_Sans_Georgian } from 'next/font/google'

/**
 * Mersad - primary brand typeface (Latin + Georgian).
 *
 * The woff2 files include the full modern Georgian Mkhedruli set
 * (U+10D0-U+10FF), so Mersad renders both scripts and is the single
 * brandbook typeface across the entire site.
 *
 * All 9 weights in one declaration so the browser always has the full
 * weight axis available and never synthesises bold or italic.
 *
 * preload: true - Next.js generates <link rel="preload"> for every file.
 * 9 × ~42 KB = ~378 KB served in parallel over HTTP/2 from Vercel CDN.
 * Acceptable for a luxury brand where typographic fidelity is non-negotiable.
 *
 * adjustFontFallback: 'Arial' - Next.js generates a metric-adjusted @font-face
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
 * Noto Sans Georgian - invisible safety fallback only.
 * Mersad now covers all Georgian glyphs used on the site, so this font is
 * never actually downloaded (the browser only fetches it if a glyph is
 * missing from Mersad). preload: false keeps it out of the critical path.
 */
export const fontGeorgian = Noto_Sans_Georgian({
  subsets: ['georgian'],
  weight: ['300', '400', '600'],
  variable: '--font-noto-georgian',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'sans-serif'],
})

