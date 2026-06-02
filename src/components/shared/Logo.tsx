'use client'

interface LogoProps {
  variant?: 'full' | 'compact'
  inverted?: boolean
}

export function Logo({ variant = 'compact', inverted = false }: LogoProps) {
  const textColor = inverted ? 'text-bone-white' : 'text-dark-brown'

  return (
    <div className="flex items-center gap-3">
      {/* Brand mark - logo-mark.svg per brand guidelines */}
      <img
        src="/logos/logo-mark.svg"
        alt=""
        width={variant === 'full' ? 56 : 40}
        height={variant === 'full' ? 62 : 44}
        style={{
          width: variant === 'full' ? 56 : 40,
          height: 'auto',
          maxHeight: variant === 'full' ? 64 : 48,
          flexShrink: 0,
        }}
        className={inverted ? 'brightness-0 invert' : ''}
      />

      {/* Wordmark */}
      <div className="flex flex-col">
        <span className={`${textColor} font-light text-sm md:text-base uppercase tracking-[0.2em] leading-tight`}>
          LONGEVITY
        </span>
        <span className={`${textColor} font-light text-sm md:text-base uppercase tracking-[0.2em] leading-tight`}>
          ONE
        </span>
        {variant === 'full' && (
          <span className={`${textColor} font-extralight text-[8px] md:text-[10px] uppercase tracking-[0.15em] leading-tight mt-0.5 opacity-70`}>
            PREVENTIVE MEDICINE CENTER
          </span>
        )}
      </div>
    </div>
  )
}
