import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMenu, FiX, FiLogOut } from 'react-icons/fi';
import useAuthStore from '../../store/authStore';
import Button from '../common/Button';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { token, user, logout , role } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="text-3xl">🐝</span>
            <span className="text-2xl font-bold text-secondary">Work<span className="text-primary">Bee</span></span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-dark font-medium hover:text-primary transition">Home</Link>
            <Link to="/services" className="text-dark font-medium hover:text-primary transition">Services</Link>
            <Link to="/how-it-works" className="text-dark font-medium hover:text-primary transition">How It Works</Link>
            <Link to="/contact" className="text-dark font-medium hover:text-primary transition">Contact</Link>

            {token ? (
              <>
                <Link to={user?.role === 'worker' ? '/worker-dashboard' : '/customer-dashboard'}
                  className="text-dark font-medium hover:text-primary transition">
                  Dashboard
                </Link>
                {role==="worker" && (
                  <Button variant="outline" onClick={() => navigate('/become-worker')}>Register skills</Button>
                )
                }
                {user?.role === 'admin' && (
                  <Link to="/admin-dashboard" className="text-dark font-medium hover:text-primary transition">Admin</Link>
                )}
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <FiLogOut /> Logout
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
                <Button variant="primary" onClick={() => navigate('/login')}>Sign Up</Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link to="/" onClick={() => setMobileOpen(false)} className="block px-2 py-2 hover:bg-light rounded font-medium">Home</Link>
            <Link to="/services" onClick={() => setMobileOpen(false)} className="block px-2 py-2 hover:bg-light rounded font-medium">Services</Link>
            <Link to="/how-it-works" onClick={() => setMobileOpen(false)} className="block px-2 py-2 hover:bg-light rounded font-medium">How It Works</Link>
            <Link to="/contact" onClick={() => setMobileOpen(false)} className="block px-2 py-2 hover:bg-light rounded font-medium">Contact</Link>

            {token ? (
              <>
                <Link to={user?.role === 'worker' ? '/worker-dashboard' : '/customer-dashboard'}
                  onClick={() => setMobileOpen(false)}
                  className="block px-2 py-2 hover:bg-light rounded font-medium">
                  Dashboard
                </Link>
                <Button
                  variant="danger"
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="w-full"
                >
                  Logout
                </Button>
              </>
            ) : (
              <div className="space-y-2">
                <Button variant="outline" className="w-full" onClick={() => { navigate('/login'); setMobileOpen(false); }}>Login</Button>
                <Button variant="primary" className="w-full" onClick={() => { navigate('/login'); setMobileOpen(false); }}>Sign Up</Button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
