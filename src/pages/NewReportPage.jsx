
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { AlertCircle, Save, Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const NewReportPage = () => {
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        projectType: '',
        reportId: '',
        projectDetails: 'GBT 40m',
        client: '',
        clientAddress: '',
        latitude: '',
        longitude: '',
        siteId: '',
        anchorId: '',
        siteName: '',
        siteAddress: '',
        surveyDate: '',
        groundWaterTable: '',
        sbcValue1: '',
        sbcValue2: '',
        sbcValue3: '',
        sbcValue4: '',
        isCodes: [
            { key: 'Natural water content', value: 'IS:2720 - (Part 2) - 1973' },
            { key: 'Grain size analysis', value: 'IS:2720 - (Part 4) - 1985' },
            { key: 'Atterberg Limits', value: 'IS:2720 - (Part 5) - 1985' },
            { key: 'Field density', value: 'IS:2720 - (Part 10) - 1993' },
            { key: 'Specific Gravity', value: 'IS:2720 - (Part 3) - 1980' },
            { key: 'Standard penetration test (SPT)', value: 'IS:2131 - 1981' },
            { key: 'Shear strength parameters', value: 'IS:2720 - (Part 13) - 1986' },
            { key: 'Free Swell Index', value: 'IS:2720 - (Part 40) - 1977' },
            { key: 'Chemical Analysis', value: 'IS:2720 - (Part 26) - 1987 & (Part 27) - 1977' },
            { key: 'Foundation design on rock', value: 'IS:12070 - 1987' },
            { key: 'Breaking Capacity of Shallow Foundation', value: 'IS:6403 - 1981' },
            { key: 'Settlement of Foundation', value: 'IS:8009 - 1976' },
            { key: 'Soil Classification', value: 'IS:1498 - 1970' },
            { key: 'Point Load Index of Rock', value: 'IS:8764 - 1998' },
            { key: 'Qualitative Classification System of Rock Mass', value: 'IS:13365 - (Part 1) - 1998' }
        ],
        surveyReport: [
            { key: 'Weather condition', value: '' },
            { key: 'Site Dimension', value: '' },
            { key: 'Ground or seepage water', value: '' },
            { key: 'Site to main road distance', value: '' },
            { key: 'Terrain Details (Agriculture/Hilly/Plain)', value: '' },
            { key: 'Proper road access availability', value: '' },
            { key: 'Electric lines/Pole distance', value: '' },
            { key: 'Transformers', value: '' },
            { key: 'High tension line', value: '' },
            { key: 'Schools, hospital, residential, etc.', value: '' },
            { key: 'Mobile towers', value: '' },
            { key: 'Railway track', value: '' },
            { key: 'Water bodies', value: '' },
            { key: 'Well', value: '' },
            { key: 'Existing or under-construction building', value: '' },
            { key: 'Tree cutting', value: '' },
            { key: 'Site levels', value: '' }
        ],
        surveyReportNote: '',
        includeSurveyReportNote: false,
        reportCreatedOn: new Date().toISOString().split('T')[0]
    });
    const [sitePhotoPreview, setSitePhotoPreview] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleIsCodeChange = (index, field, value) => {
        const newIsCodes = [...formData.isCodes];
        newIsCodes[index][field] = value;
        setFormData(prev => ({
            ...prev,
            isCodes: newIsCodes
        }));
    };

    const addIsCode = () => {
        setFormData(prev => ({
            ...prev,
            isCodes: [...prev.isCodes, { key: '', value: '' }]
        }));
    };

    const removeIsCode = (index) => {
        if (formData.isCodes.length > 1) {
            const newIsCodes = formData.isCodes.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                isCodes: newIsCodes
            }));
        }
    };

    const handleSurveyReportChange = (index, field, value) => {
        const newSurveyReport = [...formData.surveyReport];
        newSurveyReport[index][field] = value;
        setFormData(prev => ({
            ...prev,
            surveyReport: newSurveyReport
        }));
    };

    const addSurveyReport = () => {
        setFormData(prev => ({
            ...prev,
            surveyReport: [...prev.surveyReport, { key: '', value: '' }]
        }));
    };

    const removeSurveyReport = (index) => {
        if (formData.surveyReport.length > 1) {
            const newSurveyReport = formData.surveyReport.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                surveyReport: newSurveyReport
            }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSitePhotoPreview(reader.result);
                setFormData(prev => ({
                    ...prev,
                    sitePhoto: file
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);

        // Simulating API call/submission
        toast({
            title: "Report Created",
            description: "The new report has been successfully generated.",
            className: "bg-green-50 border-green-200 text-green-900",
        });
    };

    return (
        <div className="min-h-screen bg-[#F5F1ED] flex flex-col">
            <Helmet>
                <title>New Report | EDGE2 MTR</title>
            </Helmet>

            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <div className="w-full">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Create New Report</h1>
                        <p className="text-gray-500 mt-2">Enter the site details below to generate a new automated test report.</p>
                    </div>

                    <Card className="shadow-lg border-gray-200">
                        <CardHeader className="bg-gray-50/50 border-b border-gray-100">
                            <CardTitle className="text-xl text-primary">Report Details</CardTitle>
                            <CardDescription>All fields are required for accurate report generation.</CardDescription>
                        </CardHeader>
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-8">

                                {/* Section 1: Site Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Site Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                        <div className="space-y-2">
                                            <Label htmlFor="projectType">Project Type</Label>
                                            <Select
                                                value={formData.projectType}
                                                onValueChange={(value) => handleChange({ target: { name: 'projectType', value } })}
                                            >
                                                <SelectTrigger id="projectType">
                                                    <SelectValue placeholder="Select Project Type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="tower">Tower</SelectItem>
                                                    <SelectItem value="others">Others</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>



                                        <div className="space-y-2">
                                            <Label htmlFor="reportId">Report ID</Label>
                                            <Input
                                                id="reportId"
                                                name="reportId"
                                                placeholder="e.g. RPT-001"
                                                value={formData.reportId}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="projectDetails">Project Details</Label>
                                            <Input
                                                id="projectDetails"
                                                name="projectDetails"
                                                placeholder="e.g. GBT 40m"
                                                value={formData.projectDetails}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="client">Client</Label>
                                            <Input
                                                id="client"
                                                name="client"
                                                placeholder="Enter client name here"
                                                value={formData.client}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="clientAddress">Client Address</Label>
                                            <Input
                                                id="clientAddress"
                                                name="clientAddress"
                                                placeholder="Enter client address here"
                                                value={formData.clientAddress}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="latitude">Latitude</Label>
                                            <Input
                                                id="latitude"
                                                name="latitude"
                                                placeholder="Enter latitude here"
                                                value={formData.latitude}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="longitude">Longitude</Label>
                                            <Input
                                                id="longitude"
                                                name="longitude"
                                                placeholder="Enter longitude here"
                                                value={formData.longitude}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="siteId">Site ID</Label>
                                            <Input
                                                id="siteId"
                                                name="siteId"
                                                placeholder="Enter site ID here"
                                                value={formData.siteId}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="anchorId">Anchor ID/Indus ID</Label>
                                            <Input
                                                id="anchorId"
                                                name="anchorId"
                                                placeholder="Enter anchor ID/Indus ID here"
                                                value={formData.anchorId}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="siteName">Site Name</Label>
                                            <Input
                                                id="siteName"
                                                name="siteName"
                                                placeholder="Enter site name here"
                                                value={formData.siteName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="surveyDate">Survey Date</Label>
                                            <Input
                                                id="surveyDate"
                                                name="surveyDate"
                                                type="date"
                                                value={formData.surveyDate}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="siteAddress">Site Address</Label>
                                            <Textarea
                                                id="siteAddress"
                                                name="siteAddress"
                                                placeholder="Enter site address here"
                                                value={formData.siteAddress}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="space-y-2 md:col-span-2">
                                            <Label htmlFor="sitePhoto">Google Maps Site Photo</Label>
                                            <div className="flex flex-col gap-4">
                                                <Input
                                                    id="sitePhoto"
                                                    name="sitePhoto"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className="cursor-pointer"
                                                />
                                                {sitePhotoPreview && (
                                                    <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-gray-200">
                                                        <img
                                                            src={sitePhotoPreview}
                                                            alt="Site Preview"
                                                            className="object-cover w-full h-full"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* Section 2: IS Codes */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">IS Codes</h3>
                                    <div className="space-y-1">
                                        <div className="grid grid-cols-12 gap-4 mb-2">
                                            <div className="col-span-5 text-sm font-medium text-gray-500">Code</div>
                                            <div className="col-span-6 text-sm font-medium text-gray-500">Value</div>
                                            <div className="col-span-1"></div>
                                        </div>
                                        {formData.isCodes.map((code, index) => (
                                            <div key={index} className="grid grid-cols-12 gap-4 items-start bg-gray-50/50 p-0 rounded-md">
                                                <div className="col-span-5">
                                                    <Input
                                                        placeholder="e.g. Concrete Mix"
                                                        value={code.key}
                                                        onChange={(e) => handleIsCodeChange(index, 'key', e.target.value)}
                                                        className="bg-white"
                                                    />
                                                </div>
                                                <div className="col-span-6">
                                                    <Textarea
                                                        placeholder="e.g. IS 456"
                                                        value={code.value}
                                                        onChange={(e) => handleIsCodeChange(index, 'value', e.target.value)}
                                                        className="min-h-[40px] bg-white resize-y"
                                                        rows={1}
                                                    />
                                                </div>
                                                <div className="col-span-1 flex justify-center pt-2">
                                                    {formData.isCodes.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeIsCode(index)}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={addIsCode}
                                            className="mt-2 text-primary border-dashed border-primary/50 hover:bg-primary/5 hover:text-primary-dark hover:border-primary bg-green-50"
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> Add IS Code
                                        </Button>
                                    </div>
                                </div>

                                {/* Section 3: Survey Report */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Survey Report</h3>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <Checkbox
                                                id="includeSurveyReportNote"
                                                checked={formData.includeSurveyReportNote}
                                                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeSurveyReportNote: checked }))}
                                            />
                                            <label
                                                htmlFor="includeSurveyReportNote"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Include Survey Report Details
                                            </label>
                                        </div>

                                        {formData.includeSurveyReportNote && (
                                            <div className="space-y-1 animate-in fade-in slide-in-from-top-1 pl-6 border-l-2 border-gray-100 ml-2">
                                                <div className="grid grid-cols-12 gap-4 mb-2">
                                                    <div className="col-span-5 text-sm font-medium text-gray-500">Parameter</div>
                                                    <div className="col-span-6 text-sm font-medium text-gray-500">Observation/Value</div>
                                                    <div className="col-span-1"></div>
                                                </div>
                                                {formData.surveyReport.map((item, index) => (
                                                    <div key={index} className="grid grid-cols-12 gap-4 items-start bg-gray-50/50 p-0 rounded-md">
                                                        <div className="col-span-5">
                                                            <Input
                                                                placeholder="e.g. Weather condition"
                                                                value={item.key}
                                                                onChange={(e) => handleSurveyReportChange(index, 'key', e.target.value)}
                                                                className="bg-white"
                                                            />
                                                        </div>
                                                        <div className="col-span-6">
                                                            <Textarea
                                                                placeholder="Enter survey details..."
                                                                value={item.value}
                                                                onChange={(e) => handleSurveyReportChange(index, 'value', e.target.value)}
                                                                className="min-h-[40px] bg-white resize-y"
                                                                rows={1}
                                                            />
                                                        </div>
                                                        <div className="col-span-1 flex justify-center pt-2">
                                                            {formData.surveyReport.length > 1 && (
                                                                <Button
                                                                    type="button"
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    onClick={() => removeSurveyReport(index)}
                                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8"
                                                                >
                                                                    <Trash2 className="w-4 h-4" />
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}


                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={addSurveyReport}
                                                    className="mt-2 text-primary border-dashed border-primary/50 hover:bg-primary/5 hover:text-primary-dark hover:border-primary bg-green-50"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" /> Add Survey Item
                                                </Button>

                                                <div className="pt-4 space-y-2">
                                                    <Label htmlFor="surveyReportNote">Survey Report Note</Label>
                                                    <Textarea
                                                        id="surveyReportNote"
                                                        placeholder="Enter any additional notes for the survey report..."
                                                        value={formData.surveyReportNote}
                                                        onChange={(e) => handleChange(e)}
                                                        name="surveyReportNote"
                                                        className="min-h-[80px]"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="pt-6 flex justify-end">
                                    <Button type="submit" size="lg" className="bg-primary hover:bg-primary-dark text-white min-w-[150px]">
                                        <Save className="w-4 h-4 mr-2" /> Generate Report
                                    </Button>
                                </div>

                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default NewReportPage;
