'use client'

import { useState } from 'react'
import type { Digest, DigestCard, Source } from '@/types'
import HeroCard from './HeroCard'
import SecondaryCard from './SecondaryCard'
import SourcesPanel from './SourcesPanel'
import NavBar from '@/components/ui/NavBar'
import HistoricoView from '@/components/history/HistoricoView'

type HistoryDigest = Digest & { cards: DigestCard[] }

type Props = {
  user: { id: string; name: string }
  digest: HistoryDigest | null
  allDigests: HistoryDigest[]
  lastSeenAt: string | null
  sources: Source[]
}

type Tab = 'digest' | 'saved' | 'history'

export default function DigestView({ user, digest, allDigests, lastSeenAt, sources }: Props) {
  const [cards, setCards] = useState<DigestCard[]>(digest?.cards ?? [])
  const [tab, setTab] = useState<Tab>('digest')

  function handleScoreUpdate(cardId: string, score: number) {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, user_score: score } : c))
  }

  function handleSaveToggle(cardId: string, saved: boolean) {
    setCards(prev => prev.map(c => c.id === cardId ? { ...c, is_saved: saved } : c))
  }

  const sorted = [...cards].sort((a, b) => (b.claude_score ?? 0) - (a.claude_score ?? 0))
  const hero = sorted[0] ?? null
  const secondary = cards
    .filter(c => c.id !== hero?.id)
    .sort((a, b) => a.position - b.position)

  const saved = cards.filter(c => c.is_saved)

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <NavBar userName={user.name} tab={tab} onTabChange={setTab} savedCount={saved.length} />

      <main style={{ flex: 1, maxWidth: 780, width: '100%', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
        {tab === 'digest' && (
          !digest ? <EmptyDigest /> : (
            <>
              <div style={{ marginBottom: '2.5rem' }}>
                <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                  Edição #{digest.edition} · {new Date(digest.published_at + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>

              {hero && (
                <HeroCard card={hero} userId={user.id} onScoreUpdate={handleScoreUpdate} onSaveToggle={handleSaveToggle} />
              )}

              {secondary.length > 0 && (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '2.5rem 0 1.25rem' }}>
                    <span style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em', whiteSpace: 'nowrap' }}>
                      Mais desta edição
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {secondary.map((c, i) => (
                      <SecondaryCard key={c.id} card={c} userId={user.id} index={i + 1} onScoreUpdate={handleScoreUpdate} onSaveToggle={handleSaveToggle} />
                    ))}
                  </div>
                </>
              )}

              <SourcesPanel sources={sources} />
            </>
          )
        )}

        {tab === 'saved' && (
          <SavedView cards={saved} userId={user.id} onScoreUpdate={handleScoreUpdate} onSaveToggle={handleSaveToggle} />
        )}

        {tab === 'history' && (
          <HistoricoView digests={allDigests} currentDigestId={digest?.id ?? null} lastSeenAt={lastSeenAt} />
        )}
      </main>
    </div>
  )
}

function SavedView({ cards, userId, onScoreUpdate, onSaveToggle }: {
  cards: DigestCard[]
  userId: string
  onScoreUpdate: (id: string, score: number) => void
  onSaveToggle: (id: string, saved: boolean) => void
}) {
  if (cards.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 340, textAlign: 'center' }}>
        <div style={{ width: 44, height: 44, background: 'var(--s2)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="var(--muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3h10a1 1 0 011 1v13l-6-3.5L4 17V4a1 1 0 011-1z"/>
          </svg>
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.3rem' }}>Nenhum item salvo</div>
        <div style={{ fontSize: '0.78rem', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 240 }}>
          Salve os insights que quiser revisitar e eles aparecerão aqui.
        </div>
      </div>
    )
  }

  return (
    <>
      <div style={{ marginBottom: '1.75rem' }}>
        <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          {cards.length} {cards.length === 1 ? 'item salvo' : 'itens salvos'}
        </span>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {cards.map(c => (
          <SecondaryCard key={c.id} card={c} userId={userId} onScoreUpdate={onScoreUpdate} onSaveToggle={onSaveToggle} />
        ))}
      </div>
    </>
  )
}

function EmptyDigest() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 400, textAlign: 'center' }}>
      <div style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.4rem' }}>Próxima edição a caminho</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--muted)', lineHeight: 1.6, maxWidth: 280 }}>
        Você receberá um aviso quando a nova edição estiver pronta.
      </div>
    </div>
  )
}
