import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function KaServiceSlugRedirect({ params }: Props) {
  const { slug } = await params
  redirect(`/services#${slug}`)
}
