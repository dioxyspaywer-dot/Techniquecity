const express = require('express');
const router = express.Router();
const axios = require('axios');
const Travailleur = require('../models/Travailleur');
const Paiement = require('../models/Paiement');
const auth = require('../middleware/auth');

router.post('/initier', auth, async (req, res) => {
  try {
    const { methode, telephone } = req.body;
    const travailleur = await Travailleur.findById(req.user.id);
    if (!travailleur) return res.status(404).json({ message: 'Travailleur non trouvé' });
    if (travailleur.statutPaiement === 'paye') return res.status(400).json({ message: 'Profil déjà payé' });
    
    const montant = 250;
    const transactionId = `TC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const paiement = new Paiement({
      travailleur: travailleur._id, montant, methode,
      telephone: telephone || travailleur.telephone,
      transactionId, statut: 'en_attente',
      dateExpiration: new Date(Date.now() + 15 * 60 * 1000)
    });
    await paiement.save();
    
    try {
      const sendavaResponse = await axios.post(
        `${process.env.SENDAVAPAY_API_URL}/payment`,
        {
          amount: montant,
          currency: 'XOF',
          phone: paiement.telephone,
          operator: methode === 'mixx' ? 'moov' : 'togo_cell',
          reference: transactionId,
          description: `Publication profil TechniqueCity - ${travailleur.metier}`,
          callback_url: `${process.env.APP_URL}/api/paiement/callback`,
          redirect_url: 'https://techniquecity.vercel.app/travailleur/profil'
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.SENDAVAPAY_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      paiement.referenceExterne = sendavaResponse.data.transaction_id;
      await paiement.save();
      
      res.json({ success: true, message: 'Paiement initié. Vérifiez votre téléphone.', transactionId, data: sendavaResponse.data });
    } catch (apiError) {
      paiement.statut = 'echoue';
      paiement.messageErreur = apiError.response?.data?.message || 'Erreur API';
      await paiement.save();
      res.status(500).json({ message: 'Erreur lors de l\'initiation du paiement', error: apiError.response?.data || apiError.message });
    }
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.post('/callback', async (req, res) => {
  try {
    const { reference, status, transaction_id } = req.body;
    const paiement = await Paiement.findOne({ $or: [{ transactionId: reference }, { referenceExterne: transaction_id }] });
    if (!paiement) return res.status(404).json({ message: 'Paiement non trouvé' });
    
    if (status === 'success' || status === 'completed') {
      paiement.statut = 'succes';
      paiement.datePaiement = new Date();
      await paiement.save();
      
      const travailleur = await Travailleur.findById(paiement.travailleur);
      if (travailleur) {
        travailleur.statutPaiement = 'paye';
        travailleur.profilPublie = true;
        travailleur.datePaiement = new Date();
        travailleur.transactionId = paiement.transactionId;
        await travailleur.save();
      }
    } else {
      paiement.statut = 'echoue';
      paiement.messageErreur = `Statut: ${status}`;
      await paiement.save();
    }
    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

router.get('/statut/:transactionId', auth, async (req, res) => {
  try {
    const paiement = await Paiement.findOne({ transactionId: req.params.transactionId });
    if (!paiement) return res.status(404).json({ message: 'Paiement non trouvé' });
    res.json({ statut: paiement.statut, montant: paiement.montant, datePaiement: paiement.datePaiement, message: paiement.messageErreur });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

module.exports = router;
