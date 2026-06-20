const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');

router.get('/profil', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-motDePasse');
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.put('/localisation', auth, async (req, res) => {
  try {
    const { longitude, latitude, adresse, partagePosition } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    
    if (longitude && latitude) user.localisation.coordinates = [parseFloat(longitude), parseFloat(latitude)];
    if (adresse !== undefined) user.localisation.adresse = adresse;
    if (partagePosition !== undefined) user.localisation.partagePosition = partagePosition;
    await user.save();
    
    res.json({ message: 'Position mise à jour', localisation: user.localisation });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.put('/profil', auth, async (req, res) => {
  try {
    const { nom, prenom, ville, quartier } = req.body;
    const user = await User.findByIdAndUpdate(req.user.id, { nom, prenom, ville, quartier }, { new: true, runValidators: true }).select('-motDePasse');
    res.json({ message: 'Profil mis à jour', user });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/:id/localisation', auth, async (req, res) => {
  try {
    if (req.user.type !== 'travailleur') return res.status(403).json({ message: 'Accès réservé aux travailleurs' });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'Utilisateur non trouvé' });
    if (!user.localisation.partagePosition) return res.status(403).json({ message: 'Cet utilisateur ne partage pas sa position' });
    
    res.json({ localisation: user.localisation, ville: user.ville, quartier: user.quartier, telephone: user.telephone });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
