'use client'

import { useState } from 'react'
import type { Source } from '@/types'

type FilterType = 'all' | 'newsletter' | 'linkedin' | 'web'

const TYPE_LABEL: Record<string, string> = {
  newsletter: 'newsletter',
  linkedin: 'linkedin',
  web: 'web',
}

const DOT_COLOR: Record<string, string> = {
  newsletter: 'var(--purple)',
  linkedin: '#1d9e75',
  web: '#378add',
}

const BADGE_STYLE: Record<string, { background: string; color: string }> = {
  newsletter: { background: 'rgba(109,40,217,0.12)', color: 'var(--plum)' },
  linkedin:   { background: 'rgba(29,158,117,0.1)',  color: '#1d9e75'     },
  web:        { background: 'rgba(55,138,221,0.1)',   color: '#378add'     },
}

const ICON_BG: Record<string, string> = {
  newsletter: 'rgba(109,40,217,0.10)',
  linkedin:   'rgba(29,158,117,0.10)',
  web:        'rgba(55,138,221,0.10)',
}

function MailIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="var(--plum)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="16" height="13" rx="2"/>
      <path d="M2 7l8 5 8-5"/>
    </svg>
  )
}

function LinkedInIcon({ color }: { color: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill={color} aria-hidden="true">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
      <circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

function WebIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="#378add" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="8"/>
      <path d="M2 10h16M10 2a13 13 0 010 16M10 2a13 13 0 000 16"/>
    </svg>
  )
}

function BroadcastIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" stroke="var(--plum)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="10" cy="10" r="2"/>
      <path d="M5.5 5.5a6.5 6.5 0 000 9M14.5 5.5a6.5 6.5 0 010 9"/>
      <path d="M3 3a10 10 0 000 14M17 3a10 10 0 010 14"/>
    </svg>
  )
}

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" stroke="var(--muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"
      style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }}>
      <path d="M5 7l5 5 5-5"/>
    </svg>
  )
}

function FreqDots({ count, type }: { count: number; type: string }) {
  const color = DOT_COLOR[type] ?? 'var(--purple)'
  return (
    <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{
          width: 5, height: 5, borderRadius: '50%',
          background: i < count ? color : 'var(--border)',
        }} />
      ))}
    </div>
  )
}

function SourceIcon({ type }: { type: string }) {
  if (type === 'linkedin') return <LinkedInIcon color="#1d9e75" />
  if (type === 'web') return <WebIcon />
  return <MailIcon />
}

function SourceCard({ source }: { source: Source }) {
  const badge = BADGE_STYLE[source.type] ?? BADGE_STYLE.newsletter
  const iconBg = ICON_BG[source.type] ?? ICON_BG.newsletter

  const lastLabel = source.last_featured_edition
    ? `ed. ${source.last_featured_edition}`
    : '—'

  return (
    <div style={{
      padding: '1rem 1.1rem',
      display: 'flex', flexDirection: 'column', gap: 8,
      borderRight: '0.5px solid var(--border)',
      borderBottom: '0.5px solid var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: iconBg,
          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
        }}>
          <SourceIcon type={source.type} />
        </div>
        <span style={{
          fontSize: 10, padding: '2px 7px', borderRadius: 10, fontWeight: 500,
          fontFamily: "'DM Mono', monospace", letterSpacing: '0.04em',
          ...badge,
        }}>
          {TYPE_LABEL[source.type]}
        </span>
      </div>

      <div>
        <div style={{ fontSize: '0.8rem', fontWeight: 500, color: 'var(--text)', lineHeight: 1.3 }}>
          {source.name}
        </div>
        <div style={{ fontSize: '0.68rem', color: 'var(--muted)', marginTop: 2 }}>
          {source.category}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
          última: <span style={{ color: 'var(--sub)' }}>{lastLabel}</span>
        </span>
        <FreqDots count={source.frequency} type={source.type} />
      </div>
    </div>
  )
}

