import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  UserProfile,
  Client,
  Invoice,
  Quote,
  UpiTransaction,
  ReminderLog,
  ActiveModule,
  RiskRating,
  DeliveryChannel,
} from '../types';
import {
  initialUserProfile,
  initialClients,
  initialInvoices,
  initialQuotes,
  initialUpiTransactions,
  initialReminderLogs,
} from '../data/seedData';
import confetti from 'canvas-confetti';

interface PayFlowContextType {
  userProfile: UserProfile;
  updateUserProfile: (profile: Partial<UserProfile>) => void;

  clients: Client[];
  addClient: (client: Omit<Client, 'id' | 'createdAt' | 'totalBilled' | 'totalPaid' | 'outstandingBalance' | 'riskRating' | 'paymentReliabilityScore'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;
  deleteClient: (id: string) => void;

  invoices: Invoice[];
  createInvoice: (invoice: Omit<Invoice, 'id' | 'invoiceNumber' | 'reminderCount' | 'deliveryStatus'>) => Invoice;
  updateInvoice: (id: string, updates: Partial<Invoice>) => void;
  deleteInvoice: (id: string) => void;
  duplicateInvoice: (id: string) => Invoice;
  markAsPaid: (
    id: string,
    paymentMethod: Invoice['paymentMethod'],
    paymentNotes?: string,
    paidAmount?: number
  ) => void;
  toggleInvoiceOverdue: (id: string) => void;

  quotes: Quote[];
  createQuote: (quote: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt'>) => Quote;
  updateQuote: (id: string, updates: Partial<Quote>) => void;
  deleteQuote: (id: string) => void;
  convertQuoteToInvoice: (quoteId: string) => Invoice;

  upiTransactions: UpiTransaction[];
  reconcileTransaction: (transactionId: string, invoiceId: string) => void;
  autoReconcileAll: () => number;
  importUpiTransactions: (transactions: UpiTransaction[]) => void;

  reminderLogs: ReminderLog[];
  sendReminder: (
    invoiceId: string,
    channel: DeliveryChannel,
    tone: 'polite' | 'friendly' | 'firm' | 'urgent',
    customMessage?: string
  ) => ReminderLog;
  batchRemindOverdue: () => number;

  // Active module for testing standalone micro-SaaS vs integrated pro suite
  activeModuleFilter: ActiveModule;
  setActiveModuleFilter: (module: ActiveModule) => void;

  // Demo Guide step controller
  demoStep: number;
  setDemoStep: (step: number) => void;
  isDemoActive: boolean;
  setIsDemoActive: (active: boolean) => void;
  triggerConfetti: () => void;
  resetToDefaultData: () => void;

  // Computed Financial Metrics
  metrics: {
    totalIncome: number;
    totalOutstanding: number;
    totalOverdue: number;
    totalDueSoon: number;
    paidInvoicesCount: number;
    pendingInvoicesCount: number;
    overdueInvoicesCount: number;
    collectionRate: number; // percentage
    averagePaymentDays: number;
    moneyAtRisk: number;
  };

  // Helper functions
  calculateOverdueDays: (dueDate: string) => number;
  getInvoiceRiskRating: (invoice: Invoice) => RiskRating;
}

const PayFlowContext = createContext<PayFlowContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'payflow_state_v1';

export const PayFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userProfile, setUserProfileState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_profile`);
    return saved ? JSON.parse(saved) : initialUserProfile;
  });

  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_clients`);
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [invoices, setInvoices] = useState<Invoice[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_invoices`);
    return saved ? JSON.parse(saved) : initialInvoices;
  });

  const [quotes, setQuotes] = useState<Quote[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_quotes`);
    return saved ? JSON.parse(saved) : initialQuotes;
  });

  const [upiTransactions, setUpiTransactions] = useState<UpiTransaction[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_upi`);
    return saved ? JSON.parse(saved) : initialUpiTransactions;
  });

  const [reminderLogs, setReminderLogs] = useState<ReminderLog[]>(() => {
    const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reminders`);
    return saved ? JSON.parse(saved) : initialReminderLogs;
  });

  const [activeModuleFilter, setActiveModuleFilter] = useState<ActiveModule>('all');
  const [demoStep, setDemoStep] = useState<number>(1);
  const [isDemoActive, setIsDemoActive] = useState<boolean>(true);

  // Sync state to local storage
  useEffect(() => {
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_profile`, JSON.stringify(userProfile));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_clients`, JSON.stringify(clients));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_invoices`, JSON.stringify(invoices));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_quotes`, JSON.stringify(quotes));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_upi`, JSON.stringify(upiTransactions));
    localStorage.setItem(`${LOCAL_STORAGE_KEY}_reminders`, JSON.stringify(reminderLogs));
  }, [userProfile, clients, invoices, quotes, upiTransactions, reminderLogs]);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#6366f1', '#f59e0b', '#3b82f6', '#ec4899'],
    });
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfileState((prev) => ({ ...prev, ...profile }));
  };

  const calculateOverdueDays = (dueDate: string): number => {
    const today = new Date('2026-08-21');
    const due = new Date(dueDate);
    const diffTime = today.getTime() - due.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const getInvoiceRiskRating = (invoice: Invoice): RiskRating => {
    if (invoice.status === 'paid') return 'low';
    const overdueDays = calculateOverdueDays(invoice.dueDate);
    if (overdueDays >= 14 || invoice.reminderCount >= 3) return 'high';
    if (overdueDays > 0 || invoice.status === 'overdue') return 'medium';
    return 'low';
  };

  // Recompute client balances
  const recalculateClientBalances = (currentInvoices: Invoice[]) => {
    setClients((prevClients) =>
      prevClients.map((client) => {
        const clientInvoices = currentInvoices.filter((inv) => inv.clientId === client.id);
        const totalBilled = clientInvoices.reduce((acc, inv) => acc + inv.total, 0);
        const totalPaid = clientInvoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
        const outstanding = totalBilled - totalPaid;

        const hasHighRisk = clientInvoices.some((inv) => getInvoiceRiskRating(inv) === 'high');
        const hasMediumRisk = clientInvoices.some((inv) => getInvoiceRiskRating(inv) === 'medium');
        const riskRating: RiskRating = hasHighRisk ? 'high' : hasMediumRisk ? 'medium' : 'low';

        const reliability = totalBilled > 0 ? Math.round((totalPaid / totalBilled) * 100) : 100;

        return {
          ...client,
          totalBilled,
          totalPaid,
          outstandingBalance: outstanding,
          riskRating,
          paymentReliabilityScore: Math.max(10, Math.min(100, reliability)),
        };
      })
    );
  };

  // Metrics computation
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalOutstanding = 0;
    let totalOverdue = 0;
    let totalDueSoon = 0;
    let paidCount = 0;
    let pendingCount = 0;
    let overdueCount = 0;
    let moneyAtRisk = 0;

    const today = new Date('2026-08-21');

    invoices.forEach((inv) => {
      totalIncome += inv.paidAmount || 0;

      if (inv.status === 'paid') {
        paidCount++;
      } else {
        const remaining = inv.total - (inv.paidAmount || 0);
        totalOutstanding += remaining;

        const due = new Date(inv.dueDate);
        const diffDays = Math.floor((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

        if (inv.status === 'overdue' || diffDays < 0) {
          overdueCount++;
          totalOverdue += remaining;
          if (getInvoiceRiskRating(inv) === 'high') {
            moneyAtRisk += remaining;
          }
        } else {
          pendingCount++;
          if (diffDays >= 0 && diffDays <= 3) {
            totalDueSoon += remaining;
          }
        }
      }
    });

    const totalBilled = totalIncome + totalOutstanding;
    const collectionRate = totalBilled > 0 ? Math.round((totalIncome / totalBilled) * 100) : 100;

    return {
      totalIncome,
      totalOutstanding,
      totalOverdue,
      totalDueSoon,
      paidInvoicesCount: paidCount,
      pendingInvoicesCount: pendingCount,
      overdueInvoicesCount: overdueCount,
      collectionRate,
      averagePaymentDays: 4.2,
      moneyAtRisk: moneyAtRisk || totalOverdue,
    };
  }, [invoices]);

  // Invoice Management
  const createInvoice = (
    invoiceData: Omit<Invoice, 'id' | 'invoiceNumber' | 'reminderCount' | 'deliveryStatus'>
  ): Invoice => {
    const nextNum = invoices.length + 1020;
    const newInvoice: Invoice = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      invoiceNumber: `#INV-${nextNum}`,
      reminderCount: 0,
      deliveryStatus: 'draft',
      paidAmount: invoiceData.paidAmount || 0,
    };

    const updated = [newInvoice, ...invoices];
    setInvoices(updated);
    recalculateClientBalances(updated);
    return newInvoice;
  };

  const updateInvoice = (id: string, updates: Partial<Invoice>) => {
    const updated = invoices.map((inv) => (inv.id === id ? { ...inv, ...updates } : inv));
    setInvoices(updated);
    recalculateClientBalances(updated);
  };

  const deleteInvoice = (id: string) => {
    const updated = invoices.filter((inv) => inv.id !== id);
    setInvoices(updated);
    recalculateClientBalances(updated);
  };

  const duplicateInvoice = (id: string): Invoice => {
    const target = invoices.find((inv) => inv.id === id);
    if (!target) throw new Error('Invoice not found');

    const nextNum = invoices.length + 1025;
    const duplicated: Invoice = {
      ...target,
      id: `inv-${Date.now()}`,
      invoiceNumber: `#INV-${nextNum}`,
      issueDate: '2026-08-21',
      dueDate: '2026-08-28',
      status: 'draft',
      paidAmount: 0,
      paidAt: undefined,
      paymentMethod: undefined,
      paymentNotes: undefined,
      reminderCount: 0,
      deliveryStatus: 'draft',
    };

    const updated = [duplicated, ...invoices];
    setInvoices(updated);
    recalculateClientBalances(updated);
    return duplicated;
  };

  const markAsPaid = (
    id: string,
    paymentMethod: Invoice['paymentMethod'] = 'UPI',
    paymentNotes: string = 'Payment settled',
    paidAmount?: number
  ) => {
    const target = invoices.find((inv) => inv.id === id);
    if (!target) return;

    const amount = paidAmount !== undefined ? paidAmount : target.total;
    const isFullPayment = amount >= target.total;

    const updated = invoices.map((inv) => {
      if (inv.id === id) {
        return {
          ...inv,
          status: isFullPayment ? ('paid' as const) : ('partial' as const),
          paidAmount: amount,
          paymentMethod,
          paymentNotes,
          paidAt: '2026-08-21 11:30',
          deliveryStatus: 'paid' as const,
        };
      }
      return inv;
    });

    setInvoices(updated);
    recalculateClientBalances(updated);
    triggerConfetti();
  };

  const toggleInvoiceOverdue = (id: string) => {
    const updated = invoices.map((inv) => {
      if (inv.id === id) {
        const nextStatus = inv.status === 'overdue' ? 'pending' : 'overdue';
        const nextDueDate = nextStatus === 'overdue' ? '2026-08-05' : '2026-08-26';
        return {
          ...inv,
          status: nextStatus as Invoice['status'],
          dueDate: nextDueDate,
        };
      }
      return inv;
    });

    setInvoices(updated);
    recalculateClientBalances(updated);
  };

  // Client Management
  const addClient = (
    clientData: Omit<
      Client,
      | 'id'
      | 'createdAt'
      | 'totalBilled'
      | 'totalPaid'
      | 'outstandingBalance'
      | 'riskRating'
      | 'paymentReliabilityScore'
    >
  ): Client => {
    const newClient: Client = {
      ...clientData,
      id: `cli-${Date.now()}`,
      totalBilled: 0,
      totalPaid: 0,
      outstandingBalance: 0,
      riskRating: 'low',
      paymentReliabilityScore: 100,
      createdAt: '2026-08-21',
    };
    setClients((prev) => [newClient, ...prev]);
    return newClient;
  };

  const updateClient = (id: string, updates: Partial<Client>) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  };

  const deleteClient = (id: string) => {
    setClients((prev) => prev.filter((c) => c.id !== id));
  };

  // Quotes Management
  const createQuote = (quoteData: Omit<Quote, 'id' | 'quoteNumber' | 'createdAt'>): Quote => {
    const nextNum = quotes.length + 505;
    const newQuote: Quote = {
      ...quoteData,
      id: `qt-${Date.now()}`,
      quoteNumber: `#QT-${nextNum}`,
      createdAt: '2026-08-21',
    };
    setQuotes((prev) => [newQuote, ...prev]);
    return newQuote;
  };

  const updateQuote = (id: string, updates: Partial<Quote>) => {
    setQuotes((prev) => prev.map((q) => (q.id === id ? { ...q, ...updates } : q)));
  };

  const deleteQuote = (id: string) => {
    setQuotes((prev) => prev.filter((q) => q.id !== id));
  };

  const convertQuoteToInvoice = (quoteId: string): Invoice => {
    const quote = quotes.find((q) => q.id === quoteId);
    if (!quote) throw new Error('Quote not found');

    const created = createInvoice({
      clientId: quote.clientId || `cli-temp`,
      clientName: quote.clientName,
      clientPhone: quote.clientPhone,
      clientEmail: quote.clientEmail,
      issueDate: '2026-08-21',
      dueDate: '2026-08-28',
      items: quote.items,
      subtotal: quote.subtotal,
      discountTotal: quote.discountTotal,
      taxTotal: quote.taxTotal,
      total: quote.total,
      paidAmount: 0,
      status: 'pending',
      quoteIdRef: quote.quoteNumber,
      theme: 'modern',
      serviceCategory: quote.serviceCategory,
      notes: `Generated from accepted quotation ${quote.quoteNumber}.`,
      termsAndConditions: quote.terms.join('\n'),
    });

    updateQuote(quoteId, { status: 'converted', convertedInvoiceId: created.invoiceNumber });
    return created;
  };

  // Reminders Management
  const sendReminder = (
    invoiceId: string,
    channel: DeliveryChannel,
    tone: 'polite' | 'friendly' | 'firm' | 'urgent',
    customMessage?: string
  ): ReminderLog => {
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!invoice) throw new Error('Invoice not found');

    const newLog: ReminderLog = {
      id: `rem-${Date.now()}`,
      invoiceId: invoice.id,
      invoiceNumber: invoice.invoiceNumber,
      clientId: invoice.clientId,
      clientName: invoice.clientName,
      clientPhone: invoice.clientPhone,
      timestamp: '2026-08-21 11:35',
      channel,
      tone,
      content: customMessage || `Reminder for ${invoice.invoiceNumber} (₹${invoice.total.toLocaleString('en-IN')}) sent to ${invoice.clientName}`,
      deliveryStatus: 'delivered',
    };

    setReminderLogs((prev) => [newLog, ...prev]);

    updateInvoice(invoiceId, {
      reminderCount: invoice.reminderCount + 1,
      lastReminderSentAt: '2026-08-21 11:35',
      deliveryStatus: 'delivered',
    });

    return newLog;
  };

  const batchRemindOverdue = (): number => {
    const overdueInvoices = invoices.filter((inv) => inv.status === 'overdue');
    overdueInvoices.forEach((inv) => {
      sendReminder(inv.id, 'whatsapp', 'firm', `Automated batch reminder for overdue ${inv.invoiceNumber}`);
    });
    return overdueInvoices.length;
  };

  // UPI Reconciliation Management
  const reconcileTransaction = (transactionId: string, invoiceId: string) => {
    const transaction = upiTransactions.find((t) => t.id === transactionId);
    const invoice = invoices.find((inv) => inv.id === invoiceId);
    if (!transaction || !invoice) return;

    // Update transaction
    setUpiTransactions((prev) =>
      prev.map((t) =>
        t.id === transactionId
          ? {
              ...t,
              status: 'reconciled',
              matchedInvoiceId: invoice.id,
              matchScore: 100,
              matchReason: `Reconciled with ${invoice.invoiceNumber}`,
            }
          : t
      )
    );

    // Mark invoice as paid
    markAsPaid(
      invoice.id,
      'UPI',
      `Reconciled from UPI transaction (UTR: ${transaction.utrNumber}) from ${transaction.payerName}`
    );
  };

  const autoReconcileAll = (): number => {
    let count = 0;
    upiTransactions
      .filter((t) => t.status === 'unreconciled' && t.matchedInvoiceId && (t.matchScore || 0) >= 80)
      .forEach((t) => {
        if (t.matchedInvoiceId) {
          reconcileTransaction(t.id, t.matchedInvoiceId);
          count++;
        }
      });
    return count;
  };

  const importUpiTransactions = (transactions: UpiTransaction[]) => {
    setUpiTransactions((prev) => [...transactions, ...prev]);
  };

  // Reset to default seed data
  const resetToDefaultData = () => {
    setUserProfileState(initialUserProfile);
    setClients(initialClients);
    setInvoices(initialInvoices);
    setQuotes(initialQuotes);
    setUpiTransactions(initialUpiTransactions);
    setReminderLogs(initialReminderLogs);
    setDemoStep(1);
    setIsDemoActive(true);

    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_profile`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_clients`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_invoices`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_quotes`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_upi`);
    localStorage.removeItem(`${LOCAL_STORAGE_KEY}_reminders`);
  };

  return (
    <PayFlowContext.Provider
      value={{
        userProfile,
        updateUserProfile,
        clients,
        addClient,
        updateClient,
        deleteClient,
        invoices,
        createInvoice,
        updateInvoice,
        deleteInvoice,
        duplicateInvoice,
        markAsPaid,
        toggleInvoiceOverdue,
        quotes,
        createQuote,
        updateQuote,
        deleteQuote,
        convertQuoteToInvoice,
        upiTransactions,
        reconcileTransaction,
        autoReconcileAll,
        importUpiTransactions,
        reminderLogs,
        sendReminder,
        batchRemindOverdue,
        activeModuleFilter,
        setActiveModuleFilter,
        demoStep,
        setDemoStep,
        isDemoActive,
        setIsDemoActive,
        triggerConfetti,
        resetToDefaultData,
        metrics,
        calculateOverdueDays,
        getInvoiceRiskRating,
      }}
    >
      {children}
    </PayFlowContext.Provider>
  );
};

export const usePayFlow = () => {
  const context = useContext(PayFlowContext);
  if (!context) {
    throw new Error('usePayFlow must be used within a PayFlowProvider');
  }
  return context;
};
