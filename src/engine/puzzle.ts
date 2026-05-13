export interface Pattern {
  id: number
  name: string
  type: string
  dir?: string
  colors?: string[]
  bg?: string | string[]
  style?: string
  elements?: string
  shape?: string
  density?: string
}

export interface PuzzlePiece {
  correctRow: number
  correctCol: number
  correctIndex: number
  currentIndex: number
  image: string
  locked: boolean
}


export const PATTERNS: Pattern[] = [
  { id: 0, name: '彩虹条纹', type: 'stripes', dir: 'diagonal', colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'] },
  { id: 1, name: '蓝天白云', type: 'gradient', bg: ['#87CEEB', '#E0F7FA'], elements: 'clouds' },
  { id: 2, name: '小猫', type: 'custom', shape: 'cat' },
  { id: 3, name: '星空', type: 'gradient', bg: '#0D1B2A', elements: 'stars2' },
  { id: 4, name: '小鸟', type: 'custom', shape: 'bird' },
  { id: 5, name: '小狗', type: 'custom', shape: 'dog' },
  { id: 6, name: '小房子', type: 'custom', shape: 'house' },
  { id: 7, name: '螺旋迷宫', type: 'radial', style: 'spiral', colors: ['#6C5CE7', '#A29BFE'] },
  { id: 8, name: '锯齿山脉', type: 'waves', style: 'zigzag', colors: ['#228B22', '#8B4513', '#87CEEB'] },
  { id: 9, name: '放射光芒', type: 'radial', style: 'rays', colors: ['#FFD700', '#FF8C00'] },
  { id: 10, name: '小雨伞', type: 'custom', shape: 'umbrella' },
  { id: 11, name: '礼物盒', type: 'custom', shape: 'gift' },
  { id: 12, name: '小蜡烛', type: 'custom', shape: 'candle' },
  { id: 13, name: '小雪人', type: 'custom', shape: 'snowman' },
  { id: 14, name: '苹果树', type: 'custom', shape: 'appletree' },
  { id: 15, name: '西瓜切片', type: 'custom', shape: 'watermelon' },
  { id: 16, name: '橙子切片', type: 'custom', shape: 'orange' },
  { id: 17, name: '柠檬切片', type: 'custom', shape: 'lemon' },
  { id: 18, name: '大草莓', type: 'custom', shape: 'strawberry' },
  { id: 19, name: '小鱼', type: 'custom', shape: 'fish' },
  { id: 20, name: '蝴蝶', type: 'custom', shape: 'butterfly' },
  { id: 21, name: '金鱼', type: 'custom', shape: 'goldfish' },
  { id: 22, name: '蜜蜂', type: 'custom', shape: 'bee' },
  { id: 23, name: '城堡', type: 'custom', shape: 'castle' },
  { id: 24, name: '斑马', type: 'custom', shape: 'zebra' },
  { id: 25, name: '豹子', type: 'custom', shape: 'leopard' },
  { id: 26, name: '奶牛', type: 'custom', shape: 'cow' },
  { id: 27, name: '孔雀', type: 'custom', shape: 'peacock' },
  { id: 28, name: '彩虹漩涡', type: 'radial', style: 'swirl', colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'] },
  { id: 29, name: '紫色梦境', type: 'gradient', bg: ['#E6E6FA', '#DDA0DD'], elements: 'stars' },
  { id: 30, name: '风筝', type: 'custom', shape: 'kite' },
  { id: 31, name: '月兔', type: 'custom', shape: 'moonrabbit' },
]

export function drawPattern(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pattern: Pattern,
  prng: () => number = Math.random,
): void {
  if (pattern.bg) {
    const bg = pattern.bg
    if (Array.isArray(bg)) {
      const grad = ctx.createLinearGradient(0, 0, 0, h)
      bg.forEach((c, i) => grad.addColorStop(i / (bg.length - 1), c))
      ctx.fillStyle = grad
    } else {
      ctx.fillStyle = bg
    }
    ctx.fillRect(0, 0, w, h)
  } else {
    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, w, h)
  }

  switch (pattern.type) {
    case 'stripes':
      drawStripes(ctx, w, h, pattern)
      break
    case 'dots':
      drawDots(ctx, w, h, pattern)
      break
    case 'grid':
      drawGrid(ctx, w, h, pattern)
      break
    case 'radial':
      drawRadial(ctx, w, h, pattern)
      break
    case 'waves':
      drawWaves(ctx, w, h, pattern, prng)
      break
    case 'organic':
      drawOrganic(ctx, w, h, pattern, prng)
      break
    case 'gradient':
      drawGradientElements(ctx, w, h, pattern, prng)
      break
    case 'custom':
      drawCustom(ctx, w, h, pattern, prng)
      break
  }
}

export function drawStripes(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pattern: Pattern,
  _prng?: () => number,
): void {
  const colors = pattern.colors || ['#000000', '#FFFFFF']
  const dir = pattern.dir || 'diagonal'
  const count = colors.length

  if (dir === 'diagonal') {
    ctx.save()
    ctx.translate(w / 2, h / 2)
    ctx.rotate(Math.PI / 4)
    const diag = Math.sqrt(w * w + h * h)
    const stripeSize = (diag * 2) / count
    for (let i = -count; i < count * 2; i++) {
      ctx.fillStyle = colors[((i % count) + count) % count]
      ctx.fillRect(-diag, -diag + i * stripeSize, diag * 3, stripeSize)
    }
    ctx.restore()
  } else if (dir === 'vertical') {
    const stripeW = w / count
    for (let i = 0; i < count; i++) {
      ctx.fillStyle = colors[i]
      ctx.fillRect(i * stripeW, 0, stripeW + 1, h)
    }
    for (let i = count; i * stripeW < w; i++) {
      ctx.fillStyle = colors[i % count]
      ctx.fillRect(i * stripeW, 0, stripeW + 1, h)
    }
  } else {
    const stripeH = h / count
    for (let i = 0; i < count; i++) {
      ctx.fillStyle = colors[i]
      ctx.fillRect(0, i * stripeH, w, stripeH + 1)
    }
    for (let i = count; i * stripeH < h; i++) {
      ctx.fillStyle = colors[i % count]
      ctx.fillRect(0, i * stripeH, w, stripeH + 1)
    }
  }
}

export function drawDots(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pattern: Pattern,
  _prng?: () => number,
): void {
  const colors = pattern.colors || ['#000000', '#FFFFFF']
  const density = pattern.density || 'medium'
  const spacing = density === 'dense' ? 35 : density === 'sparse' ? 70 : 50
  const radius = density === 'dense' ? 12 : density === 'sparse' ? 10 : 14

  for (let y = 0; y < h + spacing; y += spacing) {
    for (let x = 0; x < w + spacing; x += spacing) {
      const offsetX = (Math.floor(y / spacing) % 2) * (spacing / 2)
      const px = x + offsetX
      const py = y
      const colorIdx = (Math.floor(px / spacing) + Math.floor(py / spacing)) % colors.length
      ctx.beginPath()
      ctx.arc(px, py, radius, 0, Math.PI * 2)
      ctx.fillStyle = colors[colorIdx]
      ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.3)'
      ctx.lineWidth = 1
      ctx.stroke()
    }
  }
}

export function drawGrid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pattern: Pattern,
  _prng?: () => number,
): void {
  const colors = pattern.colors || ['#000000', '#FFFFFF']
  const style = pattern.style || 'checker'

  if (style === 'checker') {
    const cols = 8
    const rows = 8
    const cellW = w / cols
    const cellH = h / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillStyle = colors[(r + c) % colors.length]
        ctx.fillRect(c * cellW, r * cellH, cellW + 1, cellH + 1)
      }
    }
  } else if (style === 'bricks') {
    const rows = 10
    const brickH = h / rows
    const brickW = w / 5
    for (let r = 0; r < rows; r++) {
      const offset = (r % 2) * (brickW / 2)
      for (let c = -1; c < 6; c++) {
        ctx.fillStyle = colors[(r + c) % colors.length]
        ctx.fillRect(c * brickW + offset, r * brickH, brickW - 2, brickH - 2)
      }
    }
  } else if (style === 'hex') {
    const hexSize = w / 7
    const hexW = hexSize * 1.732
    const hexH = hexSize * 1.5
    for (let row = 0; row < h / hexH + 2; row++) {
      for (let col = 0; col < w / hexW + 2; col++) {
        const x = col * hexW + (row % 2) * (hexW / 2)
        const y = row * hexH
        drawHexagon(ctx, x, y, hexSize, colors[(row + col) % colors.length])
      }
    }
  } else if (style === 'scales') {
    const scaleR = w / 9
    for (let row = 0; row < h / scaleR + 3; row++) {
      for (let col = 0; col < w / scaleR + 3; col++) {
        const x = col * scaleR * 1.7 + (row % 2) * scaleR * 0.85
        const y = row * scaleR * 1.4
        ctx.beginPath()
        ctx.arc(x, y, scaleR, Math.PI, 0)
        ctx.fillStyle = colors[(row + col) % colors.length]
        ctx.fill()
        ctx.beginPath()
        ctx.arc(x, y, scaleR, Math.PI, 0)
        ctx.strokeStyle = 'rgba(0,0,0,0.1)'
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }
  }
}

