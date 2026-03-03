const VIDEO_EXT = /\.(mp4|mov|webm)$/i

export function isVideo(filename) {
  return VIDEO_EXT.test(filename || '')
}
