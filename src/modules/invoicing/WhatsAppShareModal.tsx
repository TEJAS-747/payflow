import React, { useState } from 'react';
import type { Invoice } from '../../types';
import { usePayFlow } from '../../context/PayFlowContext';
import { X, Send, Copy, Check, MessageSquare, Mail, Smartphone, ExternalLink } from 'lucide-react';
import { generateWhatsAppLink, formatCurrency, formatDate } from '../../utils/formatters';

interface WhatsAppShareModalProps {
  invoice: Invoice;
  onClose: () => void;
}

export const WhatsAppShareModal: React.FC<WhatsAppShareModalProps> = ({ invoice, onClose }) => {
  const { userProfile, sendReminder } = usePayFlow();
  const [copied, setCopied] = useState(false);
  const [channel, setChannel] = useState<'whatsapp' | 'sms' | 'email'>('whatsapp');

  const defaultMessage = `*Invoice from ${userProfile.businessName}* 📄

Hi ${invoice.clientName},
Here is the invoice summary for your recent services:

• *Invoice #*: ${invoice.invoiceNumber}
• *Amount Due*: ${formatCurrency(invoice.total)}
• *Due Date*: ${formatDate(invoice.dueDate)}
• *Service*: ${invoice.items[0]?.description || 'Professional Services'}

💳 *Instant UPI Payment*:
UPI ID: \`${userProfile.upiId}\`
(Scan & Pay via Google Pay / PhonePe / Paytm)

Thank you for your business! If you have any questions, feel free to reply directly here.`;

  const [messageText, setMessageText] = useState(defaultMessage);

  const whatsappUrl = generateWhatsAppLink(invoice.clientPhone, messageText);
  const mailtoUrl = `mailto:${invoice.clientEmail}?subject=${encodeURIComponent(
    `Invoice ${invoice.invoiceNumber} from ${userProfile.businessName}`
  )}&body=${encodeURIComponent(messageText)}`;
  const smsUrl = `sms:${invoice.clientPhone}?body=${encodeURIComponent(messageText)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(messageText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerSend = () => {
    sendReminder(invoice.id, channel, 'friendly', messageText);
    if (channel === 'whatsapp') {
      window.open(whatsappUrl, '_blank');
    } else if (channel === 'email') {
      window.location.href = mailtoUrl;
    } else {
      window.location.href = smsUrl;
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-white" />
            <div>
              <h3 className="font-bold text-base">Multi-Channel Delivery</h3>
              <p className="text-xs text-emerald-100">
                Delivering {invoice.invoiceNumber} to {invoice.clientName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Selector */}
        <div className="p-6">
          <div className="flex items-center space-x-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4 text-xs font-semibold">
            <button
              onClick={() => setChannel('whatsapp')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                channel === 'whatsapp' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp (Instant)</span>
            </button>
            <button
              onClick={() => setChannel('sms')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                channel === 'sms' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>SMS</span>
            </button>
            <button
              onClick={() => setChannel('email')}
              className={`flex-1 py-2 rounded-lg flex items-center justify-center space-x-1.5 transition-all ${
                channel === 'email' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Mail className="w-4 h-4" />
              <span>Email</span>
            </button>
          </div>

          {/* Client Recipient Details */}
          <div className="bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl p-3 mb-4 text-xs flex items-center justify-between">
            <div>
              <span className="text-slate-400 dark:text-slate-500 block text-[10px]">Recipient Phone / Email</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {channel === 'email' ? invoice.clientEmail : invoice.clientPhone}
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {formatCurrency(invoice.total)} Due
            </span>
          </div>

          {/* Message Preview Editor */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Pre-Filled Formatted Message</label>
              <button
                onClick={handleCopy}
                className="text-[11px] text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 font-medium flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard' : 'Copy Message'}</span>
              </button>
            </div>
            <textarea
              rows={7}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
            />
          </div>

          {/* WhatsApp Features List */}
          <div className="bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-100 dark:border-emerald-900/60 rounded-xl p-3 text-[11px] text-emerald-900 dark:text-emerald-200 space-y-1">
            <p className="font-semibold">⚡ Direct WhatsApp Integration:</p>
            <p>• Opens client chat with pre-populated message.</p>
            <p>• Includes direct UPI VPA for 1-click settlement in India.</p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/90 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleTriggerSend}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md hover:shadow-glow-green transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Launch {channel === 'whatsapp' ? 'WhatsApp' : channel.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