export function drawRadial(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pattern: Pattern,
  _prng?: () => number,
): void {
  const colors = pattern.colors || ['#000000', '#FFFFFF']
  const style = pattern.style || 'rays'
  const cx = w / 2
  const cy = h / 2

  if (style === 'rays') {
    const rays = 24
    for (let i = 0; i < rays; i++) {
      ctx.beginPath()
      ctx.moveTo(cx, cy)
      const angle = (i / rays) * Math.PI * 2
      const nextAngle = ((i + 1) / rays) * Math.PI * 2
      ctx.arc(cx, cy, Math.max(w, h) * 1.5, angle, nextAngle)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
    }
  } else if (style === 'spiral') {
    const maxR = Math.max(w, h) * 1.2
    const bands = 30
    const bandW = maxR / bands
    for (let i = 0; i < bands; i++) {
      ctx.beginPath()
      for (let a = 0; a < Math.PI * 10; a += 0.05) {
        const r = i * bandW + (a / (Math.PI * 10)) * bandW
        const x = cx + Math.cos(a + i * 0.3) * r
        const y = cy + Math.sin(a + i * 0.3) * r
        if (a === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = colors[i % colors.length]
      ctx.lineWidth = bandW * 0.9
      ctx.stroke()
    }
  } else if (style === 'swirl') {
    const maxR = Math.max(w, h)
    const steps = 150
    for (let i = 0; i < steps; i++) {
      const r = (i / steps) * maxR
      const angle = (i / steps) * Math.PI * 10
      ctx.beginPath()
      ctx.arc(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r, r * 0.12 + 4, 0, Math.PI * 2)
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
    }
  } else if (style === 'eye') {
    const rings = 12
    const maxR = Math.min(w, h) * 0.25
    const spacing = maxR * 2.2
    for (let row = 0; row < h / spacing + 2; row++) {
      for (let col = 0; col < w / spacing + 2; col++) {
        const x = col * spacing + (row % 2) * (spacing / 2)
        const y = row * spacing * 0.866
        for (let i = rings; i >= 0; i--) {
          ctx.beginPath()
          ctx.arc(x, y, (i / rings) * maxR, 0, Math.PI * 2)
          ctx.fillStyle = colors[i % colors.length]
          ctx.fill()
        }
      }
    }
  }
}

export function drawWaves(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pattern: Pattern,
  prng: () => number = Math.random,
): void {
  const colors = pattern.colors || ['#000000', '#FFFFFF']
  const style = pattern.style || 'wave'

  if (style === 'zigzag') {
    const bands = colors.length * 2
    const bandH = h / bands
    for (let b = 0; b < bands; b++) {
      ctx.beginPath()
      for (let x = 0; x <= w + 10; x += 8) {
        const y = b * bandH + bandH / 2 + Math.sin((x / w) * Math.PI * 6 + b) * bandH * 0.35
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.lineTo(w + 10, (b + 1) * bandH)
      ctx.lineTo(0, (b + 1) * bandH)
      ctx.closePath()
      ctx.fillStyle = colors[b % colors.length]
      ctx.fill()
    }
  } else if (style === 'flame') {
    const flames = 10
    const fw = w / flames
    for (let i = 0; i < flames; i++) {
      ctx.beginPath()
      ctx.moveTo(i * fw, h)
      const peakH = h * (0.3 + prng() * 0.3)
      ctx.quadraticCurveTo(i * fw + fw * 0.25, peakH, i * fw + fw * 0.5, h * 0.15)
      ctx.quadraticCurveTo(i * fw + fw * 0.75, peakH, (i + 1) * fw, h)
      ctx.closePath()
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
    }
    for (let i = 0; i < flames; i++) {
      ctx.beginPath()
      ctx.moveTo(i * fw + fw * 0.5, h)
      ctx.quadraticCurveTo(i * fw + fw * 0.75, h * 0.5, i * fw + fw, h * 0.2)
      ctx.quadraticCurveTo(i * fw + fw * 1.25, h * 0.5, (i + 1) * fw + fw * 0.5, h)
      ctx.closePath()
      ctx.fillStyle = colors[(i + 1) % colors.length]
      ctx.fill()
    }
  }
}

export function drawOrganic(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pattern: Pattern,
  prng: () => number = Math.random,
): void {
  const colors = pattern.colors || ['#000000', '#FFFFFF']
  const shape = pattern.shape

  if (shape === 'balloons') {
    const cols = 4
    const rows = 4
    const cellW = w / cols
    const cellH = h / rows
    let idx = 0
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW + cellW / 2
        const y = r * cellH + cellH / 2
        const radius = Math.min(cellW, cellH) * 0.35
        ctx.beginPath()
        ctx.ellipse(x, y, radius, radius * 1.15, 0, 0, Math.PI * 2)
        ctx.fillStyle = colors[idx % colors.length]
        ctx.fill()
        ctx.beginPath()
        ctx.ellipse(x - radius * 0.25, y - radius * 0.25, radius * 0.2, radius * 0.3, -0.5, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255,255,255,0.35)'
        ctx.fill()
        ctx.beginPath()
        ctx.moveTo(x, y + radius * 1.15)
        ctx.quadraticCurveTo(x + 4, y + radius * 1.5, x, y + radius * 1.8)
        ctx.strokeStyle = 'rgba(100,100,100,0.4)'
        ctx.lineWidth = 2
        ctx.stroke()
        idx++
      }
    }
  } else if (shape === 'raindrops') {
    const cols = 8
    const spacing = w / cols
    for (let row = 0; row < h / spacing + 2; row++) {
      for (let col = 0; col < cols + 1; col++) {
        const x = col * spacing + (row % 2) * (spacing / 2)
        const y = row * spacing
        const len = spacing * 0.5
        ctx.beginPath()
        ctx.moveTo(x, y)
        ctx.lineTo(x - 3, y + len)
        ctx.lineTo(x + 3, y + len)
        ctx.closePath()
        ctx.fillStyle = colors[(row + col) % colors.length]
        ctx.fill()
      }
    }
  } else if (shape === 'hearts') {
    const cols = 5
    const rows = 5
    const cellW = w / cols
    const cellH = h / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW + cellW / 2
        const y = r * cellH + cellH / 2
        const size = Math.min(cellW, cellH) * 0.35
        ctx.fillStyle = colors[(r + c) % colors.length]
        drawHeart(ctx, x, y, size)
      }
    }
  } else if (shape === 'snowflakes') {
    const cols = 5
    const rows = 5
    const cellW = w / cols
    const cellH = h / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW + cellW / 2
        const y = r * cellH + cellH / 2
        const size = Math.min(cellW, cellH) * 0.3
        drawSnowflake(ctx, x, y, size, colors[(r + c) % colors.length])
      }
    }
  } else if (shape === 'leaves') {
    const cols = 5
    const rows = 6
    const cellW = w / cols
    const cellH = h / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW + cellW / 2 + (prng() - 0.5) * 10
        const y = r * cellH + cellH / 2 + (prng() - 0.5) * 10
        const size = Math.min(cellW, cellH) * 0.3
        const angle = (r + c) * 0.5
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(angle)
        ctx.beginPath()
        ctx.ellipse(0, 0, size, size * 0.45, 0, 0, Math.PI * 2)
        ctx.fillStyle = colors[(r + c) % colors.length]
        ctx.fill()
        ctx.restore()
      }
    }
  } else if (shape === 'watermelon') {
    const cols = 2
    const rows = 2
    const cellW = w / cols
    const cellH = h / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * cellW + cellW / 2
        const cy = r * cellH + cellH * 0.55
        const rw = cellW * 0.4
        const rh = cellH * 0.35
        ctx.beginPath()
        ctx.ellipse(cx, cy, rw, rh, 0, Math.PI, 0)
        ctx.fillStyle = colors[1]
        ctx.fill()
        ctx.beginPath()
        ctx.ellipse(cx, cy, rw - 8, rh - 6, 0, Math.PI, 0)
        ctx.fillStyle = colors[0]
        ctx.fill()
        for (let i = 0; i < 6; i++) {
          const a = Math.PI + (i / 6) * Math.PI
          ctx.beginPath()
          ctx.arc(cx + Math.cos(a) * rw * 0.3, cy + Math.sin(a) * rh * 0.25, 2.5, 0, Math.PI * 2)
          ctx.fillStyle = colors[2]
          ctx.fill()
        }
      }
    }
  } else if (shape === 'orange' || shape === 'lemon') {
    const cols = 3
    const rows = 3
    const cellW = w / cols
    const cellH = h / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * cellW + cellW / 2
        const cy = r * cellH + cellH / 2
        const radius = Math.min(cellW, cellH) * 0.35
        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)
        ctx.fillStyle = colors[0]
        ctx.fill()
        for (let i = 0; i < 12; i++) {
          const a = (i / 12) * Math.PI * 2
          ctx.beginPath()
          ctx.moveTo(cx, cy)
          ctx.lineTo(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius)
          ctx.strokeStyle = colors[1] || colors[0]
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }
    }
  } else if (shape === 'strawberry') {
    const cols = 4
    const rows = 4
    const cellW = w / cols
    const cellH = h / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * cellW + cellW / 2
        const cy = r * cellH + cellH / 2
        const size = Math.min(cellW, cellH) * 0.3
        ctx.beginPath()
        ctx.ellipse(cx, cy, size, size * 1.2, 0, 0, Math.PI * 2)
        ctx.fillStyle = colors[0]
        ctx.fill()
        ctx.beginPath()
        ctx.ellipse(cx, cy - size, size * 0.5, size * 0.25, 0, 0, Math.PI * 2)
        ctx.fillStyle = colors[1]
        ctx.fill()
        for (let j = 0; j < 5; j++) {
          ctx.beginPath()
          ctx.arc(cx + Math.cos(j * 1.2) * size * 0.35, cy + Math.sin(j * 1.2) * size * 0.45, 1.5, 0, Math.PI * 2)
          ctx.fillStyle = '#FFD700'
          ctx.fill()
        }
      }
    }
  } else if (shape === 'butterfly') {
    const cols = 3
    const rows = 3
    const cellW = w / cols
    const cellH = h / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * cellW + cellW / 2
        const y = r * cellH + cellH / 2
        const s = Math.min(cellW, cellH) * 0.35
        drawButterfly(ctx, x, y, s, colors)
      }
    }
  } else if (shape === 'spots') {
    const cols = 5
    const rows = 6
    const cellW = w / cols
    const cellH = h / rows
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = c * cellW + cellW / 2 + (prng() - 0.5) * 15
        const cy = r * cellH + cellH / 2 + (prng() - 0.5) * 15
        const rx = cellW * 0.25 + prng() * 10
        const ry = cellH * 0.2 + prng() * 8
        ctx.beginPath()
        ctx.ellipse(cx, cy, rx, ry, prng() * Math.PI, 0, Math.PI * 2)
        ctx.fillStyle = colors[(r + c) % colors.length]
        ctx.fill()
      }
    }
  }
}

export function drawGradientElements(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pattern: Pattern,
  prng: () => number = Math.random,
): void {
  const colors = pattern.colors || ['#FFFFFF']
  const elements = pattern.elements

  if (elements === 'clouds') {
    const cloudData = [
      { x: 0.15, y: 0.15, r: 0.06 },
      { x: 0.4, y: 0.1, r: 0.08 },
      { x: 0.7, y: 0.18, r: 0.07 },
      { x: 0.9, y: 0.12, r: 0.05 },
      { x: 0.25, y: 0.4, r: 0.09 },
      { x: 0.6, y: 0.35, r: 0.07 },
      { x: 0.85, y: 0.42, r: 0.08 },
      { x: 0.1, y: 0.55, r: 0.07 },
      { x: 0.5, y: 0.55, r: 0.1 },
      { x: 0.75, y: 0.6, r: 0.06 },
      { x: 0.3, y: 0.75, r: 0.08 },
      { x: 0.65, y: 0.78, r: 0.07 },
      { x: 0.15, y: 0.9, r: 0.09 },
      { x: 0.45, y: 0.88, r: 0.06 },
      { x: 0.8, y: 0.9, r: 0.08 },
    ]
    cloudData.forEach((c) => {
      ctx.fillStyle = 'rgba(255,255,255,0.8)'
      ctx.beginPath()
      ctx.arc(c.x * w, c.y * h, c.r * w, 0, Math.PI * 2)
      ctx.arc(c.x * w + c.r * w * 0.5, c.y * h - c.r * w * 0.2, c.r * w * 1.1, 0, Math.PI * 2)
      ctx.arc(c.x * w - c.r * w * 0.4, c.y * h - c.r * w * 0.15, c.r * w * 0.85, 0, Math.PI * 2)
      ctx.fill()
    })
  } else if (elements === 'stars') {
    for (let i = 0; i < 80; i++) {
      const x = prng() * w
      const y = prng() * h
      const s = prng() * 3 + 1.5
      ctx.beginPath()
      ctx.arc(x, y, s, 0, Math.PI * 2)
      ctx.fillStyle = colors[i % colors.length]
      ctx.fill()
    }
  } else if (elements === 'stars2') {
    for (let i = 0; i < 50; i++) {
      const x = prng() * w
      const y = prng() * h
      const s = prng() * 2.5 + 1
      ctx.beginPath()
      ctx.arc(x, y, s, 0, Math.PI * 2)
      ctx.fillStyle = prng() > 0.7 ? '#FFD700' : '#FFFFFF'
      ctx.fill()
      if (prng() > 0.6) {
        ctx.strokeStyle = 'rgba(255,255,255,0.25)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x - s * 3, y)
        ctx.lineTo(x + s * 3, y)
        ctx.stroke()
        ctx.beginPath()
        ctx.moveTo(x, y - s * 3)
        ctx.lineTo(x, y + s * 3)
        ctx.stroke()
      }
    }
    ctx.beginPath()
    ctx.arc(w * 0.75, h * 0.2, w * 0.08, 0, Math.PI * 2)
    ctx.fillStyle = '#FFFACD'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(w * 0.78, h * 0.17, w * 0.06, 0, Math.PI * 2)
    ctx.fillStyle = '#0D1B2A'
    ctx.fill()
  }
}

export function drawHeart(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
): void {
  ctx.beginPath()
  ctx.moveTo(x, y + size / 4)
  ctx.bezierCurveTo(x, y, x - size / 2, y, x - size / 2, y + size / 4)
  ctx.bezierCurveTo(x - size / 2, y + size / 2, x, y + size * 0.75, x, y + size)
  ctx.bezierCurveTo(x, y + size * 0.75, x + size / 2, y + size / 2, x + size / 2, y + size / 4)
  ctx.bezierCurveTo(x + size / 2, y, x, y, x, y + size / 4)
  ctx.fill()
}

export function drawSnowflake(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  ctx.save()
  ctx.translate(x, y)
  ctx.strokeStyle = color
  ctx.lineWidth = 2
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(0, -size)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, -size * 0.5)
    ctx.lineTo(-size * 0.25, -size * 0.7)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(0, -size * 0.5)
    ctx.lineTo(size * 0.25, -size * 0.7)
    ctx.stroke()
    ctx.rotate(Math.PI / 3)
  }
  ctx.restore()
}

