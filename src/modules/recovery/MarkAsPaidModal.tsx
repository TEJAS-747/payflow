import React, { useState } from 'react';
import type { Invoice } from '../../types';
import { usePayFlow } from '../../context/PayFlowContext';
import { X, CheckCircle2, DollarSign, CreditCard, Sparkles } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface MarkAsPaidModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const MarkAsPaidModal: React.FC<MarkAsPaidModalProps> = ({ invoice, onClose }) => {
  const { markAsPaid } = usePayFlow();

  const [paymentMethod, setPaymentMethod] = useState<Invoice['paymentMethod']>('UPI');
  const [amount, setAmount] = useState<number>(invoice.total);
  const [paymentNotes, setPaymentNotes] = useState<string>('Payment settled via direct transfer');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    markAsPaid(invoice.id, paymentMethod, paymentNotes, amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-white" />
            <div>
              <h3 className="font-bold text-base">Record Payment</h3>
              <p className="text-xs text-emerald-100">
                Invoice {invoice.invoiceNumber} • {invoice.clientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
            <span className="text-xs text-emerald-800 font-semibold block">Total Invoice Due</span>
            <span className="text-2xl font-black font-mono text-emerald-900">
              {formatCurrency(invoice.total)}
            </span>
          </div>

          {/* Amount Paid */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Amount Received (₹)</label>
            <input
              type="number"
              required
              min="1"
              max={invoice.total}
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 text-sm font-bold font-mono border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            />
            {amount < invoice.total && (
              <span className="text-[11px] text-amber-600 font-medium mt-1 block">
                Partial Payment: {formatCurrency(invoice.total - amount)} remaining balance
              </span>
            )}
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Payment Mode</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as Invoice['paymentMethod'])}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              <option value="UPI">Instant UPI (GPay / PhonePe / Paytm / BHIM)</option>
              <option value="Bank Transfer (IMPS/NEFT)">Bank Transfer (IMPS / NEFT / RTGS)</option>
              <option value="Cash">Cash in Hand</option>
              <option value="Cheque">Cheque</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Payment Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Payment Reference / Notes
            </label>
            <input
              type="text"
              placeholder="e.g. UPI UTR #9021849201 or Cash Receipt"
              value={paymentNotes}
              onChange={(e) => setPaymentNotes(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Actions */}
          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center space-x-1.5 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md hover:shadow-glow-green"
            >
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Confirm & Celebrate 🎉</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
