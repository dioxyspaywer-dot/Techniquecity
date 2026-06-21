'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Eye, EyeOff } from 'lucide-react';

export default function InscriptionPage() {
  const [type, setType] = useState('utilisateur');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { registerUtilisateur, registerTravailleur } = useAuth();
  const [formData, setFormData] = useState({ nom:'',prenom:'',telephone:'',motDePasse:'',ville:'',quartier:'',age:'',metier:'',region:'' });
  const handleChange = (e) => setFormData({...formData,[e.target.name]:e.target.value});
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); if(type==='utilisateur') await registerUtilisateur(formData); else await registerTravailleur(formData); setLoading(false); };
  const metiers = ['électricien','maçon','soudeur','mécanicien','coiffeur','menuisier','couturier','ferrailleur','staffeur'];
  return (
    <div className="min-h-screen"><Navbar/><div className="max-w-md mx-auto mt-8 p-6"><div className="card">
      <h1 className="text-3xl font-bold text-center mb-6">Inscription</h1>
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1"><button onClick={()=>setType('utilisateur')} className={`flex-1 py-2 rounded-md font-medium transition-colors ${type==='utilisateur'?'bg-white shadow-md':''}`}>Utilisateur</button><button onClick={()=>setType('travailleur')} className={`flex-1 py-2 rounded-md font-medium transition-colors ${type==='travailleur'?'bg-white shadow-md':''}`}>Travailleur</button></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Nom</label><input type="text" name="nom" value={formData.nom} onChange={handleChange} className="input-field" required/></div><div><label className="block text-sm font-medium mb-2">Prénom</label><input type="text" name="prenom" value={formData.prenom} onChange={handleChange} className="input-field" required/></div></div>
        <div><label className="block text-sm font-medium mb-2">Téléphone</label><input type="tel" name="telephone" value={formData.telephone} onChange={handleChange} className="input-field" placeholder="90123456" required/></div>
        {type==='travailleur'&&(<><div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Âge</label><input type="number" name="age" value={formData.age} onChange={handleChange} className="input-field" min="16" max="100" required/></div><div><label className="block text-sm font-medium mb-2">Métier</label><select name="metier" value={formData.metier} onChange={handleChange} className="input-field" required><option value="">Choisir...</option>{metiers.map(m=><option key={m} value={m}>{m.charAt(0).toUpperCase()+m.slice(1)}</option>)}</select></div></div><div><label className="block text-sm font-medium mb-2">Région</label><input type="text" name="region" value={formData.region} onChange={handleChange} className="input-field" placeholder="Maritime, Kara, etc." required/></div></>)}
        <div className="grid grid-cols-2 gap-4"><div><label className="block text-sm font-medium mb-2">Ville</label><input type="text" name="ville" value={formData.ville} onChange={handleChange} className="input-field" required/></div><div><label className="block text-sm font-medium mb-2">Quartier</label><input type="text" name="quartier" value={formData.quartier} onChange={handleChange} className="input-field" required/></div></div>
        <div><label className="block text-sm font-medium mb-2">Mot de passe</label><div className="relative"><input type={showPassword?'text':'password'} name="motDePasse" value={formData.motDePasse} onChange={handleChange} className="input-field pr-12" minLength="6" required/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500">{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></div>
        {type==='travailleur'&&(<div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm"><p className="text-yellow-800"><strong>💡 Note :</strong> Un paiement de 250 F CFA sera requis après l'inscription pour publier votre profil.</p></div>)}
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading?'Inscription...':"S'inscrire"}</button>
      </form>
      <div className="mt-6 text-center"><p className="text-gray-600">Déjà inscrit ? <Link href="/connexion" className="text-primary-600 font-medium hover:underline">Se connecter</Link></p></div>
    </div></div></div>
  );
    }
