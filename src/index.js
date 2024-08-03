// index.js (client-side)
import React from 'react';
import ReactDOM from 'react-dom';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';


const stripePromise = loadStripe('pk_test_51PjOseGGZtZ5ySStpQpHcEJzlM98UhPbvEVBEBfq75km29Ic4pcogCQ0clRgBbHl8KWmllBhxkeV6YXxucJgi2rw006vENThSX'); // Replace with your publishable key

ReactDOM.render(
  <Elements stripe={stripePromise}>
    <App />
  </Elements>,
  document.getElementById('root')
);
