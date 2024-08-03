import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import './ProductPage.css'; // Ensure you create this CSS file

function ProductPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    axios.get('http://localhost:8000/api/ProductController2.php')
      .then(response => {
        if (Array.isArray(response.data)) {
          setProducts(response.data);
        } else if (response.data === null) {
          setError('No products found');
        } else {
          setError('Error: Response data is not an array');
        }
      })
      .catch(error => {
        setError(`Error: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const addToCart = (product) => {
    // Add or update cart item
    const existingProduct = cart.find(item => item.id === product.id);
    if (existingProduct) {
      setCart(cart.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }

    // Save cart to local storage
    localStorage.setItem('cart', JSON.stringify([...cart, { ...product, quantity: 1 }]));

    // Navigate to CartPage
    navigate('/cart');
  };

  const incrementQuantity = (productId) => {
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
    ));
  };

  const decrementQuantity = (productId) => {
    setCart(cart.map(item => 
      item.id === productId ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 1 } : item
    ));
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <div className="mt-3">Loading products...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5 product-page">
      <h2 className="text-center mb-4">Our Products</h2>
      <Row>
        {products.map(product => (
          <Col key={product.id} sm={12} md={6} lg={4} className="mb-4">
            <Card className="product-card">
              <Card.Img variant="top" src={product.image_url || '/images/placeholder.jpg'} alt={product.name} />
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <Card.Text className="text-muted">
                  ${Number(product.price).toFixed(2)}
                </Card.Text>
                <div className="d-flex align-items-center justify-content-between">
                  
                  <Button 
                    className="ml-3" 
                    variant="primary" 
                    onClick={() => addToCart(product)}
                  >
                    Add to Cart
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ProductPage;
