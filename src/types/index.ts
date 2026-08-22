export type ProfessionType =
  | 'Freelance Developer / Designer'
  | 'Private Tutor / Coach'
  | 'Electrician / Technician'
  | 'Tailor / Fashion Designer'
  | 'Mechanic / Garage'
  | 'Home Service & Plumbing'
  | 'Business Consultant'
  | 'Contractor & Painter';

export interface UserProfile {
  name: string;
  businessName: string;
  profession: ProfessionType;
  phone: string;
  email: string;
  upiId: string;
  upiQrEnabled: boolean;
  gstin?: string;
  city: string;
  address: string;
  currency: string;
  defaultPaymentTermsDays: number;
}

export type RiskRating = 'low' | 'medium' | 'high';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  gstin?: string;
  professionOrCompany: string;
  totalBilled: number;
  totalPaid: number;
  outstandingBalance: number;
  riskRating: RiskRating;
  paymentReliabilityScore: number; // 0 to 100
  createdAt: string;
  notes?: string;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discountPercent: number; // 0 - 100%
  taxRate: number; // 0, 5, 12, 18, 28%
  amount: number;
}

export type InvoiceStatus = 'draft' | 'pending' | 'overdue' | 'paid' | 'partial';
export type InvoiceTheme = 'modern' | 'classic' | 'executive' | 'compact';
export type DeliveryChannel = 'whatsapp' | 'sms' | 'email';
export type DeliveryStatus = 'draft' | 'sent' | 'delivered' | 'viewed' | 'paid';

export interface Invoice {
  id: string;
  invoiceNumber: string; // e.g. #INV-1024
  clientId: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  issueDate: string; // YYYY-MM-DD
  dueDate: string; // YYYY-MM-DD
  items: InvoiceItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  paidAmount: number;
  status: InvoiceStatus;
  paymentMethod?: 'UPI' | 'Cash' | 'Bank Transfer (IMPS/NEFT)' | 'Cheque' | 'Other';
  paymentNotes?: string;
  paidAt?: string;
  reminderCount: number;
  lastReminderSentAt?: string;
  deliveryStatus: DeliveryStatus;
  quoteIdRef?: string;
  theme: InvoiceTheme;
  notes?: string;
  termsAndConditions?: string;
  serviceCategory?: string;
}

export interface ReminderLog {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  timestamp: string;
  channel: DeliveryChannel;
  tone: 'polite' | 'friendly' | 'firm' | 'urgent';
  content: string;
  deliveryStatus: 'delivered' | 'read' | 'pending';
}

export interface Quote {
  id: string;
  quoteNumber: string; // e.g. #QT-501
  clientId?: string;
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  title: string;
  description: string;
  promptUsed?: string;
  items: InvoiceItem[];
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  total: number;
  validUntil: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'converted';
  convertedInvoiceId?: string;
  terms: string[];
  estimatedDuration: string;
  serviceCategory: string;
  createdAt: string;
}

export interface UpiTransaction {
  id: string;
  utrNumber: string; // e.g. 423189201948
  payerName: string;
  payerUpiId: string;
  amount: number;
  date: string;
  time: string;
  rawRemark: string;
  status: 'unreconciled' | 'reconciled';
  matchedInvoiceId?: string;
  matchScore?: number; // 0 to 100
  matchReason?: string;
}

export type ActiveModule =
  | 'all'
  | 'invoicing'
  | 'recovery'
  | 'intelligence'
  | 'quotes'
  | 'clients';
