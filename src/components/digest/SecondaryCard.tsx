'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DigestCard, CardSource } from '@/types'

const HORIZON_COLOR: Record<string, { bg: string; label: string }> = {
  'curto prazo':  { bg: '#5a8a3a', label: 'Curto prazo' },
  'médio prazo':  { bg: '#c4872a', label: 'Médio prazo' },
  'longo prazo':  { bg: '#b4b2a9', label: 'Longo prazo' },
}

function HorizonDot({ horizon }: { horizon: string }) {
  const match = HORIZON_COLOR[horizon.toLowerCase()] ?? { bg: 'var(--border2)', label: horizon }
  return (
    <span
      title={match.label}
      style={{
        width: 7, height: 7,
        borderRadius: '50%',
        background: match.bg,
        flexShrink: 0,
        display: 'inline-block',
      }}
    />
  )
}

type Props = {
  card: DigestCard
  userId: string
  index?: number
  onScoreUpdate: (cardId: string, score: number) => void
  onSaveToggle: (cardId: string, saved: boolean) => void
}

export default function SecondaryCard({ card, userId, index, onScoreUpdate, onSaveToggle }: Props) {
  const [saving, setSaving] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const supabase = createClient()

  async function handleScore(score: number) {
    onScoreUpdate(card.id, score)
    await supabase.from('user_scores').upsert({ user_id: userId, card_id: card.id, score })
  }

  async function handleSave(e: React.MouseEvent) {
    e.stopPropagation()
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
    <article
      onClick={() => setExpanded(p => !p)}
      style={{
        padding: '1.95rem 0',
        borderBottom: '1px solid var(--border3)',
        cursor: 'pointer',
      }}
    >
      {/* Header com número + meta */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1.25rem', marginBottom: '0.75rem' }}>
        {index !== undefined && (
          <span style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: '1.2rem', color: 'var(--border2)',
            width: 24, flexShrink: 0, lineHeight: 1.4,
            userSelect: 'none',
          }}>{index}</span>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, flexWrap: 'wrap' }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.62rem', letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--muted)',
          }}>{card.source}</span>
          {card.signal && (
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.58rem', fontWeight: 500,
              letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--text)', background: 'var(--lima)',
              borderRadius: 2, padding: '1px 6px',
            }}>Sinal</span>
          )}
          {card.horizon && (
            <HorizonDot horizon={card.horizon} />
          )}
          <button
            onClick={handleSave}
            title={card.is_saved ? 'Remover' : 'Salvar'}
            style={{
              marginLeft: 'auto', flexShrink: 0,
              background: 'none', border: 'none', padding: 2, cursor: 'pointer',
              color: card.is_saved ? 'var(--text)' : 'var(--muted)',
            }}
            onMouseEnter={e => { if (!card.is_saved) e.currentTarget.style.color = 'var(--sub)' }}
            onMouseLeave={e => { if (!card.is_saved) e.currentTarget.style.color = 'var(--muted)' }}
          >
            <svg width="13" height="13" viewBox="0 0 20 20" fill={card.is_saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 3h10a1 1 0 011 1v13l-6-3.5L4 17V4a1 1 0 011-1z"/>
            </svg>
          </button>
        </div>
      </div>

      {/* Corpo */}
      <div style={{ paddingLeft: index !== undefined ? 'calc(24px + 1.25rem)' : 0 }}>
        <h3 style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: '1.05rem', fontWeight: 500,
          lineHeight: 1.4, letterSpacing: '-0.01em',
          marginBottom: '0.45rem', color: 'var(--text)',
        }}>{card.title}</h3>

        <p style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontSize: '0.9rem', color: 'var(--sub)', lineHeight: 1.65,
        }}>
          {expanded ? card.summary : card.summary.slice(0, 180) + (card.summary.length > 180 ? '…' : '')}
        </p>

        {expanded && (
          <div style={{ marginTop: '1.1rem' }} onClick={e => e.stopPropagation()}>
            {card.latent && (
              <div style={{
                borderLeft: '2px solid var(--border)',
                padding: '0.8rem 1.1rem',
                marginBottom: '1rem',
                background: 'var(--s1)',
              }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.58rem', fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--muted)', marginBottom: '0.4rem',
                }}>Conexão latente</div>
                <p style={{
                  fontFamily: "'Newsreader', Georgia, serif",
                  fontSize: '0.88rem', fontStyle: 'italic',
                  color: 'var(--sub)', lineHeight: 1.6,
                }}>{card.latent}</p>
              </div>
            )}

            {card.sources?.length > 0 && (
              <div style={{ marginBottom: '0.9rem' }}>
                <div style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.58rem', fontWeight: 500,
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'var(--muted)', marginBottom: '0.45rem',
                }}>Fontes</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                  {card.sources.map((s, i) => (
                    <a key={i} href={s.url} target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        background: 'var(--s2)', border: '1px solid var(--border2)',
                        borderRadius: 2, padding: '3px 8px',
                        fontFamily: "'DM Mono', monospace",
                        fontSize: '0.62rem', color: 'var(--sub)',
                        textDecoration: 'none',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--lima)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'var(--s2)'; e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--sub)' }}
                    >
                      {s.name}
                      <svg width="9" height="9" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 10L10 2M5 2h5v5"/>
                      </svg>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '0.62rem', letterSpacing: '0.06em', color: 'var(--muted)',
              }}>Relevância</span>
              {card.user_score ? (
                <span style={{
                  fontFamily: "'DM Mono', monospace",
                  fontSize: '0.72rem', fontWeight: 500,
                  background: 'var(--lima)', border: '1px solid var(--border)',
                  borderRadius: 2, padding: '2px 8px', color: 'var(--text)',
                }}>{card.user_score}</span>
              ) : (
                <div style={{ display: 'flex', gap: 3 }}>
                  {[1,2,3,4,5].map(n => (
                    <button key={n} onClick={e => { e.stopPropagation(); handleScore(n) }} style={{
                      width: 24, height: 24, borderRadius: 2,
                      background: 'var(--s1)', border: '1px solid var(--border2)',
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '0.67rem', fontWeight: 500, color: 'var(--muted)', cursor: 'pointer',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--lima)'; e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--s1)'; e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)' }}>
                      {n}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
