import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useStore } from "../context/StoreContext"

const IMAGE =
  "https://images.unsplash.com/photo-1753164597544-a2736833357e?auto=format&fit=crop&w=1600&q=80"

export default function SignIn() {
  const { register } = useStore()
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      await register(name, email, password)
      navigate("/", { replace: true })
    } catch (err) {
      setError(err.message || "Something went wrong. Try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid min-h-screen bg-nova-bg lg:grid-cols-2">
      <div className="flex items-center justify-center px-6 py-16 md:px-16">
        <div className="w-full max-w-sm">
          <div className="flex gap-6 border-b border-nova-border text-sm">
            <Link
              to="/login"
              className="-mb-px border-b-2 border-transparent pb-3 font-medium text-nova-muted transition-colors hover:text-nova-ink"
            >
              Sign in
            </Link>
            <span className="-mb-px border-b-2 border-nova-ink pb-3 font-medium text-nova-ink">
              Create account
            </span>
          </div>

          <h2 className="mt-8 font-display text-3xl">Create your account</h2>
          <p className="mt-2 text-sm text-nova-muted">Takes about thirty seconds.</p>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            <div>
              <label className="text-[11px] uppercase tracking-[0.14em] text-nova-muted">
                Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="mt-2 w-full border border-nova-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-nova-ink"
              />
            </div>

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
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="mt-2 w-full border border-nova-border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-nova-ink"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-nova-ink py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-nova-muted">
            Already have an account?{" "}
            <Link to="/login" className="text-nova-ink underline">
              Sign in
            </Link>
          </p>

          <Link to="/" className="mt-6 block text-center text-xs text-nova-muted hover:text-nova-ink">
            ← Back to shop
          </Link>
        </div>
      </div>

      <div className="hidden flex-col p-6 lg:flex">
        <div className="relative flex-1 overflow-hidden rounded-t-3xl">
          <img src={IMAGE} alt="NOVA design studio" className="h-full w-full object-cover" />
          <p className="absolute right-6 top-6 text-[11px] uppercase tracking-[0.3em] text-white/80">
            Atelier Nova
          </p>
        </div>
        <div className="rounded-b-3xl bg-nova-ink p-8 text-right text-white">
          <h1 className="font-display text-3xl leading-tight">
            Every world,
            <br />
            one collection.
          </h1>
          <p className="ml-auto mt-3 max-w-sm text-sm text-white/70">
            From sketch to shelf — see how each NOVA piece comes together
            before it reaches you.
          </p>
        </div>
      </div>
    </div>
  )
}
