import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import type { Invoice, InvoiceItem, InvoiceTheme } from '../../types';
import { X, Plus, Trash2, CheckCircle2, UserPlus, Sparkles, FileText } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface InvoiceBuilderModalProps {
  onClose: () => void;
  onSuccess?: (createdInvoice: Invoice) => void;
  initialInvoice?: Invoice | null;
}

export const InvoiceBuilderModal: React.FC<InvoiceBuilderModalProps> = ({
  onClose,
  onSuccess,
  initialInvoice,
}) => {
  const { clients, addClient, createInvoice, updateInvoice, userProfile } = usePayFlow();

  const [clientId, setClientId] = useState(initialInvoice?.clientId || clients[0]?.id || 'new');
  const [clientName, setClientName] = useState(initialInvoice?.clientName || clients[0]?.name || '');
  const [clientPhone, setClientPhone] = useState(initialInvoice?.clientPhone || clients[0]?.phone || '');
  const [clientEmail, setClientEmail] = useState(initialInvoice?.clientEmail || clients[0]?.email || '');
  const [issueDate, setIssueDate] = useState(initialInvoice?.issueDate || '2026-08-21');
  const [dueDate, setDueDate] = useState(initialInvoice?.dueDate || '2026-08-28');
  const [theme, setTheme] = useState<InvoiceTheme>(initialInvoice?.theme || 'modern');
  const [serviceCategory, setServiceCategory] = useState(initialInvoice?.serviceCategory || 'General Service');
  const [notes, setNotes] = useState(
    initialInvoice?.notes || 'Payment via instant UPI is preferred. Thank you for your business!'
  );
  const [terms, setTerms] = useState(
    initialInvoice?.termsAndConditions || 'Please settle this invoice within 7 days of issue date.'
  );

  const [items, setItems] = useState<InvoiceItem[]>(
    initialInvoice?.items && initialInvoice.items.length > 0
      ? initialInvoice.items
      : [
          {
            id: 'item-1',
            description: 'Professional Services / Development',
            quantity: 1,
            unitPrice: 5000,
            discountPercent: 0,
            taxRate: 0,
            amount: 5000,
          },
        ]
  );

  const handleClientSelect = (selectedId: string) => {
    setClientId(selectedId);
    if (selectedId === 'new') {
      setClientName('');
      setClientPhone('');
      setClientEmail('');
    } else {
      const selected = clients.find((c) => c.id === selectedId);
      if (selected) {
        setClientName(selected.name);
        setClientPhone(selected.phone);
        setClientEmail(selected.email);
      }
    }
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      const target = { ...copy[index], [field]: value };

      const qty = target.quantity || 1;
      const unit = target.unitPrice || 0;
      const disc = target.discountPercent || 0;
      const tax = target.taxRate || 0;

      const base = qty * unit;
      const afterDiscount = base - (base * disc) / 100;
      const finalAmount = afterDiscount + (afterDiscount * tax) / 100;

      target.amount = Math.round(finalAmount);
      copy[index] = target;
      return copy;
    });
  };

  const addItemRow = () => {
    setItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}`,
        description: '',
        quantity: 1,
        unitPrice: 1000,
        discountPercent: 0,
        taxRate: 0,
        amount: 1000,
      },
    ]);
  };

  const removeItemRow = (index: number) => {
    if (items.length <= 1) return;
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  // Calculations
  const subtotal = items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const discountTotal = items.reduce(
    (acc, item) => acc + (item.quantity * item.unitPrice * (item.discountPercent || 0)) / 100,
    0
  );
  const taxTotal = items.reduce((acc, item) => {
    const base = item.quantity * item.unitPrice * (1 - (item.discountPercent || 0) / 100);
    return acc + (base * (item.taxRate || 0)) / 100;
  }, 0);
  const grandTotal = Math.round(subtotal - discountTotal + taxTotal);

  const handleSubmit = (status: 'draft' | 'pending') => {
    if (!clientName || !clientPhone) {
      alert('Please provide client name and phone number');
      return;
    }

    let finalClientId = clientId;
    if (clientId === 'new') {
      const createdClient = addClient({
        name: clientName,
        phone: clientPhone,
        email: clientEmail,
        address: userProfile.city,
        professionOrCompany: 'Client',
      });
      finalClientId = createdClient.id;
    }

    if (initialInvoice) {
      updateInvoice(initialInvoice.id, {
        clientId: finalClientId,
        clientName,
        clientPhone,
        clientEmail,
        issueDate,
        dueDate,
        items,
        subtotal,
        discountTotal,
        taxTotal,
        total: grandTotal,
        theme,
        serviceCategory,
        notes,
        termsAndConditions: terms,
      });
      onClose();
    } else {
      const created = createInvoice({
        clientId: finalClientId,
        clientName,
        clientPhone,
        clientEmail,
        issueDate,
        dueDate,
        items,
        subtotal,
        discountTotal,
        taxTotal,
        total: grandTotal,
        paidAmount: 0,
        status,
        theme,
        serviceCategory,
        notes,
        termsAndConditions: terms,
      });

      if (onSuccess) onSuccess(created);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 my-auto text-slate-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-base">
                {initialInvoice ? `Edit ${initialInvoice.invoiceNumber}` : 'Create Smart Invoice'}
              </h3>
              <p className="text-xs text-slate-300">White-label micro-invoicing engine with auto-calculations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Client Selection */}
          <div className="bg-slate-50 dark:bg-slate-800/80 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Client Details
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-3">
              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">Select Client</label>
                <select
                  value={clientId}
                  onChange={(e) => handleClientSelect(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="new">+ New Client (Enter below)</option>
                  {clients.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.phone})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">Client Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">Phone (WhatsApp) *</label>
                <input
                  type="text"
                  required
                  placeholder="+91 98201 12345"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 dark:text-slate-300 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="client@email.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Dates & Theme */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Issue Date</label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Invoice Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as InvoiceTheme)}
                className="w-full px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 capitalize"
              >
                <option value="modern">Modern Emerald</option>
                <option value="classic">Classic Minimal</option>
                <option value="executive">Executive Indigo</option>
                <option value="compact">Compact Thermal</option>
              </select>
            </div>
          </div>

          {/* Line Items */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Itemized Line Items
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center space-x-1 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex flex-wrap sm:flex-nowrap items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl"
                >
                  <div className="flex-1 min-w-[160px]">
                    <input
                      type="text"
                      placeholder="Item Description / Service"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    />
                  </div>

                  <div className="w-16">
                    <input
                      type="number"
                      min="1"
                      placeholder="Qty"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 1)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none text-center font-mono"
                    />
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      min="0"
                      placeholder="Rate (₹)"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      className="w-full px-2.5 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none text-right font-mono"
                    />
                  </div>

                  <div className="w-20">
                    <select
                      value={item.taxRate}
                      onChange={(e) => handleItemChange(index, 'taxRate', parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 text-xs bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none"
                    >
                      <option value="0">0% GST</option>
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST</option>
                      <option value="28">28% GST</option>
                    </select>
                  </div>

                  <div className="w-24 text-right font-mono font-bold text-xs text-slate-800 dark:text-slate-200">
                    {formatCurrency(item.amount)}
                  </div>

                  <button
                    type="button"
                    onClick={() => removeItemRow(index)}
                    disabled={items.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Totals Summary */}
          <div className="flex justify-end pt-3 border-t border-slate-200 dark:border-slate-800">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600 dark:text-slate-400">
                <span>Subtotal:</span>
                <span className="font-mono">{formatCurrency(subtotal)}</span>
              </div>
              {discountTotal > 0 && (
                <div className="flex justify-between text-emerald-600 dark:text-emerald-400">
                  <span>Discounts:</span>
                  <span className="font-mono">-{formatCurrency(discountTotal)}</span>
                </div>
              )}
              {taxTotal > 0 && (
                <div className="flex justify-between text-slate-600 dark:text-slate-400">
                  <span>GST / Tax:</span>
                  <span className="font-mono">{formatCurrency(taxTotal)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-900 dark:text-white pt-2 border-t border-slate-300 dark:border-slate-700">
                <span>Grand Total (INR):</span>
                <span className="font-mono text-emerald-600 dark:text-emerald-400 text-base">{formatCurrency(grandTotal)}</span>
              </div>
            </div>
          </div>

          {/* Notes & Terms */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Invoice Notes</label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full p-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-300 mb-1">Terms & Conditions</label>
              <textarea
                rows={2}
                value={terms}
                onChange={(e) => setTerms(e.target.value)}
                className="w-full p-2 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none"
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/90 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold"
            >
              Save as Draft
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('pending')}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-glow-green"
            >
              {initialInvoice ? 'Save Changes' : 'Issue Invoice'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
