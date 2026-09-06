import { motion, useReducedMotion } from "framer-motion"

const variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0 },
}

export default function Reveal({
  children,
  className = "",
  delay = 0,
  as = "div",
}) {
  const reduce = useReducedMotion()
  const Tag = motion[as] || motion.div

  if (reduce) {
    return <div className={className}>{children}</div>
  }

  return (
    <Tag
      className={className}
      initial="hidden"
      animate="show"
      variants={variants}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Tag>
  )
}
