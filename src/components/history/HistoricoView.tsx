import type { Digest, DigestCard } from '@/types'

type HistoryDigest = Digest & { cards: DigestCard[] }

type Props = {
  digests: HistoryDigest[]
  currentDigestId: string | null
  lastSeenAt: string | null
}

function formatDate(iso: string) {
  const d = new Date(iso + (iso.includes('T') ? '' : 'T12:00:00'))
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).toUpperCase().replace('.', '')
}

function dayLabel(iso: string): string {
  const d = new Date(iso + (iso.includes('T') ? '' : 'T12:00:00'))
  const today = new Date()
  const diff = Math.floor((today.setHours(0,0,0,0) - d.setHours(0,0,0,0)) / 86400000)
  if (diff === 0) return 'Hoje'
  if (diff === 1) return 'Ontem'
  return d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '').replace(/^\w/, c => c.toUpperCase())
}

export default function HistoricoView({ digests, currentDigestId, lastSeenAt }: Props) {
  const lastVisit = lastSeenAt ? new Date(lastSeenAt) : null

  const newDigests = lastVisit
    ? digests.filter(d => new Date(d.published_at) > lastVisit)
    : digests.slice(0, 1)

  const daysSince = lastVisit
    ? Math.max(1, Math.floor((Date.now() - lastVisit.getTime()) / 86400000))
    : null

  const dividerAfterIndex = newDigests.length - 1

  return (
    <div style={{ maxWidth: 740, margin: '0 auto', padding: '3.5rem 1.75rem 6rem' }}>

      {/* masthead */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontFamily: "'DM Mono', monospace", fontSize: '0.72rem',
        letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--muted)',
        paddingBottom: '0.85rem', borderBottom: '1px solid var(--border2)',
      }}>
        <span>Arquivo · sinais-chave por edição</span>
        <span>Beta</span>
      </div>

      <h1 style={{
        fontFamily: "'Newsreader', Georgia, serif",
        fontWeight: 500, fontSize: 'clamp(2rem, 5vw, 2.8rem)',
        lineHeight: 1.05, letterSpacing: '-0.02em',
        margin: '1.5rem 0 2.25rem', color: 'var(--text)',
      }}>Histórico</h1>

      {/* catch-up banner */}
      {daysSince !== null && newDigests.length > 0 && (
        <div style={{
          border: '1px solid var(--border)', borderRadius: 2,
          padding: '1.75rem 1.9rem', marginBottom: '3rem',
          display: 'flex', alignItems: 'center', gap: '1.5rem',
          background: 'var(--s2)',
        }}>
          <div style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: '3.4rem', fontWeight: 500,
            color: 'var(--text)', lineHeight: 0.9,
          }}>{daysSince}</div>
          <div>
            <div style={{
              fontFamily: "'Newsreader', Georgia, serif",
              fontSize: '1.35rem', color: 'var(--text)',
              lineHeight: 1.25, letterSpacing: '-0.01em',
            }}>dias desde sua última visita</div>
            <div style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.74rem', letterSpacing: '0.03em',
              color: 'var(--muted)', marginTop: '0.35rem',
            }}>
              {newDigests.length} {newDigests.length === 1 ? 'edição nova' : 'edições novas'} separadas para você. Sem pressa — está tudo aqui.
            </div>
          </div>
        </div>
      )}

      {/* timeline */}
      <div style={{ position: 'relative', paddingLeft: 120 }}>
        <div style={{
          position: 'absolute', left: 96, top: 8, bottom: 8,
          width: 1, background: 'var(--border2)',
        }} />

        {newDigests.length > 0 && (
          <SectionLabel>Enquanto você esteve fora</SectionLabel>
        )}

        {digests.map((digest, i) => {
          const isNew = lastVisit
            ? new Date(digest.published_at) > lastVisit
            : i === 0
          const isCurrent = digest.id === currentDigestId
          const showDivider = isNew && i === dividerAfterIndex && digests.length > newDigests.length

          const hero = [...digest.cards].sort((a, b) => (b.claude_score ?? 0) - (a.claude_score ?? 0))[0]
          const sourceName = hero?.sources?.[0]?.name ?? hero?.source ?? '—'

          return (
            <div key={digest.id}>
              <Article
                dayLabel={dayLabel(digest.published_at)}
                dayCode={formatDate(digest.published_at)}
                source={sourceName}
                edition={digest.edition}
                title={digest.title}
                excerpt={hero?.latent ?? hero?.summary ?? ''}
                isNew={isNew}
                isCurrent={isCurrent}
              />
              {showDivider && <LastVisitDivider />}
            </div>
          )
        })}

        {/* "load more" placeholder */}
        <div style={{ position: 'relative', marginTop: '2.8rem' }}>
          <Dot size={9} color="var(--border2)" style={{ position: 'absolute', left: -26, top: 5 }} />
          <button style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.7rem', letterSpacing: '0.06em', textTransform: 'uppercase',
            background: 'none', border: '1px solid var(--border2)', borderRadius: 2,
            padding: '9px 16px', color: 'var(--sub)', cursor: 'pointer',
            transition: 'border-color 0.12s, color 0.12s',
          }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border2)'; e.currentTarget.style.color = 'var(--sub)' }}
          >Ver edições anteriores</button>
        </div>
      </div>
    </div>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: 'relative', marginBottom: '2.5rem',
      fontFamily: "'DM Mono', monospace", fontSize: '0.66rem',
      letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)',
    }}>{children}</div>
  )
}

