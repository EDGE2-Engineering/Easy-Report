import React, { useState, useRef, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, Search, Download, Upload, AlertCircle, Mail, Phone, RefreshCcw, Loader2, Users } from 'lucide-react';
import { useAuth } from 'react-oidc-context';
import { sendTelegramNotification } from '@/lib/notifier';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { dynamoClientsApi } from '@/lib/dynamoClientsApi';

const AdminClientsManager = () => {
    const auth = useAuth();
    const { toast } = useToast();
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingClient, setEditingClient] = useState(null);
    const [isAddingNew, setIsAddingNew] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, clientId: null, clientName: '' });
    const fileImportRef = useRef(null);

    const fetchClients = async () => {
        setIsLoading(true);
        try {
            const token = auth.user?.id_token;
            if (!token) return;
            const data = await dynamoClientsApi.listClients(token);
            // Map DynamoDB fields (snake_case) to UI fields (camelCase)
            const mappedData = (data || []).map(c => ({
                id: c.id,
                clientName: c.client_name || '',
                clientAddress: c.client_address || '',
                email: c.email || '',
                phone: c.phone || ''
            }));
            setClients(mappedData);
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast({ title: "Error", description: "Failed to fetch clients from DynamoDB.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchClients();
        }
    }, [auth.isAuthenticated]);

    const filteredClients = (clients || []).filter(c =>
        (c.clientName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.clientAddress?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.phone?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.id?.toString()?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    );

    const handleEdit = (client) => {
        setEditingClient({ ...client });
        setIsAddingNew(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleAddNew = () => {
        setEditingClient({
            clientName: '',
            clientAddress: '',
            email: '',
            phone: ''
        });
        setIsAddingNew(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleSave = async () => {
        if (!editingClient.clientName) {
            toast({ title: "Validation Error", description: "Client Name is required.", variant: "destructive" });
            return;
        }

        setIsSaving(true);
        try {
            const token = auth.user?.id_token;
            if (!token) throw new Error('Authentication required');

            // Map UI fields (camelCase) back to DynamoDB fields (snake_case)
            const apiData = {
                client_name: editingClient.clientName,
                client_address: editingClient.clientAddress,
                email: editingClient.email,
                phone: editingClient.phone
            };

            if (isAddingNew) {
                await dynamoClientsApi.createClient(apiData, token);
                toast({ title: "Client Added", description: "New client has been successfully added." });

                // Telegram Notification
                const message = `👥 *New Client Added*\n\nName: \`${editingClient.clientName}\`\nAdded By: \`${auth.user?.profile?.name || auth.user?.profile?.email || 'Unknown'}\``;
                sendTelegramNotification(message);
            } else {
                await dynamoClientsApi.updateClient(editingClient.id, apiData, token);
                toast({ title: "Client Updated", description: "Client details have been updated." });

                // Telegram Notification
                const message = `✏️ *Client Updated*\n\nName: \`${editingClient.clientName}\`\nUpdated By: \`${auth.user?.profile?.name || auth.user?.profile?.email || 'Unknown'}\``;
                sendTelegramNotification(message);
            }
            setEditingClient(null);
            setIsAddingNew(false);
            fetchClients();
        } catch (error) {
            console.error(error);
            toast({ title: "Error", description: "Failed to save client. " + error.message, variant: "destructive" });
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteClick = (client) => {
        setDeleteConfirmation({
            isOpen: true,
            clientId: client.id,
            clientName: client.clientName
        });
    };

    const confirmDelete = async () => {
        if (deleteConfirmation.clientId) {
            try {
                const token = auth.user?.id_token;
                if (!token) throw new Error('Authentication required');

                await dynamoClientsApi.deleteClient(deleteConfirmation.clientId, token);
                toast({ title: "Client Deleted", description: "The client has been removed.", variant: "destructive" });

                // Telegram Notification
                const message = `🗑️ *Client Deleted*\n\nName: \`${deleteConfirmation.clientName}\`\nDeleted By: \`${auth.user?.profile?.name || auth.user?.profile?.email || 'Unknown'}\``;
                sendTelegramNotification(message);
                fetchClients();
            } catch (error) {
                console.error(error);
                toast({ title: "Error", description: "Failed to delete client: " + error.message, variant: "destructive" });
            }
        }
        setDeleteConfirmation({ isOpen: false, clientId: null, clientName: '' });
    };

    const handleChange = (field, value) => {
        setEditingClient(prev => ({ ...prev, [field]: value }));
    };

    const handleExport = () => {
        const dataStr = JSON.stringify(clients, null, 2);
        const blob = new Blob([dataStr], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `clients_backup_${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        toast({ title: "Export Successful", description: "Backup downloaded." });
    };

    const handleImportClick = () => {
        if (window.confirm("Warning: Importing data will help populate the list but you will need to save them manually to DynamoDB if you want them to persist. Do you want to continue?")) {
            fileImportRef.current?.click();
        }
    };

    const handleImportFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result);
                if (Array.isArray(importedData)) {
                    // Check if imported data has correct fields
                    const validData = importedData.map(c => ({
                        id: c.id || crypto.randomUUID(),
                        clientName: c.clientName || c.client_name || '',
                        clientAddress: c.clientAddress || c.client_address || '',
                        email: c.email || '',
                        phone: c.phone || ''
                    }));
                    setClients(validData);
                    toast({ title: "Import Successful", description: `Imported ${validData.length} clients locally. Note: These are not yet saved to DynamoDB.` });
                } else {
                    toast({ title: "Import Failed", description: "Invalid JSON format: Expected an array.", variant: "destructive" });
                }
            } catch (error) {
                console.error("Import error:", error);
                toast({ title: "Import Failed", description: "Could not parse JSON file.", variant: "destructive" });
            }
        };
        reader.readAsText(file);
        e.target.value = ''; // Reset input
    };

    if (editingClient) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-sm animate-in slide-in-from-right-4 duration-300">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-xl font-bold">{isAddingNew ? 'Add New Client' : 'Edit Client'}</h2>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => setEditingClient(null)} disabled={isSaving}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            className="bg-primary hover:bg-primary-dark flex items-center text-white"
                            disabled={isSaving}
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                        <Label>Client Name</Label>
                        <Input
                            value={editingClient.clientName || ''}
                            onChange={(e) => handleChange('clientName', e.target.value)}
                            placeholder="Enter client name"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Address</Label>
                        <Input
                            value={editingClient.clientAddress || ''}
                            onChange={(e) => handleChange('clientAddress', e.target.value)}
                            placeholder="Enter client address"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input
                                value={editingClient.email || ''}
                                onChange={(e) => handleChange('email', e.target.value)}
                                placeholder="Enter email"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input
                                value={editingClient.phone || ''}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="Enter phone"
                            />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                        placeholder="Search Clients..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                    <input
                        type="file"
                        ref={fileImportRef}
                        onChange={handleImportFile}
                        accept=".json"
                        className="hidden"
                    />
                    <Button variant="outline" onClick={handleImportClick} className="flex-1 sm:flex-none border-gray-300">
                        <Upload className="w-4 h-4 mr-2" /> Import
                    </Button>
                    <Button variant="outline" onClick={handleExport} className="flex-1 sm:flex-none border-gray-300">
                        <Download className="w-4 h-4 mr-2" /> Export
                    </Button>
                    <Button onClick={handleAddNew} className="flex-1 sm:flex-none bg-primary hover:bg-primary-dark text-white">
                        <Plus className="w-4 h-4 mr-2" /> Add Client
                    </Button>
                    <Button variant="ghost" size="icon" onClick={fetchClients} disabled={isLoading}>
                        <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Client Name</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Address</th>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Contact</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                                        <p className="mt-2 text-gray-500 text-sm">Loading clients...</p>
                                    </td>
                                </tr>
                            ) : filteredClients.length > 0 ? (
                                filteredClients.map((client) => (
                                    <tr key={client.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4 text-gray-800 font-medium text-sm">{client.clientName}</td>
                                        <td className="py-3 px-4 text-gray-600 text-xs max-w-xs truncate" title={client.clientAddress}>{client.clientAddress || '-'}</td>
                                        <td className="py-3 px-4 text-gray-600 text-xs">
                                            <div className="flex flex-col gap-1">
                                                {client.email && <span className="flex items-center"><Mail className="w-3 h-3 mr-2 text-blue-500" />{client.email}</span>}
                                                {client.phone && <span className="text-xs text-gray-500 flex items-center"><Phone className="w-3 h-3 mr-2 text-green-500" />{client.phone}</span>}
                                                {!client.email && !client.phone && <span className="text-gray-400">-</span>}
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <div className="flex justify-end space-x-1">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(client)}>
                                                    <Edit className="w-4 h-4 text-gray-600" />
                                                </Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(client)}>
                                                    <Trash2 className="w-4 h-4 text-red-500" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="py-12 text-center text-gray-500">
                                        <Users className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                        {searchTerm ? 'No clients found matching your search.' : 'No clients added yet.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(isOpen) => !isOpen && setDeleteConfirmation({ isOpen: false, clientId: null, clientName: '' })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center text-red-600">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Delete Client?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirmation.clientName}</span>?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
                            Yes, Delete It
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
};

export default AdminClientsManager;
