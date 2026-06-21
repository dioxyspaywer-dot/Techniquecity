'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { Eye, EyeOff } from 'lucide-react';

export default function ConnexionPage() {
  const [type, setType] = useState('utilisateur');
  const [telephone, setTelephone] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); await login(telephone, motDePasse, type); setLoading(false); };
  return (
    <div className="min-h-screen"><Navbar/><div className="max-w-md mx-auto mt-12 p-6"><div className="card">
      <h1 className="text-3xl font-bold text-center mb-6">Connexion</h1>
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1"><button onClick={() => setType('utilisateur')} className={`flex-1 py-2 rounded-md font-medium transition-colors ${type==='utilisateur'?'bg-white shadow-md':''}`}>Utilisateur</button><button onClick={() => setType('travailleur')} className={`flex-1 py-2 rounded-md font-medium transition-colors ${type==='travailleur'?'bg-white shadow-md':''}`}>Travailleur</button></div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block text-sm font-medium mb-2">Numéro de téléphone</label><input type="tel" value={telephone} onChange={(e)=>setTelephone(e.target.value)} className="input-field" placeholder="90123456" required/></div>
        <div><label className="block text-sm font-medium mb-2">Mot de passe</label><div className="relative"><input type={showPassword?'text':'password'} value={motDePasse} onChange={(e)=>setMotDePasse(e.target.value)} className="input-field pr-12" required/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500">{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></div>
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading?'Connexion...':'Se connecter'}</button>
      </form>
      <div className="mt-6 text-center"><p className="text-gray-600">Pas encore de compte ? <Link href="/inscription" className="text-primary-600 font-medium hover:underline">S'inscrire</Link></p></div>
    </div></div></div>
  );
    }
