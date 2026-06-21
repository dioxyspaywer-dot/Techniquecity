'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';
import api from '@/utils/api';
import { toast } from 'react-toastify';
import { MapPin, Edit2, ToggleLeft, ToggleRight } from 'lucide-react';

export default function ProfilTravailleurPage() {
  const router = useRouter(); const { user } = useAuth();
  const [travailleur, setTravailleur] = useState(null); const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false); const [formData, setFormData] = useState({});
  useEffect(() => { if(!user||user.type!=='travailleur'){router.push('/connexion');return;} chargerProfil(); }, [user]);
  const chargerProfil = async () => { try{const r=await api.get('/travailleur/profil');setTravailleur(r.data);setFormData(r.data);}catch(e){toast.error('Erreur');}finally{setLoading(false);} };
  const handleUpdate = async (e) => { e.preventDefault(); try{const r=await api.put('/travailleur/profil',formData);setTravailleur(r.data.travailleur);setEditMode(false);toast.success('Profil mis à jour');}catch(e){toast.error('Erreur');} };
  const toggleDisponibilite = async () => { try{const r=await api.put('/travailleur/disponibilite',{disponible:!travailleur.disponible});setTravailleur(r.data.travailleur);toast.success('Disponibilité mise à jour');}catch(e){toast.error('Erreur');} };
  if(loading) return <div className="min-h-screen"><Navbar/><div className="flex justify-center items-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div></div>;
  if(!travailleur) return null;
  return (
    <div className="min-h-screen"><Navbar/><div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6"><h1 className="text-3xl font-bold">Mon profil</h1><div className="flex gap-2"><button onClick={toggleDisponibilite} className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${travailleur.disponible?'bg-green-100 text-green-800':'bg-red-100 text-red-800'}`}>{travailleur.disponible?<ToggleRight size={20}/>:<ToggleLeft size={20}/>}{travailleur.disponible?'Disponible':'Indisponible'}</button>{!editMode&&<button onClick={()=>setEditMode(true)} className="btn-primary flex items-center gap-2"><Edit2 size={18}/>Modifier</button>}</div></div>
      <div className="card">{!editMode?(<>
        <div className="flex items-start mb-6"><div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-4xl mr-6">👷</div><div><h2 className="text-2xl font-bold">{travailleur.prenom} {travailleur.nom}</h2><p className="text-primary-600 font-medium capitalize">{travailleur.metier}</p><p className="text-gray-600 flex items-center mt-1"><MapPin size={16} className="mr-1"/>{travailleur.quartier}, {travailleur.ville}</p></div></div>
        <div className="grid md:grid-cols-2 gap-4 mb-6"><div><p className="text-sm text-gray-500">Âge</p><p className="font-medium">{travailleur.age} ans</p></div><div><p className="text-sm text-gray-500">Expérience</p><p className="font-medium">{travailleur.anneesExperience} ans</p></div><div><p className="text-sm text-gray-500">Diplôme</p><p className="font-medium">{travailleur.diplome}</p></div><div><p className="text-sm text-gray-500">Téléphone</p><p className="font-medium">{travailleur.telephone}</p></div></div>
        {travailleur.description&&<div className="mb-6"><h3 className="font-bold mb-2">Description</h3><p className="text-gray-700">{travailleur.description}</p></div>}
        <div className="grid grid-cols-3 gap-4 bg-gray-50 rounded-lg p-6"><div className="text-center"><div className="text-2xl font-bold text-primary-600">{travailleur.nombreVues}</div><div className="text-sm text-gray-600">Vues</div></div><div className="text-center"><div className="text-2xl font-bold text-primary-600">{travailleur.nombreContacts}</div><div className="text-sm text-gray-600">Contacts</div></div><div className="text-center"><div className="text-2xl font-bold text-primary-600">{travailleur.statutPaiement==='paye'?'✓':'✗'}</div><div className="text-sm text-gray-600">Payé</div></div></div>
      </>):(<form onSubmit={handleUpdate} className="space-y-4">
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Expérience</label><input type="number" value={formData.anneesExperience||0} onChange={(e)=>setFormData({...formData,anneesExperience:parseInt(e.target.value)})} className="input-field"/></div><div><label className="block text-sm font-medium mb-2">Diplôme</label><select value={formData.diplome||'Aucun'} onChange={(e)=>setFormData({...formData,diplome:e.target.value})} className="input-field"><option>CFA</option><option>CAP</option><option>BT</option><option>BAC PRO</option><option>BTS</option><option>CQP</option><option>BEP</option><option>Aucun</option><option>Autre</option></select></div></div>
        <div><label className="block text-sm font-medium mb-2">Description</label><textarea value={formData.description||''} onChange={(e)=>setFormData({...formData,description:e.target.value})} className="input-field" rows="4" maxLength="500"/></div>
        <div className="flex gap-3"><button type="submit" className="btn-primary">Enregistrer</button><button type="button" onClick={()=>setEditMode(false)} className="btn-secondary">Annuler</button></div>
      </form>)}</div>
    </div></div>
  );
    }
