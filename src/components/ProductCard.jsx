import { Plus, Check } from "lucide-react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { useRef, useState } from "react"
import { useStore } from "../context/StoreContext"
import { formatPrice } from "../lib/format"

export default function ProductCard({ product, index = 0, fluid = false }) {
  const { addToCart } = useStore()
  const [added, setAdded] = useState(false)
  const btnRef = useRef(null)
  const subtitle = product.description.split(".")[0]

  const cardBg = "#FFFFFF"

  const onAdd = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const rect = btnRef.current?.getBoundingClientRect()
    addToCart(product.id, product.variants[0], 1, rect)
    setAdded(true)
    window.setTimeout(() => setAdded(false), 1400)
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.06, 0.3), duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={fluid ? "group relative h-full w-full pb-4 pr-4" : "group relative h-full w-[80vw] shrink-0 pb-4 pr-4 sm:w-[55vw] lg:w-[26rem]"}
    >
      <Link to={`/product/${product.id}`} className="relative block h-full">
        <motion.div
          initial={{ x: 0, y: 0 }}
          whileHover={{ x: -5, y: -5 }}
          whileTap={{ x: 0, y: 0 }}
          transition={{ type: "spring", stiffness: 420, damping: 22 }}
          className={`relative flex h-full flex-col items-center rounded-[32px] border border-nova-border px-8 text-center ${
            fluid ? "min-h-[540px] pb-10 pt-7 lg:min-h-[600px]" : "min-h-[460px] pb-8 pt-6"
          }`}
          style={{
            background: cardBg,
            boxShadow: "0 22px 44px rgba(23,20,16,0.09)",
          }}
        >
          <div className="flex w-full items-center justify-start">
            <button
              ref={btnRef}
              type="button"
              aria-label="Quick add to cart"
              onClick={onAdd}
              className="grid h-10 w-10 place-items-center rounded-full text-nova-ink transition-transform duration-300 hover:scale-110"
            >
              {added ? <Check size={22} strokeWidth={2.5} /> : <Plus size={26} strokeWidth={2.25} />}
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-2 py-6">
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              className={`w-auto object-contain drop-shadow-[0_18px_28px_rgba(0,0,0,0.18)] transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.05] group-hover:-rotate-2 ${
                fluid ? "max-h-[19rem] lg:max-h-[22rem]" : "max-h-72"
              }`}
            />
          </div>

          <div className="mt-2">
            <h3 className="font-sans text-xl font-semibold leading-tight text-nova-ink">{product.name}</h3>
            <p className="mt-1.5 line-clamp-2 min-h-[3.5rem] font-display text-lg italic text-nova-ink/75">{subtitle}</p>
            <p className="mt-2 text-sm text-nova-ink/70">From {formatPrice(product.price)}</p>
          </div>
        </motion.div>
      </Link>
    </motion.article>
  )
}
