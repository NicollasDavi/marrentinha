import { useState, useEffect } from 'react'
import Hero from './components/Hero'
import Gallery from './components/Gallery'
import Lightbox from './components/Lightbox'
import Footer from './components/Footer'
import TapHearts from './components/TapHearts'
import './App.css'

const FOTOS_DIR = '/fotos'

const DEFAULT_DATA = {
  titulo: "Nossa História",
  mensagem: "Para a minha marrentinha, com todo o amor do mundo. Feliz aniversário de namoro! 💕",
  dataNamoro: "03/03/2025",
  dias: []
}

function App() {
  const [data, setData] = useState(null)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  useEffect(() => {
    fetch('/data.json')
      .then(res => res.json())
      .then(json => setData(json))
      .catch(() => setData(DEFAULT_DATA))
  }, [])

  const fotosOrdenadas = (data?.dias || []).flatMap((d) => d.fotos || [])
  const openLightbox = (index) => setLightboxIndex(index)
  const closeLightbox = () => setLightboxIndex(null)

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <>
      <TapHearts />
      <Hero mensagem={data.mensagem} dataNamoro={data.dataNamoro} />
      <main>
        <Gallery
          dias={data.dias || []}
          fotosOrdenadas={fotosOrdenadas}
          fotosDir={FOTOS_DIR}
          onPhotoClick={openLightbox}
        />
      </main>
      <Lightbox
        fotos={fotosOrdenadas}
        fotosDir={FOTOS_DIR}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onNavigate={setLightboxIndex}
      />
      <Footer />
    </>
  )
}

export default App
