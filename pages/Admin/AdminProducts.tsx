
import React, { useState, useRef } from 'react';
import { Plus, Search, Filter, Edit2, Trash2, X, Upload, Save, Loader2, CheckCircle } from 'lucide-react';
import { Product } from '../../types';
import { storage } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

const MOCK_PRODUCTS: Product[] = [
  { id: '1', name: 'Premium Floor Cleaner (5L)', categoryId: 'housekeeping', price: 450, discount: 10, stock: 25, imageUrl: 'https://picsum.photos/seed/cleaner/400/400', isActive: true, createdAt: Date.now() },
  { id: '2', name: 'Kitchen Dishwash Gel', categoryId: 'housekeeping', price: 120, discount: 5, stock: 40, imageUrl: 'https://picsum.photos/seed/gel/400/400', isActive: true, createdAt: Date.now() },
];

const AdminProducts = () => {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  
  // Image Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      setProducts(products.filter(p => p.id !== id));
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
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadImage = async () => {
    if (!selectedFile) return;

    const storageRef = ref(storage, `products/${Date.now()}_${selectedFile.name}`);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed", error);
        alert("Image upload failed. Please try again.");
        setUploadProgress(null);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setEditingProduct(prev => ({ ...prev, imageUrl: downloadURL }));
        setUploadProgress(null);
        setSelectedFile(null);
        alert("Image uploaded successfully!");
      }
    );
  };

  const handleSaveProduct = () => {
    if (!editingProduct?.name || !editingProduct?.price) {
      alert("Please fill in basic product details.");
      return;
    }

    if (editingProduct.id) {
      // Update existing
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? { ...p, ...editingProduct } as Product : p));
    } else {
      // Add new
      const newProduct: Product = {
        id: Math.random().toString(36).substr(2, 9),
        name: editingProduct.name || '',
        categoryId: editingProduct.categoryId || 'housekeeping',
        price: Number(editingProduct.price) || 0,
        discount: Number(editingProduct.discount) || 0,
        stock: Number(editingProduct.stock) || 0,
        imageUrl: editingProduct.imageUrl || 'https://via.placeholder.com/400',
        isActive: true,
        createdAt: Date.now(),
      };
      setProducts(prev => [...prev, newProduct]);
    }
    closeModal();
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Manage Products</h1>
        <button 
          onClick={() => { 
            setEditingProduct({ categoryId: 'housekeeping', discount: 0, stock: 0, price: 0 }); 
            setIsModalOpen(true); 
          }}
          className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-bold flex items-center hover:bg-emerald-700 transition-colors"
        >
          <Plus size={20} className="mr-2" /> Add New Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search by name..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
        <select className="border border-gray-200 rounded-lg px-4 py-2 outline-none">
          <option>All Categories</option>
          <option>Housekeeping</option>
          <option>Snacks</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Product</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Price</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Stock</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center space-x-3">
                    <img src={product.imageUrl} className="w-10 h-10 rounded-lg object-cover" alt="" />
                    <span className="font-bold text-gray-900">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{product.categoryId}</td>
                <td className="px-6 py-4">
                  <span className="font-bold">₹{product.price}</span>
                  {product.discount > 0 && <span className="ml-2 text-xs text-rose-500">-{product.discount}%</span>}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock < 10 ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                    {product.stock} units
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    <button 
                      onClick={() => handleEdit(product)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(product.id)}
                      className="p-2 text-rose-600 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-xl font-bold">{editingProduct?.id ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-900"><X size={24} /></button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6 flex-grow">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-bold text-gray-700">Product Name</label>
                  <input 
                    type="text" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                    placeholder="Enter name"
                    value={editingProduct?.name || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Category</label>
                  <select 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                    value={editingProduct?.categoryId || 'housekeeping'}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, categoryId: e.target.value }))}
                  >
                    <option value="housekeeping">Housekeeping</option>
                    <option value="snacks">Snacks</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Price (₹)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                    value={editingProduct?.price || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Stock Quantity</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                    value={editingProduct?.stock || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, stock: Number(e.target.value) }))}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700">Discount (%)</label>
                  <input 
                    type="number" 
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none" 
                    value={editingProduct?.discount || ''}
                    onChange={(e) => setEditingProduct(prev => ({ ...prev, discount: Number(e.target.value) }))}
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4 border-t border-gray-100">
                <label className="text-sm font-bold text-gray-700 flex items-center gap-2">
                  Product Image 
                  {editingProduct?.imageUrl && <CheckCircle className="text-emerald-500" size={16} />}
                </label>
                
                <div className="flex items-start gap-6">
                  {/* Preview Area */}
                  <div className="w-32 h-32 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 relative group">
                    {previewUrl ? (
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <Upload size={24} />
                      </div>
                    )}
                    {uploadProgress !== null && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                        <div className="text-white text-xs font-bold">{Math.round(uploadProgress)}%</div>
                      </div>
                    )}
                  </div>

                  <div className="flex-grow space-y-3">
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      className="hidden" 
                      accept="image/*"
                    />
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full py-2 px-4 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center justify-center gap-2"
                    >
                      <Upload size={18} /> Select New Image
                    </button>
                    
                    {selectedFile && (
                      <button 
                        onClick={handleUploadImage}
                        disabled={uploadProgress !== null}
                        className="w-full py-2 px-4 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-black flex items-center justify-center gap-2 disabled:bg-gray-400"
                      >
                        {uploadProgress !== null ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        {uploadProgress !== null ? 'Uploading...' : 'Confirm Upload to Server'}
                      </button>
                    )}
                    <p className="text-[10px] text-gray-400">
                      Upload an image to Firebase Storage to get a public URL for this product.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end space-x-3">
              <button onClick={closeModal} className="px-6 py-2 font-bold text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
              <button 
                onClick={handleSaveProduct}
                className="px-6 py-2 font-bold bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 flex items-center"
              >
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
