import { useRef } from "react"
import { Link } from "react-router-dom"
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion"
import MagneticButton from "./MagneticButton"
import heroImage from "../assets/hero-worlds.png"

export default function Hero() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })
  const y = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 140])
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 1.12])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.35])

  return (
    <section ref={ref} className="relative h-[92vh] min-h-[640px] overflow-hidden">
      <motion.div className="absolute inset-0" style={{ y, scale }}>
        <img
          src={heroImage}
          alt="Five diagonal color panels for Fashion, Tech, Home, Fitness, and Travel, each with a minimal gold icon, joined by a single connecting thread"
          className="h-[115%] w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/25 to-black/10" />
      </motion.div>

      <motion.div
        className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 pt-28 md:px-8 md:pb-24"
        style={{ opacity }}
      >
        <motion.p
          className="text-[11px] uppercase tracking-[0.32em] text-white/75"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          Autumn campaign — 08
        </motion.p>
        <motion.h1
          className="mt-4 max-w-3xl font-display text-[3.4rem] leading-[0.92] text-white sm:text-7xl md:text-[6.2rem]"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          One brand.
          <br />
          <em className="italic">Multiple worlds.</em>
        </motion.h1>
        <motion.p
          className="mt-6 max-w-md text-base leading-relaxed text-white/80"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          Fashion, tech, home, fitness, travel — each with its own atmosphere, all speaking NOVA.
        </motion.p>
        <motion.div
          className="mt-10 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <Link to="/shop">
            <MagneticButton className="bg-white px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-nova-ink transition-colors hover:bg-nova-soft">
              Shop the edit
            </MagneticButton>
          </Link>
          <Link to="/about">
            <MagneticButton className="border border-white/50 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:bg-white/10">
              Read the story
            </MagneticButton>
          </Link>
        </motion.div>
      </motion.div>

      <motion.div
        className="pointer-events-none absolute right-6 top-1/3 hidden max-w-[11rem] border border-white/20 bg-white/10 p-4 text-white backdrop-blur-[2px] md:block"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.8 }}
      >
        <p className="text-[10px] uppercase tracking-[0.22em] text-white/70">Now showing</p>
        <p className="mt-2 font-display text-2xl leading-tight">The Next Drop</p>
        <p className="mt-2 text-xs text-white/70">Limited pieces. Available now.</p>
      </motion.div>
    </section>
  )
}
