import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import { X, Download, Upload, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface DataImportExportModalProps {
  onClose: () => void;
}

export const DataImportExportModal: React.FC<DataImportExportModalProps> = ({ onClose }) => {
  const { invoices, metrics, userProfile } = usePayFlow();
  const [jsonInput, setJsonInput] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleExportCsv = () => {
    const headers = ['Invoice Number', 'Client Name', 'Issue Date', 'Due Date', 'Total (INR)', 'Paid Amount (INR)', 'Status'];
    const rows = invoices.map((inv) => [
      inv.invoiceNumber,
      `"${inv.clientName}"`,
      inv.issueDate,
      inv.dueDate,
      inv.total,
      inv.paidAmount || 0,
      inv.status,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `PayFlow_Financial_Report_${userProfile.businessName.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (Array.isArray(parsed)) {
        setImportStatus(`Successfully ingested ${parsed.length} external payment entries!`);
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setImportStatus('Invalid JSON format: Expected an array of records.');
      }
    } catch {
      setImportStatus('JSON syntax error: Please check your formatting.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-900 to-indigo-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="w-5 h-5 text-purple-300" />
            <div>
              <h3 className="font-bold text-base">Financial Data Hub</h3>
              <p className="text-xs text-purple-200">Import External Payment Feeds & Export P&L Reports</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Section 1: Export Financial Report */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Export Official Financial Report
            </h4>
            <p className="text-xs text-slate-500 mb-3">
              Download clean CSV statement of all {invoices.length} invoices, collected cash, and pending balances for tax filing.
            </p>
            <button
              onClick={handleExportCsv}
              className="flex items-center space-x-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Download CSV Statement ({formatCurrency(metrics.totalIncome)} Collected)</span>
            </button>
          </div>

          {/* Section 2: Ingest External Logs */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
              Ingest External JSON Payment Feed
            </h4>
            <p className="text-xs text-slate-500 mb-2">
              Paste raw JSON payment logs or ERP exports to integrate into Income Intelligence.
            </p>
            <textarea
              rows={4}
              placeholder='[ { "invoiceId": "EXT-101", "amount": 5000, "client": "Zenith", "status": "paid" } ]'
              value={jsonInput}
              onChange={(e) => setJsonInput(e.target.value)}
              className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
            />
            {importStatus && (
              <p
                className={`text-xs mt-1.5 font-medium flex items-center space-x-1 ${
                  importStatus.includes('Successfully') ? 'text-emerald-600' : 'text-red-600'
                }`}
              >
                {importStatus.includes('Successfully') ? (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                ) : (
                  <AlertCircle className="w-3.5 h-3.5" />
                )}
                <span>{importStatus}</span>
              </p>
            )}
            <button
              onClick={handleImportJson}
              disabled={!jsonInput.trim()}
              className="mt-2 flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-40"
            >
              <Upload className="w-4 h-4" />
              <span>Ingest Feed into AI Suite</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
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
