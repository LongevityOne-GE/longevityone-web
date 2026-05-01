import { createClient as createSanityClient } from 'next-sanity'
import imageUrlBuilder, { type SanityImageSource } from '@sanity/image-url'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-11-01'

if (!projectId) {
  console.warn('[sanity] NEXT_PUBLIC_SANITY_PROJECT_ID is not set')
}

export const sanityClient = createSanityClient({
  projectId: projectId ?? 'placeholder',
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production',
  perspective: 'published',
})

const builder = imageUrlBuilder(sanityClient)

export function urlForImage(source: SanityImageSource) {
  return builder.image(source).auto('format').fit('max')
}
