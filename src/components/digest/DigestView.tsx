'use client'

import { useState } from 'react'
import type { Digest, DigestCard } from '@/types'
import DigestCardComponent from './DigestCard'
import NavBar from '@/components/ui/NavBar'

type Props = {
  user: { id: string; name: string }
  digest: (Digest & { cards: DigestCard[] }) | null
}

export default function DigestView({ user, digest }: Props) {
  const [cards, setCards] = useState<DigestCard[]>(digest?.cards ?? [])

  function handleScoreUpdate(cardId: string, score: number) {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, user_score: score } : c))
  }

  function handleSaveToggle(cardId: string, saved: boolean) {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, is_saved: saved } : c))
  }

  const insights  = cards.filter(c => !c.signal)
  const signals   = cards.filter(c => c.signal)
  const savedList = cards.filter(c => c.is_saved)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <NavBar userName={user.name} />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '210px 1fr 195px',
        flex: 1,
        minHeight: 'calc(100vh - 50px)',
      }} className="digest-grid">

        {/* Sidebar esquerda — salvos */}
        <aside style={{
          background: 'var(--s1)', borderRight: '1px solid var(--border)',
          padding: '1.1rem 0.85rem',
        }}>
          <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.7rem' }}>
            Salvos esta semana
          </div>

          {savedList.length === 0 ? (
            <div style={{ fontSize: '0.75rem', color: 'var(--muted)', textAlign: 'center', lineHeight: 1.5, padding: '1rem 0' }}>
              Itens salvos<br />aparecerão aqui
            </div>
          ) : (
            savedList.map(c => (
              <div key={c.id} style={{ padding: '0.5rem 0.6rem', borderRadius: 7, marginBottom: '0.3rem', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'var(--s2)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <div style={{ fontSize: '0.77rem', fontWeight: 500, lineHeight: 1.35, marginBottom: 2 }}>{c.title}</div>
                <div style={{ fontSize: '0.66rem', color: 'var(--muted)' }}>{c.source}</div>
              </div>
            ))
          )}

          {savedList.length > 0 && (
            <div style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 8, padding: '0.65rem', marginTop: '0.9rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.35rem', fontWeight: 700 }}>{savedList.length}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted)', marginTop: 1 }}>itens salvos</div>
            </div>
          )}
        </aside>

        {/* Feed principal */}
        <main style={{ padding: '1.1rem' }}>
          {!digest ? (
            <EmptyDigest />
          ) : (
            <>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                  {new Date(digest.published_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </div>
                <div style={{ fontSize: '0.7rem', color: 'var(--muted)' }}>
                  Edição #{digest.edition} · {cards.length} insights
                </div>
              </div>

              {insights.length > 0 && (
                <>
                  <SectionLabel>Insights de mercado</SectionLabel>
                  {insights.map(c => (
                    <DigestCardComponent key={c.id} card={c} userId={user.id}
                      onScoreUpdate={handleScoreUpdate} onSaveToggle={handleSaveToggle} />
                  ))}
                </>
              )}

              {signals.length > 0 && (
                <>
                  <SectionLabel>Sinais antecipados</SectionLabel>
                  {signals.map(c => (
                    <DigestCardComponent key={c.id} card={c} userId={user.id}
                      onScoreUpdate={handleScoreUpdate} onSaveToggle={handleSaveToggle} />
                  ))}
                </>
              )}
            </>
          )}
        </main>

        {/* Sidebar direita — stats */}
        <aside style={{ borderLeft: '1px solid var(--border)', padding: '1.1rem 0.85rem' }}>
          {digest && cards.length > 0 && (
            <>
              <SourceWidget cards={cards} />
              <ThemeWidget cards={cards} />
            </>
          )}
        </aside>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .digest-grid { grid-template-columns: 1fr !important; }
          .digest-grid aside { display: none; }
        }
      `}</style>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      fontSize: '0.67rem', fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.1em', color: 'var(--muted)',
      margin: '1.1rem 0 0.65rem',
      display: 'flex', alignItems: 'center', gap: 9,
    }}>
      {children}
      <span style={{ flex: 1, height: 1, background: 'var(--border)', display: 'block' }} />
    </div>
  )
}

function EmptyDigest() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 340, textAlign: 'center', padding: '2rem' }}>
      <div style={{ width: 48, height: 48, background: 'var(--s2)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
        <svg width="22" height="22" viewBox="0 0 20 20" fill="none" stroke="var(--muted)" strokeWidth="1.5">
          <path d="M2 17c2-4 5-6 8-6s6 2 8 6M5 13c1.5-2.5 3-3.5 5-3.5s3.5 1 5 3.5M8 10V7M12 10V5" strokeLinecap="round"/>
        </svg>
      </div>
      <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.35rem' }}>Nenhum digest ainda</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.5, maxWidth: 260 }}>
        A primeira edição está sendo preparada. Você receberá um e-mail quando estiver pronta.
      </div>
    </div>
  )
}

function SourceWidget({ cards }: { cards: DigestCard[] }) {
  const counts: Record<string, number> = {}
  cards.forEach(c => { counts[c.source] = (counts[c.source] ?? 0) + (c.claude_score ?? 0) })
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4)
  const max = sorted[0]?.[1] ?? 1

  return (
    <div style={{ background: 'var(--s2)', borderRadius: 8, padding: '0.85rem', marginBottom: '0.85rem' }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.7rem' }}>
        Score por fonte
      </div>
      {sorted.map(([name, score]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <div style={{ fontSize: '0.69rem', color: 'var(--sub)', width: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
          <div style={{ flex: 1, background: 'var(--border)', borderRadius: 3, height: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, background: 'var(--muted)', opacity: 0.8, width: `${Math.round((score / max) * 100)}%` }} />
          </div>
          <div style={{ fontSize: '0.67rem', fontWeight: 600, color: 'var(--sub)', width: 20, textAlign: 'right' }}>{score}</div>
        </div>
      ))}
    </div>
  )
}

function ThemeWidget({ cards }: { cards: DigestCard[] }) {
  const counts: Record<string, number> = {}
  cards.forEach(c => c.tags.forEach(t => { counts[t] = (counts[t] ?? 0) + 1 }))
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 4)
  const max = sorted[0]?.[1] ?? 1

  return (
    <div style={{ background: 'var(--s2)', borderRadius: 8, padding: '0.85rem' }}>
      <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.09em', marginBottom: '0.7rem' }}>
        Temas desta semana
      </div>
      {sorted.map(([name, count]) => (
        <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
          <div style={{ fontSize: '0.69rem', color: 'var(--sub)', width: 70, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{name}</div>
          <div style={{ flex: 1, background: 'var(--border)', borderRadius: 3, height: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, background: 'var(--muted)', opacity: 0.8, width: `${Math.round((count / max) * 100)}%` }} />
          </div>
          <div style={{ fontSize: '0.67rem', fontWeight: 600, color: 'var(--sub)', width: 20, textAlign: 'right' }}>{count}</div>
        </div>
      ))}
    </div>
  )
}
