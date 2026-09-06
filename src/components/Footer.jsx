import { Link } from "react-router-dom"
import { AtSign, Globe, MessageCircle } from "lucide-react"
import { useStore } from "../context/StoreContext"
import Newsletter from "./Newsletter"

export default function Footer() {
  const { categories } = useStore()

  return (
    <footer className="border-t border-nova-border bg-nova-surface px-5 pt-20 md:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 pb-16 lg:grid-cols-[1.4fr_repeat(3,1fr)_1.3fr]">
        <div>
          <Link to="/" className="font-display text-3xl">
            NOVA
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-nova-muted">
            One brand. Multiple worlds. Fashion, tech, home, fitness, and travel — each with its
            own weather, all speaking the same language.
          </p>
          <div className="mt-6 flex gap-3">
            {[AtSign, MessageCircle, Globe].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Social link"
                className="grid h-10 w-10 place-items-center border border-nova-border transition-colors hover:border-nova-ink hover:text-[var(--accent)]"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-nova-muted">Shop</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li><Link to="/shop" className="hover:text-[var(--accent)]">All products</Link></li>
            <li><Link to="/shop" className="hover:text-[var(--accent)]">New arrivals</Link></li>
            <li><Link to="/wishlist" className="hover:text-[var(--accent)]">Wishlist</Link></li>
            <li><Link to="/cart" className="hover:text-[var(--accent)]">Cart</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-nova-muted">Categories</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            {categories.map((c) => (
              <li key={c.id}>
                <Link to={`/category/${c.slug}`} className="hover:text-[var(--accent)]">
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-nova-muted">Company</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li><Link to="/about" className="hover:text-[var(--accent)]">About NOVA</Link></li>
            <li><Link to="/about" className="hover:text-[var(--accent)]">Journal</Link></li>
            <li><a href="#" className="hover:text-[var(--accent)]">Careers</a></li>
          </ul>
          <p className="mt-6 text-[11px] uppercase tracking-[0.2em] text-nova-muted">Support</p>
          <ul className="mt-4 flex flex-col gap-3 text-sm">
            <li><a href="#" className="hover:text-[var(--accent)]">Shipping &amp; returns</a></li>
            <li><a href="#" className="hover:text-[var(--accent)]">Size guide</a></li>
            <li><a href="#" className="hover:text-[var(--accent)]">Contact</a></li>
          </ul>
        </div>

        <div>
          <p className="text-[11px] uppercase tracking-[0.2em] text-nova-muted">Stay in orbit</p>
          <p className="mt-4 text-sm text-nova-muted">
            First access to drops, one email a week, no noise.
          </p>
          <div className="mt-4">
            <Newsletter compact />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-4 border-t border-nova-border py-6 text-xs text-nova-muted md:flex-row">
        <p>&copy; {new Date().getFullYear()} NOVA. All rights reserved.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-nova-ink">Privacy</a>
          <a href="#" className="hover:text-nova-ink">Terms</a>
          <a href="#" className="hover:text-nova-ink">Accessibility</a>
        </div>
      </div>
    </footer>
  )
}
