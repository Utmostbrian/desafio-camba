import { describe, it, expect } from 'vitest'
import categorias from './categorias.json'
import noSeDice from './noSeDice.json'
import trivia from './trivia.json'
import leyendas from './leyendas.json'
import canciones from './canciones.json'
import enchoque from './enchoque.json'

describe('content data', () => {
  it('has one categoria entry per known game id', () => {
    const ids = categorias.map((c) => c.id)
    expect(ids).toEqual([
      'no-se-dice', 'escucha-la-cancion', 'adivina-la-leyenda', 'trivia', 'enchoque',
    ])
  })

  it('noSeDice entries have frase and respuesta', () => {
    expect(noSeDice).toHaveLength(12)
    noSeDice.forEach((entry) => {
      expect(entry.frase).toBeTypeOf('string')
      expect(entry.respuesta).toBeTypeOf('string')
    })
  })

  it('trivia has 15 questions with 4 options and a valid correctaIndex', () => {
    expect(trivia).toHaveLength(15)
    trivia.forEach((q) => {
      expect(q.opciones).toHaveLength(4)
      expect(q.correctaIndex).toBeGreaterThanOrEqual(0)
      expect(q.correctaIndex).toBeLessThan(4)
    })
  })

  it('leyendas has 4 entries matching real exported images', () => {
    expect(leyendas).toHaveLength(4)
    leyendas.forEach((l) => expect(l.imagen).toMatch(/\.png$/))
  })

  it('canciones has at least one entry', () => {
    expect(canciones.length).toBeGreaterThan(0)
  })

  it('enchoque has a duration and at least one step', () => {
    expect(enchoque.duracionSegundos).toBe(180)
    expect(enchoque.pasos.length).toBeGreaterThan(0)
  })
})
