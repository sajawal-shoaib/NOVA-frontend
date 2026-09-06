import { useEffect, useMemo, useRef } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

const PARTICLE_COUNT = 5500

function FullPageSnakeParticles() {
  const pointsRef = useRef(null)
  const scrollProgress = useRef({ value: 0 }).current
  const lastScrollY = useRef(0)
  const scrollVelocity = useRef(0)
  const accumulatedSpin = useRef(0)

  // Mouse tracking
  const { camera } = useThree()
  const mouse3D = useRef(new THREE.Vector3(-999, -999, 0))
  const hoverRadius = 3.5
  const maxWidthExpansion = 2.2

  // Track scrolling state
  const isScrolling = useRef(false)
  const scrollStopTimer = useRef(null)

  // Individual particle lifespan attributes
  const particleTimers = useRef(new Float32Array(PARTICLE_COUNT))
  const particleLifespans = useRef(new Float32Array(PARTICLE_COUNT))
  const dynamicOpacities = useRef(new Float32Array(PARTICLE_COUNT))

  // Base Data Generation
  const { sizes, targetOpacities, baseOffsets, pathSamples, flowOffsets, flowSpeeds, flowDirections } = useMemo(() => {
    const sz = new Float32Array(PARTICLE_COUNT)
    const op = new Float32Array(PARTICLE_COUNT)
    const offsets = new Float32Array(PARTICLE_COUNT * 3)
    const samples = new Float32Array(PARTICLE_COUNT)
    const fOffsets = new Float32Array(PARTICLE_COUNT)
    const fSpeeds = new Float32Array(PARTICLE_COUNT)
    const fDirections = new Float32Array(PARTICLE_COUNT)

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      samples[i] = Math.random()
      fOffsets[i] = Math.random() * 100
      fSpeeds[i] = Math.random() * 0.0036 + 0.0024
      fDirections[i] = Math.random() < 0.3 ? -1 : 1

      particleTimers.current[i] = Math.random() * 2.0
      particleLifespans.current[i] = 2.0 + Math.random() * 0.5

      const radius = Math.pow(Math.random(), 1.1) * 0.99
      const angle = Math.random() * Math.PI * 2

      offsets[i * 3] = Math.cos(angle) * radius
      offsets[i * 3 + 1] = Math.sin(angle) * radius
      offsets[i * 3 + 2] = (Math.random() - 0.5) * 0.8

      const randType = Math.random()
      if (randType > 0.94) {
        sz[i] = Math.random() * 5 + 4
        op[i] = Math.random() * 0.25 + 0.15
      } else if (randType > 0.70) {
        sz[i] = Math.random() * 2.5 + 2
        op[i] = Math.random() * 0.35 + 0.2
      } else {
        sz[i] = Math.random() * 1.5 + 0.9
        op[i] = Math.random() * 0.45 + 0.25
      }

      dynamicOpacities.current[i] = op[i]
    }

    return {
      sizes: sz,
      targetOpacities: op,
      baseOffsets: offsets,
      pathSamples: samples,
      flowOffsets: fOffsets,
      flowSpeeds: fSpeeds,
      flowDirections: fDirections,
    }
  }, [])

  // Initial Position Calculation
  const positions = useMemo(() => {
    const pos = new Float32Array(PARTICLE_COUNT * 3)
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const t = pathSamples[i]
      const pathAngle = t * Math.PI * 4.5
      pos[i * 3] = Math.sin(pathAngle) * 2.8 + baseOffsets[i * 3]
      pos[i * 3 + 1] = (0.5 - t) * 55 + baseOffsets[i * 3 + 1]
      pos[i * 3 + 2] = baseOffsets[i * 3 + 2]
    }
    return pos
  }, [baseOffsets, pathSamples])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aOpacity;
        varying float vOpacity;
        uniform float uPixelRatio;

        void main() {
          vOpacity = aOpacity;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_PointSize = aSize * uPixelRatio * (12.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vOpacity;

        void main() {
          float d = length(gl_PointCoord - vec2(0.5));
          if (d > 0.5) discard;

          float alpha = smoothstep(0.5, 0.15, d) * vOpacity;
          gl_FragColor = vec4(0.18, 0.18, 0.18, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    })
  }, [])

  const respawnSingleParticle = (index) => {
    pathSamples[index] = Math.random()
    flowOffsets[index] = Math.random() * 100

    const radius = Math.pow(Math.random(), 1.1) * 0.99
    const angle = Math.random() * Math.PI * 2

    baseOffsets[index * 3] = Math.cos(angle) * radius
    baseOffsets[index * 3 + 1] = Math.sin(angle) * radius
    baseOffsets[index * 3 + 2] = (Math.random() - 0.5) * 0.8

    particleTimers.current[index] = 0
    particleLifespans.current[index] = 2.0 + Math.random() * 0.5
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1

      const vector = new THREE.Vector3(x, y, 0.5)
      vector.unproject(camera)
      const dir = vector.sub(camera.position).normalize()
      const distance = -camera.position.z / dir.z
      const pos = camera.position.clone().add(dir.multiplyScalar(distance))

      mouse3D.current.copy(pos)
    }

    const handleScroll = () => {
      const currentScroll = window.scrollY
      const delta = currentScroll - lastScrollY.current

      scrollVelocity.current += delta * 0.00035
      scrollVelocity.current = THREE.MathUtils.clamp(
        scrollVelocity.current,
        -0.08,
        0.08
      )

      lastScrollY.current = currentScroll
      isScrolling.current = true

      if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current)

      scrollStopTimer.current = setTimeout(() => {
        isScrolling.current = false
      }, 150)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Create GSAP ScrollTrigger
    const tween = gsap.to(scrollProgress, {
      value: 1,
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2,
      },
    })

    // ROUTE FIX 1: Delayed refresh after layout updates on new page
    const refreshTimer = setTimeout(() => {
      ScrollTrigger.refresh()
    }, 150)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(refreshTimer)
      if (scrollStopTimer.current) clearTimeout(scrollStopTimer.current)

      // ROUTE FIX 2: Completely kill old ScrollTriggers when page unmounts
      tween.scrollTrigger?.kill()
      tween.kill()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [scrollProgress, camera])

  useFrame((state, delta) => {
    const progress = scrollProgress.value
    const clockTime = state.clock.getElapsedTime()

    if (pointsRef.current) {
      pointsRef.current.position.y = progress * 42

      accumulatedSpin.current += scrollVelocity.current
      scrollVelocity.current *= 0.88

      const geom = pointsRef.current.geometry
      const posAttr = geom.attributes.position
      const opAttr = geom.attributes.aOpacity

      const groupY = pointsRef.current.position.y

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        if (!isScrolling.current) {
          particleTimers.current[i] += delta
          const timer = particleTimers.current[i]
          const maxLife = particleLifespans.current[i]

          const fadeTime = 0.4

          if (timer >= maxLife) {
            respawnSingleParticle(i)
            dynamicOpacities.current[i] = 0
          } else if (timer >= maxLife - fadeTime) {
            const fadeProgress = (timer - (maxLife - fadeTime)) / fadeTime
            dynamicOpacities.current[i] = targetOpacities[i] * (1.0 - fadeProgress)
          } else if (timer <= fadeTime) {
            const fadeProgress = timer / fadeTime
            dynamicOpacities.current[i] = targetOpacities[i] * fadeProgress
          } else {
            dynamicOpacities.current[i] = targetOpacities[i]
          }
        } else {
          dynamicOpacities.current[i] = targetOpacities[i]
        }

        const direction = flowDirections[i]
        const flowTime = clockTime * flowSpeeds[i] * direction + flowOffsets[i]

        let t = (pathSamples[i] + (flowTime % 1)) % 1
        if (t < 0) t += 1

        const angle = t * Math.PI * 4.5
        const pathX = Math.sin(angle) * 2.8
        const pathY = (0.5 - t) * 55

        const worldCenterPointX = pathX
        const worldCenterPointY = pathY + groupY

        const dx = worldCenterPointX - mouse3D.current.x
        const dy = worldCenterPointY - mouse3D.current.y
        const distToCenterPath = Math.sqrt(dx * dx + dy * dy)

        let widthMultiplier = 1.0
        if (distToCenterPath < hoverRadius) {
          const hoverIntensity = 1.0 - distToCenterPath / hoverRadius
          widthMultiplier = 1.0 + hoverIntensity * (maxWidthExpansion - 1.0)
        }

        const ox = baseOffsets[i * 3] * widthMultiplier
        const oy = baseOffsets[i * 3 + 1] * widthMultiplier
        const oz = baseOffsets[i * 3 + 2]

        const currentSpin = accumulatedSpin.current
        const rotatedX = ox * Math.cos(currentSpin) - oy * Math.sin(currentSpin)
        const rotatedY = ox * Math.sin(currentSpin) + oy * Math.cos(currentSpin)

        posAttr.array[i * 3] = pathX + rotatedX
        posAttr.array[i * 3 + 1] = pathY + rotatedY
        posAttr.array[i * 3 + 2] = oz

        opAttr.array[i] = dynamicOpacities.current[i]
      }

      posAttr.needsUpdate = true
      opAttr.needsUpdate = true
    }
  })

  return (
    <points ref={pointsRef} material={material}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-aSize"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
        <bufferAttribute
          attach="attributes-aOpacity"
          count={dynamicOpacities.current.length}
          array={dynamicOpacities.current}
          itemSize={1}
        />
      </bufferGeometry>
    </points>
  )
}

export default function SnakeParticleField({ className = "" }) {
  return (
    <div
      aria-hidden="true"
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 8.5], fov: 45, near: 0.1, far: 100 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
      >
        <FullPageSnakeParticles />
      </Canvas>
    </div>
  )
}