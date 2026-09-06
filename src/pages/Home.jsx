import Hero from "../components/Hero"
import CategorySection from "../components/CategorySection"
import VideoBanner from "../components/VideoBanner"
import WhoWeAre from "../components/WhoWeAre"
import ProductCarousel from "../components/ProductCarousel"
import FeaturedCollection from "../components/FeaturedCollection"
import BrandStory from "../components/BrandStory"
import ArticleCard from "../components/ArticleCard"
import Newsletter from "../components/Newsletter"
import Reveal from "../components/Reveal"
import { useStore } from "../context/StoreContext"
import { articles } from "../data/articles"

export default function Home() {
  const { getTrending, catalogLoading } = useStore()

  return (
    <>
      <Hero />
      <CategorySection />
      <VideoBanner />
      <WhoWeAre />
      <ProductCarousel
        kicker="Right now"
        title="Trending across worlds"
        products={getTrending()}
        loading={catalogLoading}
      />
      <FeaturedCollection />
      <BrandStory />

      <section className="px-5 py-20 md:px-8 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">Journal</p>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">Field notes from every world</h2>
          </Reveal>
          <div className=" mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {articles.map((article, i) => (
              <Reveal key={article.id} delay={i * 0.08}>
                <ArticleCard article={article} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  )
}
