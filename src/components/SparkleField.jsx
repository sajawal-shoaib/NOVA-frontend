import { useEffect, useRef } from "react"

export default function SparkleField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")

    let width = window.innerWidth
    let height = window.innerHeight
    let dpr = Math.min(window.devicePixelRatio || 1, 2)

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener("resize", resize)

    // Dynamically fetch current accent color from CSS
    const getActiveAccent = () => {
      const val = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()
      return val || "#5b5ce2"
    }

    const AMBIENT_COUNT = Math.min(70, Math.round((width * height) / 16000))
    const rand = (min, max) => min + Math.random() * (max - min)

    const makeAmbientParticle = () => ({
      kind: "ambient",
      x: rand(0, width),
      y: rand(0, height),
      r: rand(0.6, 1.8),
      vx: rand(-0.06, 0.06),
      vy: rand(-0.09, -0.02),
      baseAlpha: rand(0.15, 0.5),
      twinkleSpeed: rand(0.0006, 0.0018),
      twinklePhase: rand(0, Math.PI * 2),
      color: getActiveAccent(),
    })

    const particles = Array.from({ length: AMBIENT_COUNT }, makeAmbientParticle)

    let lastSpawn = 0
    const onPointerMove = (e) => {
      const x = e.clientX
      const y = e.clientY
      const now = performance.now()
      if (now - lastSpawn < 30) return
      lastSpawn = now

      const currentAccent = getActiveAccent()
      const count = 1 + Math.round(Math.random())

      for (let i = 0; i < count; i++) {
        particles.push({
          kind: "trail",
          x: x + rand(-4, 4),
          y: y + rand(-4, 4),
          r: rand(1, 2.6),
          vx: rand(-0.35, 0.35),
          vy: rand(-0.5, -0.1),
          bornAt: now,
          life: rand(700, 1300),
          color: currentAccent, // Stores color at moment of mouse move
        })
      }
    }

    window.addEventListener("pointermove", onPointerMove, { passive: true })

    let rafId
    const tick = (t) => {
      ctx.clearRect(0, 0, width, height)

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        if (p.kind === "ambient") {
          p.x += p.vx
          p.y += p.vy
          if (p.x < -10) p.x = width + 10
          if (p.x > width + 10) p.x = -10
          if (p.y < -10) {
            p.y = height + 10
            p.x = rand(0, width)
          }
          const alpha = p.baseAlpha * (0.6 + 0.4 * Math.sin(t * p.twinkleSpeed + p.twinklePhase))
          drawDot(ctx, p.x, p.y, p.r, getActiveAccent(), Math.max(alpha, 0))
        } else {
          const age = t - p.bornAt
          if (age >= p.life) {
            particles.splice(i, 1)
            continue
          }
          p.x += p.vx
          p.y += p.vy
          p.vy -= 0.001
          const progress = age / p.life
          const alpha = 0.85 * (1 - progress)
          const r = p.r * (1 - progress * 0.4)
          drawDot(ctx, p.x, p.y, r, p.color, alpha)
        }
      }

      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointerMove)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-40"
    />
  )
}

function drawDot(ctx, x, y, r, color, alpha) {
  if (alpha <= 0 || r <= 0) return
  ctx.save()
  ctx.globalAlpha = alpha
  ctx.shadowColor = color
  ctx.shadowBlur = r * 4
  ctx.fillStyle = color
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}