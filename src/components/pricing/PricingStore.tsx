import React from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import { ActiveModule } from '../../types';
import {
  Check,
  Zap,
  Sparkles,
  Layers,
  FileText,
  BellRing,
  BrainCircuit,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

export const PricingStore: React.FC<{ onSelectModule: (module: ActiveModule) => void }> = ({
  onSelectModule,
}) => {
  const { activeModuleFilter, setActiveModuleFilter } = usePayFlow();

  const plans = [
    {
      id: 'invoicing' as ActiveModule,
      name: 'Smart Invoicing Module',
      price: '₹199',
      period: '/month',
      desc: 'Can be bought as an independent white-label invoicing engine.',
      color: 'border-blue-200 bg-blue-50/30',
      tagColor: 'bg-blue-100 text-blue-800',
      features: [
        'Unlimited PDF & Vector Invoices',
        'Dynamic Auto-Incrementing Numbers',
        'Customizable Layouts & Themes',
        '1-Click WhatsApp Delivery Deep Link',
        'GST & Tax Computation Presets',
        'Zero Accounting Jargon',
      ],
    },
    {
      id: 'recovery' as ActiveModule,
      name: '"Get Paid" Recovery Engine',
      price: '₹249',
      period: '/month',
      desc: 'Can be bought independently as an automated payment reminder tool.',
      color: 'border-amber-200 bg-amber-50/30',
      tagColor: 'bg-amber-100 text-amber-800',
      features: [
        'Receivables Dashboard & Risk Ratings',
        'Automatic Overdue Detection Engine',
        'Multi-Tone Smart Reminder Templates',
        '1-Click WhatsApp, SMS & Email Chasers',
        'Payment Timeline & Audit Trail',
        'Batch 1-Click Overdue Follow-ups',
      ],
    },
    {
      id: 'intelligence' as ActiveModule,
      name: 'Income Intelligence AI',
      price: '₹299',
      period: '/month',
      desc: 'Can be bought independently as a freelance financial analytics suite.',
      color: 'border-purple-200 bg-purple-50/30',
      tagColor: 'bg-purple-100 text-purple-800',
      features: [
        'PayFlow Copilot (Context-Aware LLM)',
        'Visual Monthly & Weekly Trends (Recharts)',
        'Receivables Cashflow Breakdown',
        '4 Dynamic AI Business Insights Cards',
        'External JSON Feed Ingestion',
        'Instant CSV / P&L Statement Export',
      ],
    },
    {
      id: 'all' as ActiveModule,
      name: 'Full PayFlow Pro Suite',
      price: '₹599',
      period: '/month',
      popular: true,
      desc: 'Complete all-in-one operating system for high-earning independent pros.',
      color: 'border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-500/20',
      tagColor: 'bg-emerald-600 text-white',
      features: [
        'All 3 Core Modules Included (A + B + C)',
        'Extension 1: Smart AI Quote Generator',
        'Extension 2: Independent Client CRM',
        'Extension 3: UPI Reconciliation Engine',
        'Instant UPI QR Code Generator',
        'Zero Transaction Commission (100% Direct)',
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto py-4">
        <span className="text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full bg-slate-900 text-emerald-400 border border-slate-700 inline-block mb-3">
          Pluggable Micro-SaaS Monetization
        </span>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          Purchase Standalone Modules or the Complete Pro Suite
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-2">
          Every PayFlow module is an independent micro-product with complete feature isolation. Test each module in isolation below!
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan) => {
          const isCurrent = activeModuleFilter === plan.id;

          return (
            <div
              key={plan.id}
              className={`rounded-3xl border p-6 flex flex-col justify-between transition-all bg-white shadow-sm hover:shadow-md ${
                plan.color
              } ${plan.popular ? 'relative' : ''}`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-[10px] uppercase font-extrabold tracking-wider px-3 py-0.5 rounded-full shadow-sm">
                  Best Value Bundle
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${plan.tagColor}`}>
                    {plan.id === 'all' ? 'Full Suite' : 'Micro-Module'}
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 mb-1">{plan.name}</h3>
                <p className="text-[11px] text-slate-500 mb-4">{plan.desc}</p>

                <div className="flex items-baseline space-x-1 mb-6 pb-4 border-b border-slate-200">
                  <span className="text-3xl font-black font-mono text-slate-900">{plan.price}</span>
                  <span className="text-xs text-slate-500 font-medium">{plan.period}</span>
                </div>

                <div className="space-y-2.5 mb-6 text-xs text-slate-700">
                  {plan.features.map((f, idx) => (
                    <div key={idx} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setActiveModuleFilter(plan.id);
                  onSelectModule(plan.id);
                }}
                className={`w-full py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center space-x-1.5 ${
                  isCurrent
                    ? 'bg-slate-900 text-emerald-400 font-extrabold shadow-sm'
                    : plan.popular
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-glow-green'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                }`}
              >
                <span>{isCurrent ? 'Active Mode' : 'Test This Module'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Guarantee & Philosophy Strip */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm">Enterprise Micro-SaaS Architectural Isolation</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Decoupled state, self-contained views, and zero cross-module dependency locks.
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveModuleFilter('all');
            onSelectModule('all');
          }}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs whitespace-nowrap"
        >
          Activate Full Suite Mode
        </button>
      </div>
    </div>
  );
};
