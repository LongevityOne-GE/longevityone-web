import type { CSSProperties } from 'react'

type VideoSource = string | { webm?: string; mp4?: string }

interface GodVideoProps {
  /** Single URL, or an object of format-specific URLs. Webm preferred when both provided. */
  src: VideoSource
  /** Video element opacity, 0..1. Default 1 - use overlay/tint to darken. */
  opacity?: number
  /** Overlay treatment on top of the video. */
  overlay?: 'none' | 'fade' | 'vignette' | 'tint'
  /** Overlay colour family. Default matches section (dark = brown/black, light = bone). */
  tint?: 'light' | 'dark'
  /** Overlay strength 0..1. Default 0.6. */
  tintOpacity?: number
  /** How the video fills the container. */
  fit?: 'cover' | 'contain'
  /** CSS object-position value, e.g. 'center top'. */
  position?: string
  /** Optional filter string, e.g. 'grayscale(1)'. */
  filter?: string
  /** Optional mix-blend-mode. */
  blend?: CSSProperties['mixBlendMode']
  /** Video preload strategy. Default 'metadata' to save bandwidth. */
  preload?: 'auto' | 'metadata' | 'none'
  className?: string
}

function normalizeSources(src: VideoSource): { url: string; type: string }[] {
  if (typeof src === 'string') {
    const type = src.endsWith('.webm') ? 'video/webm' : 'video/mp4'
    return [{ url: src, type }]
  }
  const out: { url: string; type: string }[] = []
  if (src.webm) out.push({ url: src.webm, type: 'video/webm' })
  if (src.mp4) out.push({ url: src.mp4, type: 'video/mp4' })
  return out
}

/**
 * Absolutely-positioned background video with configurable overlay treatments.
 * Parent must be `position: relative` + `overflow: hidden`.
 * Respects `prefers-reduced-motion` via a global rule in globals.css that
 * hides autoplaying videos - callers should still set a fallback bg colour.
 */
export function GodVideo({
  src,
  opacity = 1,
  overlay = 'none',
  tint = 'dark',
  tintOpacity = 0.6,
  fit = 'cover',
  position = 'center',
  filter,
  blend,
  preload = 'metadata',
  className = '',
}: GodVideoProps) {
  const sources = normalizeSources(src)

  const videoStyle: CSSProperties = {
    opacity,
    objectFit: fit,
    objectPosition: position,
    ...(filter ? { filter } : {}),
    ...(blend ? { mixBlendMode: blend } : {}),
  }

  return (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        preload={preload}
        aria-hidden="true"
        className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
        style={videoStyle}
      >
        {sources.map((s) => (
          <source key={s.url} src={s.url} type={s.type} />
        ))}
      </video>

      {overlay !== 'none' && (
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
          style={buildOverlayStyle(overlay, tint, tintOpacity)}
        />
      )}
    </>
  )
}

function buildOverlayStyle(
  overlay: 'fade' | 'vignette' | 'tint',
  tint: 'light' | 'dark',
  o: number
): CSSProperties {
  const color =
    tint === 'light'
      ? `rgba(231, 222, 204, ${o})` // bone-white
      : `rgba(66, 41, 34, ${o})` // dark-brown

  const edgeColor =
    tint === 'light' ? 'rgba(231, 222, 204, 1)' : 'rgba(66, 41, 34, 1)'
  const transparent =
    tint === 'light' ? 'rgba(231, 222, 204, 0)' : 'rgba(66, 41, 34, 0)'

  switch (overlay) {
    case 'tint':
      return { backgroundColor: color }
    case 'fade':
      return {
        background: `linear-gradient(to bottom, ${edgeColor} 0%, ${transparent} 18%, ${transparent} 82%, ${edgeColor} 100%)`,
      }
    case 'vignette':
      return {
        background: `radial-gradient(ellipse at center, ${transparent} 40%, ${color} 100%)`,
      }
  }
}
