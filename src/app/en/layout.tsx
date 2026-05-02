import { SiteLayout } from '@/components/marketing/SiteLayout'

export default function EnLayout({ children }: { children: React.ReactNode }) {
  return <SiteLayout lang="en">{children}</SiteLayout>
}
