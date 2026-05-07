#!/usr/bin/env node
/**
 * Seeds 3 blog posts from CONTENT.md into Sanity.
 * Usage: SANITY_WRITE_TOKEN=<token> node scripts/seed-blog-posts.mjs
 */
import { createClient } from '@sanity/client'
import { readFileSync } from 'fs'
import 'dotenv/config'

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production'
const token = process.env.SANITY_WRITE_TOKEN
if (!projectId || !token) { console.error('❌ Set NEXT_PUBLIC_SANITY_PROJECT_ID + SANITY_WRITE_TOKEN'); process.exit(1) }

const client = createClient({ projectId, dataset, apiVersion: '2024-11-01', token, useCdn: false })

let kc = 0
const k = () => `k${Date.now().toString(36)}${(kc++).toString(36)}`

function toBlocks(text) {
  if (!text) return []
  return text.split(/\n\n+/).filter(Boolean).flatMap(p => {
    const t = p.trim()
    const bm = t.match(/^\*\*(.+?)\*\*$/)
    if (bm) return [{ _type:'block', _key:k(), style:'h3', markDefs:[], children:[{_type:'span',_key:k(),text:bm[1],marks:[]}] }]
    if (t.startsWith('- ')) return t.split('\n').filter(l=>l.startsWith('- ')).map(l=>({_type:'block',_key:k(),style:'normal',listItem:'bullet',level:1,markDefs:[],children:[{_type:'span',_key:k(),text:l.slice(2),marks:[]}]}))
    const children = []; let last=0
    const rx = /(\*\*(.+?)\*\*|\*(.+?)\*)/g; let m
    while((m=rx.exec(t))!==null){
      if(m.index>last) children.push({_type:'span',_key:k(),text:t.slice(last,m.index),marks:[]})
      children.push({_type:'span',_key:k(),text:m[2]||m[3],marks:[m[2]?'strong':'em']})
      last=m.index+m[0].length
    }
    if(last<t.length) children.push({_type:'span',_key:k(),text:t.slice(last),marks:[]})
    if(!children.length) children.push({_type:'span',_key:k(),text:t,marks:[]})
    return [{_type:'block',_key:k(),style:'normal',markDefs:[],children}]
  })
}

// Extract sections from CONTENT.md between markers
const content = readFileSync('CONTENT.md','utf8')
function between(start, end) {
  const s = content.indexOf(start)
  const e = content.indexOf(end, s+start.length)
  return s>=0 && e>=0 ? content.slice(s+start.length, e).trim() : ''
}

// Post 1
const p1en = between('#### Content (English):\n', '\n---\n\n#### Content (Georgian):')
const p1ka = between('#### Content (Georgian):\n\n', '\n\n---\n\n### POST 2')

// Post 2 — find second occurrence
const p2start = content.indexOf('### POST 2')
const p2enStart = content.indexOf('#### Content (English):\n', p2start)
const p2enEnd = content.indexOf('\n---\n\n#### Content (Georgian):', p2enStart)
const p2en = content.slice(p2enStart + '#### Content (English):\n'.length, p2enEnd).trim()
const p2kaStart = content.indexOf('#### Content (Georgian):\n', p2enEnd)
const p2kaEnd = content.indexOf('\n\n---\n\n### POST 3', p2kaStart)
const p2ka = content.slice(p2kaStart + '#### Content (Georgian):\n'.length, p2kaEnd).trim()

// Post 3
const p3start = content.indexOf('### POST 3')
const p3enStart = content.indexOf('#### Content (English):\n', p3start)
const p3enEnd = content.indexOf('\n---\n\n#### Content (Georgian):', p3enStart)
const p3en = content.slice(p3enStart + '#### Content (English):\n'.length, p3enEnd).trim()
const p3kaStart = content.indexOf('#### Content (Georgian):\n', p3enEnd)
const p3kaEnd = content.indexOf('\n\n---\n\n## CONTACT PAGE', p3kaStart)
const p3ka = content.slice(p3kaStart + '#### Content (Georgian):\n'.length, p3kaEnd).trim()

const posts = [
  {
    _type: 'blogPost',
    _id: 'blogPost-biological-age',
    title_ka: 'ბიოლოგიური ასაკი vs. ქრონოლოგიური ასაკი — რომელი მნიშვნელოვანია?',
    title_en: 'Biological Age vs. Chronological Age — Which One Actually Matters?',
    slug: { _type: 'slug', current: 'biological-age-vs-chronological-age' },
    category_ka: 'longevity-science', category_en: 'longevity-science',
    excerpt_ka: 'თქვენი დაბადების წელი თქვენი სიცოცხლის ხანგრძლივობაზე თითქმის არაფერს ამბობს. ის, რაც ნამდვილად მნიშვნელოვანია — სხვა რამეა.',
    excerpt_en: 'The year you were born tells you almost nothing about how long you\'ll live — and what does is something entirely different.',
    body_en: toBlocks(p1en), body_ka: toBlocks(p1ka),
    publishedAt: '2026-04-15T10:00:00Z',
    tags: ['biological-age', 'epigenetics', 'truediagnostic'],
  },
  {
    _type: 'blogPost',
    _id: 'blogPost-traditional-diets',
    title_ka: 'რატომ არ მუშაობს ტრადიციული დიეტები — მეცნიერული ახსნა',
    title_en: 'Why Traditional Diets Don\'t Work — The Scientific Explanation',
    slug: { _type: 'slug', current: 'why-traditional-diets-dont-work' },
    category_ka: 'metabolic-health', category_en: 'metabolic-health',
    excerpt_ka: 'პრობლემა ნებისყოფაში არ არის. პრობლემა ისაა, რომ დიეტების უმეტესობა თქვენს მეტაბოლიზმს სრულიად უგულვებელყოფს.',
    excerpt_en: 'The problem isn\'t willpower — it\'s that most diets ignore your individual metabolism entirely.',
    body_en: toBlocks(p2en), body_ka: toBlocks(p2ka),
    publishedAt: '2026-04-22T10:00:00Z',
    tags: ['metabolism', 'pnoe', 'microbiome', 'enbiosis'],
  },
  {
    _type: 'blogPost',
    _id: 'blogPost-vo2-max',
    title_ka: 'VO₂ Max — სიცოცხლის ხანგრძლივობის ყველაზე ზუსტი პრედიქტორი',
    title_en: 'VO₂ Max — The Single Best Predictor of How Long You\'ll Live',
    slug: { _type: 'slug', current: 'vo2-max-longevity-predictor' },
    category_ka: 'longevity-science', category_en: 'longevity-science',
    excerpt_ka: 'ეს ერთი მაჩვენებელი, რომელსაც წლიური გამოკვლევა არასდროს ზომავს, ქოლესტეროლზე, არტერიულ წნევასა და სიმსუქნეზე მეტს გეუბნება.',
    excerpt_en: 'The one number your annual check-up never measures — and why it matters more than cholesterol, blood pressure, and BMI combined.',
    body_en: toBlocks(p3en), body_ka: toBlocks(p3ka),
    publishedAt: '2026-05-01T10:00:00Z',
    tags: ['vo2-max', 'pnoe', 'cardiorespiratory-fitness'],
  },
]

async function seed() {
  const tx = client.transaction()
  for (const post of posts) {
    tx.createOrReplace(post)
  }
  const result = await tx.commit()
  console.log(`✅ Seeded ${posts.length} blog posts (tx: ${result.transactionId})`)
}

seed().catch(err => { console.error('❌', err.message); process.exit(1) })
