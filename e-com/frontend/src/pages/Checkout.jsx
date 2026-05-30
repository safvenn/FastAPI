import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { useCart } from '../context/CartContext';
import { FiMapPin, FiPlus, FiCheck, FiShoppingBag, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function Checkout() {
  const { cartItems, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Address creation form state
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newStreet, setNewStreet] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newState, setNewState] = useState('');
  const [addingAddress, setAddingAddress] = useState(false);

  // Fetch addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await API.get('/address');
      // Backend returns either list of address items or { "msg": "There is no address" }
      if (res.data && Array.isArray(res.data)) {
        setAddresses(res.data);
        if (res.data.length > 0) {
          setSelectedAddressId(res.data[0].id);
        }
      } else {
        setAddresses([]);
      }
    } catch {
      setAddresses([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
    // Redirect if cart is empty and not currently showing success screen
    if (!showSuccess && cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, showSuccess]);

  // Handle adding new address inline
  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!newName || !newStreet || !newCity || !newState) {
      toast.error('All address fields are required');
      return;
    }
    setAddingAddress(true);
    try {
      const res = await API.post('/address', {
        name: newName,
        street: newStreet,
        city: newCity,
        state: newState,
      });
      toast.success('Address added successfully!');
      // Reset form
      setNewName('');
      setNewStreet('');
      setNewCity('');
      setNewState('');
      setShowAddressForm(false);
      
      // Refresh address list and auto select the newly added address
      await fetchAddresses();
      if (res.data && res.data.id) {
        setSelectedAddressId(res.data.id);
      }
    } catch (err) {
      toast.error('Failed to add address');
    } finally {
      setAddingAddress(false);
    }
  };

  // Place Order API call
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      toast.error('Please select a shipping address');
      return;
    }
    setPlacing(true);
    try {
      await API.post('/orders', {
        address_id: parseInt(selectedAddressId),
      });
      // Clear Cart locally & server-side
      await clearCart();
      setShowSuccess(true);
      toast.success('Order placed successfully! 🚀');
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full glass-card rounded-3xl p-8 text-center space-y-6 border border-white/5"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex p-4 bg-brand-accent/10 text-brand-accent rounded-full"
          >
            <FiCheckCircle className="w-16 h-16 shadow-[0_0_20px_rgba(10,132,255,0.3)] rounded-full" />
          </motion.div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tight">Order Confirmed</h2>
          <p className="text-xs text-neutral-400 leading-relaxed max-w-sm mx-auto">
            Your premium sneaker order has been successfully placed! Our experts are inspecting your pair. Track your shipment timeline inside your profile.
          </p>
          <div className="pt-4 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/orders')}
              className="flex-grow flex items-center justify-center gap-2 py-3 bg-brand-accent text-black font-extrabold text-xs tracking-widest uppercase rounded-full hover:scale-105 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-black"
            >
              View Orders Timeline <FiArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-grow py-3 bg-white/5 hover:bg-white/10 text-white font-bold text-xs tracking-widest uppercase rounded-full transition border border-white/5"
            >
              Back to Home
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[75vh]">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-6 mb-10 text-left">
        <span className="text-xs font-black text-brand-accent tracking-widest uppercase">Secure Gateway</span>
        <h1 className="text-3xl font-black text-white uppercase mt-1">Shipping Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Address Selector Grid Cards */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Select Shipping Address
            </h3>
            <button
              onClick={() => setShowAddressForm(!showAddressForm)}
              className="inline-flex items-center gap-1 text-xs font-bold text-brand-accent hover:underline uppercase tracking-wider cursor-pointer"
            >
              <FiPlus className="w-4.5 h-4.5" /> Add New
            </button>
          </div>

          {/* New address inline form */}
          <AnimatePresence>
            {showAddressForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleAddAddress}
                className="ios-glass rounded-[24px] p-6 space-y-4 overflow-hidden"
              >
                <h4 className="text-xs font-bold text-white uppercase">Add New Shipping Address</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Name</label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="e.g. John Doe"
                      required
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Street Address</label>
                    <input
                      type="text"
                      value={newStreet}
                      onChange={(e) => setNewStreet(e.target.value)}
                      placeholder="123 Sneaker St"
                      required
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">City</label>
                    <input
                      type="text"
                      value={newCity}
                      onChange={(e) => setNewCity(e.target.value)}
                      placeholder="New York"
                      required
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">State / Province</label>
                    <input
                      type="text"
                      value={newState}
                      onChange={(e) => setNewState(e.target.value)}
                      placeholder="NY"
                      required
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddressForm(false)}
                    className="px-4 py-2 bg-white/5 text-xs text-neutral-400 hover:text-white rounded-full transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={addingAddress}
                    className="px-5 py-2 bg-brand-accent text-black text-xs font-extrabold min-h-[44px] rounded-full hover:scale-105 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-black"
                  >
                    {addingAddress ? 'Adding...' : 'Save Address'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* Address List Radio Grid */}
          {loading && addresses.length === 0 ? (
            <div className="py-10 text-center text-xs text-neutral-500">
              Loading shipping options...
            </div>
          ) : addresses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((address) => {
                const isSelected = selectedAddressId === address.id;
                return (
                  <div
                    key={address.id}
                    onClick={() => setSelectedAddressId(address.id)}
                    className={`relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between h-36 ${
                      isSelected
                        ? 'bg-brand-surface-card border-brand-accent shadow-[0_0_12px_rgba(10,132,255,0.15)]'
                        : 'bg-brand-surface border-white/5 hover:border-white/15'
                    }`}
                  >
                    {isSelected && (
                      <span className="absolute top-4 right-4 bg-brand-accent text-black rounded-full p-1">
                        <FiCheck className="w-3 h-3 font-black" />
                      </span>
                    )}
                    <div>
                      <span className="text-[10px] text-brand-accent font-black tracking-widest uppercase block mb-1">
                        SHIPPING DESK
                      </span>
                      <h4 className="text-xs font-extrabold text-white">{address.name}</h4>
                      <p className="text-[11px] text-neutral-400 mt-2 leading-tight">
                        {address.street}, {address.city}, {address.state}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                      <FiMapPin className="w-3.5 h-3.5 text-neutral-500" /> Ground Courier
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-2xl">
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">No addresses saved</p>
              <p className="text-[11px] text-neutral-600 mt-1 max-w-xs mx-auto leading-normal">
                Please create a shipping address to fulfill your premium sneakers order.
              </p>
              <button
                onClick={() => setShowAddressForm(true)}
                className="mt-4 px-5 py-2 bg-brand-accent text-black text-xs font-extrabold min-h-[44px] rounded-full hover:scale-105 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-black"
              >
                Add Shipping Address
              </button>
            </div>
          )}

        </div>

        {/* Right Summary column */}
        <div className="lg:col-span-4 ios-glass rounded-[24px] p-6 space-y-6 text-left">
          
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Order Verification
          </h3>

          <div className="space-y-3 pt-2">
            
            {/* Sneaker items list overview */}
            <div className="max-h-44 overflow-y-auto space-y-3 pr-1">
              {cartItems.map((item) => (
                <div key={item.cart_id} className="flex justify-between items-center gap-3 bg-white/5 p-2 rounded-xl border border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-surface rounded p-1 flex items-center justify-center flex-shrink-0">
                      <img src={item.image_url} alt="" className="max-h-full max-w-full object-contain -rotate-6" />
                    </div>
                    <div className="text-left">
                      <p className="text-[11px] font-semibold text-white line-clamp-1">{item.title}</p>
                      <p className="text-[9px] text-neutral-500">Size: US {item.sizes} × {item.quantity}</p>
                    </div>
                  </div>
                  <span className="text-[11px] font-extrabold text-white">${item.item_total}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-white/5 my-2" />

            <div className="flex justify-between text-xs text-neutral-400 pt-1">
              <span>Items Total</span>
              <span className="text-white font-semibold">${totalAmount}</span>
            </div>

            <div className="flex justify-between text-xs text-neutral-400">
              <span>Shipping Fee</span>
              {totalAmount > 300 ? (
                <span className="text-brand-accent font-bold tracking-widest">FREE</span>
              ) : (
                <span className="text-white font-semibold">$15</span>
              )}
            </div>

            <div className="border-t border-white/5 my-2" />

            <div className="flex justify-between items-baseline pt-1">
              <span className="text-xs font-bold text-white uppercase">Grand Total</span>
              <span className="text-lg font-black text-brand-accent">${totalAmount + (totalAmount > 300 ? 0 : 15)}</span>
            </div>

          </div>

          <div className="pt-4">
            <button
              onClick={handlePlaceOrder}
              disabled={placing || !selectedAddressId}
              className={`w-full flex items-center justify-center gap-2 py-4 min-h-[44px] rounded-full font-extrabold text-xs tracking-widest uppercase transition-all duration-300 shadow-xl cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-accent focus:ring-offset-2 focus:ring-offset-black ${
                !selectedAddressId
                  ? 'bg-neutral-800 text-neutral-500 border border-white/5 cursor-not-allowed'
                  : 'bg-brand-accent text-black hover:scale-105 shadow-brand-accent/10'
              }`}
            >
              <FiShoppingBag className="w-4 h-4" />
              {placing ? 'Fulfilling...' : 'Place Order Now'}
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
