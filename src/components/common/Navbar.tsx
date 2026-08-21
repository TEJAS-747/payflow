import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import {
  FileText,
  Bell,
  Sparkles,
  PlusCircle,
  QrCode,
  RotateCcw,
  Layers,
  CheckCircle2,
  ExternalLink,
  Sun,
  Moon,
} from 'lucide-react';
import { UpiQrModal } from './UpiQrModal';

interface NavbarProps {
  onOpenInvoiceModal: () => void;
  onOpenQuoteModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenInvoiceModal, onOpenQuoteModal }) => {
  const {
    userProfile,
    metrics,
    activeModuleFilter,
    setActiveModuleFilter,
    resetToDefaultData,
    batchRemindOverdue,
    darkMode,
    toggleDarkMode,
  } = usePayFlow();

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [showModuleMenu, setShowModuleMenu] = useState(false);
  const [batchSentMessage, setBatchSentMessage] = useState<string | null>(null);

  const handleBatchRemind = () => {
    const count = batchRemindOverdue();
    setBatchSentMessage(`Sent smart reminders for ${count} overdue invoices!`);
    setTimeout(() => setBatchSentMessage(null), 4000);
  };

  const moduleTitles: Record<string, { title: string; price: string; color: string }> = {
    all: { title: 'PayFlow Pro Suite', price: '₹599/mo', color: 'bg-emerald-500 text-white' },
    invoicing: { title: 'Smart Invoicing Module', price: '₹199/mo', color: 'bg-blue-600 text-white' },
    recovery: { title: 'Payment Recovery Engine', price: '₹249/mo', color: 'bg-amber-600 text-white' },
    intelligence: { title: 'Income Intelligence AI', price: '₹299/mo', color: 'bg-purple-600 text-white' },
    quotes: { title: 'AI Quote Generator', price: '₹149/mo', color: 'bg-indigo-600 text-white' },
    clients: { title: 'Independent Client CRM', price: '₹149/mo', color: 'bg-teal-600 text-white' },
    reconciliation: { title: 'UPI Reconciliation Engine', price: '₹199/mo', color: 'bg-rose-600 text-white' },
    pricing: { title: 'Pricing & Monetization Store', price: 'Store', color: 'bg-slate-800 text-white' },
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left: Brand Identity */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center shadow-glow-green text-white font-bold text-xl tracking-wider">
                PF
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight">PayFlow</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    Easy Hisaab / आसान हिसाब
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block font-medium">
                  WhatsApp Share • Instant UPI QR • Easy Udhaar Manager (उधार मैनेजर)
                </p>
              </div>
            </div>

            {/* Center: Active Micro-SaaS Switcher */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setShowModuleMenu(!showModuleMenu)}
                className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
                title="Switch Standalone View"
              >
                <Layers className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Mode:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{moduleTitles[activeModuleFilter]?.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-mono">
                  {moduleTitles[activeModuleFilter]?.price}
                </span>
              </button>

              {showModuleMenu && (
                <div className="absolute top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-100 dark:border-slate-800 py-2 z-40">
                  <div className="px-3 py-1.5 border-b border-slate-100 dark:border-slate-800">
                    <p className="text-[11px] font-bold uppercase text-slate-400 dark:text-slate-500">Feature Mode Selector</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">Select module to use or test independently</p>
                  </div>
                  {(Object.keys(moduleTitles) as (keyof typeof moduleTitles)[]).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveModuleFilter(key);
                        setShowModuleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        activeModuleFilter === key ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-semibold' : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        {activeModuleFilter === key && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />}
                        <span>{moduleTitles[key].title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                        {moduleTitles[key].price}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Quick Actions & Profile */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition-all flex items-center space-x-1.5"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? (
                  <>
                    <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
                    <span className="hidden md:inline">Light</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-indigo-600" />
                    <span className="hidden md:inline">Dark</span>
                  </>
                )}
              </button>

              {metrics.overdueInvoicesCount > 0 && (
                <button
                  onClick={handleBatchRemind}
                  className="relative hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 border border-amber-300 dark:border-amber-700 text-xs font-semibold transition-all"
                  title="Send 1-Click Multi-Channel Reminders to all Overdue Clients"
                >
                  <Bell className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-bounce" />
                  <span>Udhaar Remind ({metrics.overdueInvoicesCount})</span>
                </button>
              )}

              <button
                onClick={() => setIsQrModalOpen(true)}
                className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-all"
                title="View My UPI Payment QR Code"
              >
                <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="hidden sm:inline">Mera QR</span>
              </button>

              <button
                onClick={onOpenQuoteModal}
                className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 border border-indigo-200 dark:border-indigo-800 text-xs font-semibold transition-all"
              >
                <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                <span>+ Rate List</span>
              </button>

              <button
                onClick={onOpenInvoiceModal}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm hover:shadow-glow-green text-xs font-bold transition-all"
              >
                <PlusCircle className="w-4 h-4" />
                <span>+ Naya Bill</span>
              </button>

              <button
                onClick={resetToDefaultData}
                className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs transition-colors"
                title="Reset Demo Dataset"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {batchSentMessage && (
          <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center space-x-2 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4" />
            <span>{batchSentMessage}</span>
          </div>
        )}
      </header>

      {isQrModalOpen && <UpiQrModal onClose={() => setIsQrModalOpen(false)} />}
    </>
  );
};
