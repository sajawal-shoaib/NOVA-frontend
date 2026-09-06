import { useRef } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import ProductCard from "./ProductCard"
import ProductCardSkeleton from "./ProductCardSkeleton"

export default function ProductCarousel({ title, kicker, products, loading = false }) {
  const scroller = useRef(null)

  const scroll = (dir) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * 340, behavior: "smooth" })
  }

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-7xl items-end justify-between px-5 md:px-8">
        <div>
          {kicker && (
            <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">{kicker}</p>
          )}
          <h2 className="mt-3 font-display text-4xl md:text-5xl">{title}</h2>
        </div>
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
      </div>
      <div
        ref={scroller}
        className="hide-scrollbar mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 md:px-8"
      >
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex snap-start">
                <ProductCardSkeleton />
              </div>
            ))
          : products.map((product, i) => (
              <div key={product.id} className="flex snap-start">
                <ProductCard product={product} index={i} />
              </div>
            ))}
      </div>
    </section>
  )
}
