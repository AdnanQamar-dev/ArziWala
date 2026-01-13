"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, Printer, Loader2, PenTool, RefreshCcw, ShieldCheck, Lock, 
  Languages, AlertCircle, Coffee, Landmark, ShieldAlert, Zap, GraduationCap, 
  Files, User, Building2, Settings, Minimize, Maximize, ChevronDown, CheckCircle2,
  ArrowRight, Heart, QrCode, Feather, Eye, Save, Eraser, Edit3
} from 'lucide-react';
import { ApplicationType, FormData, INITIAL_FORM_DATA, LanguageMode } from './types';
import { generateLetterText } from './services/pollinations';
import { Input, TextArea } from './components/Input';
import { PreviewModal } from './components/PreviewModal';
import { PlatformDetect } from './utils/platform';

// --- DATA: BILINGUAL LABELS ---
const LABELS: Record<string, { en: string; hi: string }> = {
  // Sections
  yourDetails: { en: "Your Details", hi: "आपकी जानकारी" },
  recipientDetails: { en: "Recipient Details", hi: "जिसे पत्र भेजना है" },
  appDetails: { en: "Application Details", hi: "आवेदन का विवरण" },
  
  // Fields
  name: { en: "Name", hi: "नाम" },
  fatherName: { en: "Father's Name", hi: "पिता का नाम" },
  address: { en: "Address", hi: "पता" },
  city: { en: "City/District", hi: "शहर/जिला" },
  phone: { en: "Mobile Number", hi: "मोबाइल नंबर" },
  email: { en: "Email (Optional)", hi: "ईमेल (वैकल्पिक)" },
  
  recipientTitle: { en: "Recipient Title", hi: "पद (जैसे: शाखा प्रबंधक)" },
  recipientAddress: { en: "Recipient Address", hi: "कार्यालय का पता" },
  
  bankName: { en: "Bank Name", hi: "बैंक का नाम" },
  branchName: { en: "Branch Name", hi: "शाखा का नाम" },
  accountNumber: { en: "Account Number", hi: "खाता संख्या" },
  cifNumber: { en: "CIF / IFSC Code", hi: "CIF / IFSC कोड" },
  cardLastDigits: { en: "Card Last 4 Digits", hi: "कार्ड के अंतिम 4 अंक" },
  
  policeStation: { en: "Police Station Name", hi: "थाना का नाम" },
  incidentDate: { en: "Incident Date", hi: "घटना की तारीख" },
  incidentTime: { en: "Incident Time", hi: "घटना का समय" },
  mobileDetails: { en: "Mobile Model & IMEI", hi: "मोबाइल मॉडल और IMEI" },
  vehicleDetails: { en: "Vehicle Model & Reg No", hi: "गाड़ी का मॉडल और नंबर" },
  
  consumerNumber: { en: "Consumer / K Number", hi: "उपभोक्ता संख्या (K No)" },
  
  reason: { en: "Reason / Details", hi: "कारण / विवरण" },
  generate: { en: "Generate Letter", hi: "पत्र बनाएं" },
  download: { en: "Download PDF", hi: "PDF डाउनलोड करें" },
  print: { en: "Print Letter", hi: "पत्र प्रिंट करें" },
  copy: { en: "Copy Text", hi: "टेक्स्ट कॉपी करें" },
  preview: { en: "Preview Letter", hi: "पूर्वावलोकन देखें" },
  letterLang: { en: "Letter Language", hi: "पत्र की भाषा" },
  reset: { en: "Reset Form", hi: "फॉर्म रिसेट करें" }
};

// --- DATA: TEMPLATES SYSTEM ---
type TemplateType = 'instant' | 'ai';

interface TemplateConfig {
  id: string;
  labelEn: string;
  labelHi: string;
  type: TemplateType;
  requiredFields: (keyof FormData)[];
  templateText?: string; // For instant
  aiPrompt?: string; // For custom
}

const TEMPLATE_DB: Record<string, TemplateConfig[]> = {
  [ApplicationType.BANK_TRANSFER]: [
    {
      id: 'atm_lost',
      labelEn: "⚡ ATM Card Lost (Instant)",
      labelHi: "⚡ ATM कार्ड खो गया (तुरंत)",
      type: 'instant',
      requiredFields: ['senderName', 'accountNumber', 'bankName', 'branchName', 'atmCardLastDigits', 'date'],
      templateText: `To,
The Branch Manager,
{{bankName}},
{{branchName}}

Date: {{date}}

Subject: Request to Block Lost ATM Card (A/c: {{accountNumber}})

Respected Sir/Madam,

I, {{senderName}}, am holding a savings account in your branch with Account Number {{accountNumber}}.

I wish to inform you that my ATM/Debit Card (ending with digits {{atmCardLastDigits}}) has been lost/stolen.

I request you to immediately BLOCK the said card to prevent any misuse. I also request you to issue a new ATM card at your earliest convenience.

Thanking you.

Yours faithfully,

{{senderName}}
Mobile: {{phone}}`
    },
    {
      id: 'cheque_book',
      labelEn: "⚡ Request Cheque Book (Instant)",
      labelHi: "⚡ चेकबुक अनुरोध (तुरंत)",
      type: 'instant',
      requiredFields: ['senderName', 'accountNumber', 'bankName', 'branchName'],
      templateText: `To,
The Branch Manager,
{{bankName}},
{{branchName}}

Date: {{date}}

Subject: Request for Issue of New Cheque Book

Respected Sir/Madam,

I hold a savings account in your branch with Account Number {{accountNumber}}.

I request you to kindly issue a new Cheque Book (25 Leaves) for my account. I authorize you to debit the applicable charges from my account.

Kindly dispatch it to my registered address or inform me when I can collect it.

Thank you.

Yours faithfully,

{{senderName}}
Mobile: {{phone}}`
    },
    {
      id: 'bank_custom',
      labelEn: "🤖 Other Banking Issue (AI)",
      labelHi: "🤖 अन्य बैंक समस्या (AI)",
      type: 'ai',
      requiredFields: ['senderName', 'accountNumber', 'bankName', 'customBody']
    }
  ],
  [ApplicationType.POLICE_COMPLAINT]: [
    {
      id: 'mobile_theft',
      labelEn: "⚡ Mobile Theft FIR (Instant)",
      labelHi: "⚡ मोबाइल चोरी FIR (तुरंत)",
      type: 'instant',
      requiredFields: ['senderName', 'fatherName', 'senderAddress', 'policeStation', 'mobileDetails', 'incidentDate', 'incidentLocation'],
      templateText: `To,
The Station House Officer (SHO),
{{policeStation}}

Date: {{date}}

Subject: FIR regarding Theft of Mobile Phone

Respected Sir,

I, {{senderName}} S/o {{fatherName}}, resident of {{senderAddress}}, wish to report the theft of my mobile phone.

Incident Details:
- Date & Time: {{incidentDate}} at {{incidentTime}}
- Location: {{incidentLocation}}
- Mobile Model & IMEI: {{mobileDetails}}

The phone was stolen while I was at the above location. I request you to kindly register an FIR and help trace my mobile phone.

Thanking you.

Yours faithfully,

{{senderName}}
Contact: {{phone}}`
    },
    {
      id: 'police_custom',
      labelEn: "🤖 Other Police Complaint (AI)",
      labelHi: "🤖 अन्य पुलिस शिकायत (AI)",
      type: 'ai',
      requiredFields: ['senderName', 'policeStation', 'incidentDetails']
    }
  ],
  [ApplicationType.SCHOOL_LEAVE]: [
    {
      id: 'sick_leave',
      labelEn: "⚡ Sick Leave (Instant)",
      labelHi: "⚡ बीमारी की छुट्टी (तुरंत)",
      type: 'instant',
      requiredFields: ['senderName', 'recipientTitle'], // Title = Principal
      templateText: `To,
The Principal,
{{recipientAddress}}

Date: {{date}}

Subject: Application for Sick Leave

Respected Sir/Madam,

Most respectfully, I beg to state that I am suffering from high fever since last night. My doctor has advised me complete rest.

Therefore, I am unable to attend school/class today. I request you to kindly grant me leave for 2 days.

Thanking you.

Yours obediently,

{{senderName}}
Roll No: {{customBody}}`
    }
  ],
  [ApplicationType.ELECTRICITY_METER]: [
    {
      id: 'meter_fault',
      labelEn: "⚡ Faulty Meter (Instant)",
      labelHi: "⚡ खराब मीटर (तुरंत)",
      type: 'instant',
      requiredFields: ['senderName', 'consumerNumber', 'senderAddress'],
      templateText: `To,
The Assistant Engineer,
Electricity Department,
{{city}}

Date: {{date}}

Subject: Complaint regarding Faulty Electricity Meter (K.No: {{consumerNumber}})

Dear Sir,

I reside at {{senderAddress}}. My electricity connection has Consumer Number {{consumerNumber}}.

I wish to report that the meter installed at my premises is not working correctly (running too fast/stopped). This is causing incorrect billing.

I request you to kindly send a technician to inspect and replace the meter if found faulty.

Thank you.

Yours faithfully,

{{senderName}}
Mobile: {{phone}}`
    }
  ],
  [ApplicationType.OTHER]: [
    {
      id: 'general_custom',
      labelEn: "🤖 Write Any Letter (AI)",
      labelHi: "🤖 कोई भी पत्र लिखें (AI)",
      type: 'ai',
      requiredFields: ['senderName', 'recipientTitle', 'customBody']
    }
  ]
};

