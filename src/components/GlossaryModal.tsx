import React from 'react';
import { X, Sparkles, BookOpen } from 'lucide-react';
import { GLOSSARY } from '../data/initialPoems';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GlossaryModal: React.FC<GlossaryModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-xl bg-[#fdfdfc] dark:bg-[#181818] border border-[#ececec] dark:border-[#262626] shadow-xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 mb-6 border-b border-[#ececec] dark:border-[#262626]">
          <div className="flex items-center gap-2.5 text-[#1a1a1a] dark:text-[#ededed]">
            <Sparkles className="w-4 h-4" />
            <h2 className="font-serif italic text-2xl sm:text-3xl text-[#1a1a1a] dark:text-[#ededed]">
              Talasalitaan ng Sinupan
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-[#717171] hover:text-black dark:hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-[10px] font-mono text-[#a1a1a1] uppercase tracking-[0.2em] mb-6">
          Mga piling salitang Tagalog at ang kanilang malalalim na kahulugan sa mga tula.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {GLOSSARY.map((item, idx) => (
            <div
              key={idx}
              className="p-5 rounded-lg border border-[#ececec] dark:border-[#262626] bg-transparent space-y-1.5"
            >
              <div className="flex items-baseline justify-between">
                <h3 className="font-serif italic text-xl text-[#1a1a1a] dark:text-[#ededed]">
                  {item.word}
                </h3>
                <span className="text-[9px] font-mono uppercase tracking-wider text-[#a1a1a1]">
                  Pahiwatig
                </span>
              </div>
              <p className="text-xs font-serif text-[#1a1a1a] dark:text-[#ededed] leading-relaxed">
                {item.meaning}
              </p>
              <p className="text-[10px] font-mono text-[#717171] uppercase tracking-wider pt-1">
                {item.context}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 pt-4 border-t border-[#ececec] dark:border-[#262626] text-center">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-full bg-[#1a1a1a] text-[#fdfdfc] dark:bg-[#ededed] dark:text-[#121212] text-[11px] font-mono uppercase tracking-wider hover:opacity-90 transition-opacity font-medium"
          >
            Ipagpatuloy ang Pagbasa
          </button>
        </div>
      </div>
    </div>
  );
};
