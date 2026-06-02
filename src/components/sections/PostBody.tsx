'use client'

import { localizedTechName, type Locale } from '@/lib/utils'
import type { BlogPostDetail } from '@/lib/sanity/types'
import { Reveal } from '@/components/animations/Reveal'
import { PortableTextRenderer } from '@/components/shared/PortableTextRenderer'

interface PostBodyProps {
  locale: Locale
  post: BlogPostDetail
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

export function PostBody({ locale, post }: PostBodyProps) {
  const body = locale === 'ka' ? post.body_ka : post.body_en
  const authorName = locale === 'ka' ? post.author?.name : (post.author?.name_en || post.author?.name)
  const techLabel = locale === 'ka' ? 'დაკავშირებული ტექნოლოგიები' : 'Related Technologies'

  return (
    <section className="py-20 md:py-32 bg-bone-white">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-20">
          {/* body */}
          <div className="lg:col-span-2">
            {post.coverImage?.asset?.url && (
              <Reveal>
                <div className="aspect-[16/9] rounded-lg overflow-hidden mb-12">
                  <img
                    src={post.coverImage.asset.url}
                    alt={locale === 'ka' ? post.title_ka || '' : post.title_en || ''}
                    className="w-full h-full object-cover"
                  />
                </div>
              </Reveal>
            )}

            {body && (
              <Reveal delay={0.1}>
                <PortableTextRenderer value={body} />
              </Reveal>
            )}
          </div>

          {/* sidebar */}
          <aside className="space-y-10 lg:sticky lg:top-32 lg:self-start">
            {authorName && (
              <Reveal delay={0.15}>
                <div className="border-t border-dark-brown/20 pt-6">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-4">
                    {locale === 'ka' ? 'ავტორი' : 'Author'}
                  </h4>
                  <div className="flex items-center gap-3">
                    {post.author?.photo?.asset?.url && (
                      <img
                        src={post.author.photo.asset.url}
                        alt={authorName}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    )}
                    <p className="text-sm font-bold text-dark-brown">{authorName}</p>
                  </div>
                </div>
              </Reveal>
            )}

            {post.publishedAt && (
              <Reveal delay={0.2}>
                <div className="border-t border-dark-brown/20 pt-6">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-3">
                    {locale === 'ka' ? 'გამოქვეყნდა' : 'Published'}
                  </h4>
                  <p className="text-sm text-dark-brown/70">
                    {formatDate(post.publishedAt, locale)}
                  </p>
                </div>
              </Reveal>
            )}

            {post.relatedTechnologies && post.relatedTechnologies.length > 0 && (
              <Reveal delay={0.25}>
                <div className="border-t border-dark-brown/20 pt-6">
                  <h4 className="text-xs uppercase tracking-widest font-bold text-burnt-orange mb-4">
                    {techLabel}
                  </h4>
                  <ul className="space-y-3">
                    {post.relatedTechnologies.map((tech) => (
                      <li key={tech.anchor}>
                        <a
                          href={`${locale === 'en' ? '/en' : ''}/technologies#${tech.anchor}`}
                          className="text-sm font-bold text-dark-brown hover:text-burnt-orange transition-colors duration-200"
                        >
                          {localizedTechName(tech, locale)}
                        </a>
                        <p className="text-xs text-dark-brown/50 mt-0.5">
                          {locale === 'ka' ? tech.tagline_ka : tech.tagline_en}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            )}

            <Reveal delay={0.3}>
              <div className="border-t border-dark-brown/20 pt-6">
                <a
                  href={locale === 'en' ? '/en/blog' : '/blog'}
                  className="text-xs uppercase tracking-widest font-bold text-dark-brown/40 hover:text-burnt-orange transition-colors duration-200"
                >
                  ← {locale === 'ka' ? 'ყველა სტატია' : 'All Articles'}
                </a>
              </div>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  )
}
