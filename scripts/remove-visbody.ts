/**
 * Removes all Visbody references from the live Sanity dataset.
 *
 * What this script does:
 *   1. Deletes the `tech-visbody` technology document.
 *   2. Patches any `package` doc whose `includes_ka` / `includes_en` arrays
 *      contain a "Visbody" entry — strips those items.
 *   3. Patches any `journeyStage` doc whose body_ka / body_en portable text
 *      mentions Visbody — rewrites the affected spans.
 *   4. Patches the `faq-first-visit` FAQ doc to drop the Visbody mention.
 *   5. Shifts `order` values for the remaining technology docs so there is no
 *      gap where Visbody used to sit (order: 2).
 *
 * Idempotent — safe to re-run.
 *
 * Usage (Node 20.6+, no extra deps):
 *   node --env-file=.env.local --experimental-strip-types scripts/remove-visbody.ts
 *   node --env-file=.env.local --experimental-strip-types -e 'process.env.APPLY="1"' \
 *        -r ./scripts/remove-visbody.ts
 *
 *   With SANITY_WRITE_TOKEN in .env.local:
 *     node --env-file=.env.local --experimental-strip-types scripts/remove-visbody.ts        # dry-run
 *     APPLY=1 node --env-file=.env.local --experimental-strip-types scripts/remove-visbody.ts # commit
 *
 * Env vars:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID
 *   NEXT_PUBLIC_SANITY_DATASET (default: production)
 *   NEXT_PUBLIC_SANITY_API_VERSION (default: 2024-11-01)
 *   SANITY_WRITE_TOKEN            (required — editor or admin token)
 *   APPLY                         (when "1", commits writes; otherwise dry-run)
 */

import { createClient } from 'next-sanity'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? '2024-11-01'
const token = process.env.SANITY_WRITE_TOKEN
const apply = process.env.APPLY === '1'

if (!projectId) {
  console.error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID')
  process.exit(1)
}
if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN (editor/admin token with write access)')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

const VISBODY_REGEX = /visbody/i

type PortableBlock = {
  _type: string
  _key?: string
  children?: Array<{ _type: string; text?: string; _key?: string; marks?: string[] }>
  [key: string]: unknown
}

function hasVisbodyInText(text: string | null | undefined): boolean {
  return !!text && VISBODY_REGEX.test(text)
}

function hasVisbodyInBlocks(blocks: PortableBlock[] | null | undefined): boolean {
  if (!blocks) return false
  return blocks.some((b) =>
    b.children?.some((c) => typeof c.text === 'string' && VISBODY_REGEX.test(c.text))
  )
}

/** Remove "Visbody ..." clauses from plain sentences while keeping grammar OK. */
function stripVisbodyFromText(text: string): string {
  return text
    // "X, Visbody 3D, Y" → "X, Y"
    .replace(/,\s*Visbody[^,.]*(?=,|\.)/gi, '')
    // "Visbody 3D, " at start → ""
    .replace(/^Visbody[^,.]*,\s*/i, '')
    // "- Visbody ..." list item → empty line
    .replace(/\s*[-—]?\s*Visbody[^.]*\./gi, '')
    // "Visbody scanning" or bare "Visbody" → drop token
    .replace(/\bVisbody[^.,;]*/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;])/g, '$1')
    .trim()
}

function patchBlocks(blocks: PortableBlock[] | null | undefined): PortableBlock[] | null {
  if (!blocks) return blocks ?? null
  return blocks.map((block) => {
    if (!block.children) return block
    const newChildren = block.children.map((c) =>
      typeof c.text === 'string' && VISBODY_REGEX.test(c.text)
        ? { ...c, text: stripVisbodyFromText(c.text) }
        : c
    )
    return { ...block, children: newChildren }
  })
}

