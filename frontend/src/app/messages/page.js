'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import Link from 'next/link';
import { MessageCircle, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

export default function MessagesPage() {
  const { user } = useAuth(); const [conversations, setConversations] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { if(!user) return; chargerConversations(); const interval=setInterval(chargerConversations,10000); return ()=>clearInterval(interval); }, [user]);
  const chargerConversations = async () => { try{const r=await api.get('/messages/conversations');setConversations(r.data);}catch(e){console.error(e);}finally{setLoading(false);} };
  if(!user) return <div className="min-h-screen"><Navbar/><div className="text-center py-12"><p>Veuillez vous connecter</p></div></div>;
  return (
    <div className="min-h-screen"><Navbar/><div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 flex items-center"><MessageCircle className="mr-2" size={32}/>Mes messages</h1>
      {loading?(<div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div></div>):conversations.length===0?(<div className="card text-center py-12"><MessageCircle size={64} className="mx-auto text-gray-300 mb-4"/><p className="text-gray-600">Aucune conversation</p><Link href="/recherche" className="btn-primary mt-4 inline-block">Trouver un travailleur</Link></div>):(<div className="space-y-3">{conversations.map((c)=><Link key={c.contactId} href={`/messages/${c.contactId}`} className="card flex items-center hover:bg-gray-50"><div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center text-2xl mr-4">{c.contactType==='Travailleur'?'👷':'👤'}</div><div className="flex-1"><div className="flex justify-between items-start mb-1"><h3 className="font-bold">{c.contact?.prenom} {c.contact?.nom}</h3>{c.nombreNonLus>0&&<span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">{c.nombreNonLus}</span>}</div>{c.contact?.metier&&<p className="text-sm text-primary-600 capitalize mb-1">{c.contact.metier}</p>}<p className="text-gray-600 text-sm line-clamp-1">{c.dernierMessage.contenu}</p><div className="flex items-center text-xs text-gray-500 mt-1"><Clock size={12} className="mr-1"/>{formatDistanceToNow(new Date(c.dernierMessage.dateEnvoi),{addSuffix:true,locale:fr})}</div></div></Link>)}</div>)}
    </div></div>
  );
    }
