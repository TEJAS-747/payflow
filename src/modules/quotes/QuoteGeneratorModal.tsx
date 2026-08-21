import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import type { Quote, InvoiceItem } from '../../types';
import {
  Sparkles,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Lightbulb,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

interface QuoteGeneratorModalProps {
  onClose: () => void;
  onSuccess?: (createdQuote: Quote) => void;
  onConvertToInvoiceImmediately?: (createdQuote: Quote) => void;
}

export const QuoteGeneratorModal: React.FC<QuoteGeneratorModalProps> = ({
  onClose,
  onSuccess,
  onConvertToInvoiceImmediately,
}) => {
  const { clients, createQuote, convertQuoteToInvoice, userProfile } = usePayFlow();

  const [promptInput, setPromptInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Quote Fields
  const [clientName, setClientName] = useState(clients[0]?.name || 'Rahul Sharma');
  const [clientPhone, setClientPhone] = useState(clients[0]?.phone || '+91 98201 12345');
  const [clientEmail, setClientEmail] = useState(clients[0]?.email || 'rahul@nextgenmedia.in');
  const [title, setTitle] = useState('Custom Project Deliverables');
  const [description, setDescription] = useState('Scope of work, milestone deliverables, and estimated pricing.');
  const [estimatedDuration, setEstimatedDuration] = useState('10 Working Days');
  const [validUntil, setValidUntil] = useState('2026-09-10');
  const [serviceCategory, setServiceCategory] = useState('Professional Services');
  const [terms, setTerms] = useState<string[]>([
    '50% Advance upon project kickoff, 50% on final milestone sign-off.',
    'Includes up to 2 rounds of design/structural revisions.',
    'Quotation valid for 15 days from issuance date.',
  ]);

  const [items, setItems] = useState<InvoiceItem[]>([
    {
      id: 'qi-1',
      description: 'Discovery, UX Architecture & System Planning',
      quantity: 1,
      unitPrice: 4000,
      discountPercent: 0,
      taxRate: 0,
      amount: 4000,
    },
    {
      id: 'qi-2',
      description: 'High-Fidelity Component Build & Implementation',
      quantity: 1,
      unitPrice: 3500,
      discountPercent: 0,
      taxRate: 0,
      amount: 3500,
    },
    {
      id: 'qi-3',
      description: 'Testing, Quality Assurance & Deployment Setup',
      quantity: 1,
      unitPrice: 2500,
      discountPercent: 0,
      taxRate: 0,
      amount: 2500,
    },
  ]);

  const samplePresets = [
    {
      label: '🎨 2BHK Painting in Mumbai',
      prompt: 'Paint a 2BHK 800 sq.ft apartment in Mumbai with Asian Paints Royale',
      title: '2BHK Apartment Interior Painting Package',
      desc: 'Complete wall sanding, primer coat, 2 coats of Asian Paints Royale luxury emulsion, and masking.',
      category: 'Contractor & Painter',
      duration: '5 Working Days',
      items: [
        { id: '1', description: 'Surface preparation, crack filling & putty application', quantity: 1, unitPrice: 3500, discountPercent: 0, taxRate: 0, amount: 3500 },
        { id: '2', description: 'Asian Paints Royale Emulsion (2 coats + primer) (800 sq.ft)', quantity: 1, unitPrice: 4500, discountPercent: 0, taxRate: 0, amount: 4500 },
        { id: '3', description: 'Ceiling painting & cleanup labor charges', quantity: 1, unitPrice: 2000, discountPercent: 0, taxRate: 0, amount: 2000 },
      ],
      terms: ['50% advance for material procurement, 50% on completion.', 'Floor protection sheets included.'],
    },
    {
      label: '💻 React & Next.js Store',
      prompt: 'Build a custom responsive React & Next.js e-commerce store with Razorpay',
      title: 'Full-Stack Next.js E-Commerce Website & Razorpay Integration',
      desc: 'Modern responsive online storefront with product catalog, cart, Razorpay checkout, and admin dashboard.',
      category: 'Web Development',
      duration: '12 Working Days',
      items: [
        { id: '1', description: 'Custom Next.js 14 Frontend UI & Tailwind Styling', quantity: 1, unitPrice: 5000, discountPercent: 0, taxRate: 0, amount: 5000 },
        { id: '2', description: 'Razorpay UPI Payment Gateway & Webhook integration', quantity: 1, unitPrice: 3000, discountPercent: 0, taxRate: 0, amount: 3000 },
        { id: '3', description: 'Product CMS & SEO optimization setup', quantity: 1, unitPrice: 2000, discountPercent: 0, taxRate: 0, amount: 2000 },
      ],
      terms: ['50% advance on kickoff, 50% upon deployment to production domain.', '30 days post-launch bug support.'],
    },
    {
      label: '⚡ 3-Storey Electrical Rewiring',
      prompt: 'Complete electrical wiring and switchboard replacement for a 3-storey house',
      title: 'Full House Electrical Wiring & Distribution Board Upgrade',
      desc: 'Rewiring concealed copper conduits, installing Havells modular switchboards, and MCB distribution box.',
      category: 'Electrician & Technician',
      duration: '7 Working Days',
      items: [
        { id: '1', description: 'Concealed wiring replacement with Finolex FR wire', quantity: 3, unitPrice: 2500, discountPercent: 0, taxRate: 0, amount: 7500 },
        { id: '2', description: 'Modular switchboards & MCB panel installation', quantity: 1, unitPrice: 2500, discountPercent: 0, taxRate: 0, amount: 2500 },
      ],
      terms: ['Material costs billed as actuals or provided by client.', 'Includes 1-year workmanship warranty.'],
    },
    {
      label: '👗 Bridal Lehenga Tailoring',
      prompt: 'Bridal lehenga custom tailoring with hand embroidery and 2 trial fittings',
      title: 'Bespoke Bridal Lehenga Design & Hand Zardozi Embroidery',
      desc: 'Custom stitching, can-can layering, handcrafted zardozi embroidery border, and 2 precision trial fittings.',
      category: 'Tailor & Fashion Designer',
      duration: '14 Working Days',
      items: [
        { id: '1', description: 'Pattern cutting, lining, and can-can skirt structuring', quantity: 1, unitPrice: 4500, discountPercent: 0, taxRate: 0, amount: 4500 },
        { id: '2', description: 'Handcrafted Zardozi & sequin embroidery work', quantity: 1, unitPrice: 5500, discountPercent: 0, taxRate: 0, amount: 5500 },
      ],
      terms: ['100% advance on fabric handover.', 'Includes 2 free alteration fittings.'],
    },
  ];

  const handleApplyPreset = (preset: typeof samplePresets[0]) => {
    setIsGenerating(true);
    setPromptInput(preset.prompt);
    setTimeout(() => {
      setTitle(preset.title);
      setDescription(preset.desc);
      setServiceCategory(preset.category);
      setEstimatedDuration(preset.duration);
      setItems(preset.items);
      setTerms(preset.terms);
      setIsGenerating(false);
    }, 400);
  };

  const handleItemChange = (index: number, field: keyof InvoiceItem, value: any) => {
    setItems((prev) => {
      const copy = [...prev];
      const target = { ...copy[index], [field]: value };
      const qty = target.quantity || 1;
      const unit = target.unitPrice || 0;
      target.amount = qty * unit;
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

  const subtotal = items.reduce((acc, i) => acc + i.amount, 0);
  const grandTotal = subtotal;

  const handleSaveQuote = (convertImmediately = false) => {
    const created = createQuote({
      clientName,
      clientPhone,
      clientEmail,
      title,
      description,
      promptUsed: promptInput,
      items,
      subtotal,
      discountTotal: 0,
      taxTotal: 0,
      total: grandTotal,
      validUntil,
      status: convertImmediately ? 'converted' : 'sent',
      terms,
      estimatedDuration,
      serviceCategory,
    });

    if (convertImmediately) {
      convertQuoteToInvoice(created.id);
      if (onConvertToInvoiceImmediately) onConvertToInvoiceImmediately(created);
    } else {
      if (onSuccess) onSuccess(created);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 dark:bg-slate-950/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white transition-colors my-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-indigo-300" />
            <div>
              <h3 className="font-bold text-base">Smart AI Quote Generator</h3>
              <p className="text-xs text-indigo-200">
                Natural Language Estimator for Indian Independent Pros
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Natural Language Prompt Box */}
          <div className="bg-indigo-50/60 dark:bg-indigo-950/40 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900/60">
            <label className="block text-xs font-bold uppercase tracking-wider text-indigo-900 dark:text-indigo-200 mb-1 flex items-center space-x-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>Describe the Job in Plain English (or pick a sample preset)</span>
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="e.g. Paint a 2BHK apartment in Mumbai with Asian Paints Royale..."
                value={promptInput}
                onChange={(e) => setPromptInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-white dark:bg-slate-800 border border-indigo-300 dark:border-indigo-700 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
              <button
                type="button"
                onClick={() => handleApplyPreset(samplePresets[0])}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Estimate</span>
              </button>
            </div>

            {/* Quick Sample Presets */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pt-1">
              <span className="text-[10px] text-indigo-700 dark:text-indigo-300 font-bold uppercase shrink-0">Sample Presets:</span>
              {samplePresets.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-700 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-indigo-800 dark:text-indigo-200 text-[11px] font-medium whitespace-nowrap transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Client & Project Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Client Name *</label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Phone (WhatsApp) *</label>
              <input
                type="text"
                required
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Estimated Timeline</label>
              <input
                type="text"
                value={estimatedDuration}
                onChange={(e) => setEstimatedDuration(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">Project Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
            />
          </div>

          {/* Estimated Itemized Breakdown */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                AI Estimated Cost Breakdown
              </label>
              <button
                type="button"
                onClick={addItemRow}
                className="flex items-center space-x-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
            </div>

            <div className="space-y-2">
              {items.map((item, index) => (
                <div
                  key={item.id || index}
                  className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs"
                >
                  <input
                    type="text"
                    placeholder="Deliverable Description"
                    value={item.description}
                    onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                    className="flex-1 px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none font-medium"
                  />
                  <input
                    type="number"
                    min="1"
                    placeholder="Qty"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 1)}
                    className="w-16 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none text-center font-mono"
                  />
                  <input
                    type="number"
                    min="0"
                    placeholder="Rate (₹)"
                    value={item.unitPrice}
                    onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-24 px-2 py-1.5 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg outline-none text-right font-mono"
                  />
                  <div className="w-24 text-right font-bold font-mono text-slate-900 dark:text-white">
                    {formatCurrency(item.amount)}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItemRow(index)}
                    disabled={items.length <= 1}
                    className="p-1 text-slate-400 hover:text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="flex justify-end pt-3 text-sm font-bold text-slate-900 dark:text-white">
              <div className="flex items-center space-x-4">
                <span>Total Quotation:</span>
                <span className="text-xl font-black font-mono text-indigo-700 dark:text-indigo-400">
                  {formatCurrency(grandTotal)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 dark:bg-slate-800/90 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
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
              onClick={() => handleSaveQuote(false)}
              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 rounded-xl text-xs font-semibold"
            >
              Save as Quote
            </button>
            <button
              type="button"
              onClick={() => handleSaveQuote(true)}
              className="flex items-center space-x-1.5 px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-xl text-xs font-bold shadow-md transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Accept & Convert to Invoice 🚀</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
