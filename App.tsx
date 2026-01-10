"use client";

import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Printer, 
  Loader2, 
  PenTool, 
  RefreshCcw, 
  ShieldCheck, 
  Lock, 
  Languages, 
  AlertCircle, 
  Coffee,
  Landmark,
  ShieldAlert, 
  Zap,
  GraduationCap,
  Files,
  User,
  Building2,
  Settings,
  Minimize,
  Maximize,
  ChevronDown
} from 'lucide-react';
import { ApplicationType, FormData, INITIAL_FORM_DATA, Language } from './types';
import { generateLetterText } from './services/pollinations';
import { Input, TextArea } from './components/Input';

// --- HYBRID TEMPLATE SYSTEM ---

type TemplateKey = string;

interface TemplateOption {
  value: TemplateKey;
  label: string;
  template: string; // Contains placeholders like {{senderName}}
}

const TEMPLATES: Record<Language, Record<string, TemplateOption[]>> = {
  'English (Official)': {
    [ApplicationType.BANK_TRANSFER]: [
      { 
        value: 'bank_transfer', 
        label: 'Transfer Bank Account', 
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Request for Transfer of Savings Account (A/c: {{accountNumber}})

Dear Sir/Madam,

I am maintaining a savings account with your branch (Account Number: {{accountNumber}}). 

I have recently shifted my residence to {{city}} and I find it difficult to operate the account from your branch. Therefore, I kindly request you to transfer my account to the SBI branch located at {{city}}. 

I have cleared all my outstanding dues (if any) with your branch. I request you to kindly process this transfer at the earliest.

Thank you.

Yours faithfully,

{{senderName}}` 
      },
      {
        value: 'address_change',
        label: 'Change Registered Address',
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Application for Change of Residential Address in Bank Records

Dear Sir/Madam,

I am holding a savings account in your branch with Account Number {{accountNumber}}.

I would like to inform you that my residential address has changed. I request you to kindly update my new address in your records for all future correspondence.

New Address:
{{senderAddress}}
{{city}}

I have attached the necessary proof of address documents (Aadhar Card/Rent Agreement) with this application.

Thank you.

Yours faithfully,

{{senderName}}`
      },
      { 
        value: 'cheque_book', 
        label: 'Request Cheque Book', 
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Request for Issue of New Cheque Book

Dear Sir/Madam,

I hold a savings account in your branch with Account Number {{accountNumber}}. 

I would like to request a new Cheque Book (25 leaves) for my daily transactions. Please debit the applicable charges from my account.

Kindly send the cheque book to my registered address mentioned above or inform me when I can collect it from the branch.

Thank you.

Yours faithfully,

{{senderName}}`
      },
      { 
        value: 'statement', 
        label: 'Request Account Statement', 
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Request for Account Statement

Dear Sir/Madam,

I request you to kindly issue a detailed statement of my savings account (Number: {{accountNumber}}) for the period of last 6 months.

I require this statement for income tax / personal record purposes. Please deduct any necessary service charges from my account.

Thank you.

Yours faithfully,

{{senderName}}`
      }
    ],
    [ApplicationType.ATM_ISSUE]: [
      { 
        value: 'atm_lost', 
        label: 'Block Lost ATM Card', 
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Urgent Application to Block Lost ATM Card

Dear Sir/Madam,

I am writing to inform you that I have lost my ATM Debit Card linked to Account Number {{accountNumber}}.

I request you to immediately BLOCK the card to prevent any misuse. 
Reason/Details: {{customBody}}

Please confirm once the card is blocked. I also request you to issue a new ATM card at your earliest convenience.

Yours faithfully,

{{senderName}}`
      },
      { 
        value: 'new_atm', 
        label: 'Issue New ATM Card', 
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Application for Issuance of New ATM Card

Dear Sir/Madam,

I hold a savings account in your branch (A/c: {{accountNumber}}).

I would like to apply for a new ATM Debit Card for this account as my previous card is damaged/expired. I authorize the bank to deduct the annual maintenance charges from my account.

Kindly dispatch the card to my registered address.

Yours faithfully,

{{senderName}}`
      }
    ],
    [ApplicationType.ELECTRICITY_METER]: [
      {
        value: 'meter_change',
        label: 'Request Meter Change (Faulty)',
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Application for Replacement of Faulty Electricity Meter (K.No: {{consumerNumber}})

Dear Sir,

I wish to bring to your notice that the electricity meter installed at my residence (Consumer No: {{consumerNumber}}) is not working correctly. It seems to be running too fast/stopped, resulting in incorrect billing.

I request you to kindly send a technician to inspect the meter and replace it if found faulty.

Thank you.

Yours faithfully,

{{senderName}}`
      },
      {
        value: 'high_bill',
        label: 'Complaint: High Electricity Bill',
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Complaint regarding Inflated Electricity Bill (Consumer No: {{consumerNumber}})

Dear Sir,

I am writing to register a complaint regarding the electricity bill received for the last billing cycle for my connection (K.No: {{consumerNumber}}).

I have received a bill which is significantly higher than my average monthly consumption. There has been no change in my usage pattern or connected load. I suspect there might be a reading error or a meter fault.

I request you to kindly verify the meter reading and rectify the bill amount.

Thank you.

Yours faithfully,

{{senderName}}`
      }
    ],
    [ApplicationType.POLICE_COMPLAINT]: [
      {
        value: 'lost_item',
        label: 'Report Lost Item (Mobile/Wallet)',
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Report regarding loss of Mobile/Wallet/Documents

Respected Sir/Madam,

I am writing to report the loss of my personal belongings.
Incident Details: {{customBody}}

I have searched everywhere but could not find them. I request you to kindly register a complaint (NCR) regarding this loss, as it is required for applying for duplicate documents/SIM card.

I shall be grateful for your assistance.

Yours faithfully,

{{senderName}}`
      },
      {
        value: 'noise_complaint',
        label: 'Complaint: Noise Nuisance',
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Complaint regarding Loud Speaker/Noise Nuisance in Locality

Respected Sir,

I would like to bring to your attention the nuisance caused by the indiscriminate use of loud speakers / loud music in our locality ({{city}}).

This is causing great disturbance to the residents, especially students preparing for exams and elderly people. Despite repeated requests, the noise levels remain high late into the night.

I request you to take necessary action to stop this public nuisance and ensure peace in the area.

Yours faithfully,

{{senderName}}`
      }
    ],
    [ApplicationType.SCHOOL_LEAVE]: [
      {
        value: 'sick_leave',
        label: 'Sick Leave Application',
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Application for Sick Leave

Respected Sir/Madam,

Most respectfully, I beg to state that I am suffering from high fever since last night. My doctor has advised me complete rest for a few days.

Therefore, I am unable to attend school/office today. I kindly request you to grant me leave for 2 days. I will submit the medical certificate upon joining.

Thank you.

Yours obediently,

{{senderName}}`
      },
      {
        value: 'urgent_work',
        label: 'Urgent Piece of Work',
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Application for Leave due to Urgent Work

Respected Sir/Madam,

I wish to inform you that I have an urgent piece of work at home today which requires my personal attention. Hence, I will not be able to attend school/office.

I request you to kindly grant me leave for one day ({{date}}). I shall be obliged.

Thank you.

Yours obediently,

{{senderName}}`
      },
      {
        value: 'family_function',
        label: 'Leave for Family Function',
        template: `From:
{{senderName}}
{{senderAddress}}
{{city}}

Date: {{date}}

To,
{{recipientTitle}}
{{recipientAddress}}

Subject: Leave Application for attending Family Function

Respected Sir/Madam,

I am writing to request leave from attending school/work as I have to attend a family marriage ceremony/function in my hometown.

Kindly grant me leave for 3 days starting from {{date}}. I will ensure that my pending work is completed upon my return.

Thank you.

Yours obediently,

{{senderName}}`
      }
    ],
    [ApplicationType.OTHER]: []
  },
  'Hindi (Formal)': {
     // Hindi templates would follow the same structure. 
     // Using empty arrays here falls back to "Custom" automatically logic-wise.
     [ApplicationType.BANK_TRANSFER]: [],
     [ApplicationType.ATM_ISSUE]: [],
     [ApplicationType.ELECTRICITY_METER]: [],
     [ApplicationType.POLICE_COMPLAINT]: [],
     [ApplicationType.SCHOOL_LEAVE]: [],
     [ApplicationType.OTHER]: []
  }
};

