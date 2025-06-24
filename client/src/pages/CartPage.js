import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button, Container } from 'react-bootstrap';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const { userInfo } = useContext(AuthContext);

  useEffect(() => {
    const fetchCartItems = async () => {
      const cartItemsFromStorage = localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
      
      setCartItems(cartItemsFromStorage);
    };

    fetchCartItems();
  }, []);

  const removeFromCartHandler = (id) => {
    const updatedCartItems = cartItems.filter(item => item.product !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  const checkoutHandler = () => {
    if (!userInfo) {
      navigate('/login?redirect=checkout');
    } else {
      navigate('/checkout');
    }
  };

  const addToCartHandler = async (product, qty) => {
    const { data } = await axios.get(`/api/products/${product}`);
    
    const item = {
      product: data._id,
      name: data.name,
      image: data.image,
      price: data.price,
      countInStock: data.countInStock,
      qty,
    };

    // Check if item is already in cart
    const existItem = cartItems.find(x => x.product === item.product);
    
    if (existItem) {
      const updatedCartItems = cartItems.map(x => 
        x.product === existItem.product ? item : x
      );
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    } else {
      const updatedCartItems = [...cartItems, item];
      setCartItems(updatedCartItems);
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
    }
  };

  return (
    <Container>
      <Row>
        <Col md={8}>
          <h1>Panier</h1>
          {cartItems.length === 0 ? (
            <div className='alert alert-info'>
              Votre panier est vide <Link to='/'>Retour</Link>
            </div>
          ) : (
            <ListGroup variant='flush'>
              {cartItems.map((item) => (
                <ListGroup.Item key={item.product}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>{item.price} €</Col>
                    <Col md={2}>
                      <select
                        className="form-control"
                        value={item.qty}
                        onChange={(e) => 
                          addToCartHandler(item.product, Number(e.target.value))
                        }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </select>
                    </Col>
                    <Col md={2}>
                      <Button
                        type='button'
                        variant='light'
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className='fas fa-trash'></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Col>
        <Col md={4}>
          <Card>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>
                  Sous-Total ({cartItems.reduce((acc, item) => acc + Number(item.qty), 0)}) articles
                </h2>
                {cartItems
                  .reduce((acc, item) => acc + item.qty * item.price, 0)
                  .toFixed(2)} €
              </ListGroup.Item>
              <ListGroup.Item>
                <Button
                  type='button'
                  className='btn-block'
                  disabled={cartItems.length === 0}
                  onClick={checkoutHandler}
                >
                  Procéder au Paiement
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;
