import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';

// Pages
import Home from './Pages/Home';
import Subcategory from './Pages/Subcategory';
import Product from './Pages/Product';
import Detail from './Pages/Detail';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Cart from './Pages/Cart';
import Checkout from './Pages/Checkout';
import Orders from './Pages/Orders';
import Account from './Pages/Account';
import Wishlist from './Pages/Wishlist';
import Review from './Pages/Review';
import ReviewsPage from './Pages/ReviewsPage';
import ForgotPassword from './Pages/ForgotPassword';
import AdminLogin from './Pages/AdminLogin';
import Admin from './Pages/Admin';
import Daily from './Pages/Daily';
import About from './Components/About';     // if About is a component
import Contact from './Components/Contact'; // if Contact is a component
import Category from './Components/Category'; // optional Category page

const App = () => {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />

        {/* Category Main Page (optional) */}
        <Route path="/category" element={<Category />} />

        <Route path="/checkout" element={<Checkout />} />


        {/* Category → Subcategory */}
        <Route path="/category/:categorySlug" element={<Subcategory />} />

        {/* Subcategory → Product List */}
        <Route
          path="/category/:categorySlug/:subcategorySlug"
          element={<Product />}
        />

        {/* Product Detail Page */}
        <Route
          path="/category/:categorySlug/:subcategorySlug/:productSlug"
          element={<Detail />}
        />

        {/* About & Contact */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Cart */}
        <Route path="/cart" element={<Cart />} />

        {/* Orders & Account */}
        <Route path="/orders" element={<Orders />} />
        <Route path="/account" element={<Account />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/review" element={<Review />} />
        <Route path="/reviews/:productSlug" element={<ReviewsPage />} />
        { /* Admin signup removed */ }
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/reports" element={<Admin />} />
        <Route path="/daily" element={<Daily />} />
      </Routes>
    </Router>
  );
};

export default App;