export function drawButterfly(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  colors: string[],
): void {
  ctx.save()
  ctx.translate(x, y)
  ctx.fillStyle = colors[0]
  ctx.beginPath()
  ctx.ellipse(-size * 0.5, -size * 0.25, size * 0.55, size * 0.4, -0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(-size * 0.5, size * 0.2, size * 0.35, size * 0.25, 0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = colors[1] || colors[0]
  ctx.beginPath()
  ctx.ellipse(size * 0.5, -size * 0.25, size * 0.55, size * 0.4, 0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(size * 0.5, size * 0.2, size * 0.35, size * 0.25, -0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = colors[2] || colors[0]
  ctx.beginPath()
  ctx.ellipse(0, 0, size * 0.08, size * 0.45, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

export function drawHexagon(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  color: string,
): void {
  ctx.beginPath()
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 6
    const hx = x + size * Math.cos(a)
    const hy = y + size * Math.sin(a)
    if (i === 0) ctx.moveTo(hx, hy)
    else ctx.lineTo(hx, hy)
  }
  ctx.closePath()
  ctx.fillStyle = color
  ctx.fill()
}

export function drawCustom(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  pattern: Pattern,
  prng: () => number = Math.random,
): void {
  switch (pattern.shape) {
    case 'cat':
      drawCustomCat(ctx, w, h)
      break
    case 'bird':
      drawCustomBird(ctx, w, h)
      break
    case 'dog':
      drawCustomDog(ctx, w, h)
      break
    case 'house':
      drawCustomHouse(ctx, w, h)
      break
    case 'umbrella':
      drawCustomUmbrella(ctx, w, h, prng)
      break
    case 'gift':
      drawCustomGift(ctx, w, h)
      break
    case 'candle':
      drawCustomCandle(ctx, w, h, prng)
      break
    case 'snowman':
      drawCustomSnowman(ctx, w, h, prng)
      break
    case 'appletree':
      drawCustomAppleTree(ctx, w, h)
      break
    case 'watermelon':
      drawCustomWatermelon(ctx, w, h)
      break
    case 'orange':
      drawCustomOrange(ctx, w, h)
      break
    case 'lemon':
      drawCustomLemon(ctx, w, h)
      break
    case 'strawberry':
      drawCustomStrawberry(ctx, w, h)
      break
    case 'fish':
      drawCustomFish(ctx, w, h, prng)
      break
    case 'butterfly':
      drawCustomButterfly(ctx, w, h)
      break
    case 'goldfish':
      drawCustomGoldfish(ctx, w, h, prng)
      break
    case 'bee':
      drawCustomBee(ctx, w, h, prng)
      break
    case 'castle':
      drawCustomCastle(ctx, w, h)
      break
    case 'zebra':
      drawCustomZebra(ctx, w, h)
      break
    case 'leopard':
      drawCustomLeopard(ctx, w, h, prng)
      break
    case 'cow':
      drawCustomCow(ctx, w, h, prng)
      break
    case 'peacock':
      drawCustomPeacock(ctx, w, h)
      break
    case 'kite':
      drawCustomKite(ctx, w, h)
      break
    case 'moonrabbit':
      drawCustomMoonRabbit(ctx, w, h)
      break
  }
}

export function drawCustomCat(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#FFF8DC'
  ctx.fillRect(0, 0, w, h)
  const cx = w * 0.5
  const cy = h * 0.55
  // body
  ctx.beginPath()
  ctx.ellipse(cx, cy + 15, 45, 55, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFA500'
  ctx.fill()
  // head
  ctx.beginPath()
  ctx.arc(cx, cy - 45, 38, 0, Math.PI * 2)
  ctx.fillStyle = '#FFA500'
  ctx.fill()
  // ears
  ctx.beginPath()
  ctx.moveTo(cx - 28, cy - 70)
  ctx.lineTo(cx - 38, cy - 95)
  ctx.lineTo(cx - 12, cy - 78)
  ctx.closePath()
  ctx.fillStyle = '#FFA500'
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx + 28, cy - 70)
  ctx.lineTo(cx + 38, cy - 95)
  ctx.lineTo(cx + 12, cy - 78)
  ctx.closePath()
  ctx.fillStyle = '#FFA500'
  ctx.fill()
  // inner ears
  ctx.beginPath()
  ctx.moveTo(cx - 26, cy - 72)
  ctx.lineTo(cx - 33, cy - 88)
  ctx.lineTo(cx - 16, cy - 78)
  ctx.closePath()
  ctx.fillStyle = '#FFB6C1'
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx + 26, cy - 72)
  ctx.lineTo(cx + 33, cy - 88)
  ctx.lineTo(cx + 16, cy - 78)
  ctx.closePath()
  ctx.fillStyle = '#FFB6C1'
  ctx.fill()
  // eyes
  ctx.beginPath()
  ctx.arc(cx - 12, cy - 50, 6, 0, Math.PI * 2)
  ctx.fillStyle = '#228B22'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 12, cy - 50, 6, 0, Math.PI * 2)
  ctx.fillStyle = '#228B22'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx - 12, cy - 52, 2.5, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 12, cy - 52, 2.5, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // nose
  ctx.beginPath()
  ctx.moveTo(cx, cy - 42)
  ctx.lineTo(cx - 4, cy - 36)
  ctx.lineTo(cx + 4, cy - 36)
  ctx.closePath()
  ctx.fillStyle = '#FF69B4'
  ctx.fill()
  // mouth
  ctx.beginPath()
  ctx.moveTo(cx, cy - 36)
  ctx.quadraticCurveTo(cx - 6, cy - 28, cx - 10, cy - 32)
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, cy - 36)
  ctx.quadraticCurveTo(cx + 6, cy - 28, cx + 10, cy - 32)
  ctx.stroke()
  // whiskers
  ctx.beginPath()
  ctx.moveTo(cx - 30, cy - 40)
  ctx.lineTo(cx - 50, cy - 42)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx - 30, cy - 35)
  ctx.lineTo(cx - 50, cy - 32)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 30, cy - 40)
  ctx.lineTo(cx + 50, cy - 42)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 30, cy - 35)
  ctx.lineTo(cx + 50, cy - 32)
  ctx.stroke()
  // forehead marking
  ctx.beginPath()
  ctx.moveTo(cx, cy - 75)
  ctx.lineTo(cx - 5, cy - 55)
  ctx.lineTo(cx + 5, cy - 55)
  ctx.closePath()
  ctx.fillStyle = '#FF8C00'
  ctx.fill()
  // tail
  ctx.beginPath()
  ctx.moveTo(cx + 40, cy + 20)
  ctx.quadraticCurveTo(cx + 70, cy - 10, cx + 55, cy - 40)
  ctx.strokeStyle = '#FFA500'
  ctx.lineWidth = 10
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx + 55, cy - 40, 6, 0, Math.PI * 2)
  ctx.fillStyle = '#FFA500'
  ctx.fill()
  // legs
  ctx.fillStyle = '#FFA500'
  ctx.fillRect(cx - 30, cy + 55, 12, 30)
  ctx.fillRect(cx - 8, cy + 55, 12, 30)
  ctx.fillRect(cx + 8, cy + 55, 12, 30)
  ctx.fillRect(cx + 30, cy + 55, 12, 30)
  // paws
  ctx.fillStyle = '#FFB6C1'
  ctx.beginPath()
  ctx.arc(cx - 24, cy + 88, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 36, cy + 88, 8, 0, Math.PI * 2)
  ctx.fill()
  drawSurroundings(ctx, w, h, 'cat', prng || Math.random)
}

