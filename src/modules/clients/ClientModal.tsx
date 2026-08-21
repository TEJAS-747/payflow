import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import { Client } from '../../types';
import { X, User, Phone, Mail, MapPin, Building, FileText, CheckCircle2 } from 'lucide-react';

interface ClientModalProps {
  client?: Client | null;
  onClose: () => void;
}

export const ClientModal: React.FC<ClientModalProps> = ({ client, onClose }) => {
  const { addClient, updateClient } = usePayFlow();

  const [name, setName] = useState(client?.name || '');
  const [phone, setPhone] = useState(client?.phone || '+91 ');
  const [email, setEmail] = useState(client?.email || '');
  const [address, setAddress] = useState(client?.address || '');
  const [gstin, setGstin] = useState(client?.gstin || '');
  const [professionOrCompany, setProfessionOrCompany] = useState(client?.professionOrCompany || '');
  const [notes, setNotes] = useState(client?.notes || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      alert('Please provide client name and phone number');
      return;
    }

    if (client) {
      updateClient(client.id, {
        name,
        phone,
        email,
        address,
        gstin,
        professionOrCompany,
        notes,
      });
    } else {
      addClient({
        name,
        phone,
        email,
        address,
        gstin,
        professionOrCompany: professionOrCompany || 'Individual Client',
        notes,
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <User className="w-5 h-5 text-teal-300" />
            <div>
              <h3 className="font-bold text-base">{client ? 'Edit Client' : 'Add New Client'}</h3>
              <p className="text-xs text-teal-200">Standalone Client CRM Directory</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Client Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Rahul Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-semibold"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone (WhatsApp) *</label>
              <input
                type="text"
                required
                placeholder="+91 98201 12345"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                placeholder="client@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Profession</label>
              <input
                type="text"
                placeholder="e.g. NextGen Media"
                value={professionOrCompany}
                onChange={(e) => setProfessionOrCompany(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN (Optional)</label>
              <input
                type="text"
                placeholder="27AABCN8901M1Z2"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Address / City</label>
            <input
              type="text"
              placeholder="e.g. Andheri West, Mumbai"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Client Notes</label>
            <textarea
              rows={2}
              placeholder="e.g. Prefers UPI payment on weekends"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg outline-none"
            />
          </div>

          {/* Footer */}
          <div className="pt-3 flex items-center justify-end space-x-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-50 text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold shadow-md"
            >
              {client ? 'Save Changes' : 'Add Client'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
