
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, LogOut, Loader2, UserCog } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from 'react-oidc-context';
import { cognitoConfig } from '@/config';
import logo from '@/assets/edge2-logo.png';

import AdminSettings from '@/components/admin/AdminSettings';
import { useToast } from '@/components/ui/use-toast';

const AdminPage = () => {
  const auth = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    // Role matching is no longer used for page-level redirects
    // Keeping this useEffect block empty or removing it if no other logic is needed
  }, [auth.isAuthenticated, auth.user, navigate]);

  const handleSignOut = async () => {
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

  // Handle loading state
  if (auth.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  // Handle authentication errors
  if (auth.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{auth.error.message}</p>
          <Button onClick={() => auth.signinRedirect()}>Try Again</Button>
        </div>
      </div>
    );
  }

  // Show sign-in button if not authenticated
  if (!auth.isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Admin Login | EDGE2 Easy Report</title>
        </Helmet>
        <div className="min-h-screen flex items-center justify-center bg-[#F5F1ED]">
          <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
            <img src={logo} alt="EDGE2 Logo" className="w-24 h-auto object-contain mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">
              Easy Report
            </h1>
            <p className="text-gray-600 mb-6 text-center">
              Sign in to access the admin dashboard
            </p>
            <Button
              onClick={() => auth.signinRedirect()}
              className="w-full"
              size="lg"
            >
              Sign in
            </Button>
          </div>
        </div>
      </>
    );
  }

  // Authenticated view
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Helmet>
        <title>Settings | EDGE2 Easy Report</title>
      </Helmet>

      <Navbar />

      <main className="flex-grow px-4 py-12 relative">
        <AdminSettings />
      </main>

      <Footer />
    </div>
  );
};

export default AdminPage;
