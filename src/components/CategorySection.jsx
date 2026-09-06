import { useRef } from "react"
import { ArrowLeft, ArrowRight } from "lucide-react"
import CategoryCard from "./CategoryCard"
import CategoryCardSkeleton from "./CategoryCardSkeleton"
import { useStore } from "../context/StoreContext"
import Reveal from "./Reveal"

export default function CategorySection() {
  const scroller = useRef(null)
  const { categories, catalogLoading } = useStore()

  const scroll = (dir) => {
    const el = scroller.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" })
  }

  return (
    <section className="py-20 md:py-28">
      <div className="mx-auto flex max-w-[1680px] items-end justify-between px-5 md:px-8">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">Worlds</p>
          <h2 className="mt-3 max-w-2xl font-display text-4xl leading-[1.1] md:text-6xl">
            Five atmospheres. One language.
          </h2>
        </Reveal>
        <div className="hidden gap-2 sm:flex">
          <button
            type="button"
            aria-label="Scroll categories left"
            onClick={() => scroll(-1)}
            className="grid h-11 w-11 place-items-center border border-nova-border transition-colors hover:border-nova-ink"
          >
            <ArrowLeft size={16} />
          </button>
          <button
            type="button"
            aria-label="Scroll categories right"
            onClick={() => scroll(1)}
            className="grid h-11 w-11 place-items-center border border-nova-border transition-colors hover:border-nova-ink"
          >
            <ArrowRight size={16} />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="hide-scrollbar mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto px-5 pb-4 md:px-8"
      >
        {catalogLoading
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="w-[85%] shrink-0 snap-start sm:w-[55%] lg:w-[calc((100%-4rem)/3)]">
                <CategoryCardSkeleton large />
              </div>
            ))
          : categories.map((category) => (
              <div
                key={category.id}
                className="w-[85%] shrink-0 snap-start sm:w-[55%] lg:w-[calc((100%-4rem)/3)]"
              >
                <CategoryCard category={category} large />
              </div>
            ))}
      </div>
    </section>
  )
}
