import React from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import {
  Sparkles,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle,
  HelpCircle,
  X,
  Play,
} from 'lucide-react';

interface HackathonDemoBarProps {
  onNavigateTab: (tab: any) => void;
  onOpenInvoiceModal: () => void;
  onOpenQuoteModal: () => void;
}

export const HackathonDemoBar: React.FC<HackathonDemoBarProps> = ({
  onNavigateTab,
  onOpenInvoiceModal,
  onOpenQuoteModal,
}) => {
  const {
    demoStep,
    setDemoStep,
    isDemoActive,
    setIsDemoActive,
    resetToDefaultData,
    invoices,
    toggleInvoiceOverdue,
    markAsPaid,
  } = usePayFlow();

  if (!isDemoActive) {
    return (
      <button
        onClick={() => setIsDemoActive(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center space-x-2 px-3 py-2 rounded-full bg-slate-900 text-white shadow-xl hover:bg-slate-800 text-xs font-semibold border border-emerald-500/30 transition-all hover:scale-105"
      >
        <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
        <span>Resume 3-Min Hackathon Demo Tour</span>
      </button>
    );
  }

  const demoSteps = [
    {
      step: 1,
      title: '1. Dashboard Overview',
      desc: 'Inspect real-time metrics: ₹42,500 Total Income | ₹18,200 Outstanding | ₹6,500 Overdue.',
      actionText: 'Go to AI Quote Generator',
      action: () => {
        onNavigateTab('quotes');
        setDemoStep(2);
      },
    },
    {
      step: 2,
      title: '2. Generate AI Quote',
      desc: 'Use natural language prompt to generate an itemized ₹10,000 project quote with terms & timeline.',
      actionText: 'Open Quote Generator',
      action: () => {
        onNavigateTab('quotes');
        onOpenQuoteModal();
        setDemoStep(3);
      },
    },
    {
      step: 3,
      title: '3. Convert Quote to Invoice',
      desc: 'Click "Accept Quote → Convert to Invoice" to seed draft #INV-1025 with zero re-typing.',
      actionText: 'View Smart Invoices',
      action: () => {
        onNavigateTab('invoicing');
        setDemoStep(4);
      },
    },
    {
      step: 4,
      title: '4. WhatsApp 1-Click Send',
      desc: 'Click "Send via WhatsApp" on invoice #INV-1024 to inspect formatted message & deep link.',
      actionText: 'Simulate Overdue Trigger',
      action: () => {
        const pending = invoices.find((i) => i.id === 'inv-1024');
        if (pending) toggleInvoiceOverdue('inv-1024');
        onNavigateTab('recovery');
        setDemoStep(5);
      },
    },
    {
      step: 5,
      title: '5. Overdue Detection & Risk',
      desc: 'Engine automatically flagged invoice #INV-1024 as overdue with 🔴 High/🟡 Medium Risk rating.',
      actionText: 'Open Smart Reminder',
      action: () => {
        onNavigateTab('recovery');
        setDemoStep(6);
      },
    },
    {
      step: 6,
      title: '6. Multi-Channel Reminder',
      desc: 'Send multi-channel chaser with dynamic tone presets (Polite, Firm, Urgent) + direct UPI link.',
      actionText: 'Mark Invoice as Paid',
      action: () => {
        markAsPaid('inv-1024', 'UPI', 'Settled via instant UPI payment');
        setDemoStep(7);
      },
    },
    {
      step: 7,
      title: '7. Reactive Ledger Sync & Confetti',
      desc: 'Live real-time income update! Income increases by ₹4,500, outstanding drops to ₹13,700.',
      actionText: 'Explore Income Intelligence AI',
      action: () => {
        onNavigateTab('intelligence');
        setDemoStep(8);
      },
    },
    {
      step: 8,
      title: '8. Income Intelligence & Copilot',
      desc: 'Ask PayFlow Copilot natural language questions or explore visual Recharts revenue breakdowns.',
      actionText: 'Restart Demo Tour',
      action: () => {
        resetToDefaultData();
        onNavigateTab('all');
        setDemoStep(1);
      },
    },
  ];

  const current = demoSteps[demoStep - 1] || demoSteps[0];

  return (
    <div className="fixed bottom-3 inset-x-3 sm:inset-x-auto sm:right-6 sm:max-w-xl z-40 bg-slate-900/95 backdrop-blur-md text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 animate-slideUp">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold text-xs flex items-center justify-center">
            {demoStep}
          </span>
          <h4 className="font-bold text-sm text-emerald-400 flex items-center space-x-1.5">
            <span>{current.title}</span>
            <span className="text-[10px] text-slate-400 font-normal">({demoStep}/8)</span>
          </h4>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={resetToDefaultData}
            className="text-[11px] text-slate-400 hover:text-white flex items-center space-x-1 px-2 py-0.5 rounded hover:bg-slate-800 transition-colors"
            title="Reset to default seed state"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
          <button
            onClick={() => setIsDemoActive(false)}
            className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <p className="text-xs text-slate-300 mb-3 leading-relaxed">{current.desc}</p>

      {/* Action and Navigation Controls */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800">
        <div className="flex items-center space-x-1">
          <button
            disabled={demoStep === 1}
            onClick={() => setDemoStep(Math.max(1, demoStep - 1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={demoStep === demoSteps.length}
            onClick={() => setDemoStep(Math.min(demoSteps.length, demoStep + 1))}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <button
          onClick={current.action}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs hover:from-emerald-400 hover:to-teal-400 shadow-md transition-all hover:scale-102"
        >
          <span>{current.actionText}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
