const express = require('express');
const router = express.Router();
const Travailleur = require('../models/Travailleur');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/candidature', auth, async (req, res) => {
  try {
    const { anneesExperience, diplome, description, tarifs } = req.body;
    const travailleur = await Travailleur.findById(req.user.id);
    if (!travailleur) return res.status(404).json({ message: 'Travailleur non trouvé' });
    
    travailleur.anneesExperience = anneesExperience || 0;
    travailleur.diplome = diplome || 'Aucun';
    travailleur.description = description || '';
    travailleur.tarifs = tarifs || '';
    await travailleur.save();
    
    res.json({ message: 'Profil mis à jour. Procédez au paiement.', travailleur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.post('/upload-photo', auth, upload.single('photo'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Aucune photo fournie' });
    const travailleur = await Travailleur.findById(req.user.id);
    travailleur.photo = `/uploads/${req.file.filename}`;
    await travailleur.save();
    res.json({ message: 'Photo uploadée', photoUrl: travailleur.photo });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/profil', auth, async (req, res) => {
  try {
    const travailleur = await Travailleur.findById(req.user.id).select('-motDePasse');
    if (!travailleur) return res.status(404).json({ message: 'Profil non trouvé' });
    res.json(travailleur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.put('/profil', auth, async (req, res) => {
  try {
    const updates = req.body;
    delete updates.motDePasse; delete updates.statutPaiement; delete updates.profilPublie;
    const travailleur = await Travailleur.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true }).select('-motDePasse');
    res.json({ message: 'Profil mis à jour', travailleur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/liste', async (req, res) => {
  try {
    const { metier, ville, region, page = 1, limit = 20 } = req.query;
    const filtre = { profilPublie: true, profilValide: true, statutPaiement: 'paye', estActif: true, disponible: true };
    if (metier) filtre.metier = metier;
    if (ville) filtre.ville = new RegExp(ville, 'i');
    if (region) filtre.region = new RegExp(region, 'i');
    
    const travailleurs = await Travailleur.find(filtre).select('-motDePasse').sort({ dateInscription: -1 }).skip((page - 1) * limit).limit(parseInt(limit));
    const total = await Travailleur.countDocuments(filtre);
    res.json({ travailleurs, total, page: parseInt(page), totalPages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const travailleur = await Travailleur.findById(req.params.id).select('-motDePasse');
    if (!travailleur) return res.status(404).json({ message: 'Travailleur non trouvé' });
    travailleur.nombreVues += 1;
    await travailleur.save();
    res.json(travailleur);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.put('/disponibilite', auth, async (req, res) => {
  try {
    const { disponible } = req.body;
    const travailleur = await Travailleur.findByIdAndUpdate(req.user.id, { disponible }, { new: true });
    res.json({ message: 'Disponibilité mise à jour', travailleur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
