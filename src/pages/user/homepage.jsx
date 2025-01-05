import React, { useState, useEffect } from 'react';
import { FaStar } from 'react-icons/fa';
import Navbar from "../../components/user/navbar/navbar";
import Footer from "../../components/user/footer/footer";
import SEOComponent from '../../components/SEO/SEOComponent';

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

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const carouselSlides = [
    {
      title: "50% OFF",
      description: "Surprise your Loved person with our Special Gifts",
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

  const products = [
    {
      image: "https://images.pexels.com/photos/269887/pexels-photo-269887.jpeg",
      title: "Dummy Item",
      price: "599",
      rating: 4.5
    },
    {
      image: "https://i.pinimg.com/originals/96/24/6e/96246e3c133e6cb5ae4c7843f9e45b22.jpg",
      title: "Dummy Item",
      price: "699",
      rating: 4.8
    },
    {
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
      title: "Dummy Item",
      price: "999",
      rating: 4.7
    },
    {
      image: "https://images.pexels.com/photos/269887/pexels-photo-269887.jpeg",
      title: "Dummy Item",
      price: "1499",
      rating: 4.9
    }
  ];

  const newArrivals = [
    {
      image: "https://images.pexels.com/photos/269887/pexels-photo-269887.jpeg",
      title: "Modern Man Groomsmen Gift Box",
      size: "large"
    },
    {
      image: "https://i.pinimg.com/originals/96/24/6e/96246e3c133e6cb5ae4c7843f9e45b22.jpg",
      title: "Chocolate Gift Combo",
      size: "medium"
    },
    {
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg",
      title: "Diwali Gift Pack",
      size: "small"
    },
    {
      image: "https://images.pexels.com/photos/269887/pexels-photo-269887.jpeg",
      title: "Chocolate Gift Box",
      size: "small"
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, []);

  const ProductGrid = ({ title, products }) => (
    <section className="container mx-auto px-4 py-8">
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
          <a href="/shop" key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow transform hover:-translate-y-1 relative">
            <div className="relative">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-48 object-cover"
              />
              <button className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-75 text-white opacity-0 hover:opacity-100 transition-opacity">
                Shop Now
              </button>
            </div>
            <div className="p-4">
              <h3 className="font-medium mb-2">{product.title}</h3>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm">₹{product.price}</span>
                <div className="flex items-center">
                  <FaStar className="text-yellow-400 mr-1" />
                  <span className="text-sm">{product.rating}</span>
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  );

  const NewArrivalsGrid = () => {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">New Arrival</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
          {/* Large gift box */}
          <div className="lg:col-span-6 relative group overflow-hidden rounded-lg">
            <img
              src={newArrivals[0].image}
              alt={newArrivals[0].title}
              className="w-full h-[600px] object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent">
              <h3 className="text-white text-xl font-semibold">{newArrivals[0].title}</h3>
            </div>
          </div>

          {/* Right column layout */}
          <div className="lg:col-span-6 grid grid-rows-2 gap-4">
            {/* Top right - medium box */}
            <div className="relative group overflow-hidden rounded-lg">
              <img
                src={newArrivals[1].image}
                alt={newArrivals[1].title}
                className="w-full h-[290px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h3 className="text-white text-lg font-semibold">{newArrivals[1].title}</h3>
              </div>
            </div>

            {/* Bottom right - two small boxes */}
            <div className="grid grid-cols-2 gap-4">
              {newArrivals.slice(2).map((item, index) => (
                <div key={index} className="relative group overflow-hidden rounded-lg">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-[290px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
                    <h3 className="text-white text-sm font-semibold">{item.title}</h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEOComponent />
      <ScrollProgress />
      <Navbar />

      <main className="mt-20">
        {/* Hero Carousel */}
        <div className="container mx-auto px-4 py-6">
          <div className="relative h-[300px] rounded-xl overflow-hidden">
            <div className="absolute inset-0 flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
              {carouselSlides.map((slide, index) => (
                <div key={index} className="relative w-full h-full flex-shrink-0">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-950/80 to-pink-400/80">
                    <div className="absolute inset-0 flex items-center p-8">
                      <div className="text-white">
                        <h1 className="text-4xl font-bold mb-2">{slide.title}</h1>
                        <p className="text-lg">{slide.description}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Dots Navigation */}
            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
              {carouselSlides.map((_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full ${currentSlide === index ? 'bg-pink-500' : 'bg-gray-300'}`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Product Grids */}
        <ProductGrid title="Best Selling Products" products={products} />
        <ProductGrid title="Explore Our Products" products={products} />

        {/* New Arrivals Section with new grid layout */}
        <NewArrivalsGrid />

        <ProductGrid title="Gifts for Couples" products={products} />
        <ProductGrid title="Stationary" products={products} />
        <ProductGrid title="Greeting Cards" products={products} />

        {/* Footer Banner */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
              <div className="text-center">
                <h3 className="font-semibold">Free Delivery</h3>
                <p className="text-sm text-gray-600">On orders above ₹499</p>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
              <div className="text-center">
                <h3 className="font-semibold">24/7 Support</h3>
                <p className="text-sm text-gray-600">Customer service</p>
              </div>
            </div>
            <div className="flex items-center justify-center p-4 bg-gray-100 rounded-lg">
              <div className="text-center">
                <h3 className="font-semibold">Secure Payment</h3>
                <p className="text-sm text-gray-600">100% secure payment</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;