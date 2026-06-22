'use client'

import Image from 'next/image'
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

// Curated fallback imagery by category - used when Sanity coverImage is missing.
const fallbackImages: Record<string, string> = {
  'longevity-science':
    '/images/blog images/blog 1-2.jpeg',
  'metabolic-health':
    '/images/blog images/Blog 3.png',
  'elite-performance':
    'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1600&q=80',
  'technologies':
    'https://images.unsplash.com/photo-1530026405186-ed1f139313f8?auto=format&fit=crop&w=1600&q=80',
}

const defaultFallbackImage =
  'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=1600&q=80'

const slugImages: Record<string, string> = {
  'biological-age-vs-chronological-age': '/images/blog images/age.png',
  'why-traditional-diets-dont-work': '/images/blog images/diets.png',
  'vo2-max-longevity-predictor': '/images/blog images/vo2.png',
}

function getCoverImage(post: BlogPost, locale: Locale): string {
  const slug = post.slug ?? ''
  // Curated local overrides take precedence over Sanity's coverImage
  if (slug && slugImages[slug]) return slugImages[slug]
  if (post.coverImage?.asset?.url) return post.coverImage.asset.url
  const cat = locale === 'ka' ? post.category_ka : post.category_en
  if (cat && fallbackImages[cat]) return fallbackImages[cat]
  // also check the other locale's category in case only one is set
  const altCat = locale === 'ka' ? post.category_en : post.category_ka
  if (altCat && fallbackImages[altCat]) return fallbackImages[altCat]
  return defaultFallbackImage
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

  // Put "biological-age" post as featured if it exists, otherwise use first post
  const bioIdx = posts.findIndex((p) => p.slug === 'biological-age-vs-chronological-age')
  const reordered = bioIdx > 0
    ? [posts[bioIdx], ...posts.slice(0, bioIdx), ...posts.slice(bioIdx + 1)]
    : posts
  const [featured, ...rest] = reordered as [BlogPost, ...BlogPost[]]

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
              <div className="relative aspect-[16/9] rounded-lg overflow-hidden bg-dark-brown/5">
                <Image
                  src={getCoverImage(featured, locale)}
                  alt={locale === 'ka' ? featured.title_ka || '' : featured.title_en || ''}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div>
                {getCategoryLabel(locale === 'ka' ? featured.category_ka : featured.category_en, locale) && (
                  <p className="eyebrow mb-4">
                    {getCategoryLabel(locale === 'ka' ? featured.category_ka : featured.category_en, locale)}
                  </p>
                )}
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-black text-dark-brown leading-tight group-hover:text-burnt-orange transition-colors duration-200 mb-4">
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
          <div className={`grid grid-cols-1 ${rest.length === 2 ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-8 md:gap-10 border-t border-dark-brown/10 pt-16`}>
            {rest.map((post, idx) => (
              <Reveal key={post._id} delay={0.08 * idx}>
                <a
                  href={`${locale === 'en' ? '/en' : ''}/blog/${post.slug}`}
                  className="group block"
                >
                  <div className="relative rounded-lg overflow-hidden bg-dark-brown/5 mb-5 aspect-[16/9]">
                    <Image
                      src={getCoverImage(post, locale)}
                      alt={locale === 'ka' ? post.title_ka || '' : post.title_en || ''}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  {getCategoryLabel(locale === 'ka' ? post.category_ka : post.category_en, locale) && (
                    <p className="text-[10px] uppercase tracking-widest font-bold text-burnt-orange mb-2">
                      {getCategoryLabel(locale === 'ka' ? post.category_ka : post.category_en, locale)}
                    </p>
                  )}
                  <h3 className="text-base font-bold text-dark-brown leading-snug group-hover:text-burnt-orange transition-colors duration-200 mb-2 line-clamp-2">
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
