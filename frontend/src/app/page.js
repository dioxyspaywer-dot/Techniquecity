import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { Search, MapPin, Shield, Zap } from 'lucide-react';
const metiers = [{nom:'Électricien',icon:'⚡',couleur:'bg-yellow-100'},{nom:'Maçon',icon:'🧱',couleur:'bg-red-100'},{nom:'Soudeur',icon:'🔥',couleur:'bg-orange-100'},{nom:'Mécanicien',icon:'🔧',couleur:'bg-blue-100'},{nom:'Coiffeur',icon:'💇',couleur:'bg-pink-100'},{nom:'Menuisier',icon:'🪚',couleur:'bg-amber-100'},{nom:'Couturier',icon:'🧵',couleur:'bg-purple-100'},{nom:'Ferrailleur',icon:'⚙️',couleur:'bg-gray-100'},{nom:'Staffeur',icon:'🏗️',couleur:'bg-green-100'}];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar/>
      <section className="gradient-bg text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Trouvez les meilleurs <span className="text-yellow-300">artisans</span> au Togo</h1>
          <p className="text-xl md:text-2xl mb-8 text-primary-100">Électriciens, maçons, mécaniciens, coiffeurs... Tous les professionnels qualifiés à portée de main</p>
          <div className="max-w-2xl mx-auto bg-white rounded-lg p-2 shadow-xl"><div className="flex"><input type="text" placeholder="Quel métier recherchez-vous ?" className="flex-1 px-4 py-3 text-gray-800 rounded-l-lg focus:outline-none"/><Link href="/recherche" className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-r-lg font-medium flex items-center"><Search className="mr-2" size={20}/>Rechercher</Link></div></div>
        </div>
      </section>
      <section className="py-16 bg-gray-50"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h2 className="text-3xl font-bold text-center mb-12">Nos <span className="text-primary-600">métiers</span> disponibles</h2><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">{metiers.map((m)=><Link key={m.nom} href={`/recherche?metier=${m.nom.toLowerCase()}`} className="card text-center hover:scale-105 transition-transform cursor-pointer"><div className={`text-5xl mb-3 ${m.couleur} w-20 h-20 rounded-full mx-auto flex items-center justify-center`}>{m.icon}</div><h3 className="font-semibold">{m.nom}</h3></Link>)}</div></div></section>
      <section className="py-16"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"><h2 className="text-3xl font-bold text-center mb-12">Pourquoi choisir <span className="text-primary-600">TechniqueCity</span> ?</h2><div className="grid md:grid-cols-3 gap-8"><div className="card text-center"><div className="bg-primary-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"><Zap className="text-primary-600" size={32}/></div><h3 className="text-xl font-bold mb-2">Rapide et efficace</h3><p className="text-gray-600">Trouvez un professionnel en quelques minutes</p></div><div className="card text-center"><div className="bg-green-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"><Shield className="text-green-600" size={32}/></div><h3 className="text-xl font-bold mb-2">Profils vérifiés</h3><p className="text-gray-600">Tous les travailleurs ont des profils crédibles</p></div><div className="card text-center"><div className="bg-yellow-100 w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4"><MapPin className="text-yellow-600" size={32}/></div><h3 className="text-xl font-bold mb-2">Géolocalisation</h3><p className="text-gray-600">Les travailleurs se déplacent vers vous</p></div></div></div></section>
      <section className="py-16 bg-gray-50"><div className="max-w-4xl mx-auto px-4 text-center"><h2 className="text-3xl font-bold mb-4">Vous êtes un professionnel ?</h2><p className="text-xl text-gray-600 mb-8">Rejoignez TechniqueCity et trouvez de nouveaux clients facilement</p><div className="flex flex-col sm:flex-row gap-4 justify-center"><Link href="/inscription" className="btn-primary text-lg">Je suis un utilisateur</Link><Link href="/inscription?type=travailleur" className="btn-success text-lg">Je suis un travailleur</Link></div></div></section>
      <footer className="bg-gray-900 text-white py-12"><div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"><div className="gradient-bg text-white px-4 py-2 rounded-lg font-bold text-xl mb-4 inline-block">Technique<span className="text-yellow-300">City</span></div><p className="text-gray-400">© 2026 TechniqueCity. Tous droits réservés.</p></div></footer>
    </div>
  );
    }
