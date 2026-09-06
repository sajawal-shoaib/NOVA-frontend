import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Search as SearchIcon } from "lucide-react"
import ProductCard from "../components/ProductCard"
import Reveal from "../components/Reveal"
import { useStore } from "../context/StoreContext"

export default function SearchPage() {
  const [params, setParams] = useSearchParams()
  const { searchProducts } = useStore()
  const initial = params.get("q") || ""
  const [query, setQuery] = useState(initial)
  const results = searchProducts(query)

  const onSubmit = (e) => {
    e.preventDefault()
    setParams(query ? { q: query } : {})
  }

  return (
    <div className="mx-auto max-w-[1680px] px-5 py-16 md:px-8 md:py-20">
      <Reveal>
        <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">Search</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Find your piece.</h1>
      </Reveal>

      <form onSubmit={onSubmit} className="mt-10 flex items-center gap-4 border-b border-nova-ink pb-4 md:max-w-xl">
        <SearchIcon size={20} className="shrink-0 text-nova-muted" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search pieces, objects, worlds..."
          className="w-full bg-transparent font-display text-2xl outline-none placeholder:text-nova-muted"
        />
      </form>

      <p className="mt-6 text-sm text-nova-muted">
        {query ? `${results.length} result${results.length === 1 ? "" : "s"} for "${query}"` : "Start typing to search."}
      </p>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {results.map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} fluid />
        ))}
      </div>
    </div>
  )
}
