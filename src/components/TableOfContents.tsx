import React, { useState } from 'react';
import { X, Search, Bookmark, Sparkles, BookOpen, Filter } from 'lucide-react';
import { Poem } from '../types';

interface TableOfContentsProps {
  poems: Poem[];
  favorites: string[];
  isOpen: boolean;
  onClose: () => void;
  onSelectPoem: (poem: Poem, mode?: 'scroll' | 'reader') => void;
  isOverlay?: boolean;
}

export const TableOfContents: React.FC<TableOfContentsProps> = ({
  poems,
  favorites,
  isOpen,
  onClose,
  onSelectPoem,
  isOverlay = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'lahat' | 'lungsod' | 'pamahiin' | 'pangungulila' | 'katatagan' | 'paborito'>('lahat');

  const filteredPoems = poems.filter((poem) => {
    // Category filter
    if (activeFilter === 'paborito') {
      if (!favorites.includes(poem.id)) return false;
    } else if (activeFilter !== 'lahat') {
      if (poem.theme !== activeFilter) return false;
    }

    // Search query
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      poem.title.toLowerCase().includes(query) ||
      poem.content.toLowerCase().includes(query) ||
      poem.meta.toLowerCase().includes(query) ||
      poem.locationOrContext.toLowerCase().includes(query)
    );
  });

  const content = (
    <div className="w-full">
      {/* Header if Overlay */}
      {isOverlay && (
        <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#ececec] dark:border-[#262626]">
          <div>
            <h2 className="font-serif italic text-3xl sm:text-4xl text-[#1a1a1a] dark:text-[#ededed]">
              Talaan ng mga Tula
            </h2>
            <p className="font-mono text-[10px] text-[#a1a1a1] uppercase tracking-[0.25em] mt-1.5">
              Sinupan ng {poems.length} Akda
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full border border-[#ececec] dark:border-[#262626] hover:border-black dark:hover:border-white text-[#717171] hover:text-black dark:hover:text-white transition-colors"
            title="Isara ang talaan"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mb-6">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#a1a1a1]" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Maghanap ayon sa pamagat, salita, o pook (hal. 'Pureza', 'Batman', 'luha')..."
          className="w-full pl-10 pr-16 py-2.5 rounded-full bg-transparent border border-[#ececec] dark:border-[#262626] focus:border-black dark:focus:border-white text-xs font-mono text-[#1a1a1a] dark:text-[#ededed] placeholder:text-[#a1a1a1] focus:outline-none transition-colors"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono uppercase tracking-wider text-[#a1a1a1] hover:text-black dark:hover:text-white"
          >
            Alisin
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none text-xs font-mono">
        <button
          onClick={() => setActiveFilter('lahat')}
          className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors ${
            activeFilter === 'lahat'
              ? 'bg-[#1a1a1a] text-[#fdfdfc] dark:bg-[#ededed] dark:text-[#121212] font-medium'
              : 'border border-[#ececec] dark:border-[#262626] text-[#717171] hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
          }`}
        >
          Lahat ({poems.length})
        </button>
        <button
          onClick={() => setActiveFilter('lungsod')}
          className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors ${
            activeFilter === 'lungsod'
              ? 'bg-[#1a1a1a] text-[#fdfdfc] dark:bg-[#ededed] dark:text-[#121212] font-medium'
              : 'border border-[#ececec] dark:border-[#262626] text-[#717171] hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
          }`}
        >
          Biyahe & Lungsod
        </button>
        <button
          onClick={() => setActiveFilter('pamahiin')}
          className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors ${
            activeFilter === 'pamahiin'
              ? 'bg-[#1a1a1a] text-[#fdfdfc] dark:bg-[#ededed] dark:text-[#121212] font-medium'
              : 'border border-[#ececec] dark:border-[#262626] text-[#717171] hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
          }`}
        >
          Pamahiin
        </button>
        <button
          onClick={() => setActiveFilter('pangungulila')}
          className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors ${
            activeFilter === 'pangungulila'
              ? 'bg-[#1a1a1a] text-[#fdfdfc] dark:bg-[#ededed] dark:text-[#121212] font-medium'
              : 'border border-[#ececec] dark:border-[#262626] text-[#717171] hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
          }`}
        >
          Pangungulila
        </button>
        <button
          onClick={() => setActiveFilter('katatagan')}
          className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider whitespace-nowrap transition-colors ${
            activeFilter === 'katatagan'
              ? 'bg-[#1a1a1a] text-[#fdfdfc] dark:bg-[#ededed] dark:text-[#121212] font-medium'
              : 'border border-[#ececec] dark:border-[#262626] text-[#717171] hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
          }`}
        >
          Katatagan
        </button>
        <button
          onClick={() => setActiveFilter('paborito')}
          className={`px-3.5 py-1.5 rounded-full text-[11px] uppercase tracking-wider whitespace-nowrap flex items-center gap-1.5 transition-colors ${
            activeFilter === 'paborito'
              ? 'bg-[#1a1a1a] text-[#fdfdfc] dark:bg-[#ededed] dark:text-[#121212] font-medium'
              : 'border border-[#ececec] dark:border-[#262626] text-[#717171] hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white'
          }`}
        >
          <Bookmark className="w-3 h-3" />
          <span>Mga Paborito ({favorites.length})</span>
        </button>
      </div>

      {/* Poems List */}
      {filteredPoems.length === 0 ? (
        <div className="py-16 text-center text-[#717171]">
          <p className="font-serif italic text-2xl mb-1 text-[#1a1a1a] dark:text-[#ededed]">Walang natagpuang tula</p>
          <p className="font-mono text-xs">Subukan ang ibang salita o alisin ang filter.</p>
        </div>
      ) : (
        <ul className="list-none p-0 m-0 grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredPoems.map((poem) => {
            const isFav = favorites.includes(poem.id);
            const globalIndex = poems.findIndex((p) => p.id === poem.id);
            const formattedIndex = globalIndex + 1 < 10 ? `00${globalIndex + 1}` : `0${globalIndex + 1}`;

            return (
              <li
                key={poem.id}
                className="group relative p-6 rounded-lg border border-[#ececec] dark:border-[#262626] hover:border-black dark:hover:border-white transition-colors bg-transparent flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-baseline justify-between mb-3">
                    <div className="flex items-baseline gap-3">
                      <span className="font-mono text-xs text-[#a1a1a1] tracking-[0.2em]">
                        {formattedIndex}
                      </span>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#717171]">
                        {poem.year} • {poem.themeLabel}
                      </span>
                    </div>
                    {isFav && <Bookmark className="w-3.5 h-3.5 text-black dark:text-white fill-current" />}
                  </div>

                  <h3 className="text-3xl font-handwriting font-medium text-[#1a1a1a] dark:text-[#ededed] group-hover:underline underline-offset-4 transition-colors mb-1 leading-tight">
                    {poem.title}
                  </h3>

                  <p className="text-[11px] font-mono text-[#717171] uppercase tracking-wider line-clamp-1 mb-3">
                    {poem.locationOrContext}
                  </p>

                  {/* Snip of first line */}
                  <p className="text-xs font-serif italic text-[#717171] dark:text-[#a1a1a1] line-clamp-2 border-l border-[#ececec] dark:border-[#262626] pl-3 mb-4 leading-relaxed">
                    {poem.stanzas[0]}
                  </p>
                </div>

                {/* Direct Action Choices */}
                <div className="flex items-center gap-3 pt-3 border-t border-[#ececec] dark:border-[#262626] text-[11px] font-mono uppercase tracking-wider">
                  <button
                    onClick={() => {
                      onSelectPoem(poem, 'scroll');
                      if (isOverlay) onClose();
                    }}
                    className="hover:underline underline-offset-4 text-[#1a1a1a] dark:text-[#ededed]"
                  >
                    Basahin sa Sinupan →
                  </button>
                  <span className="text-[#ececec] dark:text-[#262626]">•</span>
                  <button
                    onClick={() => {
                      onSelectPoem(poem, 'reader');
                      if (isOverlay) onClose();
                    }}
                    className="text-[#717171] hover:text-black dark:hover:text-white flex items-center gap-1"
                  >
                    <BookOpen className="w-3 h-3" />
                    <span>Pahina</span>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );

  if (isOverlay) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
        <div
          className="w-full max-w-4xl max-h-[88vh] overflow-y-auto rounded-xl p-6 sm:p-10 bg-[#fdfdfc] dark:bg-[#181818] border border-[#ececec] dark:border-[#262626] shadow-xl"
          onClick={(e) => e.stopPropagation()}
        >
          {content}
        </div>
      </div>
    );
  }

  // Inline Section in continuous archive
  return (
    <section className="w-full max-w-5xl mx-auto px-6 sm:px-10 py-20 sm:py-24 border-t border-[#ececec] dark:border-[#262626]">
      <div className="text-center mb-12">
        <span className="text-[10px] font-mono tracking-[0.3em] text-[#a1a1a1] uppercase block mb-2">
          Talaan at Sinupan
        </span>
        <h2 className="text-3xl sm:text-4xl font-serif italic text-[#1a1a1a] dark:text-[#ededed]">
          Mga Akdang Mababasa
        </h2>
      </div>
      {content}
    </section>
  );
};
