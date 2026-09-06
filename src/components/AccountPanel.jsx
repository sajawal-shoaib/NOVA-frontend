import { AnimatePresence, motion } from "framer-motion"
import { Link } from "react-router-dom"
import { X } from "lucide-react"
import { useStore } from "../context/StoreContext"
import MagneticButton from "./MagneticButton"

const EASE = [0.22, 1, 0.36, 1]

export default function AccountPanel() {
  const { accountOpen, setAccountOpen, user, logout } = useStore()

  const onLogout = async () => {
    await logout()
    setAccountOpen(false)
  }

  return (
    <AnimatePresence>
      {accountOpen && (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setAccountOpen(false)}
        >
          <motion.div
            className="flex max-h-[85vh] w-full max-w-sm flex-col rounded-3xl bg-nova-surface"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ duration: 0.3, ease: EASE }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Account"
          >
            <div className="flex items-center justify-between border-b border-nova-border px-6 py-5">
              <h2 className="font-display text-2xl">Account</h2>
              <button
                type="button"
                aria-label="Close account panel"
                onClick={() => setAccountOpen(false)}
                className="grid h-9 w-9 place-items-center transition-colors hover:text-[var(--accent)]"
              >
                <X size={20} />
              </button>
            </div>

            {user ? (
              <div className="flex flex-1 flex-col overflow-y-auto px-8 py-8">
                <div className="grid h-14 w-14 place-items-center rounded-full bg-nova-soft font-display text-xl">
                  {user.name?.[0]?.toUpperCase() || "?"}
                </div>
                <p className="mt-4 font-display text-2xl">{user.name}</p>
                <p className="mt-1 text-sm text-nova-muted">{user.email}</p>

                <div className="mt-8 flex flex-col divide-y divide-nova-border border-y border-nova-border text-sm">
                  <Link
                    to="/wishlist"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center justify-between py-4 transition-colors hover:text-[var(--accent)]"
                  >
                    Wishlist
                  </Link>
                  <Link
                    to="/cart"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center justify-between py-4 transition-colors hover:text-[var(--accent)]"
                  >
                    Cart
                  </Link>
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center justify-between py-4 transition-colors hover:text-[var(--accent)]"
                    >
                      Manage site media
                    </Link>
                  )}
                </div>

                <button
                  type="button"
                  onClick={onLogout}
                  className="mt-8 w-full border border-nova-border py-3.5 text-[11px] uppercase tracking-[0.2em] text-nova-ink transition-colors hover:border-nova-ink"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6 px-8 py-10">
                <p className="text-sm text-nova-muted">
                  Sign in to track orders, save pieces across worlds, and keep your fittings on file.
                </p>
                <Link to="/login" onClick={() => setAccountOpen(false)}>
                  <MagneticButton className="w-full bg-nova-ink px-6 py-3 text-[11px] uppercase tracking-[0.2em] text-white">
                    Sign in
                  </MagneticButton>
                </Link>
                <p className="text-center text-xs text-nova-muted">
                  New here?{" "}
                  <Link
                    to="/signin"
                    onClick={() => setAccountOpen(false)}
                    className="underline underline-offset-4 hover:text-nova-ink"
                  >
                    Create an account
                  </Link>
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
