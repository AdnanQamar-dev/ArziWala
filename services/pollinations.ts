import { FormData, ApplicationType } from '../types';

// ============================================
// 🔒 PRIVACY SHIELD
// ============================================
const SAFE_PLACEHOLDERS = {
  ACCOUNT_NUMBER: "[ACCOUNT_PLACEHOLDER]",
  CIF_NUMBER: "[CIF_PLACEHOLDER]",
  CONSUMER_NUMBER: "[CONSUMER_PLACEHOLDER]",
  PHONE: "[PHONE_PLACEHOLDER]",
  MOBILE_IMEI: "[IMEI_PLACEHOLDER]",
  AADHAR: "[AADHAR_PLACEHOLDER]",
  RATION_CARD: "[RATION_PLACEHOLDER]"
};

// ============================================
// 📍 BIHAR SPECIFIC DATA
// ============================================
export const BIHAR_DISTRICTS = [
  "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Purnia", "Darbhanga",
  "Bihar Sharif", "Arrah", "Begusarai", "Katihar", "Munger", "Chhapra",
  "Samastipur", "Hajipur", "Sasaram", "Dehri", "Siwan", "Motihari",
  "Nawada", "Bagaha", "Buxar", "Kishanganj", "Sitamarhi", "Jamalpur",
  "Jehanabad", "Aurangabad", "Lakhisarai", "Madhubani", "Saharsa"
];

export const BIHAR_GOVT_OFFICES = {
  DM: "जिलाधिकारी (District Magistrate)",
  SDO: "अनुमंडल पदाधिकारी (Sub-Divisional Officer)",
  CO: "अंचल अधिकारी (Circle Officer)",
  BDO: "प्रखंड विकास पदाधिकारी (Block Development Officer)",
  MUKHIYA: "मुखिया (Mukhiya)",
  SP: "पुलिस अधीक्षक (Superintendent of Police)",
  DSP: "उप पुलिस अधीक्षक (Deputy SP)",
  SHO: "थानाध्यक्ष (Station House Officer)",
  DEO: "जिला शिक्षा पदाधिकारी (District Education Officer)",
  PRINCIPAL: "प्रधानाचार्य (Principal)",
  BANK_MANAGER: "शाखा प्रबंधक (Branch Manager)"
};

// ============================================
// 📝 APPLICATION TYPES (Bihar Specific)
// ============================================
export const APPLICATION_TYPES = {
  // Education
  SCHOOL_TC: "School Transfer Certificate",
  SCHOOL_CHARACTER: "Character Certificate",
  COLLEGE_ADMISSION: "College Admission Request",
  SCHOLARSHIP: "Scholarship Application",
  EXAM_CORRECTION: "Exam Name/DOB Correction",
  BOARD_DUPLICATE: "Duplicate Marksheet Request",
  
  // Certificates
  CASTE_CERTIFICATE: "Caste Certificate (जाति प्रमाण पत्र)",
  INCOME_CERTIFICATE: "Income Certificate (आय प्रमाण पत्र)",
  DOMICILE_CERTIFICATE: "Domicile Certificate (निवास प्रमाण पत्र)",
  OBC_NCL: "OBC Non-Creamy Layer Certificate",
  EWS_CERTIFICATE: "EWS Certificate",
  
  // Police
  POLICE_FIR: "FIR Registration Request",
  POLICE_VERIFICATION: "Police Verification",
  POLICE_COMPLAINT: "General Police Complaint",
  MISSING_REPORT: "Missing Person/Item Report",
  
  // Banking
  BANK_ACCOUNT_OPEN: "New Account Opening",
  BANK_STATEMENT: "Bank Statement Request",
  BANK_NAME_CHANGE: "Name Change in Bank",
  BANK_MOBILE_UPDATE: "Mobile Number Update",
  ATM_FRAUD: "ATM Fraud Complaint",
  CHEQUE_BOOK: "Cheque Book Request",
  
  // Utilities
  ELECTRICITY_NEW: "New Electricity Connection",
  ELECTRICITY_COMPLAINT: "Electricity Complaint",
  ELECTRICITY_NAME_CHANGE: "Electricity Name Transfer",
  WATER_CONNECTION: "Water Connection Request",
  
  // Government Schemes
  PM_KISAN: "PM Kisan Yojana Issue",
  RATION_CARD: "Ration Card Application",
  PENSION: "Pension Application",
  LABOUR_CARD: "Labour Card Application",
  
  // RTI
  RTI_APPLICATION: "RTI Application",
  
  // General
  GENERAL_APPLICATION: "General Application"
};

