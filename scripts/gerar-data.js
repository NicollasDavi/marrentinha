/**
 * Script para gerar/atualizar data.json a partir da pasta de fotos.
 * Converte HEIC para JPEG, extrai datas (nome ou EXIF), agrupa por dia.
 *
 * Uso: node scripts/gerar-data.js
 */

import { readdirSync, readFileSync, writeFileSync, copyFileSync, existsSync, mkdirSync, statSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import exifr from 'exifr'
import convert from 'heic-convert'

const __dirname = dirname(fileURLToPath(import.meta.url))
const FOTOS_ORIGEM = join(__dirname, '../fotos')
const FOTOS_DESTINO = join(__dirname, '../public/fotos')
const DATA_FILE = join(__dirname, '../public/data.json')
const FOTOS_DIR = FOTOS_DESTINO

const IMAGE_EXT = /\.(jpe?g|png|heic|heif|gif|webp)$/i
const HEIC_EXT = /\.(heic|heif)$/i
const VIDEO_EXT = /\.(mp4|mov|webm)$/i

function heicToJpegName(filename) {
  return filename.replace(HEIC_EXT, '.jpeg')
}

function extractDateFromFilename(filename) {
  if (!filename) return null
  const whatsapp = filename.match(/WhatsApp\s+Image\s+(\d{4})-(\d{2})-(\d{2})/i)
  if (whatsapp) return `${whatsapp[1]}-${whatsapp[2]}-${whatsapp[3]}`
  const iphone = filename.match(/IMG_(\d{4})(\d{2})(\d{2})/i)
  if (iphone) return `${iphone[1]}-${iphone[2]}-${iphone[3]}`
  const iso = filename.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`
  const compact = filename.match(/(\d{4})(\d{2})(\d{2})/)
  if (compact) return `${compact[1]}-${compact[2]}-${compact[3]}`
  return null
}

async function extractDateFromExif(filePath) {
  try {
    const exif = await exifr.parse(filePath, { pick: ['DateTimeOriginal', 'CreateDate', 'ModifyDate'] })
    if (!exif) return null
    const d = exif.DateTimeOriginal || exif.CreateDate || exif.ModifyDate
    if (!d) return null
    const date = d instanceof Date ? d : new Date(d)
    if (isNaN(date.getTime())) return null
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  } catch {
    return null
  }
}

function extractDateFromFileStats(filePath) {
  try {
    const stat = statSync(filePath)
    const date = stat.birthtimeMs ? new Date(stat.birthtimeMs) : new Date(stat.mtimeMs)
    const y = date.getFullYear()
    const m = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  } catch {
    return null
  }
}

async function convertHeicToJpeg(srcPath, destPath) {
  const inputBuffer = readFileSync(srcPath)
  const outputBuffer = await convert({
    buffer: inputBuffer,
    format: 'JPEG',
    quality: 0.9
  })
  const result = Array.isArray(outputBuffer) ? outputBuffer[0] : outputBuffer
  writeFileSync(destPath, result)
}

let files = []
let heicCount = 0
const exifPathMap = {}
if (existsSync(FOTOS_ORIGEM)) {
  if (!existsSync(FOTOS_DESTINO)) mkdirSync(FOTOS_DESTINO, { recursive: true })
  const originais = readdirSync(FOTOS_ORIGEM).filter((f) =>
    IMAGE_EXT.test(f) || VIDEO_EXT.test(f)
  )
  for (const f of originais) {
    const src = join(FOTOS_ORIGEM, f)
    const dest = join(FOTOS_DESTINO, f)
    if (HEIC_EXT.test(f)) {
      const jpegName = heicToJpegName(f)
      const jpegDest = join(FOTOS_DESTINO, jpegName)
      try {
        await convertHeicToJpeg(src, jpegDest)
        files.push(jpegName)
        exifPathMap[jpegName] = src
        heicCount++
        if (heicCount % 5 === 0) process.stdout.write(`\r  HEIC: ${heicCount} convertidos...`)
      } catch (err) {
        console.warn(`\n  ⚠ Não foi possível converter ${f}:`, err.message)
      }
    } else {
      copyFileSync(src, dest)
      files.push(f)
    }
  }
}

if (files.length === 0) {
  files = readdirSync(FOTOS_DIR).filter((f) =>
    /\.(jpe?g|png|gif|webp|mp4|mov|webm)$/i.test(f)
  )
}

try {
  let dataConfig = {}
  try {
    dataConfig = JSON.parse(readFileSync(DATA_FILE, 'utf8'))
  } catch {}
  const datasManuais = dataConfig.datasManuais || {}

  const dateMap = {}
  for (const f of files) {
    let data = datasManuais[f]
    if (!data) data = extractDateFromFilename(f)
    const filePath = exifPathMap[f] || join(FOTOS_DIR, f)
    if (!data && /\.(jpe?g|png|gif|webp)$/i.test(f)) {
      data = await extractDateFromExif(filePath)
    }
    if (!data && existsSync(filePath)) {
      data = extractDateFromFileStats(filePath)
    }
    if (!data) data = 'sem-data'
    if (!dateMap[data]) dateMap[data] = []
    dateMap[data].push(f)
  }

  const byDate = dateMap
  const fileToDate = {}
  for (const [data, list] of Object.entries(byDate)) {
    for (const f of list) fileToDate[f] = data
  }
  const fotosOrdenadas = files.sort((a, b) =>
    (fileToDate[a] || 'zzz').localeCompare(fileToDate[b] || 'zzz')
  )

  const datasOrdenadas = Object.keys(byDate)
    .filter((d) => d !== 'sem-data' || byDate[d].length > 0)
    .sort((a, b) => {
      if (a === 'sem-data') return 1
      if (b === 'sem-data') return -1
      return a.localeCompare(b)
    })

  let data = dataConfig
  if (!data.titulo) {
    data = {
      titulo: 'Nossa História',
      dataNamoro: '03/03/2025',
      mensagem: 'Para a minha marrentinha, com todo o amor do mundo. Feliz aniversário de namoro! 💕',
      dias: []
    }
  }

  const titulosExistentes = {}
  for (const d of data.dias || []) {
    titulosExistentes[d.data] = d.titulo || ''
  }

  data.dias = datasOrdenadas.map((dataStr) => ({
    data: dataStr,
    titulo: titulosExistentes[dataStr] || '',
    fotos: byDate[dataStr]
  }))

  delete data.fotos
  delete data.milestones
  if (Object.keys(datasManuais).length > 0) {
    data.datasManuais = datasManuais
  }
  writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8')
  const total = fotosOrdenadas.length
  const numDias = data.dias.length
  if (heicCount > 0) console.log('')
  console.log(`✓ Atualizado data.json: ${total} fotos em ${numDias} dias`)
  if (heicCount > 0) console.log(`  ${heicCount} HEIC convertidos para JPEG`)
  console.log('  Edita o "titulo" de cada dia no public/data.json')
} catch (err) {
  console.error('Erro:', err.message)
  process.exit(1)
}
