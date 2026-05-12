export interface SpotQuestion {
  items: Array<{ emoji: string; label: string }>
  oddIndex: number
  reason: string
}

const animalItems = [
  { emoji: '🐼', label: '熊猫', cat: 'animal' },
  { emoji: '🐱', label: '小猫', cat: 'animal' },
  { emoji: '🐶', label: '小狗', cat: 'animal' },
  { emoji: '🐰', label: '兔子', cat: 'animal' },
  { emoji: '🐸', label: '青蛙', cat: 'animal' },
  { emoji: '🐥', label: '小鸡', cat: 'animal' },
  { emoji: '🐮', label: '奶牛', cat: 'animal' },
  { emoji: '🦁', label: '狮子', cat: 'animal' },
]
const fruitItems = [
  { emoji: '🍎', label: '苹果', cat: 'fruit' },
  { emoji: '🍊', label: '橘子', cat: 'fruit' },
  { emoji: '🍌', label: '香蕉', cat: 'fruit' },
  { emoji: '🥝', label: '猕猴桃', cat: 'fruit' },
  { emoji: '🍇', label: '葡萄', cat: 'fruit' },
  { emoji: '🍓', label: '草莓', cat: 'fruit' },
  { emoji: '🍑', label: '桃子', cat: 'fruit' },
  { emoji: '🍒', label: '樱桃', cat: 'fruit' },
]
const vehicleItems = [
  { emoji: '🚗', label: '汽车', cat: 'vehicle' },
  { emoji: '🚌', label: '巴士', cat: 'vehicle' },
  { emoji: '🚲', label: '自行车', cat: 'vehicle' },
  { emoji: '✈️', label: '飞机', cat: 'vehicle' },
  { emoji: '🚢', label: '轮船', cat: 'vehicle' },
  { emoji: '🚁', label: '直升机', cat: 'vehicle' },
]
const colorItems = [
  { emoji: '🔴', label: '红色', cat: 'warm' },
  { emoji: '🟠', label: '橙色', cat: 'warm' },
  { emoji: '🟡', label: '黄色', cat: 'warm' },
  { emoji: '🔵', label: '蓝色', cat: 'cool' },
  { emoji: '🟢', label: '绿色', cat: 'cool' },
  { emoji: '🟣', label: '紫色', cat: 'cool' },
]
const shapeItems = [
  { emoji: '●', label: '圆形', cat: 'round' },
  { emoji: '⬤', label: '大圆', cat: 'round' },
  { emoji: '◉', label: '靶心', cat: 'round' },
  { emoji: '▲', label: '三角形', cat: 'pointy' },
  { emoji: '■', label: '方形', cat: 'square' },
  { emoji: '□', label: '空心方', cat: 'square' },
]

const spotThemes: Record<number, Array<Array<typeof animalItems>>> = {
  2: [
    [animalItems, fruitItems],   // animal vs fruit
    [colorItems.slice(0, 3), colorItems.slice(3, 6)],  // warm vs cool
    [shapeItems.slice(0, 3), shapeItems.slice(3, 6)],  // round vs pointy
  ],
  4: [
    [animalItems, fruitItems, animalItems],  // 1 fruit among animals
    [fruitItems, animalItems, fruitItems],
    [vehicleItems, vehicleItems, fruitItems.slice(0, 2)], // 1 fruit among vehicles
  ],
  6: [
    [animalItems, fruitItems, vehicleItems, vehicleItems],
    [colorItems, shapeItems, colorItems],
  ],
}

export const spotSizes: Record<number, { name: string; score: number }> = {
  2: { name: '入门', score: 10 },
  4: { name: '简单', score: 20 },
  6: { name: '困难', score: 50 },
}

export function generateSpotQuestion(difficulty: number, prng: () => number = Math.random): SpotQuestion {
  let themeSets = spotThemes[difficulty]
  if (!themeSets) themeSets = spotThemes[2]
  const set = themeSets[Math.floor(prng() * themeSets.length)]

  // Pick 1 odd item from a different category
  const oddGroup = set[Math.floor(prng() * (set.length - 1))]
  const odd = oddGroup[Math.floor(prng() * oddGroup.length)]

  // Pick normal items from the first group
  const normalGroup = set[0]
  const normalCount = difficulty <= 2 ? 3 : difficulty + 1
  const normals = normalGroup
    .filter(item => item.cat !== odd.cat)
    .slice(0, normalCount)

  // Insert odd at random position
  const totalCount = normals.length + 1
  const oddIndex = Math.floor(prng() * totalCount)
  const items = [...normals]
  items.splice(oddIndex, 0, odd)

  return {
    items: items.slice(0, difficulty + 2),
    oddIndex: oddIndex < (difficulty + 2) ? oddIndex : 0,
    reason: `其他都是${normals[0]?.cat === 'animal' ? '动物' : normals[0]?.cat === 'fruit' ? '水果' : normals[0]?.cat === 'vehicle' ? '交通工具' : normals[0]?.cat === 'warm' ? '暖色' : normals[0]?.cat === 'cool' ? '冷色' : normals[0]?.cat === 'round' ? '圆形' : normals[0]?.cat === 'square' ? '方形' : '同类'}！`,
  }
}

// Simplified for stable question generation
export function generateSimpleSpotQuestion(difficulty: number): SpotQuestion {
  const groups = [
    [
      { emoji: '🐼', label: '熊猫' },
      { emoji: '🐱', label: '小猫' },
      { emoji: '🐶', label: '小狗' },
      { emoji: '🐰', label: '兔子' },
    ],
    [
      { emoji: '🍎', label: '苹果' },
      { emoji: '🍊', label: '橘子' },
      { emoji: '🍌', label: '香蕉' },
      { emoji: '🍓', label: '草莓' },
    ],
    [
      { emoji: '🚗', label: '汽车' },
      { emoji: '🚌', label: '巴士' },
      { emoji: '🚲', label: '自行车' },
      { emoji: '✈️', label: '飞机' },
    ],
    [
      { emoji: '🔴', label: '红色' },
      { emoji: '🟠', label: '橙色' },
      { emoji: '🟡', label: '黄色' },
      { emoji: '🟢', label: '绿色' },
    ],
  ]
  const normalGroup = groups[0]
  const oddGroup = groups[1]
  const odd = oddGroup[0]
  const count = Math.min(difficulty + 2, 6)
  const normals = normalGroup.slice(0, count - 1)
  const oddIndex = Math.floor(Math.random() * count)
  const items = [...normals]
  items.splice(oddIndex, 0, odd)
  return { items, oddIndex, reason: '其他都是动物！' }
}
