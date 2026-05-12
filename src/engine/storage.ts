export interface GameStorageState {
  totalScore: number
  voiceEnabled: boolean
  soundEnabled: boolean
  sudokuLastMode: string | null
  sudokuLastSize: number | null
  mathLastOp: string | null
  mathLastRange: number | null
  puzzleLastPatternIndex: number | null
  puzzleLastSize: number | null
}

export class GameStorage {
  getTotalScore(): number { return parseInt(localStorage.getItem('lobby_totalScore') || '0', 10) }
  setTotalScore(score: number): void { localStorage.setItem('lobby_totalScore', score.toString()) }

  getVoiceEnabled(): boolean { const s = localStorage.getItem('sudoku_voiceEnabled'); return s !== null ? s === 'true' : true }
  setVoiceEnabled(v: boolean): void { localStorage.setItem('sudoku_voiceEnabled', v ? 'true' : 'false') }

  getSoundEnabled(): boolean { const s = localStorage.getItem('sudoku_soundEnabled'); return s !== null ? s === 'true' : true }
  setSoundEnabled(v: boolean): void { localStorage.setItem('sudoku_soundEnabled', v ? 'true' : 'false') }

  saveSudoku(state: unknown): void { localStorage.setItem('sudoku_savedGame', JSON.stringify(state)) }
  getSudoku(): unknown { try { return JSON.parse(localStorage.getItem('sudoku_savedGame') || 'null') } catch { return null } }
  clearSudoku(): void { localStorage.removeItem('sudoku_savedGame') }

  setLastMode(m: string): void { localStorage.setItem('sudoku_lastMode', m) }
  getLastMode(): string | null { return localStorage.getItem('sudoku_lastMode') }
  setLastSize(s: number): void { localStorage.setItem('sudoku_lastSize', s.toString()) }
  getLastSize(): number | null { const s = localStorage.getItem('sudoku_lastSize'); return s ? parseInt(s, 10) : null }

  getShownModes(): string[] { try { return JSON.parse(localStorage.getItem('sudoku_shownModes') || '[]') } catch { return [] } }
  addShownMode(m: string): void { const modes = this.getShownModes(); if (!modes.includes(m)) { modes.push(m); localStorage.setItem('sudoku_shownModes', JSON.stringify(modes)) } }

  saveMath(state: unknown): void { localStorage.setItem('math_savedGame', JSON.stringify(state)) }
  getMath(): unknown { try { return JSON.parse(localStorage.getItem('math_savedGame') || 'null') } catch { return null } }
  clearMath(): void { localStorage.removeItem('math_savedGame') }
  setLastOp(o: string): void { localStorage.setItem('math_lastOp', o) }
  getLastOp(): string | null { return localStorage.getItem('math_lastOp') }
  setLastRange(r: number): void { localStorage.setItem('math_lastRange', r.toString()) }
  getLastRange(): number | null { const r = localStorage.getItem('math_lastRange'); return r ? parseInt(r, 10) : null }

  savePuzzle(state: unknown): void { localStorage.setItem('puzzle_savedGame', JSON.stringify(state)) }
  getPuzzle(): unknown { try { return JSON.parse(localStorage.getItem('puzzle_savedGame') || 'null') } catch { return null } }
  clearPuzzle(): void { localStorage.removeItem('puzzle_savedGame') }
  setPuzzleLastPatternIndex(i: number): void { localStorage.setItem('puzzle_lastPatternIndex', i.toString()) }
  getPuzzleLastPatternIndex(): number | null { const s = localStorage.getItem('puzzle_lastPatternIndex'); return s ? parseInt(s, 10) : null }
  setPuzzleLastSize(s: number): void { localStorage.setItem('puzzle_lastSize', s.toString()) }
  getPuzzleLastSize(): number | null { const s = localStorage.getItem('puzzle_lastSize'); return s ? parseInt(s, 10) : null }

  // Memory
  setMemoryTheme(t: string): void { localStorage.setItem('memory_theme', t) }
  getMemoryTheme(): string | null { return localStorage.getItem('memory_theme') }
  setMemorySize(s: number): void { localStorage.setItem('memory_size', s.toString()) }
  getMemorySize(): number | null { const s = localStorage.getItem('memory_size'); return s ? parseInt(s, 10) : null }

  // Pattern
  setPatternTheme(t: string): void { localStorage.setItem('pattern_theme', t) }
  getPatternTheme(): string | null { return localStorage.getItem('pattern_theme') }
  setPatternSize(s: number): void { localStorage.setItem('pattern_size', s.toString()) }
  getPatternSize(): number | null { const s = localStorage.getItem('pattern_size'); return s ? parseInt(s, 10) : null }

  // Spot
  setSpotSize(s: number): void { localStorage.setItem('spot_size', s.toString()) }
  getSpotSize(): number | null { const s = localStorage.getItem('spot_size'); return s ? parseInt(s, 10) : null }

  // Maze
  setMazeSize(s: number): void { localStorage.setItem('maze_size', s.toString()) }
  getMazeSize(): number | null { const s = localStorage.getItem('maze_size'); return s ? parseInt(s, 10) : null }

  // Match
  setMatchTheme(t: string): void { localStorage.setItem('match_theme', t) }
  getMatchTheme(): string | null { return localStorage.getItem('match_theme') }
  setMatchSize(s: number): void { localStorage.setItem('match_size', s.toString()) }
  getMatchSize(): number | null { const s = localStorage.getItem('match_size'); return s ? parseInt(s, 10) : null }

  // Sort
  setSortTheme(t: string): void { localStorage.setItem('sort_theme', t) }
  getSortTheme(): string | null { return localStorage.getItem('sort_theme') }
  setSortSize(s: number): void { localStorage.setItem('sort_size', s.toString()) }
  getSortSize(): number | null { const s = localStorage.getItem('sort_size'); return s ? parseInt(s, 10) : null }
}
