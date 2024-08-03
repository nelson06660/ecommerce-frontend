import React from 'react';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import axios from 'axios';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import './CheckoutForm.css'; // Ensure this file exists and is correctly imported

function CheckoutForm() {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [success, setSuccess] = React.useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsProcessing(true);
    setError(null);
    setSuccess(null);

    if (!stripe || !elements) return;

    try {
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: elements.getElement(CardElement),
      });

      if (stripeError) {
        setError(stripeError.message);
        setIsProcessing(false);
        return;
      }

      const response = await axios.post('http://localhost:8000/api/ChargeContoller.php', {
        payment_method: paymentMethod.id,
      });

      if (response.data.success) {
        setSuccess('Payment successful!');
      } else {
        setError('Payment failed. Please try again.');
      }
    } catch (networkError) {
      console.error('Network Error:', networkError.message);
      setError('Payment failed. Please check the console for details.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Container className="checkout-form-container">
      <Row className="justify-content-center">
        <Col md={6} className="p-4 bg-light rounded shadow-sm checkout-form">
          <h2 className="text-center mb-4">Checkout</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label><h4>Card Details</h4></Form.Label>
              <CardElement
                options={{
                  style: {
                    base: {
                      fontSize: '16px',
                      color: '#424770',
                      '::placeholder': {
                        color: '#aab7c4',
                      },
                      backgroundColor: '#ffffff',
                      padding: '10px',
                      borderRadius: '4px',
                      border: '1px solid #ced4da',
                    },
                    invalid: {
                      color: '#9e2146',
                    },
                  },
                }}
              />
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              className="w-100 mt-4"
              disabled={!stripe || isProcessing}
            >
              {isProcessing ? <Spinner animation="border" size="sm" /> : 'Pay'}
            </Button>
          </Form>
          {error && <Alert variant="danger" className="mt-3">{error}</Alert>}
          {success && <Alert variant="success" className="mt-3">{success}</Alert>}
        </Col>
      </Row>
    </Container>
  );
}

export default CheckoutForm;
