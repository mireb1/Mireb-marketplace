const path = require('path');
const fs = require('fs');

// @desc    Upload une image
// @route   POST /api/upload
// @access  Private/Admin
const uploadImage = async (req, res) => {
  try {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({ message: 'Aucun fichier n\'a été téléchargé' });
    }

    const file = req.files.image;
    const uploadPath = path.join(__dirname, '../uploads', file.name);

    // Vérifier le type de fichier (uniquement les images)
    if (!file.mimetype.startsWith('image')) {
      return res.status(400).json({ message: 'Veuillez télécharger une image' });
    }

    // Vérifier la taille du fichier (max 3MB)
    if (file.size > 3000000) {
      return res.status(400).json({ message: 'L\'image doit être inférieure à 3 Mo' });
    }

    // Créer un nom de fichier unique basé sur la date
    const fileName = `${Date.now()}-${file.name}`;
    const newUploadPath = path.join(__dirname, '../uploads', fileName);

    // Déplacer le fichier vers le dossier uploads
    file.mv(newUploadPath, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Erreur lors du téléchargement du fichier' });
      }

      res.json({
        message: 'Fichier téléchargé avec succès',
        image: `/uploads/${fileName}`,
      });
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du téléchargement de l\'image' });
  }
};

module.exports = { uploadImage };
