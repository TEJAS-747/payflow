import React from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import { Clock, MessageSquare, Mail, Smartphone, CheckCheck, User, Sparkles } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const ReminderTimeline: React.FC = () => {
  const { reminderLogs } = usePayFlow();

  if (reminderLogs.length === 0) {
    return (
      <div className="bg-white p-6 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
        No reminders sent yet. Smart chasers triggered will appear here.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
            Payment Reminder Audit Trail ({reminderLogs.length})
          </h3>
        </div>
        <span className="text-[11px] text-slate-400">Live Delivery Log</span>
      </div>

      <div className="space-y-4">
        {reminderLogs.map((log) => (
          <div key={log.id} className="relative pl-6 border-l-2 border-amber-200 space-y-1">
            <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] shadow-sm">
              {log.channel === 'whatsapp' ? 'W' : log.channel === 'sms' ? 'S' : 'E'}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-xs text-slate-800">{log.clientName}</span>
                <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700">
                  {log.invoiceNumber}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                  {log.tone}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{log.timestamp}</span>
            </div>

            <p className="text-xs text-slate-600 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
              "{log.content}"
            </p>

            <div className="flex items-center space-x-2 text-[10px] text-slate-400 pt-0.5">
              <span className="flex items-center space-x-1 text-emerald-600 font-medium">
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Delivered & Read</span>
              </span>
              <span>•</span>
              <span className="capitalize">Channel: {log.channel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
