import React, { useState } from 'react';
import { PayFlowProvider, usePayFlow } from './context/PayFlowContext';
import type { ActiveModule } from './types';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { InvoicingEngine } from './modules/invoicing/InvoicingEngine';
import { RecoveryEngine } from './modules/recovery/RecoveryEngine';
import { IntelligenceEngine } from './modules/intelligence/IntelligenceEngine';
import { QuoteGenerator } from './modules/quotes/QuoteGenerator';
import { ClientCRM } from './modules/clients/ClientCRM';
import { UpiReconciliation } from './modules/reconciliation/UpiReconciliation';
import { PricingStore } from './components/pricing/PricingStore';
import { HackathonDemoBar } from './components/demo/HackathonDemoBar';
import { InvoiceBuilderModal } from './modules/invoicing/InvoiceBuilderModal';
import { QuoteGeneratorModal } from './modules/quotes/QuoteGeneratorModal';
import { OnboardingModal } from './components/onboarding/OnboardingModal';
import { LayoutDashboard, FileText, BellRing, Users, Plus, X } from 'lucide-react';

const PayFlowContent: React.FC = () => {
  const { activeModuleFilter, setActiveModuleFilter } = usePayFlow();

  const [currentTab, setCurrentTab] = useState<ActiveModule>('all');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Sync with active module filter if changed from navbar switcher
  React.useEffect(() => {
    if (activeModuleFilter !== 'all') {
      setCurrentTab(activeModuleFilter);
    }
  }, [activeModuleFilter]);

  const handleTabChange = (tab: ActiveModule) => {
    setCurrentTab(tab);
    setActiveModuleFilter(tab);
    setIsMobileMenuOpen(false);
  };

  const renderActiveView = () => {
    switch (currentTab) {
      case 'invoicing':
        return <InvoicingEngine />;
      case 'recovery':
        return <RecoveryEngine />;
      case 'intelligence':
        return <IntelligenceEngine />;
      case 'quotes':
        return <QuoteGenerator onNavigateToInvoices={() => handleTabChange('invoicing')} />;
      case 'clients':
        return <ClientCRM />;
      case 'reconciliation':
        return <UpiReconciliation />;
      case 'pricing':
        return <PricingStore onSelectModule={(m) => handleTabChange(m)} />;
      case 'all':
      default:
        return (
          <DashboardView
            onNavigateTab={(tab) => handleTabChange(tab)}
            onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
            onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Navigation */}
      <Navbar
        onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      />

      {/* Slide-out Mobile Navigation Drawer Overlay (for Phones) */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden animate-fadeIn">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Sidebar Content */}
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-slate-900 h-full flex flex-col shadow-2xl z-10">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="font-bold text-slate-900 dark:text-white text-sm">PayFlow Menu</span>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              <Sidebar currentTab={currentTab} setCurrentTab={handleTabChange} />
            </div>
          </div>
        </div>
      )}

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar (Desktop View) */}
        <div className="hidden md:block">
          <Sidebar currentTab={currentTab} setCurrentTab={handleTabChange} />
        </div>

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0 pb-24 md:pb-8">
          {renderActiveView()}
        </main>
      </div>

      {/* Fixed Mobile Bottom Navigation Bar for Smartphones */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 md:hidden z-30 px-3 py-2 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => handleTabChange('all')}
          className={`flex flex-col items-center space-y-1 text-[11px] font-medium transition-colors ${
            currentTab === 'all' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button
          onClick={() => handleTabChange('invoicing')}
          className={`flex flex-col items-center space-y-1 text-[11px] font-medium transition-colors ${
            currentTab === 'invoicing' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span>Bills</span>
        </button>

        {/* Center Quick + Bill Action Button */}
        <button
          onClick={() => setIsInvoiceModalOpen(true)}
          className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-glow-green -mt-6 hover:scale-105 transition-transform border-4 border-slate-50 dark:border-slate-950"
          title="Create New Bill"
        >
          <Plus className="w-6 h-6 stroke-[3]" />
        </button>

        <button
          onClick={() => handleTabChange('recovery')}
          className={`flex flex-col items-center space-y-1 text-[11px] font-medium transition-colors ${
            currentTab === 'recovery' ? 'text-amber-600 dark:text-amber-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <BellRing className="w-5 h-5" />
          <span>Udhaar</span>
        </button>

        <button
          onClick={() => handleTabChange('clients')}
          className={`flex flex-col items-center space-y-1 text-[11px] font-medium transition-colors ${
            currentTab === 'clients' ? 'text-teal-600 dark:text-teal-400 font-bold' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Users className="w-5 h-5" />
          <span>Grahak</span>
        </button>
      </div>

      {/* 3-Minute Hackathon Demo Controller Bar */}
      <HackathonDemoBar
        onNavigateTab={(tab) => handleTabChange(tab)}
        onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
      />

      {/* Global Modals */}
      {isInvoiceModalOpen && (
        <InvoiceBuilderModal
          onClose={() => setIsInvoiceModalOpen(false)}
          onSuccess={() => handleTabChange('invoicing')}
        />
      )}

      {isQuoteModalOpen && (
        <QuoteGeneratorModal
          onClose={() => setIsQuoteModalOpen(false)}
          onSuccess={() => handleTabChange('quotes')}
          onConvertToInvoiceImmediately={() => handleTabChange('invoicing')}
        />
      )}

      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <PayFlowProvider>
      <PayFlowContent />
    </PayFlowProvider>
  );
}

export default App;
