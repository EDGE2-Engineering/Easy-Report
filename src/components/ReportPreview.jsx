import React from 'react';
import logo from '@/assets/edge2-logo.png';
import { X, Printer, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Page = ({ children }) => (
    <div className="a4-page shadow-2xl print:shadow-none bg-white relative overflow-hidden"
        style={{ width: '210mm', height: '297mm', padding: '10mm', minHeight: '297mm', boxSizing: 'border-box' }}>
        <div className="border-[0.5pt] border-black h-[277mm] relative p-8 flex flex-col">
            {children}
        </div>
    </div>
);

const AutoFontSize = ({ children, maxHeight, baseFontSize, minFontSize = 8, className = "" }) => {
    const containerRef = React.useRef(null);
    const [fontSize, setFontSize] = React.useState(baseFontSize);

    React.useLayoutEffect(() => {
        if (!containerRef.current) return;

        const checkOverflow = () => {
            const element = containerRef.current;
            if (element.scrollHeight > maxHeight && fontSize > minFontSize) {
                setFontSize(prev => Math.max(minFontSize, prev - 0.5));
            }
        };

        checkOverflow();
    }, [children, maxHeight, fontSize, minFontSize]);

    // Reset font size when content changes significantly
    React.useEffect(() => {
        setFontSize(baseFontSize);
    }, [children, baseFontSize]);

    return (
        <div
            ref={containerRef}
            className={className}
            style={{
                fontSize: `${fontSize}pt`,
                lineHeight: '1.2',
                maxHeight: `${maxHeight}px`,
                overflow: 'hidden',
                wordBreak: 'break-word'
            }}
        >
            {children}
        </div>
    );
};

const ReportPreview = ({ formData, onClose }) => {
    if (!formData) return null;

    const handlePrint = () => {
        window.print();
    };

    const getClientLogo = () => {
        const clientName = formData.client?.toUpperCase() || '';
        if (clientName.includes("ATC TELECOM")) return "/clients/atc.png";
        if (clientName.includes("INDUS TOWERS")) return "/clients/indus.png";
        if (clientName.includes("RELIANCE JIO")) return "/clients/reliance-jio.png";
        return formData.clientLogo;
    };

    const clientLogo = getClientLogo();

    return (
        <div id="report-preview-modal" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 print:p-0 print:bg-white overflow-hidden print:block print:relative print:inset-auto print:z-auto">
            <div className="bg-white w-full max-w-5xl h-[95vh] rounded-lg shadow-2xl flex flex-col print:h-auto print:rounded-none print:shadow-none print:max-w-none print:block print:overflow-visible">
                {/* Header/Controls */}
                <div className="flex items-center justify-between p-4 border-b print:hidden bg-white rounded-t-lg">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <FileText className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-gray-800">Report Preview</h2>
                            <p className="text-xs text-gray-500 font-medium tracking-wide flex items-center">
                                <span className="uppercase mr-2">This is a Preview of the Report to check for data correctness before generating the final report</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-3">
                        <Button variant="outline" size="sm" onClick={handlePrint} className="flex items-center space-x-2 border-primary/20 hover:bg-primary/5">
                            <Printer className="w-4 h-4" />
                            <span className="text-xs">Print / Save PDF</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-red-50 hover:text-red-600 transition-colors">
                            <X className="w-5 h-5" />
                        </Button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 overflow-auto bg-gray-100 p-8 print:p-0 print:bg-white print:overflow-visible print:block">
                    <div className="flex flex-col items-center space-y-12 print:space-y-0 print:block">

                        {/* Page 1: Front Sheet */}
                        <Page>
                            <div className="flex flex-col items-center h-full text-center font-sans" style={{ fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' }}>
                                <div className="mt-2 mb-8 w-full max-h-[10cm] overflow-hidden flex flex-col items-center">
                                    <h1 className="text-[20px] text-[#29299a] leading-tight mb-4 w-full px-4">
                                        Geo-Technical Investigation Report for <br />
                                        Construction of <span className="font-bold inline-block align-bottom">{formData.projectType || '________________'}</span> at <br />
                                        <AutoFontSize maxHeight={60} baseFontSize={15} minFontSize={10} className="mt-2">
                                            {formData.siteAddress || '________________'}
                                        </AutoFontSize>
                                    </h1>

                                    <p className="text-[18px] text-black mt-8 mb-4">Submitted to</p>

                                    <AutoFontSize maxHeight={60} baseFontSize={20} minFontSize={12} className="font-bold text-[#29299a] px-4">
                                        {formData.client || '________________'}
                                    </AutoFontSize>

                                    <AutoFontSize maxHeight={70} baseFontSize={11} minFontSize={8} className="text-[#29299a] mt-1 px-8">
                                        {formData.clientAddress || '________________'}
                                    </AutoFontSize>
                                </div>

                                {clientLogo && (
                                    <div className="mb-12 flex-shrink-0">
                                        <img src={clientLogo} alt="Client Logo" className="max-w-[4cm] max-h-[4cm] object-contain" />
                                    </div>
                                )}

                                {/* Report Details Table */}
                                <div className="w-full max-w-[15cm] mx-auto mb-12">
                                    <table className="w-full border-collapse text-[10pt]">
                                        <tbody>
                                            <tr className="border-b border-black/10">
                                                <td className="py-1.5 pr-4 font-bold w-1/3 text-left">Report ID:</td>
                                                <td className="py-1.5 pl-4 border-l border-black/20 font-medium text-left">{formData.reportId || '________________'}</td>
                                            </tr>
                                            <tr className="border-b border-black/10">
                                                <td className="py-1.5 pr-4 font-bold text-left">Site ID:</td>
                                                <td className="py-1.5 pl-4 border-l border-black/20 font-medium text-left">{formData.siteId || '________________'}</td>
                                            </tr>
                                            <tr className="border-b border-black/10">
                                                <td className="py-1.5 pr-4 font-bold text-left">Site Name:</td>
                                                <td className="py-1.5 pl-4 border-l border-black/20 font-medium text-left line-clamp-2">{formData.siteName || '________________'}</td>
                                            </tr>
                                            <tr className="border-b border-black/10">
                                                <td className="py-1.5 pr-4 font-bold text-left">Project Name:</td>
                                                <td className="py-1.5 pl-4 border-l border-black/20 font-medium text-left line-clamp-2">{formData.projectDetails || '________________'}</td>
                                            </tr>
                                            {formData.sbcDetails && formData.sbcDetails[0] && formData.sbcDetails[0]
                                                .filter(s => s.useForReport)
                                                .map((s, idx) => (
                                                    <tr key={idx} className="border-b border-black/10">
                                                        <td className="py-1.5 pr-4 font-bold text-left">SBC Value {idx + 1}:</td>
                                                        <td className="py-1.5 pl-4 border-l border-black/20 font-medium text-left">{s.sbcValue || '________________'}</td>
                                                    </tr>
                                                ))
                                            }
                                            <tr className="border-b border-black/10">
                                                <td className="py-1.5 pr-4 font-bold text-left">Ground Water Table:</td>
                                                <td className="py-1.5 pl-4 border-l border-black/20 font-medium text-left">{formData.groundWaterTable || 'Not Encountered'}</td>
                                            </tr>
                                            <tr className="border-b border-black/10">
                                                <td className="py-1.5 pr-4 font-bold text-left">Survey Date:</td>
                                                <td className="py-1.5 pl-4 border-l border-black/20 font-medium text-left">{formData.surveyDate || '________________'}</td>
                                            </tr>
                                            <tr>
                                                <td className="py-1.5 pr-4 font-bold text-left">Report Created On:</td>
                                                <td className="py-1.5 pl-4 border-l border-black/20 font-medium text-left">{formData.reportCreatedOn}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                {/* Footer Section */}
                                <div className="w-full mt-auto">
                                    <div className="flex flex-col items-center mb-2">
                                        <p className="text-[15px] font-bold text-gray-800 mb-2">Report Issued By</p>
                                        <img src={logo} alt="EDGE2 Logo" className="w-[10mm] object-contain mb-1" />
                                        <h3 className="text-[11pt] font-bold text-black">EDGE2 Engineering Solutions India Pvt. Ltd.</h3>
                                        <p className="text-[10pt] text-black mt-1">
                                            Geo-technical Investigation • Material Testing • Structural Health & Stability <br />
                                            NDT • Restoration & Rehabilitation • PMC & QA
                                        </p>
                                        <div className="text-[9pt] text-black mt-1 space-y-0.5">
                                            <p>Website: www.edge2.in</p>
                                            <p>📞 +91 98809 73810 / 080 5005 6086</p>
                                            <p>Email: info@edge2.in | reports@edge2.in</p>
                                            <p>PAN: AACCE1702A | GSTIN: 29AACCE1702A1ZD</p>
                                        </div>
                                    </div>

                                    <hr className="border-black/50 my-2" />

                                    <div className="grid grid-cols-[3fr_1fr] gap-4 text-left">
                                        <div className="text-[13px]">
                                            <p><span className="text-[#800000]">Registered Office and Laboratory:</span><br />
                                                EDGE2 Engineering Solutions India Pvt. Ltd.<br />
                                                ISO 9001:2015 Certified<br />
                                                (Certificate No: IN12701A)<br />
                                                Shivaganga Arcade, B35/130, 6th Cross, 6th Block, Vishweshwaraiah Layout, Ullal Upanagar, Bengaluru, Karnataka - 560056</p>
                                        </div>
                                        <div className="flex items-center justify-center space-x-2">
                                            <img src="/iso-9001-2015.png" alt="ISO 9001:2015" className="w-[15mm] object-contain" />
                                            <img src="/iso-45001-2018.png" alt="ISO 45001:2018" className="w-[15mm] object-contain" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Page>

                        {/* Page 2: Table of Contents */}
                        <Page>
                            <h2 className="text-center font-bold text-[16pt] mb-8 uppercase text-blue-900">Table of Contents</h2>
                            <table className="w-full border-collapse text-[11pt]">
                                <thead>
                                    <tr className="border-b-2 border-blue-900">
                                        <th className="text-left py-3">Contents</th>
                                        <th className="text-right py-3 w-24">Page No.</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {[
                                        { label: '1.0 INTRODUCTION', page: '2' },
                                        { label: '2.0 OBJECTIVES AND SCOPE OF WORK', page: '2' },
                                        { label: '3.0 FIELD INVESTIGATIONS', page: '2' },
                                        { label: '4.0 RECOMMENDATIONS & CONCLUSIONS', page: 'Last' },
                                        { label: 'BOREHOLE LOGS', page: '3+' },
                                        { label: 'LABORATORY TEST RESULTS', page: '...' },
                                        { label: 'GRAIN SIZE ANALYSIS', page: '...' },
                                        { label: 'SBC DETAILS', page: '...' },
                                        { label: 'ANNEXURE: SITE PHOTOGRAPHS', page: '...' },
                                    ].map((item, i) => (
                                        <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                                            <td className="py-3 font-medium text-gray-700">{item.label}</td>
                                            <td className="py-3 text-right text-gray-500 font-bold">{item.page}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className="mt-auto pt-10 text-center">
                                <p className="text-[9pt] text-gray-400 italic">This report contains comprehensive technical data and recommendations for foundation design.</p>
                            </div>
                        </Page>

                        {/* Existing Page 2 (now 3) */}
                        <Page>
                            <h1 className="text-center font-bold text-[14pt] mb-10 uppercase text-blue-900">Technical Report for Geo-technical Investigation</h1>
                            {/* ... Content already there ... */}

                            <section className="mb-8">
                                <h2 className="text-[12pt] font-bold mb-4 flex items-center">
                                    <span className="bg-blue-900 text-white px-2 mr-3">1.0</span> INTRODUCTION
                                </h2>
                                <div className="text-[11pt] text-justify leading-relaxed">
                                    <p className="mb-4">
                                        <strong>M/s {formData.client || '________________'}</strong>, Proposes to Construct
                                        {' '}{formData.projectType || '________________'} situated at {formData.siteAddress || '________________'}.
                                    </p>
                                    <p className="mb-4 text-justify">
                                        <strong>M/s EDGE2 Engineering Solutions India Pvt. Ltd.</strong> have assigned the Geo-Technical Investigation work to be carried out at the above said project site locations with a view to furnish the detailed Geo-Technical Information of the nature and sub-soil strata for Detailed Foundation Designs.
                                    </p>
                                </div>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[12pt] font-bold mb-4 flex items-center">
                                    <span className="bg-blue-900 text-white px-2 mr-3">2.0</span> OBJECTIVES AND SCOPE OF WORK
                                </h2>
                                <ul className="list-disc ml-8 text-[11pt] space-y-2">
                                    <li>To ascertain the sub-soil strata at each site</li>
                                    <li>To study standing Ground Water Level</li>
                                    <li>To study the physical and engineering properties of soil strata</li>
                                    <li>To evaluate allowable safe bearing capacity of soil</li>
                                    <li>To recommend type and depth of foundation</li>
                                </ul>
                            </section>

                            <section className="mb-8">
                                <h2 className="text-[12pt] font-bold mb-4 flex items-center">
                                    <span className="bg-blue-900 text-white px-2 mr-3">3.0</span> FIELD INVESTIGATIONS
                                </h2>
                                <p className="text-[11pt] mb-4">
                                    To study sub-soil strata, field investigations were carried out by drilling {formData.boreholeLogs?.length || 1} No borehole(s) at the specified locations.
                                </p>
                                <table className="w-full border-collapse border border-black text-[10pt] text-center">
                                    <thead>
                                        <tr className="bg-gray-100">
                                            <th className="border border-black p-2">Sl.No</th>
                                            <th className="border border-black p-2">BH No.</th>
                                            <th className="border border-black p-2">Termination Depth (m)</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {formData.boreholeLogs?.map((log, index) => (
                                            <tr key={index}>
                                                <td className="border border-black p-2">{index + 1}</td>
                                                <td className="border border-black p-2">BH {index + 1}</td>
                                                <td className="border border-black p-2">{log[log.length - 1]?.depth || '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </section>
                        </Page>

                        {/* Borehole Log Pages */}
                        {formData.boreholeLogs?.map((log, bhIndex) => (
                            <Page key={`bh-${bhIndex}`}>
                                <h4 className="font-bold text-[12pt] mb-4 text-blue-900">Borehole Log, Sub-Soil Profile and Laboratory Test Results: (BH {bhIndex + 1})</h4>
                                <div className="flex-1 overflow-x-auto">
                                    <table className="w-full border-collapse border border-black text-[8pt] text-center">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th colSpan={15} className="border border-black p-1 uppercase">BH {bhIndex + 1}</th>
                                            </tr>
                                            <tr className="bg-gray-50">
                                                <th colSpan={3} className="border border-black p-1 text-left">Project Name:</th>
                                                <th colSpan={8} className="border border-black p-1 text-left font-medium">{formData.projectType || '________________'}</th>
                                                <th colSpan={2} className="border border-black p-1">Date:</th>
                                                <th colSpan={2} className="border border-black p-1 font-medium">{formData.surveyDate || '________________'}</th>
                                            </tr>
                                            <tr className="bg-gray-200">
                                                <th rowSpan={2} className="border border-black p-1">Depth (m)</th>
                                                <th rowSpan={2} className="border border-black p-1">Sample</th>
                                                <th rowSpan={2} className="border border-black p-1">Legend</th>
                                                <th rowSpan={2} className="border border-black p-1">Soil Description</th>
                                                <th rowSpan={2} className="border border-black p-1">Water</th>
                                                <th colSpan={4} className="border border-black p-1">SPT / Blows</th>
                                                <th colSpan={2} className="border border-black p-1">Shear</th>
                                                <th rowSpan={2} className="border border-black p-1">Core (m)</th>
                                                <th rowSpan={2} className="border border-black p-1">CR%</th>
                                                <th rowSpan={2} className="border border-black p-1">RQD%</th>
                                                <th rowSpan={2} className="border border-black p-1">SBC</th>
                                            </tr>
                                            <tr className="bg-gray-200">
                                                <th className="border border-black p-1">15</th>
                                                <th className="border border-black p-1">30</th>
                                                <th className="border border-black p-1">45</th>
                                                <th className="border border-black p-1">N</th>
                                                <th className="border border-black p-1">C</th>
                                                <th className="border border-black p-1">Φ</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {log.map((row, rowIndex) => {
                                                const N = (parseInt(row.spt2) || 0) + (parseInt(row.spt3) || 0);
                                                return (
                                                    <tr key={rowIndex}>
                                                        <td className="border border-black p-1">{row.depth}</td>
                                                        <td className="border border-black p-1">{row.natureOfSampling}</td>
                                                        <td className="border border-black p-1 bg-gray-50"></td>
                                                        <td className="border border-black p-1 text-left whitespace-normal min-w-[3cm]">{row.soilType}</td>
                                                        <td className="border border-black p-1">{row.waterTable ? 'Found' : '-'}</td>
                                                        <td className="border border-black p-1">{row.spt1 || '-'}</td>
                                                        <td className="border border-black p-1">{row.spt2 || '-'}</td>
                                                        <td className="border border-black p-1">{row.spt3 || '-'}</td>
                                                        <td className="border border-black p-1 font-bold">{N || '-'}</td>
                                                        <td className="border border-black p-1">{row.shearParameters?.cValue || '-'}</td>
                                                        <td className="border border-black p-1">{row.shearParameters?.phiValue || '-'}</td>
                                                        <td className="border border-black p-1">{row.coreLength || '-'}</td>
                                                        <td className="border border-black p-1">{row.coreRecovery || '-'}</td>
                                                        <td className="border border-black p-1">{row.rqd || '-'}</td>
                                                        <td className="border border-black p-1 font-bold">{row.sbc || '-'}</td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </Page>
                        ))}

                        {/* Lab Test Results Pages */}
                        {formData.labTestResults?.map((results, bhIndex) => (
                            <Page key={`lab-${bhIndex}`}>
                                <h4 className="font-bold text-[12pt] mb-4 text-blue-900">Summary of Laboratory Test Results: (BH {bhIndex + 1})</h4>
                                <div className="flex-1">
                                    <table className="w-full border-collapse border border-black text-[8pt] text-center">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th rowSpan={2} className="border border-black p-1">Depth (m)</th>
                                                <th rowSpan={2} className="border border-black p-1">Bulk Density (g/cc)</th>
                                                <th rowSpan={2} className="border border-black p-1">Moisture content (%)</th>
                                                <th colSpan={3} className="border border-black p-1">Grain Size Distribution (%)</th>
                                                <th colSpan={3} className="border border-black p-1">Atterberg Limits (%)</th>
                                                <th rowSpan={2} className="border border-black p-1">Specific Gravity</th>
                                                <th rowSpan={2} className="border border-black p-1">Free Swell Index (%)</th>
                                            </tr>
                                            <tr className="bg-gray-200">
                                                <th className="border border-black p-1">Gravel</th>
                                                <th className="border border-black p-1">Sand</th>
                                                <th className="border border-black p-1">Silt & Clay</th>
                                                <th className="border border-black p-1">LL</th>
                                                <th className="border border-black p-1">PL</th>
                                                <th className="border border-black p-1">PI</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {results.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td className="border border-black p-1">{row.depth}</td>
                                                    <td className="border border-black p-1">{row.bulkDensity || '-'}</td>
                                                    <td className="border border-black p-1">{row.moistureContent || '-'}</td>
                                                    <td className="border border-black p-1">{row.grainSizeDistribution?.gravel || '-'}</td>
                                                    <td className="border border-black p-1">{row.grainSizeDistribution?.sand || '-'}</td>
                                                    <td className="border border-black p-1">{row.grainSizeDistribution?.siltAndClay || '-'}</td>
                                                    <td className="border border-black p-1">{row.atterbergLimits?.liquidLimit || '-'}</td>
                                                    <td className="border border-black p-1">{row.atterbergLimits?.plasticLimit || '-'}</td>
                                                    <td className="border border-black p-1">{row.atterbergLimits?.plasticityIndex || '-'}</td>
                                                    <td className="border border-black p-1">{row.specificGravity || '-'}</td>
                                                    <td className="border border-black p-1">{row.freeSwellIndex || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Page>
                        ))}

                        {/* Direct Shear Test Results */}
                        {formData.directShearResults?.map((analysis, bhIndex) => (
                            <Page key={`ds-${bhIndex}`}>
                                <h4 className="font-bold text-[12pt] mb-4 text-blue-900">Direct Shear Test Results: (BH {bhIndex + 1})</h4>
                                <div className="flex-1">
                                    <table className="w-full border-collapse border border-black text-[9pt] text-center">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="border border-black p-2">Depth (m)</th>
                                                <th className="border border-black p-2">Cohesion 'c' (kg/cm²)</th>
                                                <th className="border border-black p-2">Angle of Internal Friction 'Φ' (degrees)</th>
                                                <th className="border border-black p-2">Type of Test</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analysis.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td className="border border-black p-2 font-bold">{row.depth}</td>
                                                    <td className="border border-black p-2">{row.cValue || '-'}</td>
                                                    <td className="border border-black p-2">{row.phiValue || '-'}</td>
                                                    <td className="border border-black p-2">Consolidated Undrained</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Page>
                        ))}

                        {/* Grain Size Analysis Pages */}
                        {formData.grainSizeAnalysis?.map((analysis, bhIndex) => (
                            <Page key={`gsa-${bhIndex}`}>
                                <h4 className="font-bold text-[12pt] mb-4 text-blue-900">Grain Size Analysis Results: (BH {bhIndex + 1})</h4>
                                <div className="flex-1">
                                    <table className="w-full border-collapse border border-black text-[8pt] text-center">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th rowSpan={2} className="border border-black p-1">Depth (m)</th>
                                                <th colSpan={9} className="border border-black p-1">Sieve Analysis (Percentage Passing)</th>
                                            </tr>
                                            <tr className="bg-gray-200 text-[6pt]">
                                                {['4.75mm', '2.36mm', '1.18mm', '600μ', '425μ', '300μ', '150μ', '75μ', '<75μ'].map((s, i) => (
                                                    <th key={i} className="border border-black p-1">{s}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analysis.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td className="border border-black p-1 font-bold">{row.depth}</td>
                                                    <td className="border border-black p-1">{row.sieve1 || '-'}</td>
                                                    <td className="border border-black p-1">{row.sieve2 || '-'}</td>
                                                    <td className="border border-black p-1">{row.sieve3 || '-'}</td>
                                                    <td className="border border-black p-1">{row.sieve4 || '-'}</td>
                                                    <td className="border border-black p-1">{row.sieve5 || '-'}</td>
                                                    <td className="border border-black p-1">{row.sieve6 || '-'}</td>
                                                    <td className="border border-black p-1">{row.sieve7 || '-'}</td>
                                                    <td className="border border-black p-1">{row.sieve8 || '-'}</td>
                                                    <td className="border border-black p-1">{row.sieve9 || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Page>
                        ))}

                        {/* SBC Details Pages */}
                        {formData.sbcDetails?.map((details, bhIndex) => (
                            <Page key={`sbc-${bhIndex}`}>
                                <h4 className="font-bold text-[12pt] mb-4 text-blue-900">Safe Bearing Capacity (SBC) Calculations: (BH {bhIndex + 1})</h4>
                                <div className="flex-1">
                                    <table className="w-full border-collapse border border-black text-[9pt] text-center">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="border border-black p-2">Depth (m)</th>
                                                <th className="border border-black p-2">Footing Dimension (m)</th>
                                                <th className="border border-black p-2">SBC Value (kN/m²)</th>
                                                <th className="border border-black p-2">Remarks</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {details.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td className="border border-black p-2 font-bold">{row.depth}</td>
                                                    <td className="border border-black p-2">{row.footingDimension || '-'}</td>
                                                    <td className="border border-black p-2 text-blue-900 font-bold">{row.sbcValue || '-'}</td>
                                                    <td className="border border-black p-2 text-left">{row.useForReport ? 'Selected for final recommendation' : '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Page>
                        ))}

                        {/* Point Load Strength Test Results */}
                        {formData.pointLoadStrength?.map((analysis, bhIndex) => (
                            <Page key={`pls-${bhIndex}`}>
                                <h4 className="font-bold text-[12pt] mb-4 text-blue-900">Point Load Strength Test Results: (BH {bhIndex + 1})</h4>
                                <div className="flex-1">
                                    <table className="w-full border-collapse border border-black text-[9pt] text-center">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="border border-black p-2">Depth (m)</th>
                                                <th className="border border-black p-2">Failure Load (P) (kN)</th>
                                                <th className="border border-black p-2">Correction Factor (f)</th>
                                                <th className="border border-black p-2">Is strength corrected?</th>
                                                <th className="border border-black p-2">Strength Value (Is) (MPa)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {analysis.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td className="border border-black p-2 font-bold">{row.depth}</td>
                                                    <td className="border border-black p-2">{row.failureLoad || '-'}</td>
                                                    <td className="border border-black p-2">{row.correctionFactor || '-'}</td>
                                                    <td className="border border-black p-2">{row.isStrengthCorrected ? 'Yes' : 'No'}</td>
                                                    <td className="border border-black p-2 font-bold">{row.strengthValue || '-'}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Page>
                        ))}

                        {/* Foundation in Rock Formations */}
                        {formData.foundationRockFormations && formData.foundationRockFormations.length > 0 && (
                            <Page>
                                <h4 className="font-bold text-[12pt] mb-4 text-blue-900">Foundation In Rock Formations</h4>
                                <div className="flex-1">
                                    <table className="w-full border-collapse border border-black text-[10pt] text-center">
                                        <thead>
                                            <tr className="bg-gray-200">
                                                <th className="border border-black p-3">Strata Type / Description</th>
                                                <th className="border border-black p-3">Depth Range (m)</th>
                                                <th className="border border-black p-3">Allowable Bearing Pressure (kN/m²)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.foundationRockFormations.map((row, rowIndex) => (
                                                <tr key={rowIndex}>
                                                    <td className="border border-black p-3 text-left font-medium">{row.strataType}</td>
                                                    <td className="border border-black p-3">{row.depthRange}</td>
                                                    <td className="border border-black p-3 font-bold text-blue-900">{row.allowablePressure}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </Page>
                        )}

                        {/* Site Photos Page */}
                        {formData.sitePhotos && formData.sitePhotos.length > 0 && (
                            <Page>
                                <h4 className="font-bold text-[12pt] mb-6 text-blue-900 border-b pb-2 uppercase">Annexure: Site Photographs</h4>
                                <div className="grid grid-cols-2 gap-8 overflow-y-auto max-h-[240mm]">
                                    {formData.sitePhotos.map((photo, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                            <div className="border border-black p-1 bg-white shadow-sm w-full h-[8cm] flex items-center justify-center">
                                                <img src={photo} alt={`Site Photo ${index + 1}`} className="max-w-full max-h-full object-contain" />
                                            </div>
                                            <p className="mt-2 text-[10pt] font-bold text-gray-700">Photo {index + 1}: {index === 0 ? 'Borehole Location' : 'Site View'}</p>
                                        </div>
                                    ))}
                                </div>
                            </Page>
                        )}

                        {/* Recommendations & Conclusions Page */}
                        <Page>
                            <h2 className="text-[12pt] font-bold mb-4 flex items-center">
                                <span className="bg-blue-900 text-white px-2 mr-3">4.0</span> RECOMMENDATIONS & CONCLUSIONS
                            </h2>
                            <div className="text-[11pt] space-y-4 text-justify leading-relaxed">
                                <div className="bg-blue-50/50 p-4 border border-blue-100 rounded">
                                    <h3 className="font-bold mb-2">Conclusions:</h3>
                                    {formData.conclusions && formData.conclusions.length > 0 ? (
                                        <ul className="list-disc ml-6 space-y-2">
                                            {formData.conclusions.map((c, i) => (
                                                <li key={i}>{c.value}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p className="italic text-gray-500">No specific conclusions added yet.</p>
                                    )}
                                </div>
                                <div className="mt-6">
                                    <h3 className="font-bold mb-2">Detailed Recommendations:</h3>
                                    <p className="whitespace-pre-wrap">{formData.recommendations || 'Based on the investigation results, the foundation should be designed as per IS codes...'}</p>
                                </div>
                                <div className="mt-8 p-4 border-l-4 border-blue-900 bg-gray-50">
                                    <p className="italic text-gray-700">
                                        Note: Note: The recommendations were made in this report based on 1 Nos. 100/150mm Auger Borehole/T.P investigations. During actual excavation if you encountered with any change of strata or loose strata or low SPT value, it is advisable to bring to the notice of Consultants or Clients.
                                    </p>
                                </div>
                                <div className="mt-8 flex flex-col items-end">
                                    <div className="flex items-end gap-4">
                                        <div className="flex flex-col items-center">
                                            <img src="/engineer-sign.jpeg" alt="Engineer Signature" className="h-[2.0cm] object-contain" />
                                        </div>
                                        <img src="/company-seal.png" alt="Company Seal" className="h-[2.5cm] object-contain" />
                                    </div>
                                    <div className="mt-4">
                                        <img src="/engineer-seal.jpeg" alt="Engineer Seal" className="h-[2cm] object-contain" />
                                    </div>
                                </div>
                            </div>
                        </Page>

                    </div>
                </div>
            </div>

            <style>{`
                @media screen {
                    .a4-page {
                        margin: 0 auto;
                        box-sizing: border-box;
                    }
                }
                @media print {
                    body * {
                        visibility: hidden !important;
                    }
                    #report-preview-modal, #report-preview-modal * {
                        visibility: visible !important;
                    }
                    #report-preview-modal {
                        position: absolute !important;
                        left: 0 !important;
                        top: 0 !important;
                        width: 100% !important;
                        height: auto !important;
                        padding: 0 !important;
                        margin: 0 !important;
                        overflow: visible !important;
                        background: white !important;
                        display: block !important;
                    }
                    .bg-black\\/60 {
                        background: transparent !important;
                        backdrop-filter: none !important;
                    }
                    .bg-gray-100 {
                        background: white !important;
                    }
                    .shadow-2xl {
                        box-shadow: none !important;
                    }
                    .rounded-lg {
                        border-radius: 0 !important;
                    }
                    .flex-1 {
                        overflow: visible !important;
                    }
                    .a4-page {
                        margin: 0 !important;
                        padding: 10mm !important;
                        width: 210mm !important;
                        height: 297mm !important;
                        box-sizing: border-box !important;
                        page-break-after: always !important;
                        break-after: page !important;
                        -webkit-print-color-adjust: exact !important;
                        print-color-adjust: exact !important;
                    }
                    .print\\:hidden {
                        display: none !important;
                    }
                    /* Ensure headers don't get cut off */
                    @page {
                        size: A4;
                        margin: 0;
                    }
                }
            `}</style>
        </div>
    );
};

export default ReportPreview;
