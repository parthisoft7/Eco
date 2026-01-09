import React, { useState, useRef, useEffect } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X, Upload, Save, Loader2, CheckCircle, RefreshCcw, ShieldAlert } from 'lucide-react';
import { Product } from '../../types';
import { db, storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { 
  collection, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from 'firebase/firestore';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Subscribe to Firestore collection
  useEffect(() => {
    setError(null);
    const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const prods = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
      setProducts(prods);
      setLoading(false);
    }, (error: any) => {
      console.error("Firestore Error:", error);
      if (error.code === 'permission-denied') {
        setError("Missing or insufficient permissions. Please check your Firestore security rules.");
      } else {
        setError("Failed to fetch products. Please try again.");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Debounce logic for search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter products locally
  useEffect(() => {
    let result = products;
    if (debouncedSearchQuery) {
      result = result.filter(p => p.name.toLowerCase().includes(debouncedSearchQuery.toLowerCase()));
    }
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.categoryId === selectedCategory);
    }
    setFilteredProducts(result);
  }, [debouncedSearchQuery, selectedCategory, products]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteDoc(doc(db, 'products', id));
      } catch (err: any) {
        console.error("Delete error:", err);
        alert(err.code === 'permission-denied' ? "Insufficient permissions to delete." : "Could not delete product.");
      }
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setPreviewUrl(product.imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadProgress(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProduct = async () => {
    if (!editingProduct?.name || !editingProduct?.price) {
      alert("Please enter a name and price.");
      return;
    }

    try {
      setLoading(true);
      let imageUrl = editingProduct.imageUrl || '';

      // Upload image if selected
      if (selectedFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${selectedFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, selectedFile);
        
        await new Promise((resolve, reject) => {
          uploadTask.on('state_changed', 
            (snapshot) => setUploadProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100),
            reject,
            async () => {
              imageUrl = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(imageUrl);
            }
          );
        });
      }

      const productData = {
        name: editingProduct.name,
        categoryId: editingProduct.categoryId || 'housekeeping',
        price: Number(editingProduct.price),
        discount: Number(editingProduct.discount) || 0,
        stock: Number(editingProduct.stock) || 0,
        imageUrl,
        isActive: true,
        createdAt: editingProduct.createdAt || Date.now(),
      };

      if (editingProduct.id) {
        await updateDoc(doc(db, 'products', editingProduct.id), productData);
      } else {
        await addDoc(collection(db, 'products'), productData);
      }
      closeModal();
    } catch (err: any) {
      console.error("Save error:", err);
      alert(err.code === 'permission-denied' ? "Insufficient permissions to save changes." : "Error saving product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
          <p className="text-gray-500">Inventory control for Mudichur Mart</p>
        </div>
        <button 
          onClick={() => { setEditingProduct({ categoryId: 'housekeeping' }); setIsModalOpen(true); }}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold flex items-center hover:bg-emerald-700 transition-colors shadow-lg"
        >
          <Plus size={20} className="mr-2" /> Add Product
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search products..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="border border-gray-200 rounded-lg px-4 py-2 outline-none"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="housekeeping">Housekeeping</option>
          <option value="snacks">Snacks</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden min-h-[400px]">
        {loading && products.length === 0 && !error ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-4">
            <Loader2 className="animate-spin text-emerald-600" size={40} />
            <p className="text-gray-400 font-medium tracking-tight">Loading inventory...</p>
          </div>
        ) : error ? (
          <div className="p-20 flex flex-col items-center justify-center text-center space-y-4">
            <div className="p-4 bg-rose-50 text-rose-500 rounded-full">
              <ShieldAlert size={40} />
            </div>
            <div className="max-w-md">
              <h3 className="text-lg font-bold text-gray-900 mb-1">Access Error</h3>
              <p className="text-gray-500 text-sm">{error}</p>
              <p className="mt-4 text-xs text-gray-400">Ensure your project's Firestore Rules allow read/write access to the 'products' collection.</p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 flex items-center space-x-3">
                      <img src={p.imageUrl} className="w-10 h-10 rounded object-cover" alt="" />
                      <span className="font-bold">{p.name}</span>
                    </td>
                    <td className="px-6 py-4 font-medium">₹{p.price}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock < 10 ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleEdit(p)} className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(p.id)} className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredProducts.length === 0 && !loading && (
              <div className="py-20 text-center text-gray-400">
                <p>No products found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-xl font-bold">{editingProduct?.id ? 'Edit' : 'New'} Product</h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg"><X size={24} /></button>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase">Name</label>
                <input type="text" className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={editingProduct?.name || ''} onChange={e => setEditingProduct(p => ({...p, name: e.target.value}))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Price</label>
                  <input type="number" className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={editingProduct?.price || ''} onChange={e => setEditingProduct(p => ({...p, price: Number(e.target.value)}))} />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase">Stock</label>
                  <input type="number" className="w-full mt-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" value={editingProduct?.stock || ''} onChange={e => setEditingProduct(p => ({...p, stock: Number(e.target.value)}))} />
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden border flex items-center justify-center flex-shrink-0">
                  {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" alt="" /> : <Upload className="text-gray-300" size={32} />}
                </div>
                <div className="flex-grow">
                  <p className="text-xs font-bold text-gray-500 uppercase mb-1">Product Image</p>
                  <input type="file" onChange={handleFileChange} className="text-xs w-full" accept="image/*" />
                  {uploadProgress !== null && <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden"><div className="h-full bg-emerald-500 transition-all" style={{width: `${uploadProgress}%`}} /></div>}
                </div>
              </div>
            </div>
            <div className="p-6 border-t flex justify-end space-x-3 bg-gray-50">
              <button onClick={closeModal} className="px-4 py-2 font-bold text-gray-500 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleSaveProduct} className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-bold flex items-center shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-colors">
                <Save size={18} className="mr-2" /> Save Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;