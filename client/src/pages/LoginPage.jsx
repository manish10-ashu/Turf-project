import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { LogIn } from 'lucide-react';

const LoginPage = () => {
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      navigate(redirect ? `/${redirect}` : '/');
    }
  }, [user, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const res = await login(email, password);
    if (res.success) {
      // Successful login, navigate handled by useEffect
      setLoading(false);
    } else {
      setError(res.message);
      setLoading(false);
    }
  };

  return (
    <div className="pt-40 md:pt-32 min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 transition-colors p-4">
      <Card hoverEffect={false} className="w-full max-w-md p-8 border border-slate-100 dark:border-slate-800/60 shadow-2xl">
        <div className="text-center mb-8">
          <span className="p-3 bg-brand-emerald/10 text-brand-emerald rounded-full inline-block mb-3">
            <LogIn className="h-6 w-6" />
          </span>
          <h2 className="text-3xl font-black font-display text-slate-900 dark:text-white">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-1">Sign in to book slots and manage appointments</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="rahul@gmail.com"
            required
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />

          <Button variant="primary" type="submit" loading={loading} className="w-full mt-2 py-3">
            Log In
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 text-center text-sm text-slate-500">
          <span>Don't have an account? </span>
          <Link to={`/register${redirect ? `?redirect=${redirect}` : ''}`} className="text-brand-emerald font-bold hover:underline">
            Register Here
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
