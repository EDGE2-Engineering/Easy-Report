
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/Table.jsx';
import { useToast } from '@/components/ui/use-toast.js';
import { Plus, Users, RefreshCcw, Trash2, Loader2, Building2 } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';

const AdminClientsManager = () => {
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        client_name: '',
        client_address: '',
        email: '',
        phone: ''
    });
    const { toast } = useToast();

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const { data, error } = await supabase
                .from('clients')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setClients(data || []);
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast({ title: "Error", description: "Failed to fetch clients.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const newClient = {
                id: crypto.randomUUID(),
                ...formData,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            const { error } = await supabase
                .from('clients')
                .insert([newClient]);

            if (error) throw error;

            toast({ title: "Success", description: "Client added successfully." });
            setFormData({ client_name: '', client_address: '', email: '', phone: '' });
            fetchClients();
        } catch (error) {
            console.error('Error adding client:', error);
            toast({
                title: "Error",
                description: error.message || "Failed to add client.",
                variant: "destructive"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this client?")) return;

        try {
            const { error } = await supabase
                .from('clients')
                .delete()
                .eq('id', id);

            if (error) throw error;

            toast({ title: "Success", description: "Client deleted successfully." });
            fetchClients();
        } catch (error) {
            console.error('Error deleting client:', error);
            toast({ title: "Error", description: "Failed to delete client.", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Add Client Form */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-primary" />
                        Add New Client
                    </CardTitle>
                    <CardDescription>Register a new client for reports and billing.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
                        <div className="space-y-2">
                            <Label htmlFor="client_name">Client Name *</Label>
                            <Input
                                id="client_name"
                                name="client_name"
                                value={formData.client_name}
                                onChange={handleChange}
                                placeholder="e.g. Acme Corp"
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="contact@acme.com"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+91 98765 43210"
                            />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="client_address">Address</Label>
                            <Textarea
                                id="client_address"
                                name="client_address"
                                value={formData.client_address}
                                onChange={handleChange}
                                placeholder="Full billing address"
                                className="h-20"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Button type="submit" disabled={isSubmitting} className="bg-primary hover:bg-primary-dark text-white w-full md:w-auto">
                                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                Add Client
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>

            {/* Clients List */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                    <div>
                        <CardTitle>Client Directory</CardTitle>
                        <CardDescription>Manage your registered clients.</CardDescription>
                    </div>
                    <Button variant="ghost" size="icon" onClick={fetchClients} disabled={isLoading}>
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
                                        <TableHead>Client Name</TableHead>
                                        <TableHead>Address</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead className="text-right">Action</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {clients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="font-medium align-top">{client.client_name}</TableCell>
                                            <TableCell className="max-w-xs truncate align-top" title={client.client_address}>
                                                {client.client_address || '-'}
                                            </TableCell>
                                            <TableCell className="align-top">
                                                <div className="flex flex-col text-sm">
                                                    {client.email && <span>{client.email}</span>}
                                                    {client.phone && <span className="text-gray-500">{client.phone}</span>}
                                                    {!client.email && !client.phone && <span className="text-gray-400">-</span>}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right align-top">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(client.id)}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                    {clients.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                No clients found. Add your first client above.
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

export default AdminClientsManager;
