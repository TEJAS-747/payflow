import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import type { ActiveModule, Invoice } from '../../types';
import {
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Plus,
  Sparkles,
  Zap,
  CreditCard,
  Users,
  Send,
  ArrowRight,
  ShieldCheck,
  FileText,
  Activity,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { VisualCharts } from '../../modules/intelligence/VisualCharts';
import { InvoicePreviewModal } from '../../modules/invoicing/InvoicePreviewModal';
import { SmartReminderModal } from '../../modules/recovery/SmartReminderModal';
import { MarkAsPaidModal } from '../../modules/recovery/MarkAsPaidModal';

interface DashboardViewProps {
  onNavigateTab: (tab: ActiveModule) => void;
  onOpenInvoiceModal: () => void;
  onOpenQuoteModal: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateTab,
  onOpenInvoiceModal,
  onOpenQuoteModal,
}) => {
  const {
    userProfile,
    metrics,
    invoices,
    clients,
    reminderLogs,
    batchRemindOverdue,
    calculateOverdueDays,
    getInvoiceRiskRating,
    t,
  } = usePayFlow();

  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [remindInvoice, setRemindInvoice] = useState<Invoice | null>(null);
  const [payInvoice, setPayInvoice] = useState<Invoice | null>(null);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  const handleBatchRemind = () => {
    const count = batchRemindOverdue();
    setBatchNotice(`Dispatched smart WhatsApp reminders to ${count} overdue clients!`);
    setTimeout(() => setBatchNotice(null), 4000);
  };

  const priorityOverdue = invoices.filter((i) => i.status === 'overdue');
  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center space-x-2.5 mb-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span>Live PayFlow Hub</span>
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {userProfile.businessName} • {userProfile.city}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Good morning, {userProfile.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
              WhatsApp simplicity + Razorpay payments + Zoho invoicing — built for your independent craft.
            </p>
          </div>

          {/* Quick Action Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenInvoiceModal}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-glow-green transition-all hover:scale-102"
            >
              <Plus className="w-4 h-4" />
              <span>{t('createBill')}</span>
            </button>

            <button
              onClick={onOpenQuoteModal}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-md transition-all hover:scale-102"
            >
              <Sparkles className="w-4 h-4 text-indigo-200" />
              <span>{t('rateList')}</span>
            </button>

            <button
              onClick={() => onNavigateTab('reconciliation')}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold border border-slate-700 transition-all"
            >
              <CreditCard className="w-4 h-4 text-rose-400" />
              <span>{t('upiMatch')}</span>
            </button>
          </div>
        </div>

        {/* 4 Primary Hero KPI Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800/80">
          {/* 1. Total Income */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-semibold">
              <span>{t('totalIncome')}</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400">
              {formatCurrency(metrics.totalIncome)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center space-x-1">
              <span className="text-emerald-400 font-bold">100% Direct UPI</span>
              <span>• ₹0 gateway charges</span>
            </div>
          </div>

          {/* 2. Total Outstanding */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-semibold">
              <span>{t('outstandingBalance')}</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black font-mono text-amber-300">
              {formatCurrency(metrics.totalOutstanding)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Across {metrics.pendingInvoicesCount + metrics.overdueInvoicesCount} open bills
            </div>
          </div>

          {/* 3. Overdue Amount */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-semibold">
              <span>{t('overdueAmount')}</span>
              <AlertTriangle className="w-4 h-4 text-red-400" />
            </div>
            <div className="text-2xl font-black font-mono text-red-400">
              {formatCurrency(metrics.totalOverdue)}
            </div>
            <div className="text-[11px] text-red-300 mt-1 font-semibold">
              {metrics.overdueInvoicesCount} bills need reminder
            </div>
          </div>

          {/* 4. Due Soon */}
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-2xl border border-slate-700/60">
            <div className="flex items-center justify-between text-slate-400 text-xs mb-1 font-semibold">
              <span>{t('dueSoon')}</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div className="text-2xl font-black font-mono text-cyan-300">
              {formatCurrency(metrics.totalDueSoon)}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Auto WhatsApp ready
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Overdue Alert Banner (If Overdue Invoices Exist) */}
      {metrics.overdueInvoicesCount > 0 && (
        <div className="bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm">
                Dhyan Dein: {formatCurrency(metrics.totalOverdue)} udhaar overdue hai!
              </h4>
              <p className="text-xs text-red-100 mt-0.5">
                {metrics.overdueInvoicesCount} bill overdue hain. 1-Click WhatsApp reminder (तकादा) bhej kar paisa vasool karein.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleBatchRemind}
              className="px-4 py-2 bg-white text-red-700 hover:bg-red-50 font-bold rounded-xl text-xs shadow-sm transition-all whitespace-nowrap"
            >
              ⚡ All Udhaar Reminders Bhejo
            </button>
            <button
              onClick={() => onNavigateTab('recovery')}
              className="px-3 py-2 bg-red-700/60 hover:bg-red-700 text-white font-semibold rounded-xl text-xs transition-colors whitespace-nowrap"
            >
              View Receivables →
            </button>
          </div>
        </div>
      )}

      {batchNotice && (
        <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-200" />
          <span>{batchNotice}</span>
        </div>
      )}

      {/* Visual Charts Overview */}
      <VisualCharts />

      {/* Recent Invoices & Live Activity Feed Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Recent Invoices */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Recent Invoices ({invoices.length})
              </h3>
            </div>
            <button
              onClick={() => onNavigateTab('invoicing')}
              className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold flex items-center space-x-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {recentInvoices.map((inv) => (
              <div
                key={inv.id}
                className="py-3 flex items-center justify-between hover:bg-slate-50/60 dark:hover:bg-slate-800/60 rounded-xl px-2 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs ${
                      inv.status === 'paid'
                        ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300'
                        : inv.status === 'overdue'
                        ? 'bg-red-100 dark:bg-red-950 text-red-800 dark:text-red-300'
                        : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                    }`}
                  >
                    {inv.clientName.charAt(0)}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-slate-900 dark:text-white">{inv.clientName}</span>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">{inv.invoiceNumber}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 dark:text-slate-500">Due: {formatDate(inv.dueDate)}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-mono font-black text-xs text-slate-900 dark:text-white">
                    {formatCurrency(inv.total)}
                  </span>
                  <button
                    onClick={() => setPreviewInvoice(inv)}
                    className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-xs"
                    title="Preview Invoice"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Live Activity Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex items-center space-x-2 mb-4 pb-2 border-b border-slate-100 dark:border-slate-800">
              <Activity className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
                Live Activity Feed
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-start space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">Payment of ₹15,000 settled</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Priya Patel via Google Pay UPI • 15 Aug</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">WhatsApp Chaser Delivered</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Invoice #INV-1024 to Rahul Sharma • 20 Aug</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-red-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">Overdue Flag Triggered</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">Invoice #INV-1019 (Vikram Verma) 16 days late</p>
                </div>
              </div>

              <div className="flex items-start space-x-2.5">
                <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1.5 shrink-0" />
                <div>
                  <p className="text-slate-800 dark:text-slate-200 font-semibold">AI Quote Generated</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">#QT-501 for ₹10,000 (React Native Prototype)</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => onNavigateTab('intelligence')}
              className="w-full py-2 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/50 font-bold text-xs transition-colors flex items-center justify-center space-x-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ask PayFlow Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      {previewInvoice && (
        <InvoicePreviewModal
          invoice={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
        />
      )}

      {remindInvoice && (
        <SmartReminderModal
          invoice={remindInvoice}
          onClose={() => setRemindInvoice(null)}
        />
      )}

      {payInvoice && (
        <MarkAsPaidModal
          invoice={payInvoice}
          onClose={() => setPayInvoice(null)}
        />
      )}
    </div>
  );
};
