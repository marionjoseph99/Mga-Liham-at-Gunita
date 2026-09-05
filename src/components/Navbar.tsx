import React, { useState, useEffect } from 'react';
import { Moon, Sun, Volume2, VolumeX, List, Search, Sparkles } from 'lucide-react';
import { ThemeMode, ViewMode } from '../types';
import { ambientSound } from '../utils/audio';

interface NavbarProps {
  theme: ThemeMode;
  onThemeChange: (theme: ThemeMode) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  onOpenToc: () => void;
  onOpenSearch: () => void;
  onOpenGlossary: () => void;
  poemCount: number;
  favoritesCount: number;
  activePoemTitle?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onThemeChange,
  viewMode,
  onViewModeChange,
  onOpenToc,
  onOpenSearch,
  onOpenGlossary,
  poemCount,
  favoritesCount,
  activePoemTitle,
}) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [soundMode, setSoundMode] = useState<'off' | 'rain' | 'wind'>('off');
  const [isSoundMenuOpen, setIsSoundMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const cycleTheme = () => {
    if (theme === 'papel') onThemeChange('gabi');
    else if (theme === 'gabi') onThemeChange('sepia');
    else onThemeChange('papel');
  };

  const toggleSound = (mode: 'rain' | 'wind') => {
    if (soundMode === mode) {
      ambientSound.stop();
      setSoundMode('off');
    } else {
      if (mode === 'rain') ambientSound.playRain(0.2);
      if (mode === 'wind') ambientSound.playWind(0.2);
      setSoundMode(mode);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-colors duration-300">
      {/* Scroll progress indicator line */}
      <div
        className="h-[1px] bg-black dark:bg-white transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <nav className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 py-4 flex items-center justify-between backdrop-blur-md bg-[#fdfdfc]/90 dark:bg-[#121212]/90 border-b border-[#ececec] dark:border-[#262626]">
        {/* Monogram / Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onViewModeChange('sinupan');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group flex items-center gap-2.5 text-left focus:outline-none"
            title="Bumalik sa itaas"
          >
            <span className="font-mono text-xs tracking-[0.25em] font-medium uppercase text-[#1a1a1a] dark:text-[#ededed] group-hover:text-black dark:group-hover:text-white transition-colors">
              ML&G
            </span>
            <span className="hidden md:inline-block text-[10px] uppercase tracking-[0.2em] text-[#a1a1a1]">
              / Sinupan ng mga Tula
            </span>
          </button>
        </div>

        {/* Center reading context banner if solitary reader */}
        {viewMode === 'pahina' && activePoemTitle && (
          <div className="hidden lg:flex items-center gap-2 text-[11px] font-mono tracking-widest text-[#717171] dark:text-[#a1a1a1] truncate max-w-xs">
            <span className="uppercase text-[10px] text-[#a1a1a1]">Pahina:</span>
            <span className="font-serif italic text-sm text-[#1a1a1a] dark:text-[#ededed] truncate">
              {activePoemTitle}
            </span>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* View Mode Toggle: Sinupan (Archive) vs Pahina (Focused reader) */}
          <div className="hidden sm:flex items-center border border-[#ececec] dark:border-[#262626] rounded-full p-0.5 text-xs font-mono">
            <button
              onClick={() => onViewModeChange('sinupan')}
              className={`px-3 py-1 rounded-full text-[11px] tracking-wider uppercase transition-all duration-150 ${
                viewMode === 'sinupan'
                  ? 'bg-[#1a1a1a] text-[#fdfdfc] dark:bg-[#ededed] dark:text-[#121212] font-medium'
                  : 'text-[#717171] hover:text-[#1a1a1a] dark:hover:text-[#ededed]'
              }`}
            >
              Sinupan
            </button>
            <button
              onClick={() => onViewModeChange('pahina')}
              className={`px-3 py-1 rounded-full text-[11px] tracking-wider uppercase transition-all duration-150 ${
                viewMode === 'pahina'
                  ? 'bg-[#1a1a1a] text-[#fdfdfc] dark:bg-[#ededed] dark:text-[#121212] font-medium'
                  : 'text-[#717171] hover:text-[#1a1a1a] dark:hover:text-[#ededed]'
              }`}
            >
              Pahina
            </button>
          </div>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            className="px-2.5 py-1.5 rounded-full text-xs font-mono text-[#717171] dark:text-[#a1a1a1] hover:text-[#1a1a1a] dark:hover:text-white border border-[#ececec] dark:border-[#262626] hover:border-[#1a1a1a] dark:hover:border-white transition-colors flex items-center gap-1.5"
            title="Maghanap ng tula o linya"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px] uppercase tracking-wider">Hanapin</span>
          </button>

          {/* Ambient Sound Menu Toggle */}
          <div className="relative">
            <button
              onClick={() => setIsSoundMenuOpen(!isSoundMenuOpen)}
              className={`p-2 rounded-full border transition-colors ${
                soundMode !== 'off'
                  ? 'text-black dark:text-white border-black dark:border-white'
                  : 'text-[#717171] dark:text-[#a1a1a1] border-[#ececec] dark:border-[#262626] hover:text-black dark:hover:text-white'
              }`}
              title="Tunog sa Paligid (Ambient Audio)"
            >
              {soundMode !== 'off' ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {isSoundMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 py-2 bg-[#fdfdfc] dark:bg-[#181818] border border-[#ececec] dark:border-[#262626] rounded-lg shadow-sm z-50 text-xs font-mono">
                <div className="px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#a1a1a1] border-b border-[#ececec] dark:border-[#262626] mb-1">
                  Tunog sa Paligid
                </div>
                <button
                  onClick={() => toggleSound('rain')}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#ececec]/50 dark:hover:bg-[#262626]/50 ${
                    soundMode === 'rain' ? 'text-black dark:text-white font-medium' : 'text-[#717171]'
                  }`}
                >
                  <span>Ulan sa Bubong</span>
                  {soundMode === 'rain' && <span className="text-[10px] uppercase tracking-wider">Aktibo</span>}
                </button>
                <button
                  onClick={() => toggleSound('wind')}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-[#ececec]/50 dark:hover:bg-[#262626]/50 ${
                    soundMode === 'wind' ? 'text-black dark:text-white font-medium' : 'text-[#717171]'
                  }`}
                >
                  <span>Hanging Gabi</span>
                  {soundMode === 'wind' && <span className="text-[10px] uppercase tracking-wider">Aktibo</span>}
                </button>
                {soundMode !== 'off' && (
                  <button
                    onClick={() => {
                      ambientSound.stop();
                      setSoundMode('off');
                    }}
                    className="w-full px-3 py-2 text-left text-[#717171] hover:text-red-500 border-t border-[#ececec] dark:border-[#262626] mt-1 text-[11px]"
                  >
                    Patayin ang Tunog
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Glossary button */}
          <button
            onClick={onOpenGlossary}
            className="p-2 rounded-full border border-[#ececec] dark:border-[#262626] text-[#717171] dark:text-[#a1a1a1] hover:text-black dark:hover:text-white transition-colors"
            title="Talasalitaan (Tagalog Glossary)"
          >
            <Sparkles className="w-3.5 h-3.5" />
          </button>

          {/* Theme switcher */}
          <button
            onClick={cycleTheme}
            className="p-2 rounded-full border border-[#ececec] dark:border-[#262626] text-[#717171] dark:text-[#a1a1a1] hover:text-black dark:hover:text-white transition-colors"
            title={`Tema: ${theme === 'papel' ? 'Papel' : theme === 'gabi' ? 'Gabi' : 'Sepia'}`}
          >
            {theme === 'gabi' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>

          {/* Table of Contents Trigger */}
          <button
            onClick={onOpenToc}
            className="flex items-center gap-2 text-xs font-mono tracking-widest uppercase px-3.5 py-1.5 rounded-full bg-[#1a1a1a] text-[#fdfdfc] dark:bg-[#ededed] dark:text-[#121212] hover:opacity-85 transition-opacity"
            title="Talaan ng mga Tula"
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline text-[11px] font-medium">Talaan</span>
            <span className="text-[10px] opacity-70 font-mono">({poemCount})</span>
          </button>
        </div>
      </nav>
    </header>
  );
};
