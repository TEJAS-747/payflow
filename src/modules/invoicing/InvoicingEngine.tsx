import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import type { Invoice, InvoiceStatus } from '../../types';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Eye,
  Share2,
  Copy,
  CheckCircle2,
  AlertCircle,
  Clock,
  MoreVertical,
  Trash2,
  RotateCcw,
  Sparkles,
  Download,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { InvoicePreviewModal } from './InvoicePreviewModal';
import { WhatsAppShareModal } from './WhatsAppShareModal';
import { InvoiceBuilderModal } from './InvoiceBuilderModal';

export const InvoicingEngine: React.FC = () => {
  const {
    invoices,
    duplicateInvoice,
    deleteInvoice,
    markAsPaid,
    toggleInvoiceOverdue,
  } = usePayFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [shareInvoice, setShareInvoice] = useState<Invoice | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);

  // Filter invoices
  const filteredInvoices = invoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.clientPhone.includes(searchQuery);

    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = invoices.reduce((acc, inv) => acc + inv.total, 0);
  const totalCollected = invoices.reduce((acc, inv) => acc + (inv.paidAmount || 0), 0);
  const pendingCount = invoices.filter((inv) => inv.status === 'pending').length;
  const overdueCount = invoices.filter((inv) => inv.status === 'overdue').length;

  return (
    <div className="space-y-6">
      {/* Standalone Micro-SaaS Badge Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-indigo-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-blue-400/20 text-blue-200 border border-blue-400/30">
                Standalone Module A
              </span>
              <span className="text-xs text-blue-200 font-mono">Monetization: ₹199/mo</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Smart Invoicing Engine</h1>
            <p className="text-xs text-blue-100 mt-1 max-w-xl">
              White-label dynamic invoice generation, tax/GST calculations, 4 PDF layouts, and 1-click WhatsApp delivery.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingInvoice(null);
              setIsBuilderOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-glow-green transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create New Invoice</span>
          </button>
        </div>

        {/* Quick KPI Tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-blue-800/60">
          <div>
            <span className="text-[11px] text-blue-200 block">Total Invoiced</span>
            <span className="text-lg font-black font-mono">{formatCurrency(totalBilled)}</span>
          </div>
          <div>
            <span className="text-[11px] text-blue-200 block">Collected (INR)</span>
            <span className="text-lg font-black font-mono text-emerald-300">{formatCurrency(totalCollected)}</span>
          </div>
          <div>
            <span className="text-[11px] text-blue-200 block">Pending Invoices</span>
            <span className="text-lg font-black font-mono text-amber-300">{pendingCount}</span>
          </div>
          <div>
            <span className="text-[11px] text-blue-200 block">Overdue Invoices</span>
            <span className="text-lg font-black font-mono text-red-300">{overdueCount}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 transition-colors">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by invoice #, client name, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          />
        </div>

        {/* Status Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          {['all', 'pending', 'overdue', 'paid', 'draft'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all shrink-0 ${
                statusFilter === st
                  ? 'bg-slate-900 dark:bg-blue-600 text-white font-bold shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Invoices List Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Client</th>
                <th className="py-3 px-4">Dates</th>
                <th className="py-3 px-4">Service Category</th>
                <th className="py-3 px-4 text-right">Amount</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Delivery</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 dark:text-slate-500">
                    No invoices match your search.
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/60 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">
                      <button
                        onClick={() => setPreviewInvoice(inv)}
                        className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                      >
                        {inv.invoiceNumber}
                      </button>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800 dark:text-slate-200">{inv.clientName}</div>
                      <div className="text-[11px] text-slate-400 dark:text-slate-500">{inv.clientPhone}</div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600 dark:text-slate-400">
                      <div>Issued: {formatDate(inv.issueDate)}</div>
                      <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                        Due: {formatDate(inv.dueDate)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[10px] font-medium">
                        {inv.serviceCategory || 'Service'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900 dark:text-white">
                      {formatCurrency(inv.total)}
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300'
                            : inv.status === 'overdue'
                            ? 'bg-red-100 dark:bg-red-950/80 text-red-800 dark:text-red-300'
                            : inv.status === 'partial'
                            ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300'
                            : 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300'
                        }`}
                      >
                        {inv.status === 'paid' && <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />}
                        {inv.status === 'overdue' && <AlertCircle className="w-3 h-3 text-red-600 dark:text-red-400" />}
                        <span>{inv.status}</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full capitalize">
                        {inv.deliveryStatus}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => setPreviewInvoice(inv)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 rounded-lg transition-colors"
                        title="Preview & Export PDF"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setShareInvoice(inv)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors"
                        title="Send via WhatsApp"
                      >
                        <Share2 className="w-4 h-4" />
                      </button>

                      {inv.status !== 'paid' && (
                        <button
                          onClick={() => markAsPaid(inv.id, 'UPI', 'Direct settlement')}
                          className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg transition-colors"
                          title="Mark as Paid"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                        </button>
                      )}

                      <button
                        onClick={() => duplicateInvoice(inv.id)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50 rounded-lg transition-colors"
                        title="Duplicate Invoice"
                      >
                        <Copy className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => toggleInvoiceOverdue(inv.id)}
                        className="p-1.5 text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/50 rounded-lg transition-colors"
                        title="Toggle Overdue State (Demo Helper)"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteInvoice(inv.id)}
                        className="p-1.5 text-slate-400 dark:text-slate-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {previewInvoice && (
        <InvoicePreviewModal
          invoice={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
        />
      )}

      {shareInvoice && (
        <WhatsAppShareModal
          invoice={shareInvoice}
          onClose={() => setShareInvoice(null)}
        />
      )}

      {isBuilderOpen && (
        <InvoiceBuilderModal
          initialInvoice={editingInvoice}
          onClose={() => setIsBuilderOpen(false)}
        />
      )}
    </div>
  );
};
