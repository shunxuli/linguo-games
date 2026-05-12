export interface SpotQuestion {
  items: Array<{ emoji: string; label: string }>
  oddIndex: number
  reason: string
}

const animalItems = [
  { emoji: '🐼', label: '熊猫', cat: '动物' },
  { emoji: '🐱', label: '小猫', cat: '动物' },
  { emoji: '🐶', label: '小狗', cat: '动物' },
  { emoji: '🐰', label: '兔子', cat: '动物' },
  { emoji: '🐸', label: '青蛙', cat: '动物' },
  { emoji: '🐥', label: '小鸡', cat: '动物' },
  { emoji: '🐮', label: '奶牛', cat: '动物' },
  { emoji: '🦁', label: '狮子', cat: '动物' },
  { emoji: '🐵', label: '猴子', cat: '动物' },
  { emoji: '🦊', label: '狐狸', cat: '动物' },
]
const fruitItems = [
  { emoji: '🍎', label: '苹果', cat: '水果' },
  { emoji: '🍊', label: '橘子', cat: '水果' },
  { emoji: '🍌', label: '香蕉', cat: '水果' },
  { emoji: '🥝', label: '猕猴桃', cat: '水果' },
  { emoji: '🍇', label: '葡萄', cat: '水果' },
  { emoji: '🍓', label: '草莓', cat: '水果' },
  { emoji: '🍑', label: '桃子', cat: '水果' },
  { emoji: '🍒', label: '樱桃', cat: '水果' },
  { emoji: '🍉', label: '西瓜', cat: '水果' },
  { emoji: '🍋', label: '柠檬', cat: '水果' },
]
const vehicleItems = [
  { emoji: '🚗', label: '汽车', cat: '交通工具' },
  { emoji: '🚌', label: '巴士', cat: '交通工具' },
  { emoji: '🚲', label: '自行车', cat: '交通工具' },
  { emoji: '✈️', label: '飞机', cat: '交通工具' },
  { emoji: '🚢', label: '轮船', cat: '交通工具' },
  { emoji: '🚁', label: '直升机', cat: '交通工具' },
  { emoji: '🚂', label: '火车', cat: '交通工具' },
  { emoji: '🛵', label: '摩托车', cat: '交通工具' },
  { emoji: '⛵', label: '帆船', cat: '交通工具' },
  { emoji: '🚀', label: '火箭', cat: '交通工具' },
]
const weatherItems = [
  { emoji: '☀️', label: '太阳', cat: '天气' },
  { emoji: '🌧️', label: '下雨', cat: '天气' },
  { emoji: '⛈️', label: '雷雨', cat: '天气' },
  { emoji: '❄️', label: '下雪', cat: '天气' },
  { emoji: '🌪️', label: '龙卷风', cat: '天气' },
  { emoji: '🌈', label: '彩虹', cat: '天气' },
  { emoji: '☁️', label: '多云', cat: '天气' },
]
const plantItems = [
  { emoji: '🌲', label: '松树', cat: '植物' },
  { emoji: '🌵', label: '仙人掌', cat: '植物' },
  { emoji: '🎄', label: '圣诞树', cat: '植物' },
  { emoji: '🌻', label: '向日葵', cat: '植物' },
  { emoji: '🌹', label: '玫瑰', cat: '植物' },
  { emoji: '🌸', label: '樱花', cat: '植物' },
  { emoji: '🍀', label: '四叶草', cat: '植物' },
]

// Pre-defined question templates for guaranteed variety
const questionTemplates: Array<{ normal: typeof animalItems; odd: typeof animalItems }> = [
  { normal: animalItems, odd: fruitItems },
  { normal: fruitItems, odd: animalItems },
  { normal: animalItems, odd: vehicleItems },
  { normal: vehicleItems, odd: animalItems },
  { normal: fruitItems, odd: vehicleItems },
  { normal: vehicleItems, odd: fruitItems },
  { normal: animalItems, odd: weatherItems },
  { normal: weatherItems, odd: animalItems },
  { normal: fruitItems, odd: plantItems },
  { normal: plantItems, odd: fruitItems },
  { normal: vehicleItems, odd: weatherItems },
  { normal: weatherItems, odd: vehicleItems },
  { normal: animalItems, odd: plantItems },
  { normal: plantItems, odd: animalItems },
  { normal: weatherItems, odd: plantItems },
  { normal: plantItems, odd: weatherItems },
]

export const spotSizes: Record<number, { name: string; score: number }> = {
  2: { name: '入门', score: 10 },
  4: { name: '简单', score: 20 },
  6: { name: '困难', score: 50 },
}

export function generateSpotQuestion(
  difficulty: number,
  prng: () => number = Math.random,
): SpotQuestion {
  const count = Math.min(difficulty + 2, 6)
  const templateIdx = Math.floor(prng() * questionTemplates.length)
  const template = questionTemplates[templateIdx]

  // Shuffle normal items and pick count-1
  const shuffledNormals = [...template.normal]
  for (let i = shuffledNormals.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [shuffledNormals[i], shuffledNormals[j]] = [shuffledNormals[j], shuffledNormals[i]]
  }
  const normals = shuffledNormals.slice(0, count - 1)

  // Pick a random odd item
  const oddIdx = Math.floor(prng() * template.odd.length)
  const odd = template.odd[oddIdx]

  // Insert at random position
  const oddPos = Math.floor(prng() * count)
  const items = [...normals]
  items.splice(oddPos, 0, odd)

  return {
    items,
    oddIndex: oddPos,
    reason: `其他都是${normals[0]?.cat}！`,
  }
}
