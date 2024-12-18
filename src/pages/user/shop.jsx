import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Navbar from '../../components/user/navbar/navbar';
import { API_URL } from '../../constants';


const Shop = ({ category }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loadMore, setLoadMore] = useState(6);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [bestSellers, setBestSellers] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const categories = [
    // { name: 'Couple Gifts', img: 'https://th.bing.com/th/id/OIG4..gTkczkAHWyHb1BcyEKW?w=270&h=270&c=6&r=0&o=5&dpr=1.3&pid=ImgGn' },
    // { name: 'Birthday Gifts', img: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt7prodlp/products/p-royal-rose-extravaganza-280964-m.jpg' },
    // { name: 'Anniversary Gifts', img: 'https://th.bing.com/th/id/OIG1.eKK.1P1RMbR2LgtAkCbb?w=270&h=270&c=6&r=0&o=5&dpr=1.3&pid=ImgGn' },
    // { name: 'Personalized Gifts', img: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt7prodlp/products/p-peach-and-pink-flowers-in-a-mug-188278-m.jpg' },
    // { name: 'Corporate Gifts', img: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt7prodlp/products/p-corporate-essentials-ensemble-278928-m.jpg' },
    // { name: 'Festive Gifts', img: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt7prodlp/products/p-festive-elegance-267303-m.jpg' },
    // { name: 'DIY Gifts', img: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt12prodlp/products/p-personalized-diy-plushie-making-hamper-387950-m.jpg' },
    // { name: 'Eco-friendly Gifts', img: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt12prodlp/products/p-sustainable-eco-friendly-3d-printed-curvy-table-lamp-304751-m.jpg' },
    // { name: 'Luxury Gifts', img: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt12prodlp/products/p-luxury-raksha-bandhan-bhaiya-bhabhi-hamper-300859-m.jpg' },
    // { name: 'Handmade Gifts', img: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt7prodlp/products/p-led-personalized-christmas-lamp-196860-m.jpg' },
    // { name: 'Gourmet Gifts', img: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt12prodlp/products/p-personalized-gourmet-diwali-hamper-189222-m.jpg' },
    // { name: 'Fashion Accessories', img: 'https://cdn.igp.com/f_auto,q_auto,t_pnopt12prodlp/products/p-modish-fashion-necklace-25631-m.jpg' },
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
      const categoryExists = categories.some(category => category.name.toLowerCase().replace(/ /g, '-') === categoryName);
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
      <div className="bg-gradient-to-b from-pink-50 to-pink-100 min-h-screen relative mt-16">
        <Navbar className="sticky top-0 z-50 bg-white shadow-md" />

        {/* Toggle Menu */}
        {/* Button for Small Screens */}
        <button
          className="absolute top-20 left-4 sm:hidden p-3 rounded-full shadow-md bg-pink-500 text-white z-10" // Increased top value for more spacing
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        {/* Button for Large Screens */}
        <button
          className="hidden sm:block fixed top-9 left-14 z-50 p-3 rounded-full shadow-md bg-pink-500 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
        </button>

        <div
          className={`fixed top-0 left-0 h-full bg-white shadow-md z-40 transform transition-transform duration-300 ${isMenuOpen ? "translate-x-0" : "-translate-x-full"
            }`}
        >
          <h2 className="text-xl font-bold text-pink-800 p-4 border-b">Categories</h2>
          <ul className="p-4 space-y-4">
            {categories.map((category, index) => (
              <li
                key={index}
                className="cursor-pointer text-pink-800 hover:text-pink-600"
                onClick={() => {
                  navigate(`/${category.name.toLowerCase().replace(/ /g, "-")}`);
                  setIsMenuOpen(false);
                }}
              >
                {category.name}
              </li>
            ))}
          </ul>
        </div>

        {/* Hero Section */}
        <section
          className="relative bg-cover bg-center pt-24 pb-12 sm:py-16 md:py-20 lg:py-24 text-center" // Adjusted top padding
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8), rgba(255,255,255,0.8)), url('src/assets/bg-shop.png')",
          }}
        >
          <div className="max-w-4xl mx-auto flex justify-center items-center">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-pink-800 mb-4 tracking-tight"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Welcome to Mera Bestie Shop
            </motion.h1>
          </div>

          <motion.p
            className="text-lg sm:text-xl md:text-2xl text-gray-700 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Explore our handpicked categories and best-selling products for every occasion.
          </motion.p>
        </section>


        {/* Main Categories */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-pink-900 text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
                onClick={() => navigate(`/${category.name.toLowerCase().replace(/ /g, '-')}`)}
              >
                <div
                  className="h-56 bg-cover bg-center"
                  style={{ backgroundImage: `url('${category.img}')` }}
                ></div>
                <div className="p-4 text-center">
                  <h3 className="text-xl font-bold text-pink-800">{category.name}</h3>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mixed Categories */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-pink-900 text-center mb-8">Explore More</h2>
          <motion.div
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {filteredProducts.slice(0, loadMore).map((product, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                <Link to={`/${product.productId}`} className="block">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url('${product.img}')` }}
                  ></div>
                  <div className="p-4 text-center">
                    <h4 className="font-bold text-pink-800">{product.name}</h4>
                    <p className="text-gray-600">₹{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* Best Sellers */}
        <div className="max-w-7xl mx-auto px-6 py-12">
          <h2 className="text-3xl font-bold text-pink-900 text-center mb-8">Best Sellers</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {bestSellers.map((product, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
              >
                <Link to={`/${product.productId}`} className="block">
                  <div
                    className="h-48 bg-cover bg-center"
                    style={{ backgroundImage: `url('${product.img}')` }}
                  ></div>
                  <div className="p-4 text-center">
                    <h4 className="font-bold text-pink-800">{product.name}</h4>
                    <p className="text-gray-600 font-semibold">₹{product.price}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Footer with Enhanced Design */}
        <footer className="bg-white py-16 text-black border-t border-pink-200">
          <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-6">
            <div className="flex flex-col items-center md:items-start">
              <h4 className="text-3xl font-extrabold text-pink-800 mb-4">MERA Bestie</h4>
              <p className="text-gray-600 mb-4 text-center md:text-left">
                Your one-stop destination for thoughtful and unique gifts.
              </p>
              <div className="flex space-x-6 text-3xl mt-4">
                <FaFacebook className="text-pink-600 hover:text-pink-800 transition cursor-pointer" />
                <FaInstagram className="text-pink-600 hover:text-pink-800 transition cursor-pointer" />
                <FaTwitter className="text-pink-600 hover:text-pink-800 transition cursor-pointer" />
              </div>
            </div>
            <div className="text-center md:text-right">
              <h5 className="text-2xl font-bold text-pink-800 mb-4">Contact Us</h5>
              <p className="text-gray-600">
                3181 Street Name, City, India
                <br />
                Email: support@merabestie.com
                <br />
                Phone: +91 1234567890
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Shop;
