import React from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import type { ActiveModule } from '../../types';
import {
  LayoutDashboard,
  FileText,
  BellRing,
  BrainCircuit,
  Sparkles,
  Users,
} from 'lucide-react';

interface SidebarProps {
  currentTab: ActiveModule;
  setCurrentTab: (tab: ActiveModule) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { metrics, clients, invoices, t } = usePayFlow();

  const navItems: {
    id: ActiveModule;
    label: string;
    subLabel?: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    {
      id: 'all',
      label: t('dashboard'),
      subLabel: t('dashboardSub'),
      icon: LayoutDashboard,
    },
    {
      id: 'invoicing',
      label: t('smartBills'),
      subLabel: t('billsSub'),
      icon: FileText,
      badge: invoices.length,
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    },
    {
      id: 'recovery',
      label: t('udhaarRecovery'),
      subLabel: t('recoverySub'),
      icon: BellRing,
      badge: metrics.overdueInvoicesCount > 0 ? metrics.overdueInvoicesCount : undefined,
      badgeColor: 'bg-red-100 dark:bg-red-950/80 text-red-600 dark:text-red-400 font-bold',
    },
    {
      id: 'intelligence',
      label: t('incomeAi'),
      subLabel: t('incomeAiSub'),
      icon: BrainCircuit,
    },
    {
      id: 'quotes',
      label: t('rateQuotation'),
      subLabel: t('rateSub'),
      icon: Sparkles,
    },
    {
      id: 'clients',
      label: t('clientCrm'),
      subLabel: t('crmSub'),
      icon: Users,
      badge: clients.length,
      badgeColor: 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300',
    },
  ];

  return (
    <aside className="w-64 border-r border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900/60 min-h-[calc(100vh-4rem)] p-4 flex flex-col justify-between transition-colors">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Navigation
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs transition-all font-medium text-left ${
                isActive
                  ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-800/60'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon
                  className={`w-4 h-4 shrink-0 ${
                    isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'
                  }`}
                />
                <div className="truncate">
                  <span className="block truncate leading-tight font-semibold">{item.label}</span>
                  {item.subLabel && (
                    <span className="text-[10px] text-slate-400 dark:text-slate-500 block font-normal leading-tight">
                      {item.subLabel}
                    </span>
                  )}
                </div>
              </div>

              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full ${
                    item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="pt-4 border-t border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-400 dark:text-slate-500 text-center">
        <p className="font-semibold text-slate-600 dark:text-slate-400">PayFlow Simple OS</p>
        <p>100% Free Direct Payments</p>
      </div>
    </aside>
  );
};