export function drawCustomBird(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#E0F7FA'
  ctx.fillRect(0, 0, w, h)
  // clouds
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.beginPath()
  ctx.arc(w * 0.2, h * 0.2, 18, 0, Math.PI * 2)
  ctx.arc(w * 0.27, h * 0.17, 22, 0, Math.PI * 2)
  ctx.arc(w * 0.33, h * 0.2, 15, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(w * 0.75, h * 0.15, 15, 0, Math.PI * 2)
  ctx.arc(w * 0.8, h * 0.13, 18, 0, Math.PI * 2)
  ctx.arc(w * 0.85, h * 0.15, 14, 0, Math.PI * 2)
  ctx.fill()
  // sun
  ctx.beginPath()
  ctx.arc(w * 0.12, h * 0.15, 22, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  const cx = w * 0.5
  const cy = h * 0.45
  // body
  ctx.beginPath()
  ctx.ellipse(cx, cy, 50, 35, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#87CEEB'
  ctx.fill()
  // belly
  ctx.beginPath()
  ctx.ellipse(cx, cy + 8, 30, 22, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#E0F7FA'
  ctx.fill()
  // head
  ctx.beginPath()
  ctx.arc(cx + 35, cy - 20, 28, 0, Math.PI * 2)
  ctx.fillStyle = '#87CEEB'
  ctx.fill()
  // eye
  ctx.beginPath()
  ctx.arc(cx + 42, cy - 25, 5, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 44, cy - 25, 3, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // beak
  ctx.beginPath()
  ctx.moveTo(cx + 58, cy - 18)
  ctx.lineTo(cx + 68, cy - 14)
  ctx.lineTo(cx + 58, cy - 10)
  ctx.closePath()
  ctx.fillStyle = '#FF8C00'
  ctx.fill()
  // wing
  ctx.beginPath()
  ctx.ellipse(cx - 10, cy - 5, 35, 18, -0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#4682B4'
  ctx.fill()
  // tail
  ctx.beginPath()
  ctx.moveTo(cx - 45, cy + 5)
  ctx.lineTo(cx - 75, cy - 15)
  ctx.lineTo(cx - 70, cy + 10)
  ctx.closePath()
  ctx.fillStyle = '#4682B4'
  ctx.fill()
  // feet
  ctx.beginPath()
  ctx.moveTo(cx - 8, cy + 30)
  ctx.lineTo(cx - 12, cy + 48)
  ctx.strokeStyle = '#FF8C00'
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 8, cy + 30)
  ctx.lineTo(cx + 12, cy + 48)
  ctx.stroke()
  drawSurroundings(ctx, w, h, 'bird', prng || Math.random)
}

export function drawCustomDog(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#F5F5DC'
  ctx.fillRect(0, 0, w, h)
  const cx = w * 0.5
  const cy = h * 0.55
  // body
  ctx.beginPath()
  ctx.ellipse(cx, cy + 10, 50, 45, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#D2691E'
  ctx.fill()
  // head
  ctx.beginPath()
  ctx.ellipse(cx, cy - 40, 38, 42, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#D2691E'
  ctx.fill()
  // ears (floppy)
  ctx.beginPath()
  ctx.ellipse(cx - 32, cy - 40, 12, 22, -0.4, 0, Math.PI * 2)
  ctx.fillStyle = '#8B4513'
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 32, cy - 40, 12, 22, 0.4, 0, Math.PI * 2)
  ctx.fillStyle = '#8B4513'
  ctx.fill()
  // eyes
  ctx.beginPath()
  ctx.ellipse(cx - 14, cy - 48, 7, 9, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 14, cy - 48, 7, 9, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx - 12, cy - 48, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 16, cy - 48, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // nose
  ctx.beginPath()
  ctx.ellipse(cx, cy - 32, 9, 7, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // mouth
  ctx.beginPath()
  ctx.moveTo(cx, cy - 25)
  ctx.quadraticCurveTo(cx - 8, cy - 15, cx - 12, cy - 18)
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx, cy - 25)
  ctx.quadraticCurveTo(cx + 8, cy - 15, cx + 12, cy - 18)
  ctx.stroke()
  // tongue
  ctx.beginPath()
  ctx.arc(cx, cy - 15, 6, 0, Math.PI)
  ctx.fillStyle = '#FF69B4'
  ctx.fill()
  // collar
  ctx.beginPath()
  ctx.ellipse(cx, cy - 5, 38, 6, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FF0000'
  ctx.fill()
  // bell
  ctx.beginPath()
  ctx.arc(cx, cy + 5, 7, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  // legs
  ctx.fillStyle = '#D2691E'
  ctx.fillRect(cx - 35, cy + 40, 14, 35)
  ctx.fillRect(cx - 8, cy + 40, 14, 35)
  ctx.fillRect(cx + 8, cy + 40, 14, 35)
  ctx.fillRect(cx + 35, cy + 40, 14, 35)
  // tail (up)
  ctx.beginPath()
  ctx.moveTo(cx + 45, cy + 10)
  ctx.quadraticCurveTo(cx + 75, cy - 20, cx + 65, cy - 45)
  ctx.strokeStyle = '#D2691E'
  ctx.lineWidth = 10
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx + 65, cy - 45, 6, 0, Math.PI * 2)
  ctx.fillStyle = '#D2691E'
  ctx.fill()
  // grass
  ctx.fillStyle = '#90EE90'
  ctx.fillRect(0, h * 0.88, w, h * 0.12)
  drawSurroundings(ctx, w, h, 'dog', prng || Math.random)
}

export function drawCustomHouse(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(0, 0, w, h)
  // sun
  ctx.beginPath()
  ctx.arc(w * 0.85, h * 0.12, 25, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(w * 0.85 + Math.cos(a) * 30, h * 0.12 + Math.sin(a) * 30)
    ctx.lineTo(w * 0.85 + Math.cos(a) * 40, h * 0.12 + Math.sin(a) * 40)
    ctx.strokeStyle = '#FFD700'
    ctx.lineWidth = 3
    ctx.stroke()
  }
  // cloud
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.beginPath()
  ctx.arc(w * 0.15, h * 0.15, 18, 0, Math.PI * 2)
  ctx.arc(w * 0.22, h * 0.12, 22, 0, Math.PI * 2)
  ctx.arc(w * 0.28, h * 0.15, 16, 0, Math.PI * 2)
  ctx.fill()
  const cx = w * 0.5
  const cy = h * 0.55
  // grass
  ctx.fillStyle = '#90EE90'
  ctx.fillRect(0, cy + 50, w, h * 0.3)
  // house body
  ctx.fillStyle = '#FFE4B5'
  ctx.fillRect(cx - 60, cy - 30, 120, 80)
  // roof
  ctx.beginPath()
  ctx.moveTo(cx - 75, cy - 30)
  ctx.lineTo(cx, cy - 90)
  ctx.lineTo(cx + 75, cy - 30)
  ctx.closePath()
  ctx.fillStyle = '#FF6347'
  ctx.fill()
  // door
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(cx - 15, cy + 10, 30, 40)
  // windows
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(cx - 45, cy - 15, 25, 25)
  ctx.fillRect(cx + 20, cy - 15, 25, 25)
  ctx.strokeStyle = '#FFF'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx - 32.5, cy - 15)
  ctx.lineTo(cx - 32.5, cy + 10)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx - 45, cy - 2.5)
  ctx.lineTo(cx - 20, cy - 2.5)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 32.5, cy - 15)
  ctx.lineTo(cx + 32.5, cy + 10)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 20, cy - 2.5)
  ctx.lineTo(cx + 45, cy - 2.5)
  ctx.stroke()
  // chimney
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(cx + 35, cy - 75, 15, 30)
  ctx.fillStyle = 'rgba(200,200,200,0.5)'
  ctx.beginPath()
  ctx.arc(cx + 42, cy - 85, 8, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 50, cy - 95, 10, 0, Math.PI * 2)
  ctx.fill()
  drawSurroundings(ctx, w, h, 'house', prng || Math.random)
}

export function drawCustomUmbrella(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng: () => number = Math.random,
): void {
  ctx.fillStyle = '#E0F7FA'
  ctx.fillRect(0, 0, w, h)
  // raindrops
  ctx.strokeStyle = 'rgba(100,150,200,0.35)'
  ctx.lineWidth = 2
  for (let i = 0; i < 25; i++) {
    const x = prng() * w
    const y = prng() * h
    const len = 12 + prng() * 15
    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.lineTo(x - 4, y + len)
    ctx.stroke()
  }
  const cx = w * 0.5
  const cy = h * 0.45
  // umbrella canopy
  const uColors = ['#FF4444', '#FF6666', '#FF4444', '#FF6666', '#FF4444', '#FF6666']
  for (let i = 0; i < 6; i++) {
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, 70, Math.PI + (i / 6) * Math.PI, Math.PI + ((i + 1) / 6) * Math.PI)
    ctx.closePath()
    ctx.fillStyle = uColors[i]
    ctx.fill()
  }
  // handle
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.lineTo(cx, cy + 90)
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx, cy + 90, 10, 0, Math.PI)
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 4
  ctx.stroke()
  // puddle
  ctx.beginPath()
  ctx.ellipse(cx, h * 0.85, 50, 12, 0, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(100,150,200,0.25)'
  ctx.fill()
  drawSurroundings(ctx, w, h, 'umbrella', prng || Math.random)
}

export function drawCustomGift(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#FFF8F0'
  ctx.fillRect(0, 0, w, h)
  const cx = w * 0.5
  const cy = h * 0.55
  const boxW = 100
  const boxH = 80
  // box
  ctx.fillStyle = '#FF69B4'
  ctx.fillRect(cx - boxW / 2, cy - boxH / 2, boxW, boxH)
  ctx.fillStyle = '#FF1493'
  ctx.fillRect(cx - 8, cy - boxH / 2, 16, boxH)
  ctx.fillRect(cx - boxW / 2, cy - 8, boxW, 16)
  // bow
  ctx.beginPath()
  ctx.ellipse(cx - 20, cy - boxH / 2 - 5, 20, 12, -0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#FF1493'
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 20, cy - boxH / 2 - 5, 20, 12, 0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#FF1493'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx, cy - boxH / 2 - 5, 10, 0, Math.PI * 2)
  ctx.fillStyle = '#DC143C'
  ctx.fill()
  // ribbon tails
  ctx.beginPath()
  ctx.moveTo(cx - 5, cy - boxH / 2 + 5)
  ctx.quadraticCurveTo(cx - 20, cy + 10, cx - 10, cy + 30)
  ctx.strokeStyle = '#FF1493'
  ctx.lineWidth = 6
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 5, cy - boxH / 2 + 5)
  ctx.quadraticCurveTo(cx + 20, cy + 10, cx + 15, cy + 25)
  ctx.strokeStyle = '#FF1493'
  ctx.lineWidth = 6
  ctx.stroke()
  // small hearts
  ctx.fillStyle = '#FFD700'
  drawHeart(ctx, cx - 35, cy - 5, 12)
  drawHeart(ctx, cx + 35, cy + 5, 10)
  drawSurroundings(ctx, w, h, 'gift', prng || Math.random)
}

export function drawCustomCandle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng: () => number = Math.random,
): void {
  ctx.fillStyle = '#1a1a2e'
  ctx.fillRect(0, 0, w, h)
  const cx = w * 0.5
  const cy = h * 0.5
  // candle body
  ctx.fillStyle = '#FFF8DC'
  ctx.fillRect(cx - 15, cy - 20, 30, 70)
  ctx.strokeStyle = '#FF69B4'
  ctx.lineWidth = 2
  for (let i = 0; i < 3; i++) {
    ctx.beginPath()
    ctx.moveTo(cx - 15, cy + i * 15)
    ctx.lineTo(cx + 15, cy + i * 15)
    ctx.stroke()
  }
  // wick
  ctx.beginPath()
  ctx.moveTo(cx, cy - 20)
  ctx.lineTo(cx, cy - 30)
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  ctx.stroke()
  // flame
  ctx.beginPath()
  ctx.moveTo(cx, cy - 30)
  ctx.quadraticCurveTo(cx - 10, cy - 45, cx, cy - 55)
  ctx.quadraticCurveTo(cx + 10, cy - 45, cx, cy - 30)
  ctx.closePath()
  ctx.fillStyle = '#FF4500'
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx, cy - 38, 5, 8, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  // glow
  ctx.beginPath()
  ctx.arc(cx, cy - 35, 45, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,200,0,0.06)'
  ctx.fill()
  // star background
  for (let i = 0; i < 20; i++) {
    const x = prng() * w
    const y = prng() * h
    ctx.beginPath()
    ctx.arc(x, y, prng() * 2 + 1, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.6)'
    ctx.fill()
  }
  drawSurroundings(ctx, w, h, 'candle', prng || Math.random)
}

export function drawCustomSnowman(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng: () => number = Math.random,
): void {
  ctx.fillStyle = '#B0C4DE'
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 12; i++) {
    const x = prng() * w
    const y = prng() * h
    ctx.beginPath()
    ctx.arc(x, y, prng() * 3 + 1, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.fill()
  }
  const cx = w * 0.5
  const cy = h * 0.55
  // lower body
  ctx.beginPath()
  ctx.arc(cx, cy + 30, 45, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  // upper body
  ctx.beginPath()
  ctx.arc(cx, cy - 20, 32, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  // head
  ctx.beginPath()
  ctx.arc(cx, cy - 60, 22, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  // eyes
  ctx.beginPath()
  ctx.arc(cx - 8, cy - 65, 3, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 8, cy - 65, 3, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // nose
  ctx.beginPath()
  ctx.moveTo(cx, cy - 60)
  ctx.lineTo(cx + 15, cy - 58)
  ctx.lineTo(cx, cy - 56)
  ctx.closePath()
  ctx.fillStyle = '#FF8C00'
  ctx.fill()
  // mouth
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.arc(cx - 8 + i * 4, cy - 52, 1.5, 0, Math.PI * 2)
    ctx.fillStyle = '#000'
    ctx.fill()
  }
  // hat
  ctx.fillStyle = '#333'
  ctx.fillRect(cx - 25, cy - 88, 50, 8)
  ctx.fillRect(cx - 15, cy - 110, 30, 25)
  // scarf
  ctx.fillStyle = '#FF4444'
  ctx.fillRect(cx - 25, cy - 35, 50, 10)
  ctx.beginPath()
  ctx.moveTo(cx + 15, cy - 30)
  ctx.lineTo(cx + 25, cy - 10)
  ctx.lineTo(cx + 15, cy - 10)
  ctx.closePath()
  ctx.fill()
  // arms
  ctx.beginPath()
  ctx.moveTo(cx - 32, cy - 20)
  ctx.lineTo(cx - 55, cy - 35)
  ctx.lineTo(cx - 58, cy - 32)
  ctx.strokeStyle = '#8B4513'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 32, cy - 20)
  ctx.lineTo(cx + 55, cy - 10)
  ctx.lineTo(cx + 58, cy - 13)
  ctx.strokeStyle = '#8B4513'
  ctx.lineWidth = 3
  ctx.stroke()
  // buttons
  ctx.beginPath()
  ctx.arc(cx, cy - 5, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#333'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx, cy + 10, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#333'
  ctx.fill()
  // ground
  ctx.fillStyle = '#FFF'
  ctx.fillRect(0, h * 0.88, w, h * 0.12)
  drawSurroundings(ctx, w, h, 'snowman', prng || Math.random)
}

export function drawCustomAppleTree(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#90EE90'
  ctx.fillRect(0, h * 0.75, w, h * 0.25)
  const cx = w * 0.5
  const cy = h * 0.55
  // trunk
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(cx - 10, cy, 20, h * 0.25)
  // canopy (overlapping circles)
  const circles = [
    { x: cx - 35, y: cy - 40, r: 35 },
    { x: cx + 35, y: cy - 35, r: 32 },
    { x: cx, y: cy - 60, r: 40 },
    { x: cx - 20, y: cy - 25, r: 30 },
    { x: cx + 20, y: cy - 20, r: 28 },
  ]
  circles.forEach((c) => {
    ctx.beginPath()
    ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2)
    ctx.fillStyle = '#228B22'
    ctx.fill()
  })
  // apples
  const apples: [number, number][] = [
    [cx - 30, cy - 30],
    [cx + 25, cy - 45],
    [cx - 10, cy - 70],
    [cx + 40, cy - 25],
    [cx - 45, cy - 50],
    [cx + 10, cy - 35],
    [cx, cy - 15],
  ]
  apples.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(x, y, 7, 0, Math.PI * 2)
    ctx.fillStyle = '#FF0000'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x - 2, y - 2, 2, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.4)'
    ctx.fill()
  })
  // sun
  ctx.beginPath()
  ctx.arc(w * 0.85, h * 0.15, 25, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  // cloud
  ctx.fillStyle = 'rgba(255,255,255,0.9)'
  ctx.beginPath()
  ctx.arc(w * 0.15, h * 0.2, 18, 0, Math.PI * 2)
  ctx.arc(w * 0.22, h * 0.17, 22, 0, Math.PI * 2)
  ctx.arc(w * 0.28, h * 0.2, 16, 0, Math.PI * 2)
  ctx.fill()
  drawSurroundings(ctx, w, h, 'appletree', prng || Math.random)
}

export function drawCustomWatermelon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#E8F5E9'
  ctx.fillRect(0, 0, w, h)
  const cx = w * 0.5
  const cy = h * 0.5
  const rw = w * 0.35
  const rh = h * 0.3
  // rind
  ctx.beginPath()
  ctx.ellipse(cx, cy, rw, rh, 0, Math.PI, 0)
  ctx.fillStyle = '#228B22'
  ctx.fill()
  // flesh
  ctx.beginPath()
  ctx.ellipse(cx, cy, rw - 12, rh - 10, 0, Math.PI, 0)
  ctx.fillStyle = '#FF6347'
  ctx.fill()
  // seeds
  const seeds: [number, number][] = [
    [cx - rw * 0.2, cy - rh * 0.1],
    [cx + rw * 0.15, cy - rh * 0.15],
    [cx, cy + rh * 0.05],
    [cx - rw * 0.1, cy + rh * 0.15],
    [cx + rw * 0.25, cy + rh * 0.05],
    [cx - rw * 0.3, cy + rh * 0.1],
    [cx + rw * 0.05, cy - rh * 0.2],
  ]
  seeds.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.ellipse(x, y, 4, 6, 0, 0, Math.PI * 2)
    ctx.fillStyle = '#000'
    ctx.fill()
  })
  // plate
  ctx.beginPath()
  ctx.ellipse(cx, cy + rh + 15, rw * 0.8, 12, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#DDD'
  ctx.fill()
  // knife
  ctx.fillStyle = '#AAA'
  ctx.fillRect(cx + rw + 10, cy - 20, 8, 60)
  ctx.fillStyle = '#DDD'
  ctx.fillRect(cx + rw + 8, cy - 25, 12, 10)
  drawSurroundings(ctx, w, h, 'watermelon', prng || Math.random)
}

export function drawCustomOrange(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#FFF8E1'
  ctx.fillRect(0, 0, w, h)
  const cx = w * 0.5
  const cy = h * 0.5
  const r = Math.min(w, h) * 0.3
  // peel
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = '#FF8C00'
  ctx.fill()
  // pith
  ctx.beginPath()
  ctx.arc(cx, cy, r - 8, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF5E0'
  ctx.fill()
  // segments
  for (let i = 0; i < 10; i++) {
    const a1 = (i / 10) * Math.PI * 2
    const a2 = ((i + 1) / 10) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r - 12, a1, a2)
    ctx.closePath()
    ctx.fillStyle = i % 2 === 0 ? '#FFD700' : '#FFA500'
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(a1) * (r - 12), cy + Math.sin(a1) * (r - 12))
    ctx.strokeStyle = '#FFF5E0'
    ctx.lineWidth = 2
    ctx.stroke()
  }
  // leaf
  ctx.beginPath()
  ctx.ellipse(cx + r * 0.3, cy - r * 0.6, 15, 8, 0.5, 0, Math.PI * 2)
  ctx.fillStyle = '#228B22'
  ctx.fill()
  // seeds
  ctx.beginPath()
  ctx.arc(cx + 5, cy + 5, 2, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx - 8, cy - 5, 2, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  drawSurroundings(ctx, w, h, 'orange', prng || Math.random)
}

