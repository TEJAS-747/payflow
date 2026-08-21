import React, { useState } from 'react';
import type { Invoice, InvoiceTheme } from '../../types';
import { usePayFlow } from '../../context/PayFlowContext';
import {
  X,
  Printer,
  Download,
  Share2,
  QrCode,
  CheckCircle2,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { formatCurrency, formatDate, generateUpiPaymentLink } from '../../utils/formatters';
import { exportInvoiceToPdf } from '../../utils/pdfExport';
import { WhatsAppShareModal } from './WhatsAppShareModal';

interface InvoicePreviewModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({ invoice, onClose }) => {
  const { userProfile, updateInvoice } = usePayFlow();
  const [currentTheme, setCurrentTheme] = useState<InvoiceTheme>(invoice.theme || 'modern');
  const [isExporting, setIsExporting] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  const upiLink = generateUpiPaymentLink(
    userProfile.upiId,
    userProfile.businessName || userProfile.name,
    invoice.total,
    invoice.invoiceNumber
  );

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    await exportInvoiceToPdf('printable-invoice', `${invoice.invoiceNumber}_${invoice.clientName}`);
    setIsExporting(false);
  };

  const handleThemeChange = (theme: InvoiceTheme) => {
    setCurrentTheme(theme);
    updateInvoice(invoice.id, { theme });
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/70 backdrop-blur-sm overflow-y-auto animate-fadeIn">
        <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
          {/* Action Bar Header */}
          <div className="bg-slate-900 text-white px-6 py-3.5 flex flex-wrap items-center justify-between gap-3 no-print">
            <div className="flex items-center space-x-3">
              <span className="font-bold text-sm text-emerald-400 font-mono">{invoice.invoiceNumber}</span>
              <span className="text-xs text-slate-400">• {invoice.clientName}</span>
            </div>

            {/* Layout Switcher */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-slate-400 hidden sm:inline">Theme:</span>
              <div className="flex bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                {(['modern', 'classic', 'executive', 'compact'] as InvoiceTheme[]).map((theme) => (
                  <button
                    key={theme}
                    onClick={() => handleThemeChange(theme)}
                    className={`px-2.5 py-1 rounded-md capitalize text-[11px] font-medium transition-all ${
                      currentTheme === theme ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {theme}
                  </button>
                ))}
              </div>
            </div>

            {/* Print, Export & WhatsApp Actions */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => window.print()}
                className="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-300 hover:text-white text-xs transition-colors"
                title="Print Invoice"
              >
                <Printer className="w-4 h-4" />
              </button>

              <button
                onClick={handleDownloadPdf}
                disabled={isExporting}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Generating...' : 'PDF'}</span>
              </button>

              <button
                onClick={() => setShowShareModal(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Printable Invoice Body */}
          <div className="p-6 sm:p-10 max-h-[80vh] overflow-y-auto bg-slate-100">
            <div
              id="printable-invoice"
              className={`max-w-3xl mx-auto bg-white p-8 sm:p-12 rounded-xl shadow-lg border ${
                currentTheme === 'executive'
                  ? 'border-indigo-200'
                  : currentTheme === 'classic'
                  ? 'border-slate-300'
                  : currentTheme === 'compact'
                  ? 'border-dashed border-slate-300 max-w-lg'
                  : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div
                className={`flex flex-col sm:flex-row justify-between items-start pb-8 mb-8 border-b ${
                  currentTheme === 'executive'
                    ? 'border-indigo-600/30'
                    : currentTheme === 'modern'
                    ? 'border-emerald-600/30'
                    : 'border-slate-200'
                }`}
              >
                <div>
                  <div className="flex items-center space-x-3 mb-2">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-lg ${
                        currentTheme === 'executive'
                          ? 'bg-indigo-700'
                          : currentTheme === 'classic'
                          ? 'bg-slate-900'
                          : 'bg-emerald-600'
                      }`}
                    >
                      {userProfile.name.charAt(0)}
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">{userProfile.businessName}</h2>
                      <p className="text-xs text-slate-500 font-medium">{userProfile.profession}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500">{userProfile.address}</p>
                  <p className="text-xs text-slate-500">{userProfile.phone} • {userProfile.email}</p>
                  {userProfile.gstin && (
                    <p className="text-xs text-slate-500 font-mono mt-0.5">GSTIN: {userProfile.gstin}</p>
                  )}
                </div>

                <div className="mt-4 sm:mt-0 sm:text-right">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 ${
                      invoice.status === 'paid'
                        ? 'bg-emerald-100 text-emerald-800'
                        : invoice.status === 'overdue'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {invoice.status}
                  </span>
                  <h1 className="text-2xl font-extrabold font-mono text-slate-900 tracking-tight">
                    {invoice.invoiceNumber}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    Issue Date: <span className="font-semibold text-slate-700">{formatDate(invoice.issueDate)}</span>
                  </p>
                  <p className="text-xs text-slate-500">
                    Due Date: <span className="font-semibold text-red-600">{formatDate(invoice.dueDate)}</span>
                  </p>
                </div>
              </div>

              {/* Billed To */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                    Billed To
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm">{invoice.clientName}</h3>
                  <p className="text-xs text-slate-600 mt-0.5">{invoice.clientPhone}</p>
                  <p className="text-xs text-slate-600">{invoice.clientEmail}</p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <span className="text-[10px] uppercase tracking-wider font-bold text-slate-400 block mb-1">
                    Payment Method
                  </span>
                  <p className="font-semibold text-xs text-slate-800">Instant UPI / QR Code</p>
                  <p className="text-xs text-emerald-700 font-mono font-bold mt-1">VPA: {userProfile.upiId}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Scan QR below using any UPI App</p>
                </div>
              </div>

              {/* Line Items Table */}
              <div className="mb-8 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr
                      className={`border-b ${
                        currentTheme === 'executive'
                          ? 'bg-indigo-50/80 text-indigo-900 border-indigo-200'
                          : currentTheme === 'modern'
                          ? 'bg-emerald-50/80 text-emerald-900 border-emerald-200'
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                      }`}
                    >
                      <th className="py-3 px-3 font-bold">Description</th>
                      <th className="py-3 px-3 font-bold text-center">Qty</th>
                      <th className="py-3 px-3 font-bold text-right">Unit Rate</th>
                      {invoice.taxTotal > 0 && <th className="py-3 px-3 font-bold text-center">GST %</th>}
                      <th className="py-3 px-3 font-bold text-right">Total Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {invoice.items.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/50">
                        <td className="py-3 px-3 font-medium text-slate-800">{item.description}</td>
                        <td className="py-3 px-3 text-center text-slate-600">{item.quantity}</td>
                        <td className="py-3 px-3 text-right font-mono text-slate-600">
                          {formatCurrency(item.unitPrice)}
                        </td>
                        {invoice.taxTotal > 0 && (
                          <td className="py-3 px-3 text-center font-mono text-slate-600">{item.taxRate}%</td>
                        )}
                        <td className="py-3 px-3 text-right font-bold font-mono text-slate-900">
                          {formatCurrency(item.amount)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Summary & QR Code Block */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-4 border-t border-slate-200 mb-8">
                {/* UPI QR Code Block */}
                <div className="flex items-center space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200 w-full sm:w-auto">
                  <div className="bg-white p-2 rounded-lg border border-slate-200 shadow-sm shrink-0">
                    <QRCodeSVG value={upiLink} size={96} level="M" includeMargin={false} />
                  </div>
                  <div>
                    <div className="flex items-center space-x-1 text-emerald-700 font-bold text-xs mb-0.5">
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Scan to Pay via UPI</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-700">{userProfile.upiId}</p>
                    <p className="text-[10px] text-slate-400 mt-1">GPay • PhonePe • Paytm • BHIM</p>
                  </div>
                </div>

                {/* Totals Breakdown */}
                <div className="w-full sm:w-64 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Subtotal:</span>
                    <span className="font-mono">{formatCurrency(invoice.subtotal)}</span>
                  </div>
                  {invoice.discountTotal > 0 && (
                    <div className="flex justify-between text-emerald-600 font-medium">
                      <span>Discount:</span>
                      <span className="font-mono">-{formatCurrency(invoice.discountTotal)}</span>
                    </div>
                  )}
                  {invoice.taxTotal > 0 && (
                    <div className="flex justify-between text-slate-600">
                      <span>Tax / GST:</span>
                      <span className="font-mono">{formatCurrency(invoice.taxTotal)}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-slate-300 font-extrabold text-sm sm:text-base text-slate-900">
                    <span>Grand Total:</span>
                    <span className="font-mono text-emerald-700">{formatCurrency(invoice.total)}</span>
                  </div>
                  {invoice.paidAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-semibold pt-1">
                      <span>Paid Amount:</span>
                      <span className="font-mono">{formatCurrency(invoice.paidAmount)}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes & Terms */}
              <div className="pt-6 border-t border-slate-100 text-slate-500 text-[11px] space-y-1">
                {invoice.notes && (
                  <p>
                    <span className="font-semibold text-slate-700">Note:</span> {invoice.notes}
                  </p>
                )}
                {invoice.termsAndConditions && (
                  <p>
                    <span className="font-semibold text-slate-700">Terms:</span> {invoice.termsAndConditions}
                  </p>
                )}
                <p className="text-slate-400 text-[10px] pt-3 text-center">
                  Created & verified via PayFlow — Instant Micro-Invoicing for Independent Pros.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showShareModal && (
        <WhatsAppShareModal invoice={invoice} onClose={() => setShowShareModal(false)} />
      )}
    </>
  );
};
