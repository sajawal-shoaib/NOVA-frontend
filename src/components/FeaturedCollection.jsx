import { useMemo } from "react"
import { Link } from "react-router-dom"
import { useStore } from "../context/StoreContext"
import { formatPrice } from "../lib/format"
import Reveal from "./Reveal"
import Skeleton from "./Skeleton"

export default function FeaturedCollection() {
  const { products = [], catalogLoading } = useStore()

  const uniqueCategoryCards = useMemo(() => {
    const categoriesSeen = new Set()
    const result = []

    for (const product of products) {
      const cat = product.category || "default"
      if (!categoriesSeen.has(cat)) {
        categoriesSeen.add(cat)
        result.push(product)
      }
      if (result.length === 5) break
    }

    return result
  }, [products])

  if (catalogLoading) {
    return (
      <section className="bg-nova-bg px-5 py-12 md:px-8">
        <div className="mx-auto max-w-[1680px]">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-2xl" />
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (uniqueCategoryCards.length === 0) return null

  return (
    <section className="bg-nova-bg px-5 py-16 md:px-8">
      <div className="mx-auto max-w-[1680px]">
        <Reveal className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">
            Right now
          </p>
          <h2 className="mt-2 font-display text-3xl md:text-5xl">
            Trending across worlds
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-5">
          {uniqueCategoryCards.map((product, i) => (
            <Reveal key={product.id || product._id || i} delay={0.06 * i}>
              <Link
                to={`/product/${product.id || product._id}`}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-nova-border/60 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-nova-ink/20 hover:shadow-xl"
              >
                {/* Category Pill */}
                <span className="absolute left-6 top-6 z-10 rounded-full bg-white/80 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-wider text-nova-ink backdrop-blur-md">
                  {product.category}
                </span>

                {/* Image Wrapper */}
                <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-50">
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name || product.title}
                    className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                </div>

                {/* Content */}
                <div className="mt-4 flex flex-1 flex-col justify-between">
                  <h3 className="line-clamp-1 font-display text-base font-medium text-nova-ink transition-colors group-hover:text-black">
                    {product.name || product.title}
                  </h3>
                  <div className="mt-2 flex items-center justify-between border-t border-nova-border/40 pt-2">
                    <p className="text-sm font-semibold text-nova-ink">
                      {formatPrice(product.price)}
                    </p>
                    <span className="text-[11px] font-medium text-nova-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-nova-ink">
                      Explore &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}