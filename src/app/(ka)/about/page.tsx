import type { Metadata } from 'next'
import { sanityClient, aboutPageQuery } from '@/lib/sanity'
import type { AboutPage as AboutPageData } from '@/lib/sanity/types'
import { AboutPage } from '@/components/pages/AboutPage'

export async function generateMetadata(): Promise<Metadata> {
  const data = await sanityClient.fetch<AboutPageData>(
    aboutPageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )

  return {
    title: data?.seo_title_ka || 'ჩვენს შესახებ',
    description: data?.seo_description_ka || undefined,
  }
}

export default async function KaAboutPage() {
  const data = await sanityClient.fetch<AboutPageData>(
    aboutPageQuery,
    {},
    { next: { tags: ['sanity'] } }
  )

  return <AboutPage locale="ka" data={data} />
}
