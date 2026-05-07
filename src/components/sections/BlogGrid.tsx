'use client'

import type { Locale } from '@/lib/utils'
import type { BlogPost } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'

interface BlogGridProps {
  locale: Locale
  posts: BlogPost[]
}

const categoryLabels: Record<string, { ka: string; en: string }> = {
  'longevity-science': { ka: 'მეცნიერება დღეგრძელობაზე', en: 'Longevity Science' },
  'metabolic-health': { ka: 'მეტაბოლური ჯანმრთელობა', en: 'Metabolic Health' },
  'elite-performance': { ka: 'ელიტური პერფორმანსი', en: 'Elite Performance' },
  'technologies': { ka: 'ტექნოლოგიები', en: 'Technologies' },
}

function getCategoryLabel(slug: string | null, locale: Locale): string | null {
  if (!slug) return null
  const entry = categoryLabels[slug]
  if (entry) return locale === 'ka' ? entry.ka : entry.en
  return slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
}

const KA_MONTHS = ['იანვარი','თებერვალი','მარტი','აპრილი','მაისი','ივნისი','ივლისი','აგვისტო','სექტემბერი','ოქტომბერი','ნოემბერი','დეკემბერი']
const EN_MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

function formatDate(dateStr: string | null, locale: Locale) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return dateStr
  const day = d.getUTCDate()
  const month = locale === 'ka' ? KA_MONTHS[d.getUTCMonth()] : EN_MONTHS[d.getUTCMonth()]
  const year = d.getUTCFullYear()
  return locale === 'ka' ? `${day} ${month}, ${year}` : `${day} ${month} ${year}`
}

export function BlogGrid({ locale, posts }: BlogGridProps) {
  if (!posts.length) {
    return (
      <section className="py-20 md:py-32 bg-bone-white">
        <div className="section-container text-center">
          <p className="text-dark-brown/50">
            {locale === 'ka' ? 'სტატიები მალე დაემატება.' : 'Articles coming soon.'}
          </p>
        </div>
      </section>
    )
  }

  const [featured, ...rest] = posts as [BlogPost, ...BlogPost[]]

  return (
    <section className="py-20 md:py-32 bg-bone-white">
      <div className="section-container">
        {/* featured post */}
        <Reveal>
          <a
            href={`${locale === 'en' ? '/en' : ''}/blog/${featured.slug}`}
            className="group block mb-16 md:mb-20"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <div className="aspect-[4/3] rounded-lg overflow-hidden bg-dark-brown/5">
                {featured.coverImage?.asset?.url ? (
                  <img
                    src={featured.coverImage.asset.url}
                    alt={locale === 'ka' ? featured.title_ka || '' : featured.title_en || ''}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-6xl font-black text-dark-brown/10 font-serif">L</span>
                  </div>
                )}
              </div>
              <div>
                {getCategoryLabel(locale === 'ka' ? featured.category_ka : featured.category_en, locale) && (
                  <p className="eyebrow mb-4">
                    {getCategoryLabel(locale === 'ka' ? featured.category_ka : featured.category_en, locale)}
                  </p>
                )}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black font-serif text-dark-brown leading-tight group-hover:text-burnt-orange transition-colors duration-200 mb-4">
                  {locale === 'ka' ? featured.title_ka : featured.title_en}
                </h2>
                {(locale === 'ka' ? featured.excerpt_ka : featured.excerpt_en) && (
                  <p className="text-dark-brown/65 leading-relaxed mb-6 line-clamp-3">
                    {locale === 'ka' ? featured.excerpt_ka : featured.excerpt_en}
                  </p>
                )}
                <p className="text-xs text-dark-brown/40 uppercase tracking-widest font-bold">
                  {formatDate(featured.publishedAt, locale)}
                </p>
              </div>
            </div>
          </a>
        </Reveal>

        {/* grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 border-t border-dark-brown/10 pt-16">
            {rest.map((post, idx) => (
              <Reveal key={post._id} delay={0.08 * idx}>
                <a
                  href={`${locale === 'en' ? '/en' : ''}/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="aspect-[4/3] rounded-lg overflow-hidden bg-dark-brown/5 mb-5">
                    {post.coverImage?.asset?.url ? (
                      <img
                        src={post.coverImage.asset.url}
                        alt={locale === 'ka' ? post.title_ka || '' : post.title_en || ''}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-4xl font-black text-dark-brown/10 font-serif">L</span>
                      </div>
                    )}
                  </div>
                  {getCategoryLabel(locale === 'ka' ? post.category_ka : post.category_en, locale) && (
                    <p className="text-[10px] uppercase tracking-widest font-bold text-burnt-orange mb-2">
                      {getCategoryLabel(locale === 'ka' ? post.category_ka : post.category_en, locale)}
                    </p>
                  )}
                  <h3 className="text-base font-bold font-serif text-dark-brown leading-snug group-hover:text-burnt-orange transition-colors duration-200 mb-2 line-clamp-2">
                    {locale === 'ka' ? post.title_ka : post.title_en}
                  </h3>
                  <p className="text-xs text-dark-brown/40 uppercase tracking-widest font-bold">
                    {formatDate(post.publishedAt, locale)}
                  </p>
                </a>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
