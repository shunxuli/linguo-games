export type PieceType = 'large-tri' | 'medium-tri' | 'small-tri' | 'square' | 'parallelogram'

export interface TangramPiece {
  id: string
  type: PieceType
  vertices: number[][]
  color: string
  x: number
  y: number
  rotation: number
  flipped: boolean
}

// Piece shapes in local coordinates (centered at origin)
const S = 50
const M = 70.71
const L = 100

const PIECE_VERTICES: Record<PieceType, number[][]> = {
  'large-tri': [[-L/2,-L/2],[L/2,-L/2],[-L/2,L/2]],
  'medium-tri': [[-M/2,-M/2],[M/2,-M/2],[-M/2,M/2]],
  'small-tri': [[-S/2,-S/2],[S/2,-S/2],[-S/2,S/2]],
  'square': [[-S/2,-S/2],[S/2,-S/2],[S/2,S/2],[-S/2,S/2]],
  'parallelogram': [[-M/2,-S/2],[M/2,-S/2],[M,S/2],[0,S/2]],
}

const PIECE_COLORS: Record<PieceType, string[]> = {
  'large-tri': ['#E74C3C', '#3498DB'],
  'medium-tri': ['#2ECC71'],
  'small-tri': ['#F1C40F', '#9B59B6'],
  'square': ['#E67E22'],
  'parallelogram': ['#1ABC9C'],
}

export interface TangramTarget {
  name: string
  category: string
  image: string
  score: number
}

export const TANGRAM_CATEGORIES: Record<string, { name: string; score: number }> = {
  basic: { name: '基础', score: 10 },
  animal: { name: '动物', score: 20 },
  number: { name: '数字', score: 25 },
  letter: { name: '字母', score: 25 },
  zodiac: { name: '十二生肖', score: 30 },
}

export const TANGRAM_TARGETS: TangramTarget[] = [
  { name: '三角', category: 'basic', image: 'tangram/basic-三角.png', score: 10 },
  { name: '方形', category: 'basic', image: 'tangram/basic-方形.png', score: 10 },
  { name: '长方形', category: 'basic', image: 'tangram/basic-长方形.png', score: 10 },
  { name: '平行四边形', category: 'basic', image: 'tangram/basic-平行四边形.png', score: 10 },
  { name: '梯形', category: 'basic', image: 'tangram/basic-梯形.png', score: 10 },
  { name: '天鹅', category: 'animal', image: 'tangram/animal-天鹅.png', score: 20 },
  { name: '猫', category: 'animal', image: 'tangram/animal-猫.png', score: 20 },
  { name: '兔子', category: 'animal', image: 'tangram/animal-兔子.png', score: 20 },
  { name: '狐狸', category: 'animal', image: 'tangram/animal-狐狸.png', score: 20 },
  { name: '乌龟', category: 'animal', image: 'tangram/animal-乌龟.png', score: 20 },
  ...Array.from({ length: 10 }, (_, i) => ({ name: `数字${i}`, category: 'number', image: `tangram/number-${i}.png`, score: 25 })),
  ...'ABCDEFGH'.split('').map(c => ({ name: `字母${c}`, category: 'letter', image: `tangram/letter-${c}.png`, score: 25 })),
  ...['鼠','牛','虎','兔','龙','蛇','马','羊','猴','鸡','狗','猪'].map(z => ({ name: z, category: 'zodiac', image: `tangram/zodiac-${z}.png`, score: 30 })),
]

let pieceIdCounter = 0

export function createPiece(type: PieceType, colorIdx: number, x: number, y: number): TangramPiece {
  return {
    id: `${type}-${pieceIdCounter++}`,
    type,
    vertices: PIECE_VERTICES[type],
    color: PIECE_COLORS[type][colorIdx % PIECE_COLORS[type].length],
    x, y, rotation: 0, flipped: false,
  }
}

export function createAllPieces(): TangramPiece[] {
  pieceIdCounter = 0
  return [
    createPiece('large-tri', 0, 60, 300),
    createPiece('large-tri', 1, 140, 300),
    createPiece('medium-tri', 0, 100, 350),
    createPiece('small-tri', 0, 50, 400),
    createPiece('small-tri', 1, 150, 400),
    createPiece('square', 0, 100, 430),
    createPiece('parallelogram', 0, 100, 470),
  ]
}

export function rotateVertices(verts: number[][], rotation: number, flipped: boolean): number[][] {
  if (rotation === 0 && !flipped) return verts
  let result = [...verts.map(v => [...v])]
  if (flipped) result = result.map(([x, y]) => [-x, y])
  const angle = (rotation * Math.PI) / 4
  return result.map(([x, y]) => [x * Math.cos(angle) - y * Math.sin(angle), x * Math.sin(angle) + y * Math.cos(angle)])
}

export function getWorldVertices(piece: TangramPiece): number[][] {
  return rotateVertices(piece.vertices, piece.rotation, piece.flipped).map(([x, y]) => [x + piece.x, y + piece.y])
}

export function pointInPolygon(px: number, py: number, vertices: number[][]): boolean {
  let inside = false
  for (let i = 0, j = vertices.length - 1; i < vertices.length; j = i++) {
    const xi = vertices[i][0], yi = vertices[i][1]
    const xj = vertices[j][0], yj = vertices[j][1]
    if ((yi > py) !== (yj > py) && px < (xj - xi) * (py - yi) / (yj - yi) + xi) inside = !inside
  }
  return inside
}
