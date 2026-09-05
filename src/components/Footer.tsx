import React from 'react';
import { ArrowUp, Sparkles } from 'lucide-react';

interface FooterProps {
  onScrollToTop: () => void;
  onOpenGlossary: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onScrollToTop,
  onOpenGlossary,
}) => {
  return (
    <footer className="w-full max-w-4xl mx-auto px-6 sm:px-10 py-24 sm:py-32 text-center border-t border-[#ececec] dark:border-[#262626] mt-20">
      <span className="text-[10px] font-mono tracking-[0.3em] uppercase text-[#a1a1a1] block mb-4">
        Tala sa Sinupan
      </span>

      <h3 className="text-3xl sm:text-4xl font-serif italic mb-6 text-[#1a1a1a] dark:text-[#ededed]">
        Tungkol sa Sinupan
      </h3>

      <p className="text-base sm:text-lg text-[#717171] dark:text-[#a1a1a1] leading-loose max-w-2xl mx-auto font-serif mb-10">
        Ito ay isang pampublikong sinupan ng mga pahinang hindi naipadala. Mga emosyong isinulat sa gilid ng resibo, sa likod ng mga lumang litrato, o sa hangin noong mga gabing hindi makatulog. Hindi lahat ng nararamdaman ay kailangang marinig ng mundo, ngunit lahat sila ay nararapat na magkaroon ng espasyo kung saan sila ay totoo.
      </p>

      {/* Auxiliary links */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono uppercase tracking-wider mb-12">
        <button
          onClick={onOpenGlossary}
          className="text-[#717171] hover:text-black dark:hover:text-white hover:underline flex items-center gap-1.5 transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Talasalitaan ng Sinupan</span>
        </button>
      </div>

      <div className="flex flex-col items-center gap-6">
        <button
          onClick={onScrollToTop}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#ececec] dark:border-[#262626] hover:border-black dark:hover:border-white text-[11px] font-mono uppercase tracking-wider text-[#717171] hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowUp className="w-3.5 h-3.5" />
          <span>Bumalik sa Itaas</span>
        </button>

        <p className="text-[10px] font-mono tracking-[0.25em] uppercase text-[#a1a1a1]">
          © 2025–2026 • Pilipinas • Sinupan ng mga Tula
        </p>
      </div>
    </footer>
  );
};
