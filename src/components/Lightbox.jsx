import { useEffect, useRef, useCallback } from 'react'
import PhotoImage from './PhotoImage'
import { isVideo } from '../utils/mediaUtils'

const SWIPE_THRESHOLD = 50

function Lightbox({ fotos, fotosDir, currentIndex, onClose, onNavigate }) {
  const isOpen = currentIndex !== null
  const videoRef = useRef(null)
  const touchStartRef = useRef(null)

  const prev = () => onNavigate(((currentIndex - 1) % fotos.length + fotos.length) % fotos.length)
  const next = () => onNavigate(((currentIndex + 1) % fotos.length + fotos.length) % fotos.length)

  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = e.touches[0] ? { x: e.touches[0].clientX, y: e.touches[0].clientY } : null
  }, [])

  const handleTouchEnd = useCallback((e) => {
    const start = touchStartRef.current
    if (!start || !e.changedTouches[0]) return
    const dx = e.changedTouches[0].clientX - start.x
    const dy = e.changedTouches[0].clientY - start.y
    if (Math.abs(dx) > SWIPE_THRESHOLD && Math.abs(dx) > Math.abs(dy)) {
      const n = fotos.length
      const idx = ((currentIndex + (dx > 0 ? -1 : 1)) % n + n) % n
      onNavigate(idx)
    }
    touchStartRef.current = null
  }, [currentIndex, fotos.length, onNavigate])

  useEffect(() => {
    const handleKey = (e) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onNavigate(((currentIndex - 1) % fotos.length + fotos.length) % fotos.length)
      if (e.key === 'ArrowRight') onNavigate(((currentIndex + 1) % fotos.length + fotos.length) % fotos.length)
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, currentIndex, fotos.length, onClose, onNavigate])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    const item = fotos[currentIndex]
    if (videoRef.current && isOpen && item && isVideo(item)) {
      videoRef.current.play().catch(() => {})
    }
  }, [isOpen, currentIndex, fotos])

  if (!isOpen) return null

  const currentItem = fotos[currentIndex]
  const isCurrentVideo = currentItem && isVideo(currentItem)

  return (
    <div
      className="lightbox"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button className="lightbox-close" aria-label="Fechar" onClick={onClose}>
        &times;
      </button>
      <button className="lightbox-prev" aria-label="Anterior" onClick={(e) => { e.stopPropagation(); prev() }}>
        ‹
      </button>
      <button className="lightbox-next" aria-label="Próxima" onClick={(e) => { e.stopPropagation(); next() }}>
        ›
      </button>
      {currentItem && (
        isCurrentVideo ? (
          <video
            ref={videoRef}
            src={`${fotosDir}/${encodeURIComponent(currentItem)}`}
            controls
            autoPlay
            playsInline
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '90%',
              maxHeight: '90vh',
              borderRadius: 8
            }}
          />
        ) : (
          <PhotoImage
            fotosDir={fotosDir}
            filename={currentItem}
            alt={`Foto ${currentIndex + 1}`}
            onClick={(e) => e.stopPropagation()}
          />
        )
      )}
      <div className="lightbox-counter">
        {currentIndex + 1} / {fotos.length}
      </div>
    </div>
  )
}

export default Lightbox