function SlotCard() {
  return (
    <div style={{
      padding: '1rem 1.1rem',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 6, minHeight: 110,
      borderRight: '0.5px solid var(--border)',
      borderBottom: '0.5px solid var(--border)',
      border: '0.5px dashed var(--border2)',
    }}>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="var(--muted)" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true">
        <path d="M10 4v12M4 10h12"/>
      </svg>
      <span style={{ fontSize: '0.65rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
        slot disponível
      </span>
    </div>
  )
}

export default function SourcesPanel({ sources }: { sources: Source[] }) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<FilterType>('all')

  const active = sources.filter(s => s.active)
  const filtered = filter === 'all' ? active : active.filter(s => s.type === filter)

  const newsletters = filtered.filter(s => s.type === 'newsletter')
  const linkedins   = filtered.filter(s => s.type === 'linkedin')
  const webs        = filtered.filter(s => s.type === 'web')

  const showLinkedInSlot = (filter === 'all' || filter === 'linkedin') && linkedins.length < 4

  const countByType = {
    newsletter: active.filter(s => s.type === 'newsletter').length,
    linkedin:   active.filter(s => s.type === 'linkedin').length,
    web:        active.filter(s => s.type === 'web').length,
  }

  return (
    <div style={{ marginTop: '2.5rem' }}>
      {/* Trigger */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.875rem 1.25rem',
          background: 'var(--s1)', border: '0.5px solid var(--border)', borderRadius: open ? '10px 10px 0 0' : 10,
          cursor: 'pointer', textAlign: 'left',
          transition: 'background 0.12s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = 'var(--s2)' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'var(--s1)' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <BroadcastIcon />
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, color: 'var(--muted)',
            textTransform: 'uppercase', letterSpacing: '0.1em',
            fontFamily: "'DM Mono', monospace",
          }}>
            fontes monitoradas
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: '0.65rem', fontWeight: 700, color: 'var(--plum)',
            fontFamily: "'DM Mono', monospace", letterSpacing: '0.06em',
          }}>
            {active.length} ativas
          </span>
          <ChevronIcon open={open} />
        </div>
      </button>

      {/* Panel */}
      {open && (
        <div style={{
          background: 'var(--s1)',
          border: '0.5px solid var(--border)', borderTop: 'none',
          borderRadius: '0 0 10px 10px', overflow: 'hidden',
        }}>
          {/* Header */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '0.875rem 1.25rem', borderBottom: '0.5px solid var(--border)',
          }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 500, color: 'var(--text)', fontFamily: "'DM Mono', monospace" }}>
              fontes do digest
            </span>
            <span style={{ fontSize: '0.62rem', color: 'var(--muted)', fontFamily: "'DM Mono', monospace" }}>
              {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
            </span>
          </div>

          {/* Filters */}
          <div style={{ display: 'flex', gap: 6, padding: '0.75rem 1.25rem', borderBottom: '0.5px solid var(--border)', flexWrap: 'wrap' }}>
            {(['all', 'newsletter', 'linkedin', 'web'] as FilterType[]).map(f => {
              const label = f === 'all'
                ? `todas · ${active.length}`
                : `${f} · ${countByType[f as keyof typeof countByType]}`
              const isActive = filter === f
              return (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    padding: '4px 10px', borderRadius: 20,
                    fontSize: 11, fontWeight: 500, cursor: 'pointer',
                    fontFamily: "'DM Mono', monospace", letterSpacing: '0.04em',
                    background: isActive ? 'rgba(139,92,246,0.16)' : 'var(--s2)',
                    color: isActive ? 'var(--plum)' : 'var(--sub)',
                    border: isActive ? '0.5px solid rgba(139,92,246,0.35)' : '0.5px solid var(--border)',
                    transition: 'all 0.12s',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>

          {/* Grid — newsletters */}
          {newsletters.length > 0 && (
            <>
              <div style={{
                fontSize: '0.6rem', fontWeight: 700, color: 'var(--muted)',
                padding: '0.5rem 1.25rem 0.3rem',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                fontFamily: "'DM Mono', monospace",
                borderTop: '0.5px solid var(--border)',
              }}>
                newsletters
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))' }}>
                {newsletters.map(s => <SourceCard key={s.id} source={s} />)}
              </div>
            </>
          )}

          {/* Grid — linkedin */}
          {(linkedins.length > 0 || showLinkedInSlot) && (
            <>
              <div style={{
                fontSize: '0.6rem', fontWeight: 700, color: 'var(--muted)',
                padding: '0.5rem 1.25rem 0.3rem',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                fontFamily: "'DM Mono', monospace",
                borderTop: '0.5px solid var(--border)',
              }}>
                linkedin
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))' }}>
                {linkedins.map(s => <SourceCard key={s.id} source={s} />)}
                {showLinkedInSlot && <SlotCard />}
              </div>
            </>
          )}

          {/* Grid — web */}
          {webs.length > 0 && (
            <>
              <div style={{
                fontSize: '0.6rem', fontWeight: 700, color: 'var(--muted)',
                padding: '0.5rem 1.25rem 0.3rem',
                textTransform: 'uppercase', letterSpacing: '0.1em',
                fontFamily: "'DM Mono', monospace",
                borderTop: '0.5px solid var(--border)',
              }}>
                web
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(175px, 1fr))' }}>
                {webs.map(s => <SourceCard key={s.id} source={s} />)}
              </div>
            </>
          )}

          {filtered.length === 0 && !showLinkedInSlot && (
            <div style={{ padding: '2rem', textAlign: 'center', fontSize: '0.78rem', color: 'var(--muted)' }}>
              Nenhuma fonte nesta categoria.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
