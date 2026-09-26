import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';
import { supabaseConfigured } from './supabase';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (!supabaseConfigured) {
    return <main className="min-h-screen flex items-center justify-center p-6 text-center"><div><h1 className="text-2xl font-bold">Autenticação não configurada</h1><p className="mt-2 text-gray-600">Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no FrontEnd/.env.local.</p></div></main>;
  }
  if (loading) return <main className="min-h-screen grid place-items-center text-gray-600">Verificando sua sessão...</main>;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
