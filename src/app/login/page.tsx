'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const supabase = createClient()

  async function handleGoogle() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
    if (error) { setError(error.message); setLoading(false) }
  }

  return (
    <main style={{ display: 'flex', minHeight: '100vh', flexWrap: 'wrap' }}>

      {/* ── BRAND PANEL (esquerda) ── */}
      <div style={{
        flex: '1.1 1 440px',
        background: 'var(--bg)',
        padding: '3.5rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Fragmentos de texto animados */}
        <div aria-hidden="true" style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          filter: 'blur(5px)', animation: 'scanField 11s linear infinite',
          fontFamily: "'DM Mono', monospace", fontSize: '0.74rem',
          letterSpacing: '0.04em', textTransform: 'uppercase',
          color: 'var(--text)', userSelect: 'none',
        }}>
          {[
            ['5%','8%','SpaceX × Cursor · $60B','5s','0s'],
            ['52%','5%','Android 17 · MCP nativo','6s','0.4s'],
            ['30%','14%','Claude Fable 5 bloqueado','5.5s','0.9s'],
            ['70%','18%','GLM-5.2 · 1M tokens','6.5s','1.3s'],
            ['10%','24%','ChatGPT Ads · $100M ARR','5.2s','1.7s'],
            ['46%','28%','soberania de IA · G7','6.2s','2.1s'],
            ['76%','34%','org design · Meta','5.8s','0.2s'],
            ['18%','40%','open-source frontier','6.8s','1.1s'],
            ['54%','46%','agentes · automação','5.4s','1.9s'],
            ['8%','54%','75% dos BR já usam IA','6.4s','0.7s'],
            ['60%','58%','300 mil consultores','5.6s','2.3s'],
            ['34%','64%','GPT-Bidi-1 · voz','6.6s','1.5s'],
            ['72%','70%','C-Suite · magic thinking','5.3s','0.5s'],
            ['14%','76%','TLDR Tech · 07:02','6.1s','2s'],
            ['48%','82%','AI Breakfast · wire','5.7s','1.2s'],
            ['24%','90%','$60B · all-stock','6.3s','0.9s'],
            ['66%','88%','1.284 sinais hoje','5.9s','1.8s'],
          ].map(([left, top, text, dur, delay], i) => (
            <span key={i} style={{
              position: 'absolute', left, top, opacity: 0.20,
              animation: `fragFloat ${dur} ease-in-out ${delay} infinite alternate`,
            }}>{text}</span>
          ))}
        </div>

        {/* Scan line */}
        <div aria-hidden="true" style={{
          position: 'absolute', left: '-4%', right: '-4%', height: 140,
          transform: 'translateY(-50%)', pointerEvents: 'none',
          background: 'linear-gradient(180deg, transparent, rgba(227,247,148,0.16) 46%, rgba(227,247,148,0.28) 50%, rgba(227,247,148,0.16) 54%, transparent)',
          animation: 'scanLine 11s cubic-bezier(.45,0,.55,1) infinite',
        }}>
          <div style={{
            position: 'absolute', left: 0, right: 0, top: '50%', height: 2,
            background: 'linear-gradient(90deg, transparent, #cfe85f 20%, #e3f794 50%, #cfe85f 80%, transparent)',
            boxShadow: '0 0 18px 3px rgba(227,247,148,0.7)',
          }} />
        </div>

        {/* Logo */}
        <span style={{
          position: 'relative',
          fontFamily: "'Newsreader', Georgia, serif",
          fontWeight: 500, fontSize: '1.5rem', letterSpacing: '-0.01em',
        }}>Lens</span>

        {/* Headline animada */}
        <div style={{ position: 'relative' }}>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '0.72rem', letterSpacing: '0.1em',
            textTransform: 'uppercase', color: 'var(--muted)',
            marginBottom: '1.5rem',
          }}>Intelligence Briefing</div>
          <h1 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontWeight: 500,
            fontSize: 'clamp(2.2rem, 4vw, 3rem)',
            lineHeight: 1.14, letterSpacing: '-0.02em', margin: 0,
            animation: 'scanHeadline 11s linear infinite',
          }}>
            Sinais de IA,<br />traduzidos em<br />
            <span style={{
              fontStyle: 'italic',
              backgroundImage: 'linear-gradient(#e3f794, #e3f794)',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: '0 0.86em',
              backgroundSize: '0% 0.42em',
              WebkitBoxDecorationBreak: 'clone',
              animation: 'scanMark 11s linear infinite',
            }}>
              decisões de cliente.
            </span>
          </h1>
        </div>

        {/* Footer label */}
        <span style={{
          position: 'relative',
          fontFamily: "'DM Mono', monospace",
          fontSize: '0.7rem', letterSpacing: '0.08em',
          textTransform: 'uppercase', color: 'var(--muted)',
        }}>Currently in Beta · Edição Nº 02</span>
      </div>

      {/* ── FORM PANEL (direita) ── */}
      <div style={{
        flex: '1 1 440px',
        background: 'var(--s2)',
        borderLeft: '1px solid var(--border)',
        padding: '3.5rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: 360, margin: '0 auto' }}>

          <h2 style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontWeight: 500, fontSize: '2rem',
            letterSpacing: '-0.015em', marginBottom: '0.5rem',
          }}>Entrar</h2>
          <p style={{
            fontFamily: "'Newsreader', Georgia, serif",
            fontSize: '1.05rem', color: 'var(--sub)', marginBottom: '2.5rem',
          }}>Acesse a edição de hoje.</p>

          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              width: '100%',
              background: loading ? 'var(--border2)' : 'var(--lima)',
              border: '1px solid var(--border)',
              borderRadius: 2,
              padding: '14px',
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.78rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.12s',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {!loading && (
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {loading ? 'Redirecionando…' : 'Continuar com Google'}
          </button>

          {error && (
            <p style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: '0.72rem', color: '#c0392b',
              textAlign: 'center', marginTop: '1rem',
            }}>{error}</p>
          )}
        </div>
      </div>
    </main>
  )
}
