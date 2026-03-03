import PhotoImage from './PhotoImage'
import { isVideo } from '../utils/mediaUtils'

function MediaItem({ fotosDir, filename, alt, className, loading, onClick, ...props }) {
  if (isVideo(filename)) {
    const src = `${fotosDir}/${encodeURIComponent(filename)}`
    return (
      <div
        className={className}
        style={{ position: 'relative', cursor: 'pointer' }}
      >
        <video
          src={src}
          muted
          playsInline
          preload="metadata"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            display: 'block'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.3)'
          }}
        >
          <span
            style={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.9)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              paddingLeft: 4
            }}
          >
            ▶
          </span>
        </div>
      </div>
    )
  }

  return (
    <PhotoImage
      fotosDir={fotosDir}
      filename={filename}
      alt={alt}
      className={className}
      loading={loading}
      onClick={onClick}
      {...props}
    />
  )
}

export default MediaItem