function LastVisitDivider() {
  return (
    <div style={{
      position: 'relative', marginBottom: '2.6rem',
      fontFamily: "'DM Mono', monospace", fontSize: '0.66rem',
      letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)',
    }}>
      <Dot size={13} color="var(--border)" style={{ position: 'absolute', left: -28, top: 4 }} />
      Sua última visita
    </div>
  )
}

function Dot({ size, color, style }: { size: number; color: string; style?: React.CSSProperties }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: color, border: `1px solid ${color}`,
      ...style,
    }} />
  )
}

function Article({ dayLabel: dl, dayCode, source, edition, title, excerpt, isNew, isCurrent }: {
  dayLabel: string; dayCode: string; source: string; edition: number
  title: string; excerpt: string; isNew: boolean; isCurrent: boolean
}) {
  return (
    <article style={{
      position: 'relative', marginBottom: '2.6rem',
      opacity: isNew ? 1 : 0.62,
    }}>
      {/* date column */}
      <div style={{
        position: 'absolute', left: -120, width: 84, textAlign: 'right',
        fontFamily: "'DM Mono', monospace",
      }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text)' }}>{dl}</div>
        <div style={{ fontSize: '0.64rem', color: 'var(--muted)', letterSpacing: '0.04em' }}>{dayCode}</div>
      </div>

      {/* dot */}
      {isNew ? (
        <div style={{
          position: 'absolute', left: -28, top: 7,
          width: 13, height: 13, borderRadius: '50%',
          background: 'var(--lima)', border: '1px solid var(--border)',
        }} />
      ) : (
        <div style={{
          position: 'absolute', left: -26, top: 9,
          width: 9, height: 9, borderRadius: '50%',
          background: 'var(--muted)', border: '1px solid var(--muted)',
        }} />
      )}

      {/* content */}
      <div style={{
        fontFamily: "'DM Mono', monospace", fontSize: '0.62rem',
        letterSpacing: '0.06em', textTransform: 'uppercase',
        color: 'var(--muted)', marginBottom: '0.5rem',
      }}>
        Edição #{edition} · {source}{!isNew ? ' · já lido' : ''}{isCurrent ? ' · atual' : ''}
      </div>

      <h3 style={{
        fontFamily: "'Newsreader', Georgia, serif",
        fontWeight: 500, fontSize: '1.6rem', lineHeight: 1.16,
        letterSpacing: '-0.012em', color: 'var(--text)',
        margin: '0 0 0.55rem',
      }}>{title}</h3>

      <div style={{
        borderLeft: `2px solid ${isNew ? 'var(--border)' : 'var(--border2)'}`,
        paddingLeft: '1rem',
      }}>
        <p style={{
          fontFamily: "'Newsreader', Georgia, serif",
          fontStyle: 'italic', fontSize: '1.12rem',
          lineHeight: 1.4, color: isNew ? 'var(--sub)' : 'var(--muted)',
          margin: 0,
        }}>{excerpt}</p>
      </div>
    </article>
  )
}
