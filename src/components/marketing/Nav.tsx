'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useMotionValueEvent } from 'framer-motion'
import { cn } from '@/lib/utils'
import { LogoMark } from '@/components/shared/LogoMark'
import { Button } from '@/components/primitives/Button'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Programmes', href: '#programmes' },
  { label: 'Science', href: '#science' },
  { label: 'Team', href: '#team' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const { scrollY } = useScroll()

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 40)
  })

  return (
    <motion.header
      className={cn(
        'fixed top-0 inset-x-0 z-50 transition-all duration-700',
        scrolled ? 'bg-bone/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      )}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
    >
      <nav className="mx-auto flex h-20 max-w-[1400px] items-center justify-between px-6 md:px-10 lg:px-16">
        <Link href="/" className="flex items-center gap-3">
          <LogoMark size={36} variant="dark" />
          <span className="font-sans text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-brown">
            Longevity One
          </span>
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map(({ label, href }) => (
            <li key={href}>
              <Link
                href={href}
                className="font-sans text-[0.75rem] font-normal uppercase tracking-[0.12em] text-brown/60 hover:text-brown transition-colors duration-200"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        <Button as={Link} href="#contact" size="sm" variant="outline">
          Book Consultation
        </Button>
      </nav>
    </motion.header>
  )
}
