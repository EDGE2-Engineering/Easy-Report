import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Lock, ClipboardCheck, LogOut, Settings, User } from 'lucide-react';
import { useAuth } from 'react-oidc-context';
import { Button } from '@/components/ui/button.jsx';
import { useToast } from '@/components/ui/use-toast.js';
import { cognitoConfig } from '@/config';
import logo from '@/assets/edge2-logo.png';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const auth = useAuth();
  const location = useLocation();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      // 1. Remove user from OIDC context
      await auth.removeUser();

      // 2. Clear all local storage and session storage to remove stale auth data
      localStorage.clear();
      sessionStorage.clear();

      // 3. Redirect to Cognito logout endpoint
      window.location.href = cognitoConfig.getLogoutUrl();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, still try to redirect to Cognito logout
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = cognitoConfig.getLogoutUrl();
    }
  };

  // Get user info from Cognito
  const getUserRole = () => {
    if (!auth.isAuthenticated || !auth.user?.profile) return 'standard';
    return auth.user.profile['custom:role'] || auth.user.profile.role || 'standard';
  };

  const getUserName = () => {
    if (!auth.isAuthenticated || !auth.user?.profile) return '';
    // Check for custom Cognito attributes first, then standard attributes
    return auth.user.profile['custom:full_name'] ||
      auth.user.profile['custom:name'] ||
      auth.user.profile.name ||
      auth.user.profile.email || '';
  };

  const navItems = [
    { path: '/new-report', label: 'New Report', icon: ClipboardCheck },
    { path: '/', label: 'Settings', icon: Settings },
  ].filter(item => auth.isAuthenticated);

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="EDGE2 Logo" className="w-8 h-auto object-contain" />
            <span className="text-xl font-bold text-gray-900 hidden md:inline-block">
              {"Easy Report"}
            </span>
            <span className="text-md font-bold text-gray-900 sm:hidden">
              {"Easy Report"}
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 transition-colors text-sm font-medium ${isActive(item.path)
                  ? 'text-primary'
                  : 'text-gray-700 hover:text-primary'
                  }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            ))}

            {auth.isAuthenticated && (
              <div className="flex items-center gap-4 pl-4 border-l border-gray-100">
                <div className="flex items-center gap-2 text-xs font-medium text-blue-500 bg-blue-50 px-3 py-1.5 rounded-full border border-gray-100">
                  <User className="w-3 h-3" />
                  <span>{getUserName()}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-3"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            )}
          </div>

          <div className="flex items-center md:hidden gap-4">
            <button
              className="text-gray-700"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${isActive(item.path)
                    ? 'bg-primary text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                    }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}

              {auth.isAuthenticated && (
                <div className="pt-4 mt-4 border-t border-gray-100 space-y-3 px-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
                    <User className="w-4 h-4 text-primary" />
                    <span>{getUserName()}</span>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full text-red-600 border-red-100 hover:bg-red-50 justify-start"
                    onClick={handleLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
