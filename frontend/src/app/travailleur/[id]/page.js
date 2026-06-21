'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { MapPin, Phone, MessageCircle, Award, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';

export default function TravailleurDetailPage() {
  const { id } = useParams(); const router = useRouter(); const { user } = useAuth();
  const [travailleur, setTravailleur] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { chargerTravailleur(); }, [id]);
  const chargerTravailleur = async () => { try { const r = await api.get(`/travailleur/${id}`); setTravailleur(r.data); } catch(e){toast.error('Impossible de charger');} finally{setLoading(false);} };
  const contacter = () => { if(!user){toast.info('Veuillez vous connecter');router.push('/connexion');return;} if(user.type==='travailleur'){toast.error('Seuls les utilisateurs peuvent contacter');return;} router.push(`/messages/${id}`); };
  if(loading) return <div className="min-h-screen"><Navbar/><div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></div>;
  if(!travailleur) return <div className="min-h-screen"><Navbar/><div className="text-center py-12"><p>Travailleur non trouvé</p></div></div>;
  return (
    <div className="min-h-screen"><Navbar/><div className="max-w-4xl mx-auto px-4 py-8"><div className="card">
      <div className="flex flex-col md:flex-row gap-6 mb-8"><div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center text-6xl">👷</div><div className="flex-1"><h1 className="text-3xl font-bold mb-2">{travailleur.prenom} {travailleur.nom}</h1><p className="text-xl text-primary-600 font-medium capitalize mb-2">{travailleur.metier}</p><div className="flex items-center text-gray-600 mb-2"><MapPin size={18} className="mr-2"/>{travailleur.quartier}, {travailleur.ville}, {travailleur.region}</div><div className="flex gap-4 text-sm">{travailleur.anneesExperience>0&&<div className="flex items-center"><Award size={16} className="mr-1"/>{travailleur.anneesExperience} ans d'expérience</div>}<div className="flex items-center"><Calendar size={16} className="mr-1"/>{new Date(travailleur.dateInscription).toLocaleDateString('fr-FR')}</div></div></div></div>
      <div className="flex gap-4 mb-6"><span className={`px-4 py-2 rounded-full text-sm font-medium ${travailleur.disponible?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{travailleur.disponible?'✓ Disponible':'✗ Indisponible'}</span>{travailleur.diplome&&travailleur.diplome!=='Aucun'&&<span className="px-4 py-2 rounded-full text-sm font-medium bg-blue-100 text-blue-800">🎓 {travailleur.diplome}</span>}</div>
      {travailleur.description&&<div className="mb-6"><h2 className="text-xl font-bold mb-3">À propos</h2><p className="text-gray-700 leading-relaxed">{travailleur.description}</p></div>}
      {travailleur.tarifs&&<div className="mb-6"><h2 className="text-xl font-bold mb-3">Tarifs</h2><p className="text-gray-700">{travailleur.tarifs}</p></div>}
      <div className="grid grid-cols-2 gap-4 mb-8 bg-gray-50 rounded-lg p-6"><div className="text-center"><div className="text-3xl font-bold text-primary-600">{travailleur.nombreVues}</div><div className="text-gray-600">Vues</div></div><div className="text-center"><div className="text-3xl font-bold text-primary-600">{travailleur.nombreContacts}</div><div className="text-gray-600">Contacts</div></div></div>
      <div className="flex flex-col sm:flex-row gap-4"><button onClick={contacter} className="btn-primary flex-1 flex items-center justify-center"><MessageCircle size={20} className="mr-2"/>Contacter par message</button><a href={`tel:${travailleur.telephone}`} className="btn-success flex-1 flex items-center justify-center"><Phone size={20} className="mr-2"/>Appeler : {travailleur.telephone}</a></div>
    </div></div></div>
  );
    }