export function drawCustomLemon(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#FFFFE0'
  ctx.fillRect(0, 0, w, h)
  const cx = w * 0.5
  const cy = h * 0.5
  const r = Math.min(w, h) * 0.3
  ctx.beginPath()
  ctx.arc(cx, cy, r, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx, cy, r - 8, 0, Math.PI * 2)
  ctx.fillStyle = '#FFFFE0'
  ctx.fill()
  for (let i = 0; i < 8; i++) {
    const a1 = (i / 8) * Math.PI * 2
    const a2 = ((i + 1) / 8) * Math.PI * 2
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.arc(cx, cy, r - 12, a1, a2)
    ctx.closePath()
    ctx.fillStyle = i % 2 === 0 ? '#FFFF00' : '#FFFACD'
    ctx.fill()
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(cx + Math.cos(a1) * (r - 12), cy + Math.sin(a1) * (r - 12))
    ctx.strokeStyle = '#FFFFE0'
    ctx.lineWidth = 2
    ctx.stroke()
  }
  ctx.beginPath()
  ctx.ellipse(cx + r * 0.4, cy - r * 0.5, 12, 6, 0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#228B22'
  ctx.fill()
  drawSurroundings(ctx, w, h, 'lemon', prng || Math.random)
}

export function drawCustomStrawberry(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#FFF0F5'
  ctx.fillRect(0, 0, w, h)
  const cx = w * 0.5
  const cy = h * 0.5
  // strawberry body (heart shape)
  ctx.beginPath()
  ctx.moveTo(cx, cy - 70)
  ctx.bezierCurveTo(cx + 50, cy - 40, cx + 55, cy + 20, cx + 30, cy + 50)
  ctx.bezierCurveTo(cx + 10, cy + 70, cx - 10, cy + 70, cx - 30, cy + 50)
  ctx.bezierCurveTo(cx - 55, cy + 20, cx - 50, cy - 40, cx, cy - 70)
  ctx.closePath()
  ctx.fillStyle = '#DC143C'
  ctx.fill()
  // highlight
  ctx.beginPath()
  ctx.ellipse(cx - 15, cy - 30, 8, 15, -0.3, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(255,255,255,0.25)'
  ctx.fill()
  // leaves
  ctx.fillStyle = '#228B22'
  ctx.beginPath()
  ctx.ellipse(cx - 15, cy - 72, 12, 6, -0.5, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 10, cy - 75, 10, 5, 0.3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx, cy - 78, 8, 4, 0, 0, Math.PI * 2)
  ctx.fill()
  // seeds
  const seeds: [number, number][] = [
    [cx - 15, cy - 40],
    [cx + 10, cy - 35],
    [cx - 5, cy - 15],
    [cx + 20, cy - 10],
    [cx - 25, cy - 5],
    [cx + 5, cy + 5],
    [cx - 15, cy + 15],
    [cx + 18, cy + 20],
    [cx, cy + 30],
    [cx - 20, cy + 35],
    [cx + 12, cy + 40],
    [cx - 8, cy + 48],
  ]
  seeds.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.arc(x, y, 2.5, 0, Math.PI * 2)
    ctx.fillStyle = '#FFD700'
    ctx.fill()
  })
  // plate
  ctx.beginPath()
  ctx.ellipse(cx, cy + 65, 50, 10, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#DDD'
  ctx.fill()
  drawSurroundings(ctx, w, h, 'strawberry', prng || Math.random)
}

export function drawCustomFish(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng: () => number = Math.random,
): void {
  ctx.fillStyle = '#00BFFF'
  ctx.fillRect(0, 0, w, h)
  // bubbles
  for (let i = 0; i < 6; i++) {
    const x = prng() * w
    const y = prng() * h * 0.4
    const br = prng() * 5 + 3
    ctx.beginPath()
    ctx.arc(x, y, br, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.25)'
    ctx.fill()
  }
  // seaweed
  ctx.strokeStyle = '#228B22'
  ctx.lineWidth = 4
  for (let i = 0; i < 4; i++) {
    const x = w * 0.15 + i * w * 0.25
    ctx.beginPath()
    ctx.moveTo(x, h)
    ctx.quadraticCurveTo(x + 10, h * 0.7, x - 5, h * 0.5)
    ctx.stroke()
  }
  const cx = w * 0.5
  const cy = h * 0.5
  // fish body
  ctx.beginPath()
  ctx.ellipse(cx, cy, 55, 30, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FF8C00'
  ctx.fill()
  // scale texture
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.beginPath()
      ctx.arc(cx - 15 + i * 18, cy - 8 + j * 16, 8, 0, Math.PI, true)
      ctx.strokeStyle = '#E6732E'
      ctx.lineWidth = 2
      ctx.stroke()
    }
  }
  // tail
  ctx.beginPath()
  ctx.moveTo(cx - 50, cy)
  ctx.lineTo(cx - 80, cy - 20)
  ctx.lineTo(cx - 80, cy + 20)
  ctx.closePath()
  ctx.fillStyle = '#FF8C00'
  ctx.fill()
  // dorsal fin
  ctx.beginPath()
  ctx.moveTo(cx, cy - 25)
  ctx.lineTo(cx - 15, cy - 45)
  ctx.lineTo(cx + 10, cy - 35)
  ctx.closePath()
  ctx.fillStyle = '#FFA500'
  ctx.fill()
  // ventral fin
  ctx.beginPath()
  ctx.moveTo(cx, cy + 25)
  ctx.lineTo(cx - 10, cy + 40)
  ctx.lineTo(cx + 10, cy + 35)
  ctx.closePath()
  ctx.fillStyle = '#FFA500'
  ctx.fill()
  // eye
  ctx.beginPath()
  ctx.arc(cx + 35, cy - 8, 7, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 37, cy - 8, 3.5, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // mouth
  ctx.beginPath()
  ctx.arc(cx + 50, cy + 3, 4, 0, Math.PI)
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 1.5
  ctx.stroke()
  drawSurroundings(ctx, w, h, 'fish', prng || Math.random)
}

export function drawCustomButterfly(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#E6F3FF'
  ctx.fillRect(0, 0, w, h)
  const cx = w * 0.5
  const cy = h * 0.5
  // upper left wing
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.bezierCurveTo(cx - 20, cy - 60, cx - 70, cy - 70, cx - 60, cy - 20)
  ctx.bezierCurveTo(cx - 55, cy + 5, cx - 30, cy + 5, cx, cy)
  ctx.closePath()
  ctx.fillStyle = '#FF69B4'
  ctx.fill()
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  ctx.stroke()
  // upper right wing
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.bezierCurveTo(cx + 20, cy - 60, cx + 70, cy - 70, cx + 60, cy - 20)
  ctx.bezierCurveTo(cx + 55, cy + 5, cx + 30, cy + 5, cx, cy)
  ctx.closePath()
  ctx.fillStyle = '#9370DB'
  ctx.fill()
  ctx.stroke()
  // lower left wing
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.bezierCurveTo(cx - 15, cy + 40, cx - 50, cy + 50, cx - 40, cy + 15)
  ctx.bezierCurveTo(cx - 35, cy + 5, cx - 20, cy + 5, cx, cy)
  ctx.closePath()
  ctx.fillStyle = '#FF1493'
  ctx.fill()
  ctx.stroke()
  // lower right wing
  ctx.beginPath()
  ctx.moveTo(cx, cy)
  ctx.bezierCurveTo(cx + 15, cy + 40, cx + 50, cy + 50, cx + 40, cy + 15)
  ctx.bezierCurveTo(cx + 35, cy + 5, cx + 20, cy + 5, cx, cy)
  ctx.closePath()
  ctx.fillStyle = '#8A2BE2'
  ctx.fill()
  ctx.stroke()
  // wing spots
  ctx.fillStyle = '#FFD700'
  ctx.beginPath()
  ctx.arc(cx - 40, cy - 35, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 40, cy - 35, 5, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx - 25, cy + 20, 3, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 25, cy + 20, 3, 0, Math.PI * 2)
  ctx.fill()
  // body
  ctx.beginPath()
  ctx.ellipse(cx, cy, 5, 30, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#333'
  ctx.fill()
  // head
  ctx.beginPath()
  ctx.arc(cx, cy - 32, 8, 0, Math.PI * 2)
  ctx.fillStyle = '#333'
  ctx.fill()
  // antennae
  ctx.beginPath()
  ctx.moveTo(cx - 3, cy - 38)
  ctx.quadraticCurveTo(cx - 12, cy - 50, cx - 8, cy - 58)
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 3, cy - 38)
  ctx.quadraticCurveTo(cx + 12, cy - 50, cx + 8, cy - 58)
  ctx.stroke()
  // antennae bulbs
  ctx.beginPath()
  ctx.arc(cx - 8, cy - 58, 3, 0, Math.PI * 2)
  ctx.fillStyle = '#333'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 8, cy - 58, 3, 0, Math.PI * 2)
  ctx.fillStyle = '#333'
  ctx.fill()
  drawSurroundings(ctx, w, h, 'butterfly', prng || Math.random)
}

export function drawCustomGoldfish(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng: () => number = Math.random,
): void {
  ctx.fillStyle = '#1E3A5F'
  ctx.fillRect(0, 0, w, h)
  // bubbles
  for (let i = 0; i < 5; i++) {
    const x = prng() * w
    const y = prng() * h
    ctx.beginPath()
    ctx.arc(x, y, prng() * 5 + 3, 0, Math.PI * 2)
    ctx.fillStyle = 'rgba(255,255,255,0.15)'
    ctx.fill()
  }
  const cx = w * 0.5
  const cy = h * 0.5
  // body
  ctx.beginPath()
  ctx.ellipse(cx, cy, 50, 30, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FF4500'
  ctx.fill()
  // scales
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 2; j++) {
      ctx.beginPath()
      ctx.arc(cx - 20 + i * 16, cy - 10 + j * 20, 7, 0, Math.PI, true)
      ctx.strokeStyle = '#FFD700'
      ctx.lineWidth = 1.5
      ctx.stroke()
    }
  }
  // tail (flowing)
  ctx.beginPath()
  ctx.moveTo(cx - 45, cy)
  ctx.quadraticCurveTo(cx - 80, cy - 30, cx - 75, cy)
  ctx.quadraticCurveTo(cx - 80, cy + 30, cx - 45, cy)
  ctx.fillStyle = '#FF6347'
  ctx.fill()
  // dorsal fin
  ctx.beginPath()
  ctx.moveTo(cx - 10, cy - 28)
  ctx.quadraticCurveTo(cx + 10, cy - 55, cx + 30, cy - 25)
  ctx.closePath()
  ctx.fillStyle = '#FF6347'
  ctx.fill()
  // ventral fin
  ctx.beginPath()
  ctx.moveTo(cx - 5, cy + 25)
  ctx.quadraticCurveTo(cx + 5, cy + 45, cx + 20, cy + 28)
  ctx.closePath()
  ctx.fillStyle = '#FF6347'
  ctx.fill()
  // eye (protruding)
  ctx.beginPath()
  ctx.arc(cx + 35, cy - 8, 9, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 37, cy - 8, 5, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // mouth
  ctx.beginPath()
  ctx.arc(cx + 48, cy + 3, 4, 0, Math.PI)
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 1.5
  ctx.stroke()
  drawSurroundings(ctx, w, h, 'goldfish', prng || Math.random)
}