// ============================================
// ✅ VALIDATION
// ============================================
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export const validateFormData = (data: FormData, type: ApplicationType): ValidationResult => {
  const errors: string[] = [];
  
  // Required fields check
  if (!data.senderName?.trim()) errors.push("Sender name is required / आवेदक का नाम आवश्यक है");
  if (!data.senderAddress?.trim()) errors.push("Address is required / पता आवश्यक है");
  if (!data.city?.trim()) errors.push("City/District is required / जिला आवश्यक है");
  if (!data.recipientTitle?.trim()) errors.push("Recipient designation is required / प्राप्तकर्ता पद आवश्यक है");
  
  // Phone validation (Indian format)
  if (data.phone && !/^[6-9]\d{9}$/.test(data.phone.replace(/\s/g, ''))) {
    errors.push("Invalid phone number / अमान्य फोन नंबर");
  }
  
  // Aadhar validation (12 digits)
  if (data.aadharNumber && !/^\d{12}$/.test(data.aadharNumber.replace(/\s/g, ''))) {
    errors.push("Invalid Aadhar number (12 digits required) / अमान्य आधार नंबर");
  }
  
  // Type-specific validation
  if (type.includes('Bank') || type.includes('ATM')) {
    if (!data.accountNumber?.trim() && !type.includes('Open')) errors.push("Account number is required / खाता संख्या आवश्यक है");
    if (!data.bankName?.trim()) errors.push("Bank name is required / बैंक का नाम आवश्यक है");
  }
  
  if (type.includes('Electricity')) {
    if (!data.consumerNumber?.trim() && !type.includes('New')) errors.push("Consumer number is required / उपभोक्ता संख्या आवश्यक है");
  }
  
  if (type.includes('Police') || type.includes('FIR')) {
    if (!data.policeStation?.trim()) errors.push("Police station is required / थाना का नाम आवश्यक है");
    if (!data.incidentDetails?.trim()) errors.push("Incident details are required / घटना विवरण आवश्यक है");
  }
  
  if (type.includes('Certificate')) {
    // if (!data.purpose?.trim()) errors.push("Purpose is required / उद्देश्य आवश्यक है");
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// ============================================
// 📋 OFFLINE TEMPLATES (Fallback)
// ============================================
const TEMPLATES = {
  
  // Hindi Templates
  hi: {
    CASTE_CERTIFICATE: (data: FormData) => `
सेवा में,
${data.recipientTitle}
${data.recipientAddress}
जिला - ${data.city}, बिहार

विषय: जाति प्रमाण पत्र हेतु आवेदन

महोदय/महोदया,

सविनय निवेदन है कि मैं ${data.senderName}, पुत्र/पुत्री श्री ${data.fatherName || '__________'}, निवासी ${data.senderAddress}, थाना - ${data.policeStation || '__________'}, जिला - ${data.city}, बिहार का/की स्थायी निवासी हूँ।

मैं ${data.casteCategory || '__________'} जाति से संबंधित हूँ जो कि ${data.casteType || 'अनुसूचित जाति/अनुसूचित जनजाति/अन्य पिछड़ा वर्ग'} के अंतर्गत आती है।

मुझे जाति प्रमाण पत्र की आवश्यकता ${data.purpose || 'शैक्षणिक/सरकारी नौकरी/अन्य'} हेतु है।

संलग्न दस्तावेज:
1. आधार कार्ड की छायाप्रति
2. राशन कार्ड की छायाप्रति
3. निवास प्रमाण पत्र
4. पासपोर्ट साइज फोटो

अतः श्रीमान से सविनय अनुरोध है कि मेरा जाति प्रमाण पत्र शीघ्र निर्गत करने की कृपा करें।

दिनांक: ${data.date}

आपका/आपकी विश्वासी
${data.senderName}
पता: ${data.senderAddress}
मोबाइल: ${data.phone || '__________'}
आधार नं.: ${data.aadharNumber || '__________'}
`,

    INCOME_CERTIFICATE: (data: FormData) => `
सेवा में,
${data.recipientTitle}
${data.recipientAddress}
जिला - ${data.city}, बिहार

विषय: आय प्रमाण पत्र हेतु आवेदन

महोदय/महोदया,

सविनय निवेदन है कि मैं ${data.senderName}, पुत्र/पुत्री श्री ${data.fatherName || '__________'}, निवासी ${data.senderAddress}, जिला - ${data.city}, बिहार का/की स्थायी निवासी हूँ।

मेरे परिवार की वार्षिक आय लगभग रु. ${data.annualIncome || '__________'} (${data.incomeInWords || '__________'} रुपये मात्र) है।

आय के स्रोत: ${data.incomeSource || 'कृषि/नौकरी/व्यापार/मजदूरी'}

मुझे आय प्रमाण पत्र की आवश्यकता ${data.purpose || 'शैक्षणिक/छात्रवृत्ति/सरकारी योजना'} हेतु है।

संलग्न दस्तावेज:
1. आधार कार्ड की छायाप्रति
2. राशन कार्ड की छायाप्रति
3. स्व-घोषणा पत्र
4. पासपोर्ट साइज फोटो

अतः श्रीमान से सविनय अनुरोध है कि मेरा आय प्रमाण पत्र शीघ्र निर्गत करने की कृपा करें।

दिनांक: ${data.date}

आपका/आपकी विश्वासी
${data.senderName}
मोबाइल: ${data.phone || '__________'}
`,

    DOMICILE_CERTIFICATE: (data: FormData) => `
सेवा में,
${data.recipientTitle}
${data.recipientAddress}
जिला - ${data.city}, बिहार

विषय: निवास प्रमाण पत्र हेतु आवेदन

महोदय/महोदया,

सविनय निवेदन है कि मैं ${data.senderName}, पुत्र/पुत्री श्री ${data.fatherName || '__________'}, ग्राम/मोहल्ला - ${data.senderAddress}, थाना - ${data.policeStation || '__________'}, प्रखंड - ${data.block || '__________'}, जिला - ${data.city}, बिहार का/की मूल निवासी हूँ।

मैं पिछले ${data.residenceYears || '__________'} वर्षों से उपरोक्त पते पर निवास कर रहा/रही हूँ।

मुझे निवास प्रमाण पत्र की आवश्यकता ${data.purpose || 'शैक्षणिक/सरकारी नौकरी/अन्य'} हेतु है।

संलग्न दस्तावेज:
1. आधार कार्ड की छायाप्रति
2. राशन कार्ड की छायाप्रति
3. बिजली/पानी बिल
4. पासपोर्ट साइज फोटो

अतः श्रीमान से सविनय अनुरोध है कि मेरा निवास प्रमाण पत्र शीघ्र निर्गत करने की कृपा करें।

दिनांक: ${data.date}

आपका/आपकी विश्वासी
${data.senderName}
मोबाइल: ${data.phone || '__________'}
`,

    SCHOOL_TC: (data: FormData) => `
सेवा में,
${data.recipientTitle}
${data.schoolName || '__________'}
${data.recipientAddress}

विषय: स्थानांतरण प्रमाण पत्र (TC) हेतु आवेदन

महोदय/महोदया,

सविनय निवेदन है कि मैं ${data.senderName}, पुत्र/पुत्री श्री ${data.fatherName || '__________'}, आपके विद्यालय में कक्षा ${data.className || '__________'}, अनुक्रमांक ${data.rollNumber || '__________'} का/की छात्र/छात्रा हूँ।

मुझे स्थानांतरण प्रमाण पत्र की आवश्यकता ${data.reason || 'अन्य विद्यालय में प्रवेश/स्थानांतरण'} के कारण है।

${data.customBody || ''}

मैंने विद्यालय की सभी देनदारियाँ चुका दी हैं तथा पुस्तकालय से सभी पुस्तकें वापस कर दी हैं।

अतः श्रीमान/श्रीमती से सविनय अनुरोध है कि मेरा स्थानांतरण प्रमाण पत्र शीघ्र निर्गत करने की कृपा करें।

दिनांक: ${data.date}

आपका/आपकी आज्ञाकारी शिष्य/शिष्या
${data.senderName}
कक्षा: ${data.className || '__________'}
अनुक्रमांक: ${data.rollNumber || '__________'}
अभिभावक का नाम: ${data.fatherName || '__________'}
मोबाइल: ${data.phone || '__________'}
`,

    POLICE_FIR: (data: FormData) => `
सेवा में,
${data.recipientTitle}
${data.policeStation} थाना
जिला - ${data.city}, बिहार

विषय: प्राथमिकी दर्ज कराने हेतु आवेदन

महोदय,

सविनय निवेदन है कि मैं ${data.senderName}, पुत्र/पुत्री श्री ${data.fatherName || '__________'}, निवासी ${data.senderAddress}, जिला - ${data.city} का/की निवासी हूँ।

मैं आपके संज्ञान में निम्नलिखित घटना लाना चाहता/चाहती हूँ:

घटना की तिथि: ${data.incidentDate || '__________'}
घटना का समय: ${data.incidentTime || '__________'}
घटना का स्थान: ${data.incidentLocation || '__________'}

घटना का विवरण:
${data.incidentDetails || '__________'}

${data.vehicleDetails ? `वाहन विवरण: ${data.vehicleDetails}` : ''}
${data.accusedDetails ? `आरोपी का विवरण: ${data.accusedDetails}` : ''}

गवाहों का विवरण:
${data.witnessDetails || 'उपलब्ध नहीं'}

अतः श्रीमान से सविनय अनुरोध है कि उपरोक्त घटना के संबंध में मेरी प्राथमिकी दर्ज कर उचित कार्यवाही करने की कृपा करें।

दिनांक: ${data.date}

प्रार्थी
${data.senderName}
पता: ${data.senderAddress}
मोबाइल: ${data.phone || '__________'}
आधार नं.: ${data.aadharNumber || '__________'}
`,

    BANK_GENERAL: (data: FormData) => `
सेवा में,
शाखा प्रबंधक
${data.bankName || '__________'}
शाखा: ${data.branchName || '__________'}
${data.recipientAddress}

विषय: ${data.subject || 'बैंक संबंधित आवेदन'}

महोदय/महोदया,

सविनय निवेदन है कि मैं ${data.senderName}, आपकी शाखा में बचत/चालू खाता धारक हूँ।

खाता विवरण:
खाता संख्या: ${data.accountNumber || '__________'}
खाता प्रकार: ${data.accountType || 'बचत खाता'}
${data.cifNumber ? `CIF नंबर: ${data.cifNumber}` : ''}
${data.ifscCode ? `IFSC कोड: ${data.ifscCode}` : ''}

${data.customBody || data.incidentDetails || 'कृपया मेरे अनुरोध पर विचार करें।'}

अतः श्रीमान से सविनय अनुरोध है कि मेरे आवेदन पर शीघ्र कार्यवाही करने की कृपा करें।

दिनांक: ${data.date}

भवदीय
${data.senderName}
पता: ${data.senderAddress}
मोबाइल: ${data.phone || '__________'}
`,

    RTI_APPLICATION: (data: FormData) => `
सूचना का अधिकार अधिनियम, 2005 के तहत आवेदन

सेवा में,
${data.recipientTitle}
${data.recipientAddress}
जिला - ${data.city}, बिहार

विषय: सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के तहत सूचना प्राप्त करने हेतु आवेदन

महोदय/महोदया,

मैं ${data.senderName}, निवासी ${data.senderAddress}, जिला - ${data.city}, बिहार, सूचना का अधिकार अधिनियम, 2005 की धारा 6(1) के अंतर्गत निम्नलिखित सूचना प्राप्त करना चाहता/चाहती हूँ:

मांगी गई सूचना का विवरण:
${data.rtiQuery || data.customBody || '__________'}

सूचना का समय काल: ${data.rtiPeriod || '__________'}

मैं इस आवेदन के साथ रु. 10/- (दस रुपये मात्र) का शुल्क ${data.paymentMode || 'नकद/पोस्टल ऑर्डर/डिमांड ड्राफ्ट'} के माध्यम से जमा कर रहा/रही हूँ।

यदि मांगी गई सूचना आपके विभाग से संबंधित नहीं है तो कृपया इसे धारा 6(3) के अंतर्गत संबंधित विभाग को अंतरित करें।

दिनांक: ${data.date}

आवेदक
${data.senderName}
पता: ${data.senderAddress}
मोबाइल: ${data.phone || '__________'}
ईमेल: ${data.email || '__________'}
`,

    SCHOLARSHIP: (data: FormData) => `
सेवा में,
${data.recipientTitle}
${data.recipientAddress}
${data.city}, बिहार

विषय: छात्रवृत्ति हेतु आवेदन

महोदय/महोदया,

सविनय निवेदन है कि मैं ${data.senderName}, पुत्र/पुत्री श्री ${data.fatherName || '__________'}, निवासी ${data.senderAddress}, जिला - ${data.city}, बिहार का/की निवासी हूँ।

मैं वर्तमान में ${data.institutionName || '__________'} में ${data.courseName || '__________'} कक्षा/पाठ्यक्रम में अध्ययनरत हूँ।

शैक्षणिक विवरण:
- संस्था का नाम: ${data.institutionName || '__________'}
- कक्षा/पाठ्यक्रम: ${data.courseName || '__________'}
- पिछली परीक्षा में प्राप्तांक: ${data.previousMarks || '__________'}%
- अनुक्रमांक: ${data.rollNumber || '__________'}

पारिवारिक विवरण:
- वार्षिक आय: रु. ${data.annualIncome || '__________'}
- जाति श्रेणी: ${data.casteCategory || '__________'}

मेरे परिवार की आर्थिक स्थिति कमजोर है और मुझे अपनी पढ़ाई जारी रखने के लिए आर्थिक सहायता की आवश्यकता है।

संलग्न दस्तावेज:
1. आधार कार्ड की छायाप्रति
2. आय प्रमाण पत्र
3. जाति प्रमाण पत्र
4. पिछली परीक्षा की अंकपत्र
5. बैंक पासबुक की छायाप्रति
6. पासपोर्ट साइज फोटो

अतः श्रीमान से सविनय अनुरोध है कि मुझे छात्रवृत्ति प्रदान करने की कृपा करें।

दिनांक: ${data.date}

प्रार्थी
${data.senderName}
मोबाइल: ${data.phone || '__________'}
बैंक खाता: ${data.accountNumber || '__________'}
IFSC: ${data.ifscCode || '__________'}
`,

    GENERAL_APPLICATION: (data: FormData) => `
सेवा में,
${data.recipientTitle}
${data.recipientAddress}
जिला - ${data.city}, बिहार

विषय: ${data.subject || 'सामान्य आवेदन'}

महोदय/महोदया,

सविनय निवेदन है कि मैं ${data.senderName}, पुत्र/पुत्री श्री ${data.fatherName || '__________'}, निवासी ${data.senderAddress}, जिला - ${data.city}, बिहार का/की निवासी हूँ।

${data.customBody || data.incidentDetails || 'कृपया मेरे अनुरोध पर विचार करें।'}

अतः श्रीमान से सविनय अनुरोध है कि मेरे आवेदन पर शीघ्र कार्यवाही करने की कृपा करें।

दिनांक: ${data.date}

प्रार्थी
${data.senderName}
पता: ${data.senderAddress}
मोबाइल: ${data.phone || '__________'}
`
  },

  // English Templates
  en: {
    CASTE_CERTIFICATE: (data: FormData) => `
To,
${data.recipientTitle}
${data.recipientAddress}
District - ${data.city}, Bihar

Subject: Application for Caste Certificate

Respected Sir/Madam,

I, ${data.senderName}, Son/Daughter of Shri ${data.fatherName || '__________'}, resident of ${data.senderAddress}, P.S. - ${data.policeStation || '__________'}, District - ${data.city}, Bihar, respectfully submit this application for the issuance of a Caste Certificate.

I belong to the ${data.casteCategory || '__________'} caste, which falls under the ${data.casteType || 'SC/ST/OBC'} category.

I require this certificate for ${data.purpose || 'educational/government employment/other'} purposes.

Enclosed Documents:
1. Photocopy of Aadhar Card
2. Photocopy of Ration Card
3. Residence Certificate
4. Passport Size Photograph

I humbly request you to kindly issue my Caste Certificate at the earliest.

Date: ${data.date}

Yours faithfully,
${data.senderName}
Address: ${data.senderAddress}
Mobile: ${data.phone || '__________'}
Aadhar No.: ${data.aadharNumber || '__________'}
`,

    INCOME_CERTIFICATE: (data: FormData) => `
To,
${data.recipientTitle}
${data.recipientAddress}
District - ${data.city}, Bihar

Subject: Application for Income Certificate

Respected Sir/Madam,

I, ${data.senderName}, Son/Daughter of Shri ${data.fatherName || '__________'}, resident of ${data.senderAddress}, District - ${data.city}, Bihar, respectfully submit this application for the issuance of an Income Certificate.

My family's annual income is approximately Rs. ${data.annualIncome || '__________'} (${data.incomeInWords || '__________'} Rupees only).

Source of Income: ${data.incomeSource || 'Agriculture/Service/Business/Labour'}

I require this certificate for ${data.purpose || 'educational/scholarship/government scheme'} purposes.

Enclosed Documents:
1. Photocopy of Aadhar Card
2. Photocopy of Ration Card
3. Self-Declaration
4. Passport Size Photograph

I humbly request you to kindly issue my Income Certificate at the earliest.

Date: ${data.date}

Yours faithfully,
${data.senderName}
Mobile: ${data.phone || '__________'}
`,

    SCHOOL_TC: (data: FormData) => `
To,
${data.recipientTitle}
${data.schoolName || '__________'}
${data.recipientAddress}

Subject: Application for Transfer Certificate (TC)

Respected Sir/Madam,

I, ${data.senderName}, Son/Daughter of Shri ${data.fatherName || '__________'}, am a student of Class ${data.className || '__________'}, Roll No. ${data.rollNumber || '__________'} in your esteemed institution.

I require a Transfer Certificate due to ${data.reason || 'admission in another school/transfer'}.

${data.customBody || ''}

I have cleared all dues and returned all library books.

I humbly request you to kindly issue my Transfer Certificate at the earliest.

Date: ${data.date}

Your obedient student,
${data.senderName}
Class: ${data.className || '__________'}
Roll No.: ${data.rollNumber || '__________'}
Guardian's Name: ${data.fatherName || '__________'}
Mobile: ${data.phone || '__________'}
`,

    POLICE_FIR: (data: FormData) => `
To,
${data.recipientTitle}
${data.policeStation} Police Station
District - ${data.city}, Bihar

Subject: Application for Registration of FIR

Respected Sir,

I, ${data.senderName}, Son/Daughter of Shri ${data.fatherName || '__________'}, resident of ${data.senderAddress}, District - ${data.city}, hereby bring the following incident to your kind notice:

Date of Incident: ${data.incidentDate || '__________'}
Time of Incident: ${data.incidentTime || '__________'}
Place of Incident: ${data.incidentLocation || '__________'}

Details of Incident:
${data.incidentDetails || '__________'}

${data.vehicleDetails ? `Vehicle Details: ${data.vehicleDetails}` : ''}
${data.accusedDetails ? `Accused Details: ${data.accusedDetails}` : ''}

Witness Details:
${data.witnessDetails || 'Not available'}

I humbly request you to kindly register my FIR and take appropriate legal action in this matter.

Date: ${data.date}

Complainant,
${data.senderName}
Address: ${data.senderAddress}
Mobile: ${data.phone || '__________'}
Aadhar No.: ${data.aadharNumber || '__________'}
`,

    BANK_GENERAL: (data: FormData) => `
To,
The Branch Manager
${data.bankName || '__________'}
Branch: ${data.branchName || '__________'}
${data.recipientAddress}

Subject: ${data.subject || 'Bank Related Application'}

Respected Sir/Madam,

I, ${data.senderName}, am a savings/current account holder at your branch.

Account Details:
Account Number: ${data.accountNumber || '__________'}
Account Type: ${data.accountType || 'Savings Account'}
${data.cifNumber ? `CIF Number: ${data.cifNumber}` : ''}
${data.ifscCode ? `IFSC Code: ${data.ifscCode}` : ''}

${data.customBody || data.incidentDetails || 'Please consider my request.'}

I humbly request you to kindly process my application at the earliest.

Date: ${data.date}

Yours faithfully,
${data.senderName}
Address: ${data.senderAddress}
Mobile: ${data.phone || '__________'}
`,

    GENERAL_APPLICATION: (data: FormData) => `
To,
${data.recipientTitle}
${data.recipientAddress}
District - ${data.city}, Bihar

Subject: ${data.subject || 'General Application'}

Respected Sir/Madam,

I, ${data.senderName}, Son/Daughter of Shri ${data.fatherName || '__________'}, resident of ${data.senderAddress}, District - ${data.city}, Bihar, respectfully submit this application.

${data.customBody || data.incidentDetails || 'Please consider my request.'}

I humbly request you to kindly take necessary action on my application at the earliest.

Date: ${data.date}

Yours faithfully,
${data.senderName}
Address: ${data.senderAddress}
Mobile: ${data.phone || '__________'}
`
  }
};

// ============================================
// 🧹 TEXT CLEANER (Anti-Ad & Cleanup)
// ============================================
const cleanAIOutput = (text: string): string => {
  return text
    .replace(/\*\*/g, '')
    .replace(/#{1,6}\s?/g, '')
    .replace(/Generated via.*/gi, '')
    .replace(/Pollinations/gi, '')
    .replace(/Ø/g, '')
    .replace(/\(Ad\)/gi, '')
    .replace(/\[Unrelated text\]/gi, '')
    .replace(/^\s*[-_]{3,}\s*$/gm, '')
    .replace(/\[?\(?Signature\)?\]?/gi, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/`/g, '')
    .replace(/\*\s/g, '• ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
};

// ============================================
// 🔄 PRIVACY REPLACEMENT
// ============================================
const replacePlaceholders = (text: string, data: FormData): string => {
  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  const replacements: [string, string | undefined][] = [
    [SAFE_PLACEHOLDERS.ACCOUNT_NUMBER, data.accountNumber],
    [SAFE_PLACEHOLDERS.CIF_NUMBER, data.cifNumber],
    [SAFE_PLACEHOLDERS.CONSUMER_NUMBER, data.consumerNumber],
    [SAFE_PLACEHOLDERS.PHONE, data.phone],
    [SAFE_PLACEHOLDERS.MOBILE_IMEI, data.mobileDetails],
    [SAFE_PLACEHOLDERS.AADHAR, data.aadharNumber],
    [SAFE_PLACEHOLDERS.RATION_CARD, data.rationCardNumber]
  ];
  
  replacements.forEach(([placeholder, actual]) => {
    text = text.replace(new RegExp(escapeRegExp(placeholder), 'g'), actual || '__________');
  });
  
  return text;
};

// ============================================
// 🎯 GET TEMPLATE KEY FROM TYPE
// ============================================
const getTemplateKey = (type: ApplicationType): string => {
  // Check against string values
  if (type.includes('Caste') || type.includes('जाति')) return 'CASTE_CERTIFICATE';
  if (type.includes('Income') || type.includes('आय')) return 'INCOME_CERTIFICATE';
  if (type.includes('Domicile') || type.includes('निवास')) return 'DOMICILE_CERTIFICATE';
  if (type.includes('TC') || type.includes('Transfer')) return 'SCHOOL_TC';
  if (type.includes('FIR') || type.includes('Police')) return 'POLICE_FIR';
  if (type.includes('Bank') || type.includes('ATM') || type.includes('Cheque')) return 'BANK_GENERAL';
  if (type.includes('RTI')) return 'RTI_APPLICATION';
  if (type.includes('Scholarship') || type.includes('छात्रवृत्ति')) return 'SCHOLARSHIP';
  
  return 'GENERAL_APPLICATION';
};

// ============================================
// 📨 MAIN GENERATOR FUNCTION
// ============================================
export const generateLetterText = async (
  type: ApplicationType,
  data: FormData,
  language: 'en' | 'hi' = 'hi'
): Promise<string> => {
  
  // 1. VALIDATE INPUT
  const validation = validateFormData(data, type);
  if (!validation.isValid) {
    throw new Error(`Validation Failed:\n${validation.errors.join('\n')}`);
  }
  
  // 2. SET DEFAULT DATE
  if (!data.date) {
    data.date = new Date().toLocaleDateString('en-IN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
  
  // 3. TRY OFFLINE TEMPLATE FIRST (More Reliable)
  const templateKey = getTemplateKey(type);
  // @ts-ignore
  const templates = TEMPLATES[language];
  
  if (templates && templates[templateKey as keyof typeof templates]) {
    try {
      // @ts-ignore
      const templateFn = templates[templateKey as keyof typeof templates];
      const result = templateFn(data);
      return result.trim();
    } catch (templateError) {
      console.warn("Template generation failed, trying AI...", templateError);
    }
  }
  
  // 4. FALLBACK TO AI IF NO TEMPLATE
  try {
    const result = await generateWithAI(type, data, language);
    return result;
  } catch (aiError) {
    console.error("AI generation failed", aiError);
    
    // 5. ULTIMATE FALLBACK - Basic Template
    return generateBasicFallback(type, data, language);
  }
};

// ============================================
// 🤖 AI GENERATION (Secondary Option)
// ============================================
const generateWithAI = async (
  type: ApplicationType,
  data: FormData,
  language: 'en' | 'hi'
): Promise<string> => {
  
  let specificRefNumber = '';
  
  if (type.includes('Bank') || type.includes('ATM')) {
    specificRefNumber = `Account No: ${SAFE_PLACEHOLDERS.ACCOUNT_NUMBER}`;
    if (data.cifNumber) specificRefNumber += `, CIF: ${SAFE_PLACEHOLDERS.CIF_NUMBER}`;
  } else if (type.includes('Police')) {
    specificRefNumber = `PS: ${data.policeStation}`;
  } else if (type.includes('Electricity')) {
    specificRefNumber = `Consumer No: ${SAFE_PLACEHOLDERS.CONSUMER_NUMBER}`;
  }
  
  let extraDetails = "";
  if (data.incidentDate) extraDetails += `\nIncident Date: ${data.incidentDate} at ${data.incidentTime || 'approx time'}.`;
  if (data.incidentLocation) extraDetails += `\nLocation: ${data.incidentLocation}.`;
  if (data.vehicleDetails) extraDetails += `\nVehicle: ${data.vehicleDetails}.`;
  
  const reasonContent = (data.customBody || data.incidentDetails || "As per subject.") + extraDetails;
  const subjectLine = data.subject || `Application for ${type}`;
  
  const langInstruction = language === 'hi'
    ? "Write ENTIRELY in formal HINDI (Devanagari script). Use formal Hindi: 'सविनय निवेदन', 'प्रार्थी', 'श्रीमान'."
    : "Write in formal English suitable for Indian government offices.";
  
  const prompt = `You are a professional Indian government document drafter specializing in Bihar state applications.

Write a COMPLETE formal application letter.

CRITICAL REQUIREMENTS:
- Language: ${langInstruction}
- State: Bihar, India
- Format: Standard Indian government application format
- NO markdown, NO asterisks, NO special formatting
- NO "[Signature]" placeholder - end with sender name only

APPLICATION DETAILS:
- Type: ${type}
- Subject: ${subjectLine}
- Date: ${data.date}

SENDER DETAILS:
- Name: ${data.senderName}
- Father's Name: ${data.fatherName || '__________'}
- Address: ${data.senderAddress}
- City/District: ${data.city}
- Phone: ${SAFE_PLACEHOLDERS.PHONE}
${data.aadharNumber ? `- Aadhar: ${SAFE_PLACEHOLDERS.AADHAR}` : ''}

RECIPIENT:
- Title: ${data.recipientTitle}
- Address: ${data.recipientAddress}

REFERENCE: ${specificRefNumber}

CONTENT/REASON:
${reasonContent}

STRUCTURE:
1. Complete address block (To/From format)
2. Date on right side
3. Subject line
4. Salutation (महोदय/Sir)
5. Body with proper paragraphs
6. Polite closing request
7. "Yours faithfully/भवदीय" with sender name

Write minimum 200 words. Be detailed and professional.`;

  const seed = Math.floor(Math.random() * 10000);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);
  
  try {
    const response = await fetch(
      `https://text.pollinations.ai/${encodeURIComponent(prompt)}?seed=${seed}`,
      { signal: controller.signal }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    let text = await response.text();
    text = cleanAIOutput(text);
    text = replacePlaceholders(text, data);
    
    return text;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// ============================================
// 🆘 BASIC FALLBACK
// ============================================
const generateBasicFallback = (
  type: ApplicationType,
  data: FormData,
  language: 'en' | 'hi'
): string => {
  
  if (language === 'hi') {
    return `
सेवा में,
${data.recipientTitle}
${data.recipientAddress}
${data.city}, बिहार

दिनांक: ${data.date}

विषय: ${data.subject || type}

महोदय,

सविनय निवेदन है कि मैं ${data.senderName}, पुत्र/पुत्री श्री ${data.fatherName || '__________'}, निवासी ${data.senderAddress}, जिला ${data.city} का/की निवासी हूँ।

${data.customBody || data.incidentDetails || 'कृपया मेरे आवेदन पर विचार करें।'}

अतः श्रीमान से सविनय अनुरोध है कि मेरे आवेदन पर उचित कार्यवाही करने की कृपा करें।

भवदीय,
${data.senderName}
पता: ${data.senderAddress}
मोबाइल: ${data.phone || '__________'}
`.trim();
  }
  
  return `
To,
${data.recipientTitle}
${data.recipientAddress}
${data.city}, Bihar

Date: ${data.date}

Subject: ${data.subject || type}

Respected Sir/Madam,

I, ${data.senderName}, S/o ${data.fatherName || '__________'}, resident of ${data.senderAddress}, District ${data.city}, Bihar, respectfully submit this application.

${data.customBody || data.incidentDetails || 'Please consider my application.'}

I humbly request you to kindly take necessary action on my application.

Yours faithfully,
${data.senderName}
Address: ${data.senderAddress}
Mobile: ${data.phone || '__________'}
`.trim();
};