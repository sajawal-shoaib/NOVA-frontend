import { useEffect, useRef, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import { Search, X, Sparkles, Loader2 } from "lucide-react"
import { useStore } from "../context/StoreContext"
import { formatPrice } from "../lib/format"
import ProductCard from "./ProductCard"

export default function SearchOverlay() {
  const { searchOpen, setSearchOpen, searchProducts, products = [] } = useStore()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [aiIntent, setAiIntent] = useState(null)
  const [loading, setLoading] = useState(false)
  const inputRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    if (searchOpen) {
      const t = window.setTimeout(() => inputRef.current?.focus(), 150)
      return () => window.clearTimeout(t)
    }
    setQuery("")
    setResults([])
    setAiIntent(null)
  }, [searchOpen])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setSearchOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [setSearchOpen])

  // AI Smart Search + Fallback Logic
  useEffect(() => {
    const cleanQuery = query.trim()
    if (!cleanQuery) {
      setResults([])
      setAiIntent(null)
      setLoading(false)
      return
    }

    // Immediate fallback search using local function
    const localResults = searchProducts ? searchProducts(cleanQuery) : []
    setResults(localResults.slice(0, 10))

    // Deterministic price extraction as ground truth: never trust the LLM
    // alone for a hard numeric constraint like "under $200" — regex it
    // directly from the query too, and prefer that whenever it's found.
    const priceMatch = cleanQuery
      .toLowerCase()
      .match(/(?:under|below|less than|up to|no more than|max)\s*\$?\s*(\d+)|\$?\s*(\d+)\s*(?:or less|and under|max)/)
    const regexMaxPrice = priceMatch ? Number(priceMatch[1] || priceMatch[2]) : null

    const timer = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch("http://localhost:5000/api/ai/parse-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: cleanQuery }),
        })

        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`)

        const intent = await res.json()

        // Prefer the regex-extracted price (100% reliable for explicit
        // "under $X" phrasing) over whatever the AI returned — the AI
        // only fills in when the query implies a budget without a
        // literal number pattern we can catch deterministically.
        const aiMaxPrice = intent.maxPrice ? Number(intent.maxPrice) : null
        const maxPrice = regexMaxPrice ?? (Number.isNaN(aiMaxPrice) ? null : aiMaxPrice)

        // Clean keywords: strip stray numbers/price-language, but do NOT
        // inject a broad clothing-synonym list — the AI prompt already
        // asks Gemini for synonyms, and re-expanding here was matching
        // completely unrelated items (e.g. "dress" pulling in "pant shirt")
        // any time a clothing-adjacent word appeared anywhere.
        const cleanKeywords = (intent.keywords || [])
          .map((k) => k.toLowerCase())
          .filter(
            (word) =>
              !/^\d+$/.test(word) &&
              !["under", "below", "less", "cheap", "than", "dollar", "dollars", "up", "to", "max"].includes(word),
          )

        const cleanCategory = intent.category ? intent.category.toLowerCase() : null

        setAiIntent({
          ...intent,
          maxPrice,
          keywords: cleanKeywords,
          category: cleanCategory,
        })

        const allItems = products.length > 0 ? products : localResults

        // Price is a HARD constraint — applied first, and never relaxed
        // by any fallback below. Nothing over budget should ever appear,
        // even if that means showing fewer results (or none).
        const withinBudget =
          maxPrice && !Number.isNaN(maxPrice)
            ? allItems.filter((p) => Number(p.price) <= maxPrice)
            : allItems

        const hasCriteria = cleanKeywords.length > 0 || !!cleanCategory

        const aiMatched = !hasCriteria
          ? withinBudget
          : withinBudget.filter((product) => {
              const productText = `${product.name || product.title || ""} ${
                product.description || ""
              } ${product.category || ""} ${product.type || ""} ${product.slug || ""}`.toLowerCase()

              const matchesKeyword = cleanKeywords.some((word) => {
                const rootWord = word.endsWith("s") ? word.slice(0, -1) : word
                return productText.includes(word) || productText.includes(rootWord)
              })
              const matchesCategory = cleanCategory ? productText.includes(cleanCategory) : false

              return matchesKeyword || matchesCategory
            })

        // Only fall back to the naive local results when there was no
        // price constraint at all — if the user asked for something
        // under a budget, an empty (correct) result beats a wrong one.
        if (aiMatched.length > 0 || maxPrice) {
          setResults(aiMatched.slice(0, 10))
        } else {
          setResults(localResults.slice(0, 10))
        }
      } catch (error) {
        console.error("AI Search Error:", error)
      } finally {
        setLoading(false)
      }
    }, 400)

    return () => clearTimeout(timer)
  }, [query, searchProducts, products])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/search?q=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
  }

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          className="fixed inset-0 z-[80] flex flex-col bg-nova-bg/98 backdrop-blur"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-label="Search"
        >
          <div className="mx-auto flex w-full min-h-0 max-w-5xl flex-1 flex-col px-6 pt-24 md:pt-32">
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="absolute right-6 top-6 grid h-11 w-11 place-items-center transition-colors hover:text-[var(--accent)] md:right-8 md:top-8"
            >
              <X size={22} />
            </button>

            <div className="mx-auto w-full max-w-2xl">
              <motion.form
                onSubmit={onSubmit}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center gap-4 border-b border-nova-ink pb-4"
              >
                <Search size={22} className="shrink-0 text-nova-muted" />
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search pieces, objects, worlds..."
                  style={{ outline: "none", boxShadow: "none" }}
                  className="w-full border-none bg-transparent font-display text-3xl placeholder:text-nova-muted focus:outline-none focus:ring-0 md:text-4xl"
                />
                {loading ? (
                  <Loader2 size={20} className="animate-spin shrink-0 text-nova-muted" />
                ) : (
                  <Sparkles size={20} className="shrink-0 text-nova-muted opacity-60" />
                )}
              </motion.form>

              {/* AI Active Filters/Badges */}
              {aiIntent && (aiIntent.maxPrice || aiIntent.category) && (
                <div className="mt-3 flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-nova-muted flex items-center gap-1">
                    <Sparkles size={12} /> AI Filtered:
                  </span>
                  {aiIntent.maxPrice && (
                    <span className="rounded-full bg-nova-border/60 px-2.5 py-0.5 text-xs text-nova-ink">
                      Under {formatPrice(aiIntent.maxPrice)}
                    </span>
                  )}
                  {aiIntent.category && (
                    <span className="rounded-full bg-nova-border/60 px-2.5 py-0.5 text-xs text-nova-ink">
                      Category: {aiIntent.category}
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 min-h-0 flex-1 overflow-y-auto pb-16">
              {!query.trim() && (
                <p className="text-center text-xs uppercase tracking-[0.2em] text-nova-muted">
                  Type to start smart searching...
                </p>
              )}

              {query.trim() && results.length === 0 && !loading && (
                <p className="text-center text-nova-muted">No pieces match "{query}" yet.</p>
              )}

              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
                {results.map((product, i) => (
                  <motion.div
                    key={product.id || product._id || i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                    onClick={() => setSearchOpen(false)}
                  >
                    <ProductCard product={product} index={i} fluid />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}