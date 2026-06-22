import { ImageResponse } from 'next/og'

/**
 * Default site-wide social card (1200×630). Replaces the missing /og-image.jpg.
 * Generated on-brand (bone/brown/orange) so it always exists and resolves on the
 * canonical `www` host via metadataBase. Per-page metadata may override this
 * (e.g. blog posts use their Sanity cover image).
 */
export const alt = 'Longevity One — Preventive Medicine Center, Tbilisi'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#E7DECC',
          color: '#422922',
          padding: '96px',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            width: '128px',
            height: '10px',
            backgroundColor: '#D45800',
            marginBottom: '48px',
          }}
        />
        <div style={{ fontSize: '92px', fontWeight: 700, letterSpacing: '-2px' }}>
          Longevity One
        </div>
        <div style={{ fontSize: '42px', marginTop: '20px', opacity: 0.85 }}>
          The Art of Living Longer
        </div>
        <div style={{ fontSize: '28px', marginTop: 'auto', opacity: 0.7 }}>
          Preventive Medicine Center · Tbilisi · longevityone.ge
        </div>
      </div>
    ),
    { ...size },
  )
}
