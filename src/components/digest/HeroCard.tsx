'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { DigestCard, CardSource } from '@/types'

type Props = {
  card: DigestCard
  userId: string
  onScoreUpdate: (cardId: string, score: number) => void
  onSaveToggle: (cardId: string, saved: boolean) => void
}

export default function HeroCard({ card, userId, onScoreUpdate, onSaveToggle }: Props) {
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const [showHint, setShowHint] = useState(false)

  async function handleScore(score: number) {
    onScoreUpdate(card.id, score)
    setShowHint(true)
    await supabase.from('user_scores').upsert({ user_id: userId, card_id: card.id, score })
  }

  function spawnParticles(e: React.MouseEvent<HTMLButtonElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2 - Math.PI / 2
      const v = 28 + Math.random() * 36
      const el = document.createElement('div')
      el.style.cssText = `position:fixed;left:${cx}px;top:${cy}px;width:5px;height:5px;border-radius:50%;background:#1a1915;pointer-events:none;z-index:9999;--tx:${Math.cos(angle) * v}px;--ty:${Math.sin(angle) * v}px;animation:lensParticle 0.7s ease-out forwards`
      document.body.appendChild(el)
      setTimeout(() => el.remove(), 750)
    }
  }

  async function handleMark(e: React.MouseEvent<HTMLButtonElement>) {
    const newScore = card.user_score ? 0 : 5
    if (newScore > 0) spawnParticles(e)
    onScoreUpdate(card.id, newScore)
    setShowHint(newScore > 0)
    await supabase.from('user_scores').upsert({ user_id: userId, card_id: card.id, score: newScore })
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
    <article style={{
      marginBottom: '3.5rem',
      paddingBottom: '3rem',
      borderBottom: '1px solid var(--border2)',
      animation: 'lensRise 0.6s ease both 0.05s',
    }}>
      {/* Meta */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: '1.25rem' }}>
        <span style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.66rem', fontWeight: 500,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          color: 'var(--muted)',
        }}>{card.source}</span>
        {card.signal && (
          <span style={{ position: 'relative', display: 'inline-flex' }}
            onMouseEnter={e => { const t = e.currentTarget.querySelector<HTMLElement>('.sinal-tip'); if (t) t.style.opacity = '1' }}
            onMouseLeave={e => { const t = e.currentTarget.querySelector<HTMLElement>('.sinal-tip'); if (t) t.style.opacity = '0' }}
          >
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.6rem', fontWeight: 500,
              letterSpacing: '0.08em', textTransform: 'uppercase',
              color: 'var(--text)',
              background: 'var(--lima)',
              borderRadius: 2, padding: '2px 7px',
              cursor: 'default',
            }}>Sinal</span>
            <span className="sinal-tip" style={{
              position: 'absolute',
              bottom: 'calc(100% + 7px)',
              left: '50%',
              transform: 'translateX(-50%)',
              background: 'var(--border)',
              color: 'white',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.58rem',
              letterSpacing: '0.04em',
              lineHeight: 1.5,
              padding: '6px 10px',
              borderRadius: 2,
              whiteSpace: 'nowrap',
              pointerEvents: 'none',
              opacity: 0,
              transition: 'opacity 0.15s',
              zIndex: 50,
            }}>
              Algo está se movendo aqui — vale atenção antes da próxima conversa com cliente
              <span style={{
                position: 'absolute', top: '100%', left: '50%',
                transform: 'translateX(-50%)',
                borderWidth: 5, borderStyle: 'solid',
                borderColor: 'var(--border) transparent transparent transparent',
              }} />
            </span>
          </span>
        )}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
          {card.tags.slice(0, 2).map(t => (
            <span key={t} style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.6rem', letterSpacing: '0.06em', textTransform: 'uppercase',
              color: 'var(--muted)',
              border: '1px solid var(--border2)',
              borderRadius: 2, padding: '2px 7px',
            }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Título */}
      <h1 style={{
        fontFamily: "'Newsreader', Georgia, serif",
        fontSize: 'clamp(2rem, 4vw, 2.8rem)',
        fontWeight: 500, lineHeight: 1.2,
        letterSpacing: '-0.02em',
        marginBottom: '1.5rem',
        color: 'var(--text)',
      }}>{card.title}</h1>

      <div style={{ width: '100%', height: 1, background: 'var(--border2)', marginBottom: '1.5rem' }} />

      {/* Summary */}
      <p style={{
        fontFamily: "'Newsreader', Georgia, serif",
        fontSize: '1.1rem', color: 'var(--sub)',
        lineHeight: 1.75,
        marginBottom: card.latent ? '2rem' : '2.5rem',
      }}>{card.summary}</p>

      {/* Conexão latente */}
      {card.latent && (
        <div style={{
          borderLeft: '2px solid var(--border)',
          padding: '1rem 1.4rem',
          marginBottom: '2rem',
          background: 'var(--s1)',
        }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.6rem', fontWeight: 500,
            letterSpacing: '0.12em', textTransform: 'uppercase',
            color: 'var(--muted)', marginBottom: '0.6rem',
          }}>Conexão latente</div>
          <p style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: '0.95rem', fontStyle: 'italic',
            color: 'var(--sub)', lineHeight: 1.65,
          }}>{card.latent}</p>
        </div>
      )}

      {/* Fontes */}
      {card.sources?.length > 0 && <SourceLinks sources={card.sources} />}

      {/* Footer */}
      <style>{`@keyframes lensParticle{0%{opacity:.85;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--tx),var(--ty)) scale(0)}}@keyframes lensStamp{0%{transform:scaleY(0)}65%{transform:scaleY(1.06)}100%{transform:scaleY(1)}}`}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.66rem', letterSpacing: '0.06em',
            color: 'var(--muted)',
          }}>Relevância</span>
          <button
            onClick={handleMark}
            style={{
              position: 'relative', overflow: 'hidden',
              padding: '6px 14px',
              border: `1px solid ${card.user_score ? 'var(--border)' : 'var(--border2)'}`,
              borderRadius: 2,
              background: 'var(--s1)',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.62rem', letterSpacing: '0.07em', textTransform: 'uppercase',
              color: card.user_score ? 'var(--text)' : 'var(--sub)',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 7,
            }}
          >
            <span style={{
              position: 'absolute', inset: 0,
              background: 'var(--lima)',
              transform: card.user_score ? 'scaleY(1)' : 'scaleY(0)',
              transformOrigin: 'bottom',
              animation: card.user_score ? 'lensStamp 0.32s cubic-bezier(0.22,1,0.36,1)' : 'none',
              zIndex: 0,
            }} />
            <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 7 }}>
              <span style={{
                width: 13, height: 13,
                border: '1.5px solid currentColor', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
              }}>
                {card.user_score ? (
                  <svg width="6" height="6" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1.5 4l2 2 3-3"/>
                  </svg>
                ) : null}
              </span>
              {card.user_score ? 'Valioso' : 'Marcar como valioso'}
            </span>
          </button>
          {showHint && (
            <span style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.58rem', letterSpacing: '0.04em',
              color: 'var(--muted)', fontStyle: 'italic',
              animation: 'lensFade 0.3s ease both 0.15s',
            }}>Seu feedback molda as próximas edições</span>
          )}
        </div>

        <button onClick={handleSave} style={{
          marginLeft: 'auto', flexShrink: 0,
          display: 'flex', alignItems: 'center', gap: 6,
          background: card.is_saved ? 'var(--lima)' : 'var(--s2)',
          border: `1px solid ${card.is_saved ? 'var(--border)' : 'var(--border2)'}`,
          borderRadius: 2, padding: '6px 14px',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.66rem', fontWeight: 500,
          letterSpacing: '0.06em', textTransform: 'uppercase',
          color: card.is_saved ? 'var(--text)' : 'var(--muted)',
          cursor: 'pointer',
        }}
        onMouseEnter={e => { if (!card.is_saved) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}}
        onMouseLeave={e => { if (!card.is_saved) { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--muted)' }}}>
          <svg width="13" height="13" viewBox="0 0 20 20" fill={card.is_saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 3h10a1 1 0 011 1v13l-6-3.5L4 17V4a1 1 0 011-1z"/>
          </svg>
          {card.is_saved ? 'Salvo' : 'Salvar'}
        </button>
      </div>
    </article>
  )
}

function SourceLinks({ sources }: { sources: CardSource[] }) {
  return (
    <div style={{ marginBottom: '2rem' }}>
      <div style={{
        fontFamily: "'DM Mono', monospace",
        fontSize: '0.6rem', fontWeight: 500,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: '0.6rem',
      }}>Fontes</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {sources.map((s, i) => (
          <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            background: 'var(--s2)', border: '1px solid var(--border)',
            borderRadius: 2, padding: '4px 10px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.66rem', color: 'var(--sub)',
            textDecoration: 'none',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'var(--lima)'; e.currentTarget.style.color = 'var(--text)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'var(--s2)'; e.currentTarget.style.color = 'var(--sub)' }}>
            {s.name}
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 10L10 2M5 2h5v5"/>
            </svg>
          </a>
        ))}
      </div>
    </div>
  )
}
