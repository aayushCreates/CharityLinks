import React, { useState } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { 
  BarChart3, Users, Settings, Play, CheckCircle, 
  AlertTriangle, DollarSign, TrendingUp 
} from 'lucide-react';

const AdminDashboard: React.FC = () => {
  const [stats] = useState({
    totalUsers: 1250,
    activeSubscriptions: 840,
    totalPrizePool: 25000,
    totalImpact: 15000
  });
  const [simulation, setLastSimulation] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [publishLoading, setPublishLoading] = useState(false);

  const handleSimulate = async (mode: 'RANDOM' | 'ALGORITHMIC') => {
    setLoading(true);
    try {
      const response = await api.post('/draws/simulate', { mode });
      setLastSimulation(response.data.data);
    } catch (err) {
      alert('Simulation failed');
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async () => {
    setPublishLoading(true);
    try {
      await api.post('/draws/publish');
      alert('Draw published successfully!');
      setLastSimulation(null);
    } catch (err) {
      alert('Publishing failed');
    } finally {
      setPublishLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-5">
      <header className="mb-10">
        <h1 className="text-4xl font-bold mb-2">Administrator Control</h1>
        <p className="text-muted-foreground text-lg">Manage the platform, run draws, and track global impact.</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {[
          { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'bg-blue-50 text-blue-600' },
          { icon: BarChart3, label: 'Active Subs', value: stats.activeSubscriptions, color: 'bg-green-50 text-green-600' },
          { icon: DollarSign, label: 'Prize Pool', value: `$${stats.totalPrizePool.toLocaleString()}`, color: 'bg-amber-50 text-amber-600' },
          { icon: TrendingUp, label: 'Total Impact', value: `$${stats.totalImpact.toLocaleString()}`, color: 'bg-pink-50 text-pink-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-border flex items-center gap-5">
            <stat.icon className={`w-10 h-10 p-2 rounded-lg ${stat.color}`} />
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">{stat.label}</span>
              <span className="text-2xl font-black">{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <section className="bg-white rounded-xl border border-border p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <Settings size={24} className="text-primary" />
            <h2 className="text-2xl font-bold">Draw Management</h2>
          </div>
          
          <div className="py-5">
            <div className="mb-8">
              <p className="text-muted-foreground mb-6">Run a simulation to see potential winners and prize distribution before publishing.</p>
              <div className="flex gap-4">
                <button 
                  onClick={() => handleSimulate('RANDOM')} 
                  disabled={loading}
                  className="flex items-center gap-2 bg-white border border-border px-5 py-2.5 rounded-xl font-bold transition-all hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  <Play size={16} /> Random Draw
                </button>
                <button 
                  onClick={() => handleSimulate('ALGORITHMIC')} 
                  disabled={loading}
                  className="flex items-center gap-2 bg-white border border-border px-5 py-2.5 rounded-xl font-bold transition-all hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  <Play size={16} /> Algorithmic Draw
                </button>
              </div>
            </div>

            {loading && <div className="text-primary font-bold animate-pulse">Simulating results...</div>}

            {simulation && (
              <motion.div 
                className="mt-8 p-6 bg-muted rounded-2xl border border-border"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="font-bold text-lg">Simulation Results</h3>
                  <div className="flex gap-2">
                    {simulation.numbers.map((n: number) => (
                      <span key={n} className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-xs font-black shadow-lg shadow-primary/20">{n}</span>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-8">
                  {[
                    { label: '5 Match', value: simulation.stats.match5Count },
                    { label: '4 Match', value: simulation.stats.match4Count },
                    { label: '3 Match', value: simulation.stats.match3Count }
                  ].map((s, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl text-center shadow-sm">
                      <span className="block text-[10px] uppercase font-black text-muted-foreground mb-1">{s.label}</span>
                      <strong className="text-xl font-black">{s.value}</strong>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-3 text-orange-800 bg-orange-50 p-4 rounded-xl text-sm font-medium mb-6">
                  <AlertTriangle size={18} className="shrink-0" />
                  <span>Publishing will finalize results and notify winners.</span>
                </div>

                <button 
                  onClick={handlePublish} 
                  disabled={publishLoading}
                  className="w-full py-3.5 bg-primary text-white rounded-xl font-black text-lg transition-all hover:bg-primary-hover shadow-xl shadow-primary/20 disabled:opacity-50"
                >
                  {publishLoading ? 'Publishing...' : 'Confirm & Publish Draw'}
                </button>
              </motion.div>
            )}
          </div>
        </section>

        <section className="bg-white rounded-xl border border-border p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <Users size={24} className="text-primary" />
            <h2 className="text-2xl font-bold">Winner Verification</h2>
          </div>
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground bg-muted/50 rounded-2xl border-2 border-dashed border-border">
            <CheckCircle size={48} className="text-accent mb-4 opacity-50" />
            <p className="font-bold">All winner proofs have been verified.</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;
