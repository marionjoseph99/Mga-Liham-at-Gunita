import React from 'react';
import { ArrowDown, Shuffle, BookOpen, Compass } from 'lucide-react';
import { Poem } from '../types';

interface HeroProps {
  totalPoems: number;
  onExploreClick: () => void;
  onRandomPoemClick: () => void;
  onStartReading: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  totalPoems,
  onExploreClick,
  onRandomPoemClick,
  onStartReading,
}) => {
  return (
    <header className="min-h-[88vh] flex flex-col items-center justify-center text-center px-6 sm:px-12 relative w-full max-w-5xl mx-auto pt-28 pb-16">
      {/* Minimalist Top Stamp */}
      <span className="text-[10px] uppercase tracking-[0.3em] text-[#a1a1a1] dark:text-[#717171] mb-8 block">
        Sinupan ng Panitikan • 2025 — 2026
      </span>

      {/* Main Title in High-Contrast Minimalist Editorial Serif */}
      <div className="relative select-none max-w-3xl">
        <h1 className="text-6xl sm:text-7xl md:text-9xl font-serif font-light tracking-tight leading-none text-[#1a1a1a] dark:text-[#ededed] mb-3">
          Mga Liham
        </h1>
        <h2 className="text-5xl sm:text-6xl md:text-8xl font-serif italic font-normal tracking-wide text-[#1a1a1a] dark:text-[#ededed] ml-6 sm:ml-20 md:ml-28">
          & Gunita
        </h2>
      </div>

      <div className="w-12 h-px bg-[#ececec] dark:bg-[#262626] my-8 sm:my-10" />

      {/* Subtitle / Poetic Proem */}
      <div className="max-w-md mx-auto space-y-3">
        <p className="text-xs sm:text-sm font-mono text-[#717171] dark:text-[#a1a1a1] uppercase tracking-[0.25em] leading-relaxed">
          Mga salitang tinangay ng hangin,
          <br />
          tinipon muli dito.
        </p>
        <p className="text-xs sm:text-sm font-serif italic text-[#a1a1a1] dark:text-[#717171] max-w-sm mx-auto">
          Isang maingat na pampublikong sinupan ng {totalPoems} akda at gunita.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-10 sm:mt-12 flex flex-wrap items-center justify-center gap-3 sm:gap-4 text-xs font-mono">
        <button
          onClick={onStartReading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#1a1a1a] text-[#fdfdfc] dark:bg-[#ededed] dark:text-[#121212] tracking-widest uppercase hover:opacity-90 transition-opacity"
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>Simulang Magbasa</span>
        </button>

        <button
          onClick={onExploreClick}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#ececec] dark:border-[#262626] text-[#717171] dark:text-[#a1a1a1] hover:text-[#1a1a1a] dark:hover:text-white hover:border-[#1a1a1a] dark:hover:border-white tracking-widest uppercase transition-colors"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Talaan ({totalPoems})</span>
        </button>

        <button
          onClick={onRandomPoemClick}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full border border-[#ececec] dark:border-[#262626] text-[#717171] dark:text-[#a1a1a1] hover:text-[#1a1a1a] dark:hover:text-white hover:border-[#1a1a1a] dark:hover:border-white tracking-widest uppercase transition-colors"
          title="Buksan ang isang sapalarang tula"
        >
          <Shuffle className="w-3 h-3" />
          <span className="hidden sm:inline">Sapalarang Tula</span>
        </button>
      </div>

      {/* Subtle Scroll Down Prompt */}
      <button
        onClick={onStartReading}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-[#a1a1a1] hover:text-[#1a1a1a] dark:hover:text-white transition-colors group"
      >
        <span className="text-[9px] font-mono uppercase tracking-[0.3em]">
          Pumanaog
        </span>
        <ArrowDown className="w-3.5 h-3.5" />
      </button>
    </header>
  );
};
