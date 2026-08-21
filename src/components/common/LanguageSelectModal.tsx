import React from 'react';
import { usePayFlow } from '../../context/PayFlowContext';
import type { LanguageCode } from '../../utils/translations';
import { INDIAN_LANGUAGES } from '../../utils/translations';
import { Languages, CheckCircle2, ArrowRight, X } from 'lucide-react';

interface LanguageSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LanguageSelectModal: React.FC<LanguageSelectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const { selectedLanguage, setSelectedLanguage, t } = usePayFlow();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-colors">
        <div className="absolute right-0 top-0 translate-x-8 -translate-y-8 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center shadow-glow-green shrink-0">
            <Languages className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {t('selectLanguage')}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {t('chooseLanguageDesc')}
            </p>
          </div>
        </div>

        {/* 10 Most Spoken Languages Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 my-6 max-h-[340px] overflow-y-auto pr-1">
          {INDIAN_LANGUAGES.map((lang) => {
            const isSelected = selectedLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                  isSelected
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 dark:border-emerald-600 shadow-sm'
                    : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <div>
                    <span
                      className={`block font-bold text-sm leading-tight ${
                        isSelected ? 'text-emerald-900 dark:text-emerald-300' : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {lang.nativeName}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                      {lang.name}
                    </span>
                  </div>
                </div>

                {isSelected && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Action Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            10 Top Indian Languages Supported
          </span>

          <button
            onClick={onConfirm}
            className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs shadow-glow-green transition-all hover:scale-102"
          >
            <span>Continue to App / आगे बढ़ें</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
