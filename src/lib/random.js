export function pickRandom(array) {
  return array[Math.floor(Math.random() * array.length)]
}

export function pickRandomN(array, n) {
  if (n > array.length) {
    throw new Error(`Cannot pick ${n} unique items from an array of length ${array.length}`)
  }
  const shuffled = [...array].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export function angleForCategory(categorias, categoryId) {
  const index = categorias.findIndex((c) => c.id === categoryId)
  if (index === -1) {
    throw new Error(`Unknown category id: ${categoryId}`)
  }
  const sliceSize = 360 / categorias.length
  return sliceSize * index + sliceSize / 2
}
