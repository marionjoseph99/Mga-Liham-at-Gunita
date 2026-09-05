import React, { useState, useEffect } from 'react';
import { Poem, ThemeMode, ViewMode } from './types';
import { INITIAL_POEMS } from './data/initialPoems';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TableOfContents } from './components/TableOfContents';
import { PoemSection } from './components/PoemSection';
import { SolitaryReader } from './components/SolitaryReader';
import { QuoteModal } from './components/QuoteModal';
import { GlossaryModal } from './components/GlossaryModal';
import { Footer } from './components/Footer';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('mga_liham_theme');
    if (saved === 'gabi' || saved === 'sepia' || saved === 'papel') return saved;
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) return 'gabi';
    return 'papel';
  });

  // View mode: 'sinupan' (continuous scroll) or 'pahina' (solitary reader)
  const [viewMode, setViewMode] = useState<ViewMode>('sinupan');

  // Hardcoded curated poems archive for public view
  const poems: Poem[] = INITIAL_POEMS;

  // Favorites state for public reader's personal bookmarks
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('mga_liham_favorites');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  // Active poem for solitary reader
  const [activePoem, setActivePoem] = useState<Poem>(poems[0]);

  // Modal states
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [quoteState, setQuoteState] = useState<{
    isOpen: boolean;
    poem: Poem | null;
    stanzaText?: string;
  }>({
    isOpen: false,
    poem: null,
  });

  // Synchronize HTML theme class
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark', 'sepia-theme');

    if (theme === 'gabi') {
      root.classList.add('dark');
    } else if (theme === 'sepia') {
      root.classList.add('sepia-theme');
    }
    localStorage.setItem('mga_liham_theme', theme);
  }, [theme]);

  // Toggle favorite
  const handleToggleFavorite = (poemId: string) => {
    setFavorites((prev) => {
      const next = prev.includes(poemId) ? prev.filter((id) => id !== poemId) : [...prev, poemId];
      localStorage.setItem('mga_liham_favorites', JSON.stringify(next));
      return next;
    });
  };

  // Select poem from TOC or buttons
  const handleSelectPoem = (poem: Poem, mode: 'scroll' | 'reader' = 'scroll') => {
    setActivePoem(poem);
    if (mode === 'reader') {
      setViewMode('pahina');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setViewMode('sinupan');
      setTimeout(() => {
        const el = document.getElementById(`tula-${poem.id}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  };

  // Open quote modal
  const handleOpenQuoteModal = (poem: Poem, stanzaText?: string) => {
    setQuoteState({
      isOpen: true,
      poem,
      stanzaText,
    });
  };

  // Random poem selector
  const handleRandomPoem = () => {
    const randomIndex = Math.floor(Math.random() * poems.length);
    const chosen = poems[randomIndex];
    handleSelectPoem(chosen, 'reader');
  };

  // Theme styling variables
  const themeBgClasses = {
    papel: 'bg-[#fdfdfc] text-[#1a1a1a]',
    gabi: 'bg-[#121212] text-[#ededed]',
    sepia: 'bg-[#f8f6f0] text-[#242220]',
  }[theme];

  return (
    <div className={`min-h-screen relative font-sans transition-colors duration-300 selection:bg-black/10 dark:selection:bg-white/15 selection:text-inherit ${themeBgClasses}`}>
      {/* Navigation Bar */}
      <Navbar
        theme={theme}
        onThemeChange={setTheme}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onOpenToc={() => setIsTocOpen(true)}
        onOpenSearch={() => setIsTocOpen(true)}
        onOpenGlossary={() => setIsGlossaryOpen(true)}
        poemCount={poems.length}
        favoritesCount={favorites.length}
        activePoemTitle={activePoem?.title}
      />

      {/* VIEW MODE 1: Continuous Archive Scroll (Sinupan) */}
      {viewMode === 'sinupan' && (
        <main className="relative z-10">
          {/* Hero Section */}
          <Hero
            totalPoems={poems.length}
            onExploreClick={() => setIsTocOpen(true)}
            onRandomPoemClick={handleRandomPoem}
            onStartReading={() => {
              const firstPoemEl = document.getElementById(`tula-${poems[0].id}`);
              if (firstPoemEl) firstPoemEl.scrollIntoView({ behavior: 'smooth' });
            }}
          />

          {/* Inline Table of Contents */}
          <TableOfContents
            poems={poems}
            favorites={favorites}
            isOpen={false}
            onClose={() => {}}
            onSelectPoem={handleSelectPoem}
            isOverlay={false}
          />

          {/* Main Poem Stream */}
          <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-12 lg:px-16 pb-20">
            {poems.map((poem, index) => (
              <PoemSection
                key={poem.id}
                poem={poem}
                index={index}
                isFavorite={favorites.includes(poem.id)}
                onToggleFavorite={handleToggleFavorite}
                onOpenQuoteModal={handleOpenQuoteModal}
                onOpenSolitaryReader={(p) => handleSelectPoem(p, 'reader')}
              />
            ))}
          </div>

          {/* Footer */}
          <Footer
            onScrollToTop={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            onOpenGlossary={() => setIsGlossaryOpen(true)}
          />
        </main>
      )}

      {/* VIEW MODE 2: Solitary Reader Room (Pahina) */}
      {viewMode === 'pahina' && (
        <main className="relative z-10">
          <SolitaryReader
            poem={activePoem}
            allPoems={poems}
            onSelectPoem={(p) => setActivePoem(p)}
            onBackToArchive={() => setViewMode('sinupan')}
            isFavorite={favorites.includes(activePoem.id)}
            onToggleFavorite={handleToggleFavorite}
            onOpenQuoteModal={handleOpenQuoteModal}
          />
        </main>
      )}

      {/* Modals and Drawers */}
      <TableOfContents
        poems={poems}
        favorites={favorites}
        isOpen={isTocOpen}
        onClose={() => setIsTocOpen(false)}
        onSelectPoem={handleSelectPoem}
        isOverlay={true}
      />

      <QuoteModal
        isOpen={quoteState.isOpen}
        poem={quoteState.poem}
        stanzaText={quoteState.stanzaText}
        onClose={() => setQuoteState({ isOpen: false, poem: null })}
      />

      <GlossaryModal
        isOpen={isGlossaryOpen}
        onClose={() => setIsGlossaryOpen(false)}
      />
    </div>
  );
}
