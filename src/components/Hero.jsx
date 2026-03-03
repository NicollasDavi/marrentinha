const HEART_CHARS = ['♥', '💕', '💗', '💖']

function Hero({ mensagem, dataNamoro }) {
  return (
    <header className="hero">
      <div className="hero-bg" />
      <div className="hero-hearts">
        {[...Array(12)].map((_, i) => (
          <span
            key={i}
            className={`hero-heart hero-heart--${(i % 3) + 1}`}
            style={{ '--i': i }}
          >
            {HEART_CHARS[i % HEART_CHARS.length]}
          </span>
        ))}
      </div>
      <div className="hero-content">
        <p className="hero-subtitle">Feliz Aniversário de Namoro</p>
        <h1 className="hero-title">Nossa História</h1>
        <p className="hero-message">{mensagem || 'Para a minha marrentinha, com todo o amor do mundo. 💕'}</p>
        <div className="hero-date">
          <span className="date-label">Desde</span>
          <span className="date-value">{dataNamoro || '--/--/----'}</span>
        </div>
        <a href="#galeria" className="scroll-hint">
          <span>Descobre os nossos momentos</span>
          <span className="scroll-hint-tap">Toca no ecrã para criar corações ♥</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
        </a>
      </div>
    </header>
  )
}

export default Hero
