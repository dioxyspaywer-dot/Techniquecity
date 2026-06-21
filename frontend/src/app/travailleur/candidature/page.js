'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { toast } from 'react-toastify';

export default function CandidaturePage() {
  const router = useRouter(); const { user } = useAuth(); const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ anneesExperience:0,diplome:'Aucun',description:'',tarifs:'' });
  const handleChange = (e) => setFormData({...formData,[e.target.name]:e.target.value});
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); try{await api.post('/travailleur/candidature',formData);toast.success('Profil complété !');router.push('/travailleur/paiement');}catch(err){toast.error(err.response?.data?.message||'Erreur');}finally{setLoading(false);} };
  if(!user||user.type!=='travailleur'){router.push('/connexion');return null;}
  const diplomes=['CFA','CAP','BT','BAC PRO','BTS','CQP','BEP','Aucun','Autre'];
  return (
    <div className="min-h-screen"><Navbar/><div className="max-w-2xl mx-auto px-4 py-8"><div className="card">
      <h1 className="text-3xl font-bold mb-6">Complétez votre profil</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div><label className="block text-sm font-medium mb-2">Années d'expérience</label><input type="number" name="anneesExperience" value={formData.anneesExperience} onChange={handleChange} className="input-field" min="0" max="50" required/></div>
        <div><label className="block text-sm font-medium mb-2">Diplôme</label><select name="diplome" value={formData.diplome} onChange={handleChange} className="input-field">{diplomes.map(d=><option key={d} value={d}>{d}</option>)}</select></div>
        <div><label className="block text-sm font-medium mb-2">Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="input-field" rows="4" maxLength="500"/><p className="text-sm text-gray-500 mt-1">{formData.description.length}/500</p></div>
        <div><label className="block text-sm font-medium mb-2">Tarifs</label><textarea name="tarifs" value={formData.tarifs} onChange={handleChange} className="input-field" rows="3" placeholder="Ex: Intervention à partir de 5000 F CFA"/></div>
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading?'Enregistrement...':'Enregistrer et procéder au paiement'}</button>
      </form>
    </div></div></div>
  );
    }
