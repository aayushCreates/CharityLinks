import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';

const SubscriptionCancel: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-70px)] py-10 px-5 bg-muted">
      <motion.div 
        className="bg-white p-12 rounded-xl shadow-lg text-center max-w-[500px] w-full"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="mb-8 flex justify-center">
          <XCircle size={60} className="text-red-500" />
        </div>
        <h1 className="text-4xl font-extrabold mb-4 leading-tight">Checkout Cancelled</h1>
        <p className="text-muted-foreground text-lg mb-8">
          It looks like you didn't complete the checkout. No worries, 
          your account is still safe. You can try again whenever you're ready.
        </p>
        <div className="flex flex-col gap-4 items-center">
          <Link to="/dashboard" className="w-full inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary py-3.5 px-8 rounded-xl font-bold transition-all hover:bg-muted">
            <ArrowLeft size={18} /> Back to Dashboard
          </Link>
          <Link to="/dashboard" className="text-muted-foreground font-semibold text-sm hover:text-primary transition-colors">
            Choose a different plan
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionCancel;
