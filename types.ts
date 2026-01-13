export type ApplicationType = 
  | 'banking' 
  | 'police' 
  | 'government' 
  | 'education' 
  | 'employment' 
  | 'other';

export type LanguageMode = 'en' | 'hi' | 'both';

export interface FormData {
  // --- Personal Details ---
  senderName: string;
  fatherName: string;
  
  // Sender Address Breakdown
  senderStreet: string;
  senderCity: string;
  senderState: string;
  senderPincode: string;

  phone: string;
  email: string;
  date: string;
  
  // --- Recipient Details ---
  recipientTitle: string;
  
  // Recipient Address Breakdown
  recipientStreet: string;
  recipientCity: string;
  recipientState: string;
  recipientPincode: string;
  
  // --- Common ---
  subject: string;
  
  // --- Banking ---
  accountNumber: string;
  cifNumber: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  atmCardLastDigits: string;
  chequeLeaves?: string; // 25, 50, 100
  
  // --- Police/Incident ---
  policeStation: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  incidentDetails: string;
  
  // Vehicle Theft
  vehicleDetails?: string;
  vehicleType?: string;
  vehicleBrand?: string;
  vehicleModel?: string;
  vehicleColor?: string;
  registrationNumber?: string;
  chassisNumber?: string;
  engineNumber?: string;
  vehicleValue?: string;
  
  // Mobile Theft
  mobileDetails: string; // Used as generic or specific
  imeiNumber?: string;
  mobileModel?: string;
  mobileColor?: string;
  simProvider?: string;
  simNumber?: string;
  mobileValue?: string;
  
  // --- Utility ---
  consumerNumber: string;
  
  // --- Education ---
  rollNumber?: string;
  className?: string;
  section?: string;
  schoolName?: string;
  principalName?: string;
  admissionNumber?: string;
  leaveReason?: string;
  leaveFromDate?: string;
  leaveToDate?: string;

  // --- Employment ---
  department?: string;
  designation?: string;
  employeeId?: string;
  joiningDate?: string;
  lastWorkingDate?: string;
  noticePeriod?: string;
  managerName?: string;
  managerDesignation?: string;
  companyName?: string;
  resignationReason?: string;
  
  // --- Government/Certificate ---
  tehsil?: string;
  district?: string;
  state?: string;
  caste?: string;
  category?: string; // SC/ST/OBC
  occupation?: string;
  annualIncome?: string;
  purpose?: string;
  
  // --- Custom/AI ---
  customBody: string;
}

export const INITIAL_FORM_DATA: FormData = {
  senderName: '',
  fatherName: '',
  
  senderStreet: '',
  senderCity: '',
  senderState: '',
  senderPincode: '',

  phone: '',
  email: '',
  date: new Date().toISOString().split('T')[0],
  
  recipientTitle: '',
  
  recipientStreet: '',
  recipientCity: '',
  recipientState: '',
  recipientPincode: '',
  
  subject: '',
  
  accountNumber: '',
  cifNumber: '',
  bankName: 'State Bank of India',
  branchName: '',
  ifscCode: '',
  atmCardLastDigits: '',
  
  policeStation: '',
  incidentDate: '',
  incidentTime: '',
  incidentLocation: '',
  vehicleDetails: '',
  mobileDetails: '',
  incidentDetails: '',
  
  consumerNumber: '',
  customBody: ''
};