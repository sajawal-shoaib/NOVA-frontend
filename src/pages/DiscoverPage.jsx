import { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check, RotateCcw, Sparkles } from "lucide-react"
import { useStore } from "../context/StoreContext"
import ProductCard from "../components/ProductCard"
import MagneticButton from "../components/MagneticButton"
import Reveal from "../components/Reveal"

const EASE = [0.22, 1, 0.36, 1]

const QUESTIONS = [
  {
    id: "vibe",
    prompt: "What is your main vibe today?",
    options: [
      { label: "Minimalist", votes: { home: 2, fashion: 1 } },
      { label: "Cyber & Tech", votes: { tech: 3 } },
      { label: "Streetwear", votes: { fashion: 3 } },
      { label: "Modern Classic", votes: { fashion: 2, home: 1 } },
    ],
  },
  {
    id: "palette",
    prompt: "What color palette matches your mood?",
    options: [
      { label: "Monochrome", votes: { tech: 2, fashion: 1 } },
      { label: "Warm Earth Tones", votes: { home: 2, travel: 1 } },
      { label: "Vibrant Accents", votes: { fitness: 2, fashion: 1 } },
      { label: "Cool Pastels", votes: { travel: 2, home: 1 } },
    ],
  },
  {
    id: "destination",
    prompt: "Where are you heading?",
    options: [
      { label: "Everyday Casual", votes: { fashion: 3 } },
      { label: "Late Night Out", votes: { fashion: 2, tech: 1 } },
      { label: "Workspace & Focus", votes: { tech: 2, home: 1 } },
      { label: "Outdoor Exploration", votes: { fitness: 2, travel: 2 } },
    ],
  },
]

