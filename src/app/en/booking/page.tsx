import type { Metadata } from 'next'
import { BookingPage } from '@/components/pages/BookingPage'

export const metadata: Metadata = {
  title: 'Book a Visit',
  description: 'Book a visit at Longevity One preventive medicine center. Choose a time that suits you.',
}

export default function EnBookingPage() {
  return <BookingPage locale="en" />
}
