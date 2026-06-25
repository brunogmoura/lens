'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const TOPICS = [
  {
    key: 'negocios',
    label: 'Negócios & Estratégia',
    description: 'Movimentos de mercado, modelos de receita, M&A, competição e tendências macro que impactam decisões estratégicas.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 3v18h18"/><path d="M7 16l4-4 4 4 4-4"/>
      </svg>
    ),
  },
  {
    key: 'tecnologia',
    label: 'Tecnologia & Produto',
    description: 'IA, plataformas digitais, produto, engenharia e o que está mudando a forma de construir e distribuir software.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/>
      </svg>
    ),
  },
  {
    key: 'pessoas',
    label: 'Pessoas & Gestão',
    description: 'Liderança, cultura organizacional, mercado de trabalho e como os melhores times tomam decisões.',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="7" r="4"/><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2"/><path d="M16 3.13a4 4 0 010 7.75"/>
        <path d="M21 21v-2a4 4 0 00-3-3.87"/>
      </svg>
    ),
  },
]

export default function OnboardingPage() {
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleContinue() {
    if (!selected || loading) return
    setLoading(true)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { router.push('/login'); return }

    await supabase.from('profiles').upsert({
      id: user.id,
      full_name: user.user_metadata?.full_name ?? null,
      topic: selected,
    })

    router.push('/app')
  }

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', padding: '2rem 1.25rem',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: '3rem' }}>
        <div style={{ width: 32, height: 32, background: 'var(--purple)', borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2">
            <circle cx="10" cy="10" r="4"/><path d="M10 3v2M10 15v2M3 10h2M15 10h2" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: -0.3 }}>Lens</span>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem', maxWidth: 480 }}>
        <h1 style={{ fontSize: 'clamp(1.4rem, 4vw, 1.85rem)', fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: '0.75rem' }}>
          O que você quer<br />acompanhar?
        </h1>
        <p style={{ fontSize: '0.85rem', color: 'var(--muted)', lineHeight: 1.6 }}>
          Escolha o tema principal do seu digest.<br />Você pode mudar isso a qualquer momento.
        </p>
      </div>

      {/* Topic cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%', maxWidth: 480 }}>
        {TOPICS.map(topic => {
          const isSelected = selected === topic.key
          return (
            <button
              key={topic.key}
              onClick={() => setSelected(topic.key)}
              style={{
                display: 'flex', alignItems: 'flex-start', gap: '1.1rem',
                background: isSelected ? 'var(--s2)' : 'var(--s1)',
                border: `1.5px solid ${isSelected ? 'var(--plum)' : 'var(--border)'}`,
                borderRadius: 14, padding: '1.25rem 1.4rem',
                textAlign: 'left', cursor: 'pointer',
                transition: 'all 0.15s',
                boxShadow: isSelected ? '0 0 0 1px var(--plum-dim)' : 'none',
              }}
              onMouseEnter={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border2)' }}
              onMouseLeave={e => { if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)' }}
            >
              <div style={{ color: isSelected ? 'var(--plum)' : 'var(--muted)', marginTop: 2, flexShrink: 0, transition: 'color 0.15s' }}>
                {topic.icon}
              </div>
              <div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.3rem', color: isSelected ? 'var(--text)' : 'var(--sub)' }}>
                  {topic.label}
                </div>
                <div style={{ fontSize: '0.77rem', color: 'var(--muted)', lineHeight: 1.55 }}>
                  {topic.description}
                </div>
              </div>
              <div style={{
                marginLeft: 'auto', flexShrink: 0, marginTop: 2,
                width: 18, height: 18, borderRadius: '50%',
                border: `1.5px solid ${isSelected ? 'var(--plum)' : 'var(--border2)'}`,
                background: isSelected ? 'var(--plum)' : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s',
              }}>
                {isSelected && (
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1.5 5l2.5 2.5 4.5-4"/>
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>

      {/* CTA */}
      <button
        onClick={handleContinue}
        disabled={!selected || loading}
        style={{
          marginTop: '2rem', width: '100%', maxWidth: 480,
          padding: '0.9rem', borderRadius: 12, border: 'none',
          background: selected ? 'var(--purple)' : 'var(--s2)',
          color: selected ? 'white' : 'var(--muted)',
          fontSize: '0.88rem', fontWeight: 600,
          cursor: selected ? 'pointer' : 'default',
          transition: 'all 0.15s',
          opacity: loading ? 0.7 : 1,
        }}
      >
        {loading ? 'Entrando…' : 'Entrar no Lens'}
      </button>
    </div>
  )
}
