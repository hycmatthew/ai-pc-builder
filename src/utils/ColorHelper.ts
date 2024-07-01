const hex = (c: number) => {
  const s = '0123456789abcdef'
  let i = c
  if (i === 0) return '00'
  i = Math.round(Math.min(Math.max(0, i), 255))
  return s.charAt((i - (i % 16)) / 16) + s.charAt(i % 16)
}

/* Convert an RGB triplet to a hex string */
function convertToHex(rgb: number[]) {
  return `#${hex(rgb[0])}${hex(rgb[1])}${hex(rgb[2])}`
}

/* Remove '#' in color hex string */
function trim(s: string) {
  return s.charAt(0) === '#' ? s.substring(1, 7) : s
}

/* Convert a hex string to an RGB triplet */
function convertToRGB(hexStr: string) {
  const color = []
  color[0] = parseInt(trim(hexStr).substring(0, 2), 16)
  color[1] = parseInt(trim(hexStr).substring(2, 4), 16)
  color[2] = parseInt(trim(hexStr).substring(4, 6), 16)
  return color
}

export const getGradientColor = (
  colorStart: string,
  colorEnd: string,
  percent: number
) => {
  // The beginning of your gradient
  const start = convertToRGB(colorStart)

  // The end of your gradient
  const end = convertToRGB(colorEnd)

  // Alpha blending amount
  let colorResult = ''
  const c = []

  c[0] = start[0] * percent + (1 - percent) * end[0]
  c[1] = start[1] * percent + (1 - percent) * end[1]
  c[2] = start[2] * percent + (1 - percent) * end[2]

  colorResult = convertToHex(c)
  return colorResult
}
