'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { toast } from 'react-toastify';
import { CreditCard, Loader } from 'lucide-react';

export default function PaiementPage() {
  const router = useRouter(); const { user } = useAuth();
  const [methode, setMethode] = useState(''); const [loading, setLoading] = useState(false); const [transactionId, setTransactionId] = useState(null);
  const initierPaiement = async () => { if(!methode){toast.error('Choisissez une méthode');return;} setLoading(true); try{const r=await api.post('/paiement/initier',{methode,telephone:user.telephone});if(r.data.success){setTransactionId(r.data.transactionId);toast.success('Paiement initié !');verifierStatut(r.data.transactionId);}}catch(e){toast.error(e.response?.data?.message||'Erreur');}finally{setLoading(false);} };
  const verifierStatut = async (tid) => { const interval=setInterval(async()=>{try{const r=await api.get(`/paiement/statut/${tid}`);if(r.data.statut==='succes'){clearInterval(interval);toast.success('Paiement confirmé !');router.push('/travailleur/profil');}else if(r.data.statut==='echoue'){clearInterval(interval);toast.error('Paiement échoué');}}catch(e){clearInterval(interval);}},5000); };
  if(!user||user.type!=='travailleur'){router.push('/connexion');return null;}
  return (
    <div className="min-h-screen"><Navbar/><div className="max-w-md mx-auto px-4 py-8"><div className="card">
      <h1 className="text-3xl font-bold mb-2">Publiez votre profil</h1><p className="text-gray-600 mb-6">Paiement unique de <strong>250 F CFA</strong></p>
      <div className="space-y-4 mb-6"><h3 className="font-bold">Méthode de paiement :</h3>
        <button onClick={()=>setMethode('mixx')} className={`w-full p-4 border-2 rounded-lg transition-colors ${methode==='mixx'?'border-primary-600 bg-primary-50':'border-gray-200'}`}><div className="flex items-center"><div className="bg-blue-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">MIXX</div><div className="text-left"><div className="font-medium">Mixx by Yas</div><div className="text-sm text-gray-600">Moov Money</div></div></div></button>
        <button onClick={()=>setMethode('flooz')} className={`w-full p-4 border-2 rounded-lg transition-colors ${methode==='flooz'?'border-primary-600 bg-primary-50':'border-gray-200'}`}><div className="flex items-center"><div className="bg-orange-600 text-white px-3 py-1 rounded text-sm font-bold mr-3">FLOOZ</div><div className="text-left"><div className="font-medium">Flooz</div><div className="text-sm text-gray-600">Togocom Money</div></div></div></button>
      </div>
      <button onClick={initierPaiement} disabled={loading||!methode} className="btn-primary w-full flex items-center justify-center">{loading?<><Loader className="animate-spin mr-2" size={20}/>Traitement...</>:<><CreditCard size={20} className="mr-2"/>Payer 250 F CFA</>}</button>
      {transactionId&&<div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4"><p className="text-sm text-yellow-800"><strong>Transaction :</strong> {transactionId}</p></div>}
    </div></div></div>
  );
  }
