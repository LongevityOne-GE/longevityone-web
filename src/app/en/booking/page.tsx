import type { Metadata } from 'next'
import { BookingPage } from '@/components/pages/BookingPage'

export const metadata: Metadata = {
  title: 'Book a Consultation',
  description: 'Book a consultation at Longevity One preventive medicine center. Initial consultation, follow-up visit, or PNOE metabolic assessment.',
}

export default function EnBookingPage() {
  return <BookingPage locale="en" />
}
