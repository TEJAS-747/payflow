import React from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import {
  FileText,
  BellRing,
  BrainCircuit,
  Sparkles,
  CreditCard,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  DollarSign,
  Users,
  Smartphone,
  Star,
  Globe,
  TrendingUp,
  ChevronRight,
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
      desc: 'Create professional PDF invoices with automatic GST computation, customizable themes, and instant WhatsApp sharing.',
      color: 'from-blue-500 to-indigo-600',
    },
    {
      icon: BellRing,
      title: 'Udhaar Recovery & Reminders',
      subtitle: 'उधार वसूली',
      desc: 'Automate overdue payment tracking with 4-stage WhatsApp chasers (Polite, Friendly, Firm, Urgent) and collect 3.4x faster.',
      color: 'from-amber-500 to-orange-600',
    },
    {
      icon: BrainCircuit,
      title: 'Income Intelligence AI',
      subtitle: 'कमाई हिसाब AI',
      desc: 'Context-aware financial AI Copilot that analyzes your ledger in real-time, answers voice/text queries in 10 Indian languages.',
      color: 'from-purple-500 to-pink-600',
    },
    {
      icon: Sparkles,
      title: 'AI Rate Quotation Generator',
      subtitle: 'रेट लिस्ट (Quote)',
      desc: 'Turn plain language prompts into structured project proposals, milestone breakdowns, and 1-click converted invoices.',
      color: 'from-indigo-500 to-cyan-600',
    },
  ];

  const stats = [
    { value: '₹4.2Cr+', label: 'Total Payment Recovered' },
    { value: '12,500+', label: 'Indian Businesses & Freelancers' },
    { value: '0%', label: 'Gateway Fee (Direct UPI)' },
    { value: '3.4x', label: 'Faster Payment Settlement' },
  ];

  const testimonials = [
    {
      quote: 'PayFlow completely changed how I collect fees from my 60+ tuition students. Reminders via WhatsApp work like magic!',
      name: 'Rajesh Sharma',
      role: 'Private Physics Tutor, Delhi',
      rating: 5,
    },
    {
      quote: 'As a freelance designer, generating rate quotes and instant UPI invoices saved me 10+ hours every week.',
      name: 'Ananya Roy',
      role: 'UI/UX Designer, Bengaluru',
      rating: 5,
    },
    {
      quote: 'My garment store had ₹1.2 Lakh in overdue udhaar. PayFlow 1-click WhatsApp chaser recovered ₹95,000 in just 4 days!',
      name: 'Vikram Patel',
      role: 'Patel Garment Store, Ahmedabad',
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Landing Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-glow-green text-slate-950 font-black text-xl tracking-wider">
              PF
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-black text-white tracking-tight">PayFlow</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Micro-SaaS
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Built for Indian Small Businesses, Shopkeepers & Freelancers
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {/* Language Selector Button */}
            <button
              onClick={onOpenLanguageModal}
              className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 transition-colors"
            >
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Language: {selectedLanguage.toUpperCase()}</span>
            </button>

            {/* Launch App Button */}
            <button
              onClick={onStartApp}
              className="flex items-center space-x-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold rounded-xl text-xs shadow-glow-green transition-all hover:scale-105"
            >
              <span>{t('getStarted')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-16 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-8 animate-fadeIn">
          <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
          <span>Supports 10 Major Indian Languages • 0% UPI Gateway Fees</span>
        </div>

        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] max-w-5xl mx-auto">
          {t('landingHeroTitle')}
        </h1>

        <p className="mt-6 text-base sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {t('landingHeroDesc')}
        </p>

        {/* Hero Actions */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartApp}
            className="w-full sm:w-auto flex items-center justify-center space-x-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-base shadow-glow-green transition-all hover:scale-105"
          >
            <span>Launch PayFlow Hub</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenLanguageModal}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-4 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 font-bold rounded-2xl text-base transition-all"
          >
            <Globe className="w-5 h-5 text-emerald-400" />
            <span>Select Preferred Language</span>
          </button>
        </div>

        {/* Live Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 pt-10 border-t border-slate-800/80">
          {stats.map((stat, idx) => (
            <div key={idx} className="p-6 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800/80">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 font-mono">
                {stat.value}
              </div>
              <div className="text-xs text-slate-400 mt-1 font-semibold">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Showcase Section */}
      <section className="py-20 bg-slate-900/40 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Modular Micro-SaaS Features Built for Everyday Work
            </h2>
            <p className="mt-4 text-slate-400 text-sm sm:text-base">
              Use as an integrated suite or deploy standalone modules for invoicing, recovery, and AI insights.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-3xl p-6 sm:p-8 transition-all hover:scale-[1.02] flex flex-col justify-between group"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feat.color} text-white flex items-center justify-center mb-6 shadow-lg`}>
                      <Icon className="w-7 h-7" />
                    </div>
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-bold text-white">{feat.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-emerald-400 font-bold border border-slate-700">
                        {feat.subtitle}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  <button
                    onClick={onStartApp}
                    className="mt-8 flex items-center space-x-2 text-xs font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors"
                  >
                    <span>Try Module</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Trusted by 12,500+ Indian Businesses & Professionals
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between">
              <div>
                <div className="flex items-center space-x-1 text-amber-400 mb-4">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-slate-300 italic leading-relaxed">
                  "{t.quote}"
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800">
                <h4 className="font-bold text-white text-xs">{t.name}</h4>
                <p className="text-[11px] text-slate-500">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA Banner */}
      <section className="py-16 px-4 bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 border-t border-slate-800">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
            Start Managing Your Billing & Recovery Today
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto">
            Join thousands of small business owners collecting payments 3.4x faster with direct UPI and WhatsApp automation.
          </p>
          <button
            onClick={onStartApp}
            className="inline-flex items-center space-x-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-base shadow-glow-green transition-all hover:scale-105"
          >
            <span>Get Started Free Now</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-8 px-4 text-center text-xs text-slate-500">
        <p>© 2026 PayFlow Operating System. Built for Indian Small Businesses, Tutors, Vendors & Freelancers.</p>
      </footer>
    </div>
  );
};
