# NOVA Frontend — Stage 5: Backend Integration

This app now talks to the real `nova-backend` API instead of the static
`src/data/products.js` / `categories.js` files and `localStorage`.

## Setup

```bash
npm install
cp .env.example .env   # defaults to http://localhost:5000/api — change if your backend runs elsewhere
npm run dev
```

Make sure the backend is running first (see `nova-backend/README.md`) and
seeded (`npm run seed` in the backend), or the shop will just look empty —
there's no fallback to the old static data anymore.

Also make sure the backend's `CLIENT_URL` in its `.env` matches whatever
port this frontend actually runs on (Vite defaults to `5174` in this
project, but confirm against your terminal output).

## What changed

### `src/lib/api.js` (new)
A small fetch wrapper. Every call sends `credentials: "include"` (required
for the httpOnly auth cookie), unwraps the backend's
`{ success, data, message }` envelope, and throws an `ApiError` with the
server's own message on failure.

### `src/context/StoreContext.jsx` (rewritten)
This is where almost all the integration lives:

- **Catalog**: fetches `/products` and `/categories` once on mount and
  keeps them in state. Every component that used to do
  `import { products } from "../data/products"` now reads from
  `useStore()` instead — same helper names (`getProduct`,
  `getProductsByCategory`, `getTrending`, `getFeatured`, `getDrop`,
  `getCategory`, `searchProducts`), so most components needed only an
  import swap.
- **The `id` vs `slug` question from Stage 2** was resolved by
  normalizing: every product/category gets `id: slug` attached when it's
  loaded into context, and `images`/`image`/`portrait` are flattened from
  `{ url, fileId }` to plain URL strings. Every existing component that
  expected `.id` and a flat image array keeps working unchanged.
- **Auth**: `user`, `login()`, `register()`, `logout()`. Session is
  restored on load via `GET /auth/me` (the cookie does the work).
- **Cart & wishlist — guest vs. signed-in**: signed out, they behave
  exactly as before (`localStorage`, instant, no network). Once signed
  in, every action calls the real API and the local guest cart/wishlist
  automatically merges into the account, then localStorage is cleared.
  This means people can add things to their cart *before* creating an
  account, same as any normal store.
- **Checkout**: `placeOrder(shippingAddress)` calls `POST /orders`.

### Pages/components touched
`CategorySection`, `ExploreCategories`, `FeaturedCollection`, `Footer`,
`Navbar`, `PromoSection`, `Category`, `Home`, `Product`, `Shop` — all
switched from static imports to `useStore()`. `Wishlist` and
`SearchPage` needed no changes at all; they already only used
`useStore()`.

`Category` and `Product` pages also got a `catalogLoading` guard — before,
`getProduct(id)` was synchronous (static data), so "not found" and
"still loading" were the same instant. Now they're not: without the
guard, both pages would flash a redirect to `/shop` for a moment before
the real data arrived.

`Login.jsx` and `SignIn.jsx` (sign-in and register) were previously
static mockups (`onSubmit={(e) => e.preventDefault()}`) — both are now
wired to real `login()`/`register()`, with loading and error states.
`SignIn.jsx` in particular was actually mislabeled as another sign-in
form; it's now a proper registration form (name/email/password).

`AccountPanel.jsx` (the slide-over from the header's account icon) now
shows real account info + sign out when logged in, or a link to the full
`/login` page when logged out — the old inline mini sign-in form is gone
since it wasn't wired to anything and would've been a second,
disconnected auth flow.

`Cart.jsx` now has a real checkout: a shipping-address form, calling
`placeOrder`, and an order-confirmation view. Signed-out visitors see
"Sign in to checkout" instead (which remembers to send them back to
`/cart` after signing in).

## A bug this integration caught (fixed)

`Product.jsx`'s selected-variant state used to initialize from
`product?.variants?.[0]` — fine when `product` was available synchronously
from a static import, but with the catalog now loading asynchronously,
`product` is `undefined` on first render, so `variant` would initialize to
`undefined` and *stay* `undefined` forever once the real product arrived
(`useState`'s initializer only runs once). Fixed with a small effect that
syncs the variant once the product loads.

## What was verified in this environment

- `npm run build` succeeds cleanly (Vite, zero errors) — confirms every
  import actually resolves and there's no leftover reference to the
  deleted static-data imports (`grep` also confirms zero remaining
  references anywhere in `src/`).
- The dev server boots and serves the app.
- 12 tests against `src/lib/api.js` directly (mocking `fetch`): correct
  envelope unwrapping, `credentials: "include"` is always sent, JSON
  bodies are serialized with the right header, and `ApiError` correctly
  carries the server's message/status/validation-errors on failure, a
  network failure, and a response with no JSON body (e.g. a 204).
- What **couldn't** be tested here, for the same reason as every backend
  stage: this sandbox can't reach a real MongoDB, ImageKit, or download a
  headless browser (Chrome/Chromium downloads are blocked by network
  policy here too). So the full click-through — register → browse → add
  to cart → sign in → checkout → see the order — needs to be run by hand
  once both servers are up on your machine. Given how much of this stack
  is now wired together, that manual pass is worth doing carefully;
  I'd suggest going through it in the order above so a guest cart merge
  is included in the test too.

## Known gaps / good next steps

- `src/data/products.js`, `categories.js`, and their helper functions are
  no longer imported anywhere — left in place in case you want to refer
  back to them, but safe to delete.
- The $150 free-shipping threshold and $12 flat rate are hardcoded in
  `Cart.jsx` for the order summary display, matching the backend's
  defaults — if you change `FREE_SHIPPING_THRESHOLD` / `FLAT_SHIPPING_RATE`
  in the backend `.env`, update the display copy in `Cart.jsx` to match
  (the actual charge is always computed server-side regardless, so this
  is a display-only mismatch risk, not a billing one).
- No order-history page yet (e.g. "My Orders") — the backend already
  supports `GET /api/orders`, so this is mostly a frontend page away.
- No password reset / email verification flow.
- Social login buttons (Google/Apple) were removed from the sign-in page
  rather than left in as non-functional — the backend's `User` model has
  a `provider` field ready for this, but no OAuth flow is wired up yet.
