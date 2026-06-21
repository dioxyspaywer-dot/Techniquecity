'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import io from 'socket.io-client';
import { Send, ArrowLeft, MapPin, Navigation } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000';

export default function ConversationPage() {
  const { contactId } = useParams(); const router = useRouter(); const { user } = useAuth();
  const [messages, setMessages] = useState([]); const [nouveauMessage, setNouveauMessage] = useState('');
  const [contact, setContact] = useState(null); const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false); const [socket, setSocket] = useState(null);
  const [positionUtilisateur, setPositionUtilisateur] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => { if(!user) return; const s=io(SOCKET_URL); setSocket(s); s.emit('utilisateur_connecte',user.id); s.on('nouveau_message',(msg)=>{if((msg.expediteur===contactId&&msg.destinataire===user.id)||(msg.expediteur===user.id&&msg.destinataire===contactId))setMessages(prev=>[...prev,msg]);}); s.on('message_envoye',()=>setSending(false)); chargerMessages(); chargerContact(); return ()=>s.close(); }, [user,contactId]);
  useEffect(() => { messagesEndRef.current?.scrollIntoView({behavior:'smooth'}); }, [messages]);
  const chargerMessages = async () => { try{const r=await api.get(`/messages/conversation/${contactId}`);setMessages(r.data.messages);}catch(e){console.error(e);}finally{setLoading(false);} };
  const chargerContact = async () => { try{const r=await api.get(`/travailleur/${contactId}`);setContact(r.data);}catch(e){try{const r2=await api.get(`/utilisateur/${contactId}`);setContact(r2.data);}catch(err){console.error(err);}} };
  const voirPositionUtilisateur = async () => { if(user.type!=='travailleur'){toast.error('Seuls les travailleurs peuvent voir la position');return;} try{const r=await api.get(`/utilisateur/${contactId}/localisation`);setPositionUtilisateur(r.data);toast.success('Position obtenue !');}catch(e){toast.error(e.response?.data?.message||'Position non disponible');} };
  const ouvrirNavigation = () => { if(positionUtilisateur){const[lon,lat]=positionUtilisateur.localisation.coordinates;window.open(`https://www.google.com/maps/dir/${lat},${lon}`,'_blank');} };
  const envoyerMessage = async (e) => { e.preventDefault(); if(!nouveauMessage.trim()||!socket) return; setSending(true); setMessages(prev=>[...prev,{expediteur:user.id,destinataire:contactId,contenu:nouveauMessage,typeExpediteur:user.type==='travailleur'?'Travailleur':'User',dateEnvoi:new Date()}]); setNouveauMessage(''); socket.emit('envoyer_message',{expediteurId:user.id,destinataireId:contactId,contenu:nouveauMessage,typeExpediteur:user.type==='travailleur'?'Travailleur':'User'}); };
  if(!user) return <div className="min-h-screen"><Navbar/><div className="text-center py-12">Connectez-vous</div></div>;
  return (
    <div className="min-h-screen flex flex-col"><Navbar/>
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between"><div className="flex items-center"><button onClick={()=>router.push('/messages')} className="mr-3"><ArrowLeft size={24}/></button><div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center text-xl mr-3">{contact?.type==='travailleur'?'👷':'👤'}</div><div><h2 className="font-bold">{contact?.prenom} {contact?.nom}</h2>{contact?.metier&&<p className="text-sm text-gray-600 capitalize">{contact.metier}</p>}</div></div>{user.type==='travailleur'&&<button onClick={voirPositionUtilisateur} className="btn-secondary flex items-center gap-2"><MapPin size={18}/>Position</button>}</div>
      {positionUtilisateur&&<div className="bg-green-50 border-b p-4"><div className="flex items-center justify-between"><div><h3 className="font-bold text-green-900 mb-1">Position de l'utilisateur</h3><p className="text-sm text-green-800">{positionUtilisateur.quartier}, {positionUtilisateur.ville}</p>{positionUtilisateur.localisation.adresse&&<p className="text-sm text-green-700 mt-1">📍 {positionUtilisateur.localisation.adresse}</p>}</div><button onClick={ouvrirNavigation} className="btn-primary flex items-center gap-2"><Navigation size={18}/>Itinéraire</button></div></div>}
      <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-3" style={{height:'calc(100vh - 180px)'}}>{loading?(<div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div>):messages.length===0?(<div className="text-center py-12 text-gray-500">Commencez la conversation !</div>):(<>{messages.map((msg,idx)=>{const estMien=msg.expediteur===user.id||msg.expediteur?._id===user.id;return(<div key={idx} className={`flex ${estMien?'justify-end':'justify-start'}`}><div className={`max-w-xs md:max-w-md px-4 py-2 rounded-2xl ${estMien?'bg-primary-600 text-white rounded-br-none':'bg-white border rounded-bl-none'}`}><p className="break-words">{msg.contenu}</p><p className={`text-xs mt-1 ${estMien?'text-primary-100':'text-gray-500'}`}>{msg.dateEnvoi?format(new Date(msg.dateEnvoi),'HH:mm'):'...'}</p></div></div>);})}<div ref={messagesEndRef}/></>)}</div>
      <form onSubmit={envoyerMessage} className="bg-white border-t p-4 flex gap-2"><input type="text" value={nouveauMessage} onChange={(e)=>setNouveauMessage(e.target.value)} placeholder="Écrivez un message..." className="flex-1 input-field" disabled={sending}/><button type="submit" disabled={!nouveauMessage.trim()||sending} className="btn-primary px-6"><Send size={20}/></button></form>
    </div>
  );
}
