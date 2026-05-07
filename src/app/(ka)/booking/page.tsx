import type { Metadata } from 'next'
import { BookingPage } from '@/components/pages/BookingPage'

export const metadata: Metadata = {
  title: 'კონსულტაციის დაჯავშნა',
  description: 'დაჯავშნეთ კონსულტაცია Longevity One-ს პრევენციული მედიცინის ცენტრში. საწყისი კონსულტაცია, განმეორებითი ვიზიტი ან PNOE შეფასება.',
}

export default function KaBookingPage() {
  return <BookingPage locale="ka" />
}
