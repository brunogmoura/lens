import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (user) redirect('/app')

  return (
    <main style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ maxWidth: 420, width: '100%', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ width: 34, height: 34, background: 'var(--purple)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2">
              <circle cx="10" cy="10" r="4"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2" strokeLinecap="round"/>
            </svg>
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: -0.4 }}>Lens</span>
        </div>

        <p style={{ fontSize: '0.82rem', color: 'var(--muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
          Inteligência de mercado que evolui com o seu contexto
        </p>

        <Link href="/login" style={{
          display: 'block', width: '100%', background: 'var(--purple)',
          border: 'none', borderRadius: 8, color: 'white',
          padding: '0.7rem', fontSize: '0.88rem', fontWeight: 600,
          textAlign: 'center', transition: 'opacity 0.12s',
        }}>
          Entrar no Lens
        </Link>
      </div>
    </main>
  )
}
