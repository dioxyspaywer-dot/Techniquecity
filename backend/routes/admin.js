const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Travailleur = require('../models/Travailleur');
const Paiement = require('../models/Paiement');
const Message = require('../models/Message');
const auth = require('../middleware/auth');

router.get('/stats', auth, async (req, res) => {
  try {
    const [totalUtilisateurs, totalTravailleurs, travailleursPayes, totalMessages, revenusTotaux] = await Promise.all([
      User.countDocuments({ estActif: true }),
      Travailleur.countDocuments({ estActif: true }),
      Travailleur.countDocuments({ statutPaiement: 'paye', estActif: true }),
      Message.countDocuments(),
      Paiement.aggregate([{ $match: { statut: 'succes' } }, { $group: { _id: null, total: { $sum: '$montant' } } }])
    ]);
    const statsParMetier = await Travailleur.aggregate([{ $match: { estActif: true } }, { $group: { _id: '$metier', count: { $sum: 1 } } }, { $sort: { count: -1 } }]);
    const paiementsRecents = await Paiement.find().sort({ createdAt: -1 }).limit(10).populate('travailleur', 'nom prenom metier telephone');
    res.json({ totalUtilisateurs, totalTravailleurs, travailleursPayes, totalMessages, revenusTotaux: revenusTotaux[0]?.total || 0, statsParMetier, paiementsRecents });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/utilisateurs', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const utilisateurs = await User.find().select('-motDePasse').sort({ dateInscription: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await User.countDocuments();
    res.json({ utilisateurs, total, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/travailleurs', auth, async (req, res) => {
  try {
    const { statut, page = 1, limit = 20 } = req.query;
    const filtre = {};
    if (statut === 'paye') filtre.statutPaiement = 'paye';
    if (statut === 'en_attente') filtre.statutPaiement = 'en_attente';
    const travailleurs = await Travailleur.find(filtre).select('-motDePasse').sort({ dateInscription: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Travailleur.countDocuments(filtre);
    res.json({ travailleurs, total, page: parseInt(page) });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.put('/travailleurs/:id/valider', auth, async (req, res) => {
  try {
    const { valide } = req.body;
    const travailleur = await Travailleur.findByIdAndUpdate(req.params.id, { profilValide: valide }, { new: true });
    res.json({ message: 'Statut mis à jour', travailleur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.put('/compte/:id/desactiver', auth, async (req, res) => {
  try {
    const { type } = req.body;
    const Model = type === 'travailleur' ? Travailleur : User;
    const compte = await Model.findByIdAndUpdate(req.params.id, { estActif: false }, { new: true });
    res.json({ message: 'Compte désactivé', compte });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.put('/paiement/:id/confirmer', auth, async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id);
    if (!paiement) return res.status(404).json({ message: 'Paiement non trouvé' });
    paiement.statut = 'succes'; paiement.datePaiement = new Date(); await paiement.save();
    const travailleur = await Travailleur.findById(paiement.travailleur);
    if (travailleur) { travailleur.statutPaiement = 'paye'; travailleur.profilPublie = true; travailleur.datePaiement = new Date(); await travailleur.save(); }
    res.json({ message: 'Paiement confirmé', paiement, travailleur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
