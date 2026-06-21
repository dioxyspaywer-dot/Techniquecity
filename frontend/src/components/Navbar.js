'use client';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useState } from 'react';
import { Menu, X, User, LogOut, MessageCircle, Home, Search, MapPin } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center"><div className="gradient-bg text-white px-4 py-2 rounded-lg font-bold text-xl">Technique<span className="text-yellow-300">City</span></div></Link>
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/" className="flex items-center text-gray-700 hover:text-primary-600"><Home size={18} className="mr-1"/> Accueil</Link>
            <Link href="/recherche" className="flex items-center text-gray-700 hover:text-primary-600"><Search size={18} className="mr-1"/> Rechercher</Link>
            {user ? (<>
              {user.type === 'utilisateur' && <Link href="/utilisateur/localisation" className="flex items-center text-gray-700 hover:text-primary-600"><MapPin size={18} className="mr-1"/> Ma position</Link>}
              <Link href="/messages" className="flex items-center text-gray-700 hover:text-primary-600"><MessageCircle size={18} className="mr-1"/> Messages</Link>
              <div className="relative group">
                <button className="flex items-center text-gray-700 hover:text-primary-600"><User size={18} className="mr-1"/>{user.prenom}</button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 hidden group-hover:block">
                  <Link href={user.type === 'travailleur' ? '/travailleur/profil' : '/'} className="block px-4 py-2 hover:bg-gray-100">Mon profil</Link>
                  <button onClick={logout} className="w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"><LogOut size={16} className="inline mr-2"/>Déconnexion</button>
                </div>
              </div>
            </>) : (<div className="flex space-x-3"><Link href="/connexion" className="text-gray-700 hover:text-primary-600 font-medium">Connexion</Link><Link href="/inscription" className="btn-primary text-sm">Inscription</Link></div>)}
          </div>
          <div className="md:hidden"><button onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={28}/> : <Menu size={28}/>}</button></div>
        </div>
        {menuOpen && (<div className="md:hidden pb-4 space-y-2">
          <Link href="/" className="block py-2" onClick={() => setMenuOpen(false)}><Home size={18} className="inline mr-2"/> Accueil</Link>
          <Link href="/recherche" className="block py-2" onClick={() => setMenuOpen(false)}><Search size={18} className="inline mr-2"/> Rechercher</Link>
          {user ? (<>{user.type === 'utilisateur' && <Link href="/utilisateur/localisation" className="block py-2" onClick={() => setMenuOpen(false)}><MapPin size={18} className="inline mr-2"/> Ma position</Link>}<Link href="/messages" className="block py-2" onClick={() => setMenuOpen(false)}><MessageCircle size={18} className="inline mr-2"/> Messages</Link><Link href={user.type === 'travailleur' ? '/travailleur/profil' : '/'} className="block py-2" onClick={() => setMenuOpen(false)}><User size={18} className="inline mr-2"/> Mon profil</Link><button onClick={() => { logout(); setMenuOpen(false); }} className="w-full text-left py-2 text-red-600"><LogOut size={18} className="inline mr-2"/> Déconnexion</button></>) : (<><Link href="/connexion" className="block py-2" onClick={() => setMenuOpen(false)}>Connexion</Link><Link href="/inscription" className="block py-2" onClick={() => setMenuOpen(false)}>Inscription</Link></>)}
        </div>)}
      </div>
    </nav>
  );
    }
