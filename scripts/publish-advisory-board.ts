/**
 * Publish script — Advisory Board.
 *
 * 1. Uploads the four portrait images from public/images/about/ to Sanity.
 * 2. Attaches each photo (with alt_ka / alt_en) to its draft member.
 * 3. Flips consentToPublicListing → true.
 * 4. Publishes each draft (createOrReplace published doc, delete draft).
 *
 * Idempotent: re-running re-uploads photos and republishes. Safe.
 *
 * Run:  npx tsx --env-file=.env.local scripts/publish-advisory-board.ts
 */

import { createClient } from '@sanity/client'
import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'icuuryo0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('SANITY_API_TOKEN is required.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-10-01',
  token,
  useCdn: false,
})

interface MemberPublishSpec {
  slug: string
  imagePath: string
  contentType: 'image/jpeg' | 'image/png'
  alt_ka: string
  alt_en: string
}

const PHOTO_DIR = resolve(process.cwd(), 'public/images/about')

const members: MemberPublishSpec[] = [
  {
    slug: 'ketevan-shavliashvili',
    imagePath: 'ქეთევან შავლიაშვილი.jpg',
    contentType: 'image/jpeg',
    alt_ka:
      'ქეთევან შავლიაშვილი — კლინიკური და სამეცნიერო მრჩეველი, Longevity One-ის საკონსულტაციო საბჭოს თავმჯდომარე',
    alt_en:
      'Ketevan Shavliashvili — Clinical & Scientific Advisor, Chair of the Scientific Advisory Board at Longevity One',
  },
  {
    slug: 'nino-nadiradze',
    imagePath: 'ნინო ნადირაძე.JPG',
    contentType: 'image/jpeg',
    alt_ka: 'ნინო ნადირაძე — ენდოკრინოლოგი, Longevity One-ის საკონსულტაციო საბჭოს წევრი',
    alt_en:
      'Nino Nadiradze — endocrinologist and Scientific Advisory Board member at Longevity One',
  },
  {
    slug: 'zviad-kipiani',
    imagePath: 'ზვიად ყიფიანი.JPG',
    contentType: 'image/jpeg',
    alt_ka: 'ზვიად ყიფიანი — კარდიოლოგი, Longevity One-ის საკონსულტაციო საბჭოს წევრი',
    alt_en:
      'Zviad Kipiani — cardiologist and Scientific Advisory Board member at Longevity One',
  },
  {
    slug: 'giorgi-kvitaishvili',
    imagePath: 'giorgi_kvitaishvili.png',
    contentType: 'image/png',
    alt_ka:
      'გიორგი კვიტაიშვილი — გასტროენტეროლოგი და ჰეპატოლოგი, Longevity One-ის საკონსულტაციო საბჭოს წევრი',
    alt_en:
      'Giorgi Kvitaishvili — gastroenterologist and hepatologist, Scientific Advisory Board member at Longevity One',
  },
]

async function uploadPhoto(spec: MemberPublishSpec): Promise<string> {
  const filePath = resolve(PHOTO_DIR, spec.imagePath)
  const buffer = readFileSync(filePath)
  const asset = await client.assets.upload('image', buffer, {
    filename: spec.imagePath,
    contentType: spec.contentType,
  })
  return asset._id
}

interface SanityDoc {
  _id: string
  _type: string
  _rev?: string
  _createdAt?: string
  _updatedAt?: string
  [key: string]: unknown
}

async function publishMember(spec: MemberPublishSpec): Promise<void> {
  // Use dash-only published IDs. Sanity excludes documents whose _id contains
  // a dot (other than the `drafts.` prefix) from public/unauthenticated queries.
  const draftId = `drafts.advisoryBoardMember.${spec.slug}`
  const publishedId = `advisoryBoardMember-${spec.slug}`
  const oldDottedPublishedId = `advisoryBoardMember.${spec.slug}`

  console.log(`\n→ ${spec.slug}`)
  console.log(`  Uploading photo: ${spec.imagePath}`)
  const assetId = await uploadPhoto(spec)
  console.log(`  Asset ID: ${assetId}`)

  // Pull the source doc — prefer the draft, fall back to a previously-published
  // doc with the legacy dotted _id (so re-running cleans up the dotted version).
  const draft =
    (await client.getDocument(draftId)) ||
    (await client.getDocument(oldDottedPublishedId))
  if (!draft) {
    throw new Error(
      `Source ${draftId} (or legacy ${oldDottedPublishedId}) not found — run seed-advisory-board.ts first.`,
    )
  }

  // Strip Sanity-managed system fields, swap _id, attach photo + consent.
  const {
    _id: _ignore1,
    _rev: _ignore2,
    _createdAt: _ignore3,
    _updatedAt: _ignore4,
    ...body
  } = draft as SanityDoc
  void _ignore1
  void _ignore2
  void _ignore3
  void _ignore4

  const publishedDoc: SanityDoc = {
    ...body,
    _id: publishedId,
    _type: 'advisoryBoardMember',
    photo: {
      _type: 'image',
      asset: { _type: 'reference', _ref: assetId },
      alt_ka: spec.alt_ka,
      alt_en: spec.alt_en,
    },
    consentToPublicListing: true,
  }

  console.log(`  Publishing → ${publishedId}`)
  await client.createOrReplace(publishedDoc)

  // Remove the draft AND any legacy dotted published doc.
  await client.delete(draftId).catch(() => null)
  await client.delete(oldDottedPublishedId).catch(() => null)
  console.log(`  Draft + legacy dotted doc removed.`)
}

async function publishAll(): Promise<void> {
  for (const spec of members) {
    await publishMember(spec)
  }
  console.log(`\n✅ Published ${members.length} advisory board members.`)
  console.log(
    `   The /about/advisory-board page should now render all members within the revalidation window.`,
  )
}

publishAll().catch((err: unknown) => {
  console.error('Publish failed:', err)
  process.exit(1)
})
