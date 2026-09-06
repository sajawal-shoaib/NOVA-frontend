import { useState } from "react"
import MagneticButton from "./MagneticButton"
import Reveal from "./Reveal"

export default function Newsletter({ compact = false }) {
  const [email, setEmail] = useState("")
  const [done, setDone] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    if (!email.trim()) return
    setDone(true)
  }

  if (compact) {
    return (
      <form onSubmit={onSubmit} className="flex w-full max-w-sm gap-0 border-b border-nova-border">
        <label className="sr-only" htmlFor="footer-email">
          Email
        </label>
        <input
          id="footer-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={done ? "You’re on the list" : "Email address"}
          disabled={done}
          className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-nova-muted rounded-2xl"
        />
        <button
          type="submit"
          className="px-2 text-[11px] uppercase tracking-[0.18em] rounded-2xl"
          disabled={done}
        >
          {done ? "Sent" : "Join"}
        </button>
      </form>
    )
  }

  return (
    <section className="border-t border-nova-border px-5 py-24 md:px-8">
      <Reveal className="mx-auto max-w-xl text-center">
        <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">Correspondence</p>
        <h2 className="mt-4 font-display text-4xl md:text-5xl">Notes from the house</h2>
        <p className="mt-4 text-nova-muted">
          Drops, journal essays, and the occasional invitation. No noise.
        </p>
        <form onSubmit={onSubmit} className="mt-10 flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="newsletter-email">
            Email
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@studio.com"
            disabled={done}
            className="flex-1 border border-nova-border bg-white px-4 py-3.5 text-sm outline-none focus:border-nova-ink rounded-2xl"
          />
          <MagneticButton
            type="submit"
            className="bg-nova-ink px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white rounded-2xl"
            disabled={done}
          >
            {done ? "Welcome" : "Subscribe"}
          </MagneticButton>
        </form>
      </Reveal>
    </section>
  )
}
