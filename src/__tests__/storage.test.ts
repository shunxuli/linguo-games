import { describe, it, expect, beforeEach } from 'vitest'
import { GameStorage } from '../engine/storage'

describe('GameStorage', () => {
  let storage: GameStorage

  beforeEach(() => {
    localStorage.clear()
    storage = new GameStorage()
  })

  describe('totalScore', () => {
    it('returns 0 by default', () => {
      expect(storage.getTotalScore()).toBe(0)
    })

    it('persists and retrieves score', () => {
      storage.setTotalScore(100)
      expect(storage.getTotalScore()).toBe(100)
    })
  })

  describe('voice and sound settings', () => {
    it('returns true by default for voice', () => {
      expect(storage.getVoiceEnabled()).toBe(true)
    })

    it('persists voice setting', () => {
      storage.setVoiceEnabled(false)
      expect(storage.getVoiceEnabled()).toBe(false)
    })

    it('returns true by default for sound', () => {
      expect(storage.getSoundEnabled()).toBe(true)
    })

    it('persists sound setting', () => {
      storage.setSoundEnabled(false)
      expect(storage.getSoundEnabled()).toBe(false)
    })
  })

  describe('sudoku persistence', () => {
    it('saves and loads sudoku state', () => {
      const state = { mode: 'number', size: 4, puzzle: [[1, 2], [3, 4]] }
      storage.saveSudoku(state)
      expect(storage.getSudoku()).toEqual(state)
    })

    it('returns null for no saved sudoku', () => {
      expect(storage.getSudoku()).toBeNull()
    })

    it('clears sudoku state', () => {
      storage.saveSudoku({ test: true })
      storage.clearSudoku()
      expect(storage.getSudoku()).toBeNull()
    })
  })

  describe('sudoku preferences', () => {
    it('persists last mode', () => {
      storage.setLastMode('fruit')
      expect(storage.getLastMode()).toBe('fruit')
    })

    it('persists last size', () => {
      storage.setLastSize(4)
      expect(storage.getLastSize()).toBe(4)
    })
  })

  describe('shown modes', () => {
    it('returns empty array by default', () => {
      expect(storage.getShownModes()).toEqual([])
    })

    it('adds and tracks shown modes', () => {
      storage.addShownMode('fruit')
      storage.addShownMode('animal')
      expect(storage.getShownModes()).toEqual(['fruit', 'animal'])
    })

    it('does not duplicate modes', () => {
      storage.addShownMode('fruit')
      storage.addShownMode('fruit')
      expect(storage.getShownModes()).toEqual(['fruit'])
    })
  })

  describe('math persistence', () => {
    it('saves and loads math state', () => {
      const state = { correctCount: 5, totalCount: 10 }
      storage.saveMath(state)
      expect(storage.getMath()).toEqual(state)
    })

    it('persists last op and range', () => {
      storage.setLastOp('add')
      storage.setLastRange(20)
      expect(storage.getLastOp()).toBe('add')
      expect(storage.getLastRange()).toBe(20)
    })
  })

  describe('puzzle persistence', () => {
    it('persists last pattern index', () => {
      storage.setPuzzleLastPatternIndex(5)
      expect(storage.getPuzzleLastPatternIndex()).toBe(5)
    })

    it('persists last size', () => {
      storage.setPuzzleLastSize(3)
      expect(storage.getPuzzleLastSize()).toBe(3)
    })

    it('returns null for unset values', () => {
      expect(storage.getPuzzleLastPatternIndex()).toBeNull()
      expect(storage.getPuzzleLastSize()).toBeNull()
    })
  })
})
