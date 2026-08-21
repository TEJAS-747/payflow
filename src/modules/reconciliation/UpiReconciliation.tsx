import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import type { UpiTransaction } from '../../types';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Zap,
  Upload,
  RefreshCw,
  Search,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

export const UpiReconciliation: React.FC = () => {
  const {
    upiTransactions,
    invoices,
    reconcileTransaction,
    autoReconcileAll,
    importUpiTransactions,
  } = usePayFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [reconciledNotice, setReconciledNotice] = useState<string | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const filteredTransactions = upiTransactions.filter(
    (t) =>
      t.payerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.utrNumber.includes(searchQuery) ||
      t.rawRemark.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const unreconciledCount = upiTransactions.filter((t) => t.status === 'unreconciled').length;
  const highConfidenceCount = upiTransactions.filter(
    (t) => t.status === 'unreconciled' && (t.matchScore || 0) >= 80
  ).length;

  const handleReconcile = (tId: string, invId: string) => {
    reconcileTransaction(tId, invId);
    setReconciledNotice('Transaction reconciled! Invoice marked as PAID and ledger updated.');
    setTimeout(() => setReconciledNotice(null), 4000);
  };

  const handleAutoReconcile = () => {
    const count = autoReconcileAll();
    setReconciledNotice(`Automatically reconciled ${count} high-confidence UPI payments!`);
    setTimeout(() => setReconciledNotice(null), 4000);
  };

  const handleAddSampleCsv = () => {
    const newTx: UpiTransaction = {
      id: `upi-${Date.now()}`,
      utrNumber: `62399${Math.floor(1000000 + Math.random() * 9000000)}`,
      payerName: 'VIKRAM VERMA',
      payerUpiId: 'vikram.urban@icici',
      amount: 6500,
      date: '2026-08-21',
      time: '11:45 AM',
      rawRemark: 'UPI/VIKRAM VERMA/INV-1019 OVERDUE SETTLEMENT',
      status: 'unreconciled',
      matchedInvoiceId: 'inv-1019',
      matchScore: 99,
      matchReason: 'Exact Amount (₹6,500) + Payer Name + INV-1019 in remark',
    };
    importUpiTransactions([newTx]);
    setIsImportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Standalone Extension Header */}
      <div className="bg-gradient-to-r from-rose-900 via-slate-900 to-pink-950 rounded-2xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-rose-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-rose-400/20 text-rose-200 border border-rose-400/30">
                UPI Bank Match
              </span>
              <span className="text-xs text-rose-200 font-mono">Extension 3</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              UPI Payment Auto-Match (बैंक से हिसाब मिलाओ)
            </h1>
            <p className="text-xs text-rose-200 mt-1 max-w-xl">
              PhonePe, GPay, Paytm aur Bank statement se aane wale UPI payments ko open bills se 1-click mein milayein.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2.5 bg-rose-500/30 hover:bg-rose-500/40 text-rose-100 border border-rose-400/40 rounded-xl text-xs font-semibold transition-all"
            >
              <Upload className="w-4 h-4" />
              <span>Import CSV / बैंक स्टेटमेंट</span>
            </button>

            <button
              onClick={handleAutoReconcile}
              disabled={highConfidenceCount === 0}
              className="flex items-center space-x-1.5 px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Zap className="w-4 h-4 fill-slate-950" />
              <span>⚡ Auto-Match Hisaab ({highConfidenceCount})</span>
            </button>
          </div>
        </div>

        {reconciledNotice && (
          <div className="mt-4 p-2.5 bg-emerald-500/30 border border-emerald-300/40 rounded-xl text-xs text-emerald-100 flex items-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-300" />
            <span>{reconciledNotice}</span>
          </div>
        )}
      </div>

      {/* Reconciliation Feed Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 text-rose-600 dark:text-rose-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200">
              Incoming UPI Transactions ({upiTransactions.length})
            </h3>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by UTR, payer, remark..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg outline-none focus:ring-2 focus:ring-rose-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">UTR & Date</th>
                <th className="py-3 px-4">Payer & UPI VPA</th>
                <th className="py-3 px-4 text-right">Amount Received</th>
                <th className="py-3 px-4">Matched Invoice</th>
                <th className="py-3 px-4 text-center">Confidence</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredTransactions.map((tx) => {
                const matchedInv = invoices.find((i) => i.id === tx.matchedInvoiceId);

                return (
                  <tr key={tx.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-slate-900 dark:text-white">{tx.utrNumber}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">
                        {formatDate(tx.date)} • {tx.time}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{tx.payerName}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{tx.payerUpiId}</div>
                      <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-xs font-mono mt-0.5">
                        "{tx.rawRemark}"
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 dark:text-white text-sm">
                      {formatCurrency(tx.amount)}
                    </td>

                    <td className="py-3.5 px-4">
                      {matchedInv ? (
                        <div>
                          <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{matchedInv.invoiceNumber}</span>
                          <div className="text-[11px] text-slate-500 dark:text-slate-400">{matchedInv.clientName}</div>
                          <div className="text-[10px] text-slate-400 dark:text-slate-500">
                            Invoice Total: {formatCurrency(matchedInv.total)}
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 italic">No direct match found</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      {tx.matchScore ? (
                        <div>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              tx.matchScore >= 90
                                ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                                : tx.matchScore >= 70
                                ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                                : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            {tx.matchScore}% Match
                          </span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 block mt-0.5 truncate max-w-[120px]">
                            {tx.matchReason}
                          </span>
                        </div>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500">-</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          tx.status === 'reconciled'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {tx.status === 'reconciled' ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <RefreshCw className="w-3 h-3 text-amber-600 dark:text-amber-400 animate-spin" />
                        )}
                        <span>{tx.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {tx.status === 'unreconciled' && tx.matchedInvoiceId ? (
                        <button
                          onClick={() => handleReconcile(tx.id, tx.matchedInvoiceId!)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all inline-flex items-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>1-Click Reconcile</span>
                        </button>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 text-xs font-medium">Reconciled ✓</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Import Statement Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white">
            <h3 className="font-bold text-base text-slate-900 dark:text-white mb-1">Import UPI / Bank Statement</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Import Google Pay, PhonePe, Paytm, or bank statement CSV logs.
            </p>

            <div className="border-2 border-dashed border-rose-200 dark:border-rose-900/60 rounded-xl p-6 text-center bg-rose-50/50 dark:bg-rose-950/30 mb-4">
              <FileSpreadsheet className="w-8 h-8 text-rose-500 dark:text-rose-400 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700 dark:text-slate-300">Drag & Drop Bank CSV here</p>
              <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">Supports HDFC, ICICI, SBI, Axis, and PhonePe exports</p>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddSampleCsv}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-md"
              >
                Load Sample Overdue UPI (₹6,500)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
