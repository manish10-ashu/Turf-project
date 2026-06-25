import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const { register, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  
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

    const res = await register(name, email, password, phone);
    if (res.success) {
      // Successful registration, navigation handled by useEffect
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
            <UserPlus className="h-6 w-6" />
          </span>
          <h2 className="text-3xl font-black font-display text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-slate-500 text-sm mt-1">Sign up to reserve turf slots instantly</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Rahul Sharma"
            required
          />

          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="rahul@gmail.com"
            required
          />

          <Input
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+91 98765 43210"
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
            Register Account
          </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800/60 text-center text-sm text-slate-500">
          <span>Already have an account? </span>
          <Link to={`/login${redirect ? `?redirect=${redirect}` : ''}`} className="text-brand-emerald font-bold hover:underline">
            Log In
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
