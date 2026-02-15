import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Search, RefreshCcw, Loader2, FileText, Calendar, MapPin, AlertCircle, ExternalLink } from 'lucide-react';
import { useAuth } from 'react-oidc-context';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { dynamoReportsApi } from '@/lib/dynamoReportsApi';



const AdminReportsManager = () => {
    const auth = useAuth();
    const navigate = useNavigate();
    const { toast } = useToast();
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [clientFilter, setClientFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all');
    const [deleteConfirmation, setDeleteConfirmation] = useState({ isOpen: false, reportId: null, reportName: '' });

    const fetchReports = async () => {
        setIsLoading(true);
        try {
            const token = auth.user?.id_token;
            if (!token) return;
            const data = await dynamoReportsApi.listReports(token);
            setReports(data || []);
        } catch (error) {
            console.error('Error fetching reports:', error);
            toast({ title: "Error", description: "Failed to fetch reports from DynamoDB.", variant: "destructive" });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (auth.isAuthenticated) {
            fetchReports();
        }
    }, [auth.isAuthenticated]);

    // Derived filters options
    const clients = Array.from(new Set(reports.map(r => r.client).filter(Boolean))).sort();
    const projectTypes = Array.from(new Set(reports.map(r => r.projectType).filter(Boolean))).sort();

    const filteredReports = (reports || []).filter(r => {
        // Search term check
        const matchesSearch =
            (r.projectDetails?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (r.siteName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (r.reportId?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (r.id?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (r.client?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
            (r.projectType?.toLowerCase() || '').includes(searchTerm.toLowerCase());

        // Client filter check
        const matchesClient = clientFilter === 'all' || r.client === clientFilter;

        // Type filter check
        const matchesType = typeFilter === 'all' || r.projectType === typeFilter;

        // Date filter check
        let matchesDate = true;
        if (dateFilter !== 'all' && r.created_at) {
            const reportDate = new Date(r.created_at);
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
            const startOfYear = new Date(now.getFullYear(), 0, 1);

            if (dateFilter === 'this_month') {
                matchesDate = reportDate >= startOfMonth;
            } else if (dateFilter === 'last_month') {
                matchesDate = reportDate >= startOfLastMonth && reportDate <= endOfLastMonth;
            } else if (dateFilter === 'this_year') {
                matchesDate = reportDate >= startOfYear;
            }
        }

        return matchesSearch && matchesClient && matchesType && matchesDate;
    });

    const handleDeleteClick = (report) => {
        setDeleteConfirmation({
            isOpen: true,
            reportId: report.id,
            reportName: report.projectDetails || report.reportId || 'Untitled Report'
        });
    };

    const confirmDelete = async () => {
        if (deleteConfirmation.reportId) {
            try {
                const token = auth.user?.id_token;
                if (!token) throw new Error('Authentication required');

                await dynamoReportsApi.deleteReport(deleteConfirmation.reportId, token);
                toast({ title: "Report Deleted", description: "The report has been removed.", variant: "destructive" });
                fetchReports();
            } catch (error) {
                console.error(error);
                toast({ title: "Error", description: "Failed to delete report: " + error.message, variant: "destructive" });
            }
        }
        setDeleteConfirmation({ isOpen: false, reportId: null, reportName: '' });
    };

    const handleViewReport = (report) => {
        try {
            // Navigate to NewReportPage with the report data as state
            navigate('/new-report', { state: { editReport: report } });
        } catch (error) {
            console.error('Navigation error:', error);
            toast({ title: "Error", description: "Failed to open report for editing.", variant: "destructive" });
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="relative w-full sm:w-72">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Search Reports..."
                            className="pl-10"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <Button variant="ghost" size="icon" onClick={fetchReports} disabled={isLoading} title="Refresh List">
                            <RefreshCcw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-4 items-end bg-gray-50/50 p-4 rounded-lg border border-gray-100">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Client Name</label>
                        <Select value={clientFilter} onValueChange={setClientFilter}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="All Clients" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Clients</SelectItem>
                                {clients.map(client => (
                                    <SelectItem key={client} value={client}>{client}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Project Type</label>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="All Types" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {projectTypes.map(type => (
                                    <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 ml-1">Created Date</label>
                        <Select value={dateFilter} onValueChange={setDateFilter}>
                            <SelectTrigger className="bg-white">
                                <SelectValue placeholder="All Time" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Time</SelectItem>
                                <SelectItem value="this_month">This Month</SelectItem>
                                <SelectItem value="last_month">Last Month</SelectItem>
                                <SelectItem value="this_year">This Year</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {(clientFilter !== 'all' || typeFilter !== 'all' || dateFilter !== 'all' || searchTerm !== '') && (
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-gray-400 hover:text-gray-600 sm:w-min"
                            onClick={() => {
                                setClientFilter('all');
                                setTypeFilter('all');
                                setDateFilter('all');
                                setSearchTerm('');
                            }}
                        >
                            Reset Filters
                        </Button>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                            <tr>
                                <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Report Details</th>
                                <th className="text-right py-3 px-4 font-semibold text-sm text-gray-600 w-[120px]">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr>
                                    <td colSpan="2" className="py-12 text-center">
                                        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                                        <p className="mt-2 text-gray-500 text-sm">Loading reports...</p>
                                    </td>
                                </tr>
                            ) : filteredReports.length > 0 ? (
                                filteredReports.map((report) => (
                                    <tr key={report.id} className="border-b hover:bg-gray-50 transition-colors">
                                        <td className="py-3 px-4">
                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-700">
                                                <p className="font-medium text-gray-900 text-base">
                                                    {report.projectDetails || 'Untitled'}
                                                </p>

                                                <div className='w-full'>

                                                </div>


                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-gray-900">ID:</span>
                                                    <span className="text-gray-600">{report.reportId || report.id}</span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-gray-900">Client:</span>
                                                    <span className="text-gray-600">{report.client || '-'}</span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-gray-900">Project Type:</span>
                                                    <span className="text-gray-600">{report.projectType || '-'}</span>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-gray-900">Project Site:</span>
                                                    <div className="flex items-center text-gray-600">
                                                        <MapPin className="w-3 h-3 mr-1 text-primary/60" />
                                                        <span>{report.siteName || '-'}</span>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    <span className="font-semibold text-gray-900">Created On:</span>
                                                    <div className="flex items-center text-gray-600">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        {report.created_at ? new Date(report.created_at).toLocaleDateString() : '-'}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-right align-center">
                                            <div className="flex justify-end space-x-2">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-primary hover:text-primary-dark hover:bg-primary/10"
                                                    onClick={() => handleViewReport(report)}
                                                >
                                                    <ExternalLink className="w-4 h-4 mr-1" /> Open
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                                    onClick={() => handleDeleteClick(report)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="2" className="py-12 text-center text-gray-500">
                                        <FileText className="w-12 h-12 text-gray-200 mx-auto mb-3" />
                                        {searchTerm ? 'No reports found matching your search.' : 'No reports found.'}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AlertDialog open={deleteConfirmation.isOpen} onOpenChange={(isOpen) => !isOpen && setDeleteConfirmation({ isOpen: false, reportId: null, reportName: '' })}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center text-red-600">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            Delete Report?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete <span className="font-semibold text-gray-900">{deleteConfirmation.reportName}</span>?
                            This action cannot be undone and will permanently remove the report from the database.
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

export default AdminReportsManager;
