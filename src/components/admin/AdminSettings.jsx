
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { UserCog, Lock, Save, Loader2, ShieldCheck, Eye, EyeOff, FileText } from 'lucide-react';
import { useAuth } from 'react-oidc-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx';
import AdminUserManager from './AdminUserManager.jsx';
import AdminClientsManager from './AdminClientsManager.jsx';
import AdminReportsManager from './AdminReportsManager.jsx';

const PasswordField = ({ id, label, value, onChange, show, setShow, placeholder, icon: Icon, required = false }) => (
    <div className="space-y-2">
        <Label htmlFor={id} className={required ? "text-primary font-semibold" : ""}>{label}</Label>
        <div className="relative">
            <Icon className={`absolute left-3 top-3 h-4 w-4 ${required ? "text-primary" : "text-gray-500"}`} />
            <Input
                id={id}
                name={id}
                type={show ? "text" : "password"}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className={`pl-10 pr-10 ${required ? "border-primary/20 focus-visible:ring-primary" : ""}`}
                required={required}
            />
            <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
        </div>
    </div>
);

const AdminSettings = () => {
    const auth = useAuth();
    const [currentUsername, setCurrentUsername] = useState('');
    const [currentUserEmail, setCurrentUserEmail] = useState('');
    const [userRole, setUserRole] = useState('standard');
    const { toast } = useToast();

    useEffect(() => {
        // Get user info from Cognito
        if (auth.isAuthenticated && auth.user?.profile) {
            const profile = auth.user.profile;
            setCurrentUsername(profile.name || profile.email || '');
            setCurrentUserEmail(profile.email || '');
            setUserRole(profile['custom:role'] || profile.role || 'standard');
        }
    }, [auth.isAuthenticated, auth.user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            toast({ title: "Error", description: "New passwords do not match.", variant: "destructive" });
            setIsLoading(false);
            return;
        }

        try {
            // Verify current password by attempting a sign-in
            const { user, error: signInError } = await auth.signIn(currentUserEmail, formData.currentPassword);

            if (signInError || !user) {
                toast({ title: "Authentication Failed", description: "Incorrect current password.", variant: "destructive" });
                setIsLoading(false);
                return;
            }

            // Update password if new password is provided
            if (formData.newPassword) {
                const { success, error: updateError } = await auth.updatePassword(formData.newPassword);

                if (updateError || !success) throw updateError || new Error('Failed to update password');

                toast({ title: "Success", description: "Password updated successfully." });
                setFormData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast({ title: "Info", description: "No changes to save." });
            }

        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: error.message || "Something went wrong.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    const renderSecuritySection = () => (
        <Card>

        </Card>
    );

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <UserCog className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Settings</h2>
                    {/* <p className="text-gray-500">Manage your account and site preferences</p> */}
                </div>
            </div>

            <Tabs defaultValue="reports" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                    <TabsTrigger value="users" className="flex items-center gap-2">
                        <UserCog className="w-4 h-4" />
                        Profile
                    </TabsTrigger>
                    <TabsTrigger value="clients" className="flex items-center gap-2">
                        <UserCog className="w-4 h-4" />
                        Clients
                    </TabsTrigger>
                    <TabsTrigger value="reports" className="flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Reports
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="reports" className="mt-0">
                    <AdminReportsManager />
                </TabsContent>
                <TabsContent value="users" className="mt-0">
                    <AdminUserManager />
                </TabsContent>
                <TabsContent value="clients" className="mt-0">
                    <AdminClientsManager />
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default AdminSettings;
