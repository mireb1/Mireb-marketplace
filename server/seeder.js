const mongoose = require('mongoose');
const dotenv = require('dotenv');
const users = require('./data/users');
const products = require('./data/products');
const User = require('./models/User');
const Product = require('./models/Product');
const Order = require('./models/Order');
const connectDB = require('./config/db');

// Charger les variables d'environnement
dotenv.config();

// Connexion à MongoDB
connectDB();

// Fonction pour importer les données
const importData = async () => {
  try {
    // Nettoyer la base de données
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    // Créer les utilisateurs
    const createdUsers = await User.insertMany(users);
    
    // Récupérer l'ID de l'admin
    const adminUser = createdUsers[0]._id;

    // Ajouter l'adminUser aux produits
    const sampleProducts = products.map((product) => {
      return { ...product, user: adminUser };
    });

    // Créer les produits
    await Product.insertMany(sampleProducts);

    console.log('Données importées avec succès!');
    process.exit();
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    process.exit(1);
  }
};

// Fonction pour supprimer les données
const destroyData = async () => {
  try {
    // Nettoyer la base de données
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();

    console.log('Données supprimées!');
    process.exit();
  } catch (error) {
    console.error(`Erreur: ${error.message}`);
    process.exit(1);
  }
};

// Déterminer l'action à partir des arguments
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
};
