const mongoose = require('mongoose');

const paiementSchema = new mongoose.Schema({
  travailleur: { type: mongoose.Schema.Types.ObjectId, ref: 'Travailleur', required: true },
  montant: { type: Number, required: true, default: 250 },
  methode: { type: String, required: true, enum: ['mixx', 'flooz'] },
  telephone: { type: String, required: true },
  statut: { type: String, default: 'en_attente', enum: ['en_attente', 'succes', 'echoue', 'rembourse'] },
  transactionId: { type: String, unique: true },
  referenceExterne: { type: String },
  messageErreur: { type: String },
  datePaiement: { type: Date },
  dateExpiration: { type: Date }
}, { timestamps: true });

paiementSchema.index({ travailleur: 1, datePaiement: -1 });
module.exports = mongoose.model('Paiement', paiementSchema);
