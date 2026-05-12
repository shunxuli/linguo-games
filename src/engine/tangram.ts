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
  animal: { name: '动物', score: 15 },
  number: { name: '数字字母', score: 15 },
  object: { name: '物品箭头', score: 15 },
}

export const TANGRAM_TARGETS: TangramTarget[] = [
  // Animals
  { name: '兔子', category: 'animal', image: 'tangram/rabbit.png', score: 15 },
  { name: '天鹅', category: 'animal', image: 'tangram/swan.png', score: 15 },
  { name: '马', category: 'animal', image: 'tangram/horse.png', score: 15 },
  { name: '猫卧', category: 'animal', image: 'tangram/cat-lying.png', score: 15 },
  { name: '猫坐', category: 'animal', image: 'tangram/cat-sitting.png', score: 15 },
  { name: '猫跳', category: 'animal', image: 'tangram/cat-jumping.png', score: 15 },
  { name: '生气猫', category: 'animal', image: 'tangram/grumpy-cat.png', score: 15 },
  { name: '熊', category: 'animal', image: 'tangram/bear.png', score: 15 },
  { name: '骆驼', category: 'animal', image: 'tangram/camel.png', score: 15 },
  { name: '鸭子', category: 'animal', image: 'tangram/duck.png', score: 15 },
  { name: '公鸡', category: 'animal', image: 'tangram/rooster.png', score: 15 },
  { name: '秃鹫', category: 'animal', image: 'tangram/vulture.png', score: 15 },
  { name: '鲸鱼', category: 'animal', image: 'tangram/whale.png', score: 15 },
  { name: '海狮', category: 'animal', image: 'tangram/sea-lion.png', score: 15 },
  { name: '月鱼', category: 'animal', image: 'tangram/moonfish.png', score: 15 },
  { name: '狮子', category: 'animal', image: 'tangram/lion.png', score: 15 },
  { name: '天鹅2', category: 'animal', image: 'tangram/swan-2.png', score: 15 },
  // Numbers & Letters
  { name: '数字4', category: 'number', image: 'tangram/four.png', score: 15 },
  { name: '数字5', category: 'number', image: 'tangram/five.png', score: 15 },
  { name: '数字8', category: 'number', image: 'tangram/eight.png', score: 15 },
  { name: '字母B', category: 'number', image: 'tangram/letter-b.png', score: 15 },
  { name: '字母E', category: 'number', image: 'tangram/letter-e.png', score: 15 },
  { name: '字母F', category: 'number', image: 'tangram/letter-f.png', score: 15 },
  { name: '字母L', category: 'number', image: 'tangram/letter-l.png', score: 15 },
  { name: '字母S', category: 'number', image: 'tangram/letter-s.png', score: 15 },
  // Objects & Arrows
  { name: '箭头', category: 'object', image: 'tangram/arrow.png', score: 15 },
  { name: '箭头2', category: 'object', image: 'tangram/arrow-2.png', score: 15 },
  { name: '箭头3', category: 'object', image: 'tangram/arrow-3.png', score: 15 },
  { name: '箭头4', category: 'object', image: 'tangram/arrow-4.png', score: 15 },
  { name: '箭头5', category: 'object', image: 'tangram/arrow-5.png', score: 15 },
  { name: '感叹号', category: 'object', image: 'tangram/exclamation-mark.png', score: 15 },
  { name: '三角形', category: 'object', image: 'tangram/triangle.png', score: 15 },
  // People
  { name: '滑冰者', category: 'object', image: 'tangram/skater.png', score: 15 },
  { name: '骑车人', category: 'object', image: 'tangram/cyclist.png', score: 15 },
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
