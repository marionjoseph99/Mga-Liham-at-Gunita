import React, { useState } from 'react';
import { Bookmark, BookmarkCheck, Volume2, VolumeX, Quote, BookOpen, ChevronDown, ChevronUp, Sparkles, Share2 } from 'lucide-react';
import { Poem } from '../types';

interface PoemSectionProps {
  poem: Poem;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenQuoteModal: (poem: Poem, stanzaText?: string) => void;
  onOpenSolitaryReader: (poem: Poem) => void;
  onGlossaryTermClick?: (term: string) => void;
}

export const PoemSection: React.FC<PoemSectionProps> = ({
  poem,
  index,
  isFavorite,
  onToggleFavorite,
  onOpenQuoteModal,
  onOpenSolitaryReader,
  onGlossaryTermClick,
}) => {
  const [showReflection, setShowReflection] = useState(false);
  const [isReadingAloud, setIsReadingAloud] = useState(false);

  const formattedIndex = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;

  const handleReadAloud = () => {
    if (!('speechSynthesis' in window)) {
      alert('Paumanhin, hindi sinusuportahan ng iyong browser ang pagbasa ng boses.');
      return;
    }

    if (isReadingAloud) {
      window.speechSynthesis.cancel();
      setIsReadingAloud(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${poem.title}. ${poem.content}`);
    utterance.lang = 'tl-PH'; // Tagalog
    utterance.rate = 0.88; // Poetic, contemplative pacing
    utterance.pitch = 0.95;

    utterance.onend = () => setIsReadingAloud(false);
    utterance.onerror = () => setIsReadingAloud(false);

    window.speechSynthesis.speak(utterance);
    setIsReadingAloud(true);
  };

  return (
    <section
      id={`tula-${poem.id}`}
      className="w-full min-h-[60vh] py-20 sm:py-28 md:py-36 border-t border-[#ececec] dark:border-[#262626] first:border-0 relative scroll-mt-24"
    >
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-14 lg:gap-20 items-start w-full">
        {/* Left Column: Sticky Title, Meta, and Controls */}
        <div className="md:col-span-5 lg:col-span-5 relative">
          <div className="md:sticky md:top-28 z-20 space-y-4">
            {/* Number and Theme tag */}
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs text-[#a1a1a1] dark:text-[#717171] tracking-[0.2em]">
                {formattedIndex}
              </span>
              <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#717171] dark:text-[#a1a1a1]">
                {poem.themeLabel}
              </span>
              <span className="text-[10px] font-mono tracking-wider text-[#a1a1a1]">
                • {poem.estimatedReadTime}
              </span>
            </div>

            {/* Handwritten Title mirroring the original style */}
            <h2 className="font-handwriting text-5xl sm:text-6xl md:text-7xl lg:text-[5rem] font-medium leading-[1.05] text-[#1a1a1a] dark:text-[#ededed] tracking-normal text-left max-w-xs sm:max-w-sm">
              {poem.title}
            </h2>

            {/* Metadata (Context / Date) strictly left-aligned */}
            <p className="font-mono text-xs sm:text-[13px] tracking-[0.2em] text-[#717171] dark:text-[#a1a1a1] uppercase leading-relaxed text-left pt-1">
              {poem.meta}
            </p>

            {/* Interactive Actions for this poem */}
            <div className="pt-2 flex flex-wrap items-center gap-2 text-xs font-mono">
              {/* Bookmark */}
              <button
                onClick={() => onToggleFavorite(poem.id)}
                className={`px-2.5 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
                  isFavorite
                    ? 'bg-[#1a1a1a] text-[#fdfdfc] border-[#1a1a1a] dark:bg-[#ededed] dark:text-[#121212] dark:border-[#ededed]'
                    : 'border-[#ececec] dark:border-[#262626] text-[#717171] dark:text-[#a1a1a1] hover:border-[#1a1a1a] hover:text-[#1a1a1a] dark:hover:border-white dark:hover:text-white'
                }`}
                title={isFavorite ? 'Alisin sa mga paborito' : 'Itala sa mga paborito'}
              >
                {isFavorite ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                <span className="text-[10px] uppercase tracking-wider hidden sm:inline">{isFavorite ? 'Nakamarka' : 'Markahan'}</span>
              </button>

              {/* Read Aloud */}
              <button
                onClick={handleReadAloud}
                className={`px-2.5 py-1.5 rounded-full border transition-colors flex items-center gap-1.5 ${
                  isReadingAloud
                    ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] dark:bg-white dark:text-black dark:border-white'
                    : 'border-[#ececec] dark:border-[#262626] text-[#717171] dark:text-[#a1a1a1] hover:border-[#1a1a1a] hover:text-[#1a1a1a] dark:hover:border-white dark:hover:text-white'
                }`}
                title={isReadingAloud ? 'Ihinto ang pagbasa' : 'Pakinggan ang tula'}
              >
                {isReadingAloud ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span className="text-[10px] uppercase tracking-wider hidden sm:inline">{isReadingAloud ? 'Ihinto' : 'Makinig'}</span>
              </button>

              {/* Solitary Focus Mode */}
              <button
                onClick={() => onOpenSolitaryReader(poem)}
                className="px-2.5 py-1.5 rounded-full border border-[#ececec] dark:border-[#262626] text-[#717171] dark:text-[#a1a1a1] hover:border-[#1a1a1a] hover:text-[#1a1a1a] dark:hover:border-white dark:hover:text-white transition-colors flex items-center gap-1.5"
                title="Basahin sa sariling tahimik na pahina"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Pahina</span>
              </button>

              {/* Save / Share Whole Poem Card */}
              <button
                onClick={() => onOpenQuoteModal(poem)}
                className="px-2.5 py-1.5 rounded-full border border-[#ececec] dark:border-[#262626] text-[#717171] dark:text-[#a1a1a1] hover:border-[#1a1a1a] hover:text-[#1a1a1a] dark:hover:border-white dark:hover:text-white transition-colors flex items-center gap-1.5"
                title="I-save ang buong tula bilang kard para sa social media"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span className="text-[10px] uppercase tracking-wider hidden sm:inline">I-save ang Kard</span>
              </button>
            </div>

            {/* Expandable Munting Pagninilay (Poetic Reflection) */}
            {poem.reflection && (
              <div className="pt-2">
                <button
                  onClick={() => setShowReflection(!showReflection)}
                  className="text-[11px] font-mono text-[#717171] dark:text-[#a1a1a1] hover:text-black dark:hover:text-white uppercase tracking-wider flex items-center gap-1 focus:outline-none"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>{showReflection ? 'Itago ang pagninilay' : 'Pagninilay'}</span>
                  {showReflection ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
                {showReflection && (
                  <div className="mt-3 pl-4 border-l border-black dark:border-white text-xs font-serif italic leading-loose text-[#717171] dark:text-[#a1a1a1] animate-in fade-in duration-200">
                    "{poem.reflection}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Scrolling Poem Content & Stanzas */}
        <div className="md:col-span-7 lg:col-span-7 mt-4 md:mt-0">
          <div className="poem-content font-serif space-y-10 sm:space-y-12">
            {poem.stanzas.map((stanza, sIdx) => (
              <div
                key={sIdx}
                className="group relative rounded-sm p-2 -mx-2 transition-colors hover:bg-black/[0.02] dark:hover:bg-white/[0.02]"
              >
                {/* Verse quote hover action button */}
                <button
                  onClick={() => onOpenQuoteModal(poem, stanza)}
                  className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded text-[10px] font-mono uppercase tracking-wider text-[#717171] bg-[#fdfdfc] dark:bg-[#181818] border border-[#ececec] dark:border-[#262626] hover:text-black dark:hover:text-white flex items-center gap-1"
                  title="Sipiin ang saknong na ito"
                >
                  <Quote className="w-2.5 h-2.5" />
                  <span>Sipiin</span>
                </button>

                <p className="text-xl sm:text-2xl md:text-[1.45rem] lg:text-[1.55rem] font-serif leading-[1.8] sm:leading-[1.85] text-[#1a1a1a] dark:text-[#ededed] whitespace-pre-line tracking-normal text-left">
                  {stanza}
                </p>
              </div>
            ))}
          </div>

          {/* End of poem divider */}
          <div className="mt-14 w-12 h-px bg-[#ececec] dark:bg-[#262626]" />
        </div>
      </div>
    </section>
  );
};
