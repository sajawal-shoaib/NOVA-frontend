import { useEffect, useMemo, useRef, useState } from "react"
import { motion } from "framer-motion"
import { ArrowLeft, ArrowRight } from "lucide-react"
import ProductCard from "../components/ProductCard"
import ProductCardSkeleton from "../components/ProductCardSkeleton"
import Reveal from "../components/Reveal"
import { useStore } from "../context/StoreContext"

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price: low to high" },
  { id: "price-desc", label: "Price: high to low" },
  { id: "name", label: "Name A–Z" },
]

export default function Shop() {
  const { products = [], categories = [], catalogLoading } = useStore()
  const [active, setActive] = useState("all")
  const [hoveredCategory, setHoveredCategory] = useState(null)
  const [sort, setSort] = useState("featured")
  const [mounted, setMounted] = useState(false)
  const scroller = useRef(null)

  useEffect(() => {
    setMounted(true)
    window.scrollTo(0, 0)
  }, [])

  const scroll = (dir) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.95, behavior: "smooth" })
  }

  const filtered = useMemo(() => {
    let list = active === "all" ? products : products.filter((p) => p.category === active)
    list = [...list]
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price)
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price)
    if (sort === "name") list.sort((a, b) => a.name.localeCompare(b.name))
    if (sort === "featured") list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    return list
  }, [products, active, sort])

  if (!mounted) return null

  return (
    <div className="px-5 py-16 md:px-8 md:py-20">
      <div className="mx-auto max-w-[1680px]">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">Shop</p>
          <h1 className="mt-3 font-display text-5xl leading-[1.05] md:text-7xl">All worlds, one shelf.</h1>
        </Reveal>

        <div className="mt-10 flex flex-col gap-4 border-y border-nova-border py-5 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {/* All Button */}
            <button
              type="button"
              onClick={() => setActive("all")}
              onMouseEnter={() => setHoveredCategory("all")}
              onMouseLeave={() => setHoveredCategory(null)}
              className="px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-200"
              style={{
                background: active === "all" ? "var(--nova-ink, #000)" : "transparent",
                color:
                  active === "all"
                    ? "#fff"
                    : hoveredCategory === "all"
                    ? "var(--nova-ink, #000)"
                    : "var(--muted, #6b6b67)",
              }}
            >
              All
            </button>

            {/* Dynamic Category Buttons */}
            {categories.map((c) => {
              const isActive = active === c.slug
              const isHovered = hoveredCategory === c.slug
              const accentColor = c.accent || "var(--nova-ink, #000)"

              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActive(c.slug)}
                  onMouseEnter={() => setHoveredCategory(c.slug)}
                  onMouseLeave={() => setHoveredCategory(null)}
                  className="px-4 py-2 text-[11px] font-medium uppercase tracking-[0.16em] transition-colors duration-200"
                  style={{
                    background: isActive ? accentColor : "transparent",
                    color: isActive ? "#fff" : isHovered ? accentColor : "var(--muted, #6b6b67)",
                  }}
                >
                  {c.name}
                </button>
              )
            })}
          </div>

          <label className="flex items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-nova-muted">
            Sort
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="border border-nova-border bg-transparent px-3 py-2 text-nova-ink outline-none"
            >
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-6 hidden justify-end gap-2 sm:flex">
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

        <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {catalogLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="w-full">
                  <ProductCardSkeleton fluid />
                </div>
              ))
            : filtered.map((product, i) => (
                <div key={product.id || product._id || i} className="w-full">
                  <ProductCard product={product} index={i} fluid />
                </div>
              ))}
        </div>

        {!catalogLoading && filtered.length === 0 && (
          <p className="mt-16 text-center text-nova-muted">No pieces in this world yet.</p>
        )}
      </div>
    </div>
  )
}