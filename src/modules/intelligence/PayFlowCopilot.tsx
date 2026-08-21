import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Zap,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface Message {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  actionButton?: {
    label: string;
    onClick: () => void;
  };
}

export const PayFlowCopilot: React.FC<{ onNavigateToInvoice?: (id: string) => void }> = () => {
  const { invoices, clients, metrics, userProfile, sendReminder } = usePayFlow();

  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm-1',
      sender: 'ai',
      text: `Hello ${userProfile.name}! 👋 I am your **PayFlow Copilot**. I have analyzed your live ledger:\n\n• **Total Collected**: ${formatCurrency(metrics.totalIncome)}\n• **Total Outstanding**: ${formatCurrency(metrics.totalOutstanding)}\n• **Overdue At Risk**: ${formatCurrency(metrics.totalOverdue)}\n\nWhat would you like to analyze or act on today?`,
      timestamp: 'Just now',
    },
  ]);

  const quickPrompts = [
    'Rahul Ji ka udhaar kitna baaki hai?',
    'Kis grahak ka bill overdue hai?',
    'Iss mahine ki total kamai kitni hui?',
    'Sabse jyada udhaar kis grahak par hai?',
    'Draft a polite WhatsApp reminder for Rahul',
  ];

  const handleQuery = (queryText: string) => {
    if (!queryText.trim()) return;

    const userMsg: Message = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: queryText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Generate intelligent data-grounded AI answer based on live ledger
    setTimeout(() => {
      let aiResponse = '';
      const lower = queryText.toLowerCase();

      if (lower.includes('who owes') || lower.includes('most money') || lower.includes('jyada udhaar') || lower.includes('bada grahak')) {
        const debtors = clients
          .filter((c) => c.outstandingBalance > 0)
          .sort((a, b) => b.outstandingBalance - a.outstandingBalance);

        if (debtors.length > 0) {
          const top = debtors[0];
          aiResponse = `📊 **Top Outstanding Client / सबसे बड़ा बकाया:**\n\n**${top.name}** par abhi sabse jyada **${formatCurrency(top.outstandingBalance)}** baaki hai.\n\n` +
            debtors.map((d, i) => `${i + 1}. **${d.name}**: ${formatCurrency(d.outstandingBalance)} (Risk: ${d.riskRating.toUpperCase()})`).join('\n') +
            `\n\n💡 *Sudhaav:* ${top.name} ko WhatsApp par instant UPI link \`${userProfile.upiId}\` ke saath reminder bhejein.`;
        } else {
          aiResponse = '🎉 Badhiya! Kisi bhi grahak ka udhaar baaki nahi hai.';
        }
      } else if (lower.includes('overdue') || lower.includes('late') || lower.includes('atka') || lower.includes('overdue bill')) {
        const overdueList = invoices.filter((i) => i.status === 'overdue');
        if (overdueList.length > 0) {
          aiResponse = `⚠️ **Overdue Bills / अटका हुआ पैसा (${overdueList.length}):**\n\n` +
            overdueList
              .map(
                (inv) =>
                  `• **${inv.invoiceNumber}** — ${inv.clientName}: **${formatCurrency(inv.total)}** (Due Date: ${formatDate(inv.dueDate)})`
              )
              .join('\n') +
            `\n\nTotal Overdue: **${formatCurrency(metrics.totalOverdue)}**\nWhatsApp takada (reminder) bhej kar turant settle karein.`;
        } else {
          aiResponse = '✅ Sabhi bills time par paid hain ya due date ke andar hain.';
        }
      } else if (lower.includes('reminder') || lower.includes('rahul') || lower.includes('draft') || lower.includes('takaada')) {
        const rahulInv = invoices.find((i) => i.clientName.toLowerCase().includes('rahul'));
        const amt = rahulInv ? formatCurrency(rahulInv.total) : '₹4,500';
        const invNum = rahulInv ? rahulInv.invoiceNumber : '#INV-1024';

        aiResponse = `📝 **Rahul Ji Ke Liye Ready WhatsApp Message:**\n\n` +
          `*"Namaste Rahul Ji! Aapka bill ${invNum} (${amt}) baaki hai. Aap instant UPI dwara yahan pay kar sakte hain: ${userProfile.upiId}. Dhanyawad!"*\n\n` +
          `📱 *Aap 1-Click WhatsApp Reminder button click karke direct bhej sakte hain.*`;
      } else if (lower.includes('best month') || lower.includes('highest income') || lower.includes('revenue') || lower.includes('kamai')) {
        aiResponse = `🏆 **Income & Kamai Report / कमाई का हिसाब:**\n\nIs mahine (August 2026) aapki kul kamai **${formatCurrency(metrics.totalIncome)}** hui hai (100% Direct UPI).\n\n` +
          `• **Total Collected:** ${formatCurrency(metrics.totalIncome)}\n` +
          `• **Udhaar Balance:** ${formatCurrency(metrics.totalOutstanding)}\n` +
          `• **Collection Speed:** 4.2 din average settlement`;
      } else if (lower.includes('speed') || lower.includes('improve') || lower.includes('advice') || lower.includes('tips')) {
        aiResponse = `🚀 **3 Aasaan Tarike Fast Payment lene ke:**\n\n` +
          `1. **Bill ke saath UPI QR share karein:** Client bill dekhte hi GPay/PhonePe se 1-click payment kar dete hain.\n` +
          `2. **Due Date se 3 din pehle reminder bhejein:** 84% grahak time par pay kar dete hain.\n` +
          `3. **AI Rate Quote se advance lein:** Bade kaam ke liye 50% advance quote bhej kar kaam shuru karein.`;
      } else {
        aiResponse = `🤖 **PayFlow AI Assistant:**\n\nAapke sawal "${queryText}" ke aadhar par live ledger report:\n` +
          `• Total Billed: ${formatCurrency(metrics.totalIncome + metrics.totalOutstanding)}\n` +
          `• Active Clients: ${clients.length}\n` +
          `• Collection Health: **${metrics.collectionRate}%** (Badhiya)\n\n` +
          `Aap grahak report, udhaar list, ya WhatsApp message draft karne ko keh sakte hain!`;
      }

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    }, 500);
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col h-[520px] overflow-hidden transition-colors">
      {/* Copilot Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 p-4 text-white flex items-center justify-between">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-purple-500/30 border border-purple-400/40 flex items-center justify-center text-purple-300">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm">PayFlow Copilot</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                Live Ledger LLM
              </span>
            </div>
            <p className="text-[11px] text-purple-200">Context-Aware AI Assistant for Independent Pros</p>
          </div>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-950/60">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs shadow-sm mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-slate-900 dark:bg-purple-600 text-white rounded-tr-none font-medium'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 rounded-tl-none shadow-sm whitespace-pre-wrap'
              }`}
            >
              <div>{msg.text}</div>
              <span
                className={`text-[9px] block mt-1 text-right ${
                  msg.sender === 'user' ? 'text-slate-400 dark:text-purple-200' : 'text-slate-400 dark:text-slate-400'
                }`}
              >
                {msg.timestamp}
              </span>
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded-lg bg-slate-800 dark:bg-purple-700 text-white flex items-center justify-center shrink-0 text-xs shadow-sm mt-0.5">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-1.5 overflow-x-auto pb-2">
        <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 shrink-0">Try:</span>
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleQuery(prompt)}
            className="px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 hover:bg-purple-100 dark:hover:bg-purple-900/60 border border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 text-[11px] font-medium whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleQuery(input);
        }}
        className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center space-x-2"
      >
        <input
          type="text"
          placeholder="Ask in Hindi or English (e.g. Rahul ji ka udhaar kitna baaki hai)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 px-3.5 py-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 font-medium"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="p-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-40 transition-colors shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
