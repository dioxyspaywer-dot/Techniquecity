'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { toast } from 'react-toastify';

export default function AdminConnexionPage() {
  const router = useRouter();
  const [telephone, setTelephone] = useState(''); const [motDePasse, setMotDePasse] = useState('');
  const [showPassword, setShowPassword] = useState(false); const [loading, setLoading] = useState(false);
  const ADMIN_TELEPHONE = '97694369'; const ADMIN_MOT_DE_PASSE = '2642010E';
  const handleSubmit = async (e) => { e.preventDefault(); setLoading(true); if(telephone===ADMIN_TELEPHONE&&motDePasse===ADMIN_MOT_DE_PASSE){localStorage.setItem('admin_session',JSON.stringify({telephone,timestamp:Date.now(),valide:true}));toast.success('Accès administrateur accordé');router.push('/admin');}else{toast.error('Identifiants incorrects');} setLoading(false); };
  return (
    <div className="min-h-screen"><Navbar/><div className="max-w-md mx-auto mt-20 p-6"><div className="card">
      <div className="flex justify-center mb-6"><div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center"><Shield className="text-red-600" size={40}/></div></div>
      <h1 className="text-3xl font-bold text-center mb-2">Accès Administrateur</h1><p className="text-center text-gray-600 mb-8">Zone sécurisée</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div><label className="block text-sm font-medium mb-2">Numéro de téléphone</label><input type="tel" value={telephone} onChange={(e)=>setTelephone(e.target.value)} className="input-field" placeholder="97694369" required/></div>
        <div><label className="block text-sm font-medium mb-2">Mot de passe</label><div className="relative"><input type={showPassword?'text':'password'} value={motDePasse} onChange={(e)=>setMotDePasse(e.target.value)} className="input-field pr-12" required/><button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-500">{showPassword?<EyeOff size={20}/>:<Eye size={20}/>}</button></div></div>
        <button type="submit" disabled={loading} className="btn-primary w-full">{loading?'Vérification...':'Se connecter'}</button>
      </form>
    </div></div></div>
  );
    }
