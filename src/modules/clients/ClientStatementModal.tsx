import React from 'react';
import type { Client } from '../../types';
import { usePayFlow } from '../../context/PayFlowContext';
import { X, Printer, Download, User, Calendar, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface ClientStatementModalProps {
  client: Client;
  onClose: () => void;
}

export const ClientStatementModal: React.FC<ClientStatementModalProps> = ({ client, onClose }) => {
  const { invoices, userProfile } = usePayFlow();

  const clientInvoices = invoices.filter((i) => i.clientId === client.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white transition-colors my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-900 to-slate-900 px-6 py-4 text-white flex items-center justify-between no-print">
          <div>
            <h3 className="font-bold text-base">Client Account Statement</h3>
            <p className="text-xs text-teal-200">{client.name} • {client.professionOrCompany}</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => window.print()}
              className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white text-xs"
              title="Print Statement"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Header info */}
          <div className="flex flex-col sm:flex-row justify-between pb-4 border-b border-slate-200">
            <div>
              <h4 className="font-bold text-slate-900 text-sm">{userProfile.businessName}</h4>
              <p className="text-xs text-slate-500">{userProfile.phone} • {userProfile.email}</p>
              <p className="text-xs text-slate-500">UPI: {userProfile.upiId}</p>
            </div>
            <div className="mt-2 sm:mt-0 sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Statement Period</span>
              <span className="text-xs font-semibold text-slate-800">Lifetime Ledger (As of 21 Aug 2026)</span>
            </div>
          </div>

          {/* Client summary metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Invoiced</span>
              <span className="text-base font-black font-mono text-slate-900">
                {formatCurrency(client.totalBilled)}
              </span>
            </div>
            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Total Paid</span>
              <span className="text-base font-black font-mono text-emerald-900">
                {formatCurrency(client.totalPaid)}
              </span>
            </div>
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-200 text-center">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Balance Due</span>
              <span className="text-base font-black font-mono text-amber-900">
                {formatCurrency(client.outstandingBalance)}
              </span>
            </div>
          </div>

          {/* Invoices Ledger Table */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Transaction History ({clientInvoices.length})
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Invoice #</th>
                    <th className="py-2.5 px-3 text-right">Amount</th>
                    <th className="py-2.5 px-3 text-right">Paid</th>
                    <th className="py-2.5 px-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clientInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">
                        No transactions recorded for this client.
                      </td>
                    </tr>
                  ) : (
                    clientInvoices.map((inv) => (
                      <tr key={inv.id}>
                        <td className="py-2.5 px-3 text-slate-600">{formatDate(inv.issueDate)}</td>
                        <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono font-semibold text-slate-900">
                          {formatCurrency(inv.total)}
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-semibold">
                          {formatCurrency(inv.paidAmount || 0)}
                        </td>
                        <td className="py-2.5 px-3 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                              inv.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.status === 'overdue'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end no-print">
          <button
            onClick={onClose}
            className="px-4 py-1.5 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 text-xs font-semibold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
