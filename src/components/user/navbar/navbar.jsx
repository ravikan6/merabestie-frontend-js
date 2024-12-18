import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaSearch, FaTimes, FaBars, FaUser, FaShoppingCart, FaGift
} from "react-icons/fa";
import SearchBar from "./SearchBar";
import { API_URL } from '../../../constants'


const ProfessionalNavbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [cartItemCount, setCartItemCount] = useState(0);
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProfileMenu = () => setIsProfileMenuOpen(!isProfileMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);
  const isActive = (path) => location.pathname === path;
  const searchRef = useRef();

  useEffect(() => {
    const fetchCartItems = async () => {
      const userId = sessionStorage.getItem("userId");
      if (!userId) return;

      try {
        const cartResponse = await fetch(
          `${API_URL}/cart/get-cart`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId })
          }
        );
        const cartData = await cartResponse.json();
        
        if (cartData.success && cartData.cart && Array.isArray(cartData.cart.productsInCart)) {
          const total = cartData.cart.productsInCart.reduce((sum, item) => sum + 1, 0);
          setCartItemCount(total);
        } else {
          setCartItemCount(0);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        setCartItemCount(0);
      }
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMenuOpen(false);
        setIsSearchOpen(false);
      }
    };

    const fetchUserName = async () => {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        try {
          const response = await fetch(
            `${API_URL}/auth/user/${userId}`
          );
          const data = await response.json();
          setUserName(data.name);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    fetchUserName();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userId");
    window.location.reload();
  };

  const userId = sessionStorage.getItem("userId");

  const menuVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const linkVariants = {
    closed: { x: -20, opacity: 0 },
    open: i => ({
      x: 0,
      opacity: 1,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    })
  };

  const navLinks = [
    { path: "/HomePage", name: "HOME" },
    { path: "/shop", name: "SHOP" },
    { path: "/contact", name: "CONTACT" },
    { path: "/about", name: "ABOUT" }
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      {/* Top Promotional Banner */}
      <div
        className={`bg-pink-600 text-white py-2 text-center text-xs transition-all duration-300 ${
          scrolled ? "opacity-0 h-0 overflow-hidden" : "opacity-100 h-auto"
        }`}
      >
        <div className="max-w-[1200px] mx-auto px-4 flex items-center justify-center">
          <FaGift className="mr-2" />
          <span>
            USE CODE OFF10 TO GET FLAT 10% OFF ON ORDERS ABOVE RS.499 | FREE
            SHIPPING | COD AVAILABLE
          </span>
        </div>
      </div>
      {/* Main Navigation */}
      <div className="bg-white border-b">
        <div className="max-w-[1200px] mx-auto px-4 lg:px-0">
          <div className="h-[70px] flex items-center justify-between">
            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMenu}
              className="lg:hidden text-black hover:text-pink-600 transition"
            >
              <FaBars className="w-6 h-6" />
            </button>

            {/* Logo */}
            <Link
              to="/HomePage"
              className="text-2xl flex items-center hover:opacity-80 transition mx-auto lg:mx-0"
            >
              <span className="font-['Bodoni_MT'] font-bold text-3xl sm:text-4xl text-pink-600">
                MERA Bestie
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center justify-center absolute left-1/2 transform -translate-x-1/2">
              {navLinks.map(({ path, name }) => (
                <Link
                  key={path}
                  to={path}
                  className={`px-4 py-2 mx-2 ${
                    isActive(path)
                      ? "text-pink-600"
                      : "text-gray-800 hover:text-pink-600"
                  } transition-colors duration-200`}
                >
                  {name}
                </Link>
              ))}
            </div>

            {/* Action Icons */}
            <div className="flex items-center space-x-6">
              <button
                className="text-gray-800 hover:text-pink-600 transition"
                onClick={toggleSearch}
              >
                <FaSearch className="w-5 h-5" />
              </button>

              <Link
                to="/cart"
                className="relative text-gray-800 hover:text-pink-600 transition flex items-center"
              >
                <FaShoppingCart className="w-5 h-5" />
                <span className="ml-2 hidden md:block">Cart</span>
                {cartItemCount > 0 && (
                  <span className="absolute top-[-8px] right-[-8px] bg-pink-600 text-white rounded-full text-xs w-4 h-4 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>

              <div className="relative">
                <button
                  onClick={toggleProfileMenu}
                  className="flex items-center text-gray-800 hover:text-pink-600 transition"
                >
                  <FaUser className="w-5 h-5" />
                  <span className="ml-2 hidden md:block">
                    {userId ? `Hi, ${userName}` : "Profile"}
                  </span>
                </button>

                {isProfileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg overflow-hidden z-50"
                  >
                    {userId ? (
                      <>
                        <Link
                          to="/orders"
                          className="block px-4 py-2 hover:bg-pink-50 transition"
                        >
                          My Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 hover:bg-pink-50 transition"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="block px-4 py-2 hover:bg-pink-50 transition"
                        >
                          Login
                        </Link>
                        <Link
                          to="/Signup"
                          className="block px-4 py-2 hover:bg-pink-50 transition"
                        >
                          Sign Up
                        </Link>
                        <Link
                          to='/seller/login'
                          className="block w-full text-left px-4 py-2 hover:bg-pink-50 transition"
                        >
                          Seller
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="lg:hidden fixed inset-0 z-50 bg-[#fdf9f3]"
          >
            <div className="flex justify-between items-center p-4 border-b">
              <Link 
                to="/HomePage" 
                className="text-2xl font-bold text-pink-600 mx-auto" 
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="font-['Bodoni_MT'] text-4xl">MERA Bestie</span>
              </Link>
              <motion.button
                whileHover={{ rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMenuOpen(false)}
                className="absolute right-4 text-gray-800"
              >
                <FaTimes className="w-6 h-6" />
              </motion.button>
            </div>
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] p-4">
              <div className="w-full max-w-md space-y-6">
                {navLinks.map(({ path, name }, i) => (
                  <motion.div
                    key={path}
                    custom={i}
                    variants={linkVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                  >
                    <Link
                      to={path}
                      className={`block text-center text-xl py-3 w-full ${
                        isActive(path) 
                          ? "text-pink-600" 
                          : "text-gray-800 hover:text-pink-600"
                      } transition-colors duration-200`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {name}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white p-4 rounded-lg w-full max-w-md mx-4"
              ref={searchRef}
            >
              <SearchBar />
              <button 
                onClick={toggleSearch}
                className="mt-2 text-gray-600 hover:text-pink-600"
              >
                Close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default ProfessionalNavbar;
