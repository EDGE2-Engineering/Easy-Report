
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
        conclusions: [
            { value: 'SPT values indicate that the soil strata up to a termination depth is [VALUE].' },
            { value: 'The [VALUE] present in the soil strata is found to be [VALUE] in nature.' },
            { value: 'Ground water table [VALUE] at the time of investigation in the bore hole.' }
        ],
        depthOfFoundation: '',
        recommendationTypes: {
            rock: false,
            soil: true
        },
        sitePhotos: [],
        boreholeLogs: [
            [{
                depth: '',
                natureOfSampling: '',
                soilType: '',
                waterTable: false,
                spt1: '',
                spt2: '',
                spt3: '',
                shearParameters: {
                    cValue: '',
                    phiValue: ''
                },
                coreLength: '',
                coreRecovery: '',
                rqd: '',
                sbc: ''
            }]
        ],
        labTestResults: [
            [{
                depth: '',
                bulkDensity: '',
                moistureContent: '',
                grainSizeDistribution: {
                    gravel: '',
                    sand: '',
                    siltAndClay: ''
                },
                atterbergLimits: {
                    liquidLimit: '',
                    plasticLimit: '',
                    plasticityIndex: ''
                },
                specificGravity: '',
                freeSwellIndex: ''
            }]
        ],
        chemicalAnalysis: [
            {
                phValue: '',
                sulphates: '',
                chlorides: '',
                additionalKeys: [
                    { key: '', value: '' }
                ]
            }
        ],
        grainSizeAnalysis: [
            [
                {
                    depth: '',
                    sieve1: '',
                    sieve2: '',
                    sieve3: '',
                    sieve4: '',
                    sieve5: '',
                    sieve6: '',
                    sieve7: '',
                    sieve8: '',
                    sieve9: ''
                }
            ]
        ],
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

    const handleConclusionChange = (index, value) => {
        const newConclusions = [...formData.conclusions];
        newConclusions[index].value = value;
        setFormData(prev => ({
            ...prev,
            conclusions: newConclusions
        }));
    };

    const addConclusion = () => {
        setFormData(prev => ({
            ...prev,
            conclusions: [...prev.conclusions, { value: '' }]
        }));
    };

    const removeConclusion = (index) => {
        if (formData.conclusions.length > 1) {
            const newConclusions = formData.conclusions.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                conclusions: newConclusions
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

    const handleSitePhotosAdd = (e) => {
        const files = Array.from(e.target.files);
        if (files) {
            files.forEach(file => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormData(prev => ({
                        ...prev,
                        sitePhotos: [...prev.sitePhotos, { id: Date.now() + Math.random(), file, preview: reader.result }]
                    }));
                };
                reader.readAsDataURL(file);
            });
        }
    };

    const removeSitePhoto = (id) => {
        setFormData(prev => ({
            ...prev,
            sitePhotos: prev.sitePhotos.filter(photo => photo.id !== id)
        }));
    };

    const handleBoreholeLogChange = (levelIndex, logIndex, field, value) => {
        const newLogs = [...formData.boreholeLogs];

        // Handle nested fields like 'shearParameters.cValue'
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            newLogs[levelIndex][logIndex][parent] = {
                ...newLogs[levelIndex][logIndex][parent],
                [child]: value
            };
        } else {
            newLogs[levelIndex][logIndex][field] = value;
        }

        setFormData(prev => ({
            ...prev,
            boreholeLogs: newLogs
        }));
    };

    const addBoreholeLog = (levelIndex) => {
        const newLogs = [...formData.boreholeLogs];
        newLogs[levelIndex].push({
            depth: '',
            natureOfSampling: '',
            soilType: '',
            waterTable: false,
            spt1: '',
            spt2: '',
            spt3: '',
            shearParameters: {
                cValue: '',
                phiValue: ''
            },
            coreLength: '',
            coreRecovery: '',
            rqd: '',
            sbc: ''
        });
        setFormData(prev => ({
            ...prev,
            boreholeLogs: newLogs
        }));
    };

    const removeBoreholeLog = (levelIndex, logIndex) => {
        if (formData.boreholeLogs[levelIndex].length > 1) {
            const newLogs = [...formData.boreholeLogs];
            newLogs[levelIndex] = newLogs[levelIndex].filter((_, i) => i !== logIndex);
            setFormData(prev => ({
                ...prev,
                boreholeLogs: newLogs
            }));
        }
    };

    const addLevel = () => {
        setFormData(prev => ({
            ...prev,
            boreholeLogs: [...prev.boreholeLogs, [{
                depth: '',
                natureOfSampling: '',
                soilType: '',
                waterTable: false,
                spt1: '',
                spt2: '',
                spt3: '',
                shearParameters: {
                    cValue: '',
                    phiValue: ''
                },
                coreLength: '',
                coreRecovery: '',
                rqd: '',
                sbc: ''
            }]]
        }));
    };

    const removeLevel = (levelIndex) => {
        if (formData.boreholeLogs.length > 1) {
            const newLogs = formData.boreholeLogs.filter((_, i) => i !== levelIndex);
            setFormData(prev => ({
                ...prev,
                boreholeLogs: newLogs
            }));
        }
    };

    const handleLabTestResultChange = (levelIndex, logIndex, field, value) => {
        const newResults = [...formData.labTestResults];

        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            newResults[levelIndex][logIndex][parent] = {
                ...newResults[levelIndex][logIndex][parent],
                [child]: value
            };
        } else {
            newResults[levelIndex][logIndex][field] = value;
        }

        setFormData(prev => ({
            ...prev,
            labTestResults: newResults
        }));
    };

    const addLabTestLog = (levelIndex) => {
        const newResults = [...formData.labTestResults];
        newResults[levelIndex].push({
            depth: '',
            bulkDensity: '',
            moistureContent: '',
            grainSizeDistribution: {
                gravel: '',
                sand: '',
                siltAndClay: ''
            },
            atterbergLimits: {
                liquidLimit: '',
                plasticLimit: '',
                plasticityIndex: ''
            },
            specificGravity: '',
            freeSwellIndex: ''
        });
        setFormData(prev => ({
            ...prev,
            labTestResults: newResults
        }));
    };

    const removeLabTestLog = (levelIndex, logIndex) => {
        if (formData.labTestResults[levelIndex].length > 1) {
            const newResults = [...formData.labTestResults];
            newResults[levelIndex] = newResults[levelIndex].filter((_, i) => i !== logIndex);
            setFormData(prev => ({
                ...prev,
                labTestResults: newResults
            }));
        }
    };

    const addLabTestLevel = () => {
        setFormData(prev => ({
            ...prev,
            labTestResults: [...prev.labTestResults, [{
                depth: '',
                bulkDensity: '',
                moistureContent: '',
                grainSizeDistribution: {
                    gravel: '',
                    sand: '',
                    siltAndClay: ''
                },
                atterbergLimits: {
                    liquidLimit: '',
                    plasticLimit: '',
                    plasticityIndex: ''
                },
                specificGravity: '',
                freeSwellIndex: ''
            }]]
        }));
    };

    const removeLabTestLevel = (levelIndex) => {
        if (formData.labTestResults.length > 1) {
            const newResults = formData.labTestResults.filter((_, i) => i !== levelIndex);
            setFormData(prev => ({
                ...prev,
                labTestResults: newResults
            }));
        }
    };

    const handleChemicalAnalysisChange = (index, field, value) => {
        const newAnalysis = [...formData.chemicalAnalysis];
        newAnalysis[index][field] = value;
        setFormData(prev => ({
            ...prev,
            chemicalAnalysis: newAnalysis
        }));
    };

    const handleChemicalAnalysisKeyChange = (index, keyIndex, field, value) => {
        const newAnalysis = [...formData.chemicalAnalysis];
        newAnalysis[index].additionalKeys[keyIndex][field] = value;
        setFormData(prev => ({
            ...prev,
            chemicalAnalysis: newAnalysis
        }));
    };

    const addChemicalAnalysisLevel = () => {
        setFormData(prev => ({
            ...prev,
            chemicalAnalysis: [...prev.chemicalAnalysis, {
                phValue: '',
                sulphates: '',
                chlorides: '',
                additionalKeys: [{ key: '', value: '' }]
            }]
        }));
    };

    const removeChemicalAnalysisLevel = (index) => {
        if (formData.chemicalAnalysis.length > 1) {
            const newAnalysis = formData.chemicalAnalysis.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                chemicalAnalysis: newAnalysis
            }));
        }
    };

    const addChemicalAnalysisKey = (index) => {
        const newAnalysis = [...formData.chemicalAnalysis];
        newAnalysis[index].additionalKeys.push({ key: '', value: '' });
        setFormData(prev => ({
            ...prev,
            chemicalAnalysis: newAnalysis
        }));
    };

    const removeChemicalAnalysisKey = (index, keyIndex) => {
        const newAnalysis = [...formData.chemicalAnalysis];
        if (newAnalysis[index].additionalKeys.length > 1) {
            newAnalysis[index].additionalKeys = newAnalysis[index].additionalKeys.filter((_, i) => i !== keyIndex);
            setFormData(prev => ({
                ...prev,
                chemicalAnalysis: newAnalysis
            }));
        }
    };

    const handleGrainSizeAnalysisChange = (levelIndex, rowIndex, field, value) => {
        const newAnalysis = [...formData.grainSizeAnalysis];
        newAnalysis[levelIndex][rowIndex][field] = value;
        setFormData(prev => ({
            ...prev,
            grainSizeAnalysis: newAnalysis
        }));
    };

    const addGrainSizeAnalysisRow = (levelIndex) => {
        const newAnalysis = [...formData.grainSizeAnalysis];
        newAnalysis[levelIndex].push({
            depth: '',
            sieve1: '',
            sieve2: '',
            sieve3: '',
            sieve4: '',
            sieve5: '',
            sieve6: '',
            sieve7: '',
            sieve8: '',
            sieve9: ''
        });
        setFormData(prev => ({
            ...prev,
            grainSizeAnalysis: newAnalysis
        }));
    };

    const removeGrainSizeAnalysisRow = (levelIndex, rowIndex) => {
        if (formData.grainSizeAnalysis[levelIndex].length > 1) {
            const newAnalysis = [...formData.grainSizeAnalysis];
            newAnalysis[levelIndex] = newAnalysis[levelIndex].filter((_, i) => i !== rowIndex);
            setFormData(prev => ({
                ...prev,
                grainSizeAnalysis: newAnalysis
            }));
        }
    };

    const addGrainSizeAnalysisLevel = () => {
        setFormData(prev => ({
            ...prev,
            grainSizeAnalysis: [...prev.grainSizeAnalysis, [{
                depth: '',
                sieve1: '',
                sieve2: '',
                sieve3: '',
                sieve4: '',
                sieve5: '',
                sieve6: '',
                sieve7: '',
                sieve8: '',
                sieve9: ''
            }]]
        }));
    };

    const removeGrainSizeAnalysisLevel = (levelIndex) => {
        if (formData.grainSizeAnalysis.length > 1) {
            const newAnalysis = formData.grainSizeAnalysis.filter((_, i) => i !== levelIndex);
            setFormData(prev => ({
                ...prev,
                grainSizeAnalysis: newAnalysis
            }));
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

                                {/* Section 4: Conclusions */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Conclusions</h3>
                                    <div className="space-y-2">
                                        {formData.conclusions.map((item, index) => (
                                            <div key={index} className="flex gap-4 items-start bg-gray-50/50 p-0 rounded-md group">
                                                <div className="flex-grow">
                                                    <Textarea
                                                        placeholder="Enter conclusion..."
                                                        value={item.value}
                                                        onChange={(e) => handleConclusionChange(index, e.target.value)}
                                                        className="min-h-[60px] bg-white resize-y"
                                                    />
                                                </div>
                                                <div className="flex-shrink-0 pt-2">
                                                    {formData.conclusions.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="ghost"
                                                            size="icon"
                                                            onClick={() => removeConclusion(index)}
                                                            className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 w-8 opacity-50 group-hover:opacity-100 transition-opacity"
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
                                            onClick={addConclusion}
                                            className="mt-2 text-primary border-dashed border-primary/50 hover:bg-primary/5 hover:text-primary-dark hover:border-primary bg-green-50"
                                        >
                                            <Plus className="w-4 h-4 mr-2" /> Add Conclusion
                                        </Button>
                                    </div>
                                </div>

                                {/* Section 5: Depth of Foundation */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100"> Depth of Foundation</h3>
                                    <div className="space-y-2">
                                        <Textarea
                                            placeholder="The foundation depth for the proposed structure shall be a minimum depth of [VALUE]m from the existing ground level."
                                            value={formData.depthOfFoundation}
                                            onChange={(e) => handleChange(e)}
                                            name="depthOfFoundation"
                                            className="min-h-[60px] bg-white resize-y"
                                        />
                                    </div>
                                </div>

                                {/* Section 5: Recommendation Type For SBC */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100"> Recommendation Type/s For SBC</h3>
                                    <div className="flex items-center space-x-8 pt-2">
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="rec-rock"
                                                checked={formData.recommendationTypes.rock}
                                                onCheckedChange={(checked) => setFormData(prev => ({
                                                    ...prev,
                                                    recommendationTypes: {
                                                        ...prev.recommendationTypes,
                                                        rock: checked
                                                    }
                                                }))}
                                            />
                                            <Label htmlFor="rec-rock" className="cursor-pointer">Rock</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox
                                                id="rec-soil"
                                                checked={formData.recommendationTypes.soil}
                                                onCheckedChange={(checked) => setFormData(prev => ({
                                                    ...prev,
                                                    recommendationTypes: {
                                                        ...prev.recommendationTypes,
                                                        soil: checked
                                                    }
                                                }))}
                                            />
                                            <Label htmlFor="rec-soil" className="cursor-pointer">Soil</Label>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 7: Site Photos */}
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Site Photos</h3>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                        {formData.sitePhotos.map((photo) => (
                                            <div key={photo.id} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                                <img src={photo.preview} alt="Site" className="w-full h-full object-cover" />
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    onClick={() => removeSitePhoto(photo.id)}
                                                    className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        ))}
                                        <div
                                            className="flex flex-col items-center justify-center aspect-square border-2 border-dashed border-gray-300 rounded-lg hover:border-primary hover:bg-primary/5 transition-colors cursor-pointer bg-gray-50"
                                            onClick={() => document.getElementById('site-photos-upload').click()}
                                        >
                                            <Plus className="w-8 h-8 text-gray-400 mb-2" />
                                            <span className="text-sm font-medium text-gray-500">Add Photo</span>
                                        </div>
                                        <Input
                                            id="site-photos-upload"
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            className="hidden"
                                            onChange={handleSitePhotosAdd}
                                        />
                                    </div>
                                </div>

                                {/* Section 8: Borehole Logs */}
                                <div className="bg-green-50/50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Borehole Logs</h3>
                                    <div className="space-y-8">
                                        {formData.boreholeLogs.map((levelLogs, levelIndex) => (
                                            <div key={levelIndex} className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="text-md font-semibold text-gray-700">Borehole Log - Level {levelIndex + 1}</h4>
                                                    {formData.boreholeLogs.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeLevel(levelIndex)}
                                                            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" /> Remove Level
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white mb-4">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                                            <tr>
                                                                <th className="px-3 py-3 min-w-[100px]">Depth (m)</th>
                                                                <th className="px-3 py-3 min-w-[150px]">Nature of Sampling</th>
                                                                <th className="px-3 py-3 min-w-[150px]">Soil Type</th>
                                                                <th className="px-3 py-3 min-w-[100px]">Water Table</th>
                                                                <th className="px-3 py-3 min-w-[150px]">SPT Depth at Intervals</th>
                                                                <th className="px-3 py-3 min-w-[120px]">Shear Params</th>
                                                                <th className="px-3 py-3 min-w-[100px]">Core Length</th>
                                                                <th className="px-3 py-3 min-w-[120px]">Core Recovery %</th>
                                                                <th className="px-3 py-3 min-w-[100px]">RQD %</th>
                                                                <th className="px-3 py-3 min-w-[100px]">SBC Value</th>
                                                                <th className="px-3 py-3 w-[50px]"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {levelLogs.map((log, logIndex) => (
                                                                <tr key={logIndex} className="bg-white border-b hover:bg-gray-50/50">
                                                                    <td className="px-2 py-2"><Input value={log.depth} onChange={(e) => handleBoreholeLogChange(levelIndex, logIndex, 'depth', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2">
                                                                        <Select
                                                                            value={log.natureOfSampling}
                                                                            onValueChange={(value) => handleBoreholeLogChange(levelIndex, logIndex, 'natureOfSampling', value)}
                                                                        >
                                                                            <SelectTrigger className="h-8">
                                                                                <SelectValue placeholder="Select" />
                                                                            </SelectTrigger>
                                                                            <SelectContent>
                                                                                <SelectItem value="CR">CR</SelectItem>
                                                                                <SelectItem value="DS">DS</SelectItem>
                                                                                <SelectItem value="UDS">UDS</SelectItem>
                                                                                <SelectItem value="DS/UDS">DS/UDS</SelectItem>
                                                                                <SelectItem value="TP">TP</SelectItem>
                                                                                <SelectItem value="SPT">SPT</SelectItem>
                                                                            </SelectContent>
                                                                        </Select>
                                                                    </td>
                                                                    <td className="px-2 py-2"><Input value={log.soilType} onChange={(e) => handleBoreholeLogChange(levelIndex, logIndex, 'soilType', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2 text-center">
                                                                        <div className="flex justify-center">
                                                                            <Checkbox
                                                                                checked={log.waterTable}
                                                                                onCheckedChange={(checked) => handleBoreholeLogChange(levelIndex, logIndex, 'waterTable', checked)}
                                                                            />
                                                                        </div>
                                                                    </td>
                                                                    <td className="px-2 py-2">
                                                                        <Input value={log.spt1} onChange={(e) => handleBoreholeLogChange(levelIndex, logIndex, 'spt1', e.target.value)} className="h-8 mb-1" placeholder="SPT at 15cm" />
                                                                        <Input value={log.spt2} onChange={(e) => handleBoreholeLogChange(levelIndex, logIndex, 'spt2', e.target.value)} className="h-8 mb-1" placeholder="SPT at 30cm" />
                                                                        <Input value={log.spt3} onChange={(e) => handleBoreholeLogChange(levelIndex, logIndex, 'spt3', e.target.value)} className="h-8" placeholder="SPT at 45cm" />
                                                                    </td>
                                                                    <td className="px-2 py-2">
                                                                        <Input value={log.shearParameters?.cValue} onChange={(e) => handleBoreholeLogChange(levelIndex, logIndex, 'shearParameters.cValue', e.target.value)} className="h-8 mb-1" placeholder="C Value" />
                                                                        <Input value={log.shearParameters?.phiValue} onChange={(e) => handleBoreholeLogChange(levelIndex, logIndex, 'shearParameters.phiValue', e.target.value)} className="h-8" placeholder="Phi Value" />
                                                                    </td>
                                                                    <td className="px-2 py-2"><Input value={log.coreLength} onChange={(e) => handleBoreholeLogChange(levelIndex, logIndex, 'coreLength', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={log.coreRecovery} onChange={(e) => handleBoreholeLogChange(levelIndex, logIndex, 'coreRecovery', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={log.rqd} onChange={(e) => handleBoreholeLogChange(levelIndex, logIndex, 'rqd', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={log.sbc} onChange={(e) => handleBoreholeLogChange(levelIndex, logIndex, 'sbc', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2 text-center">
                                                                        {levelLogs.length > 1 && (
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => removeBoreholeLog(levelIndex, logIndex)}
                                                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addBoreholeLog(levelIndex)}
                                                    className="text-primary border-dashed border-primary/50 hover:bg-primary/5 hover:text-primary-dark hover:border-primary bg-white"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" /> Add Log to Level {levelIndex + 1}
                                                </Button>
                                            </div>
                                        ))}
                                        <div className="flex justify-center pt-4 border-t border-gray-100">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addLevel}
                                                className="w-full md:w-auto text-primary border-dashed border-primary/50 hover:bg-primary/5 hover:text-primary-dark hover:border-primary bg-green-50"
                                            >
                                                <Plus className="w-4 h-4 mr-2" /> Add Borehole Log Level
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 9: Laboratory Test Results */}
                                <div className="bg-blue-50/50 p-4 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Laboratory Test Results</h3>
                                    <div className="space-y-8">
                                        {formData.labTestResults.map((levelLogs, levelIndex) => (
                                            <div key={levelIndex} className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="text-md font-semibold text-gray-700">Lab Test Result - Level {levelIndex + 1}</h4>
                                                    {formData.labTestResults.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeLabTestLevel(levelIndex)}
                                                            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" /> Remove Level
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="overflow-x-auto border border-gray-200 rounded-lg bg-white mb-4">
                                                    <table className="w-full text-sm text-left">
                                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                                            <tr>
                                                                <th className="px-3 py-3 min-w-[100px]">Depth (m)</th>
                                                                <th className="px-3 py-3 min-w-[150px]">Bulk Density</th>
                                                                <th className="px-3 py-3 min-w-[150px]">Moisture Content %</th>
                                                                <th className="px-3 py-3 min-w-[200px]">Grain Size Distribution</th>
                                                                <th className="px-3 py-3 min-w-[200px]">Atterberg Limits</th>
                                                                <th className="px-3 py-3 min-w-[150px]">Specific Gravity</th>
                                                                <th className="px-3 py-3 min-w-[150px]">Free Swell Index %</th>
                                                                <th className="px-3 py-3 w-[50px]"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {levelLogs.map((result, logIndex) => (
                                                                <tr key={logIndex} className="bg-white border-b hover:bg-gray-50/50">
                                                                    <td className="px-2 py-2"><Input value={result.depth} onChange={(e) => handleLabTestResultChange(levelIndex, logIndex, 'depth', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={result.bulkDensity} onChange={(e) => handleLabTestResultChange(levelIndex, logIndex, 'bulkDensity', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={result.moistureContent} onChange={(e) => handleLabTestResultChange(levelIndex, logIndex, 'moistureContent', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2">
                                                                        <Input value={result.grainSizeDistribution.gravel} onChange={(e) => handleLabTestResultChange(levelIndex, logIndex, 'grainSizeDistribution.gravel', e.target.value)} className="h-8 mb-1" placeholder="Gravel (%)" />
                                                                        <Input value={result.grainSizeDistribution.sand} onChange={(e) => handleLabTestResultChange(levelIndex, logIndex, 'grainSizeDistribution.sand', e.target.value)} className="h-8 mb-1" placeholder="Sand (%)" />
                                                                        <Input value={result.grainSizeDistribution.siltAndClay} onChange={(e) => handleLabTestResultChange(levelIndex, logIndex, 'grainSizeDistribution.siltAndClay', e.target.value)} className="h-8" placeholder="Silt and Clay (%)" />
                                                                    </td>
                                                                    <td className="px-2 py-2">
                                                                        <Input value={result.atterbergLimits.liquidLimit} onChange={(e) => handleLabTestResultChange(levelIndex, logIndex, 'atterbergLimits.liquidLimit', e.target.value)} className="h-8 mb-1" placeholder="Liquid Limit (%)" />
                                                                        <Input value={result.atterbergLimits.plasticLimit} onChange={(e) => handleLabTestResultChange(levelIndex, logIndex, 'atterbergLimits.plasticLimit', e.target.value)} className="h-8 mb-1" placeholder="Plastic Limit (%)" />
                                                                        <Input value={result.atterbergLimits.plasticityIndex} onChange={(e) => handleLabTestResultChange(levelIndex, logIndex, 'atterbergLimits.plasticityIndex', e.target.value)} className="h-8" placeholder="Plasticity Index (%)" />
                                                                    </td>
                                                                    <td className="px-2 py-2"><Input value={result.specificGravity} onChange={(e) => handleLabTestResultChange(levelIndex, logIndex, 'specificGravity', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={result.freeSwellIndex} onChange={(e) => handleLabTestResultChange(levelIndex, logIndex, 'freeSwellIndex', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2 text-center">
                                                                        {levelLogs.length > 1 && (
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => removeLabTestLog(levelIndex, logIndex)}
                                                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => addLabTestLog(levelIndex)}
                                                    className="text-primary border-dashed border-primary/50 hover:bg-primary/5 hover:text-primary-dark hover:border-primary bg-white"
                                                >
                                                    <Plus className="w-4 h-4 mr-2" /> Add Lab Test Reading
                                                </Button>
                                            </div>
                                        ))}
                                        <div className="flex justify-center pt-4 border-t border-gray-100">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addLabTestLevel}
                                                className="w-full md:w-auto text-primary border-dashed border-primary/50 hover:bg-primary/5 hover:text-primary-dark hover:border-primary bg-green-50"
                                            >
                                                <Plus className="w-4 h-4 mr-2" /> Add Lab Test Level
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 10: Chemical Analysis */}
                                <div className="bg-orange-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Chemical Analysis</h3>
                                    <div className="space-y-8">
                                        {formData.chemicalAnalysis.map((item, index) => (
                                            <div key={index} className="bg-gray-50/50 p-4 rounded-lg border border-gray-200">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="text-md font-semibold text-gray-700">Chemical Analysis - Level {index + 1}</h4>
                                                    {formData.chemicalAnalysis.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeChemicalAnalysisLevel(index)}
                                                            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" /> Remove Level
                                                        </Button>
                                                    )}
                                                </div>

                                                <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm relative">
                                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                                        <div className="space-y-2">
                                                            <Label>pH Value</Label>
                                                            <Input
                                                                value={item.phValue}
                                                                onChange={(e) => handleChemicalAnalysisChange(index, 'phValue', e.target.value)}
                                                                placeholder="pH Value"
                                                                className="bg-white"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Sulphates (%)</Label>
                                                            <Input
                                                                value={item.sulphates}
                                                                onChange={(e) => handleChemicalAnalysisChange(index, 'sulphates', e.target.value)}
                                                                placeholder="Sulphates (%)"
                                                                className="bg-white"
                                                            />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <Label>Chlorides (%)</Label>
                                                            <Input
                                                                value={item.chlorides}
                                                                onChange={(e) => handleChemicalAnalysisChange(index, 'chlorides', e.target.value)}
                                                                placeholder="Chlorides (%)"
                                                                className="bg-white"
                                                            />
                                                        </div>
                                                    </div>

                                                    <div className="space-y-2">
                                                        <Label className="text-sm font-medium text-gray-700 block mb-2">Additional Keys</Label>
                                                        {item.additionalKeys.map((keyItem, keyIndex) => (
                                                            <div key={keyIndex} className="grid grid-cols-12 gap-4 items-center">
                                                                <div className="col-span-5">
                                                                    <Input
                                                                        placeholder="Key"
                                                                        value={keyItem.key}
                                                                        onChange={(e) => handleChemicalAnalysisKeyChange(index, keyIndex, 'key', e.target.value)}
                                                                        className="bg-gray-50 h-9"
                                                                    />
                                                                </div>
                                                                <div className="col-span-6">
                                                                    <Input
                                                                        placeholder="Value"
                                                                        value={keyItem.value}
                                                                        onChange={(e) => handleChemicalAnalysisKeyChange(index, keyIndex, 'value', e.target.value)}
                                                                        className="bg-gray-50 h-9"
                                                                    />
                                                                </div>
                                                                <div className="col-span-1 flex justify-center">
                                                                    {item.additionalKeys.length > 1 && (
                                                                        <Button
                                                                            type="button"
                                                                            variant="ghost"
                                                                            size="icon"
                                                                            onClick={() => removeChemicalAnalysisKey(index, keyIndex)}
                                                                            className="text-red-400 hover:text-red-600 hover:bg-red-50 h-8 w-8"
                                                                        >
                                                                            <Trash2 className="w-3 h-3" />
                                                                        </Button>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => addChemicalAnalysisKey(index)}
                                                            className="mt-2 text-primary border-dashed border-primary/50 hover:bg-primary/5 hover:text-primary-dark hover:border-primary bg-white h-8 text-xs"
                                                        >
                                                            <Plus className="w-3 h-3 mr-2" /> Add Key
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex justify-center pt-4 border-t border-gray-100">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addChemicalAnalysisLevel}
                                                className="w-full md:w-auto text-primary border-dashed border-primary/50 hover:bg-primary/5 hover:text-primary-dark hover:border-primary bg-purple-50"
                                            >
                                                <Plus className="w-4 h-4 mr-2" /> Add Chemical Analysis Level
                                            </Button>
                                        </div>
                                    </div>
                                </div>

                                {/* Section 11: Grain Size Analysis */}
                                <div className="bg-yellow-50 p-6 rounded-lg">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">Grain Size Analysis</h3>
                                    <div className="space-y-8">
                                        {formData.grainSizeAnalysis.map((levelRows, levelIndex) => (
                                            <div key={levelIndex} className="bg-white p-4 rounded-lg border border-gray-200">
                                                <div className="flex justify-between items-center mb-4">
                                                    <h4 className="text-md font-semibold text-gray-700">Grain Size Analysis - Level {levelIndex + 1}</h4>
                                                    {formData.grainSizeAnalysis.length > 1 && (
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            onClick={() => removeGrainSizeAnalysisLevel(levelIndex)}
                                                            className="bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-2" /> Remove Level
                                                        </Button>
                                                    )}
                                                </div>
                                                <div className="overflow-x-auto">
                                                    <table className="w-full text-sm text-left border-collapse min-w-[1200px]">
                                                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                                                            <tr>
                                                                <th className="px-3 py-3 w-[100px]">Depth (m)</th>
                                                                <th className="px-3 py-3 min-w-[100px]">Sieve 1</th>
                                                                <th className="px-3 py-3 min-w-[100px]">Sieve 2</th>
                                                                <th className="px-3 py-3 min-w-[100px]">Sieve 3</th>
                                                                <th className="px-3 py-3 min-w-[100px]">Sieve 4</th>
                                                                <th className="px-3 py-3 min-w-[100px]">Sieve 5</th>
                                                                <th className="px-3 py-3 min-w-[100px]">Sieve 6</th>
                                                                <th className="px-3 py-3 min-w-[100px]">Sieve 7</th>
                                                                <th className="px-3 py-3 min-w-[100px]">Sieve 8</th>
                                                                <th className="px-3 py-3 min-w-[100px]">Sieve 9</th>
                                                                <th className="px-3 py-3 w-[50px]"></th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {levelRows.map((item, rowIndex) => (
                                                                <tr key={rowIndex} className="bg-white border-b hover:bg-gray-50/50">
                                                                    <td className="px-2 py-2"><Input value={item.depth} onChange={(e) => handleGrainSizeAnalysisChange(levelIndex, rowIndex, 'depth', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={item.sieve1} onChange={(e) => handleGrainSizeAnalysisChange(levelIndex, rowIndex, 'sieve1', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={item.sieve2} onChange={(e) => handleGrainSizeAnalysisChange(levelIndex, rowIndex, 'sieve2', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={item.sieve3} onChange={(e) => handleGrainSizeAnalysisChange(levelIndex, rowIndex, 'sieve3', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={item.sieve4} onChange={(e) => handleGrainSizeAnalysisChange(levelIndex, rowIndex, 'sieve4', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={item.sieve5} onChange={(e) => handleGrainSizeAnalysisChange(levelIndex, rowIndex, 'sieve5', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={item.sieve6} onChange={(e) => handleGrainSizeAnalysisChange(levelIndex, rowIndex, 'sieve6', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={item.sieve7} onChange={(e) => handleGrainSizeAnalysisChange(levelIndex, rowIndex, 'sieve7', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={item.sieve8} onChange={(e) => handleGrainSizeAnalysisChange(levelIndex, rowIndex, 'sieve8', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2"><Input value={item.sieve9} onChange={(e) => handleGrainSizeAnalysisChange(levelIndex, rowIndex, 'sieve9', e.target.value)} className="h-8" /></td>
                                                                    <td className="px-2 py-2 text-center">
                                                                        {levelRows.length > 1 && (
                                                                            <Button
                                                                                type="button"
                                                                                variant="ghost"
                                                                                size="icon"
                                                                                onClick={() => removeGrainSizeAnalysisRow(levelIndex, rowIndex)}
                                                                                className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                                                                            >
                                                                                <Trash2 className="w-4 h-4" />
                                                                            </Button>
                                                                        )}
                                                                    </td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                    <div className="mt-4">
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => addGrainSizeAnalysisRow(levelIndex)}
                                                            className="text-primary border-dashed border-primary/50 hover:bg-primary/5 hover:text-primary-dark hover:border-primary bg-white"
                                                        >
                                                            <Plus className="w-4 h-4 mr-2" /> Add Grain Size Analysis Row
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <div className="flex justify-center pt-4 border-t border-gray-100">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={addGrainSizeAnalysisLevel}
                                                className="w-full md:w-auto text-primary border-dashed border-primary/50 hover:bg-primary/5 hover:text-primary-dark hover:border-primary bg-purple-50"
                                            >
                                                <Plus className="w-4 h-4 mr-2" /> Add Grain Size Analysis Level
                                            </Button>
                                        </div>
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
            </main >

            <Footer />
        </div >
    );
};

export default NewReportPage;
