import { AnimatePresence, motion } from "framer-motion"
import { useStore } from "../context/StoreContext"

export default function FlyToCart() {
  const { fly, setFly } = useStore()

  return (
    <AnimatePresence>
      {fly && (
        <motion.img
          key={fly.image + fly.from.x}
          src={fly.image}
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed z-[80] h-16 w-16 rounded-sm object-cover"
          initial={{
            left: fly.from.x - 32,
            top: fly.from.y - 32,
            opacity: 1,
            scale: 1,
          }}
          animate={{
            left: fly.to.x - 16,
            top: fly.to.y - 16,
            opacity: 0.4,
            scale: 0.35,
          }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          onAnimationComplete={() => setFly(null)}
          style={{ position: "fixed" }}
        />
      )}
    </AnimatePresence>
  )
}
