import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import type { Client } from '../../types';
import {
  Users,
  Plus,
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  CreditCard,
  MessageSquare,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  ShieldAlert,
  Trash2,
  Edit2,
} from 'lucide-react';
import { formatCurrency, generateWhatsAppLink } from '../../utils/formatters';
import { ClientModal } from './ClientModal';
import { ClientStatementModal } from './ClientStatementModal';

export const ClientCRM: React.FC<{ onOpenInvoiceForClient?: (client: Client) => void }> = ({
  onOpenInvoiceForClient,
}) => {
  const { clients, deleteClient, userProfile } = usePayFlow();

  const [searchQuery, setSearchQuery] = useState('');
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [statementClient, setStatementClient] = useState<Client | null>(null);

  const filteredClients = clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery) ||
      c.professionOrCompany.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBilledAll = clients.reduce((acc, c) => acc + c.totalBilled, 0);
  const totalOutstandingAll = clients.reduce((acc, c) => acc + c.outstandingBalance, 0);

  return (
    <div className="space-y-6">
      {/* Standalone Extension Header */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-emerald-950 rounded-2xl p-4 sm:p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-teal-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-200 border border-teal-400/30">
                Standalone Extension 2
              </span>
              <span className="text-xs text-teal-200 font-mono">Monetization: ₹149/mo</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight">Independent Client CRM</h1>
            <p className="text-xs text-teal-200 mt-1 max-w-xl">
              Manage client directory, payment reliability ratings, lifetime ledgers, and 1-click WhatsApp outreach.
            </p>
          </div>

          <button
            onClick={() => {
              setEditingClient(null);
              setIsClientModalOpen(true);
            }}
            className="flex items-center space-x-2 px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold rounded-xl text-xs shadow-md transition-all self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Client</span>
          </button>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-teal-800/60">
          <div>
            <span className="text-[11px] text-teal-200 block">Total Clients</span>
            <span className="text-xl font-black font-mono">{clients.length} Active</span>
          </div>
          <div>
            <span className="text-[11px] text-teal-200 block">Lifetime Billed</span>
            <span className="text-xl font-black font-mono text-emerald-300">
              {formatCurrency(totalBilledAll)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-teal-200 block">Total Outstanding</span>
            <span className="text-xl font-black font-mono text-amber-300">
              {formatCurrency(totalOutstandingAll)}
            </span>
          </div>
          <div>
            <span className="text-[11px] text-teal-200 block">Avg Reliability</span>
            <span className="text-xl font-black font-mono text-cyan-300">92%</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by client name, company, phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          />
        </div>
        <span className="text-xs text-slate-500 hidden sm:inline">
          Showing {filteredClients.length} of {clients.length} clients
        </span>
      </div>

      {/* Client Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => {
          const whatsappMsg = `Hi ${client.name}! This is ${userProfile.name} from ${userProfile.businessName}. Hope you're having a great day!`;
          const whatsappUrl = generateWhatsAppLink(client.phone, whatsappMsg);

          return (
            <div
              key={client.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header with Reliability Score */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-slate-900">{client.name}</h3>
                      <p className="text-xs text-slate-500">{client.professionOrCompany}</p>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                      client.riskRating === 'high'
                        ? 'bg-red-100 text-red-800'
                        : client.riskRating === 'medium'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {client.riskRating === 'high' ? '🔴 High Risk' : client.riskRating === 'medium' ? '🟡 Medium' : '🟢 Low Risk'}
                  </span>
                </div>

                {/* Contact Info */}
                <div className="space-y-1 text-xs text-slate-600 mb-4 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-mono">{client.phone}</span>
                  </div>
                  {client.email && (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{client.email}</span>
                    </div>
                  )}
                  {client.address && (
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{client.address}</span>
                    </div>
                  )}
                </div>

                {/* Financial Ledger Metrics */}
                <div className="grid grid-cols-2 gap-2 mb-4 text-xs">
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Total Billed</span>
                    <span className="font-bold font-mono text-slate-800">
                      {formatCurrency(client.totalBilled)}
                    </span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded-lg border border-slate-100">
                    <span className="text-[10px] text-slate-400 block">Balance Due</span>
                    <span
                      className={`font-bold font-mono ${
                        client.outstandingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'
                      }`}
                    >
                      {formatCurrency(client.outstandingBalance)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 transition-colors"
                    title="Send WhatsApp Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </a>

                  <a
                    href={`tel:${client.phone}`}
                    className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    title="Direct Call"
                  >
                    <Phone className="w-4 h-4" />
                  </a>

                  <button
                    onClick={() => setStatementClient(client)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
                    title="View Account Statement"
                  >
                    <FileText className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => {
                      setEditingClient(client);
                      setIsClientModalOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg"
                    title="Edit Client"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => deleteClient(client.id)}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                    title="Delete Client"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modals */}
      {isClientModalOpen && (
        <ClientModal
          client={editingClient}
          onClose={() => {
            setIsClientModalOpen(false);
            setEditingClient(null);
          }}
        />
      )}

      {statementClient && (
        <ClientStatementModal
          client={statementClient}
          onClose={() => setStatementClient(null)}
        />
      )}
    </div>
  );
};
