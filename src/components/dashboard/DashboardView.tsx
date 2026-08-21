import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import type { ActiveModule, Invoice } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Plus,
  Bell,
  Sparkles,
  ArrowRight,
  Eye,
  Send,
  Check,
} from 'lucide-react';
import { InvoicePreviewModal } from '../../modules/invoicing/InvoicePreviewModal';
import { SmartReminderModal } from '../../modules/recovery/SmartReminderModal';

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
    markAsPaid,
    batchRemindOverdue,
    t,
  } = usePayFlow();

  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [remindInvoice, setRemindInvoice] = useState<Invoice | null>(null);
  const [batchNotice, setBatchNotice] = useState<string | null>(null);

  const handleBatchRemind = () => {
    const count = batchRemindOverdue();
    setBatchNotice(`Dispatched WhatsApp reminders for ${count} overdue bills!`);
    setTimeout(() => setBatchNotice(null), 4000);
  };

  const priorityOverdue = invoices.filter((i) => i.status === 'overdue');
  const recentInvoices = invoices.slice(0, 5);

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Clean Welcome Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-xs font-semibold mb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Business Overview • {userProfile.businessName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, {userProfile.name} 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Here is your simple financial summary for today.
            </p>
          </div>

          {/* Primary Quick Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenInvoiceModal}
              className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-sm transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>{t('createBill')}</span>
            </button>

            <button
              onClick={onOpenQuoteModal}
              className="flex items-center space-x-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs sm:text-sm transition-all"
            >
              <Sparkles className="w-4 h-4 text-indigo-500" />
              <span>{t('rateList')}</span>
            </button>
          </div>
        </div>

        {/* 4 Clean Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          {/* Total Income */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">
              <span>{t('totalIncome')}</span>
              <DollarSign className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">
              {formatCurrency(metrics.totalIncome)}
            </div>
            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              100% Direct UPI Collected
            </div>
          </div>

          {/* Total Outstanding */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">
              <span>{t('outstandingBalance')}</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-amber-600 dark:text-amber-400">
              {formatCurrency(metrics.totalOutstanding)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              {metrics.pendingInvoicesCount + metrics.overdueInvoicesCount} Open Bills
            </div>
          </div>

          {/* Overdue Amount */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">
              <span>{t('overdueAmount')}</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-red-600 dark:text-red-400">
              {formatCurrency(metrics.totalOverdue)}
            </div>
            <div className="text-[11px] text-red-600 dark:text-red-400 mt-1 font-medium">
              {metrics.overdueInvoicesCount} Urgent Reminders
            </div>
          </div>

          {/* Due Soon */}
          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200/60 dark:border-slate-700/50">
            <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1 font-semibold">
              <span>{t('dueSoon')}</span>
              <CheckCircle2 className="w-4 h-4 text-cyan-500" />
            </div>
            <div className="text-2xl font-bold font-mono text-cyan-600 dark:text-cyan-400">
              {formatCurrency(metrics.totalDueSoon)}
            </div>
            <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">
              Upcoming Payments
            </div>
          </div>
        </div>
      </div>

      {/* Batch Notice Notification */}
      {batchNotice && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs font-semibold flex items-center justify-between">
          <span>{batchNotice}</span>
          <Check className="w-4 h-4 text-emerald-600" />
        </div>
      )}

      {/* Priority Udhaar Overdue Alert Section */}
      {metrics.overdueInvoicesCount > 0 && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-2xl p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center space-x-2 text-red-700 dark:text-red-400 font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Overdue Payments Need WhatsApp Reminder ({metrics.overdueInvoicesCount})</span>
              </div>
              <p className="text-xs text-red-600 dark:text-red-300/80 mt-0.5">
                Send 1-click WhatsApp chasers to collect pending payments faster.
              </p>
            </div>

            <button
              onClick={handleBatchRemind}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl text-xs transition-all shadow-sm shrink-0"
            >
              <Bell className="w-4 h-4" />
              <span>Remind All Overdue Clients</span>
            </button>
          </div>

          <div className="space-y-2">
            {priorityOverdue.map((inv) => (
              <div
                key={inv.id}
                className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-red-100 dark:border-red-950 flex items-center justify-between text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 dark:text-white block">{inv.clientName}</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">
                    Bill {inv.invoiceNumber} • Due Date: {inv.dueDate}
                  </span>
                </div>

                <div className="flex items-center space-x-3">
                  <span className="font-mono font-bold text-red-600 dark:text-red-400 text-sm">
                    {formatCurrency(inv.total - (inv.paidAmount || 0))}
                  </span>
                  <button
                    onClick={() => setRemindInvoice(inv)}
                    className="flex items-center space-x-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[11px]"
                  >
                    <Send className="w-3 h-3" />
                    <span>WhatsApp</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Invoices Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Recent Bills & Invoices</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Quick status of your latest billing entries</p>
          </div>

          <button
            onClick={() => onNavigateTab('invoicing')}
            className="flex items-center space-x-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline"
          >
            <span>View All Bills</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                <th className="pb-3">Bill No.</th>
                <th className="pb-3">Client</th>
                <th className="pb-3">Amount</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {recentInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 font-mono font-semibold text-slate-900 dark:text-white">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 font-medium text-slate-800 dark:text-slate-200">
                    {inv.clientName}
                  </td>
                  <td className="py-3 font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrency(inv.total)}
                  </td>
                  <td className="py-3">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        inv.status === 'paid'
                          ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                          : inv.status === 'overdue'
                          ? 'bg-red-100 dark:bg-red-950 text-red-700 dark:text-red-300'
                          : 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </td>
                  <td className="py-3 text-right space-x-2">
                    <button
                      onClick={() => setPreviewInvoice(inv)}
                      className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
                      title="View Bill PDF"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    {inv.status !== 'paid' && (
                      <button
                        onClick={() => markAsPaid(inv.id, 'upi')}
                        className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded-lg text-[10px]"
                      >
                        Mark Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {previewInvoice && (
        <InvoicePreviewModal
          invoice={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
          onMarkPaid={(id) => markAsPaid(id, 'upi')}
        />
      )}

      {remindInvoice && (
        <SmartReminderModal
          invoice={remindInvoice}
          onClose={() => setRemindInvoice(null)}
        />
      )}
    </div>
  );
};
