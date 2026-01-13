export enum ApplicationType {
  BANK_TRANSFER = 'Bank Transfer / Account Services',
  ATM_ISSUE = 'ATM / Debit Card Issues',
  POLICE_COMPLAINT = 'Police Complaint (FIR/NCR)',
  ELECTRICITY_METER = 'Electricity / Water Department',
  SCHOOL_LEAVE = 'School / College Applications',
  OTHER = 'Other / General Application'
}

export type LanguageMode = 'en' | 'hi' | 'both';

export interface FormData {
  // --- Personal Details ---
  senderName: string;
  fatherName: string; // Often required in Indian formal letters
  senderAddress: string;
  city: string;
  phone: string;
  email: string;
  date: string;
  
  // --- Recipient Details ---
  recipientTitle: string; // e.g., The Branch Manager
  recipientAddress: string; // e.g., SBI, Main Branch, Delhi
  
  // --- Common ---
  subject: string;
  
  // --- Banking Specifics ---
  accountNumber: string;
  cifNumber: string;
  bankName: string;
  branchName: string;
  ifscCode: string;
  atmCardLastDigits: string;
  
  // --- Police/Incident Specifics ---
  policeStation: string;
  incidentDate: string;
  incidentTime: string;
  incidentLocation: string;
  vehicleDetails: string; // For vehicle theft
  mobileDetails: string; // For mobile theft (IMEI/Model)
  incidentDetails: string; // General description
  
  // --- Utility Specifics ---
  consumerNumber: string; // K Number / Meter Number
  
  // --- Custom/AI ---
  customBody: string; // Extra details / Reason
}

export const INITIAL_FORM_DATA: FormData = {
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