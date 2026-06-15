'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DigestCard as CardType } from '@/types'

type Props = {
  card: CardType
  userId: string
  onScoreUpdate: (cardId: string, score: number) => void
  onSaveToggle:  (cardId: string, saved: boolean) => void
}

export default function DigestCard({ card, userId, onScoreUpdate, onSaveToggle }: Props) {
  const [saving, setSaving]  = useState(false)
  const supabase = createClient()

  async function handleScore(score: number) {
    onScoreUpdate(card.id, score)
    await supabase.from('user_scores').upsert({ user_id: userId, card_id: card.id, score })
  }

  async function handleSave() {
    if (saving) return
    setSaving(true)
    const nowSaved = !card.is_saved
    onSaveToggle(card.id, nowSaved)
    if (nowSaved) {
      await supabase.from('user_saved').insert({ user_id: userId, card_id: card.id })
    } else {
      await supabase.from('user_saved').delete().eq('user_id', userId).eq('card_id', card.id)
    }
    setSaving(false)
  }

  return (
    <div style={{
      background: 'var(--s1)', border: `1px solid ${card.signal ? 'var(--border2)' : 'var(--border)'}`,
      borderLeft: card.signal ? '2px solid var(--border2)' : undefined,
      borderRadius: 10, padding: '0.95rem 1.05rem', marginBottom: '0.55rem',
      transition: 'border-color 0.12s',
    }}
    onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
    onMouseLeave={e => (e.currentTarget.style.borderColor = card.signal ? 'var(--border2)' : 'var(--border)')}>

      <div style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 4 }}>
        {card.source}
      </div>
      <div style={{ fontSize: '0.87rem', fontWeight: 600, lineHeight: 1.45, marginBottom: '0.4rem' }}>
        {card.title}
      </div>
      <div style={{ fontSize: '0.79rem', color: 'var(--sub)', lineHeight: 1.58, marginBottom: '0.65rem' }}>
        {card.summary}
      </div>

      {card.latent && (
        <div style={{ background: 'var(--s2)', border: '1px solid var(--border2)', borderRadius: 7, padding: '0.45rem 0.7rem', marginBottom: '0.65rem' }}>
          <div style={{ fontSize: '0.62rem', fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 3 }}>
            Conexão latente
          </div>
          <div style={{ fontSize: '0.76rem', color: 'var(--sub)', lineHeight: 1.45 }}>{card.latent}</div>
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
        {card.tags.map(t => (
          <span key={t} style={{ background: 'var(--s2)', border: '1px solid var(--border)', borderRadius: 20, padding: '2px 8px', fontSize: '0.66rem', color: 'var(--muted)' }}>
            {t}
          </span>
        ))}
        {card.horizon && (
          <span style={{ fontSize: '0.65rem', padding: '2px 8px', borderRadius: 20, fontWeight: 600, background: 'var(--s2)', border: '1px solid var(--border2)', color: 'var(--sub)' }}>
            {card.horizon}
          </span>
        )}

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 7 }}>
          {/* Score Claude */}
          {card.claude_score && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.69rem' }}>
              <span style={{ color: 'var(--muted)' }}>Claude</span>
              <span style={{ fontWeight: 700 }}>{card.claude_score}</span>
            </div>
          )}

          {/* Score picker usuário */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: '0.69rem' }}>
            <span style={{ color: 'var(--muted)', marginRight: 4 }}>Você</span>
            {card.user_score ? (
              <span style={{ fontWeight: 700 }}>{card.user_score}</span>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => handleScore(n)} style={{
                    width: 22, height: 22, borderRadius: 5,
                    background: 'var(--s2)', border: '1px solid var(--border2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)',
                    cursor: 'pointer', transition: 'all 0.1s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--plum)'; e.currentTarget.style.color = 'var(--plum)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)'; }}>
                    {n}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botão salvar */}
          <button onClick={handleSave} style={{
            background: card.is_saved ? 'var(--s2)' : 'none',
            border: '1px solid var(--border2)', borderRadius: 5,
            color: card.is_saved ? 'var(--sub)' : 'var(--muted)',
            padding: '3px 9px', fontSize: '0.69rem', cursor: 'pointer',
            transition: 'all 0.12s',
          }}>
            {card.is_saved ? '✓ Salvo' : 'Salvar'}
          </button>
        </div>
      </div>
    </div>
  )
}
