import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { User, Mail, Lock, Phone, Heart, Percent, AlertCircle } from 'lucide-react';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    charityId: '',
    contributionPercent: 10,
  });
  const [charities, setCharities] = useState<any[]>([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await api.get('/charities');
        const data = response.data.data;

        setCharities(data);
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, charityId: data[0].id }));
        }
      } catch (err) {
        console.error('Failed to fetch charities, using fallback');
      }
    };
    fetchCharities();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'contributionPercent' ? parseInt(value) : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.contributionPercent < 10) {
      setError('Minimum contribution is 10%');
      setLoading(false);
      return;
    }

    try {
      const response = await api.post('/auth/register', formData);
      login(response.data.token, response.data.data);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-70px)] py-8 px-4 sm:py-12 sm:px-6 bg-slate-50">
      <motion.div 
        className="bg-white p-6 sm:p-10 rounded-2xl shadow-xl w-full max-w-2xl text-center border border-slate-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2">Join CharityLinks</h2>
          <p className="text-slate-500 font-medium">Create your account and start making an impact</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 mb-8 border border-red-100 text-left"
          >
            <AlertCircle size={20} className="shrink-0" />
            <span className="text-sm font-semibold">{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="text-left">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-5 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" name="name" placeholder="John Doe" 
                  value={formData.name} onChange={handleChange} required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" name="email" placeholder="john@example.com" 
                  value={formData.email} onChange={handleChange} required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Phone Number</label>
              <div className="relative group">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="tel" name="phone" placeholder="+1 234 567 890" 
                  value={formData.phone} onChange={handleChange} required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="password" name="password" placeholder="••••••••" 
                  value={formData.password} onChange={handleChange} required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Choose Your Charity</label>
              <div className="relative group">
                <Heart size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <select 
                  name="charityId" value={formData.charityId} onChange={handleChange} required
                  className="w-full pl-11 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all appearance-none"
                >
                  {charities.map(charity => (
                    <option key={charity.id} value={charity.id}>{charity.name}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Contribution % (Min 10%)</label>
              <div className="relative group">
                <Percent size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" />
                <input 
                  type="number" name="contributionPercent" min="10" max="100"
                  value={formData.contributionPercent} onChange={handleChange} required
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 focus:bg-white transition-all font-semibold"
                />
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-primary text-white border-none rounded-xl text-lg font-black shadow-lg shadow-primary/25 hover:bg-primary-hover hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="mt-8 text-slate-500 font-medium">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline underline-offset-4">Login here</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
