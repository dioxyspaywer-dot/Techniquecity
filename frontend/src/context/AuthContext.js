'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { toast } from 'react-toastify';
const AuthContext = createContext();
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => { checkAuth(); }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return; }
    try {
      const response = await axios.get(`${API_URL}/auth/verifier-token`, { headers: { Authorization: `Bearer ${token}` } });
      setUser(response.data.user);
    } catch (error) { localStorage.removeItem('token'); setUser(null); }
    finally { setLoading(false); }
  };

  const login = async (telephone, motDePasse, type = 'utilisateur') => {
    try {
      const response = await axios.post(`${API_URL}/auth/connexion`, { telephone, motDePasse, type });
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      toast.success('Connexion réussie !');
      if (type === 'travailleur' && response.data.user.statutPaiement !== 'paye') router.push('/travailleur/candidature');
      else router.push('/');
      return { success: true };
    } catch (error) { toast.error(error.response?.data?.message || 'Erreur de connexion'); return { success: false }; }
  };

  const registerUtilisateur = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/inscription/utilisateur`, data);
      localStorage.setItem('token', response.data.token); setUser(response.data.user);
      toast.success('Inscription réussie !'); router.push('/'); return { success: true };
    } catch (error) { toast.error(error.response?.data?.message || 'Erreur'); return { success: false }; }
  };

  const registerTravailleur = async (data) => {
    try {
      const response = await axios.post(`${API_URL}/auth/inscription/travailleur`, data);
      localStorage.setItem('token', response.data.token); setUser(response.data.user);
      toast.success('Inscription réussie !'); router.push('/travailleur/candidature'); return { success: true };
    } catch (error) { toast.error(error.response?.data?.message || 'Erreur'); return { success: false }; }
  };

  const logout = () => { localStorage.removeItem('token'); setUser(null); router.push('/connexion'); toast.info('Déconnexion réussie'); };
  const updateUser = (newData) => setUser({ ...user, ...newData });

  return (<AuthContext.Provider value={{ user, loading, login, registerUtilisateur, registerTravailleur, logout, updateUser }}>{!loading && children}</AuthContext.Provider>);
}
export const useAuth = () => { const context = useContext(AuthContext); if (!context) throw new Error('useAuth doit être utilisé dans AuthProvider'); return context; };
