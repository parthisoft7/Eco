import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ShoppingCart, Plus, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { Product } from '../types';

// Mock data for initial development
const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Floor Cleaner (5L)', categoryId: 'housekeeping', price: 450, discount: 10, stock: 25, imageUrl: 'https://picsum.photos/seed/cleaner/400/400', isActive: true, createdAt: Date.now() },
  { id: '2', name: 'Kitchen Dishwash Gel', categoryId: 'housekeeping', price: 120, discount: 5, stock: 40, imageUrl: 'https://picsum.photos/seed/gel/400/400', isActive: true, createdAt: Date.now() },
  { id: '3', name: 'Spicy Potato Chips (Bulk)', categoryId: 'snacks', price: 250, discount: 0, stock: 15, imageUrl: 'https://picsum.photos/seed/chips/400/400', isActive: true, createdAt: Date.now() },
  { id: '4', name: 'Butter Cookies Box', categoryId: 'snacks', price: 180, discount: 15, stock: 50, imageUrl: 'https://picsum.photos/seed/cookies/400/400', isActive: true, createdAt: Date.now() },
  { id: '5', name: 'Microfiber Cleaning Cloths', categoryId: 'housekeeping', price: 299, discount: 20, stock: 100, imageUrl: 'https://picsum.photos/seed/cloth/400/400', isActive: true, createdAt: Date.now() },
  { id: '6', name: 'Carrot Cake (Small Pack)', categoryId: 'snacks', price: 85, discount: 0, stock: 8, imageUrl: 'https://picsum.photos/seed/cake/400/400', isActive: true, createdAt: Date.now() },
];

const ProductsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { addToCart } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [filteredProducts, setFilteredProducts] = useState(MOCK_PRODUCTS);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    let result = MOCK_PRODUCTS;
    
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategory);
    }
    
    if (debouncedSearchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
    }
    
    setFilteredProducts(result);
  }, [debouncedSearchQuery, selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Our Products</h1>
        
        <div className="flex flex-col sm:flex-row items-stretch gap-4">
          <div className="relative flex-grow min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <select 
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            <option value="housekeeping">Housekeeping</option>
            <option value="snacks">Snacks & Food</option>
          </select>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => {
            const hasDiscount = product.discount > 0;
            const finalPrice = hasDiscount ? product.price * (1 - product.discount / 100) : product.price;
            
            return (
              <div key={product.id} className="group bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-50">
                  <img 
                    src={product.imageUrl} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {hasDiscount && (
                    <div className="absolute top-2 right-2 bg-rose-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {product.discount}% OFF
                    </div>
                  )}
                  {product.stock < 10 && (
                    <div className="absolute bottom-2 left-2 bg-amber-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded">
                      Only {product.stock} Left
                    </div>
                  )}
                </Link>
                <div className="p-4">
                  <div className="text-xs text-emerald-600 font-semibold uppercase tracking-wider mb-1">
                    {product.categoryId === 'housekeeping' ? 'Housekeeping' : 'Snacks & Food'}
                  </div>
                  <Link to={`/product/${product.id}`} className="block font-bold text-gray-900 hover:text-emerald-600 transition-colors line-clamp-1 mb-2">
                    {product.name}
                  </Link>
                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <span className="text-xl font-bold text-gray-900">₹{finalPrice.toFixed(0)}</span>
                      {hasDiscount && (
                        <span className="text-sm text-gray-400 line-through">₹{product.price}</span>
                      )}
                    </div>
                    <button 
                      onClick={() => addToCart(product)}
                      className="p-3 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-colors"
                      title="Add to Cart"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
          <button 
            onClick={() => {setSearchQuery(''); setSelectedCategory('all');}}
            className="mt-4 text-emerald-600 font-semibold underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductsPage;