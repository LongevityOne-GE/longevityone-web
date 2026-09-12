import type { Metadata } from 'next'

// The admin area is reachable by URL but must never be indexed, and is not
// linked from any nav, footer or sitemap.
export const metadata: Metadata = {
  title: 'Admin',
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-bone-white text-dark-brown">{children}</div>
}
