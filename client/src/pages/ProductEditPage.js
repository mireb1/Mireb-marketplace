import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const ProductEditPage = () => {
  const { id } = useParams(); // Si id existe, c'est une modification, sinon une création
  const isEditMode = !!id;
  
  const { userInfo } = useContext(AuthContext);
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('');
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState(null);
  const [previewImage, setPreviewImage] = useState('');

  const [categories, setCategories] = useState([
    'Électronique', 
    'Informatique', 
    'Électroménager', 
    'Mode', 
    'Maison', 
    'Sport', 
    'Jouets', 
    'Auto'
  ]);

  useEffect(() => {
    // Vérifier si l'utilisateur est admin
    if (!userInfo || !userInfo.isAdmin) {
      navigate('/login');
      return;
    }

    if (isEditMode) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(`/api/products/${id}`, {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          });

          setName(data.name);
          setPrice(data.price);
          setImage(data.image);
          setPreviewImage(data.image);
          setBrand(data.brand || '');
          setCategory(data.category);
          setCountInStock(data.countInStock);
          setDescription(data.description);
          setLoading(false);
        } catch (err) {
          setError('Erreur lors du chargement des données du produit.');
          setLoading(false);
        }
      };

      fetchProduct();
    }
  }, [id, isEditMode, userInfo, navigate]);

  // Gérer l'upload d'image
  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    
    // Créer un aperçu de l'image
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Envoyer l'image au serveur
  const uploadImage = async () => {
    if (!imageFile) return null;
    
    const formData = new FormData();
    formData.append('image', imageFile);
    
    try {
      setUploadLoading(true);
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const { data } = await axios.post('/api/upload', formData, config);
      
      setUploadLoading(false);
      return data;
    } catch (err) {
      setError('Erreur lors de l\'upload de l\'image');
      setUploadLoading(false);
      return null;
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      
      let productImage = image;
      
      // Si une nouvelle image a été sélectionnée, l'uploader
      if (imageFile) {
        const uploadResult = await uploadImage();
        if (uploadResult) {
          productImage = uploadResult.image;
        } else {
          setLoading(false);
          return;
        }
      }
      
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      
      const productData = {
        name,
        price,
        image: productImage,
        brand,
        category,
        countInStock,
        description,
      };
      
      if (isEditMode) {
        // Mise à jour d'un produit existant
        await axios.put(`/api/products/${id}`, productData, config);
      } else {
        // Création d'un nouveau produit
        await axios.post('/api/products', productData, config);
      }
      
      setLoading(false);
      navigate('/admin');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        `Erreur lors de la ${isEditMode ? 'modification' : 'création'} du produit.`
      );
      setLoading(false);
    }
  };

  return (
    <Container className='py-3'>
      <Link to='/admin' className='btn btn-light my-3'>
        Retour
      </Link>
      
      <Row className="justify-content-md-center">
        <Col md={8}>
          <Card className="p-4 shadow-sm">
            <h1 className='text-center mb-4'>
              {isEditMode ? 'Modifier le Produit' : 'Créer un Nouveau Produit'}
            </h1>
            
            {error && <Alert variant='danger'>{error}</Alert>}
            {loading && <p className='text-center'>Chargement...</p>}
            
            <Form onSubmit={submitHandler}>
              <Form.Group controlId='name' className='mb-3'>
                <Form.Label>Nom</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Entrez le nom'
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId='price' className='mb-3'>
                <Form.Label>Prix (€)</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Entrez le prix'
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId='image' className='mb-3'>
                <Form.Label>Image</Form.Label>
                <div className="d-flex align-items-center mb-2">
                  <Form.Control
                    type='file'
                    onChange={uploadFileHandler}
                    accept="image/*"
                    className="me-2"
                  />
                  {uploadLoading && <span>Chargement...</span>}
                </div>
                {previewImage && (
                  <div className="image-preview mt-2 text-center">
                    <img
                      src={previewImage}
                      alt="Aperçu"
                      style={{ maxWidth: '200px', maxHeight: '200px' }}
                      className="img-thumbnail"
                    />
                  </div>
                )}
              </Form.Group>

              <Form.Group controlId='brand' className='mb-3'>
                <Form.Label>Marque</Form.Label>
                <Form.Control
                  type='text'
                  placeholder='Entrez la marque'
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </Form.Group>

              <Form.Group controlId='category' className='mb-3'>
                <Form.Label>Catégorie</Form.Label>
                <Form.Select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat, index) => (
                    <option key={index} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId='countInStock' className='mb-3'>
                <Form.Label>Stock</Form.Label>
                <Form.Control
                  type='number'
                  placeholder='Entrez le stock disponible'
                  value={countInStock}
                  onChange={(e) => setCountInStock(e.target.value)}
                  required
                />
              </Form.Group>

              <Form.Group controlId='description' className='mb-3'>
                <Form.Label>Description</Form.Label>
                <Form.Control
                  as='textarea'
                  rows={4}
                  placeholder='Entrez la description'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2 mt-4">
                <Button type='submit' variant='primary' disabled={loading}>
                  {loading ? 'Chargement...' : isEditMode ? 'Mettre à jour' : 'Créer'}
                </Button>
              </div>
            </Form>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ProductEditPage;
