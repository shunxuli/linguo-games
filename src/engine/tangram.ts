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
  number: { name: '数字', score: 15 },
  shape: { name: '图形', score: 15 },
  animal: { name: '动物', score: 20 },
  building: { name: '建筑', score: 25 },
  vehicle: { name: '交通工具', score: 25 },
  object: { name: '常见物品', score: 20 },
}

export const TANGRAM_TARGETS: TangramTarget[] = [
  { name: '0', category: 'number', image: 'tangram/number-0.png', score: 15 },
  { name: '1', category: 'number', image: 'tangram/number-1.png', score: 15 },
  { name: '2', category: 'number', image: 'tangram/number-2.png', score: 15 },
  { name: '3', category: 'number', image: 'tangram/number-3.png', score: 15 },
  { name: '4', category: 'number', image: 'tangram/number-4.png', score: 15 },
  { name: '5', category: 'number', image: 'tangram/number-5.png', score: 15 },
  { name: '6', category: 'number', image: 'tangram/number-6.png', score: 15 },
  { name: '7', category: 'number', image: 'tangram/number-7.png', score: 15 },
  { name: '8', category: 'number', image: 'tangram/number-8.png', score: 15 },
  { name: '9', category: 'number', image: 'tangram/number-9.png', score: 15 },
  { name: '正方形', category: 'shape', image: 'tangram/shape-square.png', score: 15 },
  { name: '三角形', category: 'shape', image: 'tangram/shape-triangle.png', score: 15 },
  { name: '长方形', category: 'shape', image: 'tangram/shape-rectangle.png', score: 15 },
  { name: '猫', category: 'animal', image: 'tangram/animal-cat.png', score: 20 },
  { name: '天鹅', category: 'animal', image: 'tangram/animal-swan.png', score: 20 },
  { name: '鱼', category: 'animal', image: 'tangram/animal-fish.png', score: 20 },
  { name: '兔子', category: 'animal', image: 'tangram/animal-rabbit.png', score: 20 },
  { name: '狗', category: 'animal', image: 'tangram/animal-dog.png', score: 20 },
  { name: '乌龟', category: 'animal', image: 'tangram/animal-turtle.png', score: 20 },
  { name: '狐狸', category: 'animal', image: 'tangram/animal-fox.png', score: 20 },
  { name: '房子', category: 'building', image: 'tangram/building-house.png', score: 25 },
  { name: '桥', category: 'building', image: 'tangram/building-bridge.png', score: 25 },
  { name: '城堡', category: 'building', image: 'tangram/building-castle.png', score: 25 },
  { name: '帆船', category: 'vehicle', image: 'tangram/vehicle-boat.png', score: 25 },
  { name: '火箭', category: 'vehicle', image: 'tangram/vehicle-rocket.png', score: 25 },
  { name: '飞机', category: 'vehicle', image: 'tangram/vehicle-plane.png', score: 25 },
  { name: '爱心', category: 'object', image: 'tangram/object-heart.png', score: 20 },
  { name: '蜡烛', category: 'object', image: 'tangram/object-candle.png', score: 20 },
  { name: '箭头', category: 'object', image: 'tangram/object-arrow.png', score: 20 },
  { name: '松树', category: 'object', image: 'tangram/object-pine.png', score: 20 },
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
