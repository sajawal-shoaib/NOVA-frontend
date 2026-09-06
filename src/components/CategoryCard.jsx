import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowUpRight } from "lucide-react"

export default function CategoryCard({ category, large = false }) {
  return (
    <div className="relative pb-3 pr-3">
      <motion.div
        initial={{ x: 0, y: 0 }}
        whileHover={{ x: -5, y: -5 }}
        whileTap={{ x: 0, y: 0 }}
        transition={{ type: "spring", stiffness: 380, damping: 22 }}
        style={{ boxShadow: `8px 10px 0 0 ${category.accent}` }}
        className="relative rounded-[28px]"
      >
        <Link
          to={`/category/${category.slug}`}
          className={`group relative block overflow-hidden rounded-[28px] ${large ? "min-h-[420px] md:min-h-[520px]" : "min-h-[340px] md:min-h-[420px]"}`}
        >
          <img
            src={category.image}
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10 transition-colors duration-500 group-hover:from-black/80"
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            style={{ background: `linear-gradient(180deg, transparent 40%, ${category.accent}55)` }}
            aria-hidden="true"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-7 md:p-9">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/70">
              {category.mood}
            </p>
            <h3 className="mt-2 font-display text-4xl text-white transition-transform duration-500 group-hover:-translate-y-1 md:text-5xl">
              {category.name}
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/80">
              {category.tagline}
            </p>
            <motion.span
              className="mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.2em] text-white"
              initial={false}
            >
              <span className="translate-x-0 transition-transform duration-400 group-hover:translate-x-1">
                Enter the world
              </span>
              <ArrowUpRight size={14} className="transition-transform duration-400 group-hover:translate-x-1 group-hover:-translate-y-0.5" />
            </motion.span>
          </div>
        </Link>
      </motion.div>
    </div>
  )
}
