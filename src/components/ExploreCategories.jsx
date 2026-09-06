import { Link } from "react-router-dom"
import { ArrowUpRight } from "lucide-react"
import { useStore } from "../context/StoreContext"
import Skeleton from "./Skeleton"
import Reveal from "./Reveal"

export default function ExploreCategories() {
  const { categories, catalogLoading } = useStore()

  return (
    <section className="border-y border-nova-border bg-transparent px-5 py-20 md:px-8 md:py-24">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">Explore</p>
          <h2 className="mt-3 font-display text-4xl md:text-5xl">Choose an atmosphere</h2>
        </Reveal>

        {/* Updated grid container with gap and padding */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
          {catalogLoading
            ? Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="min-h-[380px] rounded-2xl" />
              ))
            : categories.map((c) => (
                <Link
                  key={c.id}
                  to={`/category/${c.slug}`}
                  onMouseEnter={() => {
                    if (c.accent) {
                      document.documentElement.style.setProperty("--accent", c.accent)
                    }
                  }}
                  className="group relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-2xl border border-nova-border/60 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-black/20 hover:shadow-xl dark:bg-black/40"
                >
                  {/* Background Image with Scale Effect */}
                  <div className="absolute inset-0 z-0 overflow-hidden">
                    <img
                      src={c.portrait}
                      alt={c.name}
                      loading="lazy"
                      className="h-full w-full object-cover opacity-90 transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                    {/* Dark Gradient Overlay for High Text Contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/10 transition-opacity duration-300 group-hover:opacity-90" />
                  </div>

                  {/* Top Badge Tag & Accent Arrow */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-md">
                      Atmosphere
                    </span>
                    <div
                      className="grid h-8 w-8 place-items-center rounded-full text-white backdrop-blur-md transition-all duration-300 group-hover:bg-white group-hover:text-black"
                      style={{ background: "rgba(255, 255, 255, 0.15)" }}
                    >
                      <ArrowUpRight size={15} />
                    </div>
                  </div>

                  {/* Bottom Text Details */}
                  <div className="relative z-10">
                    <span
                      className="mb-3 block h-0.5 w-8 transition-all duration-300 group-hover:w-14"
                      style={{ background: c.accent || "#ffffff" }}
                    />
                    <h3 className="font-display text-2xl font-semibold text-white transition-transform duration-300 group-hover:-translate-y-1">
                      {c.name}
                    </h3>
                    <p className="mt-1 text-xs text-white/80 transition-colors duration-300 group-hover:text-white">
                      {c.mood}
                    </p>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </section>
  )
}