// Simple Section Component (Replaces Accordion)
const FormSection: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="border border-slate-200 rounded-xl bg-white overflow-hidden shadow-sm">
    <div className="flex items-center space-x-3 p-4 bg-slate-50 border-b border-slate-100">
      <div className="text-blue-700">{icon}</div>
      <span className="font-bold text-sm uppercase tracking-wide text-slate-800">
        {title}
      </span>
    </div>
    <div className="p-5">
      {children}
    </div>
  </div>
);


const App: React.FC = () => {
  const [appType, setAppType] = useState<ApplicationType>(ApplicationType.BANK_TRANSFER);
  const [language, setLanguage] = useState<Language>('English (Official)');
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [generatedLetter, setGeneratedLetter] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // View State
  const [fitToPage, setFitToPage] = useState<boolean>(false);

  // Template State
  // Default to first template if available, else 'custom'
  const [templateKey, setTemplateKey] = useState<string>('custom');

  // Helper to get available templates
  const getAvailableTemplates = () => {
    const langTemplates = TEMPLATES[language] || TEMPLATES['English (Official)'];
    const typeTemplates = langTemplates[appType as string] || [];
    return [
      ...typeTemplates,
      { value: 'custom', label: 'Other / Custom Request (AI Generated)', template: '' }
    ];
  };

  // Reset Template Selection when App Type changes
  useEffect(() => {
    const available = getAvailableTemplates();
    // Default to the first defined template if exists, else custom
    const defaultKey = available.length > 1 ? available[0].value : 'custom';
    setTemplateKey(defaultKey);
  }, [appType, language]);

  // Auto-fill recipient title based on selection
  useEffect(() => {
    let title = '';
    let address = '';
    switch (appType) {
      case ApplicationType.BANK_TRANSFER:
      case ApplicationType.ATM_ISSUE:
        title = 'The Branch Manager';
        address = 'State Bank of India, [Branch Name]';
        break;
      case ApplicationType.POLICE_COMPLAINT:
        title = 'The Station House Officer (SHO)';
        address = 'Local Police Station, [Area Name]';
        break;
      case ApplicationType.ELECTRICITY_METER:
        title = 'The Assistant Engineer';
        address = 'Electricity Department, [Division]';
        break;
      case ApplicationType.SCHOOL_LEAVE:
        title = 'The Principal';
        address = '[School Name], [City]';
        break;
      default:
        title = '';
    }
    setFormData(prev => ({ ...prev, recipientTitle: title, recipientAddress: address }));
  }, [appType]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const processTemplate = (templateStr: string): string => {
    let text = templateStr;
    const replacements: Record<string, string> = {
      '{{senderName}}': formData.senderName || '__________',
      '{{senderAddress}}': formData.senderAddress || '__________',
      '{{city}}': formData.city || '__________',
      '{{date}}': formData.date,
      '{{recipientTitle}}': formData.recipientTitle || '__________',
      '{{recipientAddress}}': formData.recipientAddress || '__________',
      '{{accountNumber}}': formData.accountNumber || '__________',
      '{{cifNumber}}': formData.cifNumber || '',
      '{{consumerNumber}}': formData.consumerNumber || '__________',
      '{{customBody}}': formData.customBody || formData.incidentDetails || '__________',
    };

    for (const [key, value] of Object.entries(replacements)) {
      // replaceAll is ES2021+. Using split/join for better compatibility.
      text = text.split(key).join(value);
    }
    return text;
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      if (templateKey !== 'custom') {
        // --- INSTANT GENERATION (Hybrid) ---
        // 1. Find the template string
        const templates = getAvailableTemplates();
        const selected = templates.find(t => t.value === templateKey);
        
        if (selected && selected.template) {
           // 2. Process replacements locally
           const processedText = processTemplate(selected.template);
           setGeneratedLetter(processedText);
           // Simulate a tiny delay for UX so it feels like "work" is being done
           await new Promise(r => setTimeout(r, 400));
        } else {
           // Fallback to AI if template text missing
           const text = await generateLetterText(appType, formData, language);
           setGeneratedLetter(text);
        }

      } else {
        // --- SLOW GENERATION (AI) ---
        const text = await generateLetterText(appType, formData, language);
        setGeneratedLetter(text);
      }
    } catch (err) {
      setError('Failed to generate letter. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    if (!generatedLetter) return;
    window.print();
  };

  const handleCopy = () => {
    if (!generatedLetter) return;
    navigator.clipboard.writeText(generatedLetter);
  };

  const getIcon = () => {
    switch(appType) {
        case ApplicationType.BANK_TRANSFER:
        case ApplicationType.ATM_ISSUE: return <Landmark className="w-6 h-6" />;
        case ApplicationType.POLICE_COMPLAINT: return <ShieldAlert className="w-6 h-6" />;
        case ApplicationType.ELECTRICITY_METER: return <Zap className="w-6 h-6" />;
        case ApplicationType.SCHOOL_LEAVE: return <GraduationCap className="w-6 h-6" />;
        default: return <FileText className="w-6 h-6" />;
    }
  }

  // Validation Logic
  // If custom or police, check body/incident text. If template, check basic fields.
  const isReasonProvided = (templateKey === 'custom' || appType === ApplicationType.POLICE_COMPLAINT || templateKey === 'lost_item' || templateKey === 'atm_lost')
    ? (formData.incidentDetails.trim().length > 0 || formData.customBody.trim().length > 0)
    : true; // Templates don't require custom body unless specified
  
  const isBankApp = appType === ApplicationType.BANK_TRANSFER || appType === ApplicationType.ATM_ISSUE;
  const accNumInput = formData.accountNumber.trim();
  const isAccountNumberValid = !isBankApp || accNumInput.length === 0 || (/^\d+$/.test(accNumInput) && accNumInput.length >= 11 && accNumInput.length <= 16);

  const isFormValid = 
    formData.senderName.trim().length > 0 &&
    formData.recipientTitle.trim().length > 0 &&
    isReasonProvided &&
    isAccountNumberValid;

  return (
    <div className="min-h-screen flex flex-col font-sans bg-slate-50 text-slate-800">
      
      {/* PRINT STYLES */}
      <style>{`
        @media print {
          @page { margin: 0 !important; size: auto; }
          body { background: white; margin: 0; }
          .no-print { display: none !important; }
          #printable-letter {
            display: block !important;
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 2.54cm; /* Standard A4 Margin (1 inch) */
            font-family: 'Times New Roman', serif;
            font-size: 12pt;
            line-height: 1.5;
            color: black;
            background: white;
            white-space: pre-wrap;
            border: none;
            box-shadow: none;
            z-index: 9999;
          }
        }
      `}</style>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-4 group cursor-default">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-100 group-hover:shadow-blue-200 group-hover:-translate-y-0.5 transition-all duration-300">
                <PenTool className="w-6 h-6 text-white" strokeWidth={2.5} />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 leading-none mb-1.5 group-hover:text-blue-900 transition-colors">
                ArziWala
              </h1>
              <p className="text-[10px] sm:text-xs font-bold text-blue-600 uppercase tracking-[0.15em] leading-none">
                Formal Application Generator
              </p>
            </div>
          </div>
          
          {/* Privacy Shield with Tooltip */}
          <div className="relative group cursor-help">
            <div className="flex items-center space-x-1.5 bg-green-50 px-3 py-1.5 rounded-full border border-green-200 text-green-800 hover:bg-green-100 transition-colors">
              <ShieldCheck className="w-4 h-4" />
              <span className="text-xs font-semibold hidden sm:inline">Privacy Shield Active</span>
            </div>
            
            {/* The Explanation Tooltip */}
            <div className="absolute top-full right-0 mt-3 w-72 p-4 bg-white rounded-xl shadow-xl border border-slate-100 text-xs text-slate-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 transform origin-top-right">
                <div className="absolute -top-2 right-6 w-4 h-4 bg-white border-t border-l border-slate-100 transform rotate-45"></div>
                <div className="relative z-10">
                    <div className="flex items-center space-x-2 mb-2 text-green-700 font-bold">
                        <ShieldCheck className="w-4 h-4" />
                        <span>How we protect your data</span>
                    </div>
                    <p className="leading-relaxed mb-2">
                        Your sensitive information (like Account Numbers & IDs) is <strong>never sent to the AI</strong>.
                    </p>
                    <p className="leading-relaxed bg-slate-50 p-2 rounded border border-slate-100">
                        We use generic placeholders during generation and restore your private details locally on your device.
                    </p>
                </div>
            </div>
          </div>

        </div>
      </header>

      <main className="flex-grow py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          
          {/* LEFT: FORM SECTION */}
          <div className="space-y-6 no-print pb-20 lg:pb-0">
            
            {/* 1. Application Type & Language */}
            <FormSection 
                title="Application Type" 
                icon={<Settings className="w-5 h-5" />}
            >
                <div className="space-y-4">
                    <div className="flex justify-end mb-2">
                        <div className="flex items-center space-x-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
                            <Languages className="w-4 h-4 text-slate-400" />
                            <select 
                                value={language}
                                onChange={(e) => setLanguage(e.target.value as Language)}
                                className="text-xs font-medium text-slate-700 bg-transparent focus:outline-none cursor-pointer"
                            >
                                <option>English (Official)</option>
                                <option>Hindi (Formal)</option>
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Select Category / श्रेणी चुनें
                        </label>
                        <div className="relative">
                            <select
                                value={appType}
                                onChange={(e) => setAppType(e.target.value as ApplicationType)}
                                className="w-full appearance-none border border-slate-300 rounded-lg px-4 py-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-medium text-slate-800 pr-10 shadow-sm"
                            >
                                {Object.values(ApplicationType).map((type) => (
                                <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
                                {getIcon()}
                            </div>
                        </div>
                    </div>
                </div>
            </FormSection>

            {/* 2. Sender Details */}
            <FormSection 
                title="Your Details (Sender)" 
                icon={<User className="w-5 h-5" />}
            >
                <div className="space-y-4">
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input 
                        label="Your Name / आपका नाम *" 
                        name="senderName" 
                        value={formData.senderName} 
                        onChange={handleInputChange} 
                        required
                        />
                        <Input 
                        label="City / शहर *" 
                        name="city" 
                        value={formData.city} 
                        onChange={handleInputChange} 
                        required
                        />
                    </div>
                    <Input 
                        label="Your Address / पूरा पता *" 
                        name="senderAddress" 
                        value={formData.senderAddress} 
                        onChange={handleInputChange} 
                        placeholder="House No, Street, Locality"
                    />
                </div>
            </FormSection>

            {/* 3. Recipient Details */}
            <FormSection 
                title="Recipient Details" 
                icon={<Building2 className="w-5 h-5" />}
            >
                 <div className="grid grid-cols-1 gap-4">
                    <Input 
                    label="Recipient Title / पद (e.g. Manager) *" 
                    name="recipientTitle" 
                    value={formData.recipientTitle} 
                    onChange={handleInputChange} 
                    required
                    />
                    <Input 
                    label="Recipient Address / कार्यालय का पता" 
                    name="recipientAddress" 
                    value={formData.recipientAddress} 
                    onChange={handleInputChange} 
                    />
                </div>
            </FormSection>

            {/* 4. Application Specifics */}
            <FormSection 
                title="Application Details" 
                icon={<FileText className="w-5 h-5" />}
            >
                <div className="space-y-5">
                    
                    {/* Scenario / Template Selector */}
                    <div className="space-y-2">
                         <label className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center space-x-1">
                             <span>Letter Purpose</span>
                             <span className="bg-blue-100 text-blue-700 text-[9px] px-1.5 py-0.5 rounded-full tracking-normal capitalize">Faster</span>
                         </label>
                         <div className="relative">
                            <select
                                value={templateKey}
                                onChange={(e) => setTemplateKey(e.target.value)}
                                className="w-full appearance-none border border-blue-200 rounded-lg px-4 py-3 bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-slate-800 pr-10 shadow-sm cursor-pointer hover:bg-blue-50/60 transition-colors"
                            >
                                {getAvailableTemplates().map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                            <div className="absolute right-3 top-3 text-slate-400 pointer-events-none">
                                <ChevronDown className="w-5 h-5" />
                            </div>
                         </div>
                    </div>

                    {/* Secure Bank Fields */}
                    {(appType === ApplicationType.BANK_TRANSFER || appType === ApplicationType.ATM_ISSUE) && (
                        <div className="bg-blue-50/50 rounded-lg border border-blue-100 p-4 space-y-4">
                            <div className="flex items-center space-x-2 text-blue-800 mb-2">
                                <Lock className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">Secure Banking Data</span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Input 
                                        label="Account No / खाता संख्या" 
                                        name="accountNumber" 
                                        value={formData.accountNumber} 
                                        onChange={handleInputChange} 
                                        placeholder="11-16 Digits"
                                        className={!isAccountNumberValid ? "border-red-500 focus:ring-red-200" : ""}
                                    />
                                    {!isAccountNumberValid && (
                                        <p className="text-[10px] text-red-600 mt-1 font-medium">Valid digits only (11-16)</p>
                                    )}
                                </div>
                                <Input 
                                    label="CIF / Branch Code" 
                                    name="cifNumber" 
                                    value={formData.cifNumber} 
                                    onChange={handleInputChange} 
                                />
                            </div>
                        </div>
                    )}

                    {/* Electricity Fields */}
                    {appType === ApplicationType.ELECTRICITY_METER && (
                        <div className="bg-yellow-50/50 rounded-lg border border-yellow-100 p-4">
                             <div className="flex items-center space-x-2 text-yellow-800 mb-4">
                                <Zap className="w-4 h-4" />
                                <span className="text-xs font-bold uppercase">Connection Data</span>
                            </div>
                            <Input 
                                label="Consumer No (K No) / उपभोक्ता संख्या" 
                                name="consumerNumber" 
                                value={formData.consumerNumber} 
                                onChange={handleInputChange} 
                            />
                        </div>
                    )}

                    {/* Incident / Reason / Custom Body */}
                    {appType === ApplicationType.POLICE_COMPLAINT && templateKey !== 'lost_item' && (
                         <div className="bg-red-50/50 rounded-lg border border-red-100 p-4">
                            <TextArea 
                                label="Incident Details / घटना का विवरण *" 
                                name="incidentDetails" 
                                value={formData.incidentDetails} 
                                onChange={handleInputChange} 
                                placeholder="Where? When? What happened?"
                                rows={4}
                                required
                            />
                         </div>
                    )}

                    {/* CUSTOM REASON: Only show if template is 'custom' OR if specific template requires it (like ATM Lost with details) */}
                    {(templateKey === 'custom' || templateKey === 'atm_lost' || templateKey === 'lost_item') && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                             <TextArea 
                                label={templateKey === 'atm_lost' || templateKey === 'lost_item' ? "Item/Loss Details (What/Where/When)" : "Reason / Custom Request *"}
                                name="customBody" 
                                value={formData.customBody} 
                                onChange={handleInputChange} 
                                placeholder={templateKey === 'atm_lost' ? "e.g. Lost in Market on Sunday..." : "Briefly explain why you need this..."}
                                rows={4}
                                required
                            />
                        </div>
                    )}

                </div>
            </FormSection>

            {/* Validation Errors & Submit */}
            <div className="space-y-4 pt-2">
                 {/* Validation Errors */}
                {!isFormValid && (
                    <div className="bg-amber-50 text-amber-800 text-xs p-3 rounded-lg border border-amber-100 flex items-start space-x-2 animate-pulse">
                        <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="font-bold mb-1">Please complete the form:</p>
                            <ul className="list-disc list-inside space-y-0.5 opacity-80">
                                {formData.senderName.trim().length === 0 && <li>Enter your name</li>}
                                {formData.recipientTitle.trim().length === 0 && <li>Check recipient details</li>}
                                {!isReasonProvided && <li>Provide a reason or incident details</li>}
                                {!isAccountNumberValid && <li>Check account number digits</li>}
                            </ul>
                        </div>
                    </div>
                )}

                {/* Submit Button */}
                <button
                    onClick={handleGenerate}
                    disabled={loading || !isFormValid}
                    className="w-full bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500 text-white font-bold py-4 px-4 rounded-xl shadow-lg shadow-slate-200 transition-all flex items-center justify-center space-x-3 text-sm tracking-wide uppercase group"
                >
                    {loading ? (
                    <>
                        <Loader2 className="animate-spin w-5 h-5" />
                        <span>Drafting Letter...</span>
                    </>
                    ) : (
                    <>
                        <PenTool className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                        <span>{templateKey !== 'custom' ? 'Generate Instantly' : 'Generate with AI'}</span>
                    </>
                    )}
                </button>

                 {/* Support Button */}
                 <div className="pt-2 text-center">
                         <a 
                            href="https://buymeacoffee.com" 
                            target="_blank" 
                            rel="noreferrer"
                            className="inline-flex items-center space-x-2 text-slate-400 hover:text-amber-600 transition-colors text-xs font-medium"
                         >
                            <Coffee className="w-4 h-4" />
                            <span>Buy me a Chai</span>
                         </a>
                    </div>
            </div>

          </div>

          {/* RIGHT: PREVIEW SECTION (Sticky + A4 Realistic Look) */}
          <div className="flex flex-col space-y-4 lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-8rem)]">
             {/* Preview Toolbar */}
             <div className="flex items-center justify-between no-print shrink-0">
                <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500">Letter Preview</h2>
                <div className="flex items-center space-x-2">
                   {/* Fit to Page Toggle */}
                   {generatedLetter && (
                      <button
                        onClick={() => setFitToPage(!fitToPage)}
                        className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          fitToPage 
                            ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200' 
                            : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                        }`}
                        title={fitToPage ? "Restore standard view" : "Shrink to fit"}
                      >
                         {fitToPage ? <Maximize className="w-3.5 h-3.5" /> : <Minimize className="w-3.5 h-3.5" />}
                         <span>{fitToPage ? "Expand" : "Fit"}</span>
                      </button>
                   )}

                   {generatedLetter && (
                      <button 
                        onClick={() => setGeneratedLetter('')}
                        className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-100 rounded-full transition-colors"
                        title="Clear"
                      >
                        <RefreshCcw className="w-4 h-4" />
                      </button>
                   )}
                </div>
             </div>

             {/* The A4 Sheet Area */}
             <div className="flex-grow bg-slate-200/50 rounded-xl p-4 md:p-8 flex justify-center items-start overflow-y-auto border border-slate-200 shadow-inner no-print custom-scrollbar">
                {generatedLetter ? (
                     <div 
                        className={`w-full max-w-[21cm] bg-white shadow-2xl min-h-[29.7cm] text-slate-900 font-serif whitespace-pre-wrap transition-all duration-300 ease-in-out
                            ${fitToPage 
                                ? 'p-[1.5cm] text-[10pt] leading-snug' 
                                : 'p-[2.54cm] text-[11pt] md:text-[12pt] leading-relaxed'
                            }`}
                     >
                        {generatedLetter}
                     </div>
                ) : (
                    // Improved Empty State: Looks like a blank paper
                    <div className="w-full max-w-[21cm] bg-white shadow-md min-h-[29.7cm] p-[2.54cm] flex flex-col items-center justify-center text-slate-300 space-y-6 opacity-70">
                         <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                            <FileText className="w-10 h-10 text-slate-300" />
                         </div>
                         <div className="text-center space-y-2">
                             <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Preview Area</p>
                             <p className="text-xs text-slate-400 max-w-[200px]">Fill the form on the left to generate your professional document here.</p>
                         </div>
                    </div>
                )}
             </div>

             {/* Actions Toolbar */}
             {generatedLetter && (
                <div className="grid grid-cols-2 gap-3 no-print shrink-0">
                    <button
                        onClick={handleCopy}
                        className="bg-white hover:bg-slate-50 text-slate-700 font-bold py-3 px-4 rounded-xl shadow-sm border border-slate-200 transition-all flex items-center justify-center space-x-2"
                    >
                        <Files className="w-4 h-4" />
                        <span>Copy Text</span>
                    </button>
                    <button
                        onClick={handlePrint}
                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-4 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center justify-center space-x-2"
                    >
                        <Printer className="w-4 h-4" />
                        <span>Download PDF</span>
                    </button>
                </div>
             )}
             
             {/* Hidden Div for Actual Printing */}
             <div id="printable-letter" className="hidden">
                 {generatedLetter}
             </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;