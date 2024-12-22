import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/admin/sidebar';
import { Pencil, Save, Search, ArrowUpDown, Delete } from 'lucide-react';
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../../constants';

const Product = () => {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  let initEditValues = {
    name: '',
    category: '',
    price: '',
    inStockValue: '',
    soldStockValue: '',
    img: '',
    rating: '',
    visibility: ''
  }
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState(initEditValues);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'ascending'
  });

  useEffect(() => {
    const verifySeller = async () => {
      if (!sellerId) {
        navigate('/seller/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/admin/verify-seller`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ sellerId })
        });

        const data = await response.json();

        if (data.loggedIn !== 'loggedin') {
          navigate('/seller/login');
        }
      } catch (error) {
        console.error('Error verifying seller:', error);
        navigate('/seller/login');
      }
    };

    verifySeller();
  }, [sellerId, navigate]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/get-product`);
      const data = await response.json();
      setProducts(data.products); // Access the products array from response
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.productId);
    setEditValues({
      name: product.name || '',
      category: product.category || '',
      price: product.price || 0,
      inStockValue: product.inStockValue || 0,
      soldStockValue: product.soldStockValue || 0,
      img: product.img || '',
      rating: product.rating || 0,
      visibility: product.visibility || 'on'
    });
  };

  const handleCancle = () => {
    setEditingId(null);
    setEditValues(initEditValues);
  };

  const handleSave = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/instock-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
          ...editValues
        })
      });

      if (response.ok) {
        setEditingId(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating stock values:', error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await fetch(`${API_URL}/delete-product`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          productId,
        })
      });

      if (response.ok) {
        setEditingId(null);
        fetchProducts();
      }
    } catch (error) {
      console.error('Error updating stock values:', error);
    }
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedProducts = React.useMemo(() => {
    if (!Array.isArray(products)) return [];

    let sortableProducts = [...products];
    if (sortConfig.key !== null) {
      sortableProducts.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableProducts;
  }, [products, sortConfig]);

  const filteredProducts = sortedProducts.filter(product =>
    product.productId?.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditValues({ ...editValues, [name]: value });
  };

  return (
    <div className="flex">
      <Helmet>
        <title>Products | Admin | Mera Bestie</title>
      </Helmet>
      <Sidebar />
      <div className="flex-1 p-8 ml-[5rem] lg:ml-64 bg-pink-50 min-h-screen">
        <div className="mb-6 flex justify-between items-center">
          <div className="relative">
            <div className={`flex items-center ${isSearchExpanded ? 'w-full md:w-64' : 'w-10 md:w-64'} transition-all duration-300`}>
              <button
                className="md:hidden absolute left-2 z-10"
                onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              >
                <Search size={20} />
              </button>
              <input
                type="text"
                placeholder="Search by product ID or name..."
                className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 ${isSearchExpanded ? 'w-full opacity-100' : 'w-0 md:w-full opacity-0 md:opacity-100'
                  } transition-all duration-300`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="min-w-full table-auto">
            <thead className="bg-pink-100">
              <tr>
                <th onClick={() => handleSort('name')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Product
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => handleSort('category')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Category
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => handleSort('price')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Price
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => handleSort('inStockValue')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    In Stock
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th onClick={() => handleSort('soldStockValue')} className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer">
                  <div className="flex items-center">
                    Sold
                    <ArrowUpDown size={14} className="ml-1" />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.productId}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.name || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.category || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.price || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.inStockValue || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.soldStockValue || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.productId)}
                      className="text-red-600 hover:text-red-900 ml-2.5"
                    >
                      <Delete size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {editingId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Update Product</h2>
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={editValues.name}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              name="price"
              placeholder="Price"
              value={editValues.price}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              name="img"
              placeholder="Image URL"
              value={editValues.img}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="text"
              name="category"
              placeholder="Category"
              value={editValues.category}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="number"
              name="rating"
              placeholder="Rating"
              value={editValues.rating}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
              min={0}
              max={5}
            />
            <input
              type="number"
              name="inStockValue"
              placeholder="In Stock"
              value={editValues.inStockValue}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            <input
              type="number"
              name="soldStockValue"
              placeholder="Sold Stock"
              value={editValues.soldStockValue}
              onChange={handleInputChange}
              className="w-full mb-3 p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleCancle}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleSave(editingId)}
                className="px-4 py-2 bg-pink-500 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
