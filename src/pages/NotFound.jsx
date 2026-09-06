import { Link } from "react-router-dom"
import MagneticButton from "../components/MagneticButton"

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">404</p>
      <h1 className="mt-4 font-display text-6xl md:text-8xl">Lost in orbit.</h1>
      <p className="mt-4 max-w-sm text-nova-muted">
        This page drifted out of NOVA's five worlds. Let's get you back.
      </p>
      <Link to="/" className="mt-8">
        <MagneticButton className="bg-nova-ink px-7 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white">
          Back home
        </MagneticButton>
      </Link>
    </div>
  )
}
