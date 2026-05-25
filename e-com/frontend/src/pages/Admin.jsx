import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  FiPackage,
  FiUsers,
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiShield,
  FiAlertCircle,
  FiX,
  FiChevronRight,
  FiTrendingUp,
  FiTruck,
  FiSettings,
  FiCheckCircle,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Admin() {
  const { isAdmin } = useAuth();
  
  // Navigation tabs: 'products' | 'users' | 'orders'
  const [activeTab, setActiveTab] = useState('products');

  // Products state
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editProductId, setEditProductId] = useState(null);

  // Product fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [brand, setBrand] = useState('');
  const [price, setPrice] = useState('');
  const [sizesInput, setSizesInput] = useState(''); // Comma separated sizes
  const [imageUrl, setImageUrl] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Users state
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);

  // Orders state
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // Dashboard Stats
  const [stats, setStats] = useState({
    products: 0,
    users: 0,
    orders: 0,
  });

  // Fetch Products
  const fetchProducts = async () => {
    setProductsLoading(true);
    try {
      const res = await API.get('/products');
      setProducts(res.data || []);
      setStats((prev) => ({ ...prev, products: res.data?.length || 0 }));
    } catch {
      toast.error('Failed to retrieve products catalog');
    } finally {
      setProductsLoading(false);
    }
  };

  // Fetch Users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await API.get('/users');
      setUsers(res.data || []);
      setStats((prev) => ({ ...prev, users: res.data?.length || 0 }));
    } catch {
      // Non-admins or errors
    } finally {
      setUsersLoading(false);
    }
  };

  // Fetch Orders
  const fetchOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await API.get('/admin/orders');
      setOrders(res.data || []);
      setStats((prev) => ({ ...prev, orders: res.data?.length || 0 }));
    } catch {
      toast.error('Failed to retrieve order fulfillment list');
    } finally {
      setOrdersLoading(false);
    }
  };

  // Reload statistics
  const reloadStats = async () => {
    await Promise.all([fetchProducts(), fetchUsers(), fetchOrders()]);
  };

  useEffect(() => {
    if (isAdmin) {
      reloadStats();
    }
  }, [isAdmin]);

  // Open product form for edit
  const handleOpenEditProduct = (prod) => {
    setEditProductId(prod.id);
    setTitle(prod.title || '');
    setDescription(prod.description || '');
    setBrand(prod.brand || '');
    setPrice(prod.price || '');
    
    // Parse sizes list safely to string
    let szStr = '';
    if (prod.sizes) {
      if (Array.isArray(prod.sizes)) {
        szStr = prod.sizes.join(', ');
      } else if (typeof prod.sizes === 'string') {
        try {
          const parsed = JSON.parse(prod.sizes.replace(/'/g, '"'));
          szStr = parsed.join(', ');
        } catch {
          szStr = prod.sizes;
        }
      }
    }
    setSizesInput(szStr);
    setImageUrl(prod.image_url || '');
    setShowProductForm(true);
  };

  const handleCloseProductForm = () => {
    setEditProductId(null);
    setTitle('');
    setDescription('');
    setBrand('');
    setPrice('');
    setSizesInput('');
    setImageUrl('');
    setShowProductForm(false);
  };

  // Create or Update Product
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !brand || !price || !sizesInput) {
      toast.error('Please enter all required product fields');
      return;
    }

    setSubmittingProduct(true);
    
    // Parse sizes safely to list
    const sizes = sizesInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title,
      description,
      brand,
      price: parseFloat(price),
      sizes,
      image_url: imageUrl || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    };

    try {
      if (editProductId) {
        // PUT /updateproduct/{id}
        await API.put(`/updateproduct/${editProductId}`, payload);
        toast.success('Product updated successfully!');
      } else {
        // POST /addproducts
        await API.post('/addproducts', payload);
        toast.success('Sneaker drop added successfully!');
      }
      handleCloseProductForm();
      await fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to submit product');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this premium sneaker drop? This is permanent.')) {
      try {
        await API.delete(`/deleteproduct?id=${id}`);
        toast.success('Product removed');
        await fetchProducts();
      } catch (err) {
        toast.error('Failed to delete product');
      }
    }
  };

  // Promote/Demote User Role
  const handleRoleUpdate = async (id, currentRole) => {
    const nextRole = currentRole === 'admin' ? 'user' : 'admin';
    if (window.confirm(`Update user role authorization to ${nextRole.toUpperCase()}?`)) {
      try {
        // PUT /addadmin?role={role}&id={id}
        await API.put(`/addadmin?role=${nextRole}&id=${id}`);
        toast.success('User authorization updated successfully!');
        await fetchUsers();
      } catch (err) {
        toast.error('Failed to change user authorization');
      }
    }
  };

  // Delete User
  const handleDeleteUser = async (id) => {
    if (window.confirm('Erase this user profile? This action is permanent.')) {
      try {
        await API.delete(`/deluser?id=${id}`);
        toast.success('User account erased');
        await fetchUsers();
      } catch (err) {
        toast.error('Failed to delete user');
      }
    }
  };

  // Update User Order Status step
  const handleUpdateOrderStatus = async (status) => {
    try {
      // PUT /orderupdate?status={status}
      await API.put(`/orderupdate?status=${status}`);
      toast.success(`Order timeline step changed to ${status.toUpperCase()}!`);
      await fetchOrders();
    } catch (err) {
      toast.error('Failed to update order timeline step');
    }
  };

  // Update Individual Order Status
  const handleUpdateIndividualOrderStatus = async (orderId, status) => {
    try {
      await API.put(`/admin/orders/${orderId}/status?status=${status}`);
      toast.success(`Order #${orderId} status changed to ${status.toUpperCase()}!`);
      await fetchOrders();
    } catch (err) {
      toast.error('Failed to update individual order status');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <FiAlertCircle className="w-12 h-12 text-red-400 mx-auto" />
        <h2 className="text-xl font-bold text-white uppercase tracking-wider">Access Restrained</h2>
        <p className="text-xs text-neutral-400 leading-relaxed">
          This system interface is locked under KICKS developer clearance. Standard user profiles do not possess admin privileges.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[80vh]">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-6 mb-10 text-left">
        <span className="text-xs font-black text-brand-neon tracking-widest uppercase">
          Authorization Clearance Level 2
        </span>
        <h1 className="text-3xl font-black text-white uppercase mt-1">Admin Control Console</h1>
      </div>

      {/* Luxury Analytics KPI Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 text-left">
        
        {/* KPI: Total Products */}
        <div className="bg-brand-surface-card border border-white/5 p-6 rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 font-extrabold tracking-widest uppercase block">
              Active Sneakers catalog
            </span>
            <span className="text-3xl font-black text-white mt-1 block">
              {stats.products}
            </span>
          </div>
          <div className="p-3.5 bg-brand-neon/10 rounded-2xl text-brand-neon">
            <FiPackage className="w-6 h-6" />
          </div>
        </div>

        {/* KPI: Total Users */}
        <div className="bg-brand-surface-card border border-white/5 p-6 rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 font-extrabold tracking-widest uppercase block">
              Registered Sneakerheads
            </span>
            <span className="text-3xl font-black text-white mt-1 block">
              {stats.users}
            </span>
          </div>
          <div className="p-3.5 bg-brand-neon/10 rounded-2xl text-brand-neon">
            <FiUsers className="w-6 h-6" />
          </div>
        </div>

        {/* KPI: Total Orders */}
        <div className="bg-brand-surface-card border border-white/5 p-6 rounded-3xl flex items-center justify-between">
          <div>
            <span className="text-[10px] text-neutral-500 font-extrabold tracking-widest uppercase block">
              Ledger Transactions
            </span>
            <span className="text-3xl font-black text-white mt-1 block">
              {stats.orders}
            </span>
          </div>
          <div className="p-3.5 bg-brand-neon/10 rounded-2xl text-brand-neon">
            <FiTrendingUp className="w-6 h-6" />
          </div>
        </div>

      </div>

      {/* Main Console Interface Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
        
        {/* Left Sidebar Navigation */}
        <div className="lg:col-span-3 bg-brand-surface-card border border-white/5 rounded-3xl p-4 flex flex-col gap-2">
          <span className="text-[10px] text-neutral-500 font-black tracking-widest uppercase px-3 mb-2 block">
            Console Tabs
          </span>
          {[
            { id: 'products', label: 'Sneakers Stock', icon: FiPackage },
            { id: 'users', label: 'Authorized Users', icon: FiUsers },
            { id: 'orders', label: 'Order Status Update', icon: FiTruck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold uppercase tracking-widest rounded-2xl transition duration-150 cursor-pointer ${
                  isActive
                    ? 'bg-brand-neon text-black font-black shadow-md shadow-brand-neon/10'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Right Active Tab Content */}
        <div className="lg:col-span-9 bg-brand-surface border border-white/5 rounded-3xl p-6 sm:p-8 min-h-[450px]">
          
          {/* TAB CONTENT: PRODUCTS */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                  Product Inventory
                </h3>
                {!showProductForm && (
                  <button
                    onClick={() => setShowProductForm(true)}
                    className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-neon text-black text-xs font-black rounded-full hover:scale-105 transition cursor-pointer"
                  >
                    <FiPlus className="w-4 h-4 font-black" /> Add Sneaker
                  </button>
                )}
              </div>

              {/* Inline Add / Edit Product form modal */}
              <AnimatePresence>
                {showProductForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleProductSubmit}
                    className="bg-brand-surface-card border border-white/5 rounded-2xl p-5 space-y-4 overflow-hidden"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h4 className="text-xs font-black text-white uppercase">
                        {editProductId ? 'Edit Product Entry' : 'Create Product Drop'}
                      </h4>
                      <button type="button" onClick={handleCloseProductForm} className="text-neutral-500 hover:text-white cursor-pointer">
                        <FiX className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Sneaker Title</label>
                        <input
                          type="text"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g. Air Force 1 Retro"
                          required
                          className="w-full px-3.5 py-2.5 bg-brand-surface border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-neon"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Brand Tag</label>
                        <input
                          type="text"
                          value={brand}
                          onChange={(e) => setBrand(e.target.value)}
                          placeholder="e.g. Nike"
                          required
                          className="w-full px-3.5 py-2.5 bg-brand-surface border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-neon"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Price ($ USD)</label>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="180"
                          required
                          className="w-full px-3.5 py-2.5 bg-brand-surface border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-neon"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Sizes (comma separated)</label>
                        <input
                          type="text"
                          value={sizesInput}
                          onChange={(e) => setSizesInput(e.target.value)}
                          placeholder="8, 9, 10, 11"
                          required
                          className="w-full px-3.5 py-2.5 bg-brand-surface border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-neon"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Image URL</label>
                        <input
                          type="url"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          placeholder="https://example.com/shoe-photo.png"
                          className="w-full px-3.5 py-2.5 bg-brand-surface border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-neon"
                        />
                      </div>

                      <div className="sm:col-span-2 space-y-1.5">
                        <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Description</label>
                        <textarea
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          placeholder="Enter details regarding authentic sneaker packaging, colorways, etc."
                          rows="3"
                          required
                          className="w-full px-3.5 py-2.5 bg-brand-surface border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-neon"
                        />
                      </div>

                    </div>

                    <div className="flex gap-3 justify-end pt-2">
                      <button
                        type="button"
                        onClick={handleCloseProductForm}
                        className="px-4 py-2 bg-white/5 text-xs text-neutral-400 hover:text-white rounded-full transition"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={submittingProduct}
                        className="px-5 py-2 bg-brand-neon text-black text-xs font-bold rounded-full hover:scale-105 transition cursor-pointer"
                      >
                        {submittingProduct ? 'Submitting...' : 'Save Product'}
                      </button>
                    </div>

                  </motion.form>
                )}
              </AnimatePresence>

              {/* Products Table display */}
              {productsLoading && products.length === 0 ? (
                <div className="text-center py-10 text-xs text-neutral-500">Loading catalog...</div>
              ) : products.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-neutral-500 uppercase tracking-widest font-extrabold pb-3">
                        <th className="pb-3 pr-4">Sneaker</th>
                        <th className="pb-3 pr-4">Brand</th>
                        <th className="pb-3 pr-4">Price</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {products.map((prod) => (
                        <tr key={prod.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3 pr-4 font-semibold text-white max-w-xs truncate">
                            {prod.title}
                          </td>
                          <td className="py-3 pr-4">
                            <span className="px-2 py-0.5 bg-brand-neon/15 text-brand-neon text-[9px] font-bold uppercase rounded">
                              {prod.brand}
                            </span>
                          </td>
                          <td className="py-3 pr-4 text-white font-bold">${prod.price || '180'}</td>
                          <td className="py-3 text-right flex items-center justify-end gap-1">
                            <button
                              onClick={() => handleOpenEditProduct(prod)}
                              className="p-2 text-neutral-400 hover:text-brand-neon hover:bg-brand-neon/10 rounded-lg cursor-pointer"
                              title="Edit Drop"
                            >
                              <FiEdit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(prod.id)}
                              className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                              title="Delete Drop"
                            >
                              <FiTrash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-neutral-500 border border-dashed border-white/10 rounded-2xl">
                  Inventory is empty. Add drops above.
                </div>
              )}

            </div>
          )}

          {/* TAB CONTENT: USERS LIST */}
          {activeTab === 'users' && (
            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                  Club User Database
                </h3>
              </div>

              {usersLoading && users.length === 0 ? (
                <div className="text-center py-10 text-xs text-neutral-500">Querying directory...</div>
              ) : users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-neutral-500 uppercase tracking-widest font-extrabold pb-3">
                        <th className="pb-3 pr-4">Username</th>
                        <th className="pb-3 pr-4">Email</th>
                        <th className="pb-3 pr-4">Authorization</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {users.map((user) => {
                        const isUserAdmin = user.role === 'admin';
                        return (
                          <tr key={user.id} className="hover:bg-white/[0.02] transition">
                            <td className="py-3 pr-4 font-semibold text-white">{user.username}</td>
                            <td className="py-3 pr-4 text-neutral-400">{user.email}</td>
                            <td className="py-3 pr-4">
                              <span
                                className={`px-2 py-0.5 text-[9px] font-bold uppercase rounded ${
                                  isUserAdmin
                                    ? 'bg-brand-neon/15 text-brand-neon'
                                    : 'bg-white/5 text-neutral-400'
                                }`}
                              >
                                {user.role || 'user'}
                              </span>
                            </td>
                            <td className="py-3 text-right flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleRoleUpdate(user.id, user.role)}
                                className={`p-2 rounded-lg cursor-pointer ${
                                  isUserAdmin
                                    ? 'text-brand-neon hover:bg-brand-neon/10'
                                    : 'text-neutral-500 hover:text-white hover:bg-white/5'
                                }`}
                                title={isUserAdmin ? 'Demote to regular user' : 'Authorize as Admin'}
                              >
                                <FiShield className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="p-2 text-neutral-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg cursor-pointer"
                                title="Erase account"
                              >
                                <FiTrash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-neutral-500">
                  User ledger is currently empty.
                </div>
              )}
            </div>
          )}

          {/* TAB CONTENT: ORDERS TIMELINE UPDATE */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              
              <div className="border-b border-white/5 pb-4">
                <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
                  Ground Order Fulfillment
                </h3>
              </div>

              <div className="p-6 bg-brand-surface-card border border-white/5 rounded-3xl text-left space-y-4">
                <div className="flex gap-3 text-brand-neon">
                  <FiAlertCircle className="w-6 h-6 flex-shrink-0" />
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold uppercase">Timeline Step Override</h4>
                    <p className="text-[11px] text-neutral-400 leading-relaxed font-semibold">
                      FastAPI's `/orderupdate` updates the timeline step of the *active orders* in the database. Choose a step below to globally update active order tracking statuses for testing purposes:
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  {[
                    { id: 'pending', label: 'Placed', color: 'bg-yellow-400/10 text-yellow-400 border-yellow-400/30' },
                    { id: 'processing', label: 'Legit Checking', color: 'bg-blue-400/10 text-blue-400 border-blue-400/30' },
                    { id: 'shipped', label: 'Shipped', color: 'bg-indigo-400/10 text-indigo-400 border-indigo-400/30' },
                    { id: 'delivered', label: 'Delivered', color: 'bg-brand-neon/10 text-brand-neon border-brand-neon/30' },
                  ].map((btn) => (
                    <button
                      key={btn.id}
                      onClick={() => handleUpdateOrderStatus(btn.id)}
                      className={`py-3.5 border text-xs font-bold uppercase tracking-wider rounded-2xl transition duration-150 cursor-pointer text-center hover:scale-[1.02] active:scale-[0.98] ${btn.color}`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {ordersLoading && orders.length === 0 ? (
                <div className="text-center py-10 text-xs text-neutral-500">Querying transactions...</div>
              ) : orders.length > 0 ? (
                <div className="overflow-x-auto pt-2">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-neutral-500 uppercase tracking-widest font-extrabold pb-3">
                        <th className="pb-3 pr-4">Order ID</th>
                        <th className="pb-3 pr-4">Customer</th>
                        <th className="pb-3 pr-4">Charge</th>
                        <th className="pb-3 pr-4">Status Step</th>
                        <th className="pb-3 text-right">Update Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition">
                          <td className="py-3 pr-4 text-white font-extrabold text-left">#{order.id}</td>
                          <td className="py-3 pr-4 text-left">
                            <div className="font-semibold text-white">{order.username || 'Unknown User'}</div>
                            <div className="text-[10px] text-neutral-500 font-medium lowercase truncate max-w-[150px]">
                              {order.email || `id: ${order.user_id}`}
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-white font-bold text-left">${order.total_price || '0'}</td>
                          <td className="py-3 pr-4 text-left">
                            <span className={`px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border ${
                              order.status === 'delivered'
                                ? 'bg-brand-neon/10 border-brand-neon/20 text-brand-neon shadow-[0_0_10px_rgba(57,255,20,0.1)]'
                                : order.status === 'shipped'
                                ? 'bg-indigo-400/10 border-indigo-400/20 text-indigo-400'
                                : order.status === 'processing'
                                ? 'bg-blue-400/10 border-blue-400/20 text-blue-400'
                                : 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400'
                            }`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <select
                              value={order.status || 'pending'}
                              onChange={(e) => handleUpdateIndividualOrderStatus(order.id, e.target.value)}
                              className="px-2.5 py-1.5 bg-brand-surface border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-brand-neon focus:ring-1 focus:ring-brand-neon transition cursor-pointer"
                            >
                              <option value="pending">Placed</option>
                              <option value="processing">Legit Checking</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-10 text-neutral-500 border border-dashed border-white/10 rounded-2xl">
                  No registered orders in database ledger.
                </div>
              )}

            </div>
          )}

        </div>

      </div>

    </div>
  );
}
