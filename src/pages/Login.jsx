import { useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useStore } from "../context/StoreContext"

const IMAGE =
  "https://images.unsplash.com/photo-1753162657535-0710ef1888df?auto=format&fit=crop&w=1600&q=80"

export default function Login() {
  const { login } = useStore()
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = location.state?.from || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-nova-bg lg:grid-cols-2">
      <div className="hidden flex-col p-6 lg:flex">
        <div className="relative flex-1 overflow-hidden rounded-t-3xl">
          <img src={IMAGE} alt="NOVA atelier" className="h-full w-full object-cover" />
          <p className="absolute left-6 top-6 text-[11px] uppercase tracking-[0.3em] text-white/80">
            Atelier Nova
          </p>
        </div>

        <div className="rounded-b-3xl bg-nova-ink p-8 text-white">
          <h1 className="font-display text-3xl leading-tight">
            Curate. Collect.
            <br />
            Live in every world.
          </h1>
          <p className="mt-3 max-w-sm text-sm text-white/70">
            Sign in to pick up where you left off — your wishlist, orders, and
            saved worlds are waiting.
          </p>
        </div>
      </div>

      <div className="flex items-center justify-center px-6 py-16 md:px-16">
        <div className="w-full max-w-sm">
          <div className="flex gap-6 border-b border-nova-border text-sm">
            <span className="-mb-px border-b-2 border-nova-ink pb-3 font-medium text-nova-ink">
              Sign in
            </span>
            <Link
              to="/signin"
              className="-mb-px border-b-2 border-transparent pb-3 font-medium text-nova-muted transition-colors hover:text-nova-ink"
            >
              Create account
            </Link>
          </div>

          <h2 className="mt-8 font-display text-3xl">Welcome back</h2>
          <p className="mt-2 text-sm text-nova-muted">
            Sign in to pick up where you left off.
          </p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="text-[11px] uppercase tracking-[0.14em] text-nova-muted">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-2 w-full border border-nova-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-nova-ink"
              />
            </div>

            <div>
              <label className="text-[11px] uppercase tracking-[0.14em] text-nova-muted">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-2 w-full border border-nova-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-nova-ink"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-nova-ink py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-nova-muted">
            New to NOVA?{" "}
            <Link to="/signin" className="text-nova-ink underline">
              Create an account
            </Link>
          </p>

          <Link to="/" className="mt-6 block text-center text-xs text-nova-muted hover:text-nova-ink">
            ← Back to shop
          </Link>
        </div>
      </div>
    </div>
  )
}