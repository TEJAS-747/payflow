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
  CreditCard,
  Tag,
  Building2,
  Phone,
  ShieldCheck,
} from 'lucide-react';

interface SidebarProps {
  currentTab: ActiveModule;
  setCurrentTab: (tab: ActiveModule) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { userProfile, metrics, upiTransactions, clients, invoices } = usePayFlow();

  const unreconciledCount = upiTransactions.filter((t) => t.status === 'unreconciled').length;

  const navItems: {
    id: ActiveModule;
    label: string;
    icon: React.ElementType;
    badge?: string | number;
    badgeColor?: string;
    isExtension?: boolean;
    priceTag?: string;
  }[] = [
    {
      id: 'all',
      label: 'Main Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'invoicing',
      label: 'Smart Invoicing',
      icon: FileText,
      badge: invoices.length,
      badgeColor: 'bg-blue-100 text-blue-700',
      priceTag: '₹199/mo',
    },
    {
      id: 'recovery',
      label: 'Payment Recovery',
      icon: BellRing,
      badge: metrics.overdueInvoicesCount > 0 ? `${metrics.overdueInvoicesCount} Overdue` : undefined,
      badgeColor: 'bg-red-100 text-red-700 font-bold',
      priceTag: '₹249/mo',
    },
    {
      id: 'intelligence',
      label: 'Income Intelligence AI',
      icon: BrainCircuit,
      badge: 'AI Copilot',
      badgeColor: 'bg-purple-100 text-purple-700 font-bold',
      priceTag: '₹299/mo',
    },
    {
      id: 'quotes',
      label: 'AI Quote Generator',
      icon: Sparkles,
      isExtension: true,
      badge: 'Ext',
      badgeColor: 'bg-indigo-100 text-indigo-700',
      priceTag: '₹149/mo',
    },
    {
      id: 'clients',
      label: 'Client CRM',
      icon: Users,
      isExtension: true,
      badge: clients.length,
      badgeColor: 'bg-teal-100 text-teal-700',
      priceTag: '₹149/mo',
    },
    {
      id: 'reconciliation',
      label: 'UPI Reconciliation',
      icon: CreditCard,
      isExtension: true,
      badge: unreconciledCount > 0 ? `${unreconciledCount} Match` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800',
      priceTag: '₹199/mo',
    },
    {
      id: 'pricing',
      label: 'Pricing & Monetization',
      icon: Tag,
      badge: 'Store',
      badgeColor: 'bg-emerald-100 text-emerald-800 font-bold',
    },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between shrink-0 min-h-[calc(100vh-4rem)] transition-colors">
      <div className="p-4">
        {/* User Card */}
        <div className="p-3 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl mb-5 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {userProfile.name.charAt(0)}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{userProfile.businessName}</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{userProfile.profession}</p>
          </div>
        </div>

        {/* Section: Core Modules */}
        <div className="mb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 mb-1">
            Pluggable Modules
          </p>
        </div>

        {/* Nav Items */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-slate-900 dark:bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center space-x-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                      isActive ? 'text-emerald-400 dark:text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  {item.badge && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${
                        isActive ? 'bg-slate-800 dark:bg-emerald-700 text-emerald-300 dark:text-emerald-100' : item.badgeColor || 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom UPI Status */}
      <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/50">
        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
          <span className="flex items-center space-x-1 font-semibold text-slate-700 dark:text-slate-300">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Instant UPI Linked</span>
          </span>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 px-1.5 py-0.5 rounded-full font-bold">
            Live
          </span>
        </div>
        <p className="text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">{userProfile.upiId}</p>
        <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">₹0 gateway deductions on direct UPI</p>
      </div>
    </aside>
  );
};
