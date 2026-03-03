import MediaItem from './MediaItem'
import { formatDateForDisplay } from '../utils/dateUtils'

function Gallery({ dias, fotosOrdenadas, fotosDir, onPhotoClick }) {
  return (
    <section id="galeria" className="galeria">
      <div className="section-divider">♥ ♥ ♥</div>
      <h2 className="section-title">Todos os Nossos Momentos</h2>
      {dias.map((dia) => (
        <div key={dia.data} className="gallery-date-group">
          <h3 className="gallery-date-title">
            {dia.titulo || (dia.data === 'sem-data' ? 'Outros momentos' : formatDateForDisplay(dia.data))}
          </h3>
          <div className="gallery-grid">
            {dia.fotos.map((filename) => {
              const idx = fotosOrdenadas.indexOf(filename)
              return (
                <div
                  key={filename}
                  className="gallery-item"
                  onClick={() => onPhotoClick(idx >= 0 ? idx : 0)}
                >
                  <MediaItem
                    fotosDir={fotosDir}
                    filename={filename}
                    alt=""
                    loading="lazy"
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </section>
  )
}

export default Gallery
