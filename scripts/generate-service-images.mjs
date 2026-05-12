/**
 * Service hero image generator using fal.ai REST API.
 *
 * Usage:
 *   FAL_KEY=your_key_here node scripts/generate-service-images.mjs
 *
 * Get a key at https://fal.ai — images cost ~$0.03 each with nano-banana-pro.
 * Generated images are saved to public/images/services/
 */

import { writeFileSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ROOT = join(__dirname, '..')
const OUT_DIR = join(ROOT, 'public', 'images', 'services')

const FAL_KEY = process.env.FAL_KEY
if (!FAL_KEY) {
  console.error('Error: FAL_KEY environment variable is not set.')
  console.error('Usage: FAL_KEY=your_key_here node scripts/generate-service-images.mjs')
  process.exit(1)
}

const BRAND_STYLE = [
  'neoclassical aesthetic',
  'warm bone-white and dark-brown tones',
  'burnt-orange accent highlights',
  'elegant scientific photography',
  'high-contrast editorial lighting',
  'no people visible',
  'premium medical wellness brand',
  'ultra-clean composition',
  'shallow depth of field',
].join(', ')

const NEGATIVE = 'cartoon, illustration, text, watermark, people, faces, low quality, blurry, oversaturated'

const services = [
  {
    slug: 'longevity',
    filename: 'longevity.jpg',
    prompt: `A close-up of an ancient marble sculpture surface with intricate veining, DNA double-helix rendered as a delicate golden filament hovering above it, soft warm light raking across the stone, ${BRAND_STYLE}`,
  },
  {
    slug: 'metabolic',
    filename: 'metabolic.jpg',
    prompt: `Macro photograph of organic cellular cross-sections under polarised light, warm amber and cream tones, geometric hexagonal cell walls glowing softly, microscope beauty, ${BRAND_STYLE}`,
  },
  {
    slug: 'performance',
    filename: 'performance.jpg',
    prompt: `A classical Greek bronze discus-thrower statue fragment - torso and extended arm - dramatically lit from below, motion blur trails suggesting kinetic energy, deep shadow background fading to bone white, ${BRAND_STYLE}`,
  },
]

async function generate(service) {
  console.log(`Generating image for: ${service.slug}...`)

  const response = await fetch('https://fal.run/fal-ai/nano-banana-pro', {
    method: 'POST',
    headers: {
      Authorization: `Key ${FAL_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      prompt: service.prompt,
      negative_prompt: NEGATIVE,
      image_size: 'portrait_4_3',
      num_images: 1,
      guidance_scale: 7.5,
      num_inference_steps: 28,
      seed: 42,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`fal.ai error for ${service.slug}: ${response.status} ${err}`)
  }

  const data = await response.json()
  const imageUrl = data?.images?.[0]?.url
  if (!imageUrl) {
    throw new Error(`No image URL in response for ${service.slug}: ${JSON.stringify(data)}`)
  }

  const imgResponse = await fetch(imageUrl)
  if (!imgResponse.ok) throw new Error(`Failed to download image for ${service.slug}`)

  const buffer = await imgResponse.arrayBuffer()
  const outPath = join(OUT_DIR, service.filename)
  writeFileSync(outPath, Buffer.from(buffer))
  console.log(`  Saved: public/images/services/${service.filename}`)
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true })

  for (const service of services) {
    try {
      await generate(service)
    } catch (err) {
      console.error(`  Failed: ${err.message}`)
    }
  }

  console.log('\nDone. Upload images to Sanity or reference them from ServiceSection.')
  console.log('Static paths: /images/services/longevity.jpg etc.')
}

main()
