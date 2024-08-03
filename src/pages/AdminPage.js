import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Card, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';
import './AdminPage.css'; // Ensure this file exists and is correctly imported

function AdminPage() {
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    imageUrl: '',
  });

  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await axios.get('http://localhost:8000/api/ProductController.php');
      console.log('Products response:', response.data); // Log the response to check its structure
      setProducts(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError(`Error fetching products: ${error.message}`);
    } finally {
      setLoadingProducts(false);
    }
  };

  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const response = await axios.get('http://localhost:8000/api/OrderController.php');
      console.log('Orders response:', response.data); // Log the response to check its structure
      setOrders(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      setError(`Error fetching orders: ${error.message}`);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setNewProduct((prevProduct) => ({
      ...prevProduct,
      [name]: value,
    }));
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    try {
      const response = await axios.post('http://localhost:8000/api/ProductController.php', newProduct, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Add product response:', response.data); // Log the response to check its structure
      if (response.data.success) {
        setSuccess('Product added successfully!');
        setNewProduct({
          name: '',
          description: '',
          price: '',
          imageUrl: '',
        });
        fetchProducts();
      } else {
        setError('Failed to add product.');
      }
    } catch (error) {
      setError(`Error adding product: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, []);

  return (
    <Container className="admin-page">
      <h1 className="text-center mb-4">Admin Dashboard</h1>
      {error && <Alert variant="danger" className="mb-4">{error}</Alert>}
      {success && <Alert variant="success" className="mb-4">{success}</Alert>}
      <Row className="mb-4">
        <Col md={6} className="mb-3">
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Manage Products</Card.Title>
              <Form onSubmit={addProduct}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={newProduct.name}
                    onChange={handleProductChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    type="text"
                    name="description"
                    value={newProduct.description}
                    onChange={handleProductChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    name="price"
                    value={newProduct.price}
                    onChange={handleProductChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="imageUrl"
                    value={newProduct.imageUrl}
                    onChange={handleProductChange}
                    required
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  Add Product
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Product List</Card.Title>
              {loadingProducts ? (
                <div className="spinner-container">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <ul className="product-list">
                  {products.length > 0 ? (
                    products.map((product) => (
                      <li key={product.id} className="product-item">
                        <img src={product.image_url} alt={product.name} className="product-image" />
                        <div>{product.name} - ${product.price}</div>
                      </li>
                    ))
                  ) : (
                    <div className="text-center">No products available.</div>
                  )}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={12}>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Orders</Card.Title>
              {loadingOrders ? (
                <div className="spinner-container">
                  <Spinner animation="border" variant="primary" />
                </div>
              ) : (
                <ul className="order-list">
                  {orders.length > 0 ? (
                    orders.map((order) => (
                      <li key={order.id} className="order-item">
                        <div>Order #{order.id} - ${order.total} - {order.status}</div>
                      </li>
                    ))
                  ) : (
                    <div className="text-center">No orders available.</div>
                  )}
                </ul>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AdminPage;
