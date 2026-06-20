const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  telephone: { type: String, required: true, unique: true, match: /^[0-9]{8,15}$/ },
  motDePasse: { type: String, required: true },
  ville: { type: String, required: true },
  quartier: { type: String, required: true },
  type: { type: String, default: 'utilisateur', enum: ['utilisateur', 'admin'] },
  photo: { type: String, default: '' },
  localisation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [1.2255, 6.1375] },
    adresse: { type: String, default: '' },
    partagePosition: { type: Boolean, default: false }
  },
  estActif: { type: Boolean, default: true },
  dateInscription: { type: Date, default: Date.now },
  derniereConnexion: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.index({ localisation: '2dsphere' });
module.exports = mongoose.model('User', userSchema);
