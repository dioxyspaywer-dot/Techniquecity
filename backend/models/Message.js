const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  expediteur: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'typeExpediteur' },
  destinataire: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'typeDestinataire' },
  typeExpediteur: { type: String, required: true, enum: ['User', 'Travailleur'] },
  typeDestinataire: { type: String, required: true, enum: ['User', 'Travailleur'] },
  contenu: { type: String, required: true, maxlength: 2000 },
  lu: { type: Boolean, default: false },
  dateEnvoi: { type: Date, default: Date.now },
  dateLecture: { type: Date }
}, { timestamps: true });

messageSchema.index({ expediteur: 1, destinataire: 1, dateEnvoi: -1 });
messageSchema.index({ destinataire: 1, lu: 1 });
module.exports = mongoose.model('Message', messageSchema);
