import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Heart, Trophy, Users, ArrowRight, ShieldCheck } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="pb-20">
      <section className="flex flex-col items-center text-center py-24 px-5 bg-gradient-to-br from-primary/5 to-secondary/5 border-b border-border">
        <motion.div 
          className="max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-7xl font-extrabold text-foreground leading-[1.1] mb-6">
            Play for a <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Purpose</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Track your golf performance, compete in monthly draws, and support the causes you care about. 
            All in one modern platform designed for impact.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register" className="bg-primary text-white py-3.5 px-8 rounded-xl font-bold flex items-center justify-center gap-2 transition-all hover:bg-primary-hover hover:-translate-y-0.5">
              Start Your Journey <ArrowRight size={20} />
            </Link>
            <Link to="/charities" className="bg-white text-primary py-3.5 px-8 rounded-xl font-bold border border-primary transition-all hover:bg-muted">
              Explore Charities
            </Link>
          </div>
        </motion.div>
        
        <div className="flex flex-wrap gap-10 mt-20 justify-center">
          {[
            { icon: Heart, color: 'text-secondary', bg: 'bg-white', label: 'Raised for Charity', value: '$1.2M+' },
            { icon: Trophy, color: 'text-amber-500', bg: 'bg-white', label: 'Monthly Winners', value: '500+' },
            { icon: Users, color: 'text-primary', bg: 'bg-white', label: 'Active Players', value: '10k+' }
          ].map((stat, i) => (
            <div key={i} className={`${stat.bg} flex items-center gap-4 p-6 px-8 rounded-xl shadow-sm border border-border`}>
              <stat.icon className={`w-10 h-10 ${stat.color}`} />
              <div className="text-left">
                <h3 className="text-2xl font-extrabold">{stat.value}</h3>
                <p className="text-muted-foreground text-sm m-0">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 px-5 max-w-6xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold mb-16">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[
            { n: 1, title: 'Subscribe', desc: 'Choose a monthly or yearly plan. A portion of every fee goes directly to your chosen charity.' },
            { n: 2, title: 'Enter Scores', desc: 'Log your last 5 Stableford scores. Our system tracks your performance automatically.' },
            { n: 3, title: 'Win & Give', desc: 'Participate in monthly prize draws. The more you play, the more impact you create.' }
          ].map((step) => (
            <div key={step.n} className="p-10 bg-white rounded-xl border border-border transition-transform hover:-translate-y-1">
              <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-extrabold mx-auto mb-6">
                {step.n}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-muted-foreground">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto py-24 px-5 grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div>
          <h2 className="text-4xl font-extrabold mb-6">Transparency & Trust</h2>
          <p className="text-lg text-muted-foreground mb-8">
            We believe in complete transparency. Every dollar contributed is tracked and verified. 
            You can see exactly how your subscription is making a difference.
          </p>
          <ul className="flex flex-col gap-4">
            {['Verified Charity Partners', 'Real-time Contribution Tracking', 'Secure Stripe Payments'].map((item) => (
              <li key={item} className="flex items-center gap-3 font-semibold text-foreground">
                <ShieldCheck size={20} className="text-accent" /> {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full aspect-square bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center">
          <Heart size={80} className="text-secondary" />
        </div>
      </section>
    </div>
  );
};

export default Home;
