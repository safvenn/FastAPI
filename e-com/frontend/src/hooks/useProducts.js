import { useState, useEffect } from 'react';
import API from '../services/api';

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await API.get('/products');
      setProducts(res.data || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Dynamically extract unique brands from the loaded products
  const brands = ['All', ...new Set(products.map((p) => p.brand).filter(Boolean))];

  return {
    products,
    loading,
    error,
    brands,
    refetch: fetchProducts,
  };
}
