
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  Plus, 
  Minus, 
  ShoppingCart, 
  ShieldCheck, 
  Truck, 
  RotateCcw,
  Star
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

// Using the same mock data for consistency
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Floor Cleaner (5L)', categoryId: 'housekeeping', price: 450, discount: 10, stock: 25, imageUrl: 'https://picsum.photos/seed/cleaner/600/600', isActive: true, createdAt: Date.now() },
  { id: '2', name: 'Kitchen Dishwash Gel', categoryId: 'housekeeping', price: 120, discount: 5, stock: 40, imageUrl: 'https://picsum.photos/seed/gel/600/600', isActive: true, createdAt: Date.now() },
  { id: '3', name: 'Spicy Potato Chips (Bulk)', categoryId: 'snacks', price: 250, discount: 0, stock: 15, imageUrl: 'https://picsum.photos/seed/chips/600/600', isActive: true, createdAt: Date.now() },
  { id: '4', name: 'Butter Cookies Box', categoryId: 'snacks', price: 180, discount: 15, stock: 50, imageUrl: 'https://picsum.photos/seed/cookies/600/600', isActive: true, createdAt: Date.now() },
  { id: '5', name: 'Microfiber Cleaning Cloths', categoryId: 'housekeeping', price: 299, discount: 20, stock: 100, imageUrl: 'https://picsum.photos/seed/cloth/600/600', isActive: true, createdAt: Date.now() },
  { id: '6', name: 'Carrot Cake (Small Pack)', categoryId: 'snacks', price: 85, discount: 0, stock: 8, imageUrl: 'https://picsum.photos/seed/cake/600/600', isActive: true, createdAt: Date.now() },
];

const ProductDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    const found = MOCK_PRODUCTS.find(p => p.id === id);
    if (found) {
      setProduct(found);
      setActiveImage(found.imageUrl);
    }
  }, [id]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold">Product not found</h2>
        <Link to="/products" className="text-emerald-600 mt-4 inline-block hover:underline">Back to shop</Link>
      </div>
    );
  }

  const finalPrice = product.discount > 0 ? product.price * (1 - product.discount / 100) : product.price;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 hover:text-emerald-600 mb-8 transition-colors"
      >
        <ChevronLeft size={20} /> Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
            <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-4">
            {[1, 2, 3].map(i => (
              <button 
                key={i} 
                onClick={() => setActiveImage(`https://picsum.photos/seed/${product.id}${i}/600/600`)}
                className={`w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${activeImage.includes(`${product.id}${i}`) ? 'border-emerald-500' : 'border-transparent'}`}
              >
                <img src={`https://picsum.photos/seed/${product.id}${i}/200/200`} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="mb-6">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-widest rounded-full mb-2">
              {product.categoryId === 'housekeeping' ? 'Housekeeping Materials' : 'Snacks & Food'}
            </span>
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2">{product.name}</h1>
            <div className="flex items-center space-x-2 text-amber-500 mb-4">
              <div className="flex"><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /></div>
              <span className="text-gray-400 text-sm">(4.8 / 5.0 - 12 reviews)</span>
            </div>
            
            <div className="flex items-baseline space-x-4">
              <span className="text-4xl font-bold text-gray-900">₹{finalPrice.toFixed(0)}</span>
              {product.discount > 0 && (
                <>
                  <span className="text-xl text-gray-400 line-through">₹{product.price}</span>
                  <span className="px-2 py-1 bg-rose-100 text-rose-600 text-sm font-bold rounded">SAVE {product.discount}%</span>
                </>
              )}
            </div>
          </div>

          <p className="text-gray-600 leading-relaxed mb-8">
            High-quality {product.name.toLowerCase()} sourced specifically for residents of Mudichur. 
            We ensure premium standards and competitive pricing. This item is ready for immediate local delivery within 24 hours.
          </p>

          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 space-y-6 mb-8">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-700">Select Quantity</span>
              <div className="flex items-center space-x-4 bg-white px-4 py-2 rounded-xl border border-gray-200">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-1 text-gray-500 hover:text-emerald-600"
                >
                  <Minus size={20} />
                </button>
                <span className="text-lg font-bold w-6 text-center">{quantity}</span>
                <button 
                  onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                  className="p-1 text-gray-500 hover:text-emerald-600"
                >
                  <Plus size={20} />
                </button>
              </div>
            </div>
            
            <div className="flex items-center text-sm">
              <div className={`h-3 w-3 rounded-full mr-2 ${product.stock > 10 ? 'bg-emerald-500' : 'bg-amber-500'}`}></div>
              <span className="text-gray-600 font-medium">
                {product.stock > 0 ? `${product.stock} units available in local warehouse` : 'Out of stock'}
              </span>
            </div>

            <button 
              onClick={() => addToCart(product, quantity)}
              disabled={product.stock === 0}
              className="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center justify-center space-x-3 shadow-lg shadow-emerald-100 disabled:bg-gray-300 disabled:shadow-none"
            >
              <ShoppingCart size={24} />
              <span>Add to Cart - ₹{(finalPrice * quantity).toFixed(0)}</span>
            </button>
          </div>

          {/* Value Props */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-gray-100 pt-8">
            <div className="flex flex-col items-center text-center space-y-1">
              <Truck size={20} className="text-emerald-600" />
              <span className="text-xs font-bold text-gray-900">24hr Delivery</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-1">
              <ShieldCheck size={20} className="text-emerald-600" />
              <span className="text-xs font-bold text-gray-900">Quality Assured</span>
            </div>
            <div className="flex flex-col items-center text-center space-y-1">
              <RotateCcw size={20} className="text-emerald-600" />
              <span className="text-xs font-bold text-gray-900">Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
