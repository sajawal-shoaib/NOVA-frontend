import { useEffect, useRef, useState } from "react"
import { Link, NavLink } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, Menu, Search, ShoppingBag, User, X, ChevronDown } from "lucide-react"
import { useStore } from "../context/StoreContext"

const EASE = [0.22, 1, 0.36, 1]

const navLinkClass = ({ isActive }) =>
  `relative py-1 text-[13px] font-medium transition-colors duration-200 ${isActive ? "text-nova-ink after:scale-x-100" : "text-nova-ink/70 hover:text-nova-ink after:scale-x-0 hover:after:scale-x-100"
  } after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-center after:bg-nova-ink after:transition-transform after:duration-300`

export default function Navbar() {
  const {
    cartCount,
    wishlist,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    accountOpen,
    setAccountOpen,
    menuOpen,
    setMenuOpen,
    closeOverlays,
    cartIconRef,
    categories,
    user,
  } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const closeTimer = useRef(null)

  const openCat = () => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setCatOpen(true)
  }

  const scheduleCloseCat = () => {
    closeTimer.current = setTimeout(() => setCatOpen(false), 150)
  }

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = cartOpen || searchOpen || accountOpen || menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [cartOpen, searchOpen, accountOpen, menuOpen])

  return (
    <header className="sticky top-0 z-50 px-4 pt-4 md:px-6">
      <div className="mx-auto flex max-w-[1520px] items-center justify-between gap-3">
        <Link
          to="/"
          className={`flex shrink-0 items-center rounded-full bg-white/80 px-5 py-2.5 backdrop-blur-md transition-shadow duration-500 ${scrolled ? "shadow-[0_8px_30px_rgba(23,23,23,0.10)]" : "shadow-[0_2px_14px_rgba(23,23,23,0.05)]"
            }`}
          onClick={closeOverlays}
          aria-label="NOVA home"
        >
          <motion.span className="font-display text-2xl tracking-[0.02em]" initial={false} whileHover="hover">
            {"NOVA".split("").map((letter, i) => (
              <motion.span
                key={i}
                className="inline-block"
                variants={{ hover: { y: -3, transition: { delay: i * 0.03, ease: EASE, duration: 0.3 } } }}
              >
                {letter}
              </motion.span>
            ))}
          </motion.span>
        </Link>

        <nav
          className={`hidden flex-1 items-center justify-center gap-12 rounded-full bg-white/80 px-10 py-3.5 backdrop-blur-md transition-shadow duration-500 md:flex ${scrolled ? "shadow-[0_8px_30px_rgba(23,23,23,0.10)]" : "shadow-[0_2px_14px_rgba(23,23,23,0.05)]"
            }`}
        >
          <NavLink to="/shop" className={navLinkClass}>
            Shop
          </NavLink>
          <div
            className="relative"
            onMouseEnter={openCat}
            onMouseLeave={scheduleCloseCat}
          >
            <button
              type="button"
              className="group relative flex items-center gap-1 py-1 text-[13px] font-medium text-nova-ink/70 transition-colors hover:text-nova-ink after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-full after:origin-center after:scale-x-0 after:bg-nova-ink after:transition-transform after:duration-300 hover:after:scale-x-100"
              aria-expanded={catOpen}
            >
              Categories
              <ChevronDown size={13} className={`transition-transform duration-300 ${catOpen ? "rotate-180" : ""}`} />
            </button>
            <AnimatePresence>
              {catOpen && (
                <div className="absolute left-1/2 top-full -translate-x-1/2 pt-3">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.22, ease: EASE }}
                    className="grid w-[520px] grid-cols-2 gap-1 rounded-3xl border border-nova-border bg-nova-surface p-3 shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                  >
                    {categories.map((c) => (
                      <Link
                        key={c.id}
                        to={`/category/${c.slug}`}
                        onClick={() => setCatOpen(false)}
                        className="group flex items-center justify-between rounded-2xl px-4 py-3 transition-colors hover:bg-nova-bg"
                      >
                        <span>
                          <span className="block text-sm font-medium">{c.name}</span>
                          <span className="block text-xs text-nova-muted">{c.mood}</span>
                        </span>
                        <span
                          className="h-2 w-2 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
                          style={{ background: c.accent }}
                        />
                      </Link>
                    ))}
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </div>
          <NavLink to="/discover" className={navLinkClass}>
            Discover
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
        </nav>

        <div
          className={`flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 backdrop-blur-md transition-shadow duration-500 ${scrolled ? "shadow-[0_8px_30px_rgba(23,23,23,0.10)]" : "shadow-[0_2px_14px_rgba(23,23,23,0.05)]"
            }`}
        >
          {user ? (
            <button
              type="button"
              aria-label={`Account — ${user.name}`}
              onClick={() => setAccountOpen(true)}
              className="relative hidden h-10 w-10 place-items-center rounded-full bg-nova-soft text-nova-ink transition-all duration-300 hover:bg-nova-ink hover:text-white sm:grid"
            >
              <User size={17} />
              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-nova-ink" />
            </button>
          ) : (
            <Link
              to="/login"
              aria-label="Sign in"
              className="hidden h-10 w-10 place-items-center rounded-full bg-nova-soft text-nova-ink transition-all duration-300 hover:bg-nova-ink hover:text-white sm:grid"
            >
              <User size={17} />
            </Link>
          )}
          <button
            type="button"
            aria-label="Search"
            onClick={() => setSearchOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full bg-nova-soft text-nova-ink transition-all duration-300 hover:bg-nova-ink hover:text-white"
          >
            <Search size={17} />
          </button>
          <Link
            to="/wishlist"
            aria-label="Wishlist"
            onClick={closeOverlays}
            className="group relative hidden h-10 w-10 place-items-center rounded-full bg-nova-soft text-nova-ink transition-colors sm:grid"
          >
            {/* Hover background layer */}
            <span className="absolute inset-0 rounded-full transition-colors duration-200 group-hover:bg-nova-ink" />

            {/* Heart Icon */}
            <Heart size={17} className="relative z-10 transition-colors duration-200 group-hover:text-white" />

            {/* Counter Badge */}
            {wishlist.length > 0 && (
              <span className="pointer-events-none absolute -right-0.5 -top-0.5 z-20 grid h-4 w-4 place-items-center rounded-full bg-nova-ink text-[9px] font-bold text-white shadow-sm transition-colors duration-200 group-hover:bg-white group-hover:text-nova-ink">
                {wishlist.length}
              </span>
            )}
          </Link>
          <button
            ref={cartIconRef}
            type="button"
            aria-label="Cart"
            onClick={() => setCartOpen(true)}
            className="group relative grid h-10 w-10 place-items-center rounded-full bg-nova-soft text-nova-ink transition-all duration-300 hover:bg-nova-ink hover:text-white"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-nova-ink text-[9px] text-white transition-colors duration-300 group-hover:bg-white group-hover:text-nova-ink">
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label="Menu"
            onClick={() => setMenuOpen(true)}
            className="grid h-10 w-10 place-items-center rounded-full bg-nova-soft text-nova-ink md:hidden"
          >
            <Menu size={18} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="fixed inset-0 z-[60] bg-nova-bg md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex h-[76px] items-center justify-between px-5">
              <span className="font-display text-2xl">NOVA</span>
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setMenuOpen(false)}
                className="grid h-10 w-10 place-items-center rounded-full bg-nova-soft"
              >
                <X size={20} />
              </button>
            </div>
            <motion.nav
              className="flex flex-col gap-1 px-5 pt-6"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.05 } } }}
            >
              {[
                { to: "/shop", label: "Shop" },
                { to: "/discover", label: "Discover" },
                { to: "/about", label: "About" },
                { to: "/wishlist", label: "Wishlist" },
                { to: "/cart", label: "Cart" },
              ].map((item) => (
                <motion.div
                  key={item.label}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.4, ease: EASE }}
                >
                  <Link
                    to={item.to}
                    onClick={() => setMenuOpen(false)}
                    className="block border-b border-nova-border py-4 font-display text-3xl"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <p className="mt-6 text-[11px] uppercase tracking-[0.24em] text-nova-muted">Worlds</p>
              <div className="mt-2 flex flex-wrap gap-2 pb-8">
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/category/${c.slug}`}
                    onClick={() => setMenuOpen(false)}
                    className="rounded-full border px-4 py-2 text-xs uppercase tracking-[0.14em]"
                    style={{ borderColor: c.accent, color: c.accent }}
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}