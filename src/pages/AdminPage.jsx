
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, LogOut, Loader2, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';

import AdminSettings from '@/components/admin/AdminSettings';
import AdminLogin from '@/components/admin/AdminLogin';
import UpdatePassword from '@/components/admin/UpdatePassword';
import { useToast } from '@/components/ui/use-toast';

import { auth } from '@/lib/auth';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false);
  const navigate = useNavigate();

  const { toast } = useToast();

  useEffect(() => {
    // Check active session
    const session = auth.getSession();
    if (session && session.user && session.user.role === 'standard') {
      navigate('/new-report');
      return;
    }
    setIsAuthenticated(!!session);
    setCheckingAuth(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    toast({ title: "Welcome back", description: "You have successfully logged in." });
    navigate('/new-report');
  };

  const handleLogout = () => {
    auth.signOut();
    toast({ title: "Logged Out", description: "See you next time." });
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isPasswordRecovery) {
    return (
      <>
        <Helmet>
          <title>Reset Password | EDGE2 Easy Report</title>
        </Helmet>
        <UpdatePassword />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Admin Login | EDGE2 Easy Report</title>
        </Helmet>
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Settings | EDGE2 Easy Report</title>
      </Helmet>

      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 relative">
        {/* <div className="flex flex-col mb-8 gap-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your account and security settings</p>
        </div> */}

        <AdminSettings />
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
