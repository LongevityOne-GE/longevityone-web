import Link from 'next/link'
import { LogoMark } from '@/components/shared/LogoMark'
import { Container } from '@/components/primitives/Container'
import type { Lang } from '@/lib/utils'

interface FooterProps {
  lang: Lang
}

const pages = [
  { ka: 'ჩვენს შესახებ', en: 'About',       href: '/about' },
  { ka: 'სერვისები',     en: 'Services',    href: '/services/longevity' },
  { ka: 'ტექნოლოგია',   en: 'Technology',  href: '/technologies' },
  { ka: 'პაკეტები',     en: 'Packages',    href: '/packages' },
  { ka: 'კორპორატიული', en: 'Corporate',   href: '/corporate' },
  { ka: 'გუნდი',        en: 'Team',        href: '/team' },
  { ka: 'FAQ',           en: 'FAQ',         href: '/faq' },
]

export function Footer({ lang }: FooterProps) {
  const ka = lang === 'ka'
  const prefix = ka ? '' : '/en'

  return (
    <footer className="bg-brown text-bone">
      <Container>
        <div className="py-16 md:py-20 grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="md:col-span-5">
            <Link href={ka ? '/' : '/en'} className="inline-flex items-center gap-3 mb-6">
              <LogoMark size={40} variant="light" />
              <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-bone/50">
                Longevity One
              </span>
            </Link>
            <p className="font-script text-orange text-2xl mb-6">
              {ka ? 'დღეგრძელობის ხელოვნება' : 'The Art of Living Longer'}
            </p>
            <address className="not-italic font-sans text-sm text-bone/40 leading-relaxed">
              {ka
                ? 'თამარაშვილის 4ა, სადარბაზო 3, სართული 3, ბინა 50'
                : '4a Tamarashvili Street, Entrance 3, Floor 3, Apt. 50'}
              <br />
              {ka ? 'თბილისი, საქართველო' : 'Tbilisi, Georgia'}
              <br />
              <a href="tel:+995577260557" className="hover:text-bone transition-colors">
                +995 577 26 05 57
              </a>
              <br />
              <a href="mailto:info@longevityone.ge" className="hover:text-bone transition-colors">
                info@longevityone.ge
              </a>
              <br />
              {ka ? 'ყოველდღე 09:00 – 21:00' : 'Every day 09:00 – 21:00'}
            </address>
          </div>

          {/* Navigation */}
          <div className="md:col-span-3 md:col-start-7">
            <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-bone/25 mb-6">
              {ka ? 'გვერდები' : 'Pages'}
            </p>
            <ul className="space-y-3">
              {pages.map(({ ka: kaLabel, en: enLabel, href }) => (
                <li key={href}>
                  <Link
                    href={`${prefix}${href}`}
                    className="font-sans text-sm text-bone/40 hover:text-bone transition-colors duration-200"
                  >
                    {ka ? kaLabel : enLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="md:col-span-3 md:col-start-10">
            <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.25em] text-bone/25 mb-6">
              {ka ? 'სამართლებრივი' : 'Legal'}
            </p>
            <ul className="space-y-3">
              {[
                { ka: 'კონფიდენციალობა', en: 'Privacy Policy', href: '/legal/privacy' },
                { ka: 'გამოყენების პირობები', en: 'Terms of Service', href: '/legal/terms' },
                { ka: 'ქუქი-ფაილები', en: 'Cookie Policy', href: '/legal/cookies' },
                { ka: 'სამედიცინო განმარტება', en: 'Medical Disclaimer', href: '/legal/medical-disclaimer' },
              ].map(({ ka: kaLabel, en: enLabel, href }) => (
                <li key={href}>
                  <Link
                    href={`${prefix}${href}`}
                    className="font-sans text-sm text-bone/40 hover:text-bone transition-colors duration-200"
                  >
                    {ka ? kaLabel : enLabel}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-bone/10 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-sans text-xs text-bone/25">
            {ka
              ? '© 2026 Longevity One. ყველა უფლება დაცულია.'
              : '© 2026 Longevity One. All rights reserved.'}
          </p>
          <Link
            href={ka ? '/en' : '/'}
            className="font-sans text-xs text-bone/25 hover:text-bone/60 uppercase tracking-[0.2em] transition-colors"
          >
            {ka ? 'English' : 'Georgian'}
          </Link>
        </div>
      </Container>
    </footer>
  )
}
