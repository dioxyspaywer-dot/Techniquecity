'use client';
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { MapPin, Filter } from 'lucide-react';
import api from '@/utils/api';

export default function RecherchePage() {
  const [travailleurs, setTravailleurs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtres, setFiltres] = useState({ metier:'',ville:'',region:'' });
  const [total, setTotal] = useState(0);
  useEffect(() => { chargerTravailleurs(); }, [filtres]);
  const chargerTravailleurs = async () => { setLoading(true); try { const params = new URLSearchParams(); if(filtres.metier) params.append('metier',filtres.metier); if(filtres.ville) params.append('ville',filtres.ville); if(filtres.region) params.append('region',filtres.region); const response = await api.get(`/travailleur/liste?${params}`); setTravailleurs(response.data.travailleurs); setTotal(response.data.total); } catch(error){console.error(error);} finally{setLoading(false);} };
  const metiers = ['électricien','maçon','soudeur','mécanicien','coiffeur','menuisier','couturier','ferrailleur','staffeur'];
  return (
    <div className="min-h-screen"><Navbar/><div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Rechercher un travailleur</h1>
      <div className="card mb-8"><div className="grid md:grid-cols-4 gap-4"><div><label className="block text-sm font-medium mb-2">Métier</label><select value={filtres.metier} onChange={(e)=>setFiltres({...filtres,metier:e.target.value})} className="input-field"><option value="">Tous les métiers</option>{metiers.map(m=><option key={m} value={m}>{m.charAt(0).toUpperCase()+m.slice(1)}</option>)}</select></div><div><label className="block text-sm font-medium mb-2">Ville</label><input type="text" value={filtres.ville} onChange={(e)=>setFiltres({...filtres,ville:e.target.value})} className="input-field" placeholder="Ex: Lomé"/></div><div><label className="block text-sm font-medium mb-2">Région</label><input type="text" value={filtres.region} onChange={(e)=>setFiltres({...filtres,region:e.target.value})} className="input-field" placeholder="Ex: Maritime"/></div><div className="flex items-end"><button onClick={()=>setFiltres({metier:'',ville:'',region:''})} className="btn-secondary w-full"><Filter size={18} className="inline mr-2"/>Réinitialiser</button></div></div></div>
      {loading?(<div className="text-center py-12"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div><p className="mt-4 text-gray-600">Chargement...</p></div>):travailleurs.length===0?(<div className="text-center py-12"><p className="text-gray-600">Aucun travailleur trouvé</p></div>):(<><p className="mb-4 text-gray-600">{total} travailleur(s) trouvé(s)</p><div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">{travailleurs.map((t)=><Link key={t._id} href={`/travailleur/${t._id}`} className="card hover:scale-105 transition-transform"><div className="flex items-start mb-4"><div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center text-3xl mr-4">👷</div><div className="flex-1"><h3 className="text-xl font-bold">{t.prenom} {t.nom}</h3><p className="text-primary-600 font-medium capitalize">{t.metier}</p><div className="flex items-center text-sm text-gray-600 mt-1"><MapPin size={14} className="mr-1"/>{t.ville}, {t.quartier}</div></div></div>{t.anneesExperience>0&&<p className="text-sm text-gray-600 mb-2">🎯 {t.anneesExperience} ans d'expérience</p>}{t.description&&<p className="text-gray-600 text-sm mb-4 line-clamp-2">{t.description}</p>}<div className="flex justify-between items-center pt-4 border-t"><span className="text-sm text-gray-500">👁️ {t.nombreVues} vues</span><span className="btn-primary text-sm">Voir profil</span></div></Link>)}</div></>)}
    </div></div>
  );
    }
