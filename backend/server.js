const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://techniquecity.vercel.app"],
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB connecté'))
  .catch(err => console.error('❌ Erreur MongoDB:', err));

const authRoutes = require('./routes/auth');
const travailleurRoutes = require('./routes/travailleur');
const utilisateurRoutes = require('./routes/utilisateur');
const paiementRoutes = require('./routes/paiement');
const messageRoutes = require('./routes/messages');
const adminRoutes = require('./routes/admin');
const geolocalisationRoutes = require('./routes/geolocalisation');

app.use('/api/auth', authRoutes);
app.use('/api/travailleur', travailleurRoutes);
app.use('/api/utilisateur', utilisateurRoutes);
app.use('/api/paiement', paiementRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/geolocalisation', geolocalisationRoutes);

const usersOnline = new Map();

io.on('connection', (socket) => {
  console.log('🔌 Nouvel utilisateur connecté:', socket.id);

  socket.on('utilisateur_connecte', (userId) => {
    usersOnline.set(userId, socket.id);
  });

  socket.on('envoyer_message', async (data) => {
    try {
      const { expediteurId, destinataireId, contenu, typeExpediteur } = data;
      const Message = require('./models/Message');
      const typeDestinataire = typeExpediteur === 'User' ? 'Travailleur' : 'User';
      
      const message = new Message({
        expediteur: expediteurId,
        destinataire: destinataireId,
        contenu,
        typeExpediteur,
        typeDestinataire,
        dateEnvoi: new Date()
      });
      
      await message.save();

      const destinataireSocketId = usersOnline.get(destinataireId);
      if (destinataireSocketId) {
        io.to(destinataireSocketId).emit('nouveau_message', message);
      }
      socket.emit('message_envoye', message);
    } catch (error) {
      console.error('Erreur envoi message:', error);
      socket.emit('erreur_message', error.message);
    }
  });

  socket.on('deconnexion', () => {
    for (let [userId, socketId] of usersOnline.entries()) {
      if (socketId === socket.id) {
        usersOnline.delete(userId);
        break;
      }
    }
  });
});

app.get('/', (req, res) => {
  res.json({ message: 'API TechniqueCity opérationnelle', version: '1.0.0' });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Serveur TechniqueCity sur le port ${PORT}`);
});