export function drawCustomBee(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng: () => number = Math.random,
): void {
  ctx.fillStyle = '#E8F5E9'
  ctx.fillRect(0, 0, w, h)
  // flowers background
  for (let i = 0; i < 5; i++) {
    const x = w * 0.15 + i * w * 0.18
    const y = h * (0.75 + prng() * 0.15)
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fillStyle = '#FF69B4'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(x, y, 3, 0, Math.PI * 2)
    ctx.fillStyle = '#FFD700'
    ctx.fill()
    ctx.strokeStyle = '#228B22'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(x, y + 8)
    ctx.lineTo(x, y + 25)
    ctx.stroke()
  }
  const cx = w * 0.5
  const cy = h * 0.4
  // body
  ctx.beginPath()
  ctx.ellipse(cx, cy, 28, 20, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 1.5
  ctx.stroke()
  // stripes
  ctx.fillStyle = '#333'
  ctx.fillRect(cx - 20, cy - 15, 6, 30)
  ctx.fillRect(cx - 5, cy - 18, 6, 36)
  ctx.fillRect(cx + 10, cy - 15, 6, 30)
  // head
  ctx.beginPath()
  ctx.arc(cx + 25, cy, 14, 0, Math.PI * 2)
  ctx.fillStyle = '#333'
  ctx.fill()
  // eye
  ctx.beginPath()
  ctx.arc(cx + 28, cy - 4, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 29, cy - 4, 2, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // wings (translucent)
  ctx.beginPath()
  ctx.ellipse(cx - 5, cy - 18, 18, 10, -0.5, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(200,230,255,0.6)'
  ctx.fill()
  ctx.strokeStyle = 'rgba(100,150,200,0.4)'
  ctx.lineWidth = 1
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx + 5, cy - 18, 18, 10, 0.5, 0, Math.PI * 2)
  ctx.fillStyle = 'rgba(200,230,255,0.6)'
  ctx.fill()
  ctx.stroke()
  // antennae
  ctx.beginPath()
  ctx.moveTo(cx + 32, cy - 8)
  ctx.quadraticCurveTo(cx + 42, cy - 18, cx + 38, cy - 25)
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 32, cy + 2)
  ctx.quadraticCurveTo(cx + 42, cy + 8, cx + 38, cy + 15)
  ctx.stroke()
  // stinger
  ctx.beginPath()
  ctx.moveTo(cx - 28, cy)
  ctx.lineTo(cx - 40, cy - 5)
  ctx.lineTo(cx - 40, cy + 5)
  ctx.closePath()
  ctx.fillStyle = '#333'
  ctx.fill()
  drawSurroundings(ctx, w, h, 'bee', prng || Math.random)
}

export function drawCustomCastle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(0, 0, w, h)
  // sun
  ctx.beginPath()
  ctx.arc(w * 0.88, h * 0.12, 20, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  // cloud
  ctx.fillStyle = 'rgba(255,255,255,0.85)'
  ctx.beginPath()
  ctx.arc(w * 0.18, h * 0.18, 15, 0, Math.PI * 2)
  ctx.arc(w * 0.24, h * 0.15, 18, 0, Math.PI * 2)
  ctx.arc(w * 0.29, h * 0.18, 13, 0, Math.PI * 2)
  ctx.fill()
  const cx = w * 0.5
  const cy = h * 0.6
  // main tower
  ctx.fillStyle = '#D3D3D3'
  ctx.fillRect(cx - 30, cy - 60, 60, 90)
  // roof
  ctx.beginPath()
  ctx.moveTo(cx - 38, cy - 60)
  ctx.lineTo(cx, cy - 105)
  ctx.lineTo(cx + 38, cy - 60)
  ctx.closePath()
  ctx.fillStyle = '#4169E1'
  ctx.fill()
  // flag
  ctx.beginPath()
  ctx.moveTo(cx, cy - 105)
  ctx.lineTo(cx + 25, cy - 95)
  ctx.lineTo(cx, cy - 90)
  ctx.closePath()
  ctx.fillStyle = '#FF0000'
  ctx.fill()
  ctx.beginPath()
  ctx.moveTo(cx, cy - 105)
  ctx.lineTo(cx, cy - 115)
  ctx.strokeStyle = '#333'
  ctx.lineWidth = 2
  ctx.stroke()
  // left tower
  ctx.fillStyle = '#C0C0C0'
  ctx.fillRect(cx - 65, cy - 20, 35, 50)
  ctx.beginPath()
  ctx.moveTo(cx - 72, cy - 20)
  ctx.lineTo(cx - 47.5, cy - 55)
  ctx.lineTo(cx - 23, cy - 20)
  ctx.closePath()
  ctx.fillStyle = '#4169E1'
  ctx.fill()
  // right tower
  ctx.fillStyle = '#C0C0C0'
  ctx.fillRect(cx + 30, cy - 20, 35, 50)
  ctx.beginPath()
  ctx.moveTo(cx + 23, cy - 20)
  ctx.lineTo(cx + 47.5, cy - 55)
  ctx.lineTo(cx + 72, cy - 20)
  ctx.closePath()
  ctx.fillStyle = '#4169E1'
  ctx.fill()
  // gate
  ctx.beginPath()
  ctx.arc(cx, cy + 30, 18, Math.PI, 0)
  ctx.fillStyle = '#8B4513'
  ctx.fill()
  ctx.fillStyle = '#8B4513'
  ctx.fillRect(cx - 18, cy + 30, 36, 25)
  // windows
  ctx.fillStyle = '#87CEEB'
  ctx.beginPath()
  ctx.arc(cx, cy - 30, 10, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx - 47, cy - 5, 7, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 47, cy - 5, 7, 0, Math.PI * 2)
  ctx.fill()
  // wall
  ctx.fillStyle = '#D3D3D3'
  ctx.fillRect(cx - 80, cy + 30, 160, 15)
  // moat
  ctx.fillStyle = '#4682B4'
  ctx.fillRect(0, h * 0.88, w, h * 0.12)
  drawSurroundings(ctx, w, h, 'castle', prng || Math.random)
}

export function drawCustomZebra(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#90EE90'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#228B22'
  ctx.fillRect(0, h * 0.82, w, h * 0.18)
  const cx = w * 0.5
  const cy = h * 0.5
  // body
  ctx.beginPath()
  ctx.ellipse(cx, cy + 10, 55, 40, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  // stripes
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 5
  for (let i = 0; i < 6; i++) {
    const y = cy - 25 + i * 12
    ctx.beginPath()
    ctx.moveTo(cx - 50, y)
    ctx.lineTo(cx + 50, y + (i % 2 === 0 ? 8 : -8))
    ctx.stroke()
  }
  // head
  ctx.beginPath()
  ctx.ellipse(cx + 50, cy - 25, 28, 22, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  // head stripes
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(cx + 35, cy - 40)
  ctx.lineTo(cx + 40, cy - 15)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 45, cy - 42)
  ctx.lineTo(cx + 50, cy - 12)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 55, cy - 40)
  ctx.lineTo(cx + 60, cy - 15)
  ctx.stroke()
  // eye
  ctx.beginPath()
  ctx.arc(cx + 58, cy - 28, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 60, cy - 29, 1.5, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  // nose
  ctx.beginPath()
  ctx.ellipse(cx + 75, cy - 22, 5, 4, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // ears
  ctx.beginPath()
  ctx.ellipse(cx + 38, cy - 42, 6, 12, -0.4, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 1.5
  ctx.stroke()
  ctx.beginPath()
  ctx.ellipse(cx + 58, cy - 40, 6, 12, 0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.stroke()
  // mane
  ctx.fillStyle = '#000'
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.arc(cx + 30 + i * 8, cy - 50 - i * 2, 4, 0, Math.PI * 2)
    ctx.fill()
  }
  // legs
  ctx.fillStyle = '#FFF'
  ctx.fillRect(cx - 30, cy + 45, 10, 35)
  ctx.fillRect(cx - 5, cy + 45, 10, 35)
  ctx.fillRect(cx + 15, cy + 45, 10, 35)
  ctx.fillRect(cx + 35, cy + 45, 10, 35)
  // leg stripes
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  for (let i = 0; i < 4; i++) {
    const lx = cx - 30 + i * 22
    ctx.beginPath()
    ctx.moveTo(lx, cy + 50)
    ctx.lineTo(lx + 10, cy + 58)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(lx, cy + 62)
    ctx.lineTo(lx + 10, cy + 70)
    ctx.stroke()
  }
  // tail
  ctx.beginPath()
  ctx.moveTo(cx - 50, cy)
  ctx.quadraticCurveTo(cx - 75, cy - 20, cx - 70, cy - 45)
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 5
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx - 70, cy - 45, 6, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  drawSurroundings(ctx, w, h, 'zebra', prng || Math.random)
}

export function drawCustomLeopard(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng: () => number = Math.random,
): void {
  ctx.fillStyle = '#D2B48C'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#228B22'
  ctx.fillRect(0, h * 0.82, w, h * 0.18)
  const cx = w * 0.5
  const cy = h * 0.5
  // body
  ctx.beginPath()
  ctx.ellipse(cx, cy + 10, 50, 40, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  // spots
  const spots: [number, number][] = [
    [cx - 25, cy - 10],
    [cx + 15, cy - 15],
    [cx - 10, cy + 10],
    [cx + 30, cy + 5],
    [cx - 30, cy + 25],
    [cx + 5, cy + 25],
    [cx - 15, cy + 35],
    [cx + 25, cy + 30],
    [cx - 5, cy - 5],
    [cx + 20, cy - 25],
  ]
  spots.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.ellipse(x, y, 8, 5, prng(), 0, Math.PI * 2)
    ctx.fillStyle = '#000'
    ctx.fill()
  })
  // head
  ctx.beginPath()
  ctx.ellipse(cx + 48, cy - 25, 28, 24, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  // head spots
  ctx.beginPath()
  ctx.ellipse(cx + 40, cy - 32, 4, 3, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 55, cy - 28, 4, 3, 0.5, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 50, cy - 18, 4, 3, -0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // eye
  ctx.beginPath()
  ctx.ellipse(cx + 55, cy - 32, 5, 6, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#228B22'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 57, cy - 33, 2.5, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // nose
  ctx.beginPath()
  ctx.ellipse(cx + 72, cy - 22, 4, 3, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FF69B4'
  ctx.fill()
  // ears
  ctx.beginPath()
  ctx.ellipse(cx + 32, cy - 42, 7, 12, -0.5, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 58, cy - 40, 7, 12, 0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  // legs
  ctx.fillStyle = '#FFD700'
  ctx.fillRect(cx - 28, cy + 45, 10, 32)
  ctx.fillRect(cx - 5, cy + 45, 10, 32)
  ctx.fillRect(cx + 15, cy + 45, 10, 32)
  ctx.fillRect(cx + 35, cy + 45, 10, 32)
  // tail
  ctx.beginPath()
  ctx.moveTo(cx - 48, cy + 5)
  ctx.quadraticCurveTo(cx - 75, cy - 15, cx - 68, cy - 40)
  ctx.strokeStyle = '#FFD700'
  ctx.lineWidth = 8
  ctx.stroke()
  drawSurroundings(ctx, w, h, 'leopard', prng || Math.random)
}

export function drawCustomCow(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng: () => number = Math.random,
): void {
  ctx.fillStyle = '#87CEEB'
  ctx.fillRect(0, 0, w, h)
  ctx.fillStyle = '#90EE90'
  ctx.fillRect(0, h * 0.82, w, h * 0.18)
  // distant hills
  ctx.fillStyle = '#228B22'
  ctx.beginPath()
  ctx.moveTo(0, h * 0.82)
  ctx.lineTo(w * 0.2, h * 0.65)
  ctx.lineTo(w * 0.4, h * 0.72)
  ctx.lineTo(w * 0.6, h * 0.6)
  ctx.lineTo(w * 0.8, h * 0.7)
  ctx.lineTo(w, h * 0.62)
  ctx.lineTo(w, h * 0.82)
  ctx.closePath()
  ctx.fill()
  const cx = w * 0.5
  const cy = h * 0.5
  // body
  ctx.beginPath()
  ctx.ellipse(cx, cy + 5, 55, 42, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  // spots
  const cSpots: [number, number][] = [
    [cx - 25, cy - 10],
    [cx + 20, cy - 15],
    [cx - 10, cy + 15],
    [cx + 35, cy + 10],
    [cx - 35, cy + 20],
    [cx + 5, cy - 25],
  ]
  cSpots.forEach(([x, y]) => {
    ctx.beginPath()
    ctx.ellipse(x, y, 10, 7, prng(), 0, Math.PI * 2)
    ctx.fillStyle = '#000'
    ctx.fill()
  })
  // head
  ctx.beginPath()
  ctx.ellipse(cx + 50, cy - 20, 26, 30, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  // head spots
  ctx.beginPath()
  ctx.ellipse(cx + 42, cy - 32, 6, 4, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 58, cy - 10, 5, 4, 0.5, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // eye
  ctx.beginPath()
  ctx.arc(cx + 58, cy - 28, 4, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 59, cy - 28, 2, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // nose
  ctx.beginPath()
  ctx.ellipse(cx + 72, cy - 18, 5, 4, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#FF69B4'
  ctx.fill()
  // nostrils
  ctx.beginPath()
  ctx.arc(cx + 70, cy - 18, 1.5, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 74, cy - 18, 1.5, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // ears
  ctx.beginPath()
  ctx.ellipse(cx + 32, cy - 38, 8, 14, -0.5, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 60, cy - 36, 8, 14, 0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  // horns
  ctx.beginPath()
  ctx.moveTo(cx + 35, cy - 48)
  ctx.lineTo(cx + 30, cy - 62)
  ctx.strokeStyle = '#D2B48C'
  ctx.lineWidth = 4
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 60, cy - 46)
  ctx.lineTo(cx + 65, cy - 60)
  ctx.strokeStyle = '#D2B48C'
  ctx.lineWidth = 4
  ctx.stroke()
  // legs
  ctx.fillStyle = '#FFF'
  ctx.fillRect(cx - 30, cy + 42, 12, 32)
  ctx.fillRect(cx - 5, cy + 42, 12, 32)
  ctx.fillRect(cx + 15, cy + 42, 12, 32)
  ctx.fillRect(cx + 38, cy + 42, 12, 32)
  // leg spots
  ctx.beginPath()
  ctx.ellipse(cx - 24, cy + 48, 4, 3, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 42, cy + 52, 4, 3, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // tail
  ctx.beginPath()
  ctx.moveTo(cx - 52, cy)
  ctx.quadraticCurveTo(cx - 80, cy - 15, cx - 72, cy - 35)
  ctx.strokeStyle = '#FFF'
  ctx.lineWidth = 8
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(cx - 72, cy - 35, 5, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // bell
  ctx.beginPath()
  ctx.arc(cx + 48, cy + 8, 6, 0, Math.PI * 2)
  ctx.fillStyle = '#FFD700'
  ctx.fill()
  drawSurroundings(ctx, w, h, 'cow', prng || Math.random)
}

export function drawCustomPeacock(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  prng?: () => number,
): void {
  ctx.fillStyle = '#E0F7FA'
  ctx.fillRect(0, 0, w, h)
  const cx = w * 0.5
  const cy = h * 0.55
  // body
  ctx.beginPath()
  ctx.ellipse(cx, cy, 22, 35, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#4169E1'
  ctx.fill()
  // neck
  ctx.beginPath()
  ctx.ellipse(cx, cy - 38, 10, 20, 0, 0, Math.PI * 2)
  ctx.fillStyle = '#4169E1'
  ctx.fill()
  // head
  ctx.beginPath()
  ctx.ellipse(cx + 5, cy - 60, 14, 10, 0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#4169E1'
  ctx.fill()
  // crest feathers
  ctx.fillStyle = '#4169E1'
  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.ellipse(cx - 5 + i * 5, cy - 72, 2, 8, (i - 2) * 0.3, 0, Math.PI * 2)
    ctx.fill()
  }
  // eye
  ctx.beginPath()
  ctx.arc(cx + 10, cy - 62, 3, 0, Math.PI * 2)
  ctx.fillStyle = '#FFF'
  ctx.fill()
  ctx.beginPath()
  ctx.arc(cx + 11, cy - 62, 1.5, 0, Math.PI * 2)
  ctx.fillStyle = '#000'
  ctx.fill()
  // beak
  ctx.beginPath()
  ctx.moveTo(cx + 18, cy - 60)
  ctx.lineTo(cx + 28, cy - 58)
  ctx.lineTo(cx + 18, cy - 56)
  ctx.closePath()
  ctx.fillStyle = '#FF8C00'
  ctx.fill()
  // tail (fan)
  const tailColors = ['#4169E1', '#00CED1', '#FFD700', '#FF69B4', '#9370DB']
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI * 0.6 + (i / 6) * Math.PI * 1.2
    const tx = cx + Math.cos(a) * 70
    const ty = cy - 50 + Math.sin(a) * 30
    ctx.beginPath()
    ctx.ellipse(tx, ty, 12, 35, a - Math.PI / 2, 0, Math.PI * 2)
    ctx.fillStyle = tailColors[i % tailColors.length]
    ctx.fill()
    ctx.strokeStyle = '#333'
    ctx.lineWidth = 1
    ctx.stroke()
    // eye spot
    ctx.beginPath()
    ctx.arc(tx, ty + 10, 5, 0, Math.PI * 2)
    ctx.fillStyle = '#FFD700'
    ctx.fill()
    ctx.beginPath()
    ctx.arc(tx, ty + 10, 2.5, 0, Math.PI * 2)
    ctx.fillStyle = '#4169E1'
    ctx.fill()
  }
  // wings
  ctx.beginPath()
  ctx.ellipse(cx - 25, cy - 5, 28, 18, -0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#00CED1'
  ctx.fill()
  ctx.beginPath()
  ctx.ellipse(cx + 25, cy - 5, 28, 18, 0.3, 0, Math.PI * 2)
  ctx.fillStyle = '#00CED1'
  ctx.fill()
  // legs
  ctx.beginPath()
  ctx.moveTo(cx - 8, cy + 30)
  ctx.lineTo(cx - 10, cy + 55)
  ctx.strokeStyle = '#FF8C00'
  ctx.lineWidth = 3
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(cx + 8, cy + 30)
  ctx.lineTo(cx + 10, cy + 55)
  ctx.strokeStyle = '#FF8C00'
  ctx.lineWidth = 3
  ctx.stroke()
  // grass
  ctx.fillStyle = '#90EE90'
  ctx.fillRect(0, h * 0.88, w, h * 0.12)
  drawSurroundings(ctx, w, h, 'peacock', prng || Math.random)
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  points: number,
  outerR: number,
  innerR: number,
): void {
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? outerR : innerR
    const angle = (i * Math.PI) / points - Math.PI / 2
    const px = x + Math.cos(angle) * r
    const py = y + Math.sin(angle) * r
    if (i === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.closePath()
}

function drawSurroundings(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  name: string,
  prng: () => number,
): void {
  const configs: Record<string, Array<{ t: string; x: number; y: number; s: number; c: string }>> = {
    kite: [{t:'sun',x:0.12,y:0.12,s:0.1,c:'#FFD700'},{t:'cloud',x:0.82,y:0.18,s:0.08,c:'#FFF'},{t:'bird',x:0.88,y:0.08,s:0.05,c:'#FF6347'},{t:'grass',x:0.15,y:0.92,s:0.06,c:'#228B22'},{t:'flower',x:0.85,y:0.88,s:0.05,c:'#FF69B4'},{t:'cloud',x:0.2,y:0.35,s:0.06,c:'#FFF'}],
    moonrabbit: [{t:'star',x:0.08,y:0.12,s:0.04,c:'#FFD700'},{t:'star',x:0.88,y:0.08,s:0.035,c:'#FFF'},{t:'star',x:0.92,y:0.28,s:0.04,c:'#FFD700'},{t:'star',x:0.12,y:0.32,s:0.03,c:'#FFF'},{t:'cloud',x:0.75,y:0.38,s:0.05,c:'rgba(255,255,255,0.15)'},{t:'star',x:0.5,y:0.08,s:0.025,c:'#FFD700'},{t:'star',x:0.3,y:0.15,s:0.02,c:'#FFF'}],
    cat: [{t:'grass',x:0.1,y:0.92,s:0.06,c:'#228B22'},{t:'flower',x:0.88,y:0.88,s:0.05,c:'#FF69B4'},{t:'ball',x:0.12,y:0.72,s:0.05,c:'#FF6347'},{t:'sun',x:0.85,y:0.12,s:0.08,c:'#FFD700'},{t:'grass',x:0.7,y:0.92,s:0.05,c:'#32CD32'},{t:'flower',x:0.2,y:0.82,s:0.04,c:'#9370DB'}],
    bird: [{t:'cloud',x:0.1,y:0.18,s:0.07,c:'#FFF'},{t:'cloud',x:0.85,y:0.12,s:0.06,c:'#FFF'},{t:'leaf',x:0.12,y:0.75,s:0.05,c:'#228B22'},{t:'leaf',x:0.88,y:0.78,s:0.05,c:'#32CD32'},{t:'flower',x:0.5,y:0.9,s:0.05,c:'#FF69B4'},{t:'sun',x:0.15,y:0.1,s:0.07,c:'#FFD700'}],
    dog: [{t:'bone',x:0.12,y:0.2,s:0.06,c:'#FFF'},{t:'ball',x:0.85,y:0.82,s:0.05,c:'#FF6347'},{t:'sun',x:0.88,y:0.12,s:0.08,c:'#FFD700'},{t:'grass',x:0.15,y:0.92,s:0.06,c:'#228B22'},{t:'flower',x:0.75,y:0.88,s:0.05,c:'#FFD700'},{t:'grass',x:0.5,y:0.92,s:0.05,c:'#32CD32'}],
    house: [{t:'sun',x:0.88,y:0.12,s:0.08,c:'#FFD700'},{t:'cloud',x:0.15,y:0.15,s:0.07,c:'#FFF'},{t:'flower',x:0.1,y:0.85,s:0.05,c:'#FF69B4'},{t:'flower',x:0.88,y:0.85,s:0.05,c:'#FFD700'},{t:'grass',x:0.5,y:0.92,s:0.05,c:'#228B22'},{t:'stone',x:0.75,y:0.88,s:0.04,c:'#AAA'}],
    umbrella: [{t:'drop',x:0.12,y:0.15,s:0.04,c:'rgba(100,150,200,0.5)'},{t:'drop',x:0.85,y:0.22,s:0.03,c:'rgba(100,150,200,0.4)'},{t:'drop',x:0.2,y:0.35,s:0.035,c:'rgba(100,150,200,0.45)'},{t:'cloud',x:0.75,y:0.12,s:0.06,c:'rgba(255,255,255,0.7)'},{t:'stone',x:0.15,y:0.9,s:0.05,c:'#AAA'},{t:'leaf',x:0.88,y:0.85,s:0.04,c:'#228B22'}],
    gift: [{t:'star',x:0.12,y:0.15,s:0.04,c:'#FFD700'},{t:'star',x:0.88,y:0.12,s:0.035,c:'#FFD700'},{t:'star',x:0.85,y:0.85,s:0.04,c:'#FF69B4'},{t:'star',x:0.15,y:0.82,s:0.03,c:'#00CED1'},{t:'ball',x:0.5,y:0.12,s:0.04,c:'#FF6347'},{t:'flower',x:0.5,y:0.88,s:0.05,c:'#9370DB'}],
    candle: [{t:'star',x:0.1,y:0.15,s:0.035,c:'#FFD700'},{t:'star',x:0.88,y:0.12,s:0.03,c:'#FFF'},{t:'star',x:0.85,y:0.82,s:0.035,c:'#FFD700'},{t:'star',x:0.15,y:0.78,s:0.025,c:'#FFF'},{t:'ball',x:0.5,y:0.88,s:0.04,c:'#FF6347'},{t:'star',x:0.5,y:0.1,s:0.02,c:'#FFD700'}],
    snowman: [{t:'star',x:0.1,y:0.12,s:0.03,c:'#FFD700'},{t:'star',x:0.88,y:0.15,s:0.025,c:'#FFF'},{t:'star',x:0.85,y:0.35,s:0.03,c:'#FFD700'},{t:'tree',x:0.12,y:0.55,s:0.08,c:'#228B22'},{t:'gift',x:0.88,y:0.72,s:0.06,c:'#FF6347'},{t:'star',x:0.5,y:0.08,s:0.02,c:'#FFF'}],
    appletree: [{t:'sun',x:0.88,y:0.15,s:0.08,c:'#FFD700'},{t:'cloud',x:0.15,y:0.18,s:0.06,c:'#FFF'},{t:'flower',x:0.1,y:0.88,s:0.05,c:'#FF69B4'},{t:'flower',x:0.88,y:0.88,s:0.05,c:'#FFD700'},{t:'grass',x:0.5,y:0.92,s:0.05,c:'#32CD32'},{t:'butterfly',x:0.75,y:0.25,s:0.04,c:'#9370DB'}],
    watermelon: [{t:'leaf',x:0.12,y:0.15,s:0.05,c:'#228B22'},{t:'leaf',x:0.85,y:0.18,s:0.05,c:'#32CD32'},{t:'drop',x:0.2,y:0.3,s:0.03,c:'rgba(100,200,255,0.5)'},{t:'drop',x:0.8,y:0.35,s:0.025,c:'rgba(100,200,255,0.4)'},{t:'flower',x:0.15,y:0.85,s:0.04,c:'#FF69B4'},{t:'flower',x:0.82,y:0.82,s:0.04,c:'#FFD700'}],
    orange: [{t:'leaf',x:0.15,y:0.15,s:0.05,c:'#228B22'},{t:'leaf',x:0.82,y:0.18,s:0.05,c:'#32CD32'},{t:'drop',x:0.25,y:0.25,s:0.03,c:'rgba(255,200,0,0.4)'},{t:'drop',x:0.78,y:0.3,s:0.025,c:'rgba(255,200,0,0.3)'},{t:'flower',x:0.12,y:0.82,s:0.04,c:'#FF69B4'},{t:'flower',x:0.85,y:0.8,s:0.04,c:'#FFD700'}],
    lemon: [{t:'leaf',x:0.18,y:0.15,s:0.05,c:'#228B22'},{t:'leaf',x:0.8,y:0.18,s:0.05,c:'#32CD32'},{t:'drop',x:0.22,y:0.28,s:0.03,c:'rgba(255,255,0,0.4)'},{t:'drop',x:0.75,y:0.32,s:0.025,c:'rgba(255,255,0,0.3)'},{t:'flower',x:0.15,y:0.82,s:0.04,c:'#FF69B4'},{t:'flower',x:0.82,y:0.8,s:0.04,c:'#9370DB'}],
    strawberry: [{t:'leaf',x:0.12,y:0.15,s:0.05,c:'#228B22'},{t:'leaf',x:0.85,y:0.18,s:0.05,c:'#32CD32'},{t:'drop',x:0.2,y:0.25,s:0.03,c:'rgba(255,100,100,0.4)'},{t:'drop',x:0.8,y:0.3,s:0.025,c:'rgba(255,100,100,0.3)'},{t:'flower',x:0.12,y:0.82,s:0.04,c:'#FFD700'},{t:'flower',x:0.85,y:0.8,s:0.04,c:'#FF69B4'}],
    fish: [{t:'bubble',x:0.15,y:0.15,s:0.05,c:'#FFF'},{t:'bubble',x:0.82,y:0.22,s:0.04,c:'#FFF'},{t:'bubble',x:0.2,y:0.35,s:0.035,c:'#FFF'},{t:'seaweed',x:0.1,y:0.75,s:0.08,c:'#228B22'},{t:'seaweed',x:0.88,y:0.7,s:0.07,c:'#32CD32'},{t:'star',x:0.5,y:0.1,s:0.03,c:'#FFD700'}],
    butterfly: [{t:'flower',x:0.12,y:0.15,s:0.05,c:'#FF69B4'},{t:'flower',x:0.85,y:0.18,s:0.05,c:'#FFD700'},{t:'flower',x:0.15,y:0.82,s:0.05,c:'#9370DB'},{t:'flower',x:0.82,y:0.8,s:0.05,c:'#FF6347'},{t:'leaf',x:0.5,y:0.1,s:0.04,c:'#228B22'},{t:'leaf',x:0.5,y:0.9,s:0.04,c:'#32CD32'}],
    goldfish: [{t:'bubble',x:0.12,y:0.18,s:0.05,c:'#FFF'},{t:'bubble',x:0.85,y:0.25,s:0.04,c:'#FFF'},{t:'bubble',x:0.2,y:0.38,s:0.035,c:'#FFF'},{t:'seaweed',x:0.08,y:0.72,s:0.08,c:'#228B22'},{t:'seaweed',x:0.9,y:0.68,s:0.07,c:'#32CD32'},{t:'stone',x:0.5,y:0.9,s:0.06,c:'#AAA'}],
    bee: [{t:'flower',x:0.12,y:0.15,s:0.05,c:'#FF69B4'},{t:'flower',x:0.85,y:0.18,s:0.05,c:'#FFD700'},{t:'flower',x:0.15,y:0.82,s:0.05,c:'#9370DB'},{t:'flower',x:0.82,y:0.8,s:0.05,c:'#FF6347'},{t:'leaf',x:0.5,y:0.1,s:0.04,c:'#228B22'},{t:'leaf',x:0.5,y:0.9,s:0.04,c:'#32CD32'}],
    castle: [{t:'sun',x:0.88,y:0.12,s:0.08,c:'#FFD700'},{t:'cloud',x:0.15,y:0.18,s:0.06,c:'#FFF'},{t:'flower',x:0.1,y:0.85,s:0.05,c:'#FF69B4'},{t:'flower',x:0.88,y:0.85,s:0.05,c:'#FFD700'},{t:'grass',x:0.5,y:0.92,s:0.05,c:'#228B22'},{t:'bird',x:0.75,y:0.15,s:0.04,c:'#FF6347'}],
    zebra: [{t:'sun',x:0.88,y:0.12,s:0.08,c:'#FFD700'},{t:'cloud',x:0.15,y:0.18,s:0.06,c:'#FFF'},{t:'grass',x:0.1,y:0.88,s:0.06,c:'#228B22'},{t:'grass',x:0.85,y:0.88,s:0.06,c:'#32CD32'},{t:'flower',x:0.5,y:0.88,s:0.05,c:'#FF69B4'},{t:'tree',x:0.12,y:0.5,s:0.08,c:'#228B22'}],
    leopard: [{t:'sun',x:0.88,y:0.12,s:0.08,c:'#FFD700'},{t:'cloud',x:0.15,y:0.18,s:0.06,c:'#FFF'},{t:'grass',x:0.1,y:0.88,s:0.06,c:'#228B22'},{t:'grass',x:0.85,y:0.88,s:0.06,c:'#32CD32'},{t:'stone',x:0.5,y:0.88,s:0.05,c:'#AAA'},{t:'tree',x:0.88,y:0.5,s:0.08,c:'#228B22'}],
    cow: [{t:'sun',x:0.88,y:0.12,s:0.08,c:'#FFD700'},{t:'cloud',x:0.15,y:0.18,s:0.06,c:'#FFF'},{t:'grass',x:0.1,y:0.88,s:0.06,c:'#228B22'},{t:'grass',x:0.85,y:0.88,s:0.06,c:'#32CD32'},{t:'flower',x:0.3,y:0.88,s:0.05,c:'#FF69B4'},{t:'flower',x:0.7,y:0.88,s:0.05,c:'#FFD700'}],
    peacock: [{t:'sun',x:0.88,y:0.12,s:0.08,c:'#FFD700'},{t:'flower',x:0.12,y:0.85,s:0.05,c:'#FF69B4'},{t:'flower',x:0.85,y:0.85,s:0.05,c:'#FFD700'},{t:'grass',x:0.5,y:0.92,s:0.05,c:'#228B22'},{t:'flower',x:0.15,y:0.2,s:0.04,c:'#9370DB'},{t:'butterfly',x:0.82,y:0.25,s:0.04,c:'#FF6347'}],
  }
  const list = configs[name] || []
  for (const d of list) {
    drawDeco(ctx, d.x * w, d.y * h, d.t, d.s * Math.min(w, h), d.c, prng)
  }
}

function drawDeco(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  type: string,
  size: number,
  color: string,
  prng: () => number,
): void {
  ctx.save()
  switch (type) {
    case 'grass':
      ctx.strokeStyle = color
      ctx.lineWidth = Math.max(2, size * 0.15)
      for (let i = 0; i < 3; i++) {
        ctx.beginPath()
        ctx.moveTo(x + i * size * 0.3 - size * 0.3, y)
        ctx.lineTo(x + i * size * 0.3 - size * 0.45, y - size * 0.8)
        ctx.stroke()
      }
      break
    case 'flower':
      for (let i = 0; i < 5; i++) {
        const a = (i / 5) * Math.PI * 2
        ctx.beginPath()
        ctx.arc(x + Math.cos(a) * size * 0.35, y + Math.sin(a) * size * 0.35, size * 0.25, 0, Math.PI * 2)
        ctx.fillStyle = color
        ctx.fill()
      }
      ctx.beginPath(); ctx.arc(x, y, size * 0.18, 0, Math.PI * 2); ctx.fillStyle = '#FFD700'; ctx.fill()
      break
    case 'sun':
      ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, size * 0.45, 0, Math.PI * 2); ctx.fill()
      ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, size * 0.08)
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2
        ctx.beginPath()
        ctx.moveTo(x + Math.cos(a) * size * 0.55, y + Math.sin(a) * size * 0.55)
        ctx.lineTo(x + Math.cos(a) * size * 0.85, y + Math.sin(a) * size * 0.85)
        ctx.stroke()
      }
      break
    case 'cloud':
      ctx.fillStyle = color
      ctx.beginPath(); ctx.arc(x, y, size * 0.45, 0, Math.PI * 2)
      ctx.arc(x + size * 0.35, y - size * 0.12, size * 0.55, 0, Math.PI * 2)
      ctx.arc(x + size * 0.6, y, size * 0.4, 0, Math.PI * 2); ctx.fill()
      break
    case 'star':
      ctx.fillStyle = color; drawStar(ctx, x, y, 4, size * 0.55, size * 0.22); ctx.fill()
      break
    case 'bird':
      ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x, y, size * 0.45, size * 0.18, -0.3, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.moveTo(x - size * 0.25, y); ctx.lineTo(x - size * 0.55, y - size * 0.18); ctx.lineTo(x - size * 0.45, y + size * 0.08); ctx.closePath(); ctx.fill()
      break
    case 'bubble':
      ctx.beginPath(); ctx.arc(x, y, size * 0.35, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.2)'; ctx.fill()
      ctx.strokeStyle = 'rgba(255,255,255,0.35)'; ctx.lineWidth = 1; ctx.stroke()
      break
    case 'stone':
      ctx.beginPath(); ctx.ellipse(x, y, size * 0.45, size * 0.28, prng() * Math.PI * 2, 0, Math.PI * 2)
      ctx.fillStyle = color; ctx.fill()
      break
    case 'drop':
      ctx.beginPath(); ctx.arc(x, y, size * 0.18, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill()
      break
    case 'leaf':
      ctx.beginPath(); ctx.ellipse(x, y, size * 0.4, size * 0.18, prng() * Math.PI, 0, Math.PI * 2)
      ctx.fillStyle = color; ctx.fill()
      break
    case 'ball':
      ctx.beginPath(); ctx.arc(x, y, size * 0.35, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.arc(x - size * 0.1, y - size * 0.1, size * 0.1, 0, Math.PI * 2); ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.fill()
      break
    case 'bone':
      ctx.strokeStyle = color; ctx.lineWidth = size * 0.22; ctx.beginPath(); ctx.moveTo(x - size * 0.35, y); ctx.lineTo(x + size * 0.35, y); ctx.stroke()
      ctx.beginPath(); ctx.arc(x - size * 0.35, y - size * 0.08, size * 0.12, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.arc(x - size * 0.35, y + size * 0.08, size * 0.12, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x + size * 0.35, y - size * 0.08, size * 0.12, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.arc(x + size * 0.35, y + size * 0.08, size * 0.12, 0, Math.PI * 2); ctx.fill()
      break
    case 'tree':
      ctx.fillStyle = '#8B4513'; ctx.fillRect(x - size * 0.08, y, size * 0.16, size * 0.5)
      ctx.beginPath(); ctx.arc(x, y - size * 0.15, size * 0.35, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.arc(x - size * 0.2, y, size * 0.25, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill()
      ctx.beginPath(); ctx.arc(x + size * 0.2, y, size * 0.25, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill()
      break
    case 'seaweed':
      ctx.strokeStyle = color; ctx.lineWidth = Math.max(2, size * 0.15)
      ctx.beginPath(); ctx.moveTo(x, y + size * 0.4); ctx.quadraticCurveTo(x + size * 0.2, y, x - size * 0.1, y - size * 0.4); ctx.stroke()
      ctx.beginPath(); ctx.moveTo(x + size * 0.15, y + size * 0.4); ctx.quadraticCurveTo(x - size * 0.1, y, x + size * 0.25, y - size * 0.3); ctx.stroke()
      break
    case 'butterfly':
      ctx.fillStyle = color; ctx.beginPath(); ctx.ellipse(x - size * 0.15, y - size * 0.08, size * 0.2, size * 0.15, -0.3, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(x + size * 0.15, y - size * 0.08, size * 0.2, size * 0.15, 0.3, 0, Math.PI * 2); ctx.fill()
      ctx.beginPath(); ctx.ellipse(x, y, size * 0.04, size * 0.15, 0, 0, Math.PI * 2); ctx.fillStyle = '#333'; ctx.fill()
      break
    case 'gift':
      ctx.fillStyle = color; ctx.fillRect(x - size * 0.2, y - size * 0.15, size * 0.4, size * 0.3)
      ctx.fillStyle = '#FFD700'; ctx.fillRect(x - size * 0.03, y - size * 0.15, size * 0.06, size * 0.3); ctx.fillRect(x - size * 0.2, y - size * 0.03, size * 0.4, size * 0.06)
      ctx.beginPath(); ctx.arc(x, y - size * 0.18, size * 0.1, 0, Math.PI * 2); ctx.fillStyle = '#FF0000'; ctx.fill()
      break
  }
  ctx.restore()
}

function drawCustomKite(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#87CEEB'; ctx.fillRect(0, 0, w, h)
  const cx = w * 0.45, cy = h * 0.35
  ctx.beginPath(); ctx.moveTo(cx, cy - 60); ctx.lineTo(cx + 45, cy); ctx.lineTo(cx, cy + 60); ctx.lineTo(cx - 45, cy); ctx.closePath()
  ctx.fillStyle = '#FF6347'; ctx.fill(); ctx.strokeStyle = '#333'; ctx.lineWidth = 2; ctx.stroke()
  ctx.beginPath(); ctx.moveTo(cx, cy - 60); ctx.lineTo(cx, cy + 60); ctx.strokeStyle = '#FFD700'; ctx.lineWidth = 3; ctx.stroke()
  ctx.beginPath(); ctx.moveTo(cx - 45, cy); ctx.lineTo(cx + 45, cy); ctx.stroke()
  ctx.strokeStyle = '#333'; ctx.lineWidth = 2
  ctx.beginPath(); ctx.moveTo(cx, cy + 60); ctx.lineTo(cx - 10, cy + 90); ctx.lineTo(cx + 10, cy + 120); ctx.lineTo(cx - 5, cy + 150); ctx.stroke()
  ctx.fillStyle = '#FF69B4'; ctx.beginPath(); ctx.arc(cx - 10, cy + 90, 6, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(cx + 10, cy + 120, 6, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.arc(cx - 5, cy + 150, 6, 0, Math.PI*2); ctx.fill()
  ctx.beginPath(); ctx.moveTo(cx, cy + 60); ctx.quadraticCurveTo(cx + 30, cy + 100, cx + 80, cy + 140); ctx.strokeStyle = '#FFF'; ctx.lineWidth = 2; ctx.stroke()
  drawSurroundings(ctx, w, h, 'kite', Math.random)
}

function drawCustomMoonRabbit(ctx: CanvasRenderingContext2D, w: number, h: number): void {
  ctx.fillStyle = '#0D1B2A'; ctx.fillRect(0, 0, w, h)
  const cx = w * 0.5, cy = h * 0.45
  ctx.beginPath(); ctx.arc(cx, cy, 70, 0, Math.PI * 2); ctx.fillStyle = '#FFFACD'; ctx.fill()
  ctx.beginPath(); ctx.arc(cx + 25, cy - 10, 55, 0, Math.PI * 2); ctx.fillStyle = '#0D1B2A'; ctx.fill()
  const rx = cx - 15, ry = cy - 5
  ctx.beginPath(); ctx.ellipse(rx, ry, 18, 22, 0, 0, Math.PI * 2); ctx.fillStyle = '#FFF'; ctx.fill()
  ctx.beginPath(); ctx.arc(rx, ry - 22, 14, 0, Math.PI * 2); ctx.fillStyle = '#FFF'; ctx.fill()
  ctx.beginPath(); ctx.ellipse(rx - 6, ry - 38, 4, 14, -0.3, 0, Math.PI * 2); ctx.fillStyle = '#FFF'; ctx.fill()
  ctx.beginPath(); ctx.ellipse(rx + 6, ry - 38, 4, 14, 0.3, 0, Math.PI * 2); ctx.fillStyle = '#FFF'; ctx.fill()
  ctx.beginPath(); ctx.ellipse(rx - 6, ry - 38, 2, 10, -0.3, 0, Math.PI * 2); ctx.fillStyle = '#FFB6C1'; ctx.fill()
  ctx.beginPath(); ctx.ellipse(rx + 6, ry - 38, 2, 10, 0.3, 0, Math.PI * 2); ctx.fillStyle = '#FFB6C1'; ctx.fill()
  ctx.beginPath(); ctx.arc(rx - 4, ry - 24, 2.5, 0, Math.PI * 2); ctx.fillStyle = '#000'; ctx.fill()
  ctx.beginPath(); ctx.arc(rx + 4, ry - 24, 2.5, 0, Math.PI * 2); ctx.fillStyle = '#000'; ctx.fill()
  ctx.beginPath(); ctx.arc(rx, ry - 19, 2, 0, Math.PI * 2); ctx.fillStyle = '#FF69B4'; ctx.fill()
  ctx.beginPath(); ctx.ellipse(rx - 12, ry - 5, 6, 4, 0.5, 0, Math.PI * 2); ctx.fillStyle = '#FFF'; ctx.fill()
  ctx.beginPath(); ctx.ellipse(rx + 12, ry - 5, 6, 4, -0.5, 0, Math.PI * 2); ctx.fillStyle = '#FFF'; ctx.fill()
  ctx.beginPath(); ctx.arc(rx, ry + 2, 10, 0, Math.PI * 2); ctx.fillStyle = '#D2691E'; ctx.fill()
  ctx.strokeStyle = '#8B4513'; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(rx, ry + 2, 7, 0, Math.PI * 2); ctx.stroke()
  drawSurroundings(ctx, w, h, 'moonrabbit', Math.random)
}

export function generatePieces(
  canvasWidth: number,
  size: number,
  pattern: Pattern,
  prng: () => number = Math.random,
): PuzzlePiece[] {
  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth
  canvas.height = canvasWidth
  const ctx = canvas.getContext('2d')
  if (!ctx) return []

  drawPattern(ctx, canvasWidth, canvasWidth, pattern, prng)

  const pieceSize = canvasWidth / size
  const pieces: PuzzlePiece[] = []
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      const pCanvas = document.createElement('canvas')
      pCanvas.width = pieceSize
      pCanvas.height = pieceSize
      const pCtx = pCanvas.getContext('2d')
      if (!pCtx) continue
      pCtx.drawImage(
        canvas,
        c * pieceSize,
        r * pieceSize,
        pieceSize,
        pieceSize,
        0,
        0,
        pieceSize,
        pieceSize,
      )
      pieces.push({
        correctRow: r,
        correctCol: c,
        correctIndex: r * size + c,
        currentIndex: pieces.length,
        image: pCanvas.toDataURL(),
        locked: false,
      })
    }
  }

  // Shuffle ensuring not already correct
  do {
    for (let i = pieces.length - 1; i > 0; i--) {
      const j = Math.floor(prng() * (i + 1))
      ;[pieces[i], pieces[j]] = [pieces[j], pieces[i]]
    }
  } while (isFullyCorrect(pieces))

  pieces.forEach((p, i) => {
    p.currentIndex = i
  })
  return pieces
}

export function isFullyCorrect(pieces: PuzzlePiece[]): boolean {
  return pieces.every((p, i) => p.correctIndex === i)
}

export function isPieceCorrect(piece: PuzzlePiece, index: number): boolean {
  return piece.correctIndex === index
}
