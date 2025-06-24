const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protection des routes privées
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Récupérer le token
      token = req.headers.authorization.split(' ')[1];

      // Vérifier le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur à partir du token
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Accès non autorisé. Token invalide." });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Accès non autorisé. Aucun token fourni." });
  }
};

// Vérifier si l'utilisateur est administrateur
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(403).json({ message: 'Accès refusé. Droits administrateur requis.' });
  }
};

module.exports = { protect, admin };
