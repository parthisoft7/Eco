import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  ShoppingCart, 
  MapPin,
  Phone,
  Mail,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Settings
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
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import AdminLogin from './pages/Admin/AdminLogin';
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminProducts from './pages/Admin/AdminProducts';
import AdminOrders from './pages/Admin/AdminOrders';
import AdminUsers from './pages/Admin/AdminUsers';

// Policy Pages
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import RefundPage from './pages/RefundPage';
import ShippingPage from './pages/ShippingPage';

import { auth } from './firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const { cartItems } = useCart();
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = React.useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isAdminPath = location.pathname.startsWith('/admin');

  if (isAdminPath) return null;

  const handleLogout = async () => {
    await signOut(auth);
    setIsUserMenuOpen(false);
    navigate('/');
  };

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
              <ShoppingCart size={22} />
              {cartItems.length > 0 && (
                <span className="absolute top-0 right-0 bg-emerald-600 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>

            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-1 p-1 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="h-8 w-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
                    {user.email?.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} className="text-gray-400" />
                </button>

                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl py-2 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-4 py-2 border-b border-gray-50 mb-1">
                      <p className="text-xs text-gray-400">Signed in as</p>
                      <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                    </div>
                    <Link to="/profile" onClick={() => setIsUserMenuOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                      <UserIcon size={16} />
                      <span>My Profile</span>
                    </Link>
                    <Link to="/admin" onClick={() => setIsUserMenuOpen(false)} className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                      <Settings size={16} />
                      <span>Admin Dashboard</span>
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left"
                    >
                      <LogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors shadow-sm shadow-emerald-100">
                Sign In
              </Link>
            )}

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
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg animate-in slide-in-from-top-4 duration-200">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700 px-2 py-1">Home</Link>
          <Link to="/products" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700 px-2 py-1">Shop</Link>
          <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700 px-2 py-1">About</Link>
          <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-gray-700 px-2 py-1">Contact</Link>
          {user && (
            <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block text-lg font-medium text-emerald-600 px-2 py-1">My Account</Link>
          )}
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
          <h4 className="text-lg font-semibold text-white mb-4">Legal & Policies</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy-policy" className="hover:text-emerald-400">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-emerald-400">Terms & Conditions</Link></li>
            <li><Link to="/refund-policy" className="hover:text-emerald-400">Refund Policy</Link></li>
            <li><Link to="/shipping-policy" className="hover:text-emerald-400">Shipping Policy</Link></li>
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
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-gray-800 text-center text-xs">
        &copy; {new Date().getFullYear()} Mudichur Mart. All Rights Reserved. Designed for Chennai.
      </div>
    </footer>
  );
};

const ProtectedAdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/admin/login" />;
  
  return <>{children}</>;
};

const ProtectedUserRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" />;
  
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
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                
                {/* Policies Routes */}
                <Route path="/privacy-policy" element={<PrivacyPage />} />
                <Route path="/terms-and-conditions" element={<TermsPage />} />
                <Route path="/refund-policy" element={<RefundPage />} />
                <Route path="/shipping-policy" element={<ShippingPage />} />
                
                {/* User Routes */}
                <Route path="/profile" element={
                  <ProtectedUserRoute>
                    <ProfilePage />
                  </ProtectedUserRoute>
                } />

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
                <Route path="/admin/users" element={
                  <ProtectedAdminRoute>
                    <AdminUsers />
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