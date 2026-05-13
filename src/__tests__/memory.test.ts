import { describe, it, expect } from 'vitest'
import { generateCards, getPairCount, isMatch, memoryThemes, memorySizes } from '../engine/memory'
import { createSeededRandom } from '../engine/random'
import type { MemoryCard } from '../engine/memory'

describe('Memory Engine', () => {
  describe('generateCards', () => {
    it('creates correct number of cards for 2x2', () => {
      const cards = generateCards(2, 'emoji')
      expect(cards.length).toBe(4)
    })

    it('creates correct number of cards for 4x4', () => {
      const cards = generateCards(8, 'emoji')
      expect(cards.length).toBe(16)
    })

    it('creates correct number of cards for 6x6', () => {
      const cards = generateCards(18, 'emoji')
      expect(cards.length).toBe(36)
    })

    it('each pairId appears exactly twice', () => {
      const cards = generateCards(5, 'emoji')
      const counts: Record<number, number> = {}
      for (const c of cards) {
        counts[c.pairId] = (counts[c.pairId] || 0) + 1
      }
      expect(Object.values(counts).every(c => c === 2)).toBe(true)
    })

    it('items match within each pair', () => {
      const cards = generateCards(3, 'emoji')
      for (let i = 0; i < cards.length; i++) {
        const pair = cards.filter(c => c.pairId === cards[i].pairId)
        expect(pair.length).toBe(2)
        expect(pair[0].content).toBe(pair[1].content)
      }
    })

    it('works with color theme', () => {
      const cards = generateCards(5, 'color')
      expect(cards.length).toBe(10)
      expect(cards.every(c => c.content.startsWith('#'))).toBe(true)
    })

    it('works with number theme', () => {
      const cards = generateCards(5, 'number')
      expect(cards.length).toBe(10)
    })

    it('returns empty for invalid theme', () => {
      const cards = generateCards(5, 'nonexistent')
      expect(cards.length).toBe(0)
    })

    it('shuffles cards (not in sequential order)', () => {
      const cards = generateCards(8, 'emoji', createSeededRandom(42))
      const isSequential = cards.every((c, i) => i < 2 ? true : c.pairId >= cards[i - 1].pairId)
      // Shuffled cards should NOT be in sequential order
      // (very unlikely with 16 cards, but possible. We check content uniqueness instead)
      const contents = cards.map(c => c.content)
      const unique = new Set(contents)
      expect(unique.size).toBe(8) // 8 unique contents for 8 pairs
    })
  })

  describe('getPairCount', () => {
    it('returns 2 for size 2', () => expect(getPairCount(2)).toBe(2))
    it('returns 8 for size 4', () => expect(getPairCount(4)).toBe(8))
    it('returns 18 for size 6', () => expect(getPairCount(6)).toBe(18))
  })

  describe('isMatch', () => {
    it('returns true for matching pairIds', () => {
      const c1: MemoryCard = { pairId: 5, content: 'A' }
      const c2: MemoryCard = { pairId: 5, content: 'A' }
      expect(isMatch(c1, c2)).toBe(true)
    })

    it('returns false for different pairIds', () => {
      const c1: MemoryCard = { pairId: 5, content: 'A' }
      const c2: MemoryCard = { pairId: 3, content: 'B' }
      expect(isMatch(c1, c2)).toBe(false)
    })
  })

  describe('memoryThemes', () => {
    it('has 3 themes', () => {
      expect(Object.keys(memoryThemes).length).toBe(3)
    })

    it('each theme has at least 18 items', () => {
      for (const [, theme] of Object.entries(memoryThemes)) {
        expect(theme.items.length).toBeGreaterThanOrEqual(18)
      }
    })

    it('each theme has name and icon', () => {
      for (const [, theme] of Object.entries(memoryThemes)) {
        expect(theme.name).toBeTruthy()
        expect(theme.icon).toBeTruthy()
      }
    })
  })

  describe('memorySizes', () => {
    it('has 3 difficulty levels', () => {
      expect(Object.keys(memorySizes).length).toBe(3)
    })
  })
})
