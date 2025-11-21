import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  BarChart3,
  LayoutDashboard,
  Upload,
  Link2,
  LogOut,
  Menu,
  X,
  User
} from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';
import '../styles/Navigation.css';

const Navigation = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/connect-account', label: 'Connect Account', icon: Link2 },
    { path: '/upload', label: 'Upload CSV', icon: Upload }
  ];

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <nav className="navigation">
      <div className="nav-container">
        {/* Logo */}
        <div className="nav-brand" onClick={() => handleNavigation('/')}>
          <BarChart3 size={28} />
          <span>AI Ad Analytics</span>
        </div>

        {/* Desktop Navigation */}
        <div className="nav-links desktop-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Desktop Actions */}
        <div className="nav-actions desktop-nav">
          <DarkModeToggle />
          <div className="nav-user">
            <User size={18} />
            <span>{user?.email}</span>
          </div>
          <button onClick={handleLogout} className="nav-logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu">
          <div className="mobile-nav-links">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`mobile-nav-link ${isActive(item.path) ? 'active' : ''}`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
          <div className="mobile-nav-footer">
            <div className="mobile-user-info">
              <User size={18} />
              <span>{user?.email}</span>
            </div>
            <DarkModeToggle />
            <button onClick={handleLogout} className="mobile-logout">
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;
