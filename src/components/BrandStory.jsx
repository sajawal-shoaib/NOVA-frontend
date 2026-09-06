import Reveal from "./Reveal"

export default function BrandStory() {
  return (
    <section className="px-5 py-24 md:px-8 md:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 lg:grid-cols-2">
        <Reveal>
          <div className="relative rounded-2xl">
            <img
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1400&q=80"
              alt="NOVA atelier interior"
              className="w-full object-cover rounded-2xl"
            />
            <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-nova-muted">
              Atelier — 08
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.12} className="lg:pl-8">
          <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">The house</p>
          <h2 className="mt-4 font-display text-5xl leading-[1.05] md:text-6xl">
            NOVA is a parent identity.
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-nova-muted">
            A neutral house that lets five worlds keep their own weather. We design the grammar —
            spacing, type, motion — and let fashion, tech, home, fitness, and travel speak in their
            own accents.
          </p>
          <p className="mt-4 max-w-lg leading-relaxed text-nova-muted">
            Not a department store. A sequence of rooms you walk through at your own pace.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
