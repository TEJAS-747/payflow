import React, { useState } from 'react';
import { PayFlowProvider, usePayFlow } from './context/PayFlowContext';
import { ActiveModule } from './types';
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

const PayFlowContent: React.FC = () => {
  const { activeModuleFilter, setActiveModuleFilter } = usePayFlow();

  const [currentTab, setCurrentTab] = useState<ActiveModule>('all');
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [isQuoteModalOpen, setIsQuoteModalOpen] = useState(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Sync with active module filter if changed from navbar switcher
  React.useEffect(() => {
    if (activeModuleFilter !== 'all') {
      setCurrentTab(activeModuleFilter);
    }
  }, [activeModuleFilter]);

  const handleTabChange = (tab: ActiveModule) => {
    setCurrentTab(tab);
    setActiveModuleFilter(tab);
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* Top Navigation */}
      <Navbar
        onOpenInvoiceModal={() => setIsInvoiceModalOpen(true)}
        onOpenQuoteModal={() => setIsQuoteModalOpen(true)}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar currentTab={currentTab} setCurrentTab={handleTabChange} />

        {/* Dynamic Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto min-w-0">
          {renderActiveView()}
        </main>
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
