'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { toast } from 'react-toastify';
import { MapPin, Navigation, Save } from 'lucide-react';

export default function LocalisationPage() {
  const router = useRouter(); const { user } = useAuth();
  const [position, setPosition] = useState({latitude:null,longitude:null});
  const [adresse, setAdresse] = useState(''); const [partagePosition, setPartagePosition] = useState(false); const [loading, setLoading] = useState(false);
  useEffect(() => { if(!user||user.type!=='utilisateur'){router.push('/connexion');return;} obtenirPositionActuelle(); }, [user]);
  const obtenirPositionActuelle = () => { if(navigator.geolocation) navigator.geolocation.getCurrentPosition((pos)=>setPosition({latitude:pos.coords.latitude,longitude:pos.coords.longitude}),()=>toast.error('Impossible d\'obtenir votre position')); else toast.error('Géolocalisation non supportée'); };
  const sauvegarderPosition = async () => { if(!position.latitude||!position.longitude){toast.error('Activez la géolocalisation');return;} setLoading(true); try{await api.put('/utilisateur/localisation',{longitude:position.longitude,latitude:position.latitude,adresse,partagePosition});toast.success('Position enregistrée !');router.push('/');}catch(e){toast.error('Erreur');}finally{setLoading(false);} };
  return (
    <div className="min-h-screen"><Navbar/><div className="max-w-2xl mx-auto px-4 py-8"><div className="card">
      <h1 className="text-3xl font-bold mb-6 flex items-center"><MapPin className="mr-2" size={32}/>Ma localisation</h1>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6"><h3 className="font-bold text-blue-900 mb-2">Pourquoi partager ma position ?</h3><p className="text-sm text-blue-800">Les travailleurs que vous contactez pourront se déplacer facilement vers votre lieu d'intervention.</p></div>
      <div className="space-y-6">
        <div><label className="block text-sm font-medium mb-2">Position actuelle</label><div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">{position.latitude?<div className="text-sm"><p>Latitude: {position.latitude.toFixed(6)}</p><p>Longitude: {position.longitude.toFixed(6)}</p></div>:<p className="text-gray-500">Position non disponible</p>}<button onClick={obtenirPositionActuelle} className="btn-secondary flex items-center gap-2"><Navigation size={18}/>Actualiser</button></div></div>
        <div><label className="block text-sm font-medium mb-2">Adresse (optionnel)</label><input type="text" value={adresse} onChange={(e)=>setAdresse(e.target.value)} className="input-field" placeholder="Ex: Près du marché central..."/></div>
        <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-4"><input type="checkbox" id="partage" checked={partagePosition} onChange={(e)=>setPartagePosition(e.target.checked)} className="w-5 h-5"/><label htmlFor="partage" className="flex-1"><div className="font-medium">Partager ma position avec les travailleurs</div><div className="text-sm text-gray-600">Les travailleurs pourront voir votre position</div></label></div>
        <button onClick={sauvegarderPosition} disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2"><Save size={20}/>{loading?'Enregistrement...':'Enregistrer ma position'}</button>
      </div>
    </div></div></div>
  );
    }
