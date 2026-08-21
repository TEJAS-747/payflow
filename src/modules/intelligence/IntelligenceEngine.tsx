import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import {
  BrainCircuit,
  Sparkles,
  Download,
  Upload,
  Calendar,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';
import { VisualCharts } from './VisualCharts';
import { PayFlowCopilot } from './PayFlowCopilot';
import { AiInsightsCards } from './AiInsightsCards';
import { DataImportExportModal } from './DataImportExportModal';

export const IntelligenceEngine: React.FC = () => {
  const { metrics, userProfile } = usePayFlow();
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y' | 'all'>('30d');
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      {/* Standalone Micro-SaaS Header */}
      <div className="bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 rounded-2xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-purple-400/20 text-purple-200 border border-purple-400/30">
                Standalone Module C
              </span>
              <span className="text-xs text-purple-200 font-mono">Monetization: ₹299/mo</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">
              Income Intelligence & AI Analytics
            </h1>
            <p className="text-xs text-purple-200 mt-1 max-w-xl">
              Real-time cash flow analytics, AI business insights, and context-aware PayFlow Copilot assistant.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsDataModalOpen(true)}
              className="flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-purple-500/30 hover:bg-purple-500/40 text-purple-100 border border-purple-400/40 text-xs font-semibold transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Import / Export</span>
            </button>
          </div>
        </div>

        {/* Top Metric Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-purple-800/60">
          <div>
            <span className="text-[11px] text-purple-200 block">Total Income (MTD)</span>
            <span className="text-xl font-black font-mono text-emerald-400">
              {formatCurrency(metrics.totalIncome)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-purple-200 block">Outstanding Cash</span>
            <span className="text-xl font-black font-mono text-amber-300">
              {formatCurrency(metrics.totalOutstanding)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-purple-200 block">Recovery Rate</span>
            <span className="text-xl font-black font-mono text-cyan-300">
              {metrics.collectionRate}%
            </span>
          </div>
          <div>
            <span className="text-[11px] text-purple-200 block">Avg Settlement Time</span>
            <span className="text-xl font-black font-mono text-white">4.2 Days</span>
          </div>
        </div>
      </div>

      {/* Dynamic AI Insights Row */}
      <AiInsightsCards />

      {/* Main Grid: Visual Charts + PayFlow Copilot */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <VisualCharts />
        </div>

        <div className="xl:col-span-1">
          <PayFlowCopilot />
        </div>
      </div>

      {/* Data Import / Export Modal */}
      {isDataModalOpen && <DataImportExportModal onClose={() => setIsDataModalOpen(false)} />}
    </div>
  );
};
