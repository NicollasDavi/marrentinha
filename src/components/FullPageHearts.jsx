const HEART_CHARS = ['♥', '💕', '💗', '💖']

function FullPageHearts() {
  return (
    <div className="fullpage-hearts" aria-hidden="true">
      {[...Array(16)].map((_, i) => (
        <span
          key={i}
          className={`fullpage-heart fullpage-heart--${(i % 3) + 1}`}
          style={{ '--i': i }}
        >
          {HEART_CHARS[i % HEART_CHARS.length]}
        </span>
      ))}
    </div>
  )
}

export default FullPageHearts
