'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Tab = 'digest' | 'saved' | 'history'

type Props = {
  userName: string
  tab: Tab
  onTabChange: (tab: Tab) => void
  savedCount: number
}

export default function NavBar({ userName, tab, onTabChange, savedCount }: Props) {
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
      background: 'var(--s2)',
      borderBottom: '1px solid var(--border)',
      padding: '0 2rem',
      display: 'flex',
      alignItems: 'center',
      height: 58,
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 9,
        marginRight: '2rem',
        fontFamily: "'DM Mono', monospace",
        fontWeight: 500, fontSize: '0.88rem',
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        <div style={{
          width: 30, height: 30,
          border: '1px solid var(--border)',
          borderRadius: 2,
          background: 'var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2">
            <circle cx="10" cy="10" r="4"/>
            <path d="M10 3v2M10 15v2M3 10h2M15 10h2" strokeLinecap="round"/>
          </svg>
        </div>
        Lens
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.6rem', fontWeight: 400,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--muted)',
          border: '1px solid var(--border2)',
          borderRadius: 2, padding: '2px 7px',
        }}>Beta</span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', height: '100%' }}>
        <TabItem label="Digest" active={tab === 'digest'} onClick={() => onTabChange('digest')} />
        <TabItem
          label={savedCount > 0 ? `Salvos · ${savedCount}` : 'Salvos'}
          active={tab === 'saved'}
          onClick={() => onTabChange('saved')}
        />
        <TabItem label="Histórico" active={tab === 'history'} onClick={() => onTabChange('history')} />
      </div>

      {/* Avatar */}
      <div style={{ marginLeft: 'auto' }}>
        <button
          onClick={handleSignOut}
          title="Sair"
          style={{
            width: 30, height: 30,
            borderRadius: 2,
            border: '1px solid var(--border)',
            background: 'var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.6rem', fontWeight: 500,
            color: 'white', cursor: 'pointer',
          }}>
          {initials}
        </button>
      </div>
    </nav>
  )
}

function TabItem({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        height: '100%', padding: '0 1rem',
        background: 'none', border: 'none',
        borderBottom: active ? '2px solid var(--border)' : '2px solid transparent',
        fontFamily: "'DM Mono', monospace",
        fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase',
        color: active ? 'var(--text)' : 'var(--muted)',
        cursor: 'pointer',
        transition: 'color 0.12s, border-color 0.12s',
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.color = 'var(--sub)' }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'var(--muted)' }}
    >
      {label}
    </button>
  )
}
