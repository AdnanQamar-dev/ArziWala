"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, Printer, Loader2, PenTool, ShieldCheck, 
  Languages, Eraser, Search, ChevronDown, CheckCircle2, Lock,
  Minimize, Maximize, ArrowRight
} from 'lucide-react';
import { ApplicationType, FormData, INITIAL_FORM_DATA, LanguageMode } from './types';
import { generateLetterText } from './services/pollinations';
import { Input, TextArea } from './components/Input';
import { PreviewModal } from './components/PreviewModal';
import { PlatformDetect } from './utils/platform';
import { TEMPLATES, CATEGORIES, TemplateConfig } from './data/templates';

// --- MAIN APP ---

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'landing' | 'app'>('landing');
  
  // App State: Dropdown Navigation System
  const [appType, setAppType] = useState<ApplicationType>('banking');
  const [templateId, setTemplateId] = useState<string>('bank_atm_lost'); 
  
  const [outputLang, setOutputLang] = useState<'en' | 'hi'>('en');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fitToPage, setFitToPage] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Derived State
  const currentCategory = CATEGORIES.find(c => c.id === appType);
  const categoryTemplates = TEMPLATES.filter(t => t.categoryId === appType);
  const activeTemplate = TEMPLATES.find(t => t.id === templateId) || categoryTemplates[0];

  // Search Filtering
  const searchResults = searchQuery.length > 1 ? TEMPLATES.filter(t => 
    t.labelEn.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.labelHi.toLowerCase().includes(searchQuery.toLowerCase())
  ) : [];

  // --- LOCAL STORAGE PERSISTENCE ---
  useEffect(() => {
    const savedData = localStorage.getItem('arziwala_form_data');
    if (savedData) {
      try {
        setFormData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse saved data");
      }
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
        localStorage.setItem('arziwala_form_data', JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData]);

  // Set default template when category changes
  useEffect(() => {
    const currentTemplate = TEMPLATES.find(t => t.id === templateId);
    if (currentTemplate && currentTemplate.categoryId !== appType) {
        const firstInNewCategory = TEMPLATES.find(t => t.categoryId === appType);
        if (firstInNewCategory) {
            setTemplateId(firstInNewCategory.id);
        }
    }
  }, [appType]);

  const handleReset = () => {
    if (confirm('Are you sure you want to clear the form?')) {
        setFormData(INITIAL_FORM_DATA);
        setGeneratedLetter('');
        localStorage.removeItem('arziwala_form_data');
    }
  };

  const selectSearchResult = (template: TemplateConfig) => {
      setAppType(template.categoryId);
      setTemplateId(template.id);
      setSearchQuery('');
      setIsSearchOpen(false);
  };

  const processInstantTemplate = (templateStr: string) => {
    let text = templateStr;
    const map: Record<string, string> = {
      '{{senderName}}': formData.senderName || '__________',
      '{{fatherName}}': formData.fatherName || '__________',
      '{{senderStreet}}': formData.senderStreet || '__________',
      '{{senderCity}}': formData.senderCity || '__________',
      '{{senderState}}': formData.senderState || '__________',
      '{{senderPincode}}': formData.senderPincode || '__________',
      '{{recipientStreet}}': formData.recipientStreet || '__________',
      '{{recipientCity}}': formData.recipientCity || '__________',
      '{{recipientState}}': formData.recipientState || '__________',
      '{{recipientPincode}}': formData.recipientPincode || '__________',
      '{{phone}}': formData.phone || '__________',
      '{{date}}': formData.date,
      '{{recipientTitle}}': formData.recipientTitle || '__________',
      '{{bankName}}': formData.bankName || '__________',
      '{{branchName}}': formData.branchName || '__________',
      '{{accountNumber}}': formData.accountNumber || '__________',
      '{{policeStation}}': formData.policeStation || '__________',
      '{{incidentDate}}': formData.incidentDate || '__________',
      '{{incidentTime}}': formData.incidentTime || '__________',
      '{{incidentLocation}}': formData.incidentLocation || '__________',
      '{{mobileDetails}}': formData.mobileDetails || '__________',
      '{{vehicleDetails}}': formData.vehicleDetails || '__________',
      '{{atmCardLastDigits}}': formData.atmCardLastDigits || '____',
      '{{consumerNumber}}': formData.consumerNumber || '__________',
      '{{customBody}}': formData.customBody || '__________',
      '{{chequeLeaves}}': formData.chequeLeaves || '25',
      '{{mobileModel}}': formData.mobileModel || '__________',
      '{{imeiNumber}}': formData.imeiNumber || '__________',
      '{{simNumber}}': formData.simNumber || '__________',
      '{{vehicleType}}': formData.vehicleType || '__________',
      '{{vehicleBrand}}': formData.vehicleBrand || '__________',
      '{{registrationNumber}}': formData.registrationNumber || '__________',
      '{{chassisNumber}}': formData.chassisNumber || '__________',
      '{{engineNumber}}': formData.engineNumber || '__________',
      '{{department}}': formData.department || '__________',
      '{{tehsil}}': formData.tehsil || '__________',
      '{{district}}': formData.district || '__________',
      '{{annualIncome}}': formData.annualIncome || '__________',
      '{{purpose}}': formData.purpose || '__________',
      '{{schoolName}}': formData.schoolName || '__________',
      '{{className}}': formData.className || '__________',
      '{{section}}': formData.section || '__________',
      '{{rollNumber}}': formData.rollNumber || '__________',
      '{{leaveReason}}': formData.leaveReason || '__________',
      '{{leaveFromDate}}': formData.leaveFromDate || '__________',
      '{{leaveToDate}}': formData.leaveToDate || '__________',
      '{{managerName}}': formData.managerName || '__________',
      '{{companyName}}': formData.companyName || '__________',
      '{{designation}}': formData.designation || '__________',
      '{{lastWorkingDate}}': formData.lastWorkingDate || '__________',
      '{{resignationReason}}': formData.resignationReason || '__________',
      '{{employeeId}}': formData.employeeId || '__________',
      '{{incidentDetails}}': formData.incidentDetails || ''
    };

    for (const [key, val] of Object.entries(map)) {
      text = text.split(key).join(val);
    }
    return text;
  };

  const handleGenerate = async () => {
    if (!activeTemplate) return;
    setLoading(true);
    let text = '';
    try {
      if (activeTemplate.type === 'instant') {
        const tpl = outputLang === 'hi' && activeTemplate.templateHi 
          ? activeTemplate.templateHi 
          : activeTemplate.templateEn || '';
        text = processInstantTemplate(tpl);
        setGeneratedLetter(text);
        await new Promise(r => setTimeout(r, 500)); 
      } else {
        // AI Generation
        text = await generateLetterText(activeTemplate.categoryId, formData, outputLang);
        setGeneratedLetter(text);
      }

      if (PlatformDetect.isMobile()) {
        setShowModal(true);
      }
    } catch (e) {
      alert("Error generating letter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    setView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Field Renderer
  const renderField = (field: keyof FormData) => {
    const commonProps = {
        name: field,
        value: (formData as any)[field] || '',
        onChange: handleInputChange,
    };

    switch(field) {
        case 'senderName': return <Input label="Your Name" placeholder="e.g. Aditi Sharma" {...commonProps} />;
        case 'fatherName': return <Input label="Father's Name" {...commonProps} />;
        
        case 'senderStreet': return <Input label="Street / Area" {...commonProps} />;
        case 'senderCity': return <Input label="City" {...commonProps} />;
        case 'senderState': return <Input label="State" {...commonProps} />;
        case 'senderPincode': return <Input label="Pincode" {...commonProps} />;

        case 'phone': return <Input label="Mobile Number" {...commonProps} />;
        case 'date': return <Input label="Date" type="date" {...commonProps} />;
        
        case 'recipientTitle': return <Input label="Recipient Title" placeholder="e.g. The Principal" {...commonProps} />;
        case 'recipientStreet': return <Input label="Recipient Street" {...commonProps} />;
        case 'recipientCity': return <Input label="Recipient City" {...commonProps} />;
        case 'recipientState': return <Input label="Recipient State" {...commonProps} />;
        case 'recipientPincode': return <Input label="Recipient Pincode" {...commonProps} />;

        case 'bankName': return <Input label="Bank Name" {...commonProps} />;
        case 'branchName': return <Input label="Branch" {...commonProps} />;
        case 'accountNumber': return <Input label="Account No." {...commonProps} />;
        case 'atmCardLastDigits': return <Input label="Last 4 Digits" maxLength={4} {...commonProps} />;
        case 'chequeLeaves': return (
            <div className="flex flex-col space-y-2 group">
                <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Cheque Leaves</label>
                <div className="relative">
                  <select className="w-full bg-white border border-zinc-200 rounded-lg px-4 py-3 text-sm text-zinc-900 appearance-none focus:outline-none focus:ring-1 focus:ring-zinc-900 focus:border-zinc-900" {...commonProps}>
                      <option value="25">25 Leaves</option>
                      <option value="50">50 Leaves</option>
                      <option value="100">100 Leaves</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
                </div>
            </div>
        );

        case 'policeStation': return <Input label="Police Station Name" {...commonProps} />;
        case 'incidentDate': return <Input label="Incident Date" type="date" {...commonProps} />;
        case 'incidentTime': return <Input label="Incident Time" type="time" {...commonProps} />;
        case 'incidentLocation': return <Input label="Location" {...commonProps} />;
        case 'mobileModel': return <Input label="Mobile Model" {...commonProps} />;
        case 'imeiNumber': return <Input label="IMEI Number" {...commonProps} />;
        case 'simNumber': return <Input label="SIM Number" {...commonProps} />;
        
        case 'vehicleType': return <Input label="Vehicle Type" placeholder="Car / Bike" {...commonProps} />;
        case 'vehicleBrand': return <Input label="Brand & Model" {...commonProps} />;
        case 'registrationNumber': return <Input label="Vehicle No." {...commonProps} />;
        case 'chassisNumber': return <Input label="Chassis No." {...commonProps} />;
        case 'engineNumber': return <Input label="Engine No." {...commonProps} />;

        case 'department': return <Input label="Department" {...commonProps} />;
        case 'tehsil': return <Input label="Tehsil" {...commonProps} />;
        case 'district': return <Input label="District" {...commonProps} />;
        case 'annualIncome': return <Input label="Annual Income" {...commonProps} />;
        case 'purpose': return <Input label="Purpose" {...commonProps} />;

        case 'schoolName': return <Input label="School Name" {...commonProps} />;
        case 'className': return <Input label="Class" {...commonProps} />;
        case 'section': return <Input label="Section" {...commonProps} />;
        case 'rollNumber': return <Input label="Roll No." {...commonProps} />;
        case 'principalName': return <Input label="Principal Name" {...commonProps} />;
        case 'leaveReason': return <Input label="Reason" {...commonProps} />;
        case 'leaveFromDate': return <Input label="Date From" type="date" {...commonProps} />;
        case 'leaveToDate': return <Input label="Date To" type="date" {...commonProps} />;

        case 'managerName': return <Input label="Manager Name" {...commonProps} />;
        case 'companyName': return <Input label="Company Name" {...commonProps} />;
        case 'designation': return <Input label="Designation" {...commonProps} />;
        case 'employeeId': return <Input label="Employee ID" {...commonProps} />;
        case 'lastWorkingDate': return <Input label="Last Working Date" type="date" {...commonProps} />;
        case 'resignationReason': return <Input label="Resignation Reason" {...commonProps} />;

        case 'customBody': 
        case 'incidentDetails':
            return <TextArea label="Additional Details" rows={4} {...commonProps} />;
        
        default: return <Input label={field} {...commonProps} />;
    }
  };

  return (
    <div className="min-h-screen font-sans bg-zinc-50 text-zinc-900">
      
      {/* MINIMAL STICKY HEADER */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200/60 no-print transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('landing')}>
            <div className="bg-zinc-900 text-white p-1.5 rounded transition-transform group-hover:scale-105">
              <FileText className="w-4 h-4" strokeWidth={2.5} />
            </div>
            <h1 className="text-lg font-serif font-bold text-zinc-900 tracking-tight">ArziWala</h1>
          </div>

          <div className="flex items-center gap-4">
             {/* Privacy Badge */}
             <div className="relative group cursor-help hidden md:block">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full border border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-800 transition-colors">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Local Privacy</span>
                </div>
                
                {/* Tooltip */}
                <div className="absolute right-0 top-full mt-3 w-72 p-5 bg-white rounded-lg shadow-xl border border-zinc-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 origin-top-right z-50">
                    <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-zinc-900 mt-1" />
                        <div>
                            <h4 className="font-bold text-zinc-900 text-sm">Your Data Stays Here</h4>
                            <p className="text-xs text-zinc-500 mt-2 leading-relaxed">
                                No servers. No databases. All processing happens locally in your browser.
                            </p>
                        </div>
                    </div>
                </div>
             </div>

             <button 
                onClick={scrollToForm}
                className="bg-zinc-900 hover:bg-zinc-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all md:hidden"
            >
                Create
            </button>
          </div>
        </div>
      </header>

      {/* VIEW: LANDING PAGE */}
      {view === 'landing' && (
        <div className="pt-32 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <section className="px-6 text-center max-w-4xl mx-auto">
            <h1 className="font-serif text-5xl md:text-7xl font-bold text-zinc-900 leading-[1.1] mb-8 tracking-tight">
              Official letters,<br />
              <span className="text-zinc-400">simplified.</span>
            </h1>
            <p className="text-lg md:text-xl text-zinc-500 max-w-xl mx-auto mb-10 font-light leading-relaxed">
              Generate professional applications for banks, police, and government offices in seconds. No formatting required.
            </p>
            <button 
              onClick={scrollToForm}
              className="group bg-zinc-900 text-white text-lg px-8 py-4 rounded-full font-medium inline-flex items-center gap-3 transition-all hover:bg-zinc-800 hover:shadow-lg hover:shadow-zinc-200 hover:-translate-y-1"
            >
              Start Writing
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </section>

          <section className="mt-24 px-6 border-t border-zinc-200 pt-16 max-w-6xl mx-auto">
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
                {[
                  { title: "Secure", sub: "Local-first processing" },
                  { title: "Instant", sub: "No login required" },
                  { title: "Bilingual", sub: "English & Hindi" },
                  { title: "Free", sub: "Open source tool" }
                ].map((item, i) => (
                  <div key={i} className="text-left">
                    <div className="font-serif font-bold text-xl text-zinc-900 mb-1">{item.title}</div>
                    <div className="text-sm text-zinc-500 font-medium">{item.sub}</div>
                  </div>
                ))}
             </div>
          </section>
        </div>
      )}

      {/* VIEW: APP INTERFACE */}
      {view === 'app' && (
        <main className="pt-24 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          
          {/* LEFT: CONFIGURATION & INPUTS */}
          <div className="lg:col-span-5 space-y-10 animate-in fade-in duration-500 no-print">

            {/* Config Block */}
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                     <h3 className="font-serif text-2xl font-bold text-zinc-900">Configuration</h3>
                     
                     {/* Search */}
                     <div className="relative z-20">
                        <div className="flex items-center border-b border-zinc-300 focus-within:border-zinc-900 transition-colors pb-1">
                            <Search className="w-4 h-4 text-zinc-400 mr-2" />
                            <input 
                                type="text" 
                                placeholder="Search templates..." 
                                className="bg-transparent text-sm focus:outline-none w-40 text-zinc-900 placeholder-zinc-400"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsSearchOpen(true);
                                }}
                                onFocus={() => setIsSearchOpen(true)}
                            />
                        </div>
                        {isSearchOpen && searchQuery.length > 0 && (
                            <div className="absolute top-full right-0 mt-4 w-72 bg-white rounded-lg shadow-xl border border-zinc-100 overflow-hidden max-h-60 overflow-y-auto">
                                {searchResults.length > 0 ? (
                                    searchResults.map(t => (
                                        <button 
                                            key={t.id}
                                            onClick={() => selectSearchResult(t)}
                                            className="w-full text-left px-5 py-3 text-sm hover:bg-zinc-50 border-b border-zinc-50 last:border-0 transition-colors"
                                        >
                                            <div className="font-medium text-zinc-900">{t.labelEn}</div>
                                            <div className="text-xs text-zinc-500 mt-0.5">{t.labelHi}</div>
                                        </button>
                                    ))
                                ) : (
                                    <div className="p-4 text-xs text-zinc-400 text-center">No matches found</div>
                                )}
                            </div>
                        )}
                        {isSearchOpen && searchQuery.length > 0 && (
                             <div className="fixed inset-0 z-10" onClick={() => setIsSearchOpen(false)}></div>
                        )}
                     </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {/* Category */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Category</label>
                        <div className="relative group">
                            <select 
                                value={appType}
                                onChange={(e) => setAppType(e.target.value as ApplicationType)}
                                className="w-full appearance-none bg-zinc-50 border border-transparent rounded-lg py-3 px-4 text-zinc-900 font-medium focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all hover:bg-zinc-100 cursor-pointer"
                            >
                                {CATEGORIES.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.labelEn}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none group-hover:text-zinc-600 transition-colors" />
                        </div>
                    </div>

                    {/* Template */}
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest">Type</label>
                        <div className="relative group">
                            <select 
                                value={templateId}
                                onChange={(e) => setTemplateId(e.target.value)}
                                className="w-full appearance-none bg-zinc-50 border border-transparent rounded-lg py-3 px-4 text-zinc-900 font-medium focus:outline-none focus:bg-white focus:ring-1 focus:ring-zinc-900 transition-all hover:bg-zinc-100 cursor-pointer"
                            >
                                {categoryTemplates.map(t => (
                                    <option key={t.id} value={t.id}>
                                        {t.labelEn}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none group-hover:text-zinc-600 transition-colors" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Inputs Block */}
            {activeTemplate && (
                <div className="space-y-8 pt-6 border-t border-zinc-200">
                    <div className="flex items-center justify-between">
                         <h3 className="font-serif text-2xl font-bold text-zinc-900">Details</h3>
                         <button onClick={handleReset} className="text-xs text-zinc-400 hover:text-red-600 font-medium flex items-center gap-1 transition-colors">
                             <Eraser className="w-3 h-3" /> Clear Form
                         </button>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-5">
                        {activeTemplate.requiredFields.map(field => (
                            <div key={field}>
                                {renderField(field)}
                            </div>
                        ))}
                    </div>

                    {/* Actions */}
                    <div className="pt-8 space-y-6">
                        <div className="flex items-center justify-between bg-zinc-50 p-4 rounded-lg">
                             <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Languages className="w-4 h-4" /> Language
                             </span>
                             <div className="flex bg-zinc-200/50 p-1 rounded-lg">
                                 <button 
                                    onClick={() => setOutputLang('en')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${outputLang === 'en' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                                 >
                                    English
                                 </button>
                                 <button 
                                    onClick={() => setOutputLang('hi')}
                                    className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${outputLang === 'hi' ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-500 hover:text-zinc-700'}`}
                                 >
                                    Hindi
                                 </button>
                             </div>
                        </div>

                        <button
                            onClick={handleGenerate}
                            disabled={loading}
                            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium text-lg py-4 rounded-xl shadow-lg shadow-zinc-200 transition-all flex items-center justify-center gap-3 active:scale-[0.99]"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <PenTool className="w-5 h-5" />}
                            <span>{loading ? 'Processing...' : 'Generate Letter'}</span>
                        </button>
                    </div>
                </div>
            )}
          </div>

          {/* RIGHT: PREVIEW */}
          <div className="hidden lg:block lg:col-span-7 pl-8 border-l border-zinc-100">
             <div className="sticky top-28 space-y-4">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                       <div className={`w-2 h-2 rounded-full ${generatedLetter ? 'bg-green-500' : 'bg-zinc-300'}`}></div>
                       <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Preview</span>
                   </div>
                   <div className="flex gap-2">
                       <button onClick={() => setFitToPage(!fitToPage)} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                          {fitToPage ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
                       </button>
                       <button onClick={() => setShowModal(true)} className="p-2 text-zinc-400 hover:text-zinc-900 transition-colors">
                          <Printer className="w-4 h-4" />
                       </button>
                   </div>
                </div>

                <div className="relative group perspective-1000">
                    <div 
                        className={`bg-white shadow-[0_10px_40px_rgba(0,0,0,0.08)] transition-all duration-500 ease-in-out origin-top border border-zinc-50 ${fitToPage ? 'scale-[0.65] origin-top' : ''}`}
                        style={{ minHeight: '297mm', width: '210mm' }}
                    >
                        {generatedLetter ? (
                            <textarea 
                                className="w-full h-full min-h-[297mm] resize-none outline-none border-none font-serif leading-relaxed text-[12pt] p-[25mm_20mm] bg-transparent text-zinc-900"
                                value={generatedLetter}
                                onChange={(e) => setGeneratedLetter(e.target.value)}
                                spellCheck={false}
                            />
                        ) : (
                            <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-300">
                                <FileText className="w-16 h-16 mb-4 opacity-20" strokeWidth={1} />
                                <p className="font-medium text-sm">Fill details to preview</p>
                            </div>
                        )}
                    </div>
                </div>
             </div>
          </div>

        </main>
      )}
      
      <PreviewModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        letterContent={generatedLetter} 
      />
      
    </div>
  );
};

export default App;