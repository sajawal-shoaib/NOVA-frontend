import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import Home from "./pages/Home"
import Shop from "./pages/Shop"
import Category from "./pages/Category"
import Product from "./pages/Product"
import Cart from "./pages/Cart"
import Wishlist from "./pages/Wishlist"
import SearchPage from "./pages/SearchPage"
import About from "./pages/About"
import Login from "./pages/Login"
import SignIn from "./pages/SignIn"
import Admin from "./pages/Admin"
import NotFound from "./pages/NotFound"
import DiscoverPage from "./pages/DiscoverPage"

function App() {
  return (
    <Routes>
      <Route path="login" element={<Login />} />
      <Route path="signin" element={<SignIn />} />
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="shop" element={<Shop />} />
        <Route path="category/:slug" element={<Category />} />
        <Route path="product/:id" element={<Product />} />
        <Route path="cart" element={<Cart />} />
        <Route path="wishlist" element={<Wishlist />} />
        <Route path="search" element={<SearchPage />} />
        <Route path="about" element={<About />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App