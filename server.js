const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const connectDB = require('./server/config/db');

// Charger les variables d'environnement
dotenv.config();

// Connexion à la base de données
connectDB();

// Routes
const authRoutes = require('./server/routes/auth');
const productRoutes = require('./server/routes/products');
const orderRoutes = require('./server/routes/orders');
const uploadRoutes = require('./server/routes/uploads');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({
  limits: { fileSize: 3 * 1024 * 1024 }, // limite de 3MB
  createParentPath: true,
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

// Définir les routes API
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/upload', uploadRoutes);

// Rendre le dossier 'uploads' accessible publiquement
app.use('/uploads', express.static(path.join(__dirname, '/server/uploads')));

// En production, servir les fichiers statiques de React
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/build')));

  app.get('*', (req, res) =>
    res.sendFile(path.resolve(__dirname, '/client/build/index.html'))
  );
}

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: 'Erreur serveur' });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Serveur démarré en mode ${process.env.NODE_ENV} sur le port ${PORT}`);
});