import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { usePayFlow } from '../../context/PayFlowContext';
import { X, Copy, Check, QrCode, Smartphone, ExternalLink, ShieldCheck } from 'lucide-react';
import { generateUpiPaymentLink, formatCurrency } from '../../utils/formatters';

interface UpiQrModalProps {
  onClose: () => void;
  customAmount?: number;
  customInvoiceNumber?: string;
}

export const UpiQrModal: React.FC<UpiQrModalProps> = ({
  onClose,
  customAmount,
  customInvoiceNumber,
}) => {
  const { userProfile } = usePayFlow();
  const [copied, setCopied] = useState(false);
  const [amount, setAmount] = useState<string>(customAmount ? String(customAmount) : '');

  const numericAmount = parseFloat(amount) || 0;
  const invoiceRef = customInvoiceNumber || 'PAYFLOW-DIRECT';

  const upiLink = generateUpiPaymentLink(
    userProfile.upiId,
    userProfile.businessName || userProfile.name,
    numericAmount,
    invoiceRef
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(userProfile.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <QrCode className="w-6 h-6" />
            <div>
              <h3 className="font-bold text-base">Instant UPI Scan & Pay</h3>
              <p className="text-xs text-emerald-100">Zero Transaction Fees • Instant Settlement</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-center">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-slate-800">{userProfile.businessName}</h4>
            <p className="text-xs text-slate-500">{userProfile.name} • {userProfile.city}</p>
          </div>

          {/* Amount Input */}
          <div className="mb-5 max-w-xs mx-auto">
            <label className="block text-xs font-semibold text-slate-600 mb-1 text-left">
              Request Specific Amount (₹)
            </label>
            <div className="relative rounded-lg shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 font-bold">
                ₹
              </div>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount (e.g. 4500)"
                className="w-full pl-8 pr-3 py-2 border border-slate-200 rounded-lg text-sm font-semibold focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
              />
            </div>
          </div>

          {/* QR Code Container */}
          <div className="inline-block p-4 bg-white rounded-2xl border-2 border-emerald-100 shadow-md mb-4">
            <QRCodeSVG
              value={upiLink}
              size={190}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23059669"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/></svg>',
                x: undefined,
                y: undefined,
                height: 30,
                width: 30,
                excavate: true,
              }}
            />
            {numericAmount > 0 && (
              <div className="mt-2 font-bold text-emerald-700 text-sm">
                Amount: {formatCurrency(numericAmount)}
              </div>
            )}
          </div>

          {/* UPI ID Pill */}
          <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs mb-5">
            <div className="text-left overflow-hidden">
              <span className="text-slate-400 block text-[10px]">UPI VPA Address</span>
              <span className="font-mono font-bold text-slate-800 truncate block">{userProfile.upiId}</span>
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-800 hover:bg-emerald-200 font-semibold transition-colors shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>

          {/* Supported Apps */}
          <div className="pt-2 border-t border-slate-100">
            <p className="text-[11px] text-slate-400 mb-2 font-medium">Scan with any Indian UPI App</p>
            <div className="flex items-center justify-center space-x-3 text-slate-600 text-xs">
              <span className="px-2 py-1 bg-slate-100 rounded font-semibold text-[11px]">Google Pay</span>
              <span className="px-2 py-1 bg-slate-100 rounded font-semibold text-[11px]">PhonePe</span>
              <span className="px-2 py-1 bg-slate-100 rounded font-semibold text-[11px]">Paytm</span>
              <span className="px-2 py-1 bg-slate-100 rounded font-semibold text-[11px]">BHIM</span>
              <span className="px-2 py-1 bg-slate-100 rounded font-semibold text-[11px]">Cred</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>NPCI UPI Standard Compatible</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
