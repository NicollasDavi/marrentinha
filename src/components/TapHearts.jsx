import { useState, useCallback, useEffect } from 'react'

const HEARTS = ['♥', '💕', '💗', '💖', '❤️']
const COLORS = ['#e91e63', '#c2185b', '#f8bbd9', '#d4af37']

function TapHearts() {
  const [hearts, setHearts] = useState([])

  const spawnHeart = useCallback((x, y) => {
    const id = Date.now() + Math.random()
    const heart = HEARTS[Math.floor(Math.random() * HEARTS.length)]
    const color = COLORS[Math.floor(Math.random() * COLORS.length)]
    const size = 20 + Math.random() * 30
    const drift = (Math.random() - 0.5) * 80

    setHearts((prev) => [...prev, { id, x, y, heart, color, size, drift }])

    setTimeout(() => {
      setHearts((prev) => prev.filter((h) => h.id !== id))
    }, 2500)
  }, [])

  useEffect(() => {
    const handleTap = (e) => {
      const x = e.clientX
      const y = e.clientY
      if (x != null && y != null) {
        spawnHeart(x, y)
        if (navigator.vibrate) navigator.vibrate(10)
      }
    }
    document.addEventListener('pointerdown', handleTap, { capture: true })
    return () => document.removeEventListener('pointerdown', handleTap, { capture: true })
  }, [spawnHeart])

  return (
    <div className="tap-hearts-container" aria-hidden="true">
      {hearts.map(({ id, x, y, heart, color, size, drift }) => (
        <span
          key={id}
          className="tap-heart"
          style={{
            left: x,
            top: y,
            color,
            fontSize: size,
            '--drift': `${drift}px`
          }}
        >
          {heart}
        </span>
      ))}
    </div>
  )
}

export default TapHearts
