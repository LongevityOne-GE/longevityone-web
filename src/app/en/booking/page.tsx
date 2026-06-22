import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BookingPage } from '@/components/pages/BookingPage'
import { BOOKING_ENABLED } from '@/lib/features'
import { buildMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = {
  ...buildMetadata({
    locale: 'en',
    path: '/booking',
    title: 'Book a Visit',
    description:
      'Book a visit at Longevity One preventive medicine center. Choose a time that suits you.',
  }),
  // Booking is temporarily disabled — keep this page out of the index.
  ...(BOOKING_ENABLED ? {} : { robots: { index: false, follow: false } }),
}

export default function EnBookingPage() {
  // Calls-only mode: send visitors to contact instead of online booking.
  if (!BOOKING_ENABLED) redirect('/en/contact')
  return <BookingPage locale="en" />
}
