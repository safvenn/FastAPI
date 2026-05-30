import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMapPin, FiEdit3, FiTrash2, FiPlus, FiLogOut, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function Profile() {
  const { isLoggedIn, logout } = useAuth();
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Profile update states
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [usernameSubmitting, setUsernameSubmitting] = useState(false);

  const handleUpdateUsername = async (e) => {
    e.preventDefault();
    if (!newUsername.trim()) {
      toast.error('Username cannot be empty');
      return;
    }
    setUsernameSubmitting(true);
    try {
      const payload = {
        id: String(profileData.id),
        name: newUsername.trim(),
        email: profileData.email
      };
      const res = await API.put('/updateprofile', payload);
      setProfileData(prev => ({
        ...prev,
        username: res.data.username || newUsername.trim()
      }));
      toast.success('Profile name updated successfully!');
      setIsEditingUsername(false);
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Failed to update username';
      toast.error(errMsg);
    } finally {
      setUsernameSubmitting(false);
    }
  };

  // Address form states
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null); // If editing, stores address ID
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch profile
  const fetchProfile = async () => {
    setProfileLoading(true);
    try {
      const res = await API.get('/profile');
      setProfileData(res.data);
    } catch {
      toast.error('Failed to load profile details');
    } finally {
      setProfileLoading(false);
    }
  };

  // Fetch addresses
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await API.get('/address');
      if (res.data && Array.isArray(res.data)) {
        setAddresses(res.data);
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
    fetchProfile();
  }, []);

  const handleOpenEdit = (addr) => {
    setEditId(addr.id);
    setName(addr.name);
    setStreet(addr.street);
    setCity(addr.city);
    setState(addr.state);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setEditId(null);
    setName('');
    setStreet('');
    setCity('');
    setState('');
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !street || !city || !state) {
      toast.error('All fields are required');
      return;
    }
    setSubmitting(true);
    try {
      if (editId) {
        // Edit address API call
        await API.put(`/address/${editId}`, { name, street, city, state });
        toast.success('Address updated successfully');
      } else {
        // Create new address API call
        await API.post('/address', { name, street, city, state });
        toast.success('Address created successfully');
      }
      handleCloseForm();
      await fetchAddresses();
    } catch (err) {
      toast.error('Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this shipping address?')) {
      try {
        await API.delete(`/address/${id}`);
        toast.success('Address deleted successfully');
        await fetchAddresses();
      } catch (err) {
        toast.error('Failed to delete address');
      }
    }
  };

  const handleLogout = () => {
    logout();
    toast.success('Signed out');
    navigate('/login');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[75vh]">
      
      {/* Header */}
      <div className="border-b border-white/5 pb-6 mb-10 text-left">
        <span className="text-xs font-black text-brand-accent tracking-widest uppercase">Member Desk</span>
        <h1 className="text-3xl font-black text-white uppercase mt-1">My Account Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Profile overview card & fast action controls */}
        <div className="lg:col-span-4 ios-glass rounded-[24px] p-6 text-left space-y-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-brand-accent/10 border border-brand-accent flex items-center justify-center text-brand-accent shadow-[0_0_15px_rgba(10,132,255,0.15)]">
              <FiUser className="w-7 h-7" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] font-black text-brand-accent tracking-widest uppercase bg-brand-accent/15 px-2 py-0.5 rounded">
                {profileData?.role === 'admin' ? 'Administrator' : 'Sneakerhead'}
              </span>
              {isEditingUsername ? (
                <form onSubmit={handleUpdateUsername} className="mt-2 space-y-2">
                  <input
                    type="text"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                    disabled={usernameSubmitting}
                    placeholder="New username"
                    className="w-full px-3 py-1.5 bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none text-xs"
                    autoFocus
                  />
                  <div className="flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setIsEditingUsername(false)}
                      disabled={usernameSubmitting}
                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 text-[10px] text-neutral-400 hover:text-white rounded-full transition cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={usernameSubmitting}
                      className="px-3 py-1 bg-brand-accent text-black text-[10px] font-extrabold rounded-full min-h-[44px] hover:scale-105 transition cursor-pointer focus:ring-brand-accent"
                    >
                      {usernameSubmitting ? 'Saving...' : 'Save'}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="flex items-center gap-2 mt-1.5">
                  <h3 className="text-base font-extrabold text-white truncate">
                    {profileLoading ? 'Loading...' : (profileData?.username || 'Club Member')}
                  </h3>
                  {!profileLoading && profileData && (
                    <button
                      onClick={() => {
                        setNewUsername(profileData.username || '');
                        setIsEditingUsername(true);
                      }}
                      className="p-1 hover:text-brand-accent text-neutral-400 transition cursor-pointer flex-shrink-0"
                      title="Edit Username"
                    >
                      <FiEdit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              )}
              <p className="text-xs text-neutral-400 mt-0.5 block truncate">
                {profileLoading ? 'Retrieving email...' : (profileData?.email || 'No email registered')}
              </p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-4 space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-2xl transition duration-150 text-left cursor-pointer"
            >
              <FiLogOut className="w-4 h-4" />
              Sign Out Account
            </button>
          </div>
        </div>

        {/* Right Side: Address Book CRUD */}
        <div className="lg:col-span-8 space-y-6 text-left">
          
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              My Shipping Book
            </h3>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-accent hover:underline uppercase tracking-wider cursor-pointer"
              >
                <FiPlus className="w-4 h-4 font-black" /> Add New
              </button>
            )}
          </div>

          {/* Form wrapper */}
          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                onSubmit={handleSubmit}
                className="ios-glass rounded-[24px] p-6 space-y-4 overflow-hidden"
              >
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs font-bold text-white uppercase">
                    {editId ? 'Modify Address Entry' : 'Create Address Entry'}
                  </h4>
                  <button type="button" onClick={handleCloseForm} className="text-neutral-500 hover:text-white cursor-pointer">
                    <FiX className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Address tag name (e.g. Home)"
                      required
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">Street Address</label>
                    <input
                      type="text"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="10 Main St, App 4B"
                      required
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Los Angeles"
                      required
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none text-xs"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-neutral-400 font-bold uppercase tracking-widest">State / Province</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      placeholder="CA"
                      required
                      className="w-full px-3.5 py-2.5 bg-white/5 border border-white/10 rounded-[12px] text-white placeholder:text-neutral-500 focus:border-brand-accent focus:ring-1 focus:ring-brand-accent focus:outline-none text-xs"
                    />
                  </div>
                </div>

                <div className="flex gap-3 justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleCloseForm}
                    className="px-4 py-2 bg-white/5 text-xs text-neutral-400 hover:text-white rounded-full transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 bg-brand-accent text-black text-xs font-extrabold rounded-full min-h-[44px] hover:scale-105 transition cursor-pointer focus:ring-brand-accent"
                  >
                    {submitting ? 'Processing...' : 'Save Fulfill'}
                  </button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          {/* List display */}
          {loading && addresses.length === 0 ? (
            <div className="text-center py-10 text-xs text-neutral-500">
              Loading shipping catalog...
            </div>
          ) : addresses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AnimatePresence mode="popLayout">
                {addresses.map((address) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    key={address.id}
                    className="ios-glass rounded-[24px] p-6 flex flex-col justify-between h-40"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-neutral-500 font-extrabold tracking-widest uppercase flex items-center gap-1">
                          <FiMapPin className="text-brand-accent" /> SHIPPING BOX
                        </span>
                        
                        {/* Edit & Delete Action row */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(address)}
                            className="p-1.5 text-neutral-500 hover:text-brand-accent hover:bg-brand-accent/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <FiEdit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(address.id)}
                            className="p-1.5 text-neutral-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>
                      
                      <h4 className="text-xs font-black text-white mt-3 uppercase">{address.name}</h4>
                      <p className="text-[11px] text-neutral-400 mt-2 leading-relaxed font-semibold">
                        {address.street}, {address.city}, {address.state}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl">
              <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">No address found</p>
              <p className="text-[11px] text-neutral-600 mt-1 max-w-xs mx-auto leading-relaxed">
                Your shipping book is currently empty. Add shipping destinations to place orders.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
