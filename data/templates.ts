import { ApplicationType, FormData } from '../types';

export interface TemplateConfig {
  id: string;
  categoryId: ApplicationType;
  labelEn: string;
  labelHi: string;
  type: 'instant' | 'ai';
  requiredFields: (keyof FormData)[];
  templateEn?: string;
  templateHi?: string;
  aiPrompt?: string;
}

export const CATEGORIES = [
  { id: 'banking', labelEn: 'Banking', labelHi: 'बैंकिंग', icon: '🏦', color: 'bg-blue-600' },
  { id: 'police', labelEn: 'Police', labelHi: 'पुलिस', icon: '👮', color: 'bg-green-700' },
  { id: 'government', labelEn: 'Government', labelHi: 'सरकारी', icon: '🏛️', color: 'bg-orange-700' },
  { id: 'education', labelEn: 'Education', labelHi: 'शिक्षा', icon: '🎓', color: 'bg-indigo-600' },
  { id: 'employment', labelEn: 'Employment', labelHi: 'रोजगार', icon: '💼', color: 'bg-teal-700' },
  { id: 'other', labelEn: 'General', labelHi: 'सामान्य', icon: '📄', color: 'bg-slate-600' },
] as const;

export const TEMPLATES: TemplateConfig[] = [
  // --- BANKING ---
  {
    id: 'bank_atm_lost',
    categoryId: 'banking',
    labelEn: 'ATM Card Lost',
    labelHi: 'ATM कार्ड खो गया',
    type: 'instant',
    requiredFields: ['senderName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'accountNumber', 'bankName', 'branchName', 'atmCardLastDigits', 'date', 'phone'],
    templateEn: `From:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

To,
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
Mobile: {{phone}}`,
    templateHi: `प्रेषक:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

सेवा में,
शाखा प्रबंधक महोदय,
{{bankName}},
{{branchName}}

दिनांक: {{date}}

विषय: खोए हुए ATM/डेबिट कार्ड को ब्लॉक करने हेतु प्रार्थना पत्र

महोदय/महोदया,

सविनय निवेदन है कि मैं {{senderName}}, आपकी शाखा में बचत खाताधारक हूँ। मेरा खाता संख्या {{accountNumber}} है।

मैं आपको सूचित करना चाहता/चाहती हूँ कि मेरा ATM/डेबिट कार्ड जिसके अंतिम चार अंक {{atmCardLastDigits}} हैं, खो गया है।

अतः आपसे विनम्र अनुरोध है कि किसी भी अनधिकृत लेनदेन को रोकने के लिए उक्त कार्ड को तुरंत ब्लॉक कर दें। साथ ही मुझे जल्द से जल्द नया ATM/डेबिट कार्ड जारी करने की कृपा करें।

धन्यवाद,

भवदीय,
{{senderName}}
मोबाइल: {{phone}}`
  },
  {
    id: 'bank_cheque_book',
    categoryId: 'banking',
    labelEn: 'Cheque Book Request',
    labelHi: 'चेकबुक अनुरोध',
    type: 'instant',
    requiredFields: ['senderName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'accountNumber', 'bankName', 'branchName', 'chequeLeaves', 'phone', 'date'],
    templateEn: `From:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

To,
The Branch Manager,
{{bankName}},
{{branchName}}

Date: {{date}}

Subject: Request for Issue of New Cheque Book

Respected Sir/Madam,

I hold a savings account in your branch with Account Number {{accountNumber}}.

I request you to kindly issue a new Cheque Book ({{chequeLeaves}} Leaves) for my account. I authorize you to debit the applicable charges from my account.

Kindly dispatch it to my registered address.

Thank you.

Yours faithfully,

{{senderName}}
Mobile: {{phone}}`,
    templateHi: `प्रेषक:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

सेवा में,
शाखा प्रबंधक महोदय,
{{bankName}},
{{branchName}}

दिनांक: {{date}}

विषय: नई चेकबुक हेतु प्रार्थना पत्र

महोदय,

मैं {{senderName}}, आपकी शाखा में खाता संख्या {{accountNumber}} के साथ बचत खाताधारक हूँ।

मेरी वर्तमान चेकबुक समाप्त हो गई है। अतः आपसे अनुरोध है कि मुझे {{chequeLeaves}} पन्नों वाली नई चेकबुक जारी करने की कृपा करें।

धन्यवाद,

भवदीय,
{{senderName}}
मोबाइल: {{phone}}`
  },
  {
    id: 'bank_close_account',
    categoryId: 'banking',
    labelEn: 'Account Closure',
    labelHi: 'खाता बंद करना',
    type: 'instant',
    requiredFields: ['senderName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'accountNumber', 'bankName', 'branchName', 'customBody', 'date', 'phone'],
    templateEn: `From:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

To,
The Branch Manager,
{{bankName}},
{{branchName}}

Date: {{date}}

Subject: Request for Closure of Savings Account

Respected Sir/Madam,

I, {{senderName}}, am an account holder at your branch with account number {{accountNumber}}.

I wish to close my above-mentioned account due to the following reason: {{customBody}}.

I have enclosed my unused cheque leaves and passbook. Kindly process my request and hand over the remaining balance in cash/DD.

Thanking you.

Yours faithfully,

{{senderName}}
Mobile: {{phone}}`,
    templateHi: `प्रेषक:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

सेवा में,
शाखा प्रबंधक महोदय,
{{bankName}},
{{branchName}}

दिनांक: {{date}}

विषय: बचत खाता बंद करने हेतु प्रार्थना पत्र

महोदय,

सविनय निवेदन है कि मैं {{senderName}}, आपकी शाखा में खाता संख्या {{accountNumber}} के साथ खाताधारक हूँ।

मैं निम्नलिखित कारण से अपना खाता बंद करना चाहता हूँ: {{customBody}}।

मैंने अपनी पासबुक और चेकबुक संलग्न कर दी है। कृपया मेरा हिसाब चुकता करने की कृपा करें।

धन्यवाद,

भवदीय,
{{senderName}}
मोबाइल: {{phone}}`
  },
  {
      id: 'bank_custom',
      categoryId: 'banking',
      labelEn: 'Other Banking Issue (AI)',
      labelHi: 'अन्य बैंक समस्या (AI)',
      type: 'ai',
      requiredFields: ['senderName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'accountNumber', 'bankName', 'branchName', 'customBody']
  },

  // --- POLICE ---
  {
    id: 'police_mobile_theft',
    categoryId: 'police',
    labelEn: 'Mobile Theft FIR',
    labelHi: 'मोबाइल चोरी FIR',
    type: 'instant',
    requiredFields: ['senderName', 'fatherName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'policeStation', 'mobileModel', 'imeiNumber', 'simNumber', 'incidentDate', 'incidentTime', 'incidentLocation', 'incidentDetails'],
    templateEn: `From:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

To,
The Station House Officer (SHO),
{{policeStation}}

Date: {{date}}

Subject: FIR regarding Theft of Mobile Phone

Respected Sir,

I, {{senderName}} S/o {{fatherName}}, resident of {{senderStreet}}, {{senderCity}}, wish to report the theft of my mobile phone.

Incident Details:
- Date & Time: {{incidentDate}} at {{incidentTime}}
- Location: {{incidentLocation}}

Mobile Details:
- Model: {{mobileModel}}
- IMEI: {{imeiNumber}}
- SIM Number: {{simNumber}}

The phone was stolen while I was at the above location. {{incidentDetails}}

I request you to kindly register an FIR and help trace my mobile phone.

Thanking you.

Yours faithfully,

{{senderName}}
Contact: {{phone}}`,
    templateHi: `प्रेषक:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

सेवा में,
thaanaadhyaksh Mahoday,
{{policeStation}}

दिनांक: {{date}}

विषय: मोबाइल फोन चोरी के संबंध में प्राथमिकी (FIR)

महोदय,

मैं {{senderName}}, पुत्र/पुत्री {{fatherName}}, निवासी {{senderStreet}}, {{senderCity}}, अपने मोबाइल फोन की चोरी की रिपोर्ट करना चाहता हूँ।

घटना का विवरण:
- दिनांक और समय: {{incidentDate}}, {{incidentTime}}
- स्थान: {{incidentLocation}}

मोबाइल का विवरण:
- मॉडल: {{mobileModel}}
- IMEI: {{imeiNumber}}
- सिम नंबर: {{simNumber}}

मेरा फोन उपरोक्त स्थान से चोरी हो गया था। {{incidentDetails}}

अतः आपसे निवेदन है कि अज्ञात व्यक्ति के खिलाफ FIR दर्ज करें और मेरा फोन खोजने में मदद करें।

धन्यवाद,

भवदीय,
{{senderName}}
संपर्क: {{phone}}`
  },
  {
    id: 'police_vehicle_theft',
    categoryId: 'police',
    labelEn: 'Vehicle Theft FIR',
    labelHi: 'वाहन चोरी FIR',
    type: 'instant',
    requiredFields: ['senderName', 'fatherName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'policeStation', 'vehicleType', 'vehicleBrand', 'registrationNumber', 'chassisNumber', 'engineNumber', 'incidentDate', 'incidentLocation'],
    templateEn: `From:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

To,
The Station House Officer (SHO),
{{policeStation}}

Date: {{date}}

Subject: FIR for Theft of Vehicle ({{vehicleType}})

Respected Sir,

I, {{senderName}} S/o {{fatherName}}, resident of {{senderStreet}}, {{senderCity}}, beg to report the theft of my vehicle.

Incident Details:
- Date: {{incidentDate}}
- Location: {{incidentLocation}}

Vehicle Details:
- Type: {{vehicleType}}
- Make/Model: {{vehicleBrand}}
- Reg No: {{registrationNumber}}
- Chassis No: {{chassisNumber}}
- Engine No: {{engineNumber}}

I parked my vehicle at {{incidentLocation}} and when I returned, it was missing. I request you to register an FIR and take necessary action to recover my vehicle.

Yours faithfully,

{{senderName}}
Mobile: {{phone}}`,
    templateHi: `प्रेषक:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

सेवा में,
thaanaadhyaksh Mahoday,
{{policeStation}}

दिनांक: {{date}}

विषय: वाहन ({{vehicleType}}) चोरी की FIR हेतु

महोदय,

मैं {{senderName}}, पुत्र {{fatherName}}, निवासी {{senderStreet}}, {{senderCity}}, अपने वाहन की चोरी की रिपोर्ट दर्ज कराना चाहता हूँ।

घटना का विवरण:
- दिनांक: {{incidentDate}}
- स्थान: {{incidentLocation}}

वाहन का विवरण:
- प्रकार: {{vehicleType}}
- मॉडल: {{vehicleBrand}}
- गाड़ी नंबर: {{registrationNumber}}
- चेसिस नंबर: {{chassisNumber}}
- इंजन नंबर: {{engineNumber}}

मैंने अपना वाहन {{incidentLocation}} पर खड़ा किया था और वापस आने पर वह वहां नहीं था। कृपया FIR दर्ज करें और मेरा वाहन खोजने का कष्ट करें।

भवदीय,
{{senderName}}
मोबाइल: {{phone}}`
  },
  {
    id: 'police_lost_docs',
    categoryId: 'police',
    labelEn: 'Lost Documents Report',
    labelHi: 'दस्तावेज खोने की रिपोर्ट',
    type: 'instant',
    requiredFields: ['senderName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'policeStation', 'customBody', 'incidentDate', 'incidentLocation'],
    templateEn: `From:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

To,
The SHO,
{{policeStation}}

Date: {{date}}

Subject: Information regarding Lost Documents

Sir,

I, {{senderName}}, resident of {{senderStreet}}, {{senderCity}}, wish to report that I have lost my original documents on {{incidentDate}} near {{incidentLocation}}.

Details of lost documents:
{{customBody}}

I need a police report/NCR copy to apply for duplicate documents. Kindly issue the same.

Yours faithfully,

{{senderName}}`,
    templateHi: `प्रेषक:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

सेवा में,
thaanaadhyaksh Mahoday,
{{policeStation}}

दिनांक: {{date}}

विषय: दस्तावेज खोने की सूचना

महोदय,

मैं, {{senderName}}, निवासी {{senderStreet}}, {{senderCity}}, सूचित करना चाहता हूँ कि मेरे मूल दस्तावेज दिनांक {{incidentDate}} को {{incidentLocation}} के पास खो गए हैं।

खोए हुए दस्तावेजों का विवरण:
{{customBody}}

मुझे डुप्लीकेट दस्तावेजों के लिए आवेदन करने हेतु पुलिस रिपोर्ट/NCR की आवश्यकता है। कृपया जारी करने की कृपा करें।

भवदीय,
{{senderName}}`
  },

  // --- GOVERNMENT ---
  {
    id: 'govt_rti',
    categoryId: 'government',
    labelEn: 'RTI Application',
    labelHi: 'RTI आवेदन',
    type: 'instant',
    requiredFields: ['senderName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'department', 'recipientCity', 'customBody'],
    templateEn: `From:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

To,
The Public Information Officer (PIO),
{{department}},
{{recipientCity}}

Date: {{date}}

Subject: Application under Right to Information Act, 2005

Sir/Madam,

I, {{senderName}}, resident of {{senderStreet}}, {{senderCity}}, wish to seek the following information under the RTI Act, 2005:

1. {{customBody}}

I am attaching the application fee of Rs. 10/- via Postal Order/Court Fee Stamp.

Kindly provide the information within 30 days as per the Act.

Yours faithfully,

{{senderName}}
Mobile: {{phone}}`,
    templateHi: `प्रेषक:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

सेवा में,
जन सूचना अधिकारी (PIO),
{{department}},
{{recipientCity}}

दिनांक: {{date}}

विषय: सूचना का अधिकार अधिनियम, 2005 के अंतर्गत आवेदन

महोदय,

मैं, {{senderName}}, निवासी {{senderStreet}}, {{senderCity}}, RTI अधिनियम 2005 के तहत निम्नलिखित जानकारी चाहता हूँ:

1. {{customBody}}

मैं 10 रुपये का आवेदन शुल्क पोस्टल ऑर्डर/कोर्ट फीस स्टैम्प के माध्यम से संलग्न कर रहा हूँ।

कृपया अधिनियम के अनुसार 30 दिनों के भीतर जानकारी प्रदान करें।

भवदीय,

{{senderName}}
मोबाइल: {{phone}}`
  },
  {
    id: 'govt_income_cert',
    categoryId: 'government',
    labelEn: 'Income Certificate Request',
    labelHi: 'आय प्रमाण पत्र आवेदन',
    type: 'instant',
    requiredFields: ['senderName', 'fatherName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'tehsil', 'district', 'annualIncome', 'purpose'],
    templateEn: `From:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

To,
The Tehsildar,
{{tehsil}},
District {{district}}

Date: {{date}}

Subject: Application for Income Certificate

Sir,

I, {{senderName}} S/o {{fatherName}}, am a permanent resident of {{tehsil}}, District {{district}}.

My family's total annual income from all sources is Rs. {{annualIncome}}.
I need the Income Certificate for the purpose of {{purpose}}.

I have attached my Ration Card and Aadhar Card copies. Kindly issue the certificate at the earliest.

Yours faithfully,

{{senderName}}`,
    templateHi: `प्रेषक:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

सेवा में,
तहसीलदार महोदय,
{{tehsil}},
जिला {{district}}

दिनांक: {{date}}

विषय: आय प्रमाण पत्र हेतु आवेदन

महोदय,

मैं, {{senderName}} पुत्र {{fatherName}}, {{tehsil}}, जिला {{district}} का स्थायी निवासी हूँ।

मेरे परिवार की सभी स्रोतों से कुल वार्षिक आय {{annualIncome}} रुपये है।
मुझे {{purpose}} के लिए आय प्रमाण पत्र की आवश्यकता है।

मैंने राशन कार्ड और आधार कार्ड की प्रतियां संलग्न की हैं। कृपया जल्द से जल्द प्रमाण पत्र जारी करें।

भवदीय,
{{senderName}}`
  },

  // --- EDUCATION ---
  {
    id: 'edu_leave_student',
    categoryId: 'education',
    labelEn: 'Leave Application (Student)',
    labelHi: 'छुट्टी का आवेदन (छात्र)',
    type: 'instant',
    requiredFields: ['senderName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'className', 'section', 'rollNumber', 'schoolName', 'principalName', 'leaveReason', 'leaveFromDate', 'leaveToDate'],
    templateEn: `From:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

To,
The Principal,
{{schoolName}}

Date: {{date}}

Subject: Leave Application

Respected Sir/Madam,

I am {{senderName}}, a student of Class {{className}}-{{section}} (Roll No: {{rollNumber}}).

I will be unable to attend school from {{leaveFromDate}} to {{leaveToDate}} due to {{leaveReason}}.

Kindly grant me leave for the mentioned period. I assure you that I will complete my pending work.

Thanking you.

Yours obediently,

{{senderName}}
Class: {{className}}-{{section}}`,
    templateHi: `प्रेषक:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

सेवा में,
प्रधानाचार्य महोदय,
{{schoolName}}

दिनांक: {{date}}

विषय: अवकाश हेतु प्रार्थना पत्र

महोदय/महोदया,

सविनय निवेदन है कि मैं {{senderName}}, कक्षा {{className}}-{{section}} (अनुक्रमांक: {{rollNumber}}) का छात्र हूँ।

मैं {{leaveReason}} के कारण {{leaveFromDate}} से {{leaveToDate}} तक विद्यालय आने में असमर्थ हूँ।

अतः आपसे विनम्र निवेदन है कि मुझे अवकाश प्रदान करने की कृपा करें।

धन्यवाद।

आपका आज्ञाकारी शिष्य,
{{senderName}}
कक्षा: {{className}}-{{section}}`
  },
  {
    id: 'edu_tc',
    categoryId: 'education',
    labelEn: 'Transfer Certificate (TC)',
    labelHi: 'स्थानांतरण प्रमाण पत्र (TC)',
    type: 'instant',
    requiredFields: ['senderName', 'fatherName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'className', 'schoolName', 'principalName', 'customBody'],
    templateEn: `From:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

To,
The Principal,
{{schoolName}}

Date: {{date}}

Subject: Application for Transfer Certificate

Respected Sir/Madam,

I, {{senderName}}, student of Class {{className}}, request you to issue my Transfer Certificate.

My father has been transferred to another city ({{customBody}}), and my family is relocating. Therefore, I cannot continue my studies here.

I have cleared all my dues. Kindly issue the TC at the earliest so I can take admission in my new school.

Thanking you.

Yours obediently,

{{senderName}}
S/o {{fatherName}}`,
    templateHi: `प्रेषक:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

सेवा में,
प्रधानाचार्य महोदय,
{{schoolName}}

दिनांक: {{date}}

विषय: स्थानांतरण प्रमाण पत्र (TC) हेतु आवेदन

महोदय,

मैं, {{senderName}}, कक्षा {{className}} का छात्र, आपसे अनुरोध करता हूँ कि मेरा स्थानांतरण प्रमाण पत्र जारी करें।

मेरे पिता का स्थानांतरण दूसरे शहर ({{customBody}}) में हो गया है, इसलिए मैं यहां अपनी पढ़ाई जारी नहीं रख सकता।

मैंने अपने सभी बकाया का भुगतान कर दिया है। कृपया जल्द से जल्द टीसी जारी करें।

धन्यवाद।

आपका आज्ञाकारी शिष्य,
{{senderName}}
पुत्र {{fatherName}}`
  },

  // --- EMPLOYMENT ---
  {
    id: 'emp_resignation',
    categoryId: 'employment',
    labelEn: 'Resignation Letter',
    labelHi: 'इस्तीफा पत्र',
    type: 'instant',
    requiredFields: ['senderName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'designation', 'employeeId', 'managerName', 'companyName', 'lastWorkingDate', 'resignationReason'],
    templateEn: `From:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

To,
{{managerName}},
{{companyName}}

Date: {{date}}

Subject: Resignation from the post of {{designation}}

Dear Sir/Madam,

I am writing to formally resign from my position as {{designation}} at {{companyName}}, effective from today. My last day of work will be {{lastWorkingDate}}.

Reason for resignation: {{resignationReason}}.

I appreciate the opportunities I have been given at {{companyName}} and wish you all the best for the future.

Sincerely,

{{senderName}}
Emp ID: {{employeeId}}`,
    templateHi: `प्रेषक:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

सेवा में,
{{managerName}},
{{companyName}}

दिनांक: {{date}}

विषय: {{designation}} पद से इस्तीफा

महोदय,

मैं {{companyName}} में {{designation}} के अपने पद से औपचारिक रूप से इस्तीफा दे रहा हूँ। मेरा अंतिम कार्य दिवस {{lastWorkingDate}} होगा।

इस्तीफे का कारण: {{resignationReason}}।

मैं {{companyName}} में मिले अवसरों के लिए आभारी हूँ।

भवदीय,

{{senderName}}
आईडी: {{employeeId}}`
  },
  {
    id: 'emp_leave',
    categoryId: 'employment',
    labelEn: 'Office Leave Application',
    labelHi: 'ऑफिस छुट्टी का आवेदन',
    type: 'instant',
    requiredFields: ['senderName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'designation', 'managerName', 'leaveReason', 'leaveFromDate', 'leaveToDate'],
    templateEn: `From:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

To,
{{managerName}},

Date: {{date}}

Subject: Leave Application

Dear Sir/Madam,

I, {{senderName}}, working as {{designation}}, would like to apply for leave from {{leaveFromDate}} to {{leaveToDate}}.

The reason for my leave is: {{leaveReason}}.

I will ensure my pending tasks are handled before I leave.

Regards,

{{senderName}}
{{designation}}`,
    templateHi: `प्रेषक:
{{senderName}}
{{senderStreet}}
{{senderCity}}, {{senderState}} - {{senderPincode}}

सेवा में,
{{managerName}},

दिनांक: {{date}}

विषय: अवकाश आवेदन

महोदय,

मैं, {{senderName}}, जो {{designation}} के पद पर कार्यरत हूँ, {{leaveFromDate}} से {{leaveToDate}} तक छुट्टी के लिए आवेदन करना चाहता हूँ।

छुट्टी का कारण: {{leaveReason}}।

मैं सुनिश्चित करूंगा कि जाने से पहले मेरे लंबित कार्य पूरे हो जाएं।

सादर,

{{senderName}}`
  },
  {
      id: 'emp_custom',
      categoryId: 'employment',
      labelEn: 'Other Job Application (AI)',
      labelHi: 'अन्य नौकरी आवेदन (AI)',
      type: 'ai',
      requiredFields: ['senderName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'recipientTitle', 'recipientStreet', 'recipientCity', 'recipientState', 'recipientPincode', 'customBody']
  },
  {
      id: 'general_custom',
      categoryId: 'other',
      labelEn: 'General Letter (AI)',
      labelHi: 'सामान्य पत्र (AI)',
      type: 'ai',
      requiredFields: ['senderName', 'senderStreet', 'senderCity', 'senderState', 'senderPincode', 'recipientTitle', 'recipientStreet', 'recipientCity', 'recipientState', 'recipientPincode', 'customBody']
  }
];