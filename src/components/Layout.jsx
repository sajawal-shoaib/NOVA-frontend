import { useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import Navbar from "./Navbar"
import Footer from "./Footer"
import CartDrawer from "./CartDrawer"
import SearchOverlay from "./SearchOverlay"
import AccountPanel from "./AccountPanel"
import FlyToCart from "./FlyToCart"
import { useStore } from "../context/StoreContext"

export default function Layout() {
  const location = useLocation()
  const { closeOverlays } = useStore()

  useEffect(() => {
    closeOverlays()
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname])

  return (
    <div className="flex min-h-screen flex-col bg-nova-bg text-nova-ink">
      <Navbar />
      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          className="flex-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <Outlet />
        </motion.main>
      </AnimatePresence>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <AccountPanel />
      <FlyToCart />
    </div>
  )
}
