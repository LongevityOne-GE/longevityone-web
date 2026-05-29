'use client'

import Image from 'next/image'
import { localizedTechName, type Locale } from '@/lib/utils'
import type { Technology } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface TechSectionProps {
  locale: Locale
  tech: Technology
  index: number
}

// ─── Clinic photo configuration ───────────────────────────────────────────────
// Real clinic imagery, keyed by Sanity _id so it survives schema/slug changes.
// Each technology can use one of three layout shapes:
//   • primary  — square 1:1 image in the column opposite the text (default)
//   • banner   — wide 21:9 image rendered beneath the text+image row
//   • hero     — wide 16:9 image rendered ABOVE the text (replaces side image)
//   • pair     — two 4:5 images rendered in a row beneath the text
// Enbiosis (microbiome) and Red Light: no real photo yet — see TODO comments.

interface ClinicPhoto {
  src: string
  alt_ka: string
  alt_en: string
  caption_ka?: string
  caption_en?: string
}

interface ClinicPhotoSet {
  primary?: ClinicPhoto
  banner?: ClinicPhoto & { desaturate?: boolean }
  hero?: ClinicPhoto
  pair?: [ClinicPhoto, ClinicPhoto]
}

const CLINIC_PHOTOS: Record<string, ClinicPhotoSet> = {
  'tech-pnoe': {
    primary: {
      src: '/images/technologies/pnoe-tablet.jpg',
      alt_ka: 'PNOE მეტაბოლური ანალიზის სისტემა — პაციენტის კალიბრაცია',
      alt_en: 'PNOE metabolic analysis system — patient calibration',
      caption_ka: 'PNOE მომზადება — ტესტამდე კალიბრაცია',
      caption_en: 'PNOE patient setup — pre-test calibration',
    },
    banner: {
      src: '/images/technologies/pnoe-bike.jpg',
      alt_ka: 'სტაციონარული ველოსიპედი VO₂ Max ტესტირებისთვის',
      alt_en: 'Tacx stationary bike used during VO₂ Max testing',
      desaturate: true,
    },
  },

  'tech-truediagnostic': {
    primary: {
      src: '/images/technologies/truediagnostic.jpg',
      alt_ka: 'TrueDiagnostic ეპიგენეტიკური ტესტირების ნაკრები',
      alt_en: 'TrueDiagnostic epigenetic testing kit',
    },
  },

  'tech-ihht': {
    hero: {
      src: '/images/technologies/ihht-room.jpg',
      alt_ka: 'IHHT თერაპიის ოთახი Longevity One-ში',
      alt_en: 'IHHT therapy room at Longevity One',
    },
    pair: [
      {
        src: '/images/technologies/ihht-celloxy.jpg',
        alt_ka: 'Celloxy მოწყობილობა — IHHT თერაპიის სისტემა',
        alt_en: 'Celloxy device — IHHT delivery system',
        caption_ka: 'Celloxy — კონტროლირებადი ჰიპოქსიურ-ჰიპეროქსიური სისტემა',
        caption_en: 'Celloxy — controlled hypoxic-hyperoxic delivery system',
      },
      {
        src: '/images/technologies/ihht-detail.jpg',
        alt_ka: 'IHHT სავარძლის და მოწყობილობის დეტალი',
        alt_en: 'IHHT recliner and device — interior detail',
      },
    ],
  },

  // TODO: replace placeholder when Enbiosis kit photo is delivered
  // 'tech-enbiosis': { primary: { ... } },

  // TODO: replace placeholder when Red Light room photo is delivered
  // 'tech-red-light': { primary: { ... } },
}

// ─── Small image atom ────────────────────────────────────────────────────────
interface FrameProps {
  photo: ClinicPhoto
  locale: Locale
  aspect: 'square' | '4/5' | '16/9' | '21/9'
  sizes: string
  priority?: boolean
  desaturate?: boolean
  className?: string
}

