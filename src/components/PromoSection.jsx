import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import MagneticButton from "./MagneticButton"
import { useStore } from "../context/StoreContext"

export default function PromoSection() {
  const { getDrop } = useStore()
  const drop = getDrop()[0]

  return (
    <section className="relative min-h-[70vh] overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=2200&q=80"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-nova-ink/55" />
      <motion.div
        className="relative z-10 mx-auto flex min-h-[70vh] max-w-5xl flex-col items-center justify-center px-6 py-24 text-center text-white"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      >
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/70">Limited</p>
        <h2 className="mt-6 font-display text-6xl leading-[0.9] md:text-8xl">
          THE NEXT
          <br />
          DROP
        </h2>
        <p className="mt-6 text-lg text-white/80">Limited pieces. Available now.</p>
        {drop && (
          <Link to={`/product/${drop.id}`} className="mt-10">
            <MagneticButton className="bg-white px-8 py-3.5 text-[11px] uppercase tracking-[0.22em] text-nova-ink">
              Shop the drop
            </MagneticButton>
          </Link>
        )}
      </motion.div>
    </section>
  )
}
