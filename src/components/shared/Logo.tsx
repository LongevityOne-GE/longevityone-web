import { LogoMark } from './LogoMark'

interface LogoProps {
  className?: string
  variant?: 'dark' | 'light'
  markSize?: number
  showWordmark?: boolean
}

export function Logo({
  className,
  variant = 'dark',
  markSize = 40,
  showWordmark = true,
}: LogoProps) {
  const textColor = variant === 'dark' ? '#422922' : '#E7DECC'

  return (
    <div className={`flex items-center gap-3 ${className ?? ''}`}>
      <LogoMark size={markSize} variant={variant} />
      {showWordmark && (
        <div
          style={{
            color: textColor,
            fontFamily: "'Mersad', system-ui, sans-serif",
            lineHeight: 1,
            letterSpacing: '0.12em',
          }}
        >
          <div style={{ fontSize: '0.95em', fontWeight: 400 }}>LONGEVITY</div>
          <div style={{ fontSize: '0.95em', fontWeight: 400 }}>ONE</div>
        </div>
      )}
    </div>
  )
}
