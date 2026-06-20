const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Message = require('../models/Message');
const User = require('../models/User');
const Travailleur = require('../models/Travailleur');
const auth = require('../middleware/auth');

router.post('/envoyer', auth, async (req, res) => {
  try {
    const { destinataireId, contenu, typeDestinataire } = req.body;
    if (!contenu || contenu.trim().length === 0) return res.status(400).json({ message: 'Message vide' });
    const message = new Message({
      expediteur: req.user.id, destinataire: destinataireId, contenu: contenu.trim(),
      typeExpediteur: req.user.type === 'travailleur' ? 'Travailleur' : 'User', typeDestinataire
    });
    await message.save();
    res.status(201).json({ message: 'Message envoyé', data: message });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user.id);
    const conversations = await Message.aggregate([
      { $match: { $or: [{ expediteur: userId }, { destinataire: userId }] } },
      { $group: {
          _id: { $cond: [{ $eq: ['$expediteur', userId] }, '$destinataire', '$expediteur'] },
          dernierMessage: { $last: '$$ROOT' },
          nombreNonLus: { $sum: { $cond: [{ $and: [{ $eq: ['$destinataire', userId] }, { $eq: ['$lu', false] }] }, 1, 0] } }
      }},
      { $sort: { 'dernierMessage.dateEnvoi': -1 } }
    ]);
    
    const conversationsEnrichies = await Promise.all(conversations.map(async (conv) => {
      const contactId = conv._id;
      const contactType = conv.dernierMessage.typeExpediteur === 'User' ? 'Travailleur' : 'User';
      const Model = contactType === 'Travailleur' ? Travailleur : User;
      const contact = await Model.findById(contactId).select('nom prenom telephone photo metier');
      return { contactId, contactType, contact, dernierMessage: conv.dernierMessage, nombreNonLus: conv.nombreNonLus };
    }));
    res.json(conversationsEnrichies);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/conversation/:contactId', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const contactId = req.params.contactId;
    const messages = await Message.find({
      $or: [{ expediteur: userId, destinataire: contactId }, { expediteur: contactId, destinataire: userId }]
    }).sort({ dateEnvoi: -1 }).populate('expediteur', 'nom prenom photo').populate('destinataire', 'nom prenom photo');
    
    await Message.updateMany({ expediteur: contactId, destinataire: userId, lu: false }, { lu: true, dateLecture: new Date() });
    res.json({ messages: messages.reverse(), total: messages.length });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/non-lus', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({ destinataire: req.user.id, lu: false });
    res.json({ nombreNonLus: count });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
