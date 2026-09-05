import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, Volume2, VolumeX, Bookmark, BookmarkCheck, Quote, Sparkles, Share2 } from 'lucide-react';
import { Poem } from '../types';

interface SolitaryReaderProps {
  poem: Poem;
  allPoems: Poem[];
  onSelectPoem: (poem: Poem) => void;
  onBackToArchive: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenQuoteModal: (poem: Poem, stanzaText?: string) => void;
}

export const SolitaryReader: React.FC<SolitaryReaderProps> = ({
  poem,
  allPoems,
  onSelectPoem,
  onBackToArchive,
  isFavorite,
  onToggleFavorite,
  onOpenQuoteModal,
}) => {
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('md');
  const [isReadingAloud, setIsReadingAloud] = useState(false);
  const [showReflection, setShowReflection] = useState(false);

  const currentIndex = allPoems.findIndex(p => p.id === poem.id);
  const prevPoem = currentIndex > 0 ? allPoems[currentIndex - 1] : null;
  const nextPoem = currentIndex < allPoems.length - 1 ? allPoems[currentIndex + 1] : null;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && prevPoem) {
        onSelectPoem(prevPoem);
      } else if (e.key === 'ArrowRight' && nextPoem) {
        onSelectPoem(nextPoem);
      } else if (e.key === 'Escape') {
        onBackToArchive();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPoem, nextPoem, onSelectPoem, onBackToArchive]);

  // Scroll to top when poem changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsReadingAloud(false);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, [poem.id]);

  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert('Paumanhin, hindi sinusuportahan ng iyong browser ang speech synthesis.');
      return;
    }

    if (isReadingAloud) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${poem.title}. ${poem.content}`);
    utterance.lang = 'tl-PH';
    utterance.rate = 0.88;
    utterance.onend = () => setIsReadingAloud(false);
    utterance.onerror = () => setIsReadingAloud(false);

    window.speechSynthesis.speak(utterance);
    setIsReadingAloud(true);
  };

  const getFontSizeClass = () => {
    switch (fontSize) {
      case 'sm': return 'text-xl sm:text-2xl leading-[1.7]';
      case 'lg': return 'text-2xl sm:text-3xl lg:text-4xl leading-[1.8]';
      case 'xl': return 'text-3xl sm:text-4xl lg:text-5xl leading-[1.85]';
      case 'md':
      default:
        return 'text-2xl sm:text-[1.75rem] leading-[1.75]';
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-32 px-6 sm:px-10 md:px-14 lg:px-16 max-w-6xl mx-auto flex flex-col justify-between">
      {/* Top Bar for Solitary Reader */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-6 mb-8 border-b border-[#ececec] dark:border-[#262626]">
        <button
          onClick={onBackToArchive}
          className="flex items-center gap-2 text-[11px] font-mono tracking-widest uppercase text-[#717171] hover:text-black dark:hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Bumalik sa Sinupan</span>
        </button>

        {/* Reader Customization (Font size & Typeface) */}
        <div className="flex items-center gap-2 border border-[#ececec] dark:border-[#262626] rounded-full px-3 py-1 text-xs font-mono">
          {/* Size */}
          <button
            onClick={() => {
              if (fontSize === 'xl') setFontSize('lg');
              else if (fontSize === 'lg') setFontSize('md');
              else if (fontSize === 'md') setFontSize('sm');
            }}
            disabled={fontSize === 'sm'}
            className="px-1 disabled:opacity-30 text-[#717171] hover:text-black dark:hover:text-white"
            title="Paliitin ang titik"
          >
            A-
          </button>
          <span className="text-[9px] uppercase tracking-wider text-[#a1a1a1]">{fontSize}</span>
          <button
            onClick={() => {
              if (fontSize === 'sm') setFontSize('md');
              else if (fontSize === 'md') setFontSize('lg');
              else if (fontSize === 'lg') setFontSize('xl');
            }}
            disabled={fontSize === 'xl'}
            className="px-1 disabled:opacity-30 text-[#717171] hover:text-black dark:hover:text-white"
            title="Palakihin ang titik"
          >
            A+
          </button>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onToggleFavorite(poem.id)}
            className={`p-2 rounded-full border transition-colors ${
              isFavorite
                ? 'bg-[#1a1a1a] border-[#1a1a1a] text-white dark:bg-white dark:border-white dark:text-black'
                : 'border-[#ececec] dark:border-[#262626] text-[#717171] hover:text-black dark:hover:text-white'
            }`}
            title="Markahan"
          >
            {isFavorite ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={handleReadAloud}
            className={`p-2 rounded-full border transition-colors ${
              isReadingAloud ? 'bg-[#1a1a1a] text-white border-black dark:bg-white dark:text-black' : 'border-[#ececec] dark:border-[#262626] text-[#717171] hover:text-black dark:hover:text-white'
            }`}
            title="Makinig sa boses"
          >
            {isReadingAloud ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>
          <button
            onClick={() => onOpenQuoteModal(poem)}
            className="px-3 py-1.5 rounded-full border border-[#ececec] dark:border-[#262626] text-[#717171] hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-colors flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider"
            title="I-save ang buong tula bilang kard para sa social media"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">I-save ang Kard</span>
          </button>
        </div>
      </div>

      {/* Main Poem Reading Stage - Left Title, Right Poem, strictly left-aligned */}
      <article className="my-auto py-10 sm:py-16 w-full">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 lg:gap-24 items-start">
          {/* Left Side: Title & Meta, strictly left-aligned */}
          <div className="md:col-span-5 lg:col-span-5 md:sticky md:top-24 space-y-4">
            <span className="font-mono text-[10px] tracking-[0.3em] text-[#a1a1a1] uppercase block text-left">
              {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1} ng {allPoems.length} • {poem.themeLabel}
            </span>

            <h1 className="font-handwriting text-5xl sm:text-6xl md:text-7xl lg:text-[5.25rem] font-medium leading-[1.02] text-[#1a1a1a] dark:text-[#ededed] tracking-normal text-left max-w-sm">
              {poem.title}
            </h1>

            <p className="font-mono text-xs sm:text-[13px] tracking-[0.2em] text-[#717171] dark:text-[#a1a1a1] uppercase leading-relaxed text-left pt-1">
              {poem.meta}
            </p>

            {/* Optional Reflection */}
            {poem.reflection && (
              <div className="pt-6 border-t border-[#ececec] dark:border-[#262626] text-left">
                <button
                  onClick={() => setShowReflection(!showReflection)}
                  className="text-[11px] font-mono text-[#717171] hover:text-black dark:hover:text-white uppercase tracking-wider inline-flex items-center gap-1.5 mb-2 focus:outline-none"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{showReflection ? 'Itago ang pagninilay' : 'Pagninilay'}</span>
                </button>
                {showReflection && (
                  <p className="text-xs font-serif italic text-[#717171] dark:text-[#a1a1a1] leading-loose animate-in fade-in duration-200">
                    "{poem.reflection}"
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Right Side: Stanzas, strictly left-aligned */}
          <div className="md:col-span-7 lg:col-span-7 space-y-10 sm:space-y-14">
            {poem.stanzas.map((stanza, idx) => (
              <div
                key={idx}
                onClick={() => onOpenQuoteModal(poem, stanza)}
                className="group cursor-pointer rounded-sm p-2 -mx-2 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
                title="Pindutin upang sipiin ang saknong"
              >
                <p
                  className={`${getFontSizeClass()} font-serif whitespace-pre-line text-left leading-[1.8] sm:leading-[1.85] text-[#1a1a1a] dark:text-[#ededed] selection:bg-black/10`}
                >
                  {stanza}
                </p>
              </div>
            ))}
          </div>
        </div>
      </article>

      {/* Bottom Paging Navigation */}
      <nav className="mt-14 pt-8 border-t border-[#ececec] dark:border-[#262626] flex items-center justify-between">
        {prevPoem ? (
          <button
            onClick={() => onSelectPoem(prevPoem)}
            className="flex items-center gap-3 text-left group"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-[#717171] group-hover:text-black dark:group-hover:text-white group-hover:-translate-x-0.5 transition-transform" />
            <div>
              <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-[#a1a1a1]">
                Nakaraan
              </span>
              <span className="font-serif italic text-base sm:text-lg text-[#1a1a1a] dark:text-[#ededed] group-hover:underline underline-offset-4 transition-colors">
                {prevPoem.title}
              </span>
            </div>
          </button>
        ) : (
          <div />
        )}

        {nextPoem ? (
          <button
            onClick={() => onSelectPoem(nextPoem)}
            className="flex items-center gap-3 text-right group ml-auto"
          >
            <div>
              <span className="block text-[9px] font-mono uppercase tracking-[0.2em] text-[#a1a1a1]">
                Susunod
              </span>
              <span className="font-serif italic text-base sm:text-lg text-[#1a1a1a] dark:text-[#ededed] group-hover:underline underline-offset-4 transition-colors">
                {nextPoem.title}
              </span>
            </div>
            <ArrowRight className="w-3.5 h-3.5 text-[#717171] group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
};
