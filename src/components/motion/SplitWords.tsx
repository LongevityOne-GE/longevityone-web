'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SplitWordsProps {
  text: string
  className?: string
  wordClassName?: string
  delay?: number
  stagger?: number
  once?: boolean
}

export function SplitWords({
  text,
  className,
  wordClassName,
  delay = 0,
  stagger = 0.07,
  once = true,
}: SplitWordsProps) {
  const words = text.split(' ')

  return (
    <span className={cn('inline-block overflow-hidden', className)}>
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden">
          <motion.span
            className={cn('inline-block', wordClassName)}
            initial={{ y: '110%', opacity: 0 }}
            whileInView={{ y: '0%', opacity: 1 }}
            viewport={{ once, margin: '-10%' }}
            transition={{
              duration: 0.8,
              delay: delay + i * stagger,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {word}
            {i < words.length - 1 ? ' ' : ''}
          </motion.span>
        </span>
      ))}
    </span>
  )
}
