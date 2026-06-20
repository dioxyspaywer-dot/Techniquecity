const mongoose = require('mongoose');

const travailleurSchema = new mongoose.Schema({
  nom: { type: String, required: true, trim: true },
  prenom: { type: String, required: true, trim: true },
  age: { type: Number, required: true, min: 16, max: 100 },
  metier: { 
    type: String, required: true,
    enum: ['électricien', 'maçon', 'soudeur', 'mécanicien', 'coiffeur', 'menuisier', 'couturier', 'ferrailleur', 'staffeur']
  },
  telephone: { type: String, required: true, unique: true, match: /^[0-9]{8,15}$/ },
  motDePasse: { type: String, required: true },
  region: { type: String, required: true },
  ville: { type: String, required: true },
  quartier: { type: String, required: true },
  anneesExperience: { type: Number, default: 0, min: 0, max: 50 },
  diplome: { type: String, enum: ['CFA', 'CAP', 'BT', 'BAC PRO', 'BTS', 'CQP', 'BEP', 'Aucun', 'Autre'], default: 'Aucun' },
  description: { type: String, maxlength: 500, default: '' },
  tarifs: { type: String, default: '' },
  photo: { type: String, default: '' },
  galeriePhotos: [{ type: String }],
  statutPaiement: { type: String, default: 'non_paye', enum: ['non_paye', 'en_attente', 'paye', 'expire'] },
  montantPaiement: { type: Number, default: 250 },
  datePaiement: { type: Date },
  transactionId: { type: String },
  profilPublie: { type: Boolean, default: false },
  profilValide: { type: Boolean, default: true },
  nombreVues: { type: Number, default: 0 },
  nombreContacts: { type: Number, default: 0 },
  localisation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [1.2255, 6.1375] }
  },
  disponible: { type: Boolean, default: true },
  horairesTravail: {
    debut: { type: String, default: '08:00' },
    fin: { type: String, default: '18:00' },
    jours: { type: [String], default: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'] }
  },
  estActif: { type: Boolean, default: true },
  dateInscription: { type: Date, default: Date.now },
  derniereConnexion: { type: Date, default: Date.now }
}, { timestamps: true });

travailleurSchema.index({ localisation: '2dsphere' });
travailleurSchema.index({ metier: 1, ville: 1 });
travailleurSchema.index({ profilPublie: 1, statutPaiement: 1 });
module.exports = mongoose.model('Travailleur', travailleurSchema);
