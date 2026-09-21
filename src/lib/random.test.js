import { describe, it, expect, vi } from 'vitest'
import { pickRandom, pickRandomN, angleForCategory } from './random'

describe('pickRandom', () => {
  it('returns an element from the array', () => {
    const arr = [1, 2, 3]
    expect(arr).toContain(pickRandom(arr))
  })
})

describe('pickRandomN', () => {
  it('returns n unique elements from the array', () => {
    const arr = [1, 2, 3, 4, 5]
    const result = pickRandomN(arr, 3)
    expect(result).toHaveLength(3)
    expect(new Set(result).size).toBe(3)
    result.forEach((item) => expect(arr).toContain(item))
  })

  it('throws when n is greater than the array length', () => {
    expect(() => pickRandomN([1, 2], 5)).toThrow()
  })
})

describe('angleForCategory', () => {
  it('divides 360 degrees evenly across categories and returns the slice center', () => {
    const categorias = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }]
    // 4 slices of 90deg each, centers at 45, 135, 225, 315
    expect(angleForCategory(categorias, 'a')).toBe(45)
    expect(angleForCategory(categorias, 'c')).toBe(225)
  })

  it('throws for an unknown category id', () => {
    expect(() => angleForCategory([{ id: 'a' }], 'zzz')).toThrow()
  })
})
