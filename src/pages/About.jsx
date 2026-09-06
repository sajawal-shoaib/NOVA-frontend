import { lazy, Suspense } from "react"
import BrandStory from "../components/BrandStory"
import ExploreCategories from "../components/ExploreCategories"
import ArticleCard from "../components/ArticleCard"
import Reveal from "../components/Reveal"
import Newsletter from "../components/Newsletter"
import { articles } from "../data/articles"

// three.js + gsap are large — code-split so only the About/Discover page
// pays for this bundle, not every page on the site.
const SnakeParticleField = lazy(() => import("../components/SnakeParticleField"))

const VALUES = [
  {
    title: "One grammar",
    body: "Spacing, type, and motion stay constant so every world still feels like NOVA.",
  },
  {
    title: "Five atmospheres",
    body: "Fashion, tech, home, fitness, and travel each carry their own color, mood, and pace.",
  },
  {
    title: "Slow by design",
    body: "Fewer releases, held to a higher bar. We'd rather be right than fast.",
  },
]

export default function About() {
  return (
    <div>
      <Suspense fallback={null}>
        <SnakeParticleField />
      </Suspense>

      <div className="relative z-10">
        <section className="px-5 pb-4 pt-20 md:px-8 md:pt-28">
          <div className="mx-auto max-w-4xl text-center">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">About</p>
              <h1 className="mt-4 font-display text-5xl leading-[1.05] md:text-7xl">
                One brand. Multiple worlds.
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-nova-muted">
                NOVA is a neutral house that lets five categories keep their own weather — while
                sharing one language of spacing, type, and motion underneath.
              </p>
            </Reveal>
          </div>
        </section>

        <BrandStory />

        <section className="border-t border-nova-border px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
            {VALUES.map((v, i) => (
              <Reveal key={v.title} delay={i * 0.1}>
                <span className="font-display text-3xl text-nova-muted">0{i + 1}</span>
                <h3 className="mt-4 font-display text-2xl">{v.title}</h3>
                <p className="mt-3 text-nova-muted">{v.body}</p>
              </Reveal>
            ))}
          </div>
        </section>

        <ExploreCategories />

        <section className="px-5 py-20 md:px-8 md:py-28">
          <div className="mx-auto max-w-7xl">
            <Reveal>
              <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">Journal</p>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">Notes from the house</h2>
            </Reveal>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
              {articles.map((article, i) => (
                <Reveal key={article.id} delay={i * 0.08}>
                  <ArticleCard article={article} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <Newsletter />
      </div>
    </div>
  )
}
