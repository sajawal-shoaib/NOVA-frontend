import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Sparkles, Compass, Layers } from "lucide-react"
import Reveal from "./Reveal"
import MagneticButton from "./MagneticButton"

const FLOATERS = [
  { Icon: Sparkles, className: "left-[8%] top-[18%]", size: 22, delay: 0 },
  { Icon: Compass, className: "right-[10%] top-[22%]", size: 26, delay: 0.6 },
  { Icon: Layers, className: "left-[12%] bottom-[16%]", size: 20, delay: 1.1 },
  { Icon: Sparkles, className: "right-[14%] bottom-[20%]", size: 16, delay: 1.6 },
]

export default function WhoWeAre() {
  return (
    <section className="px-5 py-16 md:px-8 md:py-24">
      <Reveal className="relative mx-auto max-w-7xl overflow-hidden rounded-[3rem] bg-nova-soft px-6 py-20 text-center sm:rounded-[4rem] md:py-28">
        {FLOATERS.map(({ Icon, className, size, delay }, i) => (
          <motion.span
            key={i}
            className={`pointer-events-none absolute hidden text-[var(--accent)]/40 sm:block ${className}`}
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay }}
          >
            <Icon size={size} />
          </motion.span>
        ))}

        <p className="text-[11px] uppercase tracking-[0.32em] text-nova-ink/60">Who we are</p>
        <h2 className="mx-auto mt-4 max-w-xl font-display text-4xl leading-[1.1] md:text-6xl">
          One house. Five worlds. No noise.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-nova-muted">
          NOVA designs the grammar — spacing, type, and motion — and lets fashion, tech, home,
          fitness, and travel speak in their own accents.
        </p>
        <Link to="/about" className="mt-8 inline-block">
          <MagneticButton className="bg-nova-ink px-8 py-3.5 text-[11px] uppercase tracking-[0.22em] text-white">
            About NOVA
          </MagneticButton>
        </Link>
      </Reveal>
    </section>
  )
}
