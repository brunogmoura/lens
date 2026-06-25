export default function Loading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36,
          background: 'var(--purple)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="white" strokeWidth="2">
            <circle cx="10" cy="10" r="4"/>
            <path d="M10 3v2M10 15v2M3 10h2M15 10h2" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{ fontWeight: 700, fontSize: '1.2rem', letterSpacing: -0.3, color: 'var(--text)' }}>
          Lens
        </span>
      </div>

      {/* Mensagem */}
      <p style={{
        fontSize: '0.8rem',
        color: 'var(--muted)',
        letterSpacing: '0.04em',
      }}>
        Preparando seu digest…
      </p>

      {/* Barra de progresso animada */}
      <div style={{
        width: 120,
        height: 2,
        background: 'var(--border)',
        borderRadius: 2,
        overflow: 'hidden',
      }}>
        <div style={{
          height: '100%',
          background: 'var(--plum)',
          borderRadius: 2,
          animation: 'lens-progress 1.4s ease-in-out infinite',
        }} />
      </div>

      <style>{`
        @keyframes lens-progress {
          0%   { width: 0%;   margin-left: 0%; }
          50%  { width: 60%;  margin-left: 20%; }
          100% { width: 0%;   margin-left: 100%; }
        }
      `}</style>
    </div>
  )
}
