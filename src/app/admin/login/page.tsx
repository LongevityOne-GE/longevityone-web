import { LoginForm } from './LoginForm'

/**
 * Reads `?error=1` on the server, set by the magic-link callback when the code
 * exchange fails and by the middleware for a session without admin access.
 * Without surfacing it the page looked unchanged and a failed sign-in was
 * indistinguishable from a page refresh.
 */
export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { error } = await searchParams
  return <LoginForm linkFailed={error === '1'} />
}
