import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { BookingPage } from '@/components/pages/BookingPage'
import { BOOKING_ENABLED } from '@/lib/features'

export const metadata: Metadata = {
  title: 'დაჯავშნეთ ვიზიტი',
  description: 'დაჯავშნეთ ვიზიტი Longevity One-ს პრევენციული მედიცინის ცენტრში. აირჩიეთ თქვენთვის სასურველი დრო.',
  // Booking is temporarily disabled — keep this page out of the index.
  ...(BOOKING_ENABLED ? {} : { robots: { index: false, follow: false } }),
}

export default function KaBookingPage() {
  // Calls-only mode: send visitors to contact instead of online booking.
  if (!BOOKING_ENABLED) redirect('/contact')
  return <BookingPage locale="ka" />
}
