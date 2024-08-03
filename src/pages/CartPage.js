import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import './CartPage.css'; // Ensure this file exists and is correctly imported

const stripePromise = loadStripe('your-stripe-public-key');

function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/api/CartController.php') // Replace with your API endpoint
      .then(response => {
        if (Array.isArray(response.data)) {
          setCartItems(response.data.map(item => ({ ...item, quantity: 1 }))); // Initialize quantity to 1
        } else {
          setError('Error: Unexpected response format');
        }
      })
      .catch(error => {
        setError(`Error: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleQuantityChange = (id, delta) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item
    ));
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="text-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <div className="mt-3">Loading cart items...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center my-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="text-center mb-4">Your Cart</h1>
      {cartItems.length === 0 ? (
        <h4 className="text-center mt-4">Your cart is empty.</h4>
      ) : (
        <>
          <div className="cart-items mb-4">
            {cartItems.map(item => (
              <div key={item.id} className="cart-card mb-3">
                <img src={item.image_url || '/images/placeholder.jpg'} alt={item.name} className="cart-card-img" />
                <div className="cart-card-body">
                  <h5 className="cart-card-title">{item.name}</h5>
                  <p className="cart-card-text">
                    Quantity: 
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, -1)}>-</button>
                    {item.quantity}
                    <button className="quantity-btn" onClick={() => handleQuantityChange(item.id, 1)}>+</button>
                  </p>
                  <p className="cart-card-text">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <h3 className="text-center mt-4">Total: ${cartItems.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}</h3>
          <div className="text-center mt-4">
            <button className="btn btn-primary" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default CartPage;
