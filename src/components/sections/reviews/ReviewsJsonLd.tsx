import type { Locale } from '@/lib/utils'
import type { Review } from '@/lib/reviews'
import { reviewText, reviewName, reviewService } from '@/lib/reviews'
import { ORG_ID } from '@/lib/seo/schema'
import { JsonLd } from '@/components/seo/JsonLd'

interface ReviewsJsonLdProps {
  locale: Locale
  reviews: Review[]
}

/**
 * Schema.org Review nodes built ONLY from consented reviews actually rendered.
 *
 * `aggregateRating` is intentionally withheld until there are at least three
 * real reviews to average: publishing an aggregate derived from one or two
 * ratings is a Google structured-data guidelines risk (and misleading).
 */
const MIN_REVIEWS_FOR_AGGREGATE = 3

export function ReviewsJsonLd({ locale, reviews }: ReviewsJsonLdProps) {
  if (reviews.length === 0) return null

  const nodes: Array<Record<string, unknown>> = reviews.map((review) => ({
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: { '@id': ORG_ID },
    author: { '@type': 'Person', name: reviewName(review, locale) },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1,
    },
    // Omitted entirely when the real date is unknown — never guessed.
    ...(review.date ? { datePublished: review.date } : {}),
    reviewBody: reviewText(review, locale),
    about: reviewService(review, locale),
  }))

  if (reviews.length >= MIN_REVIEWS_FOR_AGGREGATE) {
    const total = reviews.reduce((sum, review) => sum + review.rating, 0)
    const average = Math.round((total / reviews.length) * 10) / 10
    nodes.push({
      '@context': 'https://schema.org',
      '@type': 'MedicalClinic',
      '@id': ORG_ID,
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: average,
        reviewCount: reviews.length,
        bestRating: 5,
        worstRating: 1,
      },
    })
  }

  return <JsonLd data={nodes} />
}
