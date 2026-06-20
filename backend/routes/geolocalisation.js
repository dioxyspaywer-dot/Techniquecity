const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Travailleur = require('../models/Travailleur');

router.get('/utilisateurs/proches', async (req, res) => {
  try {
    const { longitude, latitude, maxDistance = 10000, limit = 20 } = req.query;
    if (!longitude || !latitude) return res.status(400).json({ message: 'Coordonnées requises' });
    const utilisateurs = await User.find({
      localisation: { $near: { $geometry: { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)] }, $maxDistance: parseInt(maxDistance) } },
      'localisation.partagePosition': true, estActif: true
    }).select('-motDePasse').limit(parseInt(limit));
    res.json(utilisateurs);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/distance', async (req, res) => {
  try {
    const { travailleurId, utilisateurId } = req.query;
    const travailleur = await Travailleur.findById(travailleurId);
    const utilisateur = await User.findById(utilisateurId);
    if (!travailleur || !utilisateur) return res.status(404).json({ message: 'Profil non trouvé' });
    const [travLon, travLat] = travailleur.localisation.coordinates;
    const [userLon, userLat] = utilisateur.localisation.coordinates;
    const R = 6371;
    const dLat = (userLat - travLat) * Math.PI / 180;
    const dLon = (userLon - travLon) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(travLat * Math.PI / 180) * Math.cos(userLat * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    res.json({ distance: (R * c).toFixed(2), unite: 'km' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
