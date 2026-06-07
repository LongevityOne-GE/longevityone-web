import type { Metadata } from 'next'
import { BookingPage } from '@/components/pages/BookingPage'

export const metadata: Metadata = {
  title: 'დაჯავშნეთ ვიზიტი',
  description: 'დაჯავშნეთ ვიზიტი Longevity One-ს პრევენციული მედიცინის ცენტრში. აირჩიეთ თქვენთვის სასურველი დრო.',
}

export default function KaBookingPage() {
  return <BookingPage locale="ka" />
}
