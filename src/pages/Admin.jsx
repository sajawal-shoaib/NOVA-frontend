import { useMemo, useRef, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { Check, Film, ImagePlus, Loader2, Plus, Trash2, X } from "lucide-react"
import { useStore } from "../context/StoreContext"
import { api } from "../lib/api"
import { formatPrice } from "../lib/format"

function CampaignVideoCard() {
  const { settings, refreshSettings } = useStore()
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState("idle")
  const [error, setError] = useState("")

  const onPick = () => fileInputRef.current?.click()

  const onFileChosen = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ""
    if (!file) return

    setError("")
    setStatus("uploading")
    try {
      const uploadRes = await api.uploadFile("/media/upload", file, { folder: "site" })
      const { url, fileId } = uploadRes.data.file

      setStatus("saving")
      await api.patch("/settings", { campaignVideo: { url, fileId } })

      await refreshSettings()
      setStatus("done")
      setTimeout(() => setStatus("idle"), 1800)
    } catch (err) {
      setError(err.message || "Something went wrong")
      setStatus("error")
    }
  }

  const busy = status === "uploading" || status === "saving"
  const hasVideo = !!settings?.campaignVideo?.url

  return (
    <div className="mb-10 overflow-hidden rounded-2xl border border-nova-border bg-white">
      <button
        type="button"
        onClick={onPick}
        disabled={busy}
        className="relative block aspect-[21/9] w-full overflow-hidden bg-nova-ink"
      >
        {hasVideo ? (
          <video
            key={settings.campaignVideo.url}
            src={settings.campaignVideo.url}
            className="h-full w-full object-cover"
            muted
            loop
            autoPlay
            playsInline
          />
        ) : (
          <div className="grid h-full place-items-center text-white/50">
            <Film size={32} />
          </div>
        )}

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 text-white transition-opacity ${
            busy || status === "done" || status === "error" ? "opacity-100" : "opacity-0 hover:opacity-100"
          }`}
        >
          {status === "uploading" && (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">Uploading…</span>
            </>
          )}
          {status === "saving" && (
            <>
              <Loader2 size={24} className="animate-spin" />
              <span className="text-sm">Saving…</span>
            </>
          )}
          {status === "done" && (
            <>
              <Check size={26} />
              <span className="text-sm">Updated</span>
            </>
          )}
          {status === "error" && <span className="max-w-[80%] text-center text-sm text-red-200">{error}</span>}
          {status === "idle" && (
            <>
              <ImagePlus size={24} />
              <span className="text-sm">{hasVideo ? "Click to replace this video" : "Click to upload a video"}</span>
            </>
          )}
        </div>
      </button>

      <input ref={fileInputRef} type="file" accept="video/*" className="hidden" onChange={onFileChosen} />

      <div className="p-4">
        <p className="text-[10px] uppercase tracking-[0.14em] text-nova-muted">Homepage</p>
        <p className="mt-0.5 text-sm font-medium text-nova-ink">"Move through the worlds" campaign film</p>
      </div>
    </div>
  )
}

function ProductPhotoCard({ product, categoryName }) {
  const { refreshCatalog } = useStore()
  const fileInputRef = useRef(null)
  const [status, setStatus] = useState("idle") // idle | uploading | saving | done | error
  const [error, setError] = useState("")
  const [deleting, setDeleting] = useState(false)

  const onPick = () => fileInputRef.current?.click()

  const onFileChosen = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = "" // allow picking the same file again later
    if (!file) return

    setError("")
    setStatus("uploading")
    try {
      const uploadRes = await api.uploadFile("/media/upload", file, { folder: product.category })
      const { url, fileId } = uploadRes.data.file

      setStatus("saving")
      await api.patch(`/products/${product.id}`, {
        images: [{ url, fileId }],
      })

      await refreshCatalog()
      setStatus("done")
      setTimeout(() => setStatus("idle"), 1800)
    } catch (err) {
      setError(err.message || "Something went wrong")
      setStatus("error")
    }
  }

  const onDelete = async () => {
    if (!window.confirm(`Delete "${product.name}"? This can't be undone.`)) return
    setDeleting(true)
    try {
      await api.delete(`/products/${product.id}`)
      await refreshCatalog()
    } catch (err) {
      setError(err.message || "Couldn't delete this product")
      setStatus("error")
      setDeleting(false)
    }
  }

  const busy = status === "uploading" || status === "saving" || deleting

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-nova-border bg-white">
      <button
        type="button"
        onClick={onDelete}
        disabled={busy}
        aria-label="Delete product"
        className="absolute right-2 top-2 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/45 text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100 disabled:opacity-100"
      >
        {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
      </button>

      <button
        type="button"
        onClick={onPick}
        disabled={busy}
        className="relative block aspect-[4/5] w-full overflow-hidden bg-nova-bg"
      >
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />

        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/55 text-white transition-opacity ${
            busy || status === "done" || status === "error" ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
        >
          {status === "uploading" && (
            <>
              <Loader2 size={22} className="animate-spin" />
              <span className="text-xs">Uploading…</span>
            </>
          )}
          {status === "saving" && (
            <>
              <Loader2 size={22} className="animate-spin" />
              <span className="text-xs">Saving to product…</span>
            </>
          )}
          {status === "done" && (
            <>
              <Check size={24} />
              <span className="text-xs">Updated</span>
            </>
          )}
          {status === "error" && <span className="max-w-[80%] text-center text-xs text-red-200">{error}</span>}
          {status === "idle" && !deleting && (
            <>
              <ImagePlus size={22} />
              <span className="text-xs">Click to replace photo</span>
            </>
          )}
        </div>
      </button>

      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={onFileChosen} />

      <div className="p-3">
        <p className="text-[10px] uppercase tracking-[0.14em] text-nova-muted">{categoryName}</p>
        <p className="mt-0.5 truncate text-sm font-medium text-nova-ink">{product.name}</p>
        <p className="mt-0.5 text-xs text-nova-muted">{formatPrice(product.price)}</p>
      </div>
    </div>
  )
}

const EMPTY_FORM = {
  name: "",
  category: "",
  price: "",
  description: "",
  stock: "50",
  variants: "",
  featured: false,
  trending: false,
  drop: false,
}

function NewProductForm({ open, onClose }) {
  const { categories, refreshCatalog } = useStore()
  const fileInputRef = useRef(null)

  const [form, setForm] = useState(EMPTY_FORM)
  const [images, setImages] = useState([]) // [{ url, fileId, uploading?: bool, tempId }]
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  const setField = (field) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const onPickImages = () => fileInputRef.current?.click()

  const onFilesChosen = async (e) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ""
    if (!files.length) return

    const folder = form.category || "products"

    for (const file of files) {
      const tempId = `${Date.now()}-${Math.random()}`
      setImages((prev) => [...prev, { tempId, uploading: true, previewUrl: URL.createObjectURL(file) }])

      try {
        const res = await api.uploadFile("/media/upload", file, { folder })
        const { url, fileId } = res.data.file
        setImages((prev) => prev.map((img) => (img.tempId === tempId ? { tempId, url, fileId } : img)))
      } catch (err) {
        setError(err.message || "An image failed to upload")
        setImages((prev) => prev.filter((img) => img.tempId !== tempId))
      }
    }
  }

  const removeImage = async (img) => {
    setImages((prev) => prev.filter((i) => i.tempId !== img.tempId))
    if (img.fileId) {
      try {
        await api.delete(`/media/${img.fileId}`)
      } catch {
        // if it's already gone, or the request fails, there's nothing useful to show the admin here
      }
    }
  }

  const resetForm = () => {
    setForm(EMPTY_FORM)
    setImages([])
    setError("")
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!form.name.trim()) return setError("Give it a name")
    if (!form.category) return setError("Choose a category")
    if (!form.price || Number(form.price) < 0) return setError("Enter a valid price")
    if (!form.description.trim()) return setError("Add a description")
    if (images.some((img) => img.uploading)) return setError("Wait for the photos to finish uploading")
    const readyImages = images.filter((img) => img.url)
    if (readyImages.length === 0) return setError("Add at least one photo")

    setSubmitting(true)
    try {
      await api.post("/products", {
        name: form.name.trim(),
        category: form.category,
        price: Number(form.price),
        description: form.description.trim(),
        stock: Number(form.stock) || 0,
        variants: form.variants
          .split(",")
          .map((v) => v.trim())
          .filter(Boolean),
        featured: form.featured,
        trending: form.trending,
        drop: form.drop,
        images: readyImages.map(({ url, fileId }) => ({ url, fileId })),
      })

      await refreshCatalog()
      resetForm()
      onClose()
    } catch (err) {
      setError(err.message || "Couldn't create the product")
    } finally {
      setSubmitting(false)
    }
  }

  if (!open) return null

  return (
    <div className="mb-8 rounded-2xl border border-nova-border bg-white p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-2xl">New product</h2>
        <button
          type="button"
          onClick={() => {
            resetForm()
            onClose()
          }}
          aria-label="Close"
          className="grid h-9 w-9 place-items-center rounded-full text-nova-muted transition-colors hover:bg-nova-bg hover:text-nova-ink"
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={onSubmit} className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.14em] text-nova-muted">Name</span>
              <input
                type="text"
                value={form.name}
                onChange={setField("name")}
                placeholder="Atelier Wool Coat"
                className="mt-2 w-full border border-nova-border bg-white px-4 py-3 text-sm outline-none focus:border-nova-ink"
              />
            </label>

            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.14em] text-nova-muted">Category</span>
              <select
                value={form.category}
                onChange={setField("category")}
                className="mt-2 w-full border border-nova-border bg-white px-4 py-3 text-sm outline-none focus:border-nova-ink"
              >
                <option value="">Select a category</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.14em] text-nova-muted">Price (USD)</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={setField("price")}
                placeholder="428"
                className="mt-2 w-full border border-nova-border bg-white px-4 py-3 text-sm outline-none focus:border-nova-ink"
              />
            </label>

            <label className="block">
              <span className="text-[11px] uppercase tracking-[0.14em] text-nova-muted">Stock</span>
              <input
                type="number"
                min="0"
                value={form.stock}
                onChange={setField("stock")}
                className="mt-2 w-full border border-nova-border bg-white px-4 py-3 text-sm outline-none focus:border-nova-ink"
              />
            </label>
          </div>

          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.14em] text-nova-muted">Description</span>
            <textarea
              value={form.description}
              onChange={setField("description")}
              rows={4}
              placeholder="A long-line coat in double-faced wool..."
              className="mt-2 w-full resize-none border border-nova-border bg-white px-4 py-3 text-sm outline-none focus:border-nova-ink"
            />
          </label>

          <label className="block">
            <span className="text-[11px] uppercase tracking-[0.14em] text-nova-muted">
              Variants <span className="normal-case text-nova-muted/70">(comma-separated, optional)</span>
            </span>
            <input
              type="text"
              value={form.variants}
              onChange={setField("variants")}
              placeholder="XS, S, M, L, XL"
              className="mt-2 w-full border border-nova-border bg-white px-4 py-3 text-sm outline-none focus:border-nova-ink"
            />
          </label>

          <div className="flex flex-wrap gap-6">
            {[
              ["featured", "Featured"],
              ["trending", "Trending"],
              ["drop", "This week's drop"],
            ].map(([key, label]) => (
              <label key={key} className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form[key]} onChange={setField(key)} className="h-4 w-4" />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <span className="text-[11px] uppercase tracking-[0.14em] text-nova-muted">Photos</span>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {images.map((img) => (
              <div key={img.tempId} className="relative aspect-square overflow-hidden rounded-lg bg-nova-bg">
                <img src={img.url || img.previewUrl} alt="" className="h-full w-full object-cover" />
                {img.uploading ? (
                  <div className="absolute inset-0 grid place-items-center bg-black/40 text-white">
                    <Loader2 size={16} className="animate-spin" />
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => removeImage(img)}
                    aria-label="Remove photo"
                    className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-black/55 text-white hover:bg-red-600"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={onPickImages}
              className="grid aspect-square place-items-center rounded-lg border border-dashed border-nova-border text-nova-muted transition-colors hover:border-nova-ink hover:text-nova-ink"
            >
              <ImagePlus size={20} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={onFilesChosen}
          />

          {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 w-full bg-nova-ink px-6 py-3.5 text-[11px] uppercase tracking-[0.2em] text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "Creating…" : "Create product"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default function Admin() {
  const { user, authLoading, products, categories, catalogLoading } = useStore()
  const [activeCategory, setActiveCategory] = useState("all")
  const [search, setSearch] = useState("")
  const [showNewProduct, setShowNewProduct] = useState(false)

  const filtered = useMemo(() => {
    let list = activeCategory === "all" ? products : products.filter((p) => p.category === activeCategory)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    return list
  }, [products, activeCategory, search])

  if (authLoading || catalogLoading) return null

  if (!user) {
    return (
      <div className="mx-auto max-w-md px-5 py-24 text-center">
        <h1 className="font-display text-3xl">Admins only</h1>
        <p className="mt-3 text-nova-muted">Sign in with an admin account to manage product photos.</p>
        <Link to="/login" state={{ from: "/admin" }} className="mt-6 inline-block underline">
          Sign in
        </Link>
      </div>
    )
  }

  if (user.role !== "admin") {
    return <Navigate to="/" replace />
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-12 md:px-8">
      <p className="text-[11px] uppercase tracking-[0.28em] text-nova-muted">Admin</p>
      <h1 className="mt-2 font-display text-4xl">Site media</h1>
      <p className="mt-2 max-w-xl text-sm text-nova-muted">
        Click any photo or video below to replace it. It uploads straight to ImageKit and saves in
        the right place automatically — no copying URLs.
      </p>

      <div className="mt-10">
        <p className="text-[11px] uppercase tracking-[0.2em] text-nova-muted">Site-wide</p>
        <div className="mt-3">
          <CampaignVideoCard />
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <p className="text-[11px] uppercase tracking-[0.2em] text-nova-muted">Products</p>
        <button
          type="button"
          onClick={() => setShowNewProduct((v) => !v)}
          className="flex items-center gap-1.5 rounded-full bg-nova-ink px-4 py-2 text-[11px] uppercase tracking-[0.14em] text-white transition-opacity hover:opacity-90"
        >
          <Plus size={14} />
          New product
        </button>
      </div>

      <div className="mt-4">
        <NewProductForm open={showNewProduct} onClose={() => setShowNewProduct(false)} />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setActiveCategory("all")}
          className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors ${
            activeCategory === "all"
              ? "border-nova-ink bg-nova-ink text-white"
              : "border-nova-border text-nova-muted hover:border-nova-ink hover:text-nova-ink"
          }`}
        >
          All ({products.length})
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            type="button"
            onClick={() => setActiveCategory(c.slug)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.12em] transition-colors ${
              activeCategory === c.slug
                ? "border-nova-ink bg-nova-ink text-white"
                : "border-nova-border text-nova-muted hover:border-nova-ink hover:text-nova-ink"
            }`}
          >
            {c.name} ({products.filter((p) => p.category === c.slug).length})
          </button>
        ))}

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products…"
          className="ml-auto w-full max-w-xs border border-nova-border bg-white px-4 py-2 text-sm outline-none focus:border-nova-ink"
        />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((product) => {
          const category = categories.find((c) => c.slug === product.category)
          return (
            <ProductPhotoCard key={product.id} product={product} categoryName={category?.name || product.category} />
          )
        })}
      </div>

      {filtered.length === 0 && <p className="mt-16 text-center text-nova-muted">No products match that filter.</p>}
    </div>
  )
}
