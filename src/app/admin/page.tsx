import { redirect } from 'next/navigation'

/** /admin has no content of its own; the dashboard is the landing screen. */
export default function AdminIndexPage() {
  redirect('/admin/leads')
}
