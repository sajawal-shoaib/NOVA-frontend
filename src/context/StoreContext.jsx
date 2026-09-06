import { createContext, useContext, useEffect, useRef, useState } from "react"
import { api } from "../lib/api"
import { STORAGE_KEYS } from "../lib/format"

const StoreContext = createContext(null)

const read = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

const normalizeProduct = (p) => ({
  ...p,
  id: p.slug,
  images: Array.isArray(p.images) ? p.images.map((img) => (typeof img === "string" ? img : img.url)) : [],
})

const normalizeCategory = (c) => ({
  ...c,
  id: c.slug,
  image: typeof c.image === "string" ? c.image : c.image?.url ?? null,
  portrait: typeof c.portrait === "string" ? c.portrait : c.portrait?.url ?? null,
})

export function StoreProvider({ children }) {
  // ---- Auth ----
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)

  // ---- Catalog ----
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [catalogLoading, setCatalogLoading] = useState(true)
  const [settings, setSettings] = useState(null)

  // ---- Cart & Wishlist ----
  const [guestCart, setGuestCart] = useState(() => read(STORAGE_KEYS.cart, []))
  const [guestWishlist, setGuestWishlist] = useState(() => read(STORAGE_KEYS.wishlist, []))
  const [serverCart, setServerCart] = useState({ items: [], cartCount: 0, cartTotal: 0 })
  const [serverWishlist, setServerWishlist] = useState([])

  // ---- UI Overlay State ----
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [fly, setFly] = useState(null)
  const cartIconRef = useRef(null)

  useEffect(() => {
    if (!user) localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(guestCart))
  }, [guestCart, user])

  useEffect(() => {
    if (!user) localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(guestWishlist))
  }, [guestWishlist, user])

  const loadCatalog = async () => {
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        api.get("/products?limit=100"),
        api.get("/categories"),
      ])
      setProducts(productsRes.data.items.map(normalizeProduct))
      setCategories(categoriesRes.data.categories.map(normalizeCategory))
    } catch (err) {
      console.error("Failed to load the catalog:", err.message)
    }
  }

  const loadSettings = async () => {
    try {
      const res = await api.get("/settings")
      setSettings(res.data.settings)
    } catch (err) {
      console.error("Failed to load site settings:", err.message)
    }
  }

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (cancelled) return
      await Promise.all([loadCatalog(), loadSettings()])
      if (!cancelled) setCatalogLoading(false)
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await api.get("/auth/me")
        if (!cancelled) setUser(res.data.user)
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setAuthLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const refreshServerCart = async () => {
    try {
      const res = await api.get("/cart")
      setServerCart(res.data)
    } catch (err) {
      console.error("Failed to load cart:", err.message)
    }
  }

  const refreshServerWishlist = async () => {
    try {
      const res = await api.get("/wishlist")
      setServerWishlist(res.data.products.map(normalizeProduct))
    } catch (err) {
      console.error("Failed to load wishlist:", err.message)
    }
  }

  useEffect(() => {
    if (!user) return
    let cancelled = false
    ;(async () => {
      for (const item of guestCart) {
        try {
          await api.post("/cart", { productSlug: item.id, variant: item.variant, qty: item.qty })
        } catch (err) {
          console.error("Couldn't merge a guest cart item:", err.message)
        }
      }

      if (guestWishlist.length) {
        try {
          const existing = await api.get("/wishlist")
          const already = new Set(existing.data.products.map((p) => p.slug))
          for (const slug of guestWishlist) {
            if (already.has(slug)) continue
            await api.post(`/wishlist/${slug}/toggle`)
          }
        } catch (err) {
          console.error("Couldn't merge the guest wishlist:", err.message)
        }
      }

      if (cancelled) return
      setGuestCart([])
      setGuestWishlist([])
      localStorage.removeItem(STORAGE_KEYS.cart)
      localStorage.removeItem(STORAGE_KEYS.wishlist)

      await refreshServerCart()
      await refreshServerWishlist()
    })()
    return () => {
      cancelled = true
    }
  }, [user?.id])

  // ---- Derived Cart & Wishlist Views ----
  const cartItems = user
    ? serverCart.items.map((item) => ({
        id: item.product,
        variant: item.variant,
        qty: item.qty,
        product: {
          id: item.product,
          name: item.name,
          price: item.price,
          images: item.image ? [item.image] : [],
        },
      }))
    : guestCart
        .map((item) => {
          const product = products.find((p) => p.id === item.id)
          if (!product) return null
          return { ...item, product }
        })
        .filter(Boolean)

  const cartCount = user ? serverCart.cartCount : cartItems.reduce((sum, item) => sum + item.qty, 0)
  const cartTotal = user
    ? serverCart.cartTotal
    : cartItems.reduce((sum, item) => sum + item.product.price * item.qty, 0)

  const wishlistProducts = user
    ? serverWishlist
    : guestWishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  const wishlist = user ? serverWishlist.map((p) => p.id) : guestWishlist
  const isWishlisted = (id) => wishlist.includes(id)

  // ---- Fast Optimistic Cart Actions ----
  const addToCart = async (id, variant, qty = 1, originRect) => {
    if (user) {
      try {
        await api.post("/cart", { productSlug: id, variant, qty })
        await refreshServerCart()
      } catch (err) {
        console.error("Couldn't add to cart:", err.message)
      }
    } else {
      setGuestCart((prev) => {
        const i = prev.findIndex((p) => p.id === id && p.variant === variant)
        if (i >= 0) {
          const next = [...prev]
          next[i] = { ...next[i], qty: next[i].qty + qty }
          return next
        }
        return [...prev, { id, variant, qty }]
      })
    }

    const product = products.find((p) => p.id === id)
    const target = cartIconRef.current?.getBoundingClientRect()
    if (product && originRect && target) {
      setFly({
        image: product.images[0],
        from: {
          x: originRect.left + originRect.width / 2,
          y: originRect.top + originRect.height / 2,
        },
        to: {
          x: target.left + target.width / 2,
          y: target.top + target.height / 2,
        },
      })
    }
    setCartOpen(true)
  }

  const updateQty = async (id, variant, qty) => {
    if (qty <= 0) {
      return removeFromCart(id, variant)
    }

    if (user) {
      // Instant Local State Update
      setServerCart((prev) => {
        const newItems = prev.items.map((item) => {
          if (item.product === id && item.variant === variant) {
            return { ...item, qty }
          }
          return item
        })
        const newCartCount = newItems.reduce((sum, item) => sum + item.qty, 0)
        const newCartTotal = newItems.reduce((sum, item) => sum + item.price * item.qty, 0)

        return { ...prev, items: newItems, cartCount: newCartCount, cartTotal: newCartTotal }
      })

      // Sync with Backend in Background
      try {
        await api.patch(`/cart/${id}`, { variant, qty })
      } catch (err) {
        console.error("Couldn't update cart:", err.message)
        await refreshServerCart()
      }
    } else {
      setGuestCart((prev) =>
        prev
          .map((item) => (item.id === id && item.variant === variant ? { ...item, qty } : item))
          .filter((item) => item.qty > 0),
      )
    }
  }

  const removeFromCart = async (id, variant) => {
    if (user) {
      // Instant Local Removal
      setServerCart((prev) => {
        const newItems = prev.items.filter(
          (item) => !(item.product === id && item.variant === variant)
        )
        const newCartCount = newItems.reduce((sum, item) => sum + item.qty, 0)
        const newCartTotal = newItems.reduce((sum, item) => sum + item.price * item.qty, 0)

        return { ...prev, items: newItems, cartCount: newCartCount, cartTotal: newCartTotal }
      })

      // Sync with Backend in Background
      try {
        const query = variant ? `?variant=${encodeURIComponent(variant)}` : ""
        await api.delete(`/cart/${id}${query}`)
      } catch (err) {
        console.error("Couldn't remove from cart:", err.message)
        await refreshServerCart()
      }
    } else {
      setGuestCart((prev) => prev.filter((item) => !(item.id === id && item.variant === variant)))
    }
  }

  const clearCart = async () => {
    if (user) {
      setServerCart({ items: [], cartCount: 0, cartTotal: 0 })
      try {
        await api.delete("/cart")
      } catch (err) {
        console.error("Couldn't clear cart:", err.message)
        await refreshServerCart()
      }
    } else {
      setGuestCart([])
    }
  }

  // ---- Wishlist Actions ----
  const toggleWishlist = async (id) => {
    if (user) {
      try {
        await api.post(`/wishlist/${id}/toggle`)
        await refreshServerWishlist()
      } catch (err) {
        console.error("Couldn't update wishlist:", err.message)
      }
    } else {
      setGuestWishlist((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
    }
  }

  // ---- Catalog Helpers ----
  const getProduct = (id) => products.find((p) => p.id === id)
  const getProductsByCategory = (slug) => products.filter((p) => p.category === slug)
  const getTrending = () => products.filter((p) => p.trending)
  const getFeatured = () => products.filter((p) => p.featured)
  const getDrop = () => products.filter((p) => p.drop)
  const getCategory = (slug) => categories.find((c) => c.slug === slug)

  const searchProducts = (query) => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return products.filter((p) => {
      const name = (p.name || p.title || "").toLowerCase()
      const categoryName = typeof p.category === "string" 
        ? p.category.toLowerCase() 
        : (p.category?.name || p.category?.slug || "").toLowerCase()

      return name.includes(q) || categoryName.includes(q)
    })
  }

  // ---- Auth Actions ----
  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password })
    setUser(res.data.user)
    return res.data.user
  }

  const register = async (name, email, password) => {
    const res = await api.post("/auth/register", { name, email, password })
    setUser(res.data.user)
    return res.data.user
  }

  const logout = async () => {
    try {
      await api.post("/auth/logout")
    } catch {
      // state reset happens regardless
    }
    setUser(null)
    setServerCart({ items: [], cartCount: 0, cartTotal: 0 })
    setServerWishlist([])
  }

  // ---- Checkout ----
  const placeOrder = async (shippingAddress) => {
    const res = await api.post("/orders", { shippingAddress })
    await refreshServerCart()
    return res.data.order
  }

  const closeOverlays = () => {
    setCartOpen(false)
    setSearchOpen(false)
    setAccountOpen(false)
    setMenuOpen(false)
  }

  const value = {
    user,
    authLoading,
    login,
    register,
    logout,
    products,
    categories,
    catalogLoading,
    getProduct,
    getProductsByCategory,
    getTrending,
    getFeatured,
    getDrop,
    getCategory,
    searchProducts,
    refreshCatalog: loadCatalog,
    settings,
    refreshSettings: loadSettings,
    cartItems,
    cartCount,
    cartTotal,
    addToCart,
    updateQty,
    removeFromCart,
    clearCart,
    placeOrder,
    wishlist,
    wishlistProducts,
    toggleWishlist,
    isWishlisted,
    cartOpen,
    setCartOpen,
    searchOpen,
    setSearchOpen,
    accountOpen,
    setAccountOpen,
    menuOpen,
    setMenuOpen,
    closeOverlays,
    fly,
    setFly,
    cartIconRef,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error("useStore must be used within StoreProvider")
  return ctx
}