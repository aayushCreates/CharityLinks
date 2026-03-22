import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Trophy, Heart, User, LogOut, LayoutDashboard, Settings } from 'lucide-react';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="h-[70px] bg-white border-b border-border sticky top-0 z-[100]">
      <div className="max-w-[1200px] mx-auto h-full px-5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-2xl font-black text-primary">
          <Trophy className="text-primary" />
          <span>CharityLinks</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link to="/charities" className="flex items-center gap-2 text-muted-foreground font-semibold transition-colors hover:text-primary">
            <Heart size={18} />
            <span className="hidden sm:inline">Charities</span>
          </Link>

          {user ? (
            <>
              <Link to="/dashboard" className="flex items-center gap-2 text-muted-foreground font-semibold transition-colors hover:text-primary">
                <LayoutDashboard size={18} />
                <span className="hidden sm:inline">Dashboard</span>
              </Link>
              {user.isAdmin && (
                <Link to="/admin" className="flex items-center gap-2 text-muted-foreground font-semibold transition-colors hover:text-primary">
                  <Settings size={18} />
                  <span className="hidden sm:inline">Admin</span>
                </Link>
              )}
              <div className="flex items-center gap-4 pl-4 border-l border-border">
                <div className="flex items-center gap-2 text-foreground font-bold">
                  <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                  <span className="hidden md:inline">{user.name}</span>
                </div>
                <button onClick={handleLogout} className="text-muted-foreground transition-colors hover:text-secondary">
                  <LogOut size={18} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="text-primary px-5 py-2 rounded-xl font-bold border border-primary transition-all hover:bg-muted">Login</Link>
              <Link to="/register" className="bg-primary text-white px-5 py-2 rounded-xl font-bold transition-colors hover:bg-primary-hover">Join Now</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
