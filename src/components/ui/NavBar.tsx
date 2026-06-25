'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

type Tab = 'digest' | 'saved' | 'history'

type Props = {
  userName: string
  userId: string
  tab: Tab
  onTabChange: (tab: Tab) => void
  savedCount: number
  userTopic: string | null
  onTopicChange: (topic: string) => void
}

const TOPICS = [
  { value: 'negocios', label: 'Negócios & Estratégia', desc: 'Movimentos de mercado, M&A, regulação e estratégia competitiva' },
  { value: 'tecnologia', label: 'Tecnologia & Produto', desc: 'IA, infraestrutura, ferramentas de desenvolvimento e produto' },
  { value: 'pessoas', label: 'Pessoas & Gestão', desc: 'Liderança, cultura, carreira e desenvolvimento de times' },
]

export default function NavBar({ userName, userId, tab, onTabChange, savedCount, userTopic, onTopicChange }: Props) {
  const router   = useRouter()
  const supabase = createClient()
  const initials = userName.split(' ').slice(0, 2).map(n => n[0]).join('').toUpperCase() || 'U'

  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [prefsOpen, setPrefsOpen]       = useState(false)
  const [selectedTopic, setSelectedTopic] = useState(userTopic ?? '')
  const [saving, setSaving] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  async function savePrefs() {
    if (saving) return
    setSaving(true)
    await supabase.from('profiles').update({ topic: selectedTopic }).eq('id', userId)
    onTopicChange(selectedTopic)
    setSaving(false)
    setPrefsOpen(false)
  }

  return (
    <>
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

        {/* Avatar + dropdown */}
        <div style={{ marginLeft: 'auto', position: 'relative' }} ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(v => !v)}
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

          {dropdownOpen && (
            <div style={{
              position: 'absolute', right: 0, top: 'calc(100% + 6px)',
              background: 'var(--s2)', border: '1px solid var(--border2)',
              borderRadius: 2, minWidth: 148, zIndex: 200,
            }}>
              <button
                onClick={() => { setPrefsOpen(true); setDropdownOpen(false) }}
                style={ddItemStyle}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="10" cy="10" r="3"/>
                  <path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4"/>
                </svg>
                Preferências
              </button>
              <button
                onClick={handleSignOut}
                style={{ ...ddItemStyle, borderBottom: 'none', color: 'var(--muted)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
              >
                <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M9 3H5a1 1 0 00-1 1v12a1 1 0 001 1h4M13 7l3 3-3 3M10 10h7"/>
                </svg>
                Sair
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Modal de Preferências */}
      {prefsOpen && (
        <div
          onClick={e => { if (e.target === e.currentTarget) setPrefsOpen(false) }}
          style={{
            position: 'fixed', inset: 0,
            background: 'rgba(26,25,21,0.45)',
            zIndex: 400,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div style={{
            background: 'var(--s2)',
            border: '1px solid var(--border2)',
            borderRadius: 2,
            width: 'min(440px, 100%)',
            maxHeight: '85vh',
            overflowY: 'auto',
          }}>
            {/* Header */}
            <div style={{
              display: 'flex', alignItems: 'center',
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border3)',
            }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.72rem', fontWeight: 500,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                flex: 1,
              }}>Preferências</span>
              <button
                onClick={() => setPrefsOpen(false)}
                style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', fontSize: '1rem', lineHeight: 1, padding: 2 }}
              >✕</button>
            </div>

            {/* Body */}
            <div style={{ padding: '1.25rem' }}>
              <div style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.6rem', fontWeight: 700,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--muted)', marginBottom: '0.75rem',
              }}>Meu tópico principal</div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: '1.75rem' }}>
                {TOPICS.map(t => {
                  const active = selectedTopic === t.value
                  return (
                    <button
                      key={t.value}
                      onClick={() => setSelectedTopic(t.value)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 10,
                        padding: '0.7rem 0.9rem',
                        border: `1px solid ${active ? 'var(--border)' : 'var(--border2)'}`,
                        borderRadius: 2,
                        background: active ? 'var(--lima)' : 'var(--s1)',
                        cursor: 'pointer', textAlign: 'left',
                        transition: 'border-color 0.12s, background 0.12s',
                      }}
                    >
                      <div style={{
                        width: 14, height: 14,
                        borderRadius: '50%',
                        border: `1.5px solid ${active ? 'var(--border)' : 'var(--border2)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, marginTop: 2,
                      }}>
                        {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--border)' }} />}
                      </div>
                      <div>
                        <div style={{
                          fontFamily: "'DM Mono', monospace",
                          fontSize: '0.66rem', fontWeight: 500,
                          letterSpacing: '0.06em', textTransform: 'uppercase',
                          color: 'var(--text)', marginBottom: 3,
                        }}>{t.label}</div>
                        <div style={{
                          fontFamily: "'Newsreader', Georgia, serif",
                          fontSize: '0.82rem', color: 'var(--sub)',
                        }}>{t.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>

              <button
                onClick={savePrefs}
                disabled={saving || !selectedTopic}
                style={{
                  width: '100%', padding: '0.65rem',
                  background: saving || !selectedTopic ? 'var(--border2)' : 'var(--border)',
                  color: 'var(--s2)',
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.66rem', fontWeight: 500,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  border: 'none', borderRadius: 2, cursor: saving ? 'wait' : 'pointer',
                  transition: 'background 0.15s',
                }}
              >
                {saving ? 'Salvando…' : 'Salvar preferências'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const ddItemStyle: React.CSSProperties = {
  width: '100%',
  display: 'flex', alignItems: 'center', gap: 8,
  padding: '0.55rem 0.9rem',
  fontFamily: "'DM Mono', monospace",
  fontSize: '0.62rem', letterSpacing: '0.06em', textTransform: 'uppercase',
  color: 'var(--sub)',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px solid var(--border3)',
  cursor: 'pointer', textAlign: 'left',
  transition: 'background 0.1s',
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