async function main() {
  console.log(`\n—— remove-visbody ——`)
  console.log(`project: ${projectId}  dataset: ${dataset}  apply: ${apply ? 'YES' : 'DRY-RUN'}\n`)

  // 1. Delete the visbody technology doc (by slug to survive any _id drift).
  const visbodyTechIds: string[] = await client.fetch(
    `*[_type == "technology" && (slug.current == "visbody" || _id == "tech-visbody" || name match "*Visbody*")]._id`
  )
  console.log(`technology docs to delete: ${visbodyTechIds.length} ${visbodyTechIds}`)

  // 2. Patch packages.
  const pkgs: Array<{
    _id: string
    includes_ka: string[] | null
    includes_en: string[] | null
  }> = await client.fetch(
    `*[_type == "package"]{_id, includes_ka, includes_en}`
  )
  const pkgPatches = pkgs
    .map((p) => {
      const nextKa = (p.includes_ka ?? []).filter((s) => !VISBODY_REGEX.test(s))
      const nextEn = (p.includes_en ?? []).filter((s) => !VISBODY_REGEX.test(s))
      const changedKa = nextKa.length !== (p.includes_ka?.length ?? 0)
      const changedEn = nextEn.length !== (p.includes_en?.length ?? 0)
      if (!changedKa && !changedEn) return null
      return { _id: p._id, includes_ka: nextKa, includes_en: nextEn }
    })
    .filter(Boolean) as Array<{ _id: string; includes_ka: string[]; includes_en: string[] }>
  console.log(`package docs to patch: ${pkgPatches.length} ${pkgPatches.map((p) => p._id)}`)

  // 3. Patch journey stages (portable text body).
  const stages: Array<{
    _id: string
    body_ka: PortableBlock[] | null
    body_en: PortableBlock[] | null
  }> = await client.fetch(
    `*[_type == "journeyStage"]{_id, body_ka, body_en}`
  )
  const stagePatches = stages
    .map((s) => {
      const changed = hasVisbodyInBlocks(s.body_ka) || hasVisbodyInBlocks(s.body_en)
      if (!changed) return null
      return {
        _id: s._id,
        body_ka: patchBlocks(s.body_ka),
        body_en: patchBlocks(s.body_en),
      }
    })
    .filter(Boolean) as Array<{
      _id: string
      body_ka: PortableBlock[] | null
      body_en: PortableBlock[] | null
    }>
  console.log(`journeyStage docs to patch: ${stagePatches.length} ${stagePatches.map((s) => s._id)}`)

  // 4. Patch FAQ items (portable text answer).
  const faqs: Array<{
    _id: string
    answer_ka: PortableBlock[] | null
    answer_en: PortableBlock[] | null
  }> = await client.fetch(
    `*[_type == "faqItem"]{_id, answer_ka, answer_en}`
  )
  const faqPatches = faqs
    .map((f) => {
      const changed = hasVisbodyInBlocks(f.answer_ka) || hasVisbodyInBlocks(f.answer_en)
      if (!changed) return null
      return {
        _id: f._id,
        answer_ka: patchBlocks(f.answer_ka),
        answer_en: patchBlocks(f.answer_en),
      }
    })
    .filter(Boolean) as Array<{
      _id: string
      answer_ka: PortableBlock[] | null
      answer_en: PortableBlock[] | null
    }>
  console.log(`faqItem docs to patch: ${faqPatches.length} ${faqPatches.map((f) => f._id)}`)

  // 5. Shift remaining technology orders so there is no gap at 2.
  const remainingTechs: Array<{ _id: string; order: number | null }> = await client.fetch(
    `*[_type == "technology" && !(_id in $ids)] | order(order asc){_id, order}`,
    { ids: visbodyTechIds.length ? visbodyTechIds : ['__none__'] }
  )
  const orderPatches = remainingTechs
    .map((t, idx) => {
      const nextOrder = idx + 1
      if (t.order === nextOrder) return null
      return { _id: t._id, order: nextOrder }
    })
    .filter(Boolean) as Array<{ _id: string; order: number }>
  console.log(`technology order shifts: ${orderPatches.length} ${JSON.stringify(orderPatches)}`)

  if (!apply) {
    console.log(`\nDRY-RUN — nothing written. Re-run with APPLY=1 to commit.\n`)
    return
  }

  console.log(`\nApplying…`)
  const tx = client.transaction()
  for (const id of visbodyTechIds) tx.delete(id)
  for (const p of pkgPatches) {
    tx.patch(p._id, (patch) =>
      patch.set({ includes_ka: p.includes_ka, includes_en: p.includes_en })
    )
  }
  for (const s of stagePatches) {
    tx.patch(s._id, (patch) =>
      patch.set({ body_ka: s.body_ka, body_en: s.body_en })
    )
  }
  for (const f of faqPatches) {
    tx.patch(f._id, (patch) =>
      patch.set({ answer_ka: f.answer_ka, answer_en: f.answer_en })
    )
  }
  for (const o of orderPatches) {
    tx.patch(o._id, (patch) => patch.set({ order: o.order }))
  }
  const result = await tx.commit({ visibility: 'async' })
  console.log(`✓ transaction committed: ${result.transactionId}`)
  console.log(`  documents affected: ${result.documentIds?.length ?? '?'}\n`)
}

main().catch((err) => {
  console.error('remove-visbody failed:', err)
  process.exit(1)
})
