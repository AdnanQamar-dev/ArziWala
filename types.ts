export enum ApplicationType {
  BANK_TRANSFER = 'Bank Transfer Request',
  ATM_ISSUE = 'ATM Card Issue/Block',
  POLICE_COMPLAINT = 'Police Complaint (General)',
  ELECTRICITY_METER = 'Electricity Meter Change',
  SCHOOL_LEAVE = 'School/College Leave Application',
  OTHER = 'Other Custom Application'
}

export type Language = 'English (Official)' | 'Hindi (Formal)';

export interface FormData {
  // Common Fields
  senderName: string;
  senderAddress: string;
  city: string;
  date: string;
  
  // Recipient Fields
  recipientTitle: string; // e.g., The Branch Manager
  recipientAddress: string; // e.g., SBI, Main Branch, Delhi
  
  // Specifics
  subject: string;
  
  // Dynamic Fields
  accountNumber: string; // Bank
  cifNumber: string; // Bank
  incidentDetails: string; // Police
  consumerNumber: string; // Electricity
  customBody: string; // Extra details / Reason
}

export const INITIAL_FORM_DATA: FormData = {
  senderName: '',
  senderAddress: '',
  city: '',
  date: new Date().toISOString().split('T')[0],
  recipientTitle: '',
  recipientAddress: '',
  subject: '',
  accountNumber: '',
  cifNumber: '',
  incidentDetails: '',
  consumerNumber: '',
  customBody: ''
};