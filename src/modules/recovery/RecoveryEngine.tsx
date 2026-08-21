import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import type { Invoice } from '../../types';
import {
  BellRing,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Share2,
  Calendar,
  Zap,
  TrendingDown,
  ShieldAlert,
  Send,
  RotateCcw,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { SmartReminderModal } from './SmartReminderModal';
import { MarkAsPaidModal } from './MarkAsPaidModal';
import { ReminderTimeline } from './ReminderTimeline';

export const RecoveryEngine: React.FC = () => {
  const {
    invoices,
    metrics,
    batchRemindOverdue,
    calculateOverdueDays,
    getInvoiceRiskRating,
    toggleInvoiceOverdue,
  } = usePayFlow();

  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);
  const [batchMessage, setBatchMessage] = useState<string | null>(null);

  const pendingAndOverdueInvoices = invoices.filter((i) => i.status !== 'paid');

  const handleBatchChaser = () => {
    const count = batchRemindOverdue();
    setBatchMessage(`Successfully dispatched ${count} automated reminders across WhatsApp & SMS!`);
    setTimeout(() => setBatchMessage(null), 4000);
  };

  // Aging calculation
  const agingBuckets = {
    lessThan7: invoices.filter((i) => i.status === 'overdue' && calculateOverdueDays(i.dueDate) <= 7),
    between7And14: invoices.filter(
      (i) => i.status === 'overdue' && calculateOverdueDays(i.dueDate) > 7 && calculateOverdueDays(i.dueDate) <= 14
    ),
    moreThan14: invoices.filter((i) => i.status === 'overdue' && calculateOverdueDays(i.dueDate) > 14),
  };

  return (
    <div className="space-y-6">
      {/* Standalone Module Header */}
      <div className="bg-gradient-to-r from-amber-800 to-orange-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-200 border border-amber-400/30">
                Standalone Module B
              </span>
              <span className="text-xs text-amber-200 font-mono">Monetization: ₹249/mo</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              "Get Paid" Payment Recovery Engine
            </h1>
            <p className="text-xs text-amber-100 mt-1 max-w-xl">
              Automated overdue detection, multi-tone escalation schedules, and 1-click WhatsApp payment recovery.
            </p>
          </div>

          <button
            onClick={handleBatchChaser}
            disabled={metrics.overdueInvoicesCount === 0}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed self-start sm:self-auto"
          >
            <Zap className="w-4 h-4 fill-slate-950" />
            <span>⚡ Remind All Overdue ({metrics.overdueInvoicesCount})</span>
          </button>
        </div>

        {batchMessage && (
          <div className="mt-4 p-2 bg-amber-500/30 border border-amber-300/40 rounded-xl text-xs text-amber-100 flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>{batchMessage}</span>
          </div>
        )}
      </div>

      {/* "Money You Could Be Missing" Hero Metric Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl p-5 text-white shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-red-100">
              Money You Could Be Missing
            </span>
            <AlertTriangle className="w-5 h-5 text-red-200" />
          </div>
          <div className="text-3xl font-black font-mono tracking-tight mb-2">
            {formatCurrency(metrics.totalOverdue)}
          </div>
          <p className="text-xs text-red-100">
            {metrics.overdueInvoicesCount} overdue invoices requiring immediate chaser action.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Outstanding
            </span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black font-mono text-slate-900 dark:text-white mb-1">
            {formatCurrency(metrics.totalOutstanding)}
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-1">
            <span>Due in next 3 days:</span>
            <strong className="text-amber-600 dark:text-amber-400 font-mono">{formatCurrency(metrics.totalDueSoon)}</strong>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Collection Efficiency
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div className="text-2xl font-black font-mono text-emerald-600 dark:text-emerald-400 mb-1">
            {metrics.collectionRate}%
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Avg settlement time: <strong className="text-slate-800 dark:text-slate-200 font-mono">4.2 days</strong>
          </div>
        </div>
      </div>

      {/* Automated Escalation Schedule Info */}
      <div className="bg-slate-900 dark:bg-slate-900/90 text-white rounded-2xl p-5 shadow-sm border border-transparent dark:border-slate-800">
        <div className="flex items-center space-x-2 mb-3">
          <ShieldAlert className="w-4 h-4 text-amber-400" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-amber-300">
            Smart Escalation Engine Schedule
          </h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[10px] text-emerald-400 font-bold">Stage 1: Pre-Due</div>
            <div className="font-semibold mt-0.5">3 Days Before</div>
            <div className="text-[11px] text-slate-400 mt-1">Polite WhatsApp heads-up with UPI link.</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[10px] text-amber-400 font-bold">Stage 2: Due Date</div>
            <div className="font-semibold mt-0.5">On Due Date</div>
            <div className="text-[11px] text-slate-400 mt-1">Friendly reminder with 1-click pay link.</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[10px] text-orange-400 font-bold">Stage 3: Overdue</div>
            <div className="font-semibold mt-0.5">3-7 Days Overdue</div>
            <div className="text-[11px] text-slate-400 mt-1">Firm follow-up with past-due notification.</div>
          </div>

          <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700">
            <div className="text-[10px] text-red-400 font-bold">Stage 4: Critical</div>
            <div className="font-semibold mt-0.5">14+ Days Overdue</div>
            <div className="text-[11px] text-slate-400 mt-1">Urgent final notice before service halt.</div>
          </div>
        </div>
      </div>

      {/* Receivables Chasing List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BellRing className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Active Receivables ({pendingAndOverdueInvoices.length})
            </h3>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400">Sorted by payment urgency & risk</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-center">Overdue Days</th>
                <th className="py-3 px-4 text-center">Risk Level</th>
                <th className="py-3 px-4 text-right">Outstanding (INR)</th>
                <th className="py-3 px-4 text-center">Reminders Sent</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {pendingAndOverdueInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 dark:text-slate-500">
                    🎉 Fantastic! Zero pending or overdue invoices right now.
                  </td>
                </tr>
              ) : (
                pendingAndOverdueInvoices.map((inv) => {
                  const overdueDays = calculateOverdueDays(inv.dueDate);
                  const risk = getInvoiceRiskRating(inv);

                  return (
                    <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                        {inv.invoiceNumber}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-800 dark:text-slate-200">{inv.clientName}</div>
                        <div className="text-[11px] text-slate-400 dark:text-slate-500">{inv.clientPhone}</div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                        <span className={overdueDays > 0 ? 'text-red-600 dark:text-red-400 font-semibold' : ''}>
                          {formatDate(inv.dueDate)}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        {overdueDays > 0 ? (
                          <span className="font-bold text-red-600 dark:text-red-400 font-mono">+{overdueDays} days</span>
                        ) : (
                          <span className="text-slate-400 dark:text-slate-500 font-mono">On Time</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            risk === 'high'
                              ? 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                              : risk === 'medium'
                              ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                              : 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          }`}
                        >
                          <span>{risk === 'high' ? '🔴 High' : risk === 'medium' ? '🟡 Medium' : '🟢 Low'}</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900 dark:text-white">
                        {formatCurrency(inv.total - (inv.paidAmount || 0))}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono text-[11px] font-bold">
                          {inv.reminderCount} sent
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right space-x-2 whitespace-nowrap">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs shadow-sm transition-all inline-flex items-center space-x-1"
                        >
                          <Send className="w-3 h-3" />
                          <span>Remind</span>
                        </button>

                        <button
                          onClick={() => setPayingInvoice(inv)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Mark Paid</span>
                        </button>

                        <button
                          onClick={() => toggleInvoiceOverdue(inv.id)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                          title="Toggle Overdue State"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reminder Audit Trail */}
      <ReminderTimeline />

      {/* Modals */}
      {selectedInvoice && (
        <SmartReminderModal
          invoice={selectedInvoice}
          onClose={() => setSelectedInvoice(null)}
        />
      )}

      {payingInvoice && (
        <MarkAsPaidModal
          invoice={payingInvoice}
          onClose={() => setPayingInvoice(null)}
        />
      )}
    </div>
  );
};
