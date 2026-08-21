import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import type { ActiveModule } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  Check,
  Zap,
  Sparkles,
  FileText,
  BellRing,
  BrainCircuit,
  Users,
  QrCode,
  Globe,
  Coins,
  CheckCircle2,
  RotateCcw,
  ShoppingBag,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface IndividualFeature {
  id: string;
  name: string;
  subtitle: string;
  priceRaw: number; // in Rupees
  priceDisplay: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  tagColor: string;
  targetModule: ActiveModule;
  details: string[];
}

export const PricingStore: React.FC<{ onSelectModule: (module: ActiveModule) => void }> = ({
  onSelectModule,
}) => {
  const { setActiveModuleFilter, triggerConfetti } = usePayFlow();

  // ₹10 Crore Initial Artificial Purse Balance
  const INITIAL_PURSE = 100000000; // ₹10,00,00,000

  const [purseBalance, setPurseBalance] = useState<number>(() => {
    const saved = localStorage.getItem('payflow_purse_balance');
    return saved ? Number(saved) : INITIAL_PURSE;
  });

  const [ownedFeatures, setOwnedFeatures] = useState<string[]>(() => {
    const saved = localStorage.getItem('payflow_owned_features');
    return saved ? JSON.parse(saved) : [];
  });

  const updatePurse = (newBalance: number, newOwned: string[]) => {
    setPurseBalance(newBalance);
    setOwnedFeatures(newOwned);
    localStorage.setItem('payflow_purse_balance', newBalance.toString());
    localStorage.setItem('payflow_owned_features', JSON.stringify(newOwned));
  };

  const handleResetPurse = () => {
    updatePurse(INITIAL_PURSE, []);
  };

  const featuresList: IndividualFeature[] = [
    {
      id: 'feat_invoicing',
      name: 'Smart GST Invoicing Engine',
      subtitle: 'स्मार्ट बिल & रसीद मेकर',
      priceRaw: 15000000, // ₹1.5 Cr
      priceDisplay: '₹1.50 Crore',
      desc: 'Create vector PDF invoices with automatic GST calculation, customized themes, and 1-click WhatsApp delivery.',
      icon: FileText,
      color: 'border-blue-200 dark:border-blue-900 bg-blue-50/20 dark:bg-blue-950/20',
      tagColor: 'bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300',
      targetModule: 'invoicing',
      details: [
        'Unlimited PDF & Vector Bill Downloads',
        'Dynamic Auto-Incrementing Invoice Numbers',
        'Automatic GST, IGST & Discount Computation',
        'WhatsApp Direct Sharing Links',
      ],
    },
    {
      id: 'feat_recovery',
      name: 'Automated WhatsApp Udhaar Recovery',
      subtitle: 'उधार वसूली & तकादा Engine',
      priceRaw: 20000000, // ₹2.0 Cr
      priceDisplay: '₹2.00 Crore',
      desc: '4-stage multi-tone WhatsApp payment chasers (Polite, Friendly, Firm, Urgent) to collect 3.4x faster.',
      icon: BellRing,
      color: 'border-amber-200 dark:border-amber-900 bg-amber-50/20 dark:bg-amber-950/20',
      tagColor: 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300',
      targetModule: 'recovery',
      details: [
        'Automatic Overdue Payment Detection',
        '4 Multi-Tone Smart WhatsApp Reminders',
        '1-Click Batch Overdue Follow-ups',
        'Payment Timeline & Audit Trail',
      ],
    },
    {
      id: 'feat_intelligence',
      name: 'PayFlow Copilot AI Engine',
      subtitle: 'कमाई का हिसाब AI Copilot',
      priceRaw: 25000000, // ₹2.5 Cr
      priceDisplay: '₹2.50 Crore',
      desc: 'Context-aware financial LLM Copilot that analyzes ledger health and responds in 10 Indian languages.',
      icon: BrainCircuit,
      color: 'border-purple-200 dark:border-purple-900 bg-purple-50/20 dark:bg-purple-950/20',
      tagColor: 'bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300',
      targetModule: 'intelligence',
      details: [
        'Real-time P&L Statement Analysis',
        '4 Dynamic AI Cashflow Insight Cards',
        'Hinglish & Regional Voice Prompting',
        'Instant CSV Ledger Data Export',
      ],
    },
    {
      id: 'feat_quotes',
      name: 'AI Rate Quotation Generator',
      subtitle: 'रेट लिस्ट & Quote Creator',
      priceRaw: 12000000, // ₹1.2 Cr
      priceDisplay: '₹1.20 Crore',
      desc: 'Turn plain language prompts into structured project proposals and convert them directly into invoices with 1 click.',
      icon: Sparkles,
      color: 'border-indigo-200 dark:border-indigo-900 bg-indigo-50/20 dark:bg-indigo-950/20',
      tagColor: 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300',
      targetModule: 'quotes',
      details: [
        'AI Prompt-to-Quotation Generator',
        'Milestone Breakdown & Deposit Structure',
        'Instant Convert Quote to Invoice',
      ],
    },
    {
      id: 'feat_clients',
      name: 'Client CRM & Credit Khaata Book',
      subtitle: 'ग्राहक खाता & CRM Directory',
      priceRaw: 10000000, // ₹1.0 Cr
      priceDisplay: '₹1.00 Crore',
      desc: 'Manage client accounts, track payment reliability scores (0-100), and maintain individual credit balances.',
      icon: Users,
      color: 'border-teal-200 dark:border-teal-900 bg-teal-50/20 dark:bg-teal-950/20',
      tagColor: 'bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300',
      targetModule: 'clients',
      details: [
        'Payment Reliability Risk Score (0-100)',
        'Client Ledger & Balance History',
        'Direct Client WhatsApp Contacting',
      ],
    },
    {
      id: 'feat_qr',
      name: 'Instant UPI QR & Direct Settlement',
      subtitle: 'Mera QR Generator',
      priceRaw: 8000000, // ₹80 Lakhs
      priceDisplay: '₹80 Lakhs',
      desc: 'Generate dynamic UPI QR codes for GPay, PhonePe, and Paytm with 0% gateway commission.',
      icon: QrCode,
      color: 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/20 dark:bg-emerald-950/20',
      tagColor: 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300',
      targetModule: 'all',
      details: [
        'GPay, PhonePe & Paytm Compatible',
        '0% Gateway Fee (100% Direct to Bank)',
        'Embed QR on Invoices & Reminders',
      ],
    },
    {
      id: 'feat_multilingual',
      name: '10 Indian Languages Translation Gateway',
      subtitle: '10 भारतीय भाषाएँ Module',
      priceRaw: 10000000, // ₹1.0 Cr
      priceDisplay: '₹1.00 Crore',
      desc: 'Full application UI translation across English, Hindi, Bengali, Marathi, Telugu, Tamil, Gujarati, Kannada, Malayalam, and Punjabi.',
      icon: Globe,
      color: 'border-rose-200 dark:border-rose-900 bg-rose-50/20 dark:bg-rose-950/20',
      tagColor: 'bg-rose-100 dark:bg-rose-950 text-rose-800 dark:text-rose-300',
      targetModule: 'all',
      details: [
        'Native Scripts & Regional Flags',
        'Instant Navbar Globe Switcher',
        'Full UI Translation System',
      ],
    },
  ];

  const handlePurchaseFeature = (feat: IndividualFeature) => {
    if (ownedFeatures.includes(feat.id)) {
      // Already owned, just navigate to it
      setActiveModuleFilter(feat.targetModule);
      onSelectModule(feat.targetModule);
      return;
    }

    if (purseBalance < feat.priceRaw) {
      alert('Insufficient Artificial Purse Balance! You need more funds or reset your ₹10 Cr purse.');
      return;
    }

    const nextBalance = purseBalance - feat.priceRaw;
    const nextOwned = [...ownedFeatures, feat.id];
    updatePurse(nextBalance, nextOwned);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });

    setActiveModuleFilter(feat.targetModule);
    onSelectModule(feat.targetModule);
  };

  const totalSpent = INITIAL_PURSE - purseBalance;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-emerald-950 text-white rounded-2xl p-6 sm:p-8 shadow-md border border-slate-800 relative overflow-hidden">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold mb-3">
            <Coins className="w-4 h-4 text-emerald-400" />
            <span>Hackathon Feature Marketplace • One-Time Purchases</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Feature Catalog & Micro-SaaS Pricing
          </h1>

          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
            Explore and purchase individual standalone micro-features using your team's ₹10 Crore artificial purse. Every feature purchase grants <strong>lifetime ownership</strong> with zero monthly subscription fees!
          </p>
        </div>
      </div>

      {/* Micro-Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuresList.map((feat) => {
          const Icon = feat.icon;
          const isOwned = ownedFeatures.includes(feat.id);

          return (
            <div
              key={feat.id}
              className={`rounded-2xl border p-6 flex flex-col justify-between transition-all bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-sm hover:shadow-md ${
                feat.color
              }`}
            >
              <div>
                {/* Header Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] uppercase font-extrabold px-2.5 py-0.5 rounded-full ${feat.tagColor}`}>
                    {feat.subtitle}
                  </span>
                  {isOwned && (
                    <span className="flex items-center space-x-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>UNLOCKED</span>
                    </span>
                  )}
                </div>

                <div className="flex items-start space-x-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white leading-tight">
                      {feat.name}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                      {feat.desc}
                    </p>
                  </div>
                </div>

                {/* Price Display */}
                <div className="my-4 py-3 border-y border-slate-200/80 dark:border-slate-800/80 flex items-baseline justify-between">
                  <div>
                    <span className="text-2xl font-black font-mono text-slate-900 dark:text-white">
                      {feat.priceDisplay}
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">
                    One-Time Lifetime Buy
                  </span>
                </div>

                {/* Feature Bullet List */}
                <div className="space-y-2 mb-6 text-xs text-slate-700 dark:text-slate-300 font-medium">
                  {feat.details.map((detail, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Purchase Action Button */}
              <button
                onClick={() => handlePurchaseFeature(feat)}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-2 ${
                  isOwned
                    ? 'bg-slate-900 dark:bg-emerald-600 text-emerald-400 dark:text-white shadow-sm'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm active:scale-98'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOwned ? 'Open Feature Module' : `Buy Feature (${feat.priceDisplay})`}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
