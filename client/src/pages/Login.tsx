import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Mail, Lock, AlertCircle } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data.token, response.data.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-70px)] py-10 px-5 bg-muted">
      <motion.div 
        className="bg-white p-10 rounded-xl shadow-lg w-full max-w-[450px] text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
        <p className="text-muted-foreground mb-8">Login to your CharityLinks account</p>

        {error && (
          <div className="bg-red-100 text-red-500 p-3 rounded-xl flex items-center justify-center gap-2 mb-6 font-medium">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="text-left">
          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2 text-foreground">Email Address</label>
            <div className="relative">
              <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="email" 
                placeholder="you@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all bg-white"
              />
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-sm font-semibold mb-2 text-foreground">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all bg-white"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3.5 bg-primary text-white border-none rounded-xl text-base font-bold mt-3 transition-colors hover:bg-primary-hover disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-muted-foreground">
          Don't have an account? <Link to="/register" className="text-primary font-semibold">Create one</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