export default function DiscoverPage() {
  const { categories = [], products = [], loading } = useStore()
  const [stage, setStage] = useState("intro")
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState([])

  // Match category by slug, ID, or lowercased name
  const getCategory = (key) => {
    if (!key) return null
    const target = String(key).toLowerCase().trim()
    return categories.find((c) => {
      const cSlug = String(c.slug || "").toLowerCase().trim()
      const cName = String(c.name || "").toLowerCase().trim()
      const cId = String(c.id || "").toLowerCase().trim()
      return cSlug === target || cName === target || cId === target
    })
  }

  // Find products for the matched category
  const getProductsByCategory = (cat) => {
    if (!cat) return []
    const targetSlug = String(cat.slug || "").toLowerCase().trim()
    const targetName = String(cat.name || "").toLowerCase().trim()
    
    return products.filter((p) => {
      const pCat = String(p.category || "").toLowerCase().trim()
      return pCat === targetSlug || pCat === targetName
    })
  }

  const resultCategory = useMemo(() => {
    if (answers.length !== QUESTIONS.length || categories.length === 0) return null

    // Count score for each available category dynamically
    const scores = {}
    
    answers.forEach((voteMap) => {
      Object.entries(voteMap).forEach(([key, points]) => {
        const cat = getCategory(key)
        if (cat) {
          const mainKey = cat.slug || cat.id || cat.name
          scores[mainKey] = (scores[mainKey] || 0) + points
        }
      })
    })

    // Pick highest score
    let bestCat = categories[0]
    let maxScore = -1

    Object.entries(scores).forEach(([key, score]) => {
      if (score > maxScore) {
        maxScore = score
        bestCat = getCategory(key)
      }
    })

    return bestCat || categories[0]
  }, [answers, categories])

  const resultProducts = useMemo(() => {
    if (!resultCategory) return []
    return getProductsByCategory(resultCategory).slice(0, 3)
  }, [resultCategory, products])

  const start = () => {
    setAnswers([])
    setStep(0)
    setStage("quiz")
  }

  const choose = (votes) => {
    const next = [...answers, votes]
    setAnswers(next)
    if (step + 1 < QUESTIONS.length) {
      setStep(step + 1)
    } else {
      setStage("result")
    }
  }

  const goBack = () => {
    if (step === 0) {
      setStage("intro")
      return
    }
    setAnswers(answers.slice(0, -1))
    setStep(step - 1)
  }

  const retake = () => {
    setAnswers([])
    setStep(0)
    setStage("quiz")
  }

  return (
    <div className="min-h-screen bg-nova-bg">
      <AnimatePresence mode="wait">
        {stage === "intro" && (
          <motion.section
            key="intro"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-center px-6 text-center"
          >
            <span className="grid h-14 w-14 place-items-center rounded-full bg-nova-soft text-nova-ink">
              <Sparkles size={22} />
            </span>
            <p className="mt-6 text-[11px] uppercase tracking-[0.32em] text-nova-muted">Discover</p>
            <h1 className="mt-4 max-w-2xl font-display text-5xl leading-[1.05] md:text-7xl">
              Find your world.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-relaxed text-nova-muted md:text-base">
              Three quick questions. One collection, matched to how you actually want to look, feel, and move today.
            </p>
            <MagneticButton
              onClick={start}
              className="mt-10 inline-flex items-center gap-2 bg-nova-ink px-8 py-4 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90"
            >
              Start style quiz
              <ArrowRight size={14} />
            </MagneticButton>
          </motion.section>
        )}

        {stage === "quiz" && (
          <motion.section
            key="quiz"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-2xl flex-col justify-center px-6 py-16"
          >
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-nova-muted">
              <button
                type="button"
                onClick={goBack}
                className="inline-flex items-center gap-1.5 transition-colors hover:text-nova-ink"
              >
                <ArrowLeft size={13} />
                Back
              </button>
              <span>
                Step {step + 1} of {QUESTIONS.length}
              </span>
            </div>

            <div className="mt-3 h-[3px] w-full bg-nova-border">
              <motion.div
                className="h-full bg-nova-ink"
                initial={false}
                animate={{ width: `${((step + 1) / QUESTIONS.length) * 100}%` }}
                transition={{ duration: 0.5, ease: EASE }}
              />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="mt-12"
              >
                <h2 className="font-display text-3xl leading-tight md:text-4xl">
                  {QUESTIONS[step].prompt}
                </h2>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  {QUESTIONS[step].options.map((option) => (
                    <motion.button
                      key={option.label}
                      type="button"
                      onClick={() => choose(option.votes)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 400, damping: 24 }}
                      className="group flex items-center justify-between border border-nova-border bg-white px-6 py-5 text-left text-sm font-medium text-nova-ink transition-colors hover:border-nova-ink"
                    >
                      {option.label}
                      <ArrowRight
                        size={15}
                        className="translate-x-0 text-nova-muted opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100"
                      />
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.section>
        )}

        {stage === "result" && (
          <motion.section
            key="result"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="mx-auto max-w-6xl px-6 py-20 md:px-8"
          >
            {loading || !resultCategory ? (
              <p className="py-24 text-center text-sm text-nova-muted">Finding your world…</p>
            ) : (
              <>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
                  className="relative overflow-hidden rounded-[32px] px-8 py-14 text-center md:px-16 md:py-20"
                  style={{ background: resultCategory.cardBg || resultCategory.soft || "#f4f4f5" }}
                >
                  <p className="text-[11px] uppercase tracking-[0.32em] text-nova-ink/70">
                    Your world is
                  </p>
                  <h2 className="mt-4 font-display text-5xl leading-tight text-nova-ink md:text-6xl">
                    {resultCategory.name}
                  </h2>
                  <p className="mx-auto mt-5 max-w-lg text-sm leading-relaxed text-nova-ink/80 md:text-base">
                    {resultCategory.description || resultCategory.tagline}
                  </p>

                  <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                    <Link to={`/category/${resultCategory.slug}`}>
                      <MagneticButton className="inline-flex items-center gap-2 bg-nova-ink px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90">
                        <Check size={14} />
                        Shop collection
                      </MagneticButton>
                    </Link>
                    <button
                      type="button"
                      onClick={retake}
                      className="inline-flex items-center gap-2 border border-nova-ink/20 bg-white/70 px-7 py-3.5 text-[11px] font-medium uppercase tracking-[0.2em] text-nova-ink transition-colors hover:border-nova-ink"
                    >
                      <RotateCcw size={13} />
                      Retake quiz
                    </button>
                  </div>
                </motion.div>

                {resultProducts.length > 0 && (
                  <Reveal className="mt-16">
                    <p className="text-center text-[11px] uppercase tracking-[0.28em] text-nova-muted">
                      Start here
                    </p>
                    <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                      {resultProducts.map((product, i) => (
                        <ProductCard key={product.id} product={product} index={i} fluid />
                      ))}
                    </div>
                  </Reveal>
                )}
              </>
            )}
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  )
}