// --- COMPONENTS ---

const SectionHeader: React.FC<{ icon: any, title: string }> = ({ icon: Icon, title }) => (
  <div className="flex items-center space-x-2 text-blue-800 mb-4 border-b border-blue-100 pb-2">
    <Icon className="w-5 h-5" />
    <span className="font-bold text-sm uppercase tracking-wider">{title}</span>
  </div>
);

const TrustBadge: React.FC<{ icon: any, title: string, sub: string }> = ({ icon: Icon, title, sub }) => (
  <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-slate-100 text-center hover:shadow-md transition-shadow">
    <div className="bg-blue-50 p-3 rounded-full mb-3 text-blue-600">
      <Icon className="w-6 h-6" />
    </div>
    <div className="font-bold text-slate-800 text-sm">{title}</div>
    <div className="text-xs text-slate-500">{sub}</div>
  </div>
);

// --- MAIN APP ---

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'landing' | 'app'>('landing');
  
  // App State
  const [appType, setAppType] = useState<ApplicationType>(ApplicationType.BANK_TRANSFER);
  const [languageMode, setLanguageMode] = useState<LanguageMode>('both');
  
  // New State for Output Language
  const [outputLang, setOutputLang] = useState<'en' | 'hi'>('en');
  
  const [templateId, setTemplateId] = useState<string>('');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fitToPage, setFitToPage] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Derived State
  const currentTemplates = TEMPLATE_DB[appType] || TEMPLATE_DB[ApplicationType.OTHER];
  const activeTemplate = currentTemplates.find(t => t.id === templateId) || currentTemplates[0];

  // --- LOCAL STORAGE PERSISTENCE ---
  useEffect(() => {
    // Load from local storage on mount
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
    // Save to local storage on change
    const timeout = setTimeout(() => {
        localStorage.setItem('arziwala_form_data', JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData]);

  const handleReset = () => {
    if (confirm('Are you sure you want to clear the form?')) {
        setFormData(INITIAL_FORM_DATA);
        setGeneratedLetter('');
        localStorage.removeItem('arziwala_form_data');
    }
  };


  useEffect(() => {
    // Set default template when app type changes
    if (currentTemplates.length > 0) {
      setTemplateId(currentTemplates[0].id);
    }
  }, [appType]);

  // Pre-fill titles based on app type
  useEffect(() => {
    let title = '';
    if (appType === ApplicationType.BANK_TRANSFER || appType === ApplicationType.ATM_ISSUE) title = 'The Branch Manager';
    else if (appType === ApplicationType.POLICE_COMPLAINT) title = 'The Station House Officer (SHO)';
    else if (appType === ApplicationType.ELECTRICITY_METER) title = 'The Assistant Engineer';
    else if (appType === ApplicationType.SCHOOL_LEAVE) title = 'The Principal';
    
    // Only set if not already set by user (to allow custom overrides)
    setFormData(prev => prev.recipientTitle ? prev : ({ ...prev, recipientTitle: title }));
  }, [appType]);

  const getLabel = (key: string) => {
    const l = LABELS[key];
    if (!l) return key;
    if (languageMode === 'en') return l.en;
    if (languageMode === 'hi') return l.hi;
    return `${l.en} / ${l.hi}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const processInstantTemplate = (templateStr: string) => {
    let text = templateStr;
    const map: Record<string, string> = {
      '{{senderName}}': formData.senderName || '__________',
      '{{fatherName}}': formData.fatherName || '__________',
      '{{senderAddress}}': formData.senderAddress || '__________',
      '{{city}}': formData.city || '__________',
      '{{phone}}': formData.phone || '__________',
      '{{date}}': formData.date,
      '{{recipientTitle}}': formData.recipientTitle || '__________',
      '{{recipientAddress}}': formData.recipientAddress || '__________',
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
    };

    for (const [key, val] of Object.entries(map)) {
      text = text.split(key).join(val);
    }
    return text;
  };

  const handleGenerate = async () => {
    setLoading(true);
    let text = '';
    try {
      if (activeTemplate.type === 'instant' && activeTemplate.templateText) {
        // Instant Generation
        // Note: Instant templates are currently English-only logic in this version
        // We could duplicate templates for Hindi in future
        text = processInstantTemplate(activeTemplate.templateText);
        setGeneratedLetter(text);
        await new Promise(r => setTimeout(r, 500)); 
      } else {
        // AI Generation with Language Support
        text = await generateLetterText(appType, formData, outputLang);
        setGeneratedLetter(text);
      }

      // Auto-open modal on mobile/tablet or if requested
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

  // --- RENDER HELPERS ---
  
  const isFieldRequired = (field: keyof FormData) => activeTemplate?.requiredFields.includes(field);

  return (
    <div className="min-h-screen font-sans bg-slate-50 text-slate-800">
      <style>{`
        @media print {
          @page { margin: 0 !important; size: auto; }
          body { background: white; margin: 0; }
          .no-print { display: none !important; }
          #printable-letter {
            display: block !important;
            position: absolute; top: 0; left: 0; width: 100%; height: 100%;
            padding: 2.54cm; font-family: 'Times New Roman', serif;
            font-size: 12pt; line-height: 1.5; color: black; background: white;
            white-space: pre-wrap; z-index: 9999;
          }
        }
      `}</style>

      {/* HEADER */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setView('landing')}>
            <div className="bg-blue-600 p-2 rounded-lg text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none">ArziWala</h1>
              <p className="text-[10px] text-blue-600 font-bold tracking-widest uppercase">Letter Generator</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-slate-100 rounded-lg p-1">
              {(['en', 'hi', 'both'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setLanguageMode(m)}
                  className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${
                    languageMode === m ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {m === 'en' ? 'English' : m === 'hi' ? 'हिंदी' : 'Both/दोनों'}
                </button>
              ))}
            </div>
            <button 
                onClick={scrollToForm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-200 transition-all md:hidden"
            >
                Start
            </button>
          </div>
        </div>
      </header>

      {/* LANDING PAGE VIEW */}
      {view === 'landing' && (
        <div className="animate-in fade-in duration-500">
          {/* Hero */}
          <section className="bg-white border-b border-slate-200 pt-16 pb-20 px-4 text-center">
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="inline-flex items-center space-x-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-xs font-bold border border-blue-100">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Free & Secure • No Login Required</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                Official Letters <br className="hidden md:block" />
                <span className="text-blue-600">Made Simple.</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                Create Bank Applications, Police FIRs, and Office Letters in seconds. 
                <br className="hidden md:block"/>
                <span className="text-slate-400">सरकारी पत्र बनाना अब हुआ आसान - बैंक, पुलिस और ऑफिस के लिए।</span>
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={scrollToForm}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-xl shadow-blue-200 transition-transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <span>Start Writing Now</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="text-slate-400 text-sm font-medium">
                   ⚡ Instant Download
                </div>
              </div>
            </div>
          </section>

          {/* How it Works */}
          <section className="py-16 px-4 bg-slate-50 border-b border-slate-200">
             <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-12 uppercase tracking-widest text-slate-400">How It Works</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                      <div className="mb-4 inline-block p-4 bg-blue-50 rounded-full text-blue-600">
                         <Files className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">1. Choose Template</h3>
                      <p className="text-slate-500">Select what you need - ATM Lost, Cheque Book, or FIR.</p>
                   </div>
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                      <div className="mb-4 inline-block p-4 bg-indigo-50 rounded-full text-indigo-600">
                         <PenTool className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">2. Fill Details</h3>
                      <p className="text-slate-500">Enter simple details like Name, Account No, etc.</p>
                   </div>
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                      <div className="mb-4 inline-block p-4 bg-green-50 rounded-full text-green-600">
                         <Printer className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">3. Download/Print</h3>
                      <p className="text-slate-500">Get a professional PDF ready to print instantly.</p>
                   </div>
                </div>
             </div>
          </section>

          {/* Trust Grid */}
          <section className="py-12 px-4 bg-white">
             <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                <TrustBadge icon={ShieldCheck} title="100% Secure" sub="Data stays on device" />
                <TrustBadge icon={Zap} title="Instant" sub="No waiting time" />
                <TrustBadge icon={Landmark} title="Made in India" sub="For Indian needs" />
                <TrustBadge icon={CheckCircle2} title="Free Forever" sub="No hidden charges" />
             </div>
          </section>
        </div>
      )}

      {/* APPLICATION VIEW */}
      {view === 'app' && (
        <main className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          
          {/* LEFT: FORM */}
          <div className="space-y-6 pb-32 lg:pb-0 no-print">
            
            {/* 1. Category Selection */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <SectionHeader icon={Settings} title="Select Letter Type / पत्र का प्रकार" />
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Category / श्रेणी</label>
                   <select 
                      className="w-full p-3 border rounded-lg bg-slate-50 font-medium"
                      value={appType}
                      onChange={(e) => setAppType(e.target.value as ApplicationType)}
                   >
                     {Object.values(ApplicationType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                 </div>
                 <div className="space-y-1">
                   <label className="text-xs font-bold text-slate-500 uppercase">Template / टेम्पलेट</label>
                   <select 
                      className="w-full p-3 border rounded-lg bg-blue-50 font-medium text-blue-900 border-blue-200"
                      value={templateId}
                      onChange={(e) => setTemplateId(e.target.value)}
                   >
                     {currentTemplates.map(t => <option key={t.id} value={t.id}>{t.labelEn}</option>)}
                   </select>
                 </div>
               </div>
            </div>

            {/* 2. Dynamic Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-slate-700">
                    <User className="w-5 h-5" />
                    <span className="font-bold text-sm uppercase">Fill Details</span>
                  </div>
                  <div className="flex gap-2">
                     <button onClick={handleReset} className="text-xs text-slate-400 hover:text-red-500 underline flex items-center gap-1">
                        <Eraser className="w-3 h-3" /> Reset
                     </button>
                     <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">
                        {activeTemplate.type === 'instant' ? '⚡ Instant' : '🤖 AI Powered'}
                     </span>
                  </div>
               </div>
               
               <div className="p-6 space-y-6">
                  {/* Sender Basic */}
                  {(isFieldRequired('senderName') || isFieldRequired('senderAddress')) && (
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                       {isFieldRequired('senderName') && (
                          <Input label={getLabel('name')} name="senderName" value={formData.senderName} onChange={handleInputChange} placeholder="e.g. Ramesh Kumar" />
                       )}
                       {isFieldRequired('fatherName') && (
                          <Input label={getLabel('fatherName')} name="fatherName" value={formData.fatherName} onChange={handleInputChange} placeholder="e.g. Suresh Kumar" />
                       )}
                       <Input label={getLabel('phone')} name="phone" value={formData.phone} onChange={handleInputChange} placeholder="98765XXXXX" />
                       <Input label={getLabel('city')} name="city" value={formData.city} onChange={handleInputChange} />
                     </div>
                  )}
                  {isFieldRequired('senderAddress') && (
                      <Input label={getLabel('address')} name="senderAddress" value={formData.senderAddress} onChange={handleInputChange} placeholder="House No, Colony, City" />
                  )}

                  {/* Bank Details */}
                  {appType.includes('Bank') || appType.includes('ATM') ? (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-4">
                        <SectionHeader icon={Landmark} title="Bank Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label={getLabel('bankName')} name="bankName" value={formData.bankName} onChange={handleInputChange} />
                            <Input label={getLabel('branchName')} name="branchName" value={formData.branchName} onChange={handleInputChange} />
                            <Input label={getLabel('accountNumber')} name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} />
                            {isFieldRequired('atmCardLastDigits') && (
                                <Input label={getLabel('cardLastDigits')} name="atmCardLastDigits" value={formData.atmCardLastDigits} onChange={handleInputChange} maxLength={4} />
                            )}
                        </div>
                    </div>
                  ) : null}

                  {/* Police Details */}
                  {appType.includes('Police') ? (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 space-y-4">
                         <SectionHeader icon={ShieldAlert} title="Incident Details" />
                         <Input label={getLabel('policeStation')} name="policeStation" value={formData.policeStation} onChange={handleInputChange} />
                         <div className="grid grid-cols-2 gap-4">
                            <Input label={getLabel('incidentDate')} name="incidentDate" type="date" value={formData.incidentDate} onChange={handleInputChange} />
                            <Input label={getLabel('incidentTime')} name="incidentTime" type="time" value={formData.incidentTime} onChange={handleInputChange} />
                         </div>
                         {isFieldRequired('mobileDetails') && (
                            <Input label={getLabel('mobileDetails')} name="mobileDetails" value={formData.mobileDetails} onChange={handleInputChange} placeholder="Model Name, IMEI Number" />
                         )}
                         <Input label={getLabel('incidentLocation')} name="incidentLocation" value={formData.incidentLocation} onChange={handleInputChange} />
                    </div>
                  ) : null}

                  {/* Custom Body / Reason */}
                  {(isFieldRequired('customBody') || isFieldRequired('incidentDetails')) && (
                     <TextArea 
                        label={getLabel('reason')} 
                        name="customBody" 
                        value={formData.customBody} 
                        onChange={handleInputChange} 
                        placeholder="Explain your request in detail..."
                        rows={4}
                     />
                  )}
               </div>
            </div>

            {/* GENERATE BUTTON */}
            <div className="space-y-4">
                {activeTemplate.type === 'ai' && (
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center justify-between">
                         <label className="text-sm font-bold text-indigo-900 flex items-center gap-2">
                             <Languages className="w-4 h-4" />
                             {getLabel('letterLang')}:
                         </label>
                         <div className="flex bg-white rounded-lg p-1 border border-indigo-200">
                             <button 
                                onClick={() => setOutputLang('en')}
                                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${outputLang === 'en' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-indigo-50'}`}
                             >
                                English
                             </button>
                             <button 
                                onClick={() => setOutputLang('hi')}
                                className={`px-4 py-1.5 rounded-md text-sm font-bold transition-all ${outputLang === 'hi' ? 'bg-indigo-600 text-white shadow' : 'text-slate-500 hover:bg-indigo-50'}`}
                             >
                                हिंदी
                             </button>
                         </div>
                    </div>
                )}
                
                <button
                onClick={handleGenerate}
                disabled={loading || !formData.senderName}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-slate-300 transition-all flex items-center justify-center gap-3 text-lg"
                >
                {loading ? <Loader2 className="animate-spin" /> : <PenTool className="w-5 h-5" />}
                <span>{activeTemplate.type === 'instant' ? getLabel('generate') : `Generate in ${outputLang === 'en' ? 'English' : 'Hindi'}`}</span>
                </button>
            </div>
            
            {/* Mobile Preview Button (only if generated) */}
            {generatedLetter && (
               <button
                  onClick={() => setShowModal(true)}
                  className="w-full mt-4 bg-white border border-slate-300 text-slate-700 font-bold py-3 px-6 rounded-xl shadow-sm lg:hidden flex items-center justify-center gap-2"
               >
                  <Eye className="w-5 h-5" />
                  <span>{getLabel('preview')}</span>
               </button>
            )}

            {/* UPI DONATION SECTION */}
            <div className="mt-8 bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl border border-orange-100 p-6 text-center">
                 <div className="inline-flex items-center space-x-2 bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs font-bold mb-4">
                    <Coffee className="w-3 h-3" />
                    <span>Support Developer</span>
                 </div>
                 <h3 className="text-lg font-bold text-slate-800 mb-2">Useful? Buy me a chai! ☕</h3>
                 <p className="text-sm text-slate-500 mb-6">This tool is free and private. Your support keeps it running.</p>
                 
                 <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                    {/* Desktop QR Placeholder */}
                    <div className="hidden md:block bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                       <div className="w-24 h-24 bg-slate-800 flex items-center justify-center text-white rounded">
                          <QrCode className="w-12 h-12 opacity-50" />
                       </div>
                       <div className="text-[10px] mt-1 font-mono text-slate-500">yourname@okicici</div>
                    </div>

                    {/* Mobile UPI Button */}
                    <div className="space-y-3 w-full md:w-auto">
                        <a 
                           href="upi://pay?pa=yourname@okicici&pn=MeriArzi&cu=INR" 
                           className="flex items-center justify-center w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors gap-2"
                        >
                           <Heart className="w-4 h-4 fill-white" />
                           <span>Donate via UPI App</span>
                        </a>
                        <p className="text-xs text-slate-400">Works with GPay, PhonePe, Paytm</p>
                    </div>
                 </div>
            </div>

          </div>

          {/* RIGHT: DESKTOP PREVIEW (Hidden on Mobile) */}
          <div className="hidden lg:flex lg:sticky lg:top-24 lg:self-start h-auto lg:h-[calc(100vh-8rem)] flex-col gap-4">
             <div className="flex items-center justify-between no-print bg-white p-2 rounded-lg border border-slate-200 shadow-sm">
                <span className="text-xs font-bold uppercase text-slate-500 ml-2">Preview (Editable)</span>
                <div className="flex gap-2">
                   <button onClick={() => setFitToPage(!fitToPage)} className="p-2 hover:bg-slate-100 rounded text-slate-600" title="Fit">
                      {fitToPage ? <Maximize className="w-4 h-4" /> : <Minimize className="w-4 h-4" />}
                   </button>
                   <button onClick={() => setShowModal(true)} className="p-2 hover:bg-blue-50 rounded text-blue-600 font-bold flex items-center gap-2" title="Print/PDF">
                      <Printer className="w-4 h-4" />
                      <span className="text-xs">Print / PDF</span>
                   </button>
                </div>
             </div>

             <div className="flex-grow bg-slate-200 rounded-xl overflow-hidden shadow-inner border border-slate-300 relative">
                <div className="absolute inset-0 overflow-auto p-4 md:p-8 flex justify-center [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                    {generatedLetter ? (
                        <div 
                            className={`bg-white shadow-2xl text-slate-900 transition-all duration-300 origin-top
                                ${fitToPage ? 'w-full scale-95' : 'w-[210mm] min-h-[297mm]'}
                            `}
                            style={{ padding: '0' }}
                        >
                            {/* EDITABLE TEXTAREA ACTING AS PAGE */}
                            <textarea 
                                className="w-full h-full resize-none outline-none border-none font-serif leading-relaxed text-[12pt] p-[25mm_20mm]"
                                value={generatedLetter}
                                onChange={(e) => setGeneratedLetter(e.target.value)}
                                spellCheck={false}
                            />
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center text-slate-400 h-full space-y-4">
                            <FileText className="w-16 h-16 opacity-20" />
                            <p className="font-medium text-sm">Fill the form to see preview</p>
                        </div>
                    )}
                </div>
             </div>
          </div>

        </main>
      )}
      
      {/* CROSS-PLATFORM PREVIEW MODAL */}
      <PreviewModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        letterContent={generatedLetter} 
      />
      
      {/* Printable Hidden Area (for direct browser print fallback) */}
      <div id="printable-letter" className="hidden">
           {generatedLetter}
      </div>
    </div>
  );
};

export default App;