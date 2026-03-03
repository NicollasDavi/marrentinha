function Hero({ mensagem, dataNamoro }) {
  const scrollToBottom = (e) => {
    e.preventDefault()
    const html = document.documentElement
    const body = document.body
    const start = window.pageYOffset
    const maxScroll = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.scrollHeight,
      html.offsetHeight
    ) - window.innerHeight
    const end = Math.max(0, maxScroll)
    const dist = end - start
    if (dist <= 0) return
    const speed = 100
    const duration = (dist / speed) * 1000
    const origScrollBehavior = html.style.scrollBehavior
    html.style.scrollBehavior = 'auto'

    let startTime = null
    function step(now) {
      if (startTime === null) startTime = now
      const elapsed = now - startTime
      const t = Math.min(elapsed / duration, 1)
      const y = Math.round(start + dist * t)
      window.scrollTo(0, y)
      if (t < 1) {
        requestAnimationFrame(step)
      } else {
        html.style.scrollBehavior = origScrollBehavior
      }
    }
    requestAnimationFrame(step)
  }

  return (
    <header className="hero">
      <div className="hero-bg" />
      <div className="hero-content">
        <p className="hero-subtitle">Feliz Aniversário de Namoro</p>
        <h1 className="hero-title">Nossa História</h1>
        <p className="hero-message">{mensagem || 'Para a minha marrentinha, com todo o amor do mundo. 💕'}</p>
        <div className="hero-date">
          <span className="date-label">Desde</span>
          <span className="date-value">{dataNamoro || '--/--/----'}</span>
        </div>
        <a href="#galeria" className="scroll-hint" onClick={scrollToBottom} aria-label="Ir para a galeria">
          <svg className="scroll-arrow" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M19 12l-7 7-7-7"/>
          </svg>
          <span className="scroll-hint-text">Descobre os nossos momentos</span>
          <span className="scroll-hint-tap">Toca no ecrã para criar corações ♥</span>
        </a>
      </div>
    </header>
  )
}

export default Hero