function Frame({
  photo,
  locale,
  aspect,
  sizes,
  priority = false,
  desaturate = false,
  className = '',
}: FrameProps) {
  const aspectClass = {
    'square': 'aspect-square',
    '4/5': 'aspect-[4/5]',
    '16/9': 'aspect-video',
    '21/9': 'aspect-[21/9]',
  }[aspect]
  const caption = locale === 'ka' ? photo.caption_ka : photo.caption_en
  return (
    <figure className={className}>
      <div
        className={`relative w-full ${aspectClass} overflow-hidden border border-dark-brown/10 rounded-sm bg-dark-brown/[0.03]`}
      >
        <Image
          src={photo.src}
          alt={locale === 'ka' ? photo.alt_ka : photo.alt_en}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-center"
          style={desaturate ? { filter: 'saturate(0.4) brightness(0.95)' } : undefined}
        />
      </div>
      {caption && (
        <figcaption className="mt-3 text-[10px] uppercase tracking-[0.28em] text-dark-brown/55 font-light">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}

// ─── Section ─────────────────────────────────────────────────────────────────
export function TechSection({ locale, tech, index }: TechSectionProps) {
  const isOdd = index % 2 === 0
  const displayName = localizedTechName(tech, locale)
  const tagline = locale === 'ka' ? tech.tagline_ka : tech.tagline_en
  const whatItIs = locale === 'ka' ? tech.whatItIs_ka : tech.whatItIs_en
  const howItWorks = locale === 'ka' ? tech.howItWorks_ka : tech.howItWorks_en
  const whatItShows = locale === 'ka' ? tech.whatItShows_ka : tech.whatItShows_en
  const yourBenefit = locale === 'ka' ? tech.yourBenefit_ka : tech.yourBenefit_en

  const detailLabel1 = locale === 'ka' ? 'რა არის' : 'What It Is'
  const detailLabel2 = howItWorks
    ? (locale === 'ka' ? 'როგორ მუშაობს' : 'How It Works')
    : (locale === 'ka' ? 'რას აჩვენებს' : 'What It Shows')
  const detailValue2 = howItWorks || whatItShows
  const detailLabel3 = locale === 'ka' ? 'თქვენი სარგებელი' : 'Your Benefit'

  const photos = CLINIC_PHOTOS[tech._id]
  const isHeroLayout = Boolean(photos?.hero)
  // PNOE is the first clinic photo after the page hero — flag it for priority loading.
  const isFirstPhotoSection = tech._id === 'tech-pnoe'

  // ─── Reusable text blocks ──────────────────────────────────────────────
  const eyebrowAndHeading = (
    <>
      <Reveal>
        <p className="eyebrow">{displayName}</p>
      </Reveal>
      <Reveal delay={0.1}>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight font-serif text-dark-brown mb-8">
          {tagline}
        </h2>
      </Reveal>
    </>
  )

  const threeColumnDetails = (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
      {whatItIs && (
        <Reveal delay={0.2}>
          <div className="border-t border-dark-brown/20 pt-6">
            <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
              {detailLabel1}
            </h4>
            <p className="text-sm text-dark-brown/80 leading-relaxed">{whatItIs}</p>
          </div>
        </Reveal>
      )}
      {detailValue2 && (
        <Reveal delay={0.25}>
          <div className="border-t border-dark-brown/20 pt-6">
            <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
              {detailLabel2}
            </h4>
            <p className="text-sm text-dark-brown/80 leading-relaxed">{detailValue2}</p>
          </div>
        </Reveal>
      )}
      {yourBenefit && (
        <Reveal delay={0.3}>
          <div className="border-t border-dark-brown/20 pt-6">
            <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
              {detailLabel3}
            </h4>
            <p className="text-sm text-dark-brown/80 leading-relaxed">{yourBenefit}</p>
          </div>
        </Reveal>
      )}
    </div>
  )

  // ─── HERO LAYOUT — IHHT only ───────────────────────────────────────────
  // Full-width hero image above the text, optional pair below.
  if (isHeroLayout && photos?.hero) {
    return (
      <section
        id={tech.anchor}
        className="min-h-screen py-20 md:py-32 border-t border-dark-brown/10 first:border-t-0 bg-bone-white"
      >
        <div className="section-container">
          <Reveal>
            <Frame
              photo={photos.hero}
              locale={locale}
              aspect="16/9"
              sizes="(max-width: 1400px) 100vw, 1400px"
              className="mb-12 md:mb-16"
            />
          </Reveal>

          <div className="max-w-4xl">
            {eyebrowAndHeading}
            {threeColumnDetails}
          </div>

          {photos.pair && (
            <div className="mt-16 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-[860px]">
              <Reveal delay={0.1}>
                <Frame
                  photo={photos.pair[0]}
                  locale={locale}
                  aspect="4/5"
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="max-w-[380px] w-full"
                />
              </Reveal>
              <Reveal delay={0.2}>
                <Frame
                  photo={photos.pair[1]}
                  locale={locale}
                  aspect="4/5"
                  sizes="(max-width: 768px) 100vw, 380px"
                  className="max-w-[380px] w-full"
                />
              </Reveal>
            </div>
          )}
        </div>
      </section>
    )
  }

  // ─── DEFAULT TWO-COLUMN LAYOUT ─────────────────────────────────────────
  // Text on one side, image (clinic primary OR Sanity heroImage OR placeholder)
  // on the other. Banner rendered beneath if configured.
  const sanityHero = tech.heroImage?.asset?.url
  const renderSideImage = (): React.ReactElement => {
    if (photos?.primary) {
      return (
        <Reveal delay={0.15}>
          <Frame
            photo={photos.primary}
            locale={locale}
            aspect="square"
            sizes="(max-width: 1024px) 100vw, 480px"
            priority={isFirstPhotoSection}
            className="w-full max-w-[480px] mx-auto lg:mx-0"
          />
        </Reveal>
      )
    }
    if (sanityHero) {
      // Fallback for techs without a clinic photo yet (Enbiosis / Red Light).
      // TODO: replace placeholder when real photos are delivered for these techs.
      return (
        <Reveal delay={0.15}>
          <figure className="w-full max-w-[480px] mx-auto lg:mx-0">
            <div className="relative w-full aspect-square overflow-hidden border border-dark-brown/10 rounded-sm bg-dark-brown/[0.03]">
              <Image
                src={sanityHero}
                alt={displayName}
                fill
                sizes="(max-width: 1024px) 100vw, 480px"
                className="object-cover object-center"
              />
            </div>
          </figure>
        </Reveal>
      )
    }
    return (
      <div
        className="w-full max-w-[480px] aspect-square border border-dark-brown/10 rounded-sm bg-dark-brown/[0.03]"
        aria-hidden="true"
      />
    )
  }

  return (
    <section
      id={tech.anchor}
      className="min-h-screen py-20 md:py-32 border-t border-dark-brown/10 first:border-t-0 bg-bone-white"
    >
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div className={isOdd ? 'lg:order-1' : 'lg:order-2'}>
            {eyebrowAndHeading}
            {threeColumnDetails}
          </div>

          <div
            className={`${isOdd ? 'lg:order-2' : 'lg:order-1'} flex items-start justify-center lg:justify-start`}
          >
            {renderSideImage()}
          </div>
        </div>

        {photos?.banner && (
          <Reveal delay={0.2}>
            <Frame
              photo={photos.banner}
              locale={locale}
              aspect="21/9"
              sizes="(max-width: 1400px) 100vw, 1400px"
              desaturate={photos.banner.desaturate}
              className="mt-16 md:mt-20"
            />
          </Reveal>
        )}
      </div>
    </section>
  )
}
