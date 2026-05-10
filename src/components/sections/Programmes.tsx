'use client'

import { Briefcase, Users, Handshake, type LucideIcon } from 'lucide-react'
import type { Locale } from '@/lib/utils'
import type { CorporateProgramme } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

const iconMap: Record<string, LucideIcon> = {
  briefcase: Briefcase,
  users: Users,
  handshake: Handshake,
}

function ProgrammeIcon({ name }: { name: string | null }) {
  if (!name) return null
  const Icon = iconMap[name.toLowerCase()]
  if (Icon) return <Icon size={28} className="text-burnt-orange mb-6" />
  return <span className="text-3xl mb-6 block">{name}</span>
}

interface ProgrammesProps {
  locale: Locale
  programmes: CorporateProgramme[] | null | undefined
}

export function Programmes({ locale, programmes }: ProgrammesProps) {
  if (!programmes || !programmes.length) return null

  return (
    <section className="py-20 md:py-32 bg-bone-white">
      
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {programmes.map((prog, idx) => {
            const title = locale === 'ka' ? prog.title_ka : prog.title_en
            const body = locale === 'ka' ? prog.body_ka : prog.body_en

            return (
              <Reveal key={idx} delay={0.1 * idx} className="h-full">
                <div className="filter drop-shadow-lg h-full">
                  <div className="card-ornamental overflow-hidden p-8 md:p-10 bg-bone-white flex flex-col h-full border border-dark-brown/8">
                    <ProgrammeIcon name={prog.icon} />
                    <span className="text-5xl font-black text-dark-brown/8 font-serif leading-none mb-3 select-none">
                      {String(prog.number).padStart(2, '0')}
                    </span>
                    <h3 className="text-lg md:text-xl font-black font-serif text-dark-brown leading-tight mb-4">
                      {title}
                    </h3>
                    {body && (
                      <p className="text-sm text-dark-brown/70 leading-relaxed flex-grow">
                        {body}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
