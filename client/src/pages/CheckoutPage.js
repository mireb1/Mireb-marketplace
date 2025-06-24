import React, { useState, useEffect, useContext } from 'react';
import { Button, Row, Col, ListGroup, Image, Card, Container, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CheckoutPage = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [cartItems, setCartItems] = useState([]);
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Paiement à la livraison');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Redirect if not logged in
    if (!userInfo) {
      navigate('/login?redirect=checkout');
      return;
    }
    
    // Get cart items from localStorage
    const cartItemsFromStorage = localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [];
    
    if (cartItemsFromStorage.length === 0) {
      navigate('/cart');
      return;
    }
    
    setCartItems(cartItemsFromStorage);
    
    // Get shipping address from localStorage if exists
    const shippingAddressFromStorage = localStorage.getItem('shippingAddress')
      ? JSON.parse(localStorage.getItem('shippingAddress'))
      : {};
    
    if (shippingAddressFromStorage) {
      setAddress(shippingAddressFromStorage.address || '');
      setCity(shippingAddressFromStorage.city || '');
      setPostalCode(shippingAddressFromStorage.postalCode || '');
      setCountry(shippingAddressFromStorage.country || '');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      // Save shipping address to localStorage
      const shippingAddress = { address, city, postalCode, country };
      localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
      
      // Create order
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const orderItems = cartItems.map(item => ({
        product: item.product,
        name: item.name,
        image: item.image,
        price: item.price,
        qty: item.qty,
      }));
      
      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems,
          shippingAddress,
          paymentMethod,
          itemsPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
          taxPrice: 0,
          shippingPrice: 0,
          totalPrice: cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
        },
        config
      );
      
      // Clear cart
      localStorage.removeItem('cartItems');
      
      // Redirect to order confirmation
      navigate(`/order/${data._id}`);
      
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Une erreur est survenue lors de la création de la commande.');
      setLoading(false);
    }
  };

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h2>Adresse de Livraison</h2>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='address' className='mb-3'>
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type='text'
                placeholder='Entrez votre adresse'
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='city' className='mb-3'>
              <Form.Label>Ville</Form.Label>
              <Form.Control
                type='text'
                placeholder='Entrez votre ville'
                value={city}
                onChange={(e) => setCity(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='postalCode' className='mb-3'>
              <Form.Label>Code Postal</Form.Label>
              <Form.Control
                type='text'
                placeholder='Entrez votre code postal'
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='country' className='mb-3'>
              <Form.Label>Pays</Form.Label>
              <Form.Control
                type='text'
                placeholder='Entrez votre pays'
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
              />
            </Form.Group>

            <h2 className='mt-3'>Méthode de Paiement</h2>
            <Form.Group>
              <Form.Check
                type='radio'
                label='Paiement à la livraison'
                id='cashOnDelivery'
                name='paymentMethod'
                value='Paiement à la livraison'
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-4' disabled={loading}>
              {loading ? 'Chargement...' : 'Passer la commande'}
            </Button>
            {error && <div className='alert alert-danger mt-3'>{error}</div>}
          </Form>
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Récapitulatif de Commande</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Articles</Col>
                  <Col>{cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)} €</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Livraison</Col>
                  <Col>0.00 €</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>{cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2)} €</Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
          <Card className='mt-3'>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Articles</h2>
              </ListGroup.Item>
              {cartItems.map((item, index) => (
                <ListGroup.Item key={index}>
                  <Row>
                    <Col md={3}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col>
                      {item.name}
                    </Col>
                    <Col md={4}>
                      {item.qty} x {item.price} € = {(item.qty * item.price).toFixed(2)} €
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;
