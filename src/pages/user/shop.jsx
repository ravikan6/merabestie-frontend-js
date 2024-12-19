import React, { useState, useEffect } from 'react';
import { FaTimes, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Navbar from '../../components/user/navbar/navbar';
import { API_URL } from '../../constants';


const Shop = ({ category }) => {
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadMore, setLoadMore] = useState(6);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [bestSellers, setBestSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = [
    { name: 'Fashion Accessories', img: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt12prodlp/products/p-modish-fashion-necklace-25631-m.jpg' },
    { name: 'Books', img: "https://tse2.mm.bing.net/th?id=OIP.uyi1Q5l2H8Zf9APJQplJfQHaEK&pid=Api&P=0&h=180" },
    { name: 'Gift Boxes', img: "http://images4.fanpop.com/image/photos/22200000/Christmas-gifts-christmas-gifts-22231235-2048-2048.jpg" },
    { name: 'Stationery', img: "https://tse1.mm.bing.net/th?id=OIP.UCpcTmMMOdXTF6WAhtD94QHaH0&pid=Api&P=0&h=180" },
  ];

  const { categoryName } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/get-product`);
        const data = await response.json();
        if (data.success) {
          const validProducts = data.products.filter(
            product =>
              product.name &&
              product.price &&
              product.img &&
              product.category &&
              product.productId &&
              (product.visibility === 'on' || product.visibility === 'true')
          );
          setProducts(validProducts);
          setFilteredProducts(validProducts);
          setBestSellers(validProducts.slice(0, 6));
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    if (categoryName) {
      const categoryExists = categories.some(
        category => category.name.toLowerCase().replace(/ /g, '-') === categoryName
      );
      if (categoryExists) {
        setSelectedCategory(categoryName);
        filterProducts(categoryName);
      } else {
        setSelectedCategory('404');
      }
    }
  }, [categoryName]);

  const filterProducts = category => {
    setSelectedCategory(category);
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category === category);
      setFilteredProducts(filtered);
    }
    setLoadMore(6);
  };

  if (selectedCategory === '404') {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-b from-pink-50 to-pink-100">
        <h1 className="text-4xl font-bold text-pink-900">404 Not Found</h1>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Shop | Mera Bestie</title>
      </Helmet>
      <div className="bg-gradient-to-b from-pink-50 to-pink-100 min-h-screen">
        <Navbar className="sticky top-0 z-50 bg-white shadow-md" />

        {/* Categories Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 my-14">
          <h2 className="text-3xl font-bold text-pink-900 text-center mb-8">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
                onClick={() =>
                  navigate(`/${category.name.toLowerCase().replace(/ /g, "-")}`)
                }
                whileHover={{ y: -5 }}
              >
                <div
                  className="h-40 sm:h-48 bg-cover bg-center"
                  style={{ backgroundImage: `url('${category.img}')` }}
                ></div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-sm sm:text-base font-bold text-pink-800 text-center">
                    {category.name}
                  </h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-pink-900 text-center mb-8">
            {selectedCategory !== 'all' ? `Search By Categories: ${selectedCategory}` : 'Explore More'}
          </h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProducts.slice(0, loadMore).map((product, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                whileHover={{ y: -5 }}
              >
                <Link to={`/${product.productId}`} className="block">
                  <div
                    className="h-40 sm:h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url('${product.img}')` }}
                  ></div>
                  <div className="p-3 sm:p-4 text-center">
                    <h4 className="font-bold text-pink-800 text-sm sm:text-base">
                      {product.name}
                    </h4>
                    <p className="text-gray-600 mt-1">₹{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Best Sellers Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-pink-900 text-center mb-8">
            Best Sellers
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestSellers.map((product, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                whileHover={{ y: -5 }}
              >
                <Link to={`/${product.productId}`} className="block">
                  <div
                    className="h-40 sm:h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url('${product.img}')` }}
                  ></div>
                  <div className="p-3 sm:p-4 text-center">
                    <h4 className="font-bold text-pink-800 text-sm sm:text-base">
                      {product.name}
                    </h4>
                    <p className="text-gray-600 font-semibold mt-1">₹{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-white py-12 sm:py-16 text-black border-t border-pink-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-2xl sm:text-3xl font-extrabold text-pink-800 mb-4">
                MERA Bestie
              </h4>
              <p className="text-gray-600 mb-4 text-center md:text-left">
                Your one-stop destination for thoughtful and unique gifts.
              </p>
              <div className="flex space-x-6 text-2xl sm:text-3xl mt-4">
                <a
                  href="https://facebook.com/merabestie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800 transition-colors"
                >
                  <FaFacebook />
                </a>
                <a
                  href="https://instagram.com/merabestie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800 transition-colors"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://twitter.com/merabestie"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pink-600 hover:text-pink-800 transition-colors"
                >
                  <FaTwitter />
                </a>
              </div>
            </div>
            <div className="text-center md:text-right">
              <h5 className="text-xl sm:text-2xl font-bold text-pink-800 mb-4">Contact Us</h5>
              <p className="text-gray-600">
                3181 Street Name, City, India
                <br />
                Email:{' '}
                <a
                  href="mailto:support@merabestie.com"
                  className="hover:underline hover:text-pink-800 transition-colors"
                >
                  support@merabestie.com
                </a>
                <br />
                Phone:{' '}
                <a
                  href="tel:+911234567890"
                  className="hover:underline hover:text-pink-800 transition-colors"
                >
                  +91 1234567890
                </a>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Shop;