import './globals.css';
import { Inter } from 'next/font/google';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider } from '@/context/AuthContext';
const inter = Inter({ subsets: ['latin'] });
export const metadata = { title: 'TechniqueCity - Trouvez les meilleurs artisans au Togo', description: 'Plateforme de mise en relation entre particuliers et travailleurs qualifiés au Togo.' };
export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthProvider>{children}<ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover theme="light" /></AuthProvider>
      </body>
    </html>
  );
    }
