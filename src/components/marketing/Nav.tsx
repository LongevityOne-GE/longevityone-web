'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LogoMark } from '@/components/shared/LogoMark'
import { Button } from '@/components/primitives/Button'
import type { Lang } from '@/lib/utils'

interface NavProps {
  lang: Lang
}

const links = [
  { ka: 'ჩვენს შესახებ', en: 'About',            href: '/about' },
  { ka: 'სერვისები',     en: 'Services',          href: '/services/longevity' },
  { ka: 'ტექნოლოგია',   en: 'Technology',        href: '/technologies' },
  { ka: 'პაკეტები',     en: 'Packages',          href: '/packages' },
  { ka: 'გუნდი',        en: 'Team',              href: '/team' },
  { ka: 'კონტაქტი',     en: 'Contact',           href: '/contact' },
]

export function Nav({ lang }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  const ka = lang === 'ka'
  const prefix = ka ? '' : '/en'
  const altHref = ka ? '/en' : '/'

  useMotionValueEvent(scrollY, 'change', (y) => setScrolled(y > 40))

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-colors duration-700',
          scrolled ? 'bg-bone/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
        )}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-10 lg:px-16">
          {/* Logo */}
          <Link href={ka ? '/' : '/en'} className="flex items-center gap-3 shrink-0">
            <LogoMark size={36} variant={scrolled ? 'dark' : 'light'} />
            <span className={cn(
              'font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] transition-colors duration-500',
              scrolled ? 'text-brown' : 'text-bone'
            )}>
              Longevity One
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-8">
            {links.map(({ ka: kaLabel, en: enLabel, href }) => (
              <li key={href}>
                <Link
                  href={`${prefix}${href}`}
                  className={cn(
                    'font-sans text-[0.7rem] font-normal uppercase tracking-[0.12em] transition-colors duration-200',
                    scrolled ? 'text-brown/60 hover:text-brown' : 'text-bone/60 hover:text-bone'
                  )}
                >
                  {ka ? kaLabel : enLabel}
                </Link>
              </li>
            ))}
          </ul>

          {/* Right: lang switcher + CTA + hamburger */}
          <div className="flex items-center gap-4">
            <Link
              href={altHref}
              className={cn(
                'hidden md:block font-sans text-[0.65rem] font-semibold uppercase tracking-[0.25em] transition-colors duration-200',
                scrolled ? 'text-brown/40 hover:text-brown' : 'text-bone/40 hover:text-bone'
              )}
            >
              {ka ? 'EN' : 'KA'}
            </Link>

            <Button
              href={`${prefix}/contact`}
              size="sm"
              variant="outline"
              className={cn(
                'hidden md:inline-flex transition-colors',
                scrolled
                  ? ''
                  : 'border-bone/40 text-bone hover:bg-bone hover:text-brown'
              )}
            >
              {ka ? 'დაჯავშნეთ' : 'Book'}
            </Button>

            {/* Hamburger */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2 -mr-2 flex flex-col gap-1.5"
              aria-label={open ? 'Close menu' : 'Open menu'}
            >
              <span className={cn(
                'block w-6 h-px transition-all duration-300 origin-center',
                scrolled ? 'bg-brown' : 'bg-bone',
                open && 'translate-y-[5px] rotate-45'
              )} />
              <span className={cn(
                'block w-6 h-px transition-all duration-300',
                scrolled ? 'bg-brown' : 'bg-bone',
                open && 'opacity-0'
              )} />
              <span className={cn(
                'block w-6 h-px transition-all duration-300 origin-center',
                scrolled ? 'bg-brown' : 'bg-bone',
                open && '-translate-y-[5px] -rotate-45'
              )} />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col bg-brown md:hidden"
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="h-20" /> {/* spacer for fixed header */}
            <nav className="flex-1 flex flex-col justify-center px-8 gap-8">
              {links.map(({ ka: kaLabel, en: enLabel, href }) => (
                <Link
                  key={href}
                  href={`${prefix}${href}`}
                  onClick={() => setOpen(false)}
                  className="font-sans text-[1.125rem] font-thin text-bone/70 hover:text-bone tracking-[0.05em] transition-colors"
                >
                  {ka ? kaLabel : enLabel}
                </Link>
              ))}
              <hr className="border-bone/10" />
              <Link
                href={altHref}
                onClick={() => setOpen(false)}
                className="font-sans text-sm font-normal text-bone/40 hover:text-bone/70 uppercase tracking-[0.2em] transition-colors"
              >
                {ka ? 'Switch to English' : 'Georgian — მთავარი'}
              </Link>
            </nav>
            <div className="px-8 pb-12">
              <Button
                href={`${prefix}/contact`}
                size="lg"
                variant="outline"
                className="w-full border-bone/30 text-bone hover:bg-bone hover:text-brown"
                onClick={() => setOpen(false)}
              >
                {ka ? 'დაჯავშნეთ კონსულტაცია' : 'Book a Consultation'}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
