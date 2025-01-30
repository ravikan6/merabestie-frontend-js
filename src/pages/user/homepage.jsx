import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/footer";
import SEOComponent from '../../components/SEO/SEOComponent';
import CartItems from "../../components/user/cart/Cartitems";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const ScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const currentScroll = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress((currentScroll / scrollHeight) * 100);
    };

    window.addEventListener("scroll", updateScrollProgress);
    return () => window.removeEventListener("scroll", updateScrollProgress);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${scrollProgress}%`,
        height: '4px',
        backgroundColor: '#ec4899',
        transition: 'width 0.3s ease-out',
        zIndex: 1000,
      }}
    />
  );
};

const HomePage = ({ handleCheckout }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);
  const [sideCartVisible, setSideCartVisible] = useState(false);

  const carouselSlides = [
    {
      title: "50% OFF",
      description: "Surprise your loved ones with our Special Gifts",
      image: "https://images.pexels.com/photos/269887/pexels-photo-269887.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    },
    {
      title: "New Arrivals",
      description: "Check out our latest collection of gifts",
      image: "https://i.pinimg.com/originals/96/24/6e/96246e3c133e6cb5ae4c7843f9e45b22.jpg"
    },
    {
      title: "Special Offers",
      description: "Limited time deals on selected items",
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
    }
  ];

  // Existing fetchProducts logic
  const fetchProducts = async () => {
    try {
      const response = await fetch('https://api.merabestie.com/get-product');
      const data = await response.json();
      if (data.success) {
        console.log(products);
        setProducts(data.products);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Carousel slide logic
  // const nextSlide = () => {
  //   setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  // };

  // useEffect(() => {
  //   const timer = setInterval(nextSlide, 5005);
  //   return () => clearInterval(timer);
  // }, []);

  // ProductGrid component
  const ProductGrid = ({ title, products }) => {
    // Existing handleAddToCart logic preserved
    const handleAddToCart = async (product) => {
      // window.location.href = "/cart";
      try {
        let cartId = localStorage.getItem("cartId");
        if (!cartId) {
          cartId = "cart_" + Math.random().toString(36).substring(2, 15);
          localStorage.setItem("cartId", cartId);
        }
    
        const userId = cartId;
    
        let existingCart = await fetchCart(userId, cartId);
    
        if (existingCart) {
          if (!Array.isArray(existingCart.productsInCart)) {
            existingCart.productsInCart = [];
          }
    
          const productIndex = existingCart.productsInCart.findIndex(item => item === product._id);
    
          if (productIndex >= 0) {
            alert("This product is already in the cart.");
          } else {
            existingCart.productsInCart.push(product._id);
          }
        } else {
          existingCart = {
            userId,
            cartId,
            productsInCart: [product._id]
          };
        }
    
        const response = await fetch("https://api.merabestie.com/cart/addtocart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            cartId,
            productsInCart: existingCart.productsInCart,
          }),
        });
    
        const data = await response.json();
    
        if (data.success) {
          setCartItems(existingCart.productsInCart);
          setSideCartVisible(true);
          localStorage.setItem("cartItems", JSON.stringify(existingCart.productsInCart));
        } else {
          alert(data.message || "Failed to add item to cart.");
        }
      } catch (error) {
        console.error("Error adding to cart:", error);
        alert("An error occurred while adding to the cart.");
      }
    };
    
    // Helper function to fetch existing cart
    const fetchCart = async (userId, cartId) => {
      try {
        const response = await fetch("https://api.merabestie.com/cart/get-cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, cartId }),
        });
    
        const data = await response.json();
        if (data.success) {
          return data.cart;
        } else {
          return null;
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
        return null;
      }
    };

    const handleBuyNow = async (product) => {
      await handleAddToCart(product);
      window.location.href = "/cart";
    };
    
    function transformData(mydata) {
      return {
          cart_data: {
              items: mydata.map(item => ({
                  variant_id: item.variant_id,
                  quantity: item.quantity
              }))
          },
          redirect_url: "https://your-domain.requestcatcher.com/?=anyparam=anyvalue&more=2",
          timestamp: new Date().toISOString()
      };
    }

    const handleCheckout = async (event) => {
      const userId = sessionStorage.getItem('userId');
      // if (!userId) {
      //   alert('Please log in to proceed.');
      //   return;
      // }
    
      // Transform cart data
      console.log(cartItems);
      const mydata = 
       cartItems.map(item => ({
          variant_id: item?.productId,
          quantity: item?.quantity || 1
        }));
          
      
  
      console.log("my data  : ", mydata); 
     
      try {
        const transformedData = transformData(mydata);
    
        const response = await fetch('https://api.merabestie.com/shiprocketapi', { 
            method: 'POST',
            headers: {
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(transformedData)
        });
    
        const myresponse = await response.json() ;
        console.log("this was received : ", myresponse.token); 
        window.HeadlessCheckout.addToCart( event , myresponse.token, {fallbackUrl: "https://your.fallback.com?product=123"});
    } catch (error) {
        console.error('Error sending request:', error);
    }
    
    };


    return (
      <section className="container mx-auto px-4 py-8">
        {/* Side Cart */}
        {/* Inside ProductGrid component, modify the side cart section */}
{sideCartVisible && (
  <div className="fixed bottom-5 top-5 right-4 w-1/3 h-full bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out">    <div className="relative h-full">
      {/* Close button at top-right */}
      <button 
        onClick={() => setSideCartVisible(false)}
        className="absolute top-4 right-4 z-10 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      {/* Cart Content */}
      <div className="p-6 pt-16 h-full overflow-y-auto">
        {/* <h2 className="text-2xl font-bold mb-6">Your Cart</h2> */}
        <CartItems 
          cartItem={cartItems} 
          onRemove={(itemId) => {
            setCartItems(prevItems => prevItems.filter(item => item !== itemId));
          }}
        />
      </div>

      {/* Checkout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-6 bg-white border-t">
        <button 
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  </div>
)}

        {/* Rest of the ProductGrid remains the same */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">{title}</h2>
          <a href="/shop">
            <button className="bg-pink-100 text-pink-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-pink-200 transition-colors">
              View All
            </button>
          </a>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow transform hover:-translate-y-1 relative"
            >
              <div className="relative">
                <img
                  src={product.img[0] || "/fallback-image.jpg"}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-75 text-white opacity-0 hover:opacity-100 transition-opacity">
                  Shop Now
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-medium mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm">₹{product.price}</span>
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span className="text-sm">{product.rating}</span>
                  </div>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button
                    className="bg-indigo-500 text-white px-3 py-1 rounded-md text-sm hover:bg-indigo-600"
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="bg-orange-500 text-white px-3 py-1 rounded-md text-sm hover:bg-orange-600"
                    onClick={() => handleBuyNow(product)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  };

  // Rest of the component remains the same
  const NewArrivalsGrid = () => {
    const newArrivals = products.slice(0, 4);
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">New Arrival</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-6 relative group overflow-hidden rounded-lg">
            <img
              src={newArrivals[0]?.img[0] || "/fallback-image.jpg"}
              alt={newArrivals[0]?.name}
              className="w-full h-[600px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white text-2xl font-semibold mb-2">{newArrivals[0]?.name}</h3>
              <p className="text-white text-lg">₹{newArrivals[0]?.price}</p>
            </div>
          </div>

          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {newArrivals.slice(1).map((product, idx) => (
              <div key={idx} className="relative overflow-hidden rounded-lg">
                <img
                  src={product?.img[0] || "/fallback-image.jpg"}
                  alt={product?.name}
                  className="w-full h-[300px] object-cover transition-transform duration-300 transform group-hover:scale-105"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h4 className="text-white text-lg">{product?.name}</h4>
                  <p className="text-white">₹{product?.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-50">
      <SEOComponent />
      <ScrollProgress />
      <Navbar />
      <main>
        {/* Carousel */}
        <div className="relative">
          <div className="h-96 w-full bg-cover bg-center" style={{ backgroundImage: `url(${carouselSlides[currentSlide].image})` }}>
            <div className="absolute inset-0 bg-black bg-opacity-40">
              <div className="flex flex-col items-center justify-center h-full text-white">
                <h2 className="text-4xl font-semibold">{carouselSlides[currentSlide].title}</h2>
                <p className="text-lg mt-2">{carouselSlides[currentSlide].description}</p>
              </div>
            </div>
          </div>
        </div>

        {/* <NewArrivalsGrid /> */}
        <ProductGrid title="Top Picks" products={products} />
        <Footer />
      </main>
    </div>
  );
};

export default HomePage;