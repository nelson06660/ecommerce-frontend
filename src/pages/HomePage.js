import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import './HomePage.css'; // Optional: For additional custom styles

function HomePage() {
  return (
    <Container fluid className="home-page">
      <Row className="justify-content-center align-items-center text-center py-5">
        <Col md={8}>
          <Card className="bg-primary text-white border-0">
            <Card.Body>
              <Card.Title as="h1" className="display-4 font-weight-bold mb-4">
                Welcome to Our Store
              </Card.Title>
              <Card.Text className="lead mb-4">
                Discover a wide range of products tailored just for you. Shop now and enjoy exclusive offers!
              </Card.Text>
              <Link to="/products">
                <Button variant="light" size="lg">Shop Now</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default HomePage;
