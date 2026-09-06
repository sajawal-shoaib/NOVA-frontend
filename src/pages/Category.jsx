import { useEffect, useRef } from "react"
import { Navigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import ProductCard from "../components/ProductCard"
import ProductCardSkeleton from "../components/ProductCardSkeleton"
import Skeleton from "../components/Skeleton"
import Reveal from "../components/Reveal"
import SparkleField from "../components/SparkleField"
import { useStore } from "../context/StoreContext"

export default function Category() {
  const { slug } = useParams()
  const { getCategory, getProductsByCategory, catalogLoading } = useStore()
  const category = getCategory(slug)
  const products = category ? getProductsByCategory(category.slug) : []
  const scroller = useRef(null)

  const scroll = (dir) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.95, behavior: "smooth" })
  }

  useEffect(() => {
    if (category) {
      document.documentElement.setAttribute("data-theme", category.slug)
      if (category.accent) {
        document.documentElement.style.setProperty("--accent", category.accent)
      }
    }
    return () => document.documentElement.removeAttribute("data-theme")
  }, [category])

  if (catalogLoading) {
    return (
      <div>
        <div className="relative flex h-[62vh] min-h-[440px] items-end overflow-hidden bg-nova-bg">
          <div className="relative z-10 mx-auto w-full max-w-[1680px] px-5 pb-14 md:px-8">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-4 h-16 w-64 md:h-20 md:w-96" />
            <Skeleton className="mt-4 h-4 w-full max-w-lg" />
          </div>
        </div>
        <section className="px-5 py-16 md:px-8 md:py-24">
          <div className="mx-auto max-w-[1680px]">
            <Skeleton className="h-9 w-32" />
            <div className="mt-8 flex gap-8 overflow-hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="w-[85%] shrink-0 sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]">
                  <ProductCardSkeleton fluid />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  }
  if (!category) return <Navigate to="/shop" replace />

  return (
    <div data-theme={category.slug}>
      {/* Sparkles render here ONLY on category pages using this category's color */}
      <SparkleField color={category.accent} />

      <section className="relative flex h-[62vh] min-h-[440px] items-end overflow-hidden">
        <motion.img
          key={category.id}
          src={category.image}
          alt=""
          initial={{ scale: 1.08, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/5" />
        <div className="relative z-10 mx-auto w-full max-w-[1680px] px-5 pb-14 text-white md:px-8">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-[11px] uppercase tracking-[0.3em] text-white/75"
          >
            {category.mood}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mt-3 font-display text-6xl leading-[0.95] md:text-8xl"
          >
            {category.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="mt-4 max-w-lg text-white/85"
          >
            {category.tagline} {category.description}
          </motion.p>
        </div>
      </section>

      <section className="px-5 py-16 md:px-8 md:py-24">
        <div className="mx-auto max-w-[1680px]">
          <Reveal className="flex items-end justify-between">
            <h2 className="font-display text-3xl md:text-4xl">
              {products.length} {products.length === 1 ? "piece" : "pieces"}
            </h2>
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                aria-label="Scroll products left"
                onClick={() => scroll(-1)}
                className="grid h-11 w-11 place-items-center border border-nova-border transition-colors hover:border-nova-ink"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                aria-label="Scroll products right"
                onClick={() => scroll(1)}
                className="grid h-11 w-11 place-items-center border border-nova-border transition-colors hover:border-nova-ink"
              >
                <ArrowRight size={16} />
              </button>
            </div>
          </Reveal>
          <div
            ref={scroller}
            className="hide-scrollbar mt-8 flex snap-x snap-mandatory gap-8 overflow-x-auto pb-6"
          >
            {products.map((product, i) => (
              <div key={product.id} className="w-[85%] shrink-0 snap-start sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]">
                <ProductCard product={product} index={i} fluid />
              </div>
            ))}
          </div>
          {products.length === 0 && (
            <p className="mt-10 text-nova-muted">New pieces for this world are on their way.</p>
          )}
        </div>
      </section>
    </div>
  )
}