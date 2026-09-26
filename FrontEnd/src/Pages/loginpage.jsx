import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { supabase, supabaseConfigured } from '../auth/supabase';

export default function LoginPage() {
  const [mode, setMode] = useState('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.from?.pathname || '/upload';

  if (loading) return <main className="min-h-screen grid place-items-center text-gray-600">Carregando...</main>;
  if (user) return <Navigate to={destination} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!supabaseConfigured) {
      setError('Configure VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo FrontEnd/.env.local.');
      return;
    }
    setBusy(true);
    try {
      if (mode === 'signup') {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (authError) throw authError;
        if (data.session) navigate(destination, { replace: true });
        else setMessage('Conta criada! Confira seu e-mail para confirmar o cadastro e depois entre.');
      } else {
        const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (authError) throw authError;
        navigate(destination, { replace: true });
      }
    } catch (authError) {
      setError(authError.message || 'Não foi possível autenticar. Tente novamente.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-orange-50/60 px-4 py-10 flex items-center justify-center">
      <section className="w-full max-w-md rounded-2xl bg-white p-7 sm:p-9 shadow-xl border border-orange-100">
        <Link to="/" className="text-2xl font-bold text-gray-900">Draft<span className="text-orange-600">Up</span></Link>
        <p className="mt-6 text-sm font-semibold uppercase tracking-wider text-orange-600">Sua planta, mais fácil de entender</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">{mode === 'login' ? 'Bem-vindo de volta' : 'Crie sua conta'}</h1>
        <p className="mt-2 text-gray-600">{mode === 'login' ? 'Entre para enviar e analisar suas plantas.' : 'Cadastre-se para começar a explorar suas plantas.'}</p>

        <div className="mt-6 grid grid-cols-2 rounded-lg bg-gray-100 p-1 text-sm font-semibold">
          <button type="button" onClick={() => { setMode('login'); setError(''); setMessage(''); }} className={`rounded-md py-2 ${mode === 'login' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-500'}`}>Entrar</button>
          <button type="button" onClick={() => { setMode('signup'); setError(''); setMessage(''); }} className={`rounded-md py-2 ${mode === 'signup' ? 'bg-white text-orange-700 shadow-sm' : 'text-gray-500'}`}>Criar conta</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {mode === 'signup' && <label className="block text-sm font-medium text-gray-700">Nome<input autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>}
          <label className="block text-sm font-medium text-gray-700">E-mail<input type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /></label>
          <label className="block text-sm font-medium text-gray-700">Senha<input type="password" autoComplete={mode === 'login' ? 'current-password' : 'new-password'} minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-100" /><span className="mt-1 block text-xs text-gray-500">Mínimo de 6 caracteres.</span></label>
          {error && <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>}
          {message && <p role="status" className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{message}</p>}
          <button disabled={busy} className="w-full rounded-lg bg-orange-600 px-4 py-3 font-semibold text-white transition hover:bg-orange-700 disabled:opacity-60">{busy ? 'Aguarde...' : mode === 'login' ? 'Entrar' : 'Criar conta'}</button>
        </form>
        <Link to="/" className="mt-6 block text-center text-sm text-gray-500 hover:text-orange-700">Voltar para o início</Link>
      </section>
    </main>
  );
}
