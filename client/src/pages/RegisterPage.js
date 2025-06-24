import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  
  const navigate = useNavigate();
  const { register, userInfo, loading, error } = useContext(AuthContext);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setMessage('Les mots de passe ne correspondent pas');
      return;
    }
    
    try {
      await register(name, email, password);
    } catch (err) {
      // Error handling is done in context
    }
  };

  return (
    <Container>
      <Row className='justify-content-md-center'>
        <Col xs={12} md={6}>
          <h1>Inscription</h1>
          {message && <div className='alert alert-danger'>{message}</div>}
          {error && <div className='alert alert-danger'>{error}</div>}
          
          <Form onSubmit={submitHandler}>
            <Form.Group controlId='name' className='mb-3'>
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type='text'
                placeholder='Entrez votre nom'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='email' className='mb-3'>
              <Form.Label>Adresse Email</Form.Label>
              <Form.Control
                type='email'
                placeholder='Entrez votre email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='password' className='mb-3'>
              <Form.Label>Mot de Passe</Form.Label>
              <Form.Control
                type='password'
                placeholder='Entrez votre mot de passe'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId='confirmPassword' className='mb-3'>
              <Form.Label>Confirmer le Mot de Passe</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirmez votre mot de passe'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button type='submit' variant='primary' disabled={loading}>
              {loading ? 'Chargement...' : 'S\'inscrire'}
            </Button>
          </Form>

          <Row className='py-3'>
            <Col>
              Déjà un compte?{' '}
              <Link to='/login'>Se Connecter</Link>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;
