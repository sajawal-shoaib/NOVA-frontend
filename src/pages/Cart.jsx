import { useState } from "react"
import { Link } from "react-router-dom"
import { Minus, Plus, X } from "lucide-react"
import { useStore } from "../context/StoreContext"
import { formatPrice } from "../lib/format"
import MagneticButton from "../components/MagneticButton"
import Reveal from "../components/Reveal"

const EMPTY_ADDRESS = { name: "", line1: "", line2: "", city: "", state: "", postalCode: "", country: "", phone: "" }

export default function Cart() {
  const { cartItems, cartTotal, updateQty, removeFromCart, user, placeOrder } = useStore()
  const [checkingOut, setCheckingOut] = useState(false)
  const [address, setAddress] = useState(EMPTY_ADDRESS)
  const [placing, setPlacing] = useState(false)
  const [error, setError] = useState("")
  const [order, setOrder] = useState(null)

  const shipping = cartTotal >= 150 ? 0 : 12
  const total = cartTotal + shipping

  const onAddressChange = (field) => (e) => setAddress((prev) => ({ ...prev, [field]: e.target.value }))

  const onPlaceOrder = async (e) => {
    e.preventDefault()
    setError("")
    setPlacing(true)
    try {
      const placed = await placeOrder(address)
      setOrder(placed)
    } catch (err) {
      setError(err.message || "Couldn't place your order. Try again.")
    } finally {
      setPlacing(false)
    }
  }

  if (order) {
    return (
      <div className="mx-auto max-w-xl px-5 py-24 text-center md:px-8">
        <Reveal>
          <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">Order placed</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl">Thank you.</h1>
          <p className="mt-4 text-nova-muted">
            Order <span className="text-nova-ink">#{order._id?.slice(-8) || order.id}</span> is confirmed —
            total {formatPrice(order.total)}. A confirmation will follow by email.
          </p>
          <Link to="/shop" className="mt-8 inline-block">
            <MagneticButton className="bg-nova-ink px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white">
              Keep exploring
            </MagneticButton>
          </Link>
        </Reveal>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-5 py-16 md:px-8 md:py-20">
      <Reveal>
        <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">Cart</p>
        <h1 className="mt-3 font-display text-5xl md:text-6xl">Your selections</h1>
      </Reveal>

      {cartItems.length === 0 ? (
        <div className="mt-16 flex flex-col items-center gap-6 py-16 text-center">
          <p className="text-nova-muted">Nothing here yet. Every world is still open.</p>
          <Link to="/shop">
            <MagneticButton className="bg-nova-ink px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white">
              Browse the shop
            </MagneticButton>
          </Link>
        </div>
      ) : (
        <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_320px]">
          <ul className="flex flex-col divide-y divide-nova-border">
            {cartItems.map((item) => (
              <li key={`${item.id}-${item.variant}`} className="flex gap-6 py-6">
                <Link to={`/product/${item.id}`} className="h-36 w-28 shrink-0 overflow-hidden bg-nova-bg">
                  <img src={item.product.images[0]} alt={item.product.name} className="h-full w-full object-cover" />
                </Link>
                <div className="flex flex-1 flex-col justify-between">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link to={`/product/${item.id}`} className="font-display text-2xl">
                        {item.product.name}
                      </Link>
                      <p className="mt-1 text-sm text-nova-muted">Option: {item.variant}</p>
                    </div>
                    <p className="text-lg">{formatPrice(item.product.price * item.qty)}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-nova-border">
                      <button
                        type="button"
                        aria-label="Decrease quantity"
                        onClick={() => updateQty(item.id, item.variant, item.qty - 1)}
                        className="grid h-10 w-10 place-items-center transition-colors hover:text-[var(--accent)]"
                      >
                        <Minus size={14} />
                      </button>
                      <span className="w-8 text-center">{item.qty}</span>
                      <button
                        type="button"
                        aria-label="Increase quantity"
                        onClick={() => updateQty(item.id, item.variant, item.qty + 1)}
                        className="grid h-10 w-10 place-items-center transition-colors hover:text-[var(--accent)]"
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.id, item.variant)}
                      aria-label="Remove item"
                      className="grid h-10 w-10 place-items-center text-nova-muted transition-colors hover:text-nova-ink"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>

          <div className="h-fit border border-nova-border p-6">
            <h2 className="font-display text-2xl">Summary</h2>
            <div className="mt-5 flex justify-between text-sm text-nova-muted">
              <span>Subtotal</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-nova-muted">
              <span>Shipping</span>
              <span>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
            </div>
            <div className="mt-4 flex justify-between border-t border-nova-border pt-4 font-display text-xl">
              <span>Total</span>
              <span>{formatPrice(total)}</span>
            </div>

            {!user ? (
              <>
                <Link to="/login" state={{ from: "/cart" }} className="mt-6 block">
                  <MagneticButton className="w-full bg-nova-ink px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-white">
                    Sign in to checkout
                  </MagneticButton>
                </Link>
                <p className="mt-4 text-center text-xs text-nova-muted">
                  Your cart will be waiting for you once you're signed in.
                </p>
              </>
            ) : !checkingOut ? (
              <>
                <MagneticButton
                  onClick={() => setCheckingOut(true)}
                  className="mt-6 w-full bg-nova-ink px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-white"
                >
                  Checkout
                </MagneticButton>
                <p className="mt-4 text-center text-xs text-nova-muted">
                  Taxes calculated at checkout. Free returns within 30 days.
                </p>
              </>
            ) : (
              <form onSubmit={onPlaceOrder} className="mt-6 space-y-3">
                <p className="text-[11px] uppercase tracking-[0.16em] text-nova-muted">Shipping address</p>
                <input
                  required
                  placeholder="Full name"
                  value={address.name}
                  onChange={onAddressChange("name")}
                  className="w-full border border-nova-border bg-white px-3 py-2.5 text-sm outline-none focus:border-nova-ink"
                />
                <input
                  required
                  placeholder="Address line 1"
                  value={address.line1}
                  onChange={onAddressChange("line1")}
                  className="w-full border border-nova-border bg-white px-3 py-2.5 text-sm outline-none focus:border-nova-ink"
                />
                <input
                  placeholder="Address line 2 (optional)"
                  value={address.line2}
                  onChange={onAddressChange("line2")}
                  className="w-full border border-nova-border bg-white px-3 py-2.5 text-sm outline-none focus:border-nova-ink"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="City"
                    value={address.city}
                    onChange={onAddressChange("city")}
                    className="w-full border border-nova-border bg-white px-3 py-2.5 text-sm outline-none focus:border-nova-ink"
                  />
                  <input
                    placeholder="State"
                    value={address.state}
                    onChange={onAddressChange("state")}
                    className="w-full border border-nova-border bg-white px-3 py-2.5 text-sm outline-none focus:border-nova-ink"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    required
                    placeholder="Postal code"
                    value={address.postalCode}
                    onChange={onAddressChange("postalCode")}
                    className="w-full border border-nova-border bg-white px-3 py-2.5 text-sm outline-none focus:border-nova-ink"
                  />
                  <input
                    required
                    placeholder="Country"
                    value={address.country}
                    onChange={onAddressChange("country")}
                    className="w-full border border-nova-border bg-white px-3 py-2.5 text-sm outline-none focus:border-nova-ink"
                  />
                </div>
                <input
                  required
                  placeholder="Phone"
                  value={address.phone}
                  onChange={onAddressChange("phone")}
                  className="w-full border border-nova-border bg-white px-3 py-2.5 text-sm outline-none focus:border-nova-ink"
                />

                {error && <p className="text-sm text-red-600">{error}</p>}

                <button
                  type="submit"
                  disabled={placing}
                  className="w-full bg-nova-ink px-6 py-4 text-[11px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {placing ? "Placing order…" : `Place order · ${formatPrice(total)}`}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
