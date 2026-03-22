import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Search, ExternalLink } from 'lucide-react';

const CharityDirectory: React.FC = () => {
  const [charities, setCharities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchCharities = async () => {
      try {
        const response = await api.get('/charities');
        setCharities(response.data.data);
      } catch (err) {
        console.error('Error fetching charities:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCharities();
  }, []);

  const filteredCharities = charities.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1200px] mx-auto py-16 px-5">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-extrabold mb-4">Charity Partners</h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">Discover the organizations making a difference around the world.</p>
        
        <div className="max-w-[600px] mx-auto relative group">
          <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or cause..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 border border-border rounded-full text-base bg-white shadow-sm transition-all focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/5"
          />
        </div>
      </header>

      {loading ? (
        <div className="text-center py-20 text-xl font-semibold text-muted-foreground">Discovering charities...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCharities.map((charity) => (
            <motion.div 
              key={charity.id} 
              className="bg-white rounded-xl border border-border overflow-hidden transition-all hover:-translate-y-2 hover:shadow-xl group"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="w-full h-[200px] bg-muted relative overflow-hidden">
                {charity.image ? (
                  <img src={charity.image} alt={charity.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-muted to-border" />
                )}
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{charity.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3 mb-6">{charity.description}</p>
                <div className="flex justify-between items-center">
                  <button className="bg-primary text-white py-2 px-5 rounded-xl text-sm font-bold transition-colors hover:bg-primary-hover shadow-md shadow-primary/10">
                    Select Charity
                  </button>
                  <a href="#" className="text-muted-foreground text-sm font-bold flex items-center gap-1.5 hover:text-primary transition-colors">
                    Learn More <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CharityDirectory;
