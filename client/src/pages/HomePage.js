import React, { useState, useEffect } from 'react';
import { Row, Col, Container, Carousel, Image } from 'react-bootstrap';
import axios from 'axios';
import Product from '../components/Product';
import CategoryBox from '../components/CategoryBox';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Définition des catégories
  const categories = [
    { name: 'Électronique', icon: 'fa-mobile-alt' },
    { name: 'Informatique', icon: 'fa-laptop' },
    { name: 'Électroménager', icon: 'fa-blender' },
    { name: 'Mode', icon: 'fa-tshirt' },
    { name: 'Maison', icon: 'fa-home' },
    { name: 'Sport', icon: 'fa-running' },
    { name: 'Jouets', icon: 'fa-gamepad' },
    { name: 'Auto', icon: 'fa-car' }
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des produits.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <>
      <div className="hero-section mb-4">
        <Carousel pause='hover' className='bg-dark'>
          {[1, 2, 3].map((item) => (
            <Carousel.Item key={item}>
              <Image 
                src={`/images/banner-${item}.jpg`} 
                alt={`Banner ${item}`} 
                fluid 
                className="d-block w-100 carousel-image"
              />
              <Carousel.Caption>
                <h2>Découvrez nos meilleures offres</h2>
                <p>Qualité et prix imbattables</p>
              </Carousel.Caption>
            </Carousel.Item>
          ))}
        </Carousel>
      </div>

      <Container>
        <section className="categories-section mb-5">
          <h2 className="section-title">Parcourir par Catégories</h2>
          <Row>
            {categories.map((category, index) => (
              <Col key={index} sm={6} md={4} lg={3}>
                <CategoryBox category={category.name} icon={category.icon} />
              </Col>
            ))}
          </Row>
        </section>

        <section className="products-section">
          <h2 className="section-title">Derniers Produits</h2>
          {loading ? (
            <p>Chargement...</p>
          ) : error ? (
            <div className="alert alert-danger">{error}</div>
          ) : (
            <Row>
              {products.map((product) => (
                <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
                  <Product product={product} />
                </Col>
              ))}
            </Row>
          )}
        </section>
      </Container>
    </>
  );
};

export default HomePage;
