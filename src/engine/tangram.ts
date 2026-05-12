export type PieceType = 'large-tri' | 'medium-tri' | 'small-tri' | 'square' | 'parallelogram'

export interface TangramPiece {
  id: string
  type: PieceType
  vertices: number[][]  // local coords, centered at 0,0
  color: string
  x: number
  y: number
  rotation: number  // 0-7 (×45°)
  flipped: boolean
  snapped: boolean
}

export interface TargetPiece {
  type: PieceType
  x: number
  y: number
  rotation: number
  flipped: boolean
}

export interface TargetPattern {
  name: string
  difficulty: 'geometry' | 'animal' | 'people'
  pieces: TargetPiece[]
}

// Piece shapes in local coordinates (centered at origin)
const S = 50   // small triangle leg
const M = 70.71 // medium leg ≈ S√2
const L = 100  // large leg

const PIECE_VERTICES: Record<PieceType, number[][]> = {
  'large-tri': [[-L/2,-L/2],[L/2,-L/2],[-L/2,L/2]],
  'medium-tri': [[-M/2,-M/2],[M/2,-M/2],[-M/2,M/2]],
  'small-tri': [[-S/2,-S/2],[S/2,-S/2],[-S/2,S/2]],
  'square': [[-S/2,-S/2],[S/2,-S/2],[S/2,S/2],[-S/2,S/2]],
  'parallelogram': [[-M/2,-S/2],[M/2,-S/2],[M, S/2],[0, S/2]],
}

const PIECE_COLORS: Record<PieceType, string[]> = {
  'large-tri': ['#E74C3C', '#3498DB'],
  'medium-tri': ['#2ECC71'],
  'small-tri': ['#F1C40F', '#9B59B6'],
  'square': ['#E67E22'],
  'parallelogram': ['#1ABC9C'],
}

export const TANGRAM_DIFFICULTIES: Record<string, { name: string; score: number }> = {
  geometry: { name: '几何图形', score: 15 },
  animal: { name: '动物', score: 30 },
  people: { name: '人物建筑', score: 50 },
}

export const TARGET_PATTERNS: TargetPattern[] = [
  // Geometry (入门) - full square assembled from 7 pieces
  { name: '正方形', difficulty: 'geometry', pieces: [
    { type: 'large-tri', x: 150, y: 50, rotation: 2, flipped: false },
    { type: 'large-tri', x: 50, y: 150, rotation: 6, flipped: false },
    { type: 'medium-tri', x: 50, y: 50, rotation: 0, flipped: false },
    { type: 'small-tri', x: 100, y: 100, rotation: 4, flipped: false },
    { type: 'small-tri', x: 50, y: 100, rotation: 2, flipped: false },
    { type: 'square', x: 100, y: 50, rotation: 0, flipped: false },
    { type: 'parallelogram', x: 150, y: 100, rotation: 0, flipped: false },
  ]},
  { name: '长方形', difficulty: 'geometry', pieces: [
    { type: 'large-tri', x: 25, y: 50, rotation: 1, flipped: false },
    { type: 'large-tri', x: 175, y: 50, rotation: 3, flipped: false },
    { type: 'medium-tri', x: 50, y: 125, rotation: 0, flipped: false },
    { type: 'small-tri', x: 125, y: 75, rotation: 0, flipped: false },
    { type: 'small-tri', x: 150, y: 125, rotation: 2, flipped: false },
    { type: 'square', x: 75, y: 75, rotation: 1, flipped: false },
    { type: 'parallelogram', x: 100, y: 150, rotation: 0, flipped: true },
  ]},
  { name: '大三角', difficulty: 'geometry', pieces: [
    { type: 'large-tri', x: 50, y: 50, rotation: 0, flipped: false },
    { type: 'large-tri', x: 50, y: 100, rotation: 2, flipped: false },
    { type: 'medium-tri', x: 100, y: 50, rotation: 0, flipped: false },
    { type: 'small-tri', x: 75, y: 75, rotation: 4, flipped: false },
    { type: 'small-tri', x: 100, y: 100, rotation: 2, flipped: false },
    { type: 'square', x: 125, y: 125, rotation: 1, flipped: false },
    { type: 'parallelogram', x: 150, y: 50, rotation: 0, flipped: false },
  ]},
  // Animals (简单)
  { name: '猫', difficulty: 'animal', pieces: [
    { type: 'large-tri', x: 100, y: 30, rotation: 0, flipped: false },
    { type: 'large-tri', x: 60, y: 100, rotation: 4, flipped: false },
    { type: 'medium-tri', x: 140, y: 60, rotation: 6, flipped: false },
    { type: 'small-tri', x: 80, y: 50, rotation: 0, flipped: false },
    { type: 'small-tri', x: 120, y: 130, rotation: 2, flipped: false },
    { type: 'square', x: 40, y: 50, rotation: 0, flipped: false },
    { type: 'parallelogram', x: 160, y: 130, rotation: 0, flipped: false },
  ]},
  { name: '天鹅', difficulty: 'animal', pieces: [
    { type: 'large-tri', x: 50, y: 50, rotation: 1, flipped: false },
    { type: 'large-tri', x: 150, y: 80, rotation: 5, flipped: false },
    { type: 'medium-tri', x: 100, y: 30, rotation: 0, flipped: false },
    { type: 'small-tri', x: 70, y: 120, rotation: 3, flipped: false },
    { type: 'small-tri', x: 130, y: 40, rotation: 0, flipped: false },
    { type: 'square', x: 100, y: 100, rotation: 2, flipped: false },
    { type: 'parallelogram', x: 50, y: 150, rotation: 7, flipped: true },
  ]},
  { name: '鱼', difficulty: 'animal', pieces: [
    { type: 'large-tri', x: 50, y: 80, rotation: 4, flipped: false },
    { type: 'large-tri', x: 150, y: 50, rotation: 3, flipped: false },
    { type: 'medium-tri', x: 100, y: 40, rotation: 5, flipped: false },
    { type: 'small-tri', x: 130, y: 100, rotation: 7, flipped: false },
    { type: 'small-tri', x: 60, y: 50, rotation: 1, flipped: false },
    { type: 'square', x: 110, y: 130, rotation: 0, flipped: false },
    { type: 'parallelogram', x: 70, y: 130, rotation: 3, flipped: true },
  ]},
  { name: '兔子', difficulty: 'animal', pieces: [
    { type: 'large-tri', x: 50, y: 40, rotation: 0, flipped: false },
    { type: 'large-tri', x: 150, y: 60, rotation: 6, flipped: false },
    { type: 'medium-tri', x: 60, y: 120, rotation: 2, flipped: false },
    { type: 'small-tri', x: 40, y: 70, rotation: 4, flipped: false },
    { type: 'small-tri', x: 120, y: 50, rotation: 0, flipped: false },
    { type: 'square', x: 130, y: 130, rotation: 1, flipped: false },
    { type: 'parallelogram', x: 80, y: 150, rotation: 0, flipped: false },
  ]},
  // People (困难)
  { name: '跑步者', difficulty: 'people', pieces: [
    { type: 'large-tri', x: 50, y: 30, rotation: 5, flipped: false },
    { type: 'large-tri', x: 140, y: 100, rotation: 2, flipped: false },
    { type: 'medium-tri', x: 80, y: 70, rotation: 3, flipped: false },
    { type: 'small-tri', x: 50, y: 100, rotation: 0, flipped: false },
    { type: 'small-tri', x: 120, y: 40, rotation: 7, flipped: false },
    { type: 'square', x: 100, y: 120, rotation: 1, flipped: false },
    { type: 'parallelogram', x: 60, y: 150, rotation: 6, flipped: true },
  ]},
  { name: '房子', difficulty: 'people', pieces: [
    { type: 'large-tri', x: 100, y: 30, rotation: 0, flipped: false },
    { type: 'large-tri', x: 100, y: 100, rotation: 6, flipped: false },
    { type: 'medium-tri', x: 50, y: 80, rotation: 4, flipped: false },
    { type: 'small-tri', x: 50, y: 40, rotation: 2, flipped: false },
    { type: 'small-tri', x: 150, y: 60, rotation: 0, flipped: false },
    { type: 'square', x: 100, y: 150, rotation: 1, flipped: false },
    { type: 'parallelogram', x: 50, y: 130, rotation: 0, flipped: false },
  ]},
]

let pieceIdCounter = 0

export function createPiece(type: PieceType, colorIdx: number, x: number, y: number): TangramPiece {
  return {
    id: `${type}-${pieceIdCounter++}`,
    type,
    vertices: PIECE_VERTICES[type],
    color: PIECE_COLORS[type][colorIdx % PIECE_COLORS[type].length],
    x, y,
    rotation: 0,
    flipped: false,
    snapped: false,
  }
}

export function createAllPieces(): TangramPiece[] {
  return [
    createPiece('large-tri', 0, 60, 300),
    createPiece('large-tri', 1, 140, 300),
    createPiece('medium-tri', 0, 100, 350),
    createPiece('small-tri', 0, 60, 380),
    createPiece('small-tri', 1, 140, 380),
    createPiece('square', 0, 100, 400),
    createPiece('parallelogram', 0, 100, 450),
  ]
}

export function rotateVertices(verts: number[][], rotation: number, flipped: boolean): number[][] {
  if (rotation === 0 && !flipped) return verts
  let result = [...verts.map(v => [...v])]
  if (flipped) result = result.map(([x, y]) => [-x, y])
  const angle = (rotation * Math.PI) / 4
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return result.map(([x, y]) => [
    x * cos - y * sin,
    x * sin + y * cos,
  ])
}

export function getWorldVertices(piece: TangramPiece): number[][] {
  const rotated = rotateVertices(piece.vertices, piece.rotation, piece.flipped)
  return rotated.map(([x, y]) => [x + piece.x, y + piece.y])
}

export function pointInPolygon(px: number, py: number, vertices: number[][]): boolean {
  let inside = false
  const n = vertices.length
  for (let i = 0, j = n - 1; i < n; j = i++) {
    const xi = vertices[i][0], yi = vertices[i][1]
    const xj = vertices[j][0], yj = vertices[j][1]
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) {
      inside = !inside
    }
  }
  return inside
}

export function checkSnap(
  piece: TangramPiece,
  target: TargetPattern,
  tolerance = 15,
): TargetPiece | null {
  for (const tp of target.pieces) {
    if (tp.type !== piece.type) continue
    if (tp.rotation !== piece.rotation) continue
    if (tp.flipped !== piece.flipped) continue
    const dx = piece.x - tp.x
    const dy = piece.y - tp.y
    if (Math.sqrt(dx * dx + dy * dy) < tolerance) {
      return tp
    }
  }
  return null
}

export function getUnsnappedTypes(pieces: TangramPiece[], target: TargetPattern): PieceType[] {
  const used = new Set<PieceType>()
  for (const p of pieces) {
    if (p.snapped) used.add(p.type)
  }
  const needed: PieceType[] = []
  for (const tp of target.pieces) {
    if (!used.has(tp.type)) needed.push(tp.type)
    else used.delete(tp.type)
  }
  return needed.concat([...used])
}
