import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

const CheckoutPage = () => {
  const { cart, totalPrice, clearCart } = useContext(CartContext);
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    name: userInfo?.name || '',
    street: userInfo?.address?.street || '',
    city: userInfo?.address?.city || '',
    postalCode: userInfo?.address?.postalCode || '',
    country: userInfo?.address?.country || 'France',
    phone: userInfo?.phone || ''
  });

  const [paymentMethod, setPaymentMethod] = useState('reception');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingAddress({ ...shippingAddress, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation simple
    if (!shippingAddress.name || !shippingAddress.street || !shippingAddress.city || 
        !shippingAddress.postalCode || !shippingAddress.phone) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      // Préparer les données de commande
      const orderData = {
        products: cart.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        shippingAddress,
        paymentMethod,
        notes
      };

      // Envoyer la commande
      const { data } = await axios.post('/api/orders', orderData);

      // Vider le panier
      clearCart();

      // Rediriger vers la page de confirmation
      navigate(`/order/${data.order._id}`);

    } catch (error) {
      setError(error.response?.data?.message || 'Erreur lors de la création de la commande');
    }
  };

  if (cart.length === 0) {
    return (
      <Container className="py-5 text-center">
        <h2>Votre panier est vide</h2>
        <Button 
          variant="primary" 
          className="mt-3" 
          onClick={() => navigate('/products')}
        >
          Parcourir les produits
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          <h2 className="mb-4">Finaliser votre commande</h2>
          
          {error && <div className="alert alert-danger">{error}</div>}
          
          <Form onSubmit={handleSubmit}>
            <h4>Adresse de livraison</h4>
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Nom complet</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={shippingAddress.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                name="street"
                value={shippingAddress.street}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Ville</Form.Label>
                  <Form.Control
                    type="text"
                    name="city"
                    value={shippingAddress.city}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Code postal</Form.Label>
                  <Form.Control
                    type="text"
                    name="postalCode"
                    value={shippingAddress.postalCode}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Row className="mb-3">
              <Col>
                <Form.Group>
                  <Form.Label>Pays</Form.Label>
                  <Form.Control
                    type="text"
                    name="country"
                    value={shippingAddress.country}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Téléphone</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={shippingAddress.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <h4 className="mt-4">Mode de paiement</h4>
            <Form.Group className="mb-3">
              <Form.Check
                type="radio"
                label="Paiement à la réception"
                name="paymentMethod"
                value="reception"
                checked={paymentMethod === 'reception'}
                onChange={(e) => setPaymentMethod(e.target.value)}
                id="reception"
              />
            </Form.Group>
            
            <Form.Group className="mb-4">
              <Form.Label>Notes (optionnel)</Form.Label>
              <Form.Control
                as="textarea"
                name="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </Form.Group>
            
            <div className="d-flex justify-content-between">
              <Button 
                variant="secondary" 
                onClick={() => navigate('/cart')}
              >
                Retour au panier
              </Button>
              <Button 
                variant="primary" 
                type="submit"
              >
                Commander
              </Button>
            </div>
          </Form>
        </Col>
        
        <Col md={4}>
          <Card>
            <Card.Header as="h4">Résumé de la commande</Card.Header>
            <Card.Body>
              {cart.map(item => (
                <div key={item.id} className="d-flex justify-content-between mb-2">
                  <span>{item.quantity} x {item.name}</span>
                  <span>{(item.price * item.quantity).toFixed(2)} €</span>
                </div>
              ))}
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total</strong>
                <strong>{totalPrice.toFixed(2)} €</strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;