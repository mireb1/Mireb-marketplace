# Mireb Marketplace

Une plateforme de commerce électronique moderne construite avec la stack MERN (MongoDB, Express, React, Node.js).

## Fonctionnalités

- Interface utilisateur responsive et moderne
- Système de catégories de produits
- Panier d'achat
- Système d'authentification (inscription, connexion)
- Panneau d'administration
- Upload d'images pour les produits
- Paiement à la livraison

## Technologies utilisées

- **Frontend**: React, React-Bootstrap, React Router
- **Backend**: Node.js, Express
- **Base de données**: MongoDB
- **Authentification**: JSON Web Tokens (JWT)

## Installation

1. Cloner le dépôt
   ```
   git clone https://github.com/mireb1/mireb-marketplace.git
   cd mireb-marketplace
   ```

2. Installer les dépendances pour le serveur
   ```
   npm install
   ```

3. Installer les dépendances pour le client
   ```
   cd client
   npm install
   ```

4. Créer un fichier .env à la racine avec les variables suivantes
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

5. Exécuter le projet en mode développement
   ```
   # À la racine du projet
   npm run dev
   ```

## Scripts disponibles

- `npm run dev` : Lance le serveur et le client en mode développement
- `npm run server` : Lance uniquement le serveur
- `npm run client` : Lance uniquement le client
- `npm run data:import` : Importe les données initiales dans la base de données
- `npm run data:destroy` : Supprime toutes les données de la base de données

## Auteur

- **Mireb** - [mireb1](https://github.com/mireb1)