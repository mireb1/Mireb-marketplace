import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Table, Button, Card, Form, Alert, Modal } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './AdminPage.css';

const AdminPage = () => {
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Modal state pour la gestion des catégories
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryName, setCategoryName] = useState('');
  const [categoryIcon, setCategoryIcon] = useState('fa-tag');
  const [editCategoryId, setEditCategoryId] = useState(null);
  
  // Liste des icônes disponibles
  const availableIcons = [
    'fa-tag', 'fa-mobile-alt', 'fa-laptop', 'fa-tshirt', 
    'fa-home', 'fa-running', 'fa-gamepad', 'fa-car',
    'fa-blender', 'fa-book', 'fa-utensils', 'fa-baby'
  ];

  // Stats
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalOrders: 0,
    totalUsers: 0
  });

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products', {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setProducts(data);
        
        // Extraire les catégories uniques
        const uniqueCategories = [...new Set(data.map(product => product.category))];
        setCategories(uniqueCategories);
        
        setStats({
          totalProducts: data.length,
          totalCategories: uniqueCategories.length,
          totalOrders: 0, // À remplacer par une API réelle
          totalUsers: 0 // À remplacer par une API réelle
        });
        
        setLoading(false);
      } catch (err) {
        setError('Une erreur est survenue lors du chargement des données.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userInfo, navigate]);

  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category === selectedCategory)
    : products;

  const deleteHandler = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      try {
        await axios.delete(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        
        // Mettre à jour la liste des produits
        setProducts(products.filter(product => product._id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression du produit');
      }
    }
  };
  
  // Gérer l'ajout d'une catégorie
  const handleAddCategory = () => {
    setCategoryName('');
    setCategoryIcon('fa-tag');
    setEditCategoryId(null);
    setShowCategoryModal(true);
  };
  
  // Gérer la modification d'une catégorie
  const handleEditCategory = (category, index) => {
    setCategoryName(category);
    setCategoryIcon('fa-tag'); // Par défaut, utilisons fa-tag
    setEditCategoryId(index);
    setShowCategoryModal(true);
  };
  
  // Sauvegarder une catégorie (ajout ou modification)
  const saveCategoryHandler = () => {
    if (!categoryName.trim()) {
      return;
    }
    
    if (editCategoryId !== null) {
      // Modifier une catégorie existante
      const updatedCategories = [...categories];
      updatedCategories[editCategoryId] = categoryName;
      setCategories(updatedCategories);
      
      // Dans un scénario réel, vous feriez ici une requête API pour mettre à jour la catégorie
    } else {
      // Ajouter une nouvelle catégorie
      setCategories([...categories, categoryName]);
      
      // Dans un scénario réel, vous feriez ici une requête API pour créer la catégorie
    }
    
    setShowCategoryModal(false);
  };
  
  // Supprimer une catégorie
  const deleteCategoryHandler = (index) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      const updatedCategories = [...categories];
      updatedCategories.splice(index, 1);
      setCategories(updatedCategories);
      
      // Dans un scénario réel, vous feriez ici une requête API pour supprimer la catégorie
    }
  };

  return (
    <Container className="admin-page py-3">
      <h1 className="admin-title">Dashboard Administrateur</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      
      {/* Stats Cards */}
      <Row className="stats-section mb-4">
        <Col md={3}>
          <Card className="stat-card bg-primary text-white">
            <Card.Body>
              <div className="stat-icon">
                <i className="fas fa-box"></i>
              </div>
              <h3>{stats.totalProducts}</h3>
              <p>Produits</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card bg-success text-white">
            <Card.Body>
              <div className="stat-icon">
                <i className="fas fa-tags"></i>
              </div>
              <h3>{stats.totalCategories}</h3>
              <p>Catégories</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card bg-warning text-white">
            <Card.Body>
              <div className="stat-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <h3>{stats.totalOrders}</h3>
              <p>Commandes</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="stat-card bg-danger text-white">
            <Card.Body>
              <div className="stat-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>{stats.totalUsers}</h3>
              <p>Utilisateurs</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Product Management */}
      <Row className="mb-4">
        <Col>
          <Card className="admin-section">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <h2>Gestion des Produits</h2>
              <Button variant="success" as={Link} to="/admin/product/create">
                <i className="fas fa-plus"></i> Nouveau Produit
              </Button>
            </Card.Header>
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label>Filtrer par catégorie</Form.Label>
                <Form.Select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">Toutes les catégories</option>
                  {categories.map((category, index) => (
                    <option key={index} value={category}>{category}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              
              {loading ? (
                <p>Chargement...</p>
              ) : (
                <div className="table-responsive">
                  <Table striped bordered hover className="products-table">
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Image</th>
                        <th>Nom</th>
                        <th>Catégorie</th>
                        <th>Prix</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr key={product._id}>
                          <td>{product._id}</td>
                          <td>
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                            />
                          </td>
                          <td>{product.name}</td>
                          <td>
                            <span className="category-badge">{product.category}</span>
                          </td>
                          <td>{product.price} €</td>
                          <td>
                            {product.countInStock > 0 ? (
                              <span className="text-success">{product.countInStock}</span>
                            ) : (
                              <span className="text-danger">Rupture</span>
                            )}
                          </td>
                          <td>
                            <Button
                              variant="light"
                              className="btn-sm mx-1"
                              as={Link}
                              to={`/admin/product/${product._id}/edit`}
                            >
                              <i className="fas fa-edit"></i>
                            </Button>
                            <Button
                              variant="danger"
                              className="btn-sm mx-1"
                              onClick={() => deleteHandler(product._id)}
                            >
                              <i className="fas fa-trash"></i>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {/* Categories Section */}
      <Row>
        <Col>
          <Card className="admin-section">
            <Card.Header>
              <h2>Gestion des Catégories</h2>
            </Card.Header>
            <Card.Body>
              <Row>
                {categories.map((category, index) => (
                  <Col md={3} key={index}>
                    <Card className="category-admin-card mb-3">
                      <Card.Body>
                        <div className="category-icon mb-2">
                          <i className="fas fa-tag"></i>
                        </div>
                        <Card.Title>{category}</Card.Title>
                        <div className="mt-3">
                          <Button 
                            variant="primary" 
                            size="sm" 
                            className="me-2"
                            onClick={() => handleEditCategory(category, index)}
                          >
                            <i className="fas fa-edit"></i>
                          </Button>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => deleteCategoryHandler(index)}
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
                <Col md={3}>
                  <Card 
                    className="category-admin-card mb-3 add-category"
                    onClick={handleAddCategory}
                  >
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center">
                      <div className="add-icon mb-2">
                        <i className="fas fa-plus-circle"></i>
                      </div>
                      <Card.Title>Nouvelle Catégorie</Card.Title>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal pour ajouter/modifier une catégorie */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editCategoryId !== null ? 'Modifier la catégorie' : 'Ajouter une catégorie'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nom de la catégorie</Form.Label>
              <Form.Control
                type="text"
                placeholder="Entrez le nom de la catégorie"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Icône</Form.Label>
              <div className="icon-selection">
                {availableIcons.map((icon, index) => (
                  <Button
                    key={index}
                    variant={categoryIcon === icon ? "primary" : "outline-secondary"}
                    className="icon-btn m-1"
                    onClick={() => setCategoryIcon(icon)}
                  >
                    <i className={`fas ${icon}`}></i>
                  </Button>
                ))}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCategoryModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={saveCategoryHandler}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AdminPage;
