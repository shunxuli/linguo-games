// localStorage mock for happy-dom
const store = new Map<string, string>()

Object.defineProperty(globalThis, 'localStorage', {
  value: {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => { store.set(key, value) },
    removeItem: (key: string) => { store.delete(key) },
    clear: () => { store.clear() },
    get length() { return store.size },
    key: (index: number) => [...store.keys()][index] ?? null,
  },
  writable: true,
  configurable: true,
})

// Minimal canvas mock for vitest / happy-dom
if (typeof HTMLCanvasElement !== 'undefined') {
  const origGetContext = HTMLCanvasElement.prototype.getContext
  HTMLCanvasElement.prototype.getContext = function (...args: Parameters<typeof origGetContext>) {
    if (args[0] === '2d') {
      if (!(this as Record<string, unknown>)._mockContext) {
        (this as Record<string, unknown>)._mockContext = createMock2DContext(this.width, this.height)
      }
      return (this as Record<string, unknown>)._mockContext
    }
    return origGetContext.apply(this, args)
  } as typeof origGetContext

  HTMLCanvasElement.prototype.toDataURL = function () {
    return 'data:image/png;base64,mock'
  }
}

function createMock2DContext(_w: number, _h: number): CanvasRenderingContext2D {
  const ctx = {
    canvas: { width: _w, height: _h },
    fillStyle: '#000',
    strokeStyle: '#000',
    lineWidth: 1,
    globalAlpha: 1,
    save: () => {},
    restore: () => {},
    translate: () => {},
    rotate: () => {},
    scale: () => {},
    beginPath: () => {},
    closePath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    arc: () => {},
    ellipse: () => {},
    rect: () => {},
    fillRect: () => {},
    strokeRect: () => {},
    clearRect: () => {},
    fill: () => {},
    stroke: () => {},
    clip: () => {},
    drawImage: () => {},
    createLinearGradient: () => ({ addColorStop: () => {} }),
    createRadialGradient: () => ({ addColorStop: () => {} }),
    createPattern: () => ({}) as CanvasPattern,
    measureText: () => ({ width: 0 }),
    fillText: () => {},
    strokeText: () => {},
    quadraticCurveTo: () => {},
    bezierCurveTo: () => {},
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    getImageData: (_sx?: number, _sy?: number, _sw?: number, _sh?: number) => ({
      data: new Uint8ClampedArray(),
      width: 0,
      height: 0,
      colorSpace: 'srgb' as PredefinedColorSpace,
    }),
    putImageData: () => {},
    setTransform: () => {},
    transform: () => {},
    resetTransform: () => {},
    isPointInPath: () => false,
    isPointInStroke: () => false,
    getTransform: () => ({ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }) as DOMMatrix,
    createImageData: () => ({ data: new Uint8ClampedArray(), width: 0, height: 0, colorSpace: 'srgb' as PredefinedColorSpace }),
    getContextAttributes: () => ({ alpha: true, colorSpace: 'srgb' as PredefinedColorSpace, desynchronized: false, willReadFrequently: false }),
    setLineDash: () => {},
    getLineDash: () => [],
    roundRect: () => {},
    drawFocusIfNeeded: () => {},
    scrollPathIntoView: () => {},
    reset: () => {},
  }
  return ctx as unknown as CanvasRenderingContext2D
}
