import { useState } from "react"
import { Link } from "react-router-dom"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useStore } from "../context/StoreContext"
import { formatPrice } from "../lib/format"
import Reveal from "./Reveal"
import Skeleton from "./Skeleton"
import MagneticButton from "./MagneticButton"

export default function FeaturedCollection() {
  const { getFeatured, getProduct, catalogLoading } = useStore()
  const featured = getFeatured()
  const hero = featured[0] || getProduct("atelier-wool-coat")
  const sellers = featured.length > 1 ? featured.slice(1) : featured
  const [active, setActive] = useState(0)

  if (catalogLoading) {
    return (
      <section className="overflow-hidden bg-nova-bg">
        <div className="grid items-center lg:grid-cols-2">
          <Skeleton className="min-h-[325px] rounded-none lg:h-[650px]" />
          <div className="flex flex-col items-center justify-center gap-4 px-8 py-10">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-40 w-40 rounded-full md:h-48 md:w-48" />
            <Skeleton className="h-6 w-40" />
          </div>
        </div>
      </section>
    )
  }

  if (!hero) return null

  const current = sellers[active] || hero

  const go = (dir) => {
    setActive((i) => (i + dir + sellers.length) % sellers.length)
  }

  return (
    <section className="overflow-hidden bg-nova-bg py-6 md:py-10">
      <div className="mx-auto max-w-[1680px] grid items-center lg:grid-cols-2">
        
        {/* Left Hero Image Wrapper (+25% taller: 500px mobile / 650px desktop) */}
        <Reveal className="relative h-[500px] w-full overflow-hidden rounded-2xl lg:h-[850px]">
          <img
            src={hero.images[0]}
            alt={hero.name}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-0 left-0 p-8 text-white md:p-10">
            <p className="text-[11px] uppercase tracking-[0.28em] text-white/70">Featured</p>
            <h2 className="mt-2 font-display text-4xl md:text-5xl">{hero.name}</h2>
            <Link to={`/product/${hero.id}`} className="mt-5 inline-block">
              <MagneticButton className="bg-white px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-nova-ink">
                View piece — {formatPrice(hero.price)}
              </MagneticButton>
            </Link>
          </div>
        </Reveal>

        {/* Right Section Content */}
        <div className="flex flex-col items-center justify-center px-8 py-8 text-center md:px-14 md:py-10">
          <Reveal delay={0.1} className="max-w-sm">
            <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">
              The house edit
            </p>
            <h3 className="mt-2 font-display text-3xl leading-tight md:text-4xl">
              Objects chosen to live together.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-nova-muted">
              A coat, a lamp, a carry-on — selected not as a set, but as a conversation across worlds.
            </p>
          </Reveal>

          <Reveal delay={0.18} className="mt-6 flex flex-col items-center">
            <p className="text-[10px] uppercase tracking-[0.28em] text-nova-muted">
              Shop our best sellers
            </p>

            <Link
              to={`/product/${current.id}`}
              className="group relative mt-5 grid h-40 w-40 place-items-center overflow-hidden rounded-full bg-nova-ink/5 transition-transform duration-500 hover:scale-[1.03] md:h-48 md:w-48"
            >
              <img
                src={current.images[0]}
                alt={current.name}
                style={{ objectPosition: current.focalPoint || "center" }}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </Link>

            <h4 className="mt-4 font-display text-2xl">{current.name}</h4>
            <p className="mt-1 max-w-xs truncate font-display italic text-nova-muted">
              {current.description.split(".")[0]}
            </p>
            <p className="mt-2 text-sm text-nova-muted">From {formatPrice(current.price)}</p>

            {sellers.length > 1 && (
              <div className="mt-5 flex items-center gap-5">
                <button
                  type="button"
                  aria-label="Previous best seller"
                  onClick={() => go(-1)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-nova-border text-nova-ink transition-colors hover:border-nova-ink"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex items-center gap-2">
                  {sellers.map((product, i) => (
                    <button
                      key={product.id}
                      type="button"
                      aria-label={`Show ${product.name}`}
                      onClick={() => setActive(i)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        i === active ? "w-6 bg-nova-ink" : "w-2 bg-nova-border"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  aria-label="Next best seller"
                  onClick={() => go(1)}
                  className="grid h-9 w-9 place-items-center rounded-full border border-nova-border text-nova-ink transition-colors hover:border-nova-ink"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  )
}