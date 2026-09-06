import { useRef, useState } from "react"
import { Pause, Play } from "lucide-react"
import { motion } from "framer-motion"
import Reveal from "./Reveal"
import { useStore } from "../context/StoreContext"
import defaultVideoSrc from "../assets/brand-ad.mp4"
import heroImage from "../assets/hero-dashboard.jpeg"

export default function VideoBanner() {
  const { settings } = useStore()
  const videoRef = useRef(null)
  const [playing, setPlaying] = useState(true)

  const videoSrc = settings?.campaignVideo?.url || defaultVideoSrc
  const posterSrc = settings?.campaignPoster?.url || heroImage

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      v.play()
      setPlaying(true)
    } else {
      v.pause()
      setPlaying(false)
    }
  }

  return (
    <section className="relative overflow-hidden bg-nova-soft py-20 md:py-28">
      <div className="mx-auto max-w-[1680px] px-5 md:px-8">
        <Reveal className="text-center">
          <p className="text-[11px] uppercase tracking-[0.32em] text-nova-muted">Campaign film</p>
          <h2 className="mx-auto mt-4 max-w-3xl font-display text-4xl leading-[1.05] md:text-6xl">
            Move through the worlds
          </h2>
          <p className="mx-auto mt-4 max-w-md text-sm text-nova-muted">
            A minute inside NOVA — objects, rooms, and the people who inhabit them.
          </p>
        </Reveal>

        <Reveal className="relative mt-14 aspect-[16/9] w-full overflow-hidden rounded-[40px] bg-nova-ink md:rounded-[56px]">
          <video
            key={videoSrc}
            ref={videoRef}
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster={posterSrc}
          >
            <source src={videoSrc} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-black/20" />

          <motion.button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause film" : "Play film"}
            className="absolute bottom-8 right-8 grid h-12 w-12 place-items-center rounded-full border border-white/50 bg-black/20 text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-nova-ink"
            whileTap={{ scale: 0.96 }}
          >
            {playing ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
          </motion.button>
        </Reveal>
      </div>
    </section>
  )
}
