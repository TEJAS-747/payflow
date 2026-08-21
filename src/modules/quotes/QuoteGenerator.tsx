import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import type { Quote } from '../../types';
import {
  Sparkles,
  Plus,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  FileText,
  Clock,
  Trash2,
  Lightbulb,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { QuoteGeneratorModal } from './QuoteGeneratorModal';

export const QuoteGenerator: React.FC<{ onNavigateToInvoices?: () => void }> = ({ onNavigateToInvoices }) => {
  const { quotes, convertQuoteToInvoice, deleteQuote } = usePayFlow();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convertedNotice, setConvertedNotice] = useState<string | null>(null);

  const handleConvert = (quoteId: string) => {
    const inv = convertQuoteToInvoice(quoteId);
    setConvertedNotice(`Quote accepted! Generated Invoice ${inv.invoiceNumber} for ${inv.clientName} (${formatCurrency(inv.total)})`);
    setTimeout(() => setConvertedNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Standalone Extension Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-purple-950 rounded-2xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-indigo-400/20 text-indigo-200 border border-indigo-400/30">
                Standalone Extension 1
              </span>
              <span className="text-xs text-indigo-200 font-mono">Monetization: ₹149/mo</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Smart AI Quote Generator</h1>
            <p className="text-xs text-indigo-200 mt-1 max-w-xl">
              Turn natural language prompts into professional cost estimates, milestones, and 1-click converted invoices.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white font-bold rounded-xl text-xs shadow-md transition-all self-start sm:self-auto"
          >
            <Sparkles className="w-4 h-4 text-indigo-200" />
            <span>+ Generate AI Quote</span>
          </button>
        </div>

        {convertedNotice && (
          <div className="mt-4 p-3 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-xs text-emerald-200 flex items-center justify-between animate-fadeIn">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{convertedNotice}</span>
            </div>
            {onNavigateToInvoices && (
              <button
                onClick={onNavigateToInvoices}
                className="underline text-emerald-300 font-bold hover:text-white"
              >
                View Invoices →
              </button>
            )}
          </div>
        )}
      </div>

      {/* Quotes Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {quotes.map((quote) => (
          <div
            key={quote.id}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="font-mono font-bold text-xs text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/80 px-2 py-0.5 rounded">
                      {quote.quoteNumber}
                    </span>
                    <span
                      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        quote.status === 'converted'
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                          : quote.status === 'accepted'
                          ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {quote.status}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">{quote.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Client: <strong className="text-slate-800 dark:text-slate-200">{quote.clientName}</strong> ({quote.clientPhone})
                  </p>
                </div>

                <span className="text-lg font-black font-mono text-slate-900 dark:text-white">
                  {formatCurrency(quote.total)}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 mb-4 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700">
                {quote.description}
              </p>

              {/* Items Summary */}
              <div className="space-y-1.5 mb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 dark:text-slate-500 block">
                  Deliverables Breakdown ({quote.items.length})
                </span>
                {quote.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-slate-700 dark:text-slate-300">
                    <span className="truncate max-w-[70%]">• {item.description}</span>
                    <span className="font-mono text-slate-600 dark:text-slate-400">{formatCurrency(item.amount)}</span>
                  </div>
                ))}
              </div>

              {/* Timeline & Terms */}
              <div className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                  <span>Estimated Duration: <strong>{quote.estimatedDuration}</strong></span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" />
                  <span>Valid Until: {formatDate(quote.validUntil)}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 mt-2">
              <button
                onClick={() => deleteQuote(quote.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 transition-colors"
                title="Delete Quote"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              {quote.status !== 'converted' ? (
                <button
                  onClick={() => handleConvert(quote.id)}
                  className="flex items-center space-x-1.5 px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Accept & Convert to Invoice</span>
                </button>
              ) : (
                <span className="text-xs font-semibold text-emerald-700 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Converted ({quote.convertedInvoiceId})</span>
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && <QuoteGeneratorModal onClose={() => setIsModalOpen(false)} />}
    </div>
  );
};
