const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    address: {
      street: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    phoneNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Méthode pour vérifier si le mot de passe est correct
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Middleware pour hasher le mot de passe avant l'enregistrement
userSchema.pre('save', async function (next) {
  // Si le mot de passe n'a pas été modifié, on passe
  if (!this.isModified('password')) {
    next();
  }

  // Générer un sel (salt)
  const salt = await bcrypt.genSalt(10);
  // Hasher le mot de passe
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

module.exports = User;
