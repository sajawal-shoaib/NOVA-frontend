import { AnimatePresence, motion } from "framer-motion"
import { Link } from "react-router-dom"
import { Minus, Plus, X } from "lucide-react"
import { useStore } from "../context/StoreContext"
import { formatPrice } from "../lib/format"
import MagneticButton from "./MagneticButton"

const EASE = [0.22, 1, 0.36, 1]

export default function CartDrawer() {
  const { cartOpen, setCartOpen, cartItems, cartTotal, updateQty, removeFromCart } = useStore()

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setCartOpen(false)}
        >
          <motion.div
            className="flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl bg-nova-surface"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Shopping cart"
          >
            <div className="flex items-center justify-between border-b border-nova-border px-6 py-5">
              <h2 className="font-display text-2xl">Cart ({cartItems.length})</h2>
              <button
                type="button"
                aria-label="Close cart"
                onClick={() => setCartOpen(false)}
                className="grid h-9 w-9 place-items-center transition-colors hover:text-[var(--accent)]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {cartItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center">
                  <p className="text-nova-muted">Your cart is quiet, for now.</p>
                  <MagneticButton
                    onClick={() => setCartOpen(false)}
                    className="bg-nova-ink px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white"
                  >
                    <Link to="/shop">Continue shopping</Link>
                  </MagneticButton>
                </div>
              ) : (
                <ul className="flex flex-col gap-6">
                  {cartItems.map((item) => (
                    <li key={`${item.id}-${item.variant}`} className="flex gap-4">
                      <Link
                        to={`/product/${item.id}`}
                        onClick={() => setCartOpen(false)}
                        className="h-28 w-24 shrink-0 overflow-hidden rounded-xl bg-nova-bg"
                      >
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </Link>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <Link
                              to={`/product/${item.id}`}
                              onClick={() => setCartOpen(false)}
                              className="font-display text-lg leading-tight"
                            >
                              {item.product.name}
                            </Link>
                            <p className="mt-1 text-xs text-nova-muted">{item.variant}</p>
                          </div>
                          <p className="shrink-0 text-sm">{formatPrice(item.product.price * item.qty)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center border border-nova-border">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() => updateQty(item.id, item.variant, item.qty - 1)}
                              className="grid h-8 w-8 place-items-center transition-colors hover:text-[var(--accent)]"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="w-6 text-center text-sm">{item.qty}</span>
                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() => updateQty(item.id, item.variant, item.qty + 1)}
                              className="grid h-8 w-8 place-items-center transition-colors hover:text-[var(--accent)]"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.id, item.variant)}
                            className="text-xs uppercase tracking-[0.12em] text-nova-muted underline-offset-4 rounded:2xl hover:underline"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="border-t border-nova-border px-6 py-6">
                <div className="mb-4 flex items-center justify-between text-sm">
                  <span className="text-nova-muted">Subtotal</span>
                  <span className="font-display text-xl">{formatPrice(cartTotal)}</span>
                </div>
                <Link to="/cart" onClick={() => setCartOpen(false)}>
                  <MagneticButton className="w-full bg-nova-ink px-6 py-4 text-[11px] uppercase tracking-[0.22em] text-white w-full overflow-hidden rounded-2xl">
                    View cart &amp; checkout
                  </MagneticButton>
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
