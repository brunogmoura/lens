'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function NavBar({ userName }: { userName: string }) {
  const router   = useRouter()
  const supabase = createClient()
  const initials = userName.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'U'

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <nav style={{
      background: 'var(--s1)', borderBottom: '1px solid var(--border)',
      padding: '0 1.5rem', display: 'flex', alignItems: 'center', height: 50,
      position: 'sticky', top: 0, zIndex: 100,
    }}>
      <div style={{ fontWeight: 700, fontSize: '0.95rem', letterSpacing: -0.3, marginRight: '1.75rem', display: 'flex', alignItems: 'center', gap: 7 }}>
        <div style={{ width: 22, height: 22, background: 'var(--purple)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2">
            <circle cx="10" cy="10" r="4"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2" strokeLinecap="round"/>
          </svg>
        </div>
        Lens
      </div>

      <div style={{ height: 50, display: 'flex', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text)', borderBottom: '2px solid var(--plum)', padding: '0 0.9rem' }}>
        Meu Digest
      </div>

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ background: 'var(--s2)', border: '1px solid var(--border2)', borderRadius: 20, padding: '2px 9px', fontSize: '0.7rem', color: 'var(--sub)' }}>
          Pessoal
        </span>
        <button
          onClick={handleSignOut}
          title="Sair"
          style={{
            width: 27, height: 27, borderRadius: '50%',
            background: 'var(--purple)', border: 'none',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.65rem', fontWeight: 700, color: 'white', cursor: 'pointer',
          }}>
          {initials}
        </button>
      </div>
    </nav>
  )
}
