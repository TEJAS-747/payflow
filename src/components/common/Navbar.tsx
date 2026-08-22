import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import {
  Plus,
  QrCode,
  Sun,
  Moon,
  Menu,
  Globe,
  Home,
  ChevronDown,
  CheckCircle2,
} from 'lucide-react';
import { UpiQrModal } from './UpiQrModal';

interface NavbarProps {
  onOpenInvoiceModal: () => void;
  onOpenQuoteModal: () => void;
  onToggleMobileMenu?: () => void;
  onOpenLandingPage?: () => void;
  onOpenLanguageModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenInvoiceModal,
  onOpenQuoteModal,
  onToggleMobileMenu,
  onOpenLandingPage,
  onOpenLanguageModal,
}) => {
  const {
    userProfile,
    activeModuleFilter,
    setActiveModuleFilter,
    darkMode,
    toggleDarkMode,
    selectedLanguage,
    t,
  } = usePayFlow();

  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [showModuleMenu, setShowModuleMenu] = useState(false);

  const moduleNames: Record<string, string> = {
    all: 'Dashboard Overview',
    invoicing: 'Smart Bills',
    recovery: 'Udhaar Recovery',
    intelligence: 'Income AI',
    quotes: 'Rate Quotation',
    clients: 'Client CRM',
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onToggleMobileMenu}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-2.5 cursor-pointer" onClick={onOpenLandingPage}>
              <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg tracking-wider shadow-sm">
                PF
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  PayFlow
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium -mt-1 hidden sm:block">
                  {userProfile.businessName || 'Business Hub'}
                </span>
              </div>
            </div>

            {/* Active Module Selector */}
            <div className="relative hidden md:block pl-4 border-l border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setShowModuleMenu(!showModuleMenu)}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                <span>{moduleNames[activeModuleFilter] || 'Dashboard'}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {showModuleMenu && (
                <div className="absolute left-4 top-full mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl py-1.5 z-50 animate-fadeIn">
                  {Object.keys(moduleNames).map((key) => (
                    <button
                      key={key}
                      onClick={() => {
                        setActiveModuleFilter(key as any);
                        setShowModuleMenu(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                        activeModuleFilter === key
                          ? 'text-emerald-600 dark:text-emerald-400 font-bold bg-emerald-50/50 dark:bg-emerald-950/30'
                          : 'text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <span>{moduleNames[key]}</span>
                      {activeModuleFilter === key && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Quick Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Landing Page Button */}
            {onOpenLandingPage && (
              <button
                onClick={onOpenLandingPage}
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
              >
                <Home className="w-4 h-4 text-indigo-500" />
                <span>Home</span>
              </button>
            )}

            {/* Globe Language Switcher */}
            {onOpenLanguageModal && (
              <button
                onClick={onOpenLanguageModal}
                className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-colors"
                title="Select Language"
              >
                <Globe className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="uppercase text-[11px] font-bold">{selectedLanguage}</span>
              </button>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-medium transition-colors"
              title={darkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-600" />
              )}
            </button>

            {/* Mera QR */}
            <button
              onClick={() => setIsQrModalOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-medium transition-colors"
            >
              <QrCode className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Mera QR</span>
            </button>

            {/* Create Invoice Primary Button */}
            <button
              onClick={onOpenInvoiceModal}
              className="flex items-center space-x-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-98"
            >
              <Plus className="w-4 h-4" />
              <span>{t('createBill')}</span>
            </button>
          </div>
        </div>
      </header>

      {/* QR Code Modal */}
      {isQrModalOpen && <UpiQrModal onClose={() => setIsQrModalOpen(false)} />}
    </>
  );
};
