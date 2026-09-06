export const formatPrice = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value)

export const STORAGE_KEYS = {
  cart: "nova.cart",
  wishlist: "nova.wishlist",
}
