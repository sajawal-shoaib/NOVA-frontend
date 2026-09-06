import { useEffect, useRef, useState } from "react"
import { Navigate, useParams } from "react-router-dom"
import { motion } from "framer-motion"
import { Heart, Minus, Plus } from "lucide-react"
import { formatPrice } from "../lib/format"
import { useStore } from "../context/StoreContext"
import MagneticButton from "./../components/MagneticButton"
import ProductCarousel from "../components/ProductCarousel"
import Reveal from "../components/Reveal"
import Skeleton from "../components/Skeleton"

export default function Product() {
  const { id } = useParams()
  const { getProduct, getCategory, getProductsByCategory, catalogLoading, addToCart, toggleWishlist, isWishlisted } =
    useStore()
  const product = getProduct(id)
  const [activeImage, setActiveImage] = useState(0)
  const [variant, setVariant] = useState(product?.variants?.[0])
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const btnRef = useRef(null)

  // The catalog loads asynchronously, so `product` can go from undefined to
  // defined after this component has already mounted — make sure the
  // default variant/image selection catches up when that happens.
  useEffect(() => {
    if (product && variant === undefined) setVariant(product.variants?.[0])
  }, [product, variant])

  if (catalogLoading) {
    return (
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <Skeleton className="aspect-[4/5] w-full rounded-3xl" />
          <div className="space-y-4 pt-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full max-w-xs" />
          </div>
        </div>
      </div>
    )
  }
  if (!product) return <Navigate to="/shop" replace />

  const category = getCategory(product.category)
  const related = getProductsByCategory(product.category)
    .filter((p) => p.id !== product.id)
    .slice(0, 6)
  const wish = isWishlisted(product.id)

  const onAdd = () => {
    const rect = btnRef.current?.getBoundingClientRect()
    addToCart(product.id, variant, qty, rect)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1600)
  }

  return (
    <div data-theme={product.category}>
      <div className="mx-auto max-w-7xl px-5 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <motion.div
              key={activeImage}
              initial={{ opacity: 0.4 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className="aspect-[4/5] overflow-hidden bg-nova-border/40"
            >
              <img
                src={product.images[activeImage]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            </motion.div>
            {product.images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={img}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`h-20 w-16 overflow-hidden border transition-colors ${
                      i === activeImage ? "border-nova-ink" : "border-nova-border"
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <Reveal>
            <p
              className="text-[11px] uppercase tracking-[0.24em]"
              style={{ color: category?.accent }}
            >
              {category?.name}
            </p>
            <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-xl text-nova-muted">{formatPrice(product.price)}</p>
            <p className="mt-6 max-w-md leading-relaxed text-nova-muted">{product.description}</p>

            <div className="mt-8">
              <p className="text-[11px] uppercase tracking-[0.18em] text-nova-muted">
                {/^[0-9]/.test(product.variants[0]) ? "Size" : "Option"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setVariant(v)}
                    className={`min-w-[3.2rem] border px-4 py-2.5 text-sm transition-colors ${
                      variant === v
                        ? "border-nova-ink bg-nova-ink text-white"
                        : "border-nova-border hover:border-nova-ink"
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4">
              <div className="flex items-center border border-nova-border">
                <button
                  type="button"
                  aria-label="Decrease quantity"
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-12 w-12 place-items-center transition-colors hover:text-[var(--accent)]"
                >
                  <Minus size={14} />
                </button>
                <span className="w-8 text-center">{qty}</span>
                <button
                  type="button"
                  aria-label="Increase quantity"
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-12 w-12 place-items-center transition-colors hover:text-[var(--accent)]"
                >
                  <Plus size={14} />
                </button>
              </div>
              <MagneticButton
                onClick={onAdd}
                className="flex-1 bg-nova-ink px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-white"
              >
                <span ref={btnRef} className="inline-block">
                  {added ? "Added to cart" : "Add to cart"}
                </span>
              </MagneticButton>
              <button
                type="button"
                aria-label={wish ? "Remove from wishlist" : "Add to wishlist"}
                onClick={() => toggleWishlist(product.id)}
                className="grid h-14 w-14 shrink-0 place-items-center border border-nova-border transition-colors hover:border-nova-ink"
              >
                <Heart size={18} fill={wish ? "currentColor" : "none"} className={wish ? "text-[var(--accent)]" : ""} />
              </button>
            </div>

            <div className="mt-10 border-t border-nova-border pt-6 text-sm text-nova-muted">
              <p>Complimentary shipping on orders over $150. Returns accepted within 30 days.</p>
            </div>
          </Reveal>
        </div>
      </div>

      {related.length > 0 && (
        <ProductCarousel kicker="More from this world" title={`Also in ${category?.name}`} products={related} />
      )}
    </div>
  )
}
