import React from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import {
  FileText,
  BellRing,
  BrainCircuit,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Star,
  Globe,
  CheckCircle2,
} from 'lucide-react';

interface LandingPageProps {
  onStartApp: () => void;
  onOpenLanguageModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartApp, onOpenLanguageModal }) => {
  const { t, selectedLanguage } = usePayFlow();

  const features = [
    {
      icon: FileText,
      title: 'Smart Bills & GST Invoices',
      subtitle: 'बिल & रसीद',
      desc: 'Create clean PDF invoices with automatic GST computation, customizable themes, and instant WhatsApp delivery.',
    },
    {
      icon: BellRing,
      title: 'Udhaar Recovery & Reminders',
      subtitle: 'उधार वसूली',
      desc: 'Automate overdue payment tracking with 1-click WhatsApp chasers (Polite, Friendly, Firm, Urgent) and collect 3.4x faster.',
    },
    {
      icon: BrainCircuit,
      title: 'Income Intelligence AI',
      subtitle: 'कमाई हिसाब AI',
      desc: 'Financial AI Assistant that answers queries and ledger insights in 10 Indian languages.',
    },
    {
      icon: Sparkles,
      title: 'AI Rate Quotation Generator',
      subtitle: 'रेट लिस्ट (Quote)',
      desc: 'Turn plain language prompts into structured rate lists and project proposals converted directly into bills.',
    },
  ];

  const stats = [
    { value: '₹4.2Cr+', label: 'Total Payment Recovered' },
    { value: '12,500+', label: 'Indian Small Businesses' },
    { value: '0%', label: 'Gateway Charges (Direct UPI)' },
    { value: '3.4x', label: 'Faster Collection Speed' },
  ];

  const testimonials = [
    {
      quote: 'PayFlow completely changed how I collect fees from my 60+ tuition students. Reminders via WhatsApp work like magic!',
      name: 'Rajesh Sharma',
      role: 'Private Physics Tutor, Delhi',
    },
    {
      quote: 'As a freelance designer, generating rate quotes and instant UPI invoices saved me 10+ hours every week.',
      name: 'Ananya Roy',
      role: 'UI/UX Designer, Bengaluru',
    },
    {
      quote: 'My garment store had ₹1.2 Lakh in overdue udhaar. PayFlow 1-click WhatsApp chaser recovered ₹95,000 in just 4 days!',
      name: 'Vikram Patel',
      role: 'Patel Garment Store, Ahmedabad',
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Landing Header */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-lg">
              PF
            </div>
            <span className="text-xl font-bold text-white tracking-tight">PayFlow</span>
            
            {/* Make in India Badge */}
            <span className="hidden sm:inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-orange-500/20 via-slate-800 to-emerald-500/20 text-slate-200 text-[11px] font-bold border border-slate-700">
              <span className="text-xs">🇮🇳</span>
              <span>Make in India</span>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Selector Button */}
            <button
              onClick={onOpenLanguageModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Language: {selectedLanguage.toUpperCase()}</span>
            </button>

            {/* Launch App Button */}
            <button
              onClick={onStartApp}
              className="flex items-center space-x-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs shadow-sm transition-all active:scale-98"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">
        {/* Make in India Hero Pill */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-950/80 via-slate-900 to-emerald-950/80 border border-orange-500/40 text-orange-200 text-xs font-extrabold mb-6 shadow-sm">
          <span className="text-base leading-none">🇮🇳</span>
          <span>Make in India • Built for Indian Shopkeepers, Freelancers, Tutors & Vendors</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto">
          {t('landingHeroTitle')}
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
          {t('landingHeroDesc')}
        </p>

        {/* Hero CTAs */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={onStartApp}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-98"
          >
            <span>Launch PayFlow Hub</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenLanguageModal}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-xl text-sm transition-colors"
          >
            <Globe className="w-4 h-4 text-emerald-400" />
            <span>Select Preferred Language</span>
          </button>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-8 border-t border-slate-800">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-4 bg-slate-800/40 rounded-xl border border-slate-800">
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Simple Features Designed for Daily Work
            </h2>
            <p className="mt-2 text-slate-400 text-xs sm:text-sm">
              No complex accounting jargon — just fast bills, WhatsApp reminders, and AI income tracking.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 transition-all hover:border-slate-700 flex flex-col justify-between"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-slate-800 text-emerald-400 flex items-center justify-center mb-4 border border-slate-700">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-lg font-bold text-white">{feat.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-semibold border border-slate-700">
                        {feat.subtitle}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                      {feat.desc}
                    </p>
                  </div>

                  <button
                    onClick={onStartApp}
                    className="mt-6 flex items-center space-x-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
                  >
                    <span>Open Tool</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Loved by 12,500+ Small Business Owners
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-800">
                <h4 className="font-bold text-white text-xs">{t.name}</h4>
                <p className="text-[11px] text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 PayFlow. Built for Indian Small Businesses, Shopkeepers, Tutors & Freelancers.</p>
      </footer>
    </div>
  );
};
