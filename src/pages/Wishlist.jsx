import { Link } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import Reveal from "../components/Reveal"
import MagneticButton from "../components/MagneticButton"
import { useStore } from "../context/StoreContext"

export default function Wishlist() {
  const { wishlistProducts } = useStore()

  return (
    <div className="mx-auto max-w-[1680px] px-5 py-16 md:px-8 md:py-20">
      <Reveal>
        <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">Wishlist</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Saved for later.</h1>
      </Reveal>

      {wishlistProducts.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-6 py-16 text-center">
          <p className="text-nova-muted">Nothing saved yet. Tap the heart on any piece to keep it here.</p>
          <Link to="/shop">
            <MagneticButton className="bg-nova-ink px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white">
              Explore the shop
            </MagneticButton>
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {wishlistProducts.map((product, i) => (
            <ProductCard key={product.id} product={product} index={i} fluid />
          ))}
        </div>
      )}
    </div>
  )
}
