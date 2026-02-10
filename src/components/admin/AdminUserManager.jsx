
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/Table.jsx';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from '@/components/ui/select.jsx';
import { useToast } from '@/components/ui/use-toast.js';
import { Plus, UserPlus, RefreshCcw, UserCheck, UserX, Loader2 } from 'lucide-react';
import { auth } from '@/lib/auth';

const AdminUserManager = () => {
    const [users, setUsers] = useState([]);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        full_name: '',
        role: 'standard'
    });
    const { toast } = useToast();

    const fetchUsers = async () => {
        setIsLoading(true);
        const { users, error } = await auth.getUsers();
        if (error) {
            toast({ title: "Error", description: "Failed to fetch users.", variant: "destructive" });
        } else {
            setUsers(users);
        }
        setIsLoading(false);
    };

    useEffect(() => {
        fetchUsers();
        const session = auth.getSession();
        if (session && session.user) {
            setCurrentUserId(session.user.id);
            setCurrentUserRole(session.user.role);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (value) => {
        setFormData(prev => ({ ...prev, role: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const { user, error } = await auth.createUser(formData);

        if (error) {
            toast({
                title: "Error",
                description: error.message || "Failed to create user.",
                variant: "destructive"
            });
        } else {
            toast({ title: "Success", description: `User ${user.username} created successfully.` });
            setFormData({ username: '', password: '', full_name: '', role: 'standard' });
            fetchUsers();
        }
        setIsSubmitting(false);
    };

    const toggleUserStatus = async (userId, currentStatus) => {
        // Additional safeguard for admin role
        const userToToggle = users.find(u => u.id === userId);
        if (currentUserRole === 'admin' && userToToggle?.role === 'super_admin') {
            toast({ title: "Access Denied", description: "You cannot manage super_admin users.", variant: "destructive" });
            return;
        }

        const { success, error } = await auth.updateUserStatus(userId, !currentStatus);
        if (success) {
            toast({ title: "Success", description: "User status updated." });
            fetchUsers();
        } else {
            toast({ title: "Error", description: error.message || "Failed to update status.", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Add User Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-primary" />
                        Add New User
                    </CardTitle>
                    <CardDescription>Create a new administrative or standard user.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="johndoe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="full_name">Full Name</Label>
                            <Input
                                id="full_name"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleChange}
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select value={formData.role} onValueChange={handleRoleChange}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="standard">Standard</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    {currentUserRole === 'super_admin' && (
                                        <SelectItem value="super_admin">Super Admin</SelectItem>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary-dark text-white">
                            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                            Create User
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Users List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>User Directory</CardTitle>
                        <CardDescription>Manage active and inactive users.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={fetchUsers} disabled={isLoading}>
                        <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-8 h-8 animate-spin text-primary" />
                        </div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Username</TableHead>
                                        <TableHead>Full Name</TableHead>
                                        <TableHead>Role</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {users
                                        .filter(user => {
                                            // If current user is 'admin', hide 'super_admin' users
                                            if (currentUserRole === 'admin' && user.role === 'super_admin') {
                                                return false;
                                            }
                                            return true;
                                        })
                                        .map((user) => (
                                            <TableRow key={user.id}>
                                                <TableCell className="font-medium">{user.username}</TableCell>
                                                <TableCell>{user.full_name}</TableCell>
                                                <TableCell>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'
                                                        }`}>
                                                        {user.role}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`flex items-center gap-1 text-xs ${user.is_active ? 'text-green-600' : 'text-red-600'
                                                        }`}>
                                                        {user.is_active ? <UserCheck className="w-3 h-3" /> : <UserX className="w-3 h-3" />}
                                                        {user.is_active ? 'Active' : 'Inactive'}
                                                    </span>
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => toggleUserStatus(user.id, user.is_active)}
                                                        className={user.is_active ? "text-red-600 hover:text-red-700" : "text-green-600 hover:text-green-700"}
                                                        disabled={user.id === currentUserId}
                                                        title={user.id === currentUserId ? "You cannot deactivate yourself" : ""}
                                                    >
                                                        {user.is_active ? "Deactivate" : "Activate"}
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    {users.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                                                No users found.
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default AdminUserManager;
