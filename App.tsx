"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, Printer, Loader2, PenTool, ShieldCheck, 
  Languages, Coffee, Landmark, ShieldAlert,
  Files, User, Settings, Minimize, Maximize,
  ArrowRight, Heart, QrCode, Eraser, Eye, GraduationCap, Building2, Ticket,
  Zap, CheckCircle2, ChevronDown
} from 'lucide-react';
import { ApplicationType, FormData, INITIAL_FORM_DATA, LanguageMode } from './types';
import { generateLetterText, APPLICATION_TYPES } from './services/pollinations';
import { Input, TextArea } from './components/Input';
import { PreviewModal } from './components/PreviewModal';
import { PlatformDetect } from './utils/platform';

// --- DATA: BILINGUAL LABELS ---
const LABELS: Record<string, { en: string; hi: string }> = {
  // --- Landing Page ---
  heroBadge: { en: "100% Free & Secure • No Login Required", hi: "100% मुफ्त और सुरक्षित • लॉगिन की जरूरत नहीं" },
  heroTitle1: { en: "Official Letters", hi: "सरकारी पत्र (Arzi)" },
  heroTitle2: { en: "Made Simple.", hi: "बनाना हुआ आसान।" },
  heroDesc: { en: "Create Bank Applications, Police FIRs, and Office Letters in seconds.", hi: "बैंक, पुलिस और ऑफिस के लिए अर्जी लिखें, चुटकियों में।" },
  startWriting: { en: "Start Writing Now", hi: "अभी लिखना शुरू करें" },
  instantDL: { en: "Instant Download", hi: "तुरंत डाउनलोड" },
  
  howItWorks: { en: "How It Works", hi: "यह कैसे काम करता है" },
  step1Title: { en: "Choose Template", hi: "टेम्पलेट चुनें" },
  step1Desc: { en: "Select what you need - ATM Lost, Cheque Book, or FIR.", hi: "अपनी ज़रूरत चुनें - एटीएम खो गया, चेकबुक, या एफआईआर।" },
  step2Title: { en: "Fill Details", hi: "विवरण भरें" },
  step2Desc: { en: "Enter simple details like Name, Account No, etc.", hi: "नाम, खाता संख्या आदि जैसी जानकारी भरें।" },
  step3Title: { en: "Download/Print", hi: "डाउनलोड / प्रिंट" },
  step3Desc: { en: "Get a professional PDF ready to print instantly.", hi: "तुरंत प्रिंट करने योग्य प्रोफेशनल PDF प्राप्त करें।" },
  
  trustSecure: { en: "100% Secure", hi: "100% सुरक्षित" },
  trustSecureSub: { en: "Data stays on device", hi: "डाटा डिवाइस पर रहता है" },
  trustInstant: { en: "Instant", hi: "तुरंत" },
  trustInstantSub: { en: "No waiting time", hi: "कोई इंतज़ार नहीं" },
  trustIndia: { en: "Made in India", hi: "भारत में निर्मित" },
  trustIndiaSub: { en: "For Indian needs", hi: "भारतीय जरूरतों के लिए" },
  trustFree: { en: "Free Forever", hi: "हमेशा मुफ्त" },
  trustFreeSub: { en: "No hidden charges", hi: "कोई शुल्क नहीं" },

  // Fields
  name: { en: "Name", hi: "नाम" },
  fatherName: { en: "Father's Name", hi: "पिता का नाम" },
  address: { en: "Address", hi: "पता" },
  city: { en: "City/District", hi: "शहर/जिला" },
  phone: { en: "Mobile Number", hi: "मोबाइल नंबर" },
  email: { en: "Email (Optional)", hi: "ईमेल (वैकल्पिक)" },
  aadhar: { en: "Aadhar Number", hi: "आधार संख्या" },
  
  recipientTitle: { en: "Recipient Title", hi: "पद (जैसे: शाखा प्रबंधक)" },
  recipientAddress: { en: "Recipient Address", hi: "कार्यालय का पता" },
  
  bankName: { en: "Bank Name", hi: "बैंक का नाम" },
  branchName: { en: "Branch Name", hi: "शाखा का नाम" },
  accountNumber: { en: "Account Number", hi: "खाता संख्या" },
  cifNumber: { en: "CIF / IFSC Code", hi: "CIF / IFSC कोड" },
  
  policeStation: { en: "Police Station Name", hi: "थाना का नाम" },
  incidentDate: { en: "Incident Date", hi: "घटना की तारीख" },
  incidentTime: { en: "Incident Time", hi: "घटना का समय" },
  mobileDetails: { en: "Mobile Model & IMEI", hi: "मोबाइल मॉडल और IMEI" },
  
  consumerNumber: { en: "Consumer / K Number", hi: "उपभोक्ता संख्या (K No)" },
  
  reason: { en: "Reason / Details", hi: "कारण / विवरण" },
  generate: { en: "Generate Letter", hi: "पत्र बनाएं" },
  preview: { en: "Preview Letter", hi: "पूर्वावलोकन देखें" },
  letterLang: { en: "Letter Language", hi: "पत्र की भाषा" },
  reset: { en: "Reset Form", hi: "फॉर्म रिसेट करें" }
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

// --- GROUPING LOGIC ---
// Defined outside component to prevent recreation and ensure stability.
// Filter logic is strict to prevent items from appearing in multiple categories, which causes UI jumping.
const GROUPED_TYPES: Record<string, string[]> = {
    'Banking': Object.values(APPLICATION_TYPES).filter(t => t.includes('Bank') || t.includes('ATM') || t.includes('Cheque')),
    'Police / FIR': Object.values(APPLICATION_TYPES).filter(t => t.includes('Police') || t.includes('FIR') || t.includes('Missing')),
    'School / College': Object.values(APPLICATION_TYPES).filter(t => t.includes('School') || t.includes('College') || t.includes('Scholarship') || t.includes('Exam') || t.includes('Board')),
    // Exclude School/College items from Certificates
    'Certificates': Object.values(APPLICATION_TYPES).filter(t => (t.includes('Certificate') || t.includes('OBC') || t.includes('EWS')) && !t.includes('School') && !t.includes('College')),
    'Electricity / Water': Object.values(APPLICATION_TYPES).filter(t => t.includes('Electricity') || t.includes('Water')),
    'Government Schemes': Object.values(APPLICATION_TYPES).filter(t => t.includes('Kisan') || t.includes('Ration') || t.includes('Pension') || t.includes('Labour')),
    // Exclude Police from Other
    'Other': Object.values(APPLICATION_TYPES).filter(t => (t.includes('General') || t.includes('RTI')) && !t.includes('Police'))
};

const CATEGORIES = Object.keys(GROUPED_TYPES);

// --- MAIN APP ---

const App: React.FC = () => {
  // Navigation State
  const [view, setView] = useState<'landing' | 'app'>('landing');
  
  // Use constants for categories
  const groupedTypes = GROUPED_TYPES;
  const categories = CATEGORIES;

  // App State
  const [appType, setAppType] = useState<string>(APPLICATION_TYPES.BANK_ACCOUNT_OPEN);
  const [activeCategory, setActiveCategory] = useState<string>('Banking');

  const [languageMode, setLanguageMode] = useState<LanguageMode>('both');
  const [outputLang, setOutputLang] = useState<'en' | 'hi'>('hi'); // Default to Hindi as per user context
  
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [fitToPage, setFitToPage] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  // Derived State for Field Visibility
  const showBankFields = appType.includes('Bank') || appType.includes('ATM') || appType.includes('Cheque');
  const showPoliceFields = appType.includes('Police') || appType.includes('FIR') || appType.includes('Missing');
  const showSchoolFields = appType.includes('School') || appType.includes('College') || appType.includes('Scholarship') || appType.includes('Exam') || appType.includes('Board');
  const showElectricityFields = appType.includes('Electricity');
  const showCertificateFields = appType.includes('Certificate') || appType.includes('OBC') || appType.includes('EWS');
  const showRTIFields = appType.includes('RTI');

  // --- LOCAL STORAGE PERSISTENCE ---
  useEffect(() => {
    const savedData = localStorage.getItem('arziwala_form_data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        // Merge with initial to ensure all fields exist
        setFormData({ ...INITIAL_FORM_DATA, ...parsed });
      } catch (e) { console.error("Failed to parse saved data"); }
    }
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
        localStorage.setItem('arziwala_form_data', JSON.stringify(formData));
    }, 1000);
    return () => clearTimeout(timeout);
  }, [formData]);

  // Sync activeCategory when appType changes (e.g. from local storage or manual selection)
  useEffect(() => {
    // If the currently active category already contains the selected appType, do nothing.
    // This prevents the tab from switching back if an item technically exists in multiple lists (rare now due to strict filtering)
    // or if the user is browsing within the category.
    if (groupedTypes[activeCategory]?.includes(appType)) {
        return;
    }

    // Otherwise, find the correct category for this appType
    const foundCategory = Object.entries(groupedTypes).find(([_, types]) => types.includes(appType));
    if (foundCategory) {
        setActiveCategory(foundCategory[0]);
    }
  }, [appType, activeCategory]);

  const handleReset = () => {
    if (confirm('Are you sure you want to clear the form?')) {
        setFormData(INITIAL_FORM_DATA);
        setGeneratedLetter('');
        localStorage.removeItem('arziwala_form_data');
    }
  };

  // Pre-fill titles based on app type
  useEffect(() => {
    let title = '';
    
    // Determine title based on category/keywords
    if (showBankFields) title = 'The Branch Manager';
    else if (showPoliceFields) title = 'The Station House Officer (SHO)';
    else if (showElectricityFields) title = 'The Assistant Engineer';
    else if (showSchoolFields) title = 'The Principal';
    else if (appType.includes('RTI')) title = 'The Public Information Officer';
    else if (appType.includes('Scheme') || appType.includes('Kisan') || appType.includes('Ration') || appType.includes('Pension') || appType.includes('Labour')) title = 'The Block Development Officer (BDO)';
    else if (appType.includes('Certificate') || appType.includes('Caste') || appType.includes('Income') || appType.includes('Domicile')) title = 'The Circle Officer (CO)';
    
    // Only set if currently empty or if the user hasn't typed a custom one (simple check: if it matches another default)
    setFormData(prev => {
        // If empty, set it
        if (!prev.recipientTitle) return { ...prev, recipientTitle: title };
        // If it matches a known default but is wrong for current type, update it
        // (Optional: for now just set if empty to respect user edits)
        return prev;
    });
  }, [appType, showBankFields, showPoliceFields, showElectricityFields, showSchoolFields]);

  const getLabel = (key: string) => {
    const l = LABELS[key];
    if (!l) return key;
    if (languageMode === 'en') return l.en;
    if (languageMode === 'hi') return l.hi;
    return `${l.en} / ${l.hi}`;
  };

  const getLandingText = (key: string) => {
    const l = LABELS[key];
    if (!l) return key;
    if (languageMode === 'hi') return l.hi;
    return l.en;
  };
  
  const getLandingSubText = (key: string) => {
    const l = LABELS[key];
    if (!l) return null;
    if (languageMode === 'both') return l.hi;
    return null;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const text = await generateLetterText(appType, formData, outputLang);
      setGeneratedLetter(text);
      if (PlatformDetect.isMobile()) {
        setShowModal(true);
      }
    } catch (e: any) {
      alert(e.message || "Error generating letter. Please check required fields.");
    } finally {
      setLoading(false);
    }
  };

  const scrollToForm = () => {
    setView('app');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // UPI Configuration
  const UPI_ID = "adnanqamar.dev@oksbi";
  const PAYEE_NAME = "Md. Adnan Qamar";
  const UPI_LINK = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(PAYEE_NAME)}&cu=INR`;
  const QR_CODE_URL = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&bgcolor=ffffff&data=${encodeURIComponent(UPI_LINK)}`;

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
            {/* Start button only visible on landing page for mobile */}
            {view === 'landing' && (
              <button onClick={scrollToForm} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md shadow-blue-200 transition-all md:hidden">
                Start
              </button>
            )}
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
                <span>{getLandingText('heroBadge')}</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                {getLandingText('heroTitle1')} <br className="hidden md:block" />
                <span className="text-blue-600">{getLandingText('heroTitle2')}</span>
              </h1>
              <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto">
                {getLandingText('heroDesc')}
                {getLandingSubText('heroDesc') && (
                  <>
                    <br className="hidden md:block"/>
                    <span className="text-slate-400 block mt-1 md:mt-0 md:inline">{getLandingSubText('heroDesc')}</span>
                  </>
                )}
              </p>
              
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                <button 
                  onClick={scrollToForm}
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white text-lg font-bold py-4 px-8 rounded-xl shadow-xl shadow-blue-200 transition-transform hover:-translate-y-1 flex items-center justify-center gap-2"
                >
                  <span>{getLandingText('startWriting')}</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <div className="text-slate-400 text-sm font-medium">
                   ⚡ {getLandingText('instantDL')}
                </div>
              </div>
            </div>
          </section>

          {/* How it Works */}
          <section className="py-16 px-4 bg-slate-50 border-b border-slate-200">
             <div className="max-w-6xl mx-auto">
                <h2 className="text-2xl font-bold text-center mb-12 uppercase tracking-widest text-slate-400">
                  {getLandingText('howItWorks')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-2 h-full bg-blue-500"></div>
                      <div className="mb-4 inline-block p-4 bg-blue-50 rounded-full text-blue-600">
                         <Files className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{getLandingText('step1Title')}</h3>
                      <p className="text-slate-500">{getLandingText('step1Desc')}</p>
                   </div>
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-2 h-full bg-indigo-500"></div>
                      <div className="mb-4 inline-block p-4 bg-indigo-50 rounded-full text-indigo-600">
                         <PenTool className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{getLandingText('step2Title')}</h3>
                      <p className="text-slate-500">{getLandingText('step2Desc')}</p>
                   </div>
                   <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center relative overflow-hidden group">
                      <div className="absolute top-0 left-0 w-2 h-full bg-green-500"></div>
                      <div className="mb-4 inline-block p-4 bg-green-50 rounded-full text-green-600">
                         <Printer className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">{getLandingText('step3Title')}</h3>
                      <p className="text-slate-500">{getLandingText('step3Desc')}</p>
                   </div>
                </div>
             </div>
          </section>

          {/* Trust Grid */}
          <section className="py-12 px-4 bg-white">
             <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
                <TrustBadge icon={ShieldCheck} title={getLandingText('trustSecure')} sub={getLandingText('trustSecureSub')} />
                <TrustBadge icon={Zap} title={getLandingText('trustInstant')} sub={getLandingText('trustInstantSub')} />
                <TrustBadge icon={Landmark} title={getLandingText('trustIndia')} sub={getLandingText('trustIndiaSub')} />
                <TrustBadge icon={CheckCircle2} title={getLandingText('trustFree')} sub={getLandingText('trustFreeSub')} />
             </div>
          </section>
        </div>
      )}

      {/* APPLICATION VIEW */}
      {view === 'app' && (
        <main className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          
          {/* LEFT: FORM */}
          <div className="space-y-6 pb-32 lg:pb-0 no-print">
            
            {/* 1. Improved Category Selection */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-slate-200">
               <SectionHeader icon={Settings} title="Select Letter Type / पत्र का प्रकार" />
               
               {/* Category Tabs/Grid */}
               <div className="mb-6">
                 <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">1. Choose Category / श्रेणी चुनें</label>
                 <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                   {categories.map(cat => {
                      let Icon = Files;
                      if (cat.includes('Banking')) Icon = Landmark;
                      else if (cat.includes('Police')) Icon = ShieldAlert;
                      else if (cat.includes('School')) Icon = GraduationCap;
                      else if (cat.includes('Electricity')) Icon = Zap;
                      else if (cat.includes('Government')) Icon = Building2;
                      else if (cat.includes('Certificate')) Icon = CheckCircle2;

                      return (
                        <button
                          key={cat}
                          onClick={() => {
                            setActiveCategory(cat);
                            // Auto-select first option in this category
                            const types = groupedTypes[cat];
                            if (types && types.length > 0) {
                                setAppType(types[0]);
                            }
                          }}
                          className={`
                            flex flex-col items-center justify-center p-3 rounded-lg border transition-all h-24
                            ${activeCategory === cat 
                              ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500 shadow-sm' 
                              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm'}
                          `}
                        >
                          <Icon className={`w-6 h-6 mb-2 ${activeCategory === cat ? 'text-blue-600' : 'text-slate-400'}`} />
                          <span className="text-[10px] sm:text-xs font-bold uppercase text-center leading-tight">{cat}</span>
                        </button>
                      )
                   })}
                 </div>
               </div>

               {/* Specific Letter Dropdown */}
               <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                 <label className="text-xs font-bold text-slate-500 uppercase">2. Select Specific Letter / पत्र चुनें</label>
                 <div className="relative">
                   <select 
                      className="w-full p-4 pl-12 pr-10 border rounded-xl bg-slate-50 font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer hover:bg-slate-100 transition-colors"
                      value={appType}
                      onChange={(e) => setAppType(e.target.value)}
                   >
                     {groupedTypes[activeCategory as keyof typeof groupedTypes]?.map(t => (
                       <option key={t} value={t}>{t}</option>
                     ))}
                   </select>
                   <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-600 pointer-events-none">
                      <FileText className="w-5 h-5" />
                   </div>
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
                      <ChevronDown className="w-5 h-5" />
                   </div>
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
                  <button onClick={handleReset} className="text-xs text-slate-400 hover:text-red-500 underline flex items-center gap-1">
                     <Eraser className="w-3 h-3" /> Reset
                  </button>
               </div>
               
               <div className="p-6 space-y-6">
                  {/* Common Basic Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <Input label={getLabel('name')} name="senderName" value={formData.senderName || ''} onChange={handleInputChange} placeholder="e.g. Ramesh Kumar" />
                     <Input label={getLabel('fatherName')} name="fatherName" value={formData.fatherName || ''} onChange={handleInputChange} placeholder="e.g. Suresh Kumar" />
                     <Input label={getLabel('phone')} name="phone" value={formData.phone || ''} onChange={handleInputChange} placeholder="98765XXXXX" />
                     <Input label={getLabel('city')} name="city" value={formData.city || ''} onChange={handleInputChange} />
                  </div>
                  <Input label={getLabel('address')} name="senderAddress" value={formData.senderAddress || ''} onChange={handleInputChange} placeholder="Village/Mohalla, Post Office" />
                  
                  {/* Identity Docs (Shown for Certificates/Govt) */}
                  {(showCertificateFields || appType.includes('Scheme')) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-orange-50 p-4 rounded-lg border border-orange-100">
                         <Input label={getLabel('aadhar')} name="aadharNumber" value={formData.aadharNumber || ''} onChange={handleInputChange} placeholder="12 Digit UID" />
                         {appType.includes('Ration') && <Input label="Ration Card No." name="rationCardNumber" value={formData.rationCardNumber || ''} onChange={handleInputChange} />}
                      </div>
                  )}

                  {/* Bank Details */}
                  {showBankFields && (
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-4">
                        <SectionHeader icon={Landmark} title="Bank Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label={getLabel('bankName')} name="bankName" value={formData.bankName || ''} onChange={handleInputChange} />
                            <Input label={getLabel('branchName')} name="branchName" value={formData.branchName || ''} onChange={handleInputChange} />
                            <Input label={getLabel('accountNumber')} name="accountNumber" value={formData.accountNumber || ''} onChange={handleInputChange} />
                            <Input label={getLabel('cifNumber')} name="cifNumber" value={formData.cifNumber || ''} onChange={handleInputChange} />
                        </div>
                    </div>
                  )}

                  {/* Police Details */}
                  {showPoliceFields && (
                    <div className="bg-red-50 p-4 rounded-lg border border-red-100 space-y-4">
                         <SectionHeader icon={ShieldAlert} title="Incident Details" />
                         <Input label={getLabel('policeStation')} name="policeStation" value={formData.policeStation || ''} onChange={handleInputChange} />
                         <div className="grid grid-cols-2 gap-4">
                            <Input label={getLabel('incidentDate')} name="incidentDate" type="date" value={formData.incidentDate || ''} onChange={handleInputChange} />
                            <Input label={getLabel('incidentTime')} name="incidentTime" type="time" value={formData.incidentTime || ''} onChange={handleInputChange} />
                         </div>
                         <Input label="Incident Location" name="incidentLocation" value={formData.incidentLocation || ''} onChange={handleInputChange} />
                         {appType.includes('Mobile') && (
                            <Input label={getLabel('mobileDetails')} name="mobileDetails" value={formData.mobileDetails || ''} onChange={handleInputChange} placeholder="Model Name, IMEI Number" />
                         )}
                         <TextArea label="Description of Incident" name="incidentDetails" value={formData.incidentDetails || ''} onChange={handleInputChange} />
                    </div>
                  )}

                  {/* Education Details */}
                  {showSchoolFields && (
                    <div className="bg-green-50 p-4 rounded-lg border border-green-100 space-y-4">
                        <SectionHeader icon={GraduationCap} title="Education Details" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="School/College Name" name="schoolName" value={formData.schoolName || ''} onChange={handleInputChange} />
                            <Input label="Class/Course" name="className" value={formData.className || ''} onChange={handleInputChange} />
                            <Input label="Roll Number" name="rollNumber" value={formData.rollNumber || ''} onChange={handleInputChange} />
                            <Input label="Session/Year" name="courseName" value={formData.courseName || ''} onChange={handleInputChange} />
                        </div>
                    </div>
                  )}

                  {/* Electricity Details */}
                  {showElectricityFields && (
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 space-y-4">
                        <SectionHeader icon={Ticket} title="Connection Details" />
                        <Input label={getLabel('consumerNumber')} name="consumerNumber" value={formData.consumerNumber || ''} onChange={handleInputChange} />
                    </div>
                  )}
                  
                  {/* RTI Specifics */}
                  {showRTIFields && (
                     <div className="bg-slate-100 p-4 rounded-lg border border-slate-200 space-y-4">
                        <SectionHeader icon={Files} title="RTI Details" />
                        <TextArea label="Information Required (RTI Query)" name="rtiQuery" value={formData.rtiQuery || ''} onChange={handleInputChange} rows={4} />
                        <Input label="Period of Information" name="rtiPeriod" value={formData.rtiPeriod || ''} onChange={handleInputChange} placeholder="e.g. 2020-2023" />
                     </div>
                  )}

                  {/* Custom Body / Reason (if not Police/RTI which have specific textareas) */}
                  {!showPoliceFields && !showRTIFields && (
                     <TextArea 
                        label={getLabel('reason')} 
                        name="customBody" 
                        value={formData.customBody || ''} 
                        onChange={handleInputChange} 
                        placeholder="Explain your request in detail..."
                        rows={4}
                     />
                  )}
               </div>
            </div>

            {/* GENERATE BUTTON */}
            <div className="space-y-4">
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
                
                <button
                onClick={handleGenerate}
                disabled={loading || !formData.senderName}
                className="w-full bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-slate-300 transition-all flex items-center justify-center gap-3 text-lg"
                >
                {loading ? <Loader2 className="animate-spin" /> : <PenTool className="w-5 h-5" />}
                <span>{getLabel('generate')}</span>
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
                    {/* Desktop QR - Dynamically Generated for Accuracy */}
                    <div className="hidden md:flex flex-col items-center bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                       <div className="w-32 h-32 bg-white flex items-center justify-center rounded-lg overflow-hidden border border-slate-100">
                          <img 
                            src={QR_CODE_URL} 
                            alt="UPI QR Code" 
                            className="w-full h-full object-contain"
                          />
                       </div>
                       <div className="text-[10px] mt-2 font-mono text-slate-500 font-bold">{UPI_ID}</div>
                       <div className="text-[9px] text-slate-400">{PAYEE_NAME}</div>
                    </div>

                    {/* Mobile UPI Button */}
                    <div className="space-y-3 w-full md:w-auto">
                        <a 
                           href={UPI_LINK} 
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