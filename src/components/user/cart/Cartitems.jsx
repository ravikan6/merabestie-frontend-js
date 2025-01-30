import React, { useState, useEffect } from "react";
import { faTrash, faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import emptyCart from '../../Images/empty_cart.webp';
import { Link } from 'react-router-dom';
import axios from 'axios';

const CartItems = ({cartItem}) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [voucher, setVoucher] = useState('');
  const [productDetails, setProductDetails] = useState([]);
  const [discountInfo, setDiscountInfo] = useState({
    code: '',
    percentage: 0,
    message: ''
  });

  // Fetch product details when cart items change
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get("https://api.merabestie.com/get-product");

        if (response.data.success) {
          const products = response.data.products;
          const filteredProducts = products.filter(product => 
            cartItem.includes(product._id)
          );

          const updatedCartItems = filteredProducts.map(product => ({
            _id: product._id,
            productId: product._id,
            name: product.name,
            price: product.price.toString(), // Ensure price is a string
            img: product.img ? product.img[0] : null,
            quantity: 1, 
            category: product.category
          }));

          setProductDetails(filteredProducts);
          setCartItems(updatedCartItems);
        } else {
          setError("No products found.");
        }
      } catch (err) {
        setError("Error fetching product details");
      } finally {
        setLoading(false);
      }
    };

    if (cartItem && cartItem.length > 0) {
      fetchProductDetails();
    } else {
      setLoading(false);
      setCartItems([]);
    }
  }, [cartItem]);

  // Quantity change handler
  const handleQuantityChange = async (productId, change) => {
    const updatedCartItems = cartItems.map(item => 
      item.productId === productId 
        ? { ...item, quantity: Math.max(1, item.quantity + change) } 
        : item
    );

    setCartItems(updatedCartItems);

    try {
      const userId = localStorage.getItem('cartId');
      await axios.put('https://api.merabestie.com/cart/update-quantity', {
        userId,
        productId,
        productQty: updatedCartItems.find(item => item.productId === productId).quantity
      });

      // Log successful quantity update (optional)
      console.log('Quantity updated successfully'); 
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  // Remove item from cart
  const handleRemoveItem = async (productId) => {
    // debugger;
    const cartId = localStorage.getItem('cartId');
    const updatedCartItems = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCartItems);

    // try {
    
    const fetchCart = async () => {
      try {
        const response = await axios.post('https://api.merabestie.com/cart/delete-item', { productId: productId, cartId: cartId});
        // Extract only the _id from each product in the productsInCart array
        const productIds = response.data.cart.productsInCart;
        console.log(productIds);
        setCartItems(productIds); // Set only the productIds in the cartItems state
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchCart();
  };

  // Calculate total with discount
  const calculateTotal = () => {
    const subtotal = cartItems.reduce((total, item) => {
      // Ensure price is parsed as a number and handle potential non-numeric values
      const price = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0;
      return total + (price * item.quantity);
    }, 0);
    
    const discountedTotal = subtotal * (1 - (discountInfo.percentage / 100));
    return discountedTotal.toFixed(2);
  };

  // Voucher redemption handler
  const handleVoucherRedeem = async () => {
    try {
      const response = await axios.post('https://api.merabestie.com/coupon/verify-coupon', {
        code: voucher
      });

      const data = response.data;

      if (data.message === 'Invalid coupon code') {
        setDiscountInfo({
          code: '',
          percentage: 0,
          message: 'Invalid coupon code'
        });
      } else if (data.discountPercentage) {
        setDiscountInfo({
          code: voucher,
          percentage: data.discountPercentage,
          message: `${data.discountPercentage}% discount applied!`
        });
      }
    } catch (err) {
      console.error('Error verifying coupon:', err);
      setDiscountInfo({
        code: '',
        percentage: 0,
        message: 'Error verifying coupon'
      });
    }
  };

  // Checkout handler
  const handleCheckout = async (event) => {
    console.log(cartItems);
    const mydata = cartItems.map((item) => ({
      variant_id: item?.productId,
      quantity: item?.quantity || 1,
    }));
  
    const transformedData = { 
      cart_data: { items: mydata },
      redirect_url: "https://merabestie.com/success",
      timestamp: new Date().toISOString(),
    };
  
    try {
      const response = await axios.post("https://api.merabestie.com/shiprocketapi", transformedData);
  
      if (response.data && response.data.token) {
        const { token } = response.data;
  
        // Initialize checkout process
        window.HeadlessCheckout.addToCart(event, token, {
          fallbackUrl: "https://merabestie.com/checkout-fallback",
        });
      } else {
        console.error("Invalid response format from Shiprocket API.");
        alert("Something went wrong during checkout. Please try again.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
  
      const errorMessage =
        error.response?.data?.message ||
        "Unable to process your request at this time. Please try again later.";
      alert(errorMessage);
    }
  };
  


  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 bg-pink-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-pink-600"></div>
      </div>
    );
  }

  // Empty cart state
  if (error || cartItems.length === 0) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 flex flex-col items-center justify-center">
        <img src={emptyCart} alt="Empty Cart" className="w-48 h-48 mb-4" />
        <p className="text-lg text-gray-600 mb-4">{error || 'Your cart is empty'}</p>
        <Link 
          to="/HomePage" 
          className="px-4 py-2 bg-pink-500 text-white rounded-md hover:bg-pink-600 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  // Render cart items
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Your Cart</h2>
        </div>
        <div className="p-4 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item.productId}
              className="flex flex-col md:flex-row items-center justify-between border-b pb-4 last:border-b-0"
            >
              {/* Cart item rendering logic */}
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4 w-full">
                <div className="w-20 h-20 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    src={item.img || "https://i.etsystatic.com/19893040/r/il/0ddcd7/3907960016/il_570xN.3907960016_ej9x.jpg"} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between w-full">
                  <div>
                    <h3 className="font-semibold text-base">{item.name}</h3>
                    <p className="text-sm text-gray-500">{item.category || "No category available"}</p>
                  </div>
                  <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 w-full mt-4 md:mt-0">
                    <span className="font-medium text-base">₹{item.price}</span>
                    <div className="flex items-center border rounded-md">
                      <button
                        onClick={() => handleQuantityChange(item.productId, -1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faMinus} className="text-sm" />
                      </button>
                      <input
                        type="text"
                        value={item.quantity}
                        readOnly
                        className="w-12 text-center border-none text-sm"
                      />
                      <button
                        onClick={() => handleQuantityChange(item.productId, 1)}
                        className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-sm" />
                      </button>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.productId)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary Section */}
      <div className="bg-white shadow-md rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-bold text-gray-800">Order Summary</h2>
        </div>
        <div className="p-4 space-y-4">
          {/* Voucher and Discount Logic */}
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-2">
            <input
              type="text"
              placeholder="Enter voucher code"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              className="flex-grow border rounded-md px-3 py-2"
            />
            <button
              className="w-full md:w-auto bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600"
              onClick={handleVoucherRedeem}
            >
              Redeem
            </button>
          </div>
          
          {discountInfo.message && (
            <div className={`text-sm ${discountInfo.code ? 'text-green-600' : 'text-red-600'}`}>
              {discountInfo.message}
            </div>
          )}
          
          {/* Pricing Details */}
          <div className="space-y-2 text-sm">
            <div className="flex flex-col md:flex-row justify-between">
              <span>Subtotal</span>
              <span>₹{cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0).toFixed(2)}</span>
            </div>
            {discountInfo.percentage > 0 && (
              <div className="flex flex-col md:flex-row justify-between text-green-600">
                <span>Discount ({discountInfo.percentage}%)</span>
                <span>- ₹{(cartItems.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0) * (discountInfo.percentage / 100)).toFixed(2)}</span>
              </div>
            )}
            <div className="flex flex-col md:flex-row justify-between">
              <span>Shipping</span>
              <span>₹ 0.00</span>
            </div>
            <div className="flex flex-col md:flex-row justify-between font-bold text-base">
              <span>Total</span>
              <span>₹ {calculateTotal()}</span>
            </div>
          </div>

          <button
            onClick={handleCheckout}
            className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItems;