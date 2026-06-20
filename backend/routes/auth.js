const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Travailleur = require('../models/Travailleur');

router.post('/inscription/utilisateur', async (req, res) => {
  try {
    const { nom, prenom, telephone, motDePasse, ville, quartier } = req.body;
    if (!nom || !prenom || !telephone || !motDePasse || !ville || !quartier)
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    
    const existe = await User.findOne({ telephone });
    if (existe) return res.status(400).json({ message: 'Ce numéro est déjà enregistré' });
    
    const salt = await bcrypt.genSalt(10);
    const motDePasseHash = await bcrypt.hash(motDePasse, salt);
    
    const user = new User({ nom, prenom, telephone, motDePasse: motDePasseHash, ville, quartier });
    await user.save();
    
    const token = jwt.sign({ id: user._id, type: 'utilisateur' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    res.status(201).json({
      message: 'Inscription réussie', token,
      user: { id: user._id, nom: user.nom, prenom: user.prenom, telephone: user.telephone, ville: user.ville, quartier: user.quartier, type: 'utilisateur' }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.post('/inscription/travailleur', async (req, res) => {
  try {
    const { nom, prenom, age, metier, telephone, motDePasse, region, ville, quartier } = req.body;
    if (!nom || !prenom || !age || !metier || !telephone || !motDePasse || !region || !ville || !quartier)
      return res.status(400).json({ message: 'Tous les champs sont obligatoires' });
    
    const existe = await Travailleur.findOne({ telephone });
    if (existe) return res.status(400).json({ message: 'Ce numéro est déjà enregistré' });
    
    const salt = await bcrypt.genSalt(10);
    const motDePasseHash = await bcrypt.hash(motDePasse, salt);
    
    const travailleur = new Travailleur({ nom, prenom, age, metier, telephone, motDePasse: motDePasseHash, region, ville, quartier });
    await travailleur.save();
    
    const token = jwt.sign({ id: travailleur._id, type: 'travailleur' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    res.status(201).json({
      message: 'Inscription réussie. Complétez votre profil.', token,
      travailleur: { id: travailleur._id, nom: travailleur.nom, prenom: travailleur.prenom, metier: travailleur.metier, telephone: travailleur.telephone, statutPaiement: travailleur.statutPaiement }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.post('/connexion', async (req, res) => {
  try {
    const { telephone, motDePasse, type } = req.body;
    if (!telephone || !motDePasse) return res.status(400).json({ message: 'Téléphone et mot de passe requis' });
    
    const Model = type === 'travailleur' ? Travailleur : User;
    const compte = await Model.findOne({ telephone });
    if (!compte) return res.status(404).json({ message: 'Aucun compte trouvé' });
    if (!compte.estActif) return res.status(403).json({ message: 'Compte désactivé' });
    
    const motDePasseValide = await bcrypt.compare(motDePasse, compte.motDePasse);
    if (!motDePasseValide) return res.status(401).json({ message: 'Mot de passe incorrect' });
    
    compte.derniereConnexion = new Date();
    await compte.save();
    
    const token = jwt.sign({ id: compte._id, type: type || 'utilisateur' }, process.env.JWT_SECRET, { expiresIn: '30d' });
    
    const reponse = { message: 'Connexion réussie', token, user: { id: compte._id, nom: compte.nom, prenom: compte.prenom, telephone: compte.telephone, type: type || 'utilisateur' } };
    if (type === 'travailleur') { reponse.user.statutPaiement = compte.statutPaiement; reponse.user.profilPublie = compte.profilPublie; }
    
    res.json(reponse);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/verifier-token', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ valide: false, message: 'Token manquant' });
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const Model = decoded.type === 'travailleur' ? Travailleur : User;
    const compte = await Model.findById(decoded.id).select('-motDePasse');
    if (!compte) return res.status(404).json({ valide: false, message: 'Compte non trouvé' });
    
    res.json({ valide: true, user: compte, type: decoded.type });
  } catch (error) {
    res.status(401).json({ valide: false, message: 'Token invalide' });
  }
});

module.exports = router;
