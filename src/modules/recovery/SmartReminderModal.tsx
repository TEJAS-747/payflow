import React, { useState, useEffect } from 'react';
import type { Invoice, DeliveryChannel } from '../../types';
import { usePayFlow } from '../../context/PayFlowContext';
import {
  X,
  Send,
  MessageSquare,
  Smartphone,
  Mail,
  Copy,
  Check,
  Sparkles,
  AlertTriangle,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import { formatCurrency, formatDate, generateWhatsAppLink } from '../../utils/formatters';

interface SmartReminderModalProps {
  invoice: Invoice;
  onClose: () => void;
}

type TonePreset = 'polite' | 'friendly' | 'firm' | 'urgent';

export const SmartReminderModal: React.FC<SmartReminderModalProps> = ({ invoice, onClose }) => {
  const { userProfile, sendReminder, calculateOverdueDays } = usePayFlow();
  const overdueDays = calculateOverdueDays(invoice.dueDate);

  const [tone, setTone] = useState<TonePreset>(overdueDays > 7 ? 'firm' : overdueDays > 0 ? 'friendly' : 'polite');
  const [channel, setChannel] = useState<DeliveryChannel>('whatsapp');
  const [copied, setCopied] = useState(false);

  const getTemplate = (selectedTone: TonePreset): string => {
    const formattedAmount = formatCurrency(invoice.total);
    const business = userProfile.businessName || userProfile.name;
    const upi = userProfile.upiId;

    switch (selectedTone) {
      case 'polite':
        return `Hi ${invoice.clientName}! 😊 Hope you're doing well. Just a gentle heads-up that invoice *${invoice.invoiceNumber}* for *${formattedAmount}* is due on ${formatDate(invoice.dueDate)}.

You can settle it instantly via UPI to:
👉 \`${upi}\`

Thank you for working with ${business}! Let me know if you need any clarification.`;

      case 'friendly':
        return `Hey ${invoice.clientName}! 👋 Quick reminder regarding invoice *${invoice.invoiceNumber}* for *${formattedAmount}*. 

Please take a moment to clear it when possible. Instant UPI: \`${upi}\`

Thanks a ton!
— ${userProfile.name}`;

      case 'firm':
        return `Dear ${invoice.clientName},

This is a follow-up regarding invoice *${invoice.invoiceNumber}* for *${formattedAmount}*, which was due on ${formatDate(invoice.dueDate)} and is now *${overdueDays || 3} days overdue*.

Please arrange for payment today via UPI:
👉 \`${upi}\`

Please reply with the UTR or screenshot once transferred so we can update our records.
— ${business}`;

      case 'urgent':
        return `⚠️ *URGENT PAYMENT NOTICE*

Dear ${invoice.clientName},
Invoice *${invoice.invoiceNumber}* for *${formattedAmount}* is now *${overdueDays || 14} days OVERDUE*. 

Please settle this immediately via UPI to avoid disruption in services:
👉 UPI ID: \`${upi}\`

Kindly confirm once paid.
— ${business} Accounts`;
    }
  };

  const [message, setMessage] = useState(getTemplate(tone));

  useEffect(() => {
    setMessage(getTemplate(tone));
  }, [tone]);

  const whatsappUrl = generateWhatsAppLink(invoice.clientPhone, message);
  const mailtoUrl = `mailto:${invoice.clientEmail}?subject=${encodeURIComponent(
    `Payment Reminder: Invoice ${invoice.invoiceNumber} (${formatCurrency(invoice.total)})`
  )}&body=${encodeURIComponent(message)}`;
  const smsUrl = `sms:${invoice.clientPhone}?body=${encodeURIComponent(message)}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSend = () => {
    sendReminder(invoice.id, channel, tone, message);
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
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800 text-slate-900 dark:text-white transition-colors">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-amber-200" />
            <div>
              <h3 className="font-bold text-base">Smart Payment Reminder Engine</h3>
              <p className="text-xs text-amber-100">
                Chasing {invoice.invoiceNumber} • {formatCurrency(invoice.total)}
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

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Overdue Alert if overdue */}
          {overdueDays > 0 && (
            <div className="flex items-center space-x-2.5 p-3 rounded-xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 text-red-900 dark:text-red-200 text-xs">
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0" />
              <div>
                <span className="font-bold block">Invoice is {overdueDays} days overdue</span>
                <span className="text-[11px] text-red-700 dark:text-red-300">
                  Recommended tone: <strong className="capitalize">{tone}</strong> with direct UPI payment link.
                </span>
              </div>
            </div>
          )}

          {/* Tone Presets Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Tone / Escalation Stage
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'polite', label: '😊 Polite', desc: 'Pre-due / On Due Date' },
                { id: 'friendly', label: '👋 Friendly', desc: '1-3 days late' },
                { id: 'firm', label: '⏳ Firm', desc: '4-10 days late' },
                { id: 'urgent', label: '⚠️ Urgent', desc: '10+ days late' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTone(t.id as TonePreset)}
                  className={`p-2 rounded-xl text-left border transition-all text-xs ${
                    tone === t.id
                      ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-200 font-bold shadow-sm'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80'
                  }`}
                >
                  <div className="font-semibold">{t.label}</div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Channel Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
              Delivery Channel
            </label>
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setChannel('whatsapp')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                  channel === 'whatsapp' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('sms')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                  channel === 'sms' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>SMS</span>
              </button>
              <button
                type="button"
                onClick={() => setChannel('email')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center space-x-1 transition-all ${
                  channel === 'email' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Mail className="w-3.5 h-3.5" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Message Preview & Editor */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">Dynamic Message Copy</label>
              <button
                type="button"
                onClick={handleCopy}
                className="text-[11px] text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium flex items-center space-x-1"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-slate-800 dark:text-slate-200 focus:bg-white dark:focus:bg-slate-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none"
            />
          </div>

          {/* Reminder Stats */}
          <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/80 p-2.5 rounded-lg border border-slate-200 dark:border-slate-700">
            <span>Reminders sent so far: <strong>{invoice.reminderCount}</strong></span>
            {invoice.lastReminderSentAt && (
              <span>Last sent: {invoice.lastReminderSentAt}</span>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-800/90 px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 text-xs font-semibold"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSend}
            className="flex items-center space-x-2 px-5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Send via {channel === 'whatsapp' ? 'WhatsApp' : channel.toUpperCase()}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
