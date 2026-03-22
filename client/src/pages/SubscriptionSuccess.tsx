import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Heart } from 'lucide-react';

const SubscriptionSuccess: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-70px)] py-10 px-5 bg-muted">
      <motion.div 
        className="bg-white p-12 rounded-xl shadow-lg text-center max-w-[500px] w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="mb-8 flex justify-center">
          <CheckCircle2 size={60} className="text-accent" />
        </div>
        <h1 className="text-4xl font-extrabold mb-4 leading-tight">Welcome to the Community!</h1>
        <p className="text-muted-foreground text-lg mb-8">
          Your subscription was successful. You're now part of a movement 
          that combines the love of golf with meaningful charitable impact.
        </p>
        <div className="flex items-center justify-center gap-2.5 text-secondary bg-pink-50 py-3 px-5 rounded-full font-bold text-sm mb-10">
          <Heart size={20} />
          <span>Your contribution is already making a difference.</span>
        </div>
        <Link to="/dashboard" className="w-full inline-flex items-center justify-center gap-2 bg-primary text-white py-3.5 px-8 rounded-xl font-bold transition-all hover:bg-primary-hover shadow-lg shadow-primary/20">
          Go to Dashboard <ArrowRight size={18} />
        </Link>
      </motion.div>
    </div>
  );
};

export default SubscriptionSuccess;
