import { Logo } from '@/components/shared/Logo'

export default function Home() {
  return (
    <main
      style={{
        minHeight: '100svh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2rem',
        backgroundColor: 'var(--color-bone)',
        padding: '2rem',
      }}
    >
      <Logo markSize={72} variant="dark" />
      <p
        style={{
          color: 'var(--color-brown)',
          fontFamily: "'Mersad', system-ui, sans-serif",
          fontWeight: 400,
          fontSize: '0.75rem',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          opacity: 0.6,
        }}
      >
        Coming Soon
      </p>
    </main>
  )
}
