/**
 * Extrai data do nome do ficheiro.
 * Formatos suportados:
 * - WhatsApp Image 2026-03-03 at 15.11.56.jpeg
 * - IMG_20250115_123456.heic
 * - 2025-01-15_qualquercoisa.jpg
 * - 20250115_qualquercoisa.jpg
 */
export function extractDateFromFilename(filename) {
  if (!filename) return null

  // WhatsApp: "WhatsApp Image 2026-03-03 at 15.11.56.jpeg"
  const whatsapp = filename.match(/WhatsApp\s+Image\s+(\d{4})-(\d{2})-(\d{2})/i)
  if (whatsapp) return `${whatsapp[1]}-${whatsapp[2]}-${whatsapp[3]}`

  // iPhone: IMG_20250115_123456 ou IMG_20250115
  const iphone = filename.match(/IMG_(\d{4})(\d{2})(\d{2})/i)
  if (iphone) return `${iphone[1]}-${iphone[2]}-${iphone[3]}`

  // YYYY-MM-DD em qualquer lugar
  const iso = filename.match(/(\d{4})-(\d{2})-(\d{2})/)
  if (iso) return `${iso[1]}-${iso[2]}-${iso[3]}`

  // YYYYMMDD
  const compact = filename.match(/(\d{4})(\d{2})(\d{2})/)
  if (compact) return `${compact[1]}-${compact[2]}-${compact[3]}`

  return null
}

/**
 * Converte data para formato legível (ex: "15 de Janeiro de 2025")
 */
const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro']

export function formatDateForDisplay(dateStr) {
  if (!dateStr) return ''
  const d = parseDate(dateStr)
  if (!d) return dateStr
  return `${d.getDate()} de ${meses[d.getMonth()]} de ${d.getFullYear()}`
}

/**
 * Formato curto: 15/01/2025
 */
export function formatDateShort(dateStr) {
  if (!dateStr) return ''
  const d = parseDate(dateStr)
  if (!d) return dateStr
  const day = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${d.getFullYear()}`
}

export function parseDate(dateStr) {
  if (!dateStr) return null
  // YYYY-MM-DD
  const iso = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) {
    const d = new Date(parseInt(iso[1]), parseInt(iso[2]) - 1, parseInt(iso[3]))
    return isNaN(d.getTime()) ? null : d
  }
  // DD/MM/YYYY
  const pt = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (pt) {
    const d = new Date(parseInt(pt[3]), parseInt(pt[2]) - 1, parseInt(pt[1]))
    return isNaN(d.getTime()) ? null : d
  }
  return null
}

/**
 * Ordena por data (mais antiga primeiro)
 */
export function sortByDate(items, getDate) {
  return [...items].sort((a, b) => {
    const da = getDate(a)
    const db = getDate(b)
    if (!da && !db) return 0
    if (!da) return 1
    if (!db) return -1
    return new Date(da).getTime() - new Date(db).getTime()
  })
}

/**
 * Agrupa por data (YYYY-MM-DD como chave)
 */
export function groupByDate(items, getDate, extractDate = (x) => x) {
  const groups = {}
  for (const item of items) {
    const dateStr = getDate(item) || extractDate(item)
    const key = dateStr || 'sem-data'
    if (!groups[key]) groups[key] = []
    groups[key].push(item)
  }
  // Ordenar as chaves (datas)
  const sortedKeys = Object.keys(groups).sort((a, b) => {
    if (a === 'sem-data') return 1
    if (b === 'sem-data') return -1
    return new Date(a).getTime() - new Date(b).getTime()
  })
  return sortedKeys.map((key) => ({ date: key, items: groups[key] }))
}
