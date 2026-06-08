import type { Locale } from '@/lib/utils'
import { Reveal } from '@/components/animations/Reveal'

interface PricingJourneyProps {
  locale: Locale
}

interface Step {
  no: string
  target: string
  title_ka: string
  title_en: string
  body_ka: string
  body_en: string
  tag_ka: string
  tag_en: string
}

const STEPS: Step[] = [
  {
    no: '01',
    target: 'diagnostics',
    title_ka: 'დაიწყეთ დიაგნოსტიკით',
    title_en: 'Begin with a Diagnostic',
    body_ka: 'ერთჯერადი, სიღრმისეული შეფასება — გაზომეთ, სად ხართ დღეს.',
    body_en: 'A one-time, in-depth assessment to measure exactly where you stand today.',
    tag_ka: 'ერთჯერადი',
    tag_en: 'One-time',
  },
  {
    no: '02',
    target: 'memberships',
    title_ka: 'გააგრძელეთ წევრობით',
    title_en: 'Continue with a Membership',
    body_ka: 'ყოველთვიური პროგრამა შედეგების შესანარჩუნებლად და გასაუმჯობესებლად.',
    body_en: 'A monthly programme to sustain and keep building on your results.',
    tag_ka: 'ყოველთვიური',
    tag_en: 'Monthly',
  },
  {
    no: '03',
    target: 'add-ons',
    title_ka: 'მოირგეთ ინდივიდუალურად',
    title_en: 'Personalise as Needed',
    body_ka: 'ლაბორატორიული ტესტები და ცალკეული სესიები — საჭიროებისამებრ.',
    body_en: 'Lab add-ons and individual sessions, added whenever you need them.',
    tag_ka: 'სურვილისამებრ',
    tag_en: 'Optional',
  },
]

export function PricingJourney({ locale }: PricingJourneyProps) {
  return (
    <section className="bg-bone-white py-16 md:py-20 border-b border-dark-brown/10">
      <div className="section-container">
        <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-dark-brown/10 border border-dark-brown/10 rounded-sm overflow-hidden">
          {STEPS.map((step, i) => (
            <Reveal key={step.no} delay={0.1 + i * 0.08} className="h-full">
              <li className="h-full bg-bone-white p-8 md:p-9 flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <span className="font-serif text-3xl font-light text-burnt-orange/80">
                    {step.no}
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-dark-brown/45 border border-dark-brown/15 rounded-sm px-2.5 py-1">
                    {locale === 'ka' ? step.tag_ka : step.tag_en}
                  </span>
                </div>
                <a
                  href={`#${step.target}`}
                  className="font-serif text-xl font-semibold text-dark-brown mb-3 hover:text-burnt-orange transition-colors duration-200"
                >
                  {locale === 'ka' ? step.title_ka : step.title_en}
                </a>
                <p className="text-sm text-dark-brown/70 leading-relaxed">
                  {locale === 'ka' ? step.body_ka : step.body_en}
                </p>
              </li>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
