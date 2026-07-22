import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';

export function Login() {
  const { user, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (user) navigate('/admin', { replace: true });
  }, [user, navigate]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    const { error } = await signIn(email, password);
    setEnviando(false);
    if (error) {
      setError(error);
      setPassword('');
    } else {
      navigate('/admin');
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-[400px] rounded-[20px] border border-slate-200 bg-white p-10 px-8 shadow-[0_8px_32px_rgba(15,23,42,0.08)]">
        <div className="mb-6 flex justify-center text-brand-600">
          <Lock size={44} strokeWidth={1.5} />
        </div>

        <h1 className="mb-1 text-center text-xl font-bold text-slate-800">Panel de Administración</h1>
        <p className="mb-8 text-center text-sm text-slate-500">Ingresá tus credenciales para continuar</p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-600">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label-field">Email</label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@tutienda.com"
              className="input-field"
            />
          </div>

          <div>
            <label className="label-field">Contraseña</label>
            <div className="relative">
              <input
                type={mostrarPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input-field pr-10"
              />
              <button
                type="button"
                onClick={() => setMostrarPassword((v) => !v)}
                aria-label="Mostrar contraseña"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-brand-600"
              >
                {mostrarPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={enviando} className="mt-1">
            {enviando ? 'Ingresando...' : 'Ingresar al panel'}
          </Button>
        </form>

        <Link to="/" className="mt-5 block text-center text-sm text-slate-500 transition hover:text-brand-600">
          ← Volver a la tienda
        </Link>
      </div>
    </div>
  );
}
