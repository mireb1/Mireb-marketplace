const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`MongoDB connecté: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`Erreur de connexion MongoDB: ${error.message}`);
    console.log('Application démarrée sans connexion à MongoDB - certaines fonctionnalités peuvent ne pas fonctionner');
    return false;
  }
};

module.exports = connectDB;
