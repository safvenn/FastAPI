import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import API from '../services/api';
import { FiPackage, FiClock, FiTruck, FiCheckCircle, FiChevronRight, FiMapPin } from 'react-icons/fi';

const statusConfig = {
  pending: {
    label: 'Order Placed',
    color: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/25',
    icon: FiClock,
    stepIndex: 1,
  },
  processing: {
    label: 'Legit Checking',
    color: 'text-blue-400 bg-blue-400/10 border-blue-400/25',
    icon: FiPackage,
    stepIndex: 2,
  },
  shipped: {
    label: 'Shipped (Express)',
    color: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/25',
    icon: FiTruck,
    stepIndex: 3,
  },
  delivered: {
    label: 'Arrived / Certified',
    color: 'text-brand-neon bg-brand-neon/10 border-brand-neon/25',
    icon: FiCheckCircle,
    stepIndex: 4,
  },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState({});

  const fetchOrdersAndAddresses = async () => {
    setLoading(true);
    try {
      const [ordersRes, addressRes] = await Promise.allSettled([
        API.get('/orders'),
        API.get('/address'),
      ]);

      let ordersList = [];
      if (ordersRes.status === 'fulfilled') {
        ordersList = ordersRes.value.data || [];
        setOrders(ordersList);
      }

      if (addressRes.status === 'fulfilled' && Array.isArray(addressRes.value.data)) {
        const addressMap = {};
        addressRes.value.data.forEach((addr) => {
          addressMap[addr.id] = addr;
        });
        setAddresses(addressMap);
      }
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersAndAddresses();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  if (loading && orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex flex-col justify-center items-center min-h-[60vh]">
        <div className="w-10 h-10 border-2 border-brand-muted border-t-brand-neon rounded-full animate-spin"></div>
        <p className="mt-4 text-xs font-bold tracking-widest text-brand-muted uppercase animate-pulse">
          Retrieving Orders Timeline...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-[75vh]">
      
      {/* Page Header */}
      <div className="border-b border-white/5 pb-6 mb-10 text-left">
        <span className="text-xs font-black text-brand-neon tracking-widest uppercase">Purchase Ledger</span>
        <h1 className="text-3xl font-black text-white uppercase mt-1">My Sneaker Orders</h1>
      </div>

      {orders.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8 text-left max-w-4xl"
        >
          {orders.map((order) => {
            const currentStatus = order.status?.toLowerCase() || 'pending';
            const config = statusConfig[currentStatus] || statusConfig.pending;
            const StatusIcon = config.icon;
            const address = addresses[order.addres_id] || order.address;

            // Render visual timeline steps
            const currentStep = config.stepIndex;

            return (
              <motion.div
                key={order.id}
                variants={itemVariants}
                className="bg-brand-surface-card border border-white/5 rounded-3xl p-6 sm:p-8 space-y-6"
              >
                {/* Upper row: Order Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-brand-neon tracking-widest uppercase bg-brand-neon/10 px-2 py-0.5 rounded">
                      ORDER ID: #{order.id}
                    </span>
                    <p className="text-xs text-neutral-400 font-semibold pt-1">
                      Placed securely via KICKS ground logs
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left sm:text-right">
                      <span className="text-[10px] text-neutral-500 block">Total Charged</span>
                      <span className="text-base font-extrabold text-white">${order.total_price || '180'}</span>
                    </div>
                    {/* Status Badge */}
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold uppercase tracking-wider ${config.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {config.label}
                    </div>
                  </div>
                </div>

                {/* Shipping address summary */}
                {address && (
                  <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                    <FiMapPin className="text-brand-neon w-4 h-4" />
                    <span>
                      Shipping to: <span className="text-white font-semibold">{address.name}</span> — {address.street}, {address.city}, {address.state}
                    </span>
                  </div>
                )}

                {/* PREMIUM TIMELINE UI DESIGN */}
                <div className="pt-4 pb-2 space-y-4">
                  <h4 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                    Delivery Timeline Status
                  </h4>

                  <div className="relative flex items-center justify-between w-full pt-2">
                    {/* Background track line */}
                    <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-neutral-800 -translate-y-1/2 z-0" />
                    
                    {/* Active highlighted line */}
                    <div
                      className="absolute top-1/2 left-0 h-0.5 bg-brand-neon -translate-y-1/2 z-0 transition-all duration-500"
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />

                    {/* Timeline Node items */}
                    {[
                      { step: 1, label: 'Placed', info: 'Cart Fulfill' },
                      { step: 2, label: 'Verified', info: 'Legit Check' },
                      { step: 3, label: 'Shipped', info: 'Courier Hand' },
                      { step: 4, label: 'Arrived', info: 'Signed Box' },
                    ].map((node) => {
                      const isActiveNode = currentStep >= node.step;
                      return (
                        <div key={node.step} className="flex flex-col items-center relative z-10">
                          {/* Inner glowing dot */}
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-extrabold text-xs transition-all duration-300 ${
                              isActiveNode
                                ? 'bg-brand-bg border-brand-neon text-brand-neon shadow-[0_0_10px_rgba(57,255,20,0.4)]'
                                : 'bg-brand-surface-card border-neutral-800 text-neutral-500'
                            }`}
                          >
                            {isActiveNode && currentStep > node.step ? (
                              <FiCheckCircle className="w-5 h-5 font-black text-brand-neon fill-brand-neon/15" />
                            ) : (
                              node.step
                            )}
                          </div>
                          {/* Details below node */}
                          <div className="text-center mt-2.5">
                            <span className={`text-[10px] font-bold block uppercase tracking-wider ${isActiveNode ? 'text-white' : 'text-neutral-500'}`}>
                              {node.label}
                            </span>
                            <span className="text-[8px] text-neutral-600 block leading-tight font-medium hidden sm:block">
                              {node.info}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        /* Empty State */
        <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
          <div className="inline-flex p-4 bg-white/5 rounded-full text-neutral-500 mb-4 animate-pulse">
            <FiPackage className="w-10 h-10" />
          </div>
          <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
            No Purchases Placed
          </h3>
          <p className="text-xs text-neutral-500 mt-2 max-w-xs mx-auto leading-relaxed">
            You haven't checked out any authentic premium sneakers yet. Visit our shop catalogue to grab a pair.
          </p>
        </div>
      )}

    </div>
  );
}
