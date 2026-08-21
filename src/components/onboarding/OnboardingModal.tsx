import React, { useState } from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import { ProfessionType } from '../../types';
import {
  Sparkles,
  CheckCircle2,
  Building2,
  Smartphone,
  CreditCard,
  Sliders,
  ArrowRight,
  ArrowLeft,
  X,
} from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const { userProfile, updateUserProfile } = usePayFlow();

  const [step, setStep] = useState(1);
  const [profession, setProfession] = useState<ProfessionType>(userProfile.profession);
  const [businessName, setBusinessName] = useState(userProfile.businessName);
  const [name, setName] = useState(userProfile.name);
  const [phone, setPhone] = useState(userProfile.phone);
  const [email, setEmail] = useState(userProfile.email);
  const [city, setCity] = useState(userProfile.city);
  const [upiId, setUpiId] = useState(userProfile.upiId);
  const [gstin, setGstin] = useState(userProfile.gstin || '');
  const [defaultTerms, setDefaultTerms] = useState(userProfile.defaultPaymentTermsDays);

  if (!isOpen) return null;

  const professions: { type: ProfessionType; icon: string; desc: string }[] = [
    { type: 'Freelance Developer / Designer', icon: '💻', desc: 'Software, UI/UX, Mobile Apps & Web' },
    { type: 'Private Tutor / Coach', icon: '🎓', desc: 'Academic, Music, Fitness & Language' },
    { type: 'Electrician / Technician', icon: '⚡', desc: 'Wiring, Appliance Repair, Solar & HVAC' },
    { type: 'Tailor / Fashion Designer', icon: '👗', desc: 'Bespoke Garments, Alterations & Couture' },
    { type: 'Mechanic / Garage', icon: '🔧', desc: 'Automobile Service, Tuning & Repairs' },
    { type: 'Home Service & Plumbing', icon: '🔨', desc: 'Plumbing, Carpentry, Deep Cleaning' },
    { type: 'Business Consultant', icon: '💼', desc: 'CA, Legal, Tax, Strategy & Marketing' },
    { type: 'Contractor & Painter', icon: '🎨', desc: 'Civil Work, Interior Painting, Renovation' },
  ];

  const handleFinish = () => {
    updateUserProfile({
      profession,
      businessName,
      name,
      phone,
      email,
      city,
      upiId,
      gstin,
      defaultPaymentTermsDays: defaultTerms,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 my-auto">
        {/* Step Indicator Top Bar */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
              PF
            </div>
            <div>
              <h3 className="font-bold text-sm">Welcome to PayFlow Setup</h3>
              <p className="text-[11px] text-slate-400">Step {step} of 4 • 2-Minute Guided Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Bar */}
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          {/* STEP 1: Profession Select */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto mb-6">
                <h2 className="text-xl font-extrabold text-slate-900">What is your independent craft?</h2>
                <p className="text-xs text-slate-500 mt-1">
                  PayFlow tailors invoice line items, tax presets, and smart templates to your trade.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {professions.map((p) => (
                  <button
                    key={p.type}
                    type="button"
                    onClick={() => setProfession(p.type)}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-start space-x-3 ${
                      profession === p.type
                        ? 'border-emerald-500 bg-emerald-50/70 shadow-sm ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-2xl">{p.icon}</span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{p.type}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: Business Profile */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto mb-6">
                <h2 className="text-xl font-extrabold text-slate-900">Your Business Identity</h2>
                <p className="text-xs text-slate-500 mt-1">
                  This appears on your white-label invoices, quotations, and WhatsApp messages.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Business / Studio Name *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">City / Location *</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Phone (WhatsApp) *</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">GSTIN (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 29ABCDE1234F1Z5"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Method & UPI Setup */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto mb-6">
                <h2 className="text-xl font-extrabold text-slate-900">Direct UPI Payment Setup</h2>
                <p className="text-xs text-slate-500 mt-1">
                  100% direct bank settlement. 0% gateway commission fees.
                </p>
              </div>

              <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-emerald-950 mb-1">
                    Your Primary UPI VPA / ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. yourname@okhdfcbank or mobile@paytm"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-sm font-mono font-bold bg-white border border-emerald-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <span className="text-[11px] text-emerald-700 mt-1 block">
                    Clients will scan dynamic QR codes or click 1-touch payment links straight to this UPI ID.
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Compatible with PhonePe, Google Pay, Paytm, BHIM, Cred, and all major Indian banks.</span>
              </div>
            </div>
          )}

          {/* STEP 4: Preferences & Automation */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center max-w-md mx-auto mb-6">
                <h2 className="text-xl font-extrabold text-slate-900">Automation & Reminders</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Configure default payment turnaround and automated chaser settings.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Default Payment Due Term (Days)
                  </label>
                  <select
                    value={defaultTerms}
                    onChange={(e) => setDefaultTerms(parseInt(e.target.value) || 7)}
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
                  >
                    <option value="3">3 Days (Fast service turnaround)</option>
                    <option value="7">7 Days (Standard Indian freelancer norm)</option>
                    <option value="15">15 Days (Corporate milestone payment)</option>
                    <option value="30">30 Days (Net 30)</option>
                  </select>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <span className="font-bold text-slate-800 block">Pre-Configured Smart Chasers:</span>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>3 days before due date: Polite WhatsApp heads-up</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>On due date: Direct WhatsApp 1-click payment link</span>
                  </div>
                  <div className="flex items-center space-x-2 text-slate-600">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>3 & 7 days overdue: Firm escalation notice with late tracking</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="flex items-center space-x-1.5 px-4 py-2 border border-slate-300 rounded-xl text-slate-700 hover:bg-slate-100 text-xs font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="flex items-center space-x-1.5 px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-glow-green"
            >
              <span>Continue</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleFinish}
              className="flex items-center space-x-1.5 px-6 py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-black shadow-md hover:shadow-glow-green"
            >
              <Sparkles className="w-4 h-4" />
              <span>Launch My PayFlow Dashboard 🚀</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
