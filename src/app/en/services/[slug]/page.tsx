import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function EnServiceSlugRedirect({ params }: Props) {
  const { slug } = await params
  redirect(`/en/services#${slug}`)
}
