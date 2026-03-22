import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plus, Heart, Trophy, ChevronRight, TrendingUp, AlertCircle, CheckCircle2, Percent as PercentIcon 
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
  const [latestDraw, setLatestDraw] = useState<any>(null);
  const [charity, setCharity] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showScoreModal, setShowScoreModal] = useState(false);
  const [newScore, setNewScore] = useState({ value: 30, date: new Date().toISOString().split('T')[0] });
  const [selectedPlan, setSelectedPlan] = useState<'MONTHLY' | 'YEARLY'>('YEARLY');
  const [isSubscribing, setIsSubscribing] = useState(false);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [scoresRes, drawRes, charityRes] = await Promise.all([
          api.get('/scores'),
          api.get('/draws/latest').catch(() => ({ data: { data: null } })),
          user?.charityId ? api.get(`/charities/${user.charityId}`) : Promise.resolve({ data: { data: null } })
        ]);

        setScores(scoresRes.data.data);
        setLatestDraw(drawRes.data.data);
        setCharity(charityRes.data.data);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleAddScore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/scores', newScore);
      setScores(prev => [response.data.data, ...prev].slice(0, 5));
      setShowScoreModal(false);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add score');
    }
  };

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    try {
      const response = await api.post('/subscriptions/checkout', { planType: selectedPlan });
      window.location.href = response.data.data.url;
    } catch (err) {
      alert('Failed to initiate checkout');
      setIsSubscribing(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center h-[calc(100vh-70px)] text-xl font-semibold text-muted-foreground">Loading your impact...</div>;

  const isActive = user?.subscriptions && user.subscriptions.length > 0;

  console.log("user in frontend: ", user);

  return (
    <div className="max-w-[1200px] mx-auto py-10 px-5">
      <header className="flex flex-col sm:flex-row justify-between items-start mb-10 gap-4">
        <div>
          <h1 className="text-4xl font-bold mb-1">Hello, {user?.name}</h1>
          <p className="text-muted-foreground text-lg">Ready to make an impact today?</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isActive ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{isActive ? 'Active Member' : 'Inactive Subscription'}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8">
        {/* Main Content */}
        <div className="flex flex-col gap-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-white p-6 rounded-xl border border-border flex items-center gap-5">
              <div className="w-12 h-12 p-2.5 rounded-xl bg-pink-50 text-secondary">
                <Heart className="w-full h-full" />
              </div>
              <div>
                <span className="block text-sm text-muted-foreground font-medium">Your Total Impact</span>
                <span className="text-2xl font-extrabold">$450.00</span>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-border flex items-center gap-5">
              <div className="w-12 h-12 p-2.5 rounded-xl bg-amber-50 text-amber-500">
                <Trophy className="w-full h-full" />
              </div>
              <div>
                <span className="block text-sm text-muted-foreground font-medium">Total Winnings</span>
                <span className="text-2xl font-extrabold">$120.00</span>
              </div>
            </div>
          </div>

          <section className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">Recent Scores</h2>
              <button 
                onClick={() => setShowScoreModal(true)}
                disabled={!isActive}
                className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors hover:bg-primary-hover"
              >
                <Plus size={18} /> Add Score
              </button>
            </div>
            {!isActive ? (
              <div className="text-center py-10 px-5 bg-muted rounded-xl">
                <p className="text-muted-foreground mb-5">Subscribe to start tracking your scores and participating in draws.</p>
                {/* <button onClick={() => setSelectedPlan('MONTHLY')} className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold">Get Started</button> */}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {scores.length === 0 ? (
                  <p className="text-center py-5 text-muted-foreground italic">No scores yet. Log your first game!</p>
                ) : (
                  scores.map((score, idx) => (
                    <div key={score.id} className="flex items-center gap-4 p-4 bg-muted rounded-xl transition-transform hover:translate-x-1">
                      <div className="text-xl font-black text-primary w-8">#{idx + 1}</div>
                      <div className="flex-1">
                        <span className="block font-bold text-lg leading-tight">{score.value} Points</span>
                        <span className="text-sm text-muted-foreground">{new Date(score.date).toLocaleDateString()}</span>
                      </div>
                      <TrendingUp size={18} className="text-accent" />
                    </div>
                  ))
                )}
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h2 className="text-xl font-bold mb-6">Latest Draw</h2>
            {latestDraw ? (
              <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                  {latestDraw.numbers.map((num: number, idx: number) => (
                    <div key={idx} className="w-11 h-11 bg-primary text-white rounded-full flex items-center justify-center font-extrabold text-lg shadow-md shadow-primary/20">
                      {num}
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Draw Date: {new Date(latestDraw.createdAt).toLocaleDateString()}</span>
                  <Link to="/draws" className="text-primary font-bold flex items-center hover:underline">
                    View Results <ChevronRight size={16} />
                  </Link>
                </div>
              </div>
            ) : (
              <p className="text-center py-5 text-muted-foreground italic">No draws published yet.</p>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="flex flex-col gap-8">
          <section className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Supporting</h3>
            {charity ? (
              <div className="flex flex-col gap-4">
                {charity.image && <img src={charity.image} alt={charity.name} className="w-full h-40 object-cover rounded-xl" />}
                <div>
                  <h4 className="text-xl font-bold mb-1">{charity.name}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{charity.description}</p>
                  <div className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-black">
                    <PercentIcon size={12} /> {user?.contributionPercent}% Contribution
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-5">
                <p className="text-muted-foreground text-sm mb-4">You haven't selected a charity yet.</p>
                <Link to="/charities" className="inline-block border border-primary text-primary px-4 py-2 rounded-xl text-sm font-bold hover:bg-muted transition-colors">Select Charity</Link>
              </div>
            )}
          </section>

          <section className="bg-white rounded-xl border border-border p-6 shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Subscription</h3>
            {isActive ? (
              <div className="flex flex-col gap-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Plan</span>
                  <span className="font-extrabold">{user.subscriptions[0].type}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Status</span>
                  <span className="text-green-600 font-extrabold">Active</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground font-medium">Next Renewal</span>
                  <span className="font-semibold">{new Date(user.subscriptions[0].endDate).toLocaleDateString()}</span>
                </div>
                <button className="w-full py-2.5 border border-red-200 text-red-500 rounded-xl text-sm font-bold hover:bg-red-50 transition-colors">Cancel Subscription</button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                <p className="text-sm text-muted-foreground">Join the community and start winning while giving back.</p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => setSelectedPlan('MONTHLY')} 
                    className={`w-full text-left p-4 border rounded-xl transition-all ${selectedPlan === 'MONTHLY' ? 'border-primary ring-2 ring-primary/10 bg-indigo-50/10' : 'border-border hover:border-primary/50'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-base text-slate-900">Monthly</span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'MONTHLY' ? 'border-primary' : 'border-slate-300'}`}>
                        {selectedPlan === 'MONTHLY' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">$19.99/mo</span>
                  </button>
                  
                  <button 
                    onClick={() => setSelectedPlan('YEARLY')} 
                    className={`w-full text-left p-4 border-2 rounded-xl relative overflow-hidden transition-all ${selectedPlan === 'YEARLY' ? 'border-primary bg-indigo-50/30' : 'border-border hover:border-primary/50'}`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-base text-slate-900">Yearly</span>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'YEARLY' ? 'border-primary' : 'border-slate-300'}`}>
                        {selectedPlan === 'YEARLY' && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">$199.99/yr</span>
                    <span className="absolute top-2 right-2 bg-accent text-white text-[10px] px-2 py-0.5 rounded-full font-black uppercase">Save 20%</span>
                  </button>
                </div>

                <button 
                  onClick={handleSubscribe} 
                  disabled={isSubscribing}
                  className="w-full mt-2 py-3 bg-primary text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-primary-hover shadow-lg shadow-primary/20 disabled:opacity-70"
                >
                  {isSubscribing ? 'Processing...' : 'Proceed to Checkout'}
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Modal */}
      {showScoreModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000] p-5">
          <motion.div 
            className="bg-white p-8 rounded-2xl w-full max-w-[400px] shadow-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h3 className="text-2xl font-bold mb-6 text-foreground">Add New Score</h3>
            <form onSubmit={handleAddScore} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted-foreground">Stableford Points (1-45)</label>
                <input 
                  type="number" min="1" max="45"
                  value={newScore.value}
                  onChange={(e) => setNewScore({ ...newScore, value: parseInt(e.target.value) })}
                  required
                  className="w-full p-3 border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all text-lg font-bold"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-muted-foreground">Date of Play</label>
                <input 
                  type="date"
                  value={newScore.date}
                  onChange={(e) => setNewScore({ ...newScore, date: e.target.value })}
                  required
                  className="w-full p-3 border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-3 focus:ring-primary/10 transition-all"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button type="button" onClick={() => setShowScoreModal(false)} className="text-sm font-bold text-muted-foreground px-4 py-2">Cancel</button>
                <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary/20 transition-all hover:bg-primary-hover hover:-translate-y-0.5">Save Score</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
