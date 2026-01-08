
import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  MapPin,
  Phone,
  Mail
} from 'lucide-react';

// Contexts
import { CartProvider, useCart } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SuccessPage from './pages/SuccessPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';

const Navbar = () => {
  const { cartItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) return null;

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-emerald-600">Mudichur<span className="text-gray-900">Mart</span></span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Home</Link>
            <Link to="/products" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Shop</Link>
            <Link to="/about" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">About</Link>
            <Link to="/contact" className="text-gray-600 hover:text-emerald-600 font-medium transition-colors">Contact</Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-emerald-600 transition-colors">
              <ShoppingCart size={24} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>
            <button 
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700">Home</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700">Shop</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700">About</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700">Contact</Link>
        </div>
      )}
    </nav>
  );
};

const Footer = () => {
  const location = useLocation();
  if (location.pathname.startsWith('/admin')) return null;

  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-white">Mudichur<span className="text-emerald-500">Mart</span></h3>
          <p className="text-sm">Premium Housekeeping materials and delicious snacks delivered straight to your doorstep in Mudichur, Chennai.</p>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-emerald-400">Home</Link></li>
            <li><Link to="/products" className="hover:text-emerald-400">Products</Link></li>
            <li><Link to="/about" className="hover:text-emerald-400">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Contact Info</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start space-x-2">
              <MapPin size={18} className="text-emerald-500 shrink-0" />
              <span>123, Main Road, Mudichur, Chennai, Tamil Nadu 600048</span>
            </li>
            <li className="flex items-center space-x-2">
              <Phone size={18} className="text-emerald-500 shrink-0" />
              <span>+91 98765 43210</span>
            </li>
            <li className="flex items-center space-x-2">
              <Mail size={18} className="text-emerald-500 shrink-0" />
              <span>support@mudichurmart.com</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-lg font-semibold text-white mb-4">Business Hours</h4>
          <p className="text-sm">Mon - Sat: 9:00 AM - 9:00 PM</p>
          <p className="text-sm">Sunday: 10:00 AM - 6:00 PM</p>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-xs">
        &copy; {new Date().getFullYear()} Mudichur Mart. All Rights Reserved. Designed for Chennai.
      </div>
    </footer>
  );
};

// Fixed ProtectedAdminRoute by explicitly defining it as a React functional component with children to resolve TypeScript errors in the Route definitions.
const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" />;
  
  return <>{children}</>;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:id" element={<ProductDetailsPage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/success" element={<SuccessPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={
                  <ProtectedAdminRoute>
                    <AdminDashboard />
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/products" element={
                  <ProtectedAdminRoute>
                    <AdminProducts />
                  </ProtectedAdminRoute>
                } />
                <Route path="/admin/orders" element={
                  <ProtectedAdminRoute>
                    <AdminOrders />
                  </ProtectedAdminRoute>
                } />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
