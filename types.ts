export type ApplicationType = 
  | "School Transfer Certificate"
  | "Character Certificate"
  | "College Admission Request"
  | "Scholarship Application"
  | "Exam Name/DOB Correction"
  | "Duplicate Marksheet Request"
  | "Caste Certificate (जाति प्रमाण पत्र)"
  | "Income Certificate (आय प्रमाण पत्र)"
  | "Domicile Certificate (निवास प्रमाण पत्र)"
  | "OBC Non-Creamy Layer Certificate"
  | "EWS Certificate"
  | "FIR Registration Request"
  | "Police Verification"
  | "General Police Complaint"
  | "Missing Person/Item Report"
  | "New Account Opening"
  | "Bank Statement Request"
  | "Name Change in Bank"
  | "Mobile Number Update"
  | "ATM Fraud Complaint"
  | "Cheque Book Request"
  | "New Electricity Connection"
  | "Electricity Complaint"
  | "Electricity Name Transfer"
  | "Water Connection Request"
  | "PM Kisan Yojana Issue"
  | "Ration Card Application"
  | "Pension Application"
  | "Labour Card Application"
  | "RTI Application"
  | "General Application"
  | string;

export type LanguageMode = 'en' | 'hi' | 'both';

export interface FormData {
  // Basic Info
  senderName: string;
  fatherName?: string;
  senderAddress: string;
  city: string;
  phone?: string;
  email?: string;
  date?: string;
  
  // Recipient
  recipientTitle: string;
  recipientAddress: string;
  
  // Application Details
  subject?: string;
  customBody?: string;
  purpose?: string;
  
  // Identity Documents
  aadharNumber?: string;
  rationCardNumber?: string;
  
  // Education Related
  schoolName?: string;
  institutionName?: string;
  className?: string;
  rollNumber?: string;
  courseName?: string;
  previousMarks?: string;
  reason?: string;
  
  // Police Related
  policeStation?: string;
  incidentDate?: string;
  incidentTime?: string;
  incidentLocation?: string;
  incidentDetails?: string;
  accusedDetails?: string;
  witnessDetails?: string;
  vehicleDetails?: string;
  
  // Bank Related
  bankName?: string;
  branchName?: string;
  accountNumber?: string;
  accountType?: string;
  cifNumber?: string;
  ifscCode?: string;
  atmCardLastDigits?: string; // Kept for compatibility
  
  // Utility Related
  consumerNumber?: string;
  mobileDetails?: string;
  
  // Certificate Related
  casteCategory?: string;
  casteType?: string;
  annualIncome?: string;
  incomeInWords?: string;
  incomeSource?: string;
  residenceYears?: string;
  block?: string;
  
  // RTI Related
  rtiQuery?: string;
  rtiPeriod?: string;
  paymentMode?: string;
}

export const INITIAL_FORM_DATA: FormData = {
  // Basic Info - Initialize ALL to empty strings
  senderName: '',
  fatherName: '',
  senderAddress: '',
  city: '',
  phone: '',
  email: '',
  date: new Date().toISOString().split('T')[0],
  
  recipientTitle: '',
  recipientAddress: '',
  subject: '',
  customBody: '',
  purpose: '',

  // Identity
  aadharNumber: '',
  rationCardNumber: '',
  
  // Bank
  bankName: 'State Bank of India',
  branchName: '',
  accountNumber: '',
  accountType: '',
  cifNumber: '',
  ifscCode: '',
  atmCardLastDigits: '',
  
  // Police
  policeStation: '',
  incidentDate: '',
  incidentTime: '',
  incidentLocation: '',
  incidentDetails: '',
  accusedDetails: '',
  witnessDetails: '',
  vehicleDetails: '',

  // School
  schoolName: '',
  institutionName: '',
  className: '',
  rollNumber: '',
  courseName: '',
  previousMarks: '',
  reason: '',

  // Utility
  consumerNumber: '',
  mobileDetails: '',

  // Certificate
  casteCategory: '',
  casteType: '',
  annualIncome: '',
  incomeInWords: '',
  incomeSource: '',
  residenceYears: '',
  block: '',

  // RTI
  rtiQuery: '',
  rtiPeriod: '',
  paymentMode: ''
};