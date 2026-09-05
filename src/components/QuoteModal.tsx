import React, { useState, useRef } from 'react';
import {
  X,
  Download,
  Share2,
  Copy,
  Check,
  Sparkles,
  FileText,
  Image as ImageIcon,
  BookOpen,
  Quote as QuoteIcon,
  Layers,
} from 'lucide-react';
import { toPng, toBlob } from 'html-to-image';
import { Poem } from '../types';

const GOOGLE_FONTS_CSS_URL =
  'https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;1,6..72,400&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap';

let cachedFontCss: string | null = null;

async function getFontEmbedCSS(): Promise<string> {
  if (cachedFontCss !== null) return cachedFontCss;
  try {
    const res = await fetch(GOOGLE_FONTS_CSS_URL);
    if (res.ok) {
      cachedFontCss = await res.text();
      return cachedFontCss;
    }
  } catch (err) {
    console.warn('Font CSS preload skipped:', err);
  }
  cachedFontCss = '';
  return '';
}

interface QuoteModalProps {
  poem: Poem | null;
  stanzaText?: string;
  isOpen: boolean;
  onClose: () => void;
}

type CardTheme = 'papel' | 'gabi' | 'sepia';
type CardRatio = 'auto' | '4:5' | '1:1' | '9:16';
type CardScope = 'whole' | 'stanza';

export const QuoteModal: React.FC<QuoteModalProps> = ({
  poem,
  stanzaText,
  isOpen,
  onClose,
}) => {
  const [theme, setTheme] = useState<CardTheme>('papel');
  const [ratio, setRatio] = useState<CardRatio>('auto');
  const [scope, setScope] = useState<CardScope>(stanzaText ? 'stanza' : 'whole');
  const [selectedStanzaIndex, setSelectedStanzaIndex] = useState<number>(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [copiedImageSuccess, setCopiedImageSuccess] = useState(false);
  const [copiedTextSuccess, setCopiedTextSuccess] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const cardRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !poem) return null;

  // Stanza to show if scope is 'stanza'
  const currentStanza = stanzaText || poem.stanzas[selectedStanzaIndex] || poem.stanzas[0];

  // Theme styling configurations
  const themeStyles = {
    papel: {
      bg: '#f7f5f0',
      text: '#1a1a1a',
      meta: '#6e6963',
      border: 'rgba(26, 26, 26, 0.12)',
      stamp: '#8a847d',
      tag: 'rgba(0, 0, 0, 0.05)',
      noiseOpacity: 0.045,
    },
    gabi: {
      bg: '#161616',
      text: '#f2f2f2',
      meta: '#9e9e9e',
      border: 'rgba(255, 255, 255, 0.14)',
      stamp: '#757575',
      tag: 'rgba(255, 255, 255, 0.08)',
      noiseOpacity: 0.03,
    },
    sepia: {
      bg: '#f3eee3',
      text: '#2a231d',
      meta: '#7a6f64',
      border: 'rgba(42, 35, 29, 0.14)',
      stamp: '#96897c',
      tag: 'rgba(42, 35, 29, 0.06)',
      noiseOpacity: 0.05,
    },
  }[theme];

  // Ratio styling container dimensions
  const getRatioContainerClasses = () => {
    switch (ratio) {
      case '4:5':
        return 'w-[520px] min-h-[650px] aspect-[4/5]';
      case '1:1':
        return 'w-[540px] min-h-[540px] aspect-square';
      case '9:16':
        return 'w-[440px] min-h-[780px] aspect-[9/16]';
      case 'auto':
      default:
        return 'w-[560px] sm:w-[620px] min-h-[440px]';
    }
  };

  // Safe capture options to embed Google Fonts and prevent cssRules CORS errors
  const getCaptureOptions = async () => {
    const fontCss = await getFontEmbedCSS();
    return {
      cacheBust: true,
      backgroundColor: themeStyles.bg,
      fontEmbedCSS: fontCss || undefined,
      skipFonts: !fontCss,
    };
  };

  // Generate PNG Data URL
  const generatePngDataUrl = async (): Promise<string | null> => {
    if (!cardRef.current) return null;
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }
    // Small delay to ensure all CSS paint cycles complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    const captureOptions = await getCaptureOptions();
    return await toPng(cardRef.current, {
      pixelRatio: 2.5, // Crisp 2.5x high-res for social feeds
      quality: 0.98,
      ...captureOptions,
    });
  };

  // Download Card as PNG
  const handleDownload = async () => {
    if (!cardRef.current || isGenerating) return;
    setIsGenerating(true);
    setStatusMessage('Inihahanda ang imahe ng kard...');

    try {
      const dataUrl = await generatePngDataUrl();
      if (!dataUrl) throw new Error('Hindi mabuo ang imahe');

      const fileName = `${poem.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-kard.png`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setDownloadSuccess(true);
      setStatusMessage('Matagumpay na na-download ang kard!');
      setTimeout(() => {
        setDownloadSuccess(false);
        setStatusMessage(null);
      }, 3500);
    } catch (err) {
      console.error(err);
      setStatusMessage('Paumanhin, nagkaroon ng aberya sa pag-download.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Native Social Share (Web Share API)
  const handleNativeShare = async () => {
    if (!cardRef.current || isGenerating) return;
    setIsGenerating(true);
    setStatusMessage('Inihahanda ang pagbabahagi...');

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const captureOptions = await getCaptureOptions();
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2.5,
        quality: 0.98,
        ...captureOptions,
      });

      const fileName = `${poem.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}-kard.png`;

      if (blob && navigator.canShare && navigator.canShare({ files: [new File([blob], fileName, { type: 'image/png' })] })) {
        const file = new File([blob], fileName, { type: 'image/png' });
        await navigator.share({
          files: [file],
          title: poem.title,
          text: `"${poem.title}"\n${poem.meta}\n\n— Mga Liham at Gunita`,
        });
        setStatusMessage('Matagumpay na naibahagi!');
      } else if (navigator.share) {
        await navigator.share({
          title: poem.title,
          text: `"${poem.title}"\n\n${poem.stanzas[0]}\n\n— Mula sa Mga Liham at Gunita`,
          url: window.location.href,
        });
        setStatusMessage('Naibahagi ang teksto!');
      } else {
        // Fallback: Copy caption
        await handleCopyCaption();
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error(err);
        setStatusMessage('Maaari mo ring i-download ang kard gamit ang button sa ibaba.');
      }
    } finally {
      setIsGenerating(false);
      setTimeout(() => setStatusMessage(null), 3500);
    }
  };

  // Copy Image directly to Clipboard
  const handleCopyImage = async () => {
    if (!cardRef.current || isGenerating) return;
    setIsGenerating(true);
    setStatusMessage('Kinokopya ang imahe sa clipboard...');

    try {
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      const captureOptions = await getCaptureOptions();
      const blob = await toBlob(cardRef.current, {
        pixelRatio: 2,
        quality: 0.95,
        ...captureOptions,
      });

      if (blob && navigator.clipboard && 'write' in navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': blob,
          }),
        ]);
        setCopiedImageSuccess(true);
        setStatusMessage('✓ Nakopya ang imahe! Maaari mo na itong i-paste sa social media.');
        setTimeout(() => {
          setCopiedImageSuccess(false);
          setStatusMessage(null);
        }, 3500);
      } else {
        // Fallback to downloading
        await handleDownload();
      }
    } catch (err) {
      console.error(err);
      // Fallback
      await handleDownload();
    } finally {
      setIsGenerating(false);
    }
  };

  // Copy Caption / Text
  const handleCopyCaption = async () => {
    const contentToCopy =
      scope === 'whole'
        ? poem.stanzas.join('\n\n')
        : currentStanza;

    const formatted = `${poem.title.toUpperCase()}\n${poem.meta}\n\n${contentToCopy}\n\n—\nSinupan: Mga Liham at Gunita\n#PanitikangPilipino #Tula #MgaLihamAtGunita`;

    try {
      await navigator.clipboard.writeText(formatted);
      setCopiedTextSuccess(true);
      setStatusMessage('✓ Nakopya ang caption sa clipboard!');
      setTimeout(() => {
        setCopiedTextSuccess(false);
        setStatusMessage(null);
      }, 3000);
    } catch {
      setStatusMessage('Hindi makopya ang caption.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-5xl max-h-[94vh] rounded-2xl bg-[#fdfdfc] dark:bg-[#181818] border border-[#ececec] dark:border-[#262626] shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#ececec] dark:border-[#262626] bg-white/50 dark:bg-black/20">
          <div className="flex items-center gap-2.5">
            <ImageIcon className="w-4 h-4 text-[#1a1a1a] dark:text-[#ededed]" />
            <div>
              <h3 className="font-serif italic text-lg sm:text-xl text-[#1a1a1a] dark:text-[#ededed] leading-none">
                Kard ng Tula para sa Social Media
              </h3>
              <p className="font-mono text-[9px] text-[#717171] dark:text-[#a1a1a1] uppercase tracking-[0.2em] mt-1">
                I-save bilang imahe para sa Instagram, Threads, Facebook, o X
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-[#ececec] dark:border-[#262626] text-[#717171] hover:text-black dark:hover:text-white hover:border-black dark:hover:border-white transition-colors"
            title="Isara"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Controls Toolbar */}
        <div className="px-6 py-3 border-b border-[#ececec] dark:border-[#262626] bg-[#faf8f5] dark:bg-[#141414] flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          {/* Scope Selector: Whole Poem vs Stanza */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#a1a1a1] mr-1">
              Saklaw:
            </span>
            <button
              onClick={() => setScope('whole')}
              className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 ${
                scope === 'whole'
                  ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black font-medium'
                  : 'text-[#717171] hover:text-black dark:hover:text-white border border-[#ececec] dark:border-[#262626]'
              }`}
            >
              <BookOpen className="w-3 h-3" />
              <span>Buong Tula</span>
            </button>
            <button
              onClick={() => setScope('stanza')}
              className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider transition-colors flex items-center gap-1 ${
                scope === 'stanza'
                  ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black font-medium'
                  : 'text-[#717171] hover:text-black dark:hover:text-white border border-[#ececec] dark:border-[#262626]'
              }`}
            >
              <QuoteIcon className="w-3 h-3" />
              <span>Piling Saknong</span>
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#a1a1a1] mr-1">
              Papel:
            </span>
            <button
              onClick={() => setTheme('papel')}
              className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border transition-colors ${
                theme === 'papel'
                  ? 'border-black bg-[#f7f5f0] text-black font-medium'
                  : 'border-[#ececec] dark:border-[#262626] text-[#717171]'
              }`}
            >
              Papel
            </button>
            <button
              onClick={() => setTheme('gabi')}
              className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border transition-colors ${
                theme === 'gabi'
                  ? 'border-white bg-[#161616] text-white font-medium'
                  : 'border-[#ececec] dark:border-[#262626] text-[#717171]'
              }`}
            >
              Gabi
            </button>
            <button
              onClick={() => setTheme('sepia')}
              className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border transition-colors ${
                theme === 'sepia'
                  ? 'border-[#7a6f64] bg-[#f3eee3] text-[#2a231d] font-medium'
                  : 'border-[#ececec] dark:border-[#262626] text-[#717171]'
              }`}
            >
              Sepia
            </button>
          </div>

          {/* Ratio Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] uppercase tracking-wider text-[#a1a1a1] mr-1">
              Sukat:
            </span>
            <button
              onClick={() => setRatio('auto')}
              className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border transition-colors ${
                ratio === 'auto'
                  ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black font-medium'
                  : 'border-[#ececec] dark:border-[#262626] text-[#717171]'
              }`}
              title="Buong Pahina (Natural Flow - walang limitasyon sa haba)"
            >
              Likas
            </button>
            <button
              onClick={() => setRatio('4:5')}
              className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border transition-colors ${
                ratio === '4:5'
                  ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black font-medium'
                  : 'border-[#ececec] dark:border-[#262626] text-[#717171]'
              }`}
              title="Instagram Feed / Threads (4:5)"
            >
              4:5 Post
            </button>
            <button
              onClick={() => setRatio('1:1')}
              className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border transition-colors ${
                ratio === '1:1'
                  ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black font-medium'
                  : 'border-[#ececec] dark:border-[#262626] text-[#717171]'
              }`}
              title="Kuwadrado (1:1)"
            >
              1:1
            </button>
            <button
              onClick={() => setRatio('9:16')}
              className={`px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider border transition-colors ${
                ratio === '9:16'
                  ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black font-medium'
                  : 'border-[#ececec] dark:border-[#262626] text-[#717171]'
              }`}
              title="Story / Reel / TikTok (9:16)"
            >
              9:16 Story
            </button>
          </div>
        </div>

        {/* Stanza selector if scope === 'stanza' */}
        {scope === 'stanza' && poem.stanzas.length > 1 && (
          <div className="px-6 py-2 border-b border-[#ececec] dark:border-[#262626] bg-[#f9f9f8] dark:bg-[#121212] flex items-center gap-2 overflow-x-auto text-xs font-mono">
            <span className="text-[10px] uppercase text-[#a1a1a1] whitespace-nowrap">
              Pumili ng Saknong:
            </span>
            {poem.stanzas.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedStanzaIndex(idx)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] whitespace-nowrap transition-colors ${
                  selectedStanzaIndex === idx
                    ? 'bg-[#1a1a1a] text-white dark:bg-white dark:text-black font-medium'
                    : 'border border-[#ececec] dark:border-[#262626] text-[#717171]'
                }`}
              >
                Saknong {idx + 1}
              </button>
            ))}
          </div>
        )}

        {/* Live Card Preview Stage */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#e8e6e1] dark:bg-[#0d0d0d] flex items-center justify-center">
          <div className="relative shadow-2xl transition-all duration-300">
            {/* The Actual HTML Node Captured by html-to-image */}
            <div
              ref={cardRef}
              style={{
                backgroundColor: themeStyles.bg,
                color: themeStyles.text,
              }}
              className={`relative overflow-hidden p-8 sm:p-12 md:p-14 ${getRatioContainerClasses()} flex flex-col justify-between select-none`}
            >
              {/* Subtle fine paper texture overlay */}
              <div
                className="pointer-events-none absolute inset-0 z-0"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='${themeStyles.noiseOpacity}'/%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat',
                }}
              />

              {/* Card Top Archival Header */}
              <div
                className="relative z-10 flex items-center justify-between pb-4 mb-5 border-b"
                style={{ borderColor: themeStyles.border }}
              >
                <span
                  className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.3em]"
                  style={{ color: themeStyles.stamp }}
                >
                  SINUPAN NG MGA TULA • PILIPINAS
                </span>
                <span
                  className="font-mono text-[9px] sm:text-[10px] uppercase tracking-[0.2em]"
                  style={{ color: themeStyles.stamp }}
                >
                  {poem.year}
                </span>
              </div>

              {/* Top Title Section - Positioned at the TOP of the card */}
              <div
                className="relative z-10 space-y-2 pb-5 mb-6 border-b text-left"
                style={{ borderColor: themeStyles.border }}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="inline-block px-2 py-0.5 rounded text-[9px] font-mono uppercase tracking-wider"
                    style={{
                      backgroundColor: themeStyles.tag,
                      color: themeStyles.meta,
                    }}
                  >
                    {poem.themeLabel}
                  </span>
                  <span
                    className="font-mono text-[10px] tracking-[0.2em] uppercase"
                    style={{ color: themeStyles.stamp }}
                  >
                    • {poem.locationOrContext}
                  </span>
                </div>

                <h2
                  className="font-handwriting text-5xl sm:text-6xl md:text-7xl font-medium leading-[1.02] tracking-normal text-left"
                  style={{ color: themeStyles.text }}
                >
                  {poem.title}
                </h2>

                <p
                  className="font-mono text-[11px] sm:text-xs tracking-[0.2em] uppercase leading-relaxed text-left pt-0.5"
                  style={{ color: themeStyles.meta }}
                >
                  {poem.meta}
                </p>
              </div>

              {/* Main Verses Section - Underneath the Title, strictly left-aligned */}
              <div
                className={`relative z-10 flex-1 ${
                  poem.stanzas.length >= 4 ? 'space-y-4 sm:space-y-5' : 'space-y-6 sm:space-y-7'
                } text-left my-auto py-1`}
              >
                {scope === 'whole' ? (
                  poem.stanzas.map((stanza, sIdx) => (
                    <p
                      key={sIdx}
                      className={`font-serif ${
                        poem.stanzas.length >= 4
                          ? 'text-sm sm:text-base md:text-[1.05rem] leading-[1.65]'
                          : poem.stanzas.length === 3
                          ? 'text-base sm:text-lg md:text-[1.18rem] leading-[1.72]'
                          : 'text-lg sm:text-xl md:text-[1.28rem] leading-[1.75]'
                      } whitespace-pre-line text-left tracking-normal`}
                      style={{ color: themeStyles.text }}
                    >
                      {stanza}
                    </p>
                  ))
                ) : (
                  <div className="space-y-4 py-4">
                    <p
                      className="font-serif text-2xl sm:text-3xl md:text-[2.1rem] leading-[1.75] whitespace-pre-line text-left tracking-normal"
                      style={{ color: themeStyles.text }}
                    >
                      "{currentStanza}"
                    </p>
                  </div>
                )}
              </div>

              {/* Card Footer: Archival attribution */}
              <div
                className="relative z-10 pt-5 mt-6 border-t flex items-center justify-between"
                style={{ borderColor: themeStyles.border }}
              >
                <p
                  className="font-mono text-[9px] uppercase tracking-[0.25em]"
                  style={{ color: themeStyles.stamp }}
                >
                  MGA LIHAM AT GUNITA
                </p>
                <p
                  className="font-mono text-[8px] uppercase tracking-[0.2em]"
                  style={{ color: themeStyles.stamp }}
                >
                  {poem.themeLabel}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Toast / Status */}
        {statusMessage && (
          <div className="px-6 py-2 text-center text-xs font-mono bg-black text-white dark:bg-white dark:text-black transition-all animate-in fade-in">
            {statusMessage}
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="px-6 py-4 border-t border-[#ececec] dark:border-[#262626] bg-white dark:bg-[#181818] flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex items-center gap-2 text-[11px] text-[#717171]">
            <span>Format: PNG (2.5x High-Resolution)</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Copy Caption */}
            <button
              onClick={handleCopyCaption}
              className="px-3.5 py-2 rounded-full border border-[#ececec] dark:border-[#262626] hover:border-black dark:hover:border-white text-[#717171] hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors flex items-center gap-1.5"
              title="Kopyahin ang teksto para sa caption ng post"
            >
              {copiedTextSuccess ? <Check className="w-3.5 h-3.5 text-green-600" /> : <FileText className="w-3.5 h-3.5" />}
              <span>{copiedTextSuccess ? 'Nakopya!' : 'Caption'}</span>
            </button>

            {/* Copy Image to Clipboard */}
            <button
              onClick={handleCopyImage}
              disabled={isGenerating}
              className="px-3.5 py-2 rounded-full border border-[#ececec] dark:border-[#262626] hover:border-black dark:hover:border-white text-[#717171] hover:text-black dark:hover:text-white uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Kopyahin ang imahe sa clipboard"
            >
              {copiedImageSuccess ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedImageSuccess ? 'Nakopya ang Imahe!' : 'Kopyahin'}</span>
            </button>

            {/* Native Share (IG/Twitter/FB sheet) */}
            <button
              onClick={handleNativeShare}
              disabled={isGenerating}
              className="px-4 py-2 rounded-full border border-[#ececec] dark:border-[#262626] hover:border-black dark:hover:border-white text-[#1a1a1a] dark:text-[#ededed] uppercase tracking-wider transition-colors flex items-center gap-1.5 disabled:opacity-50"
              title="Ibahagi gamit ang share menu ng iyong telepono o kompyuter"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Ibahagi</span>
            </button>

            {/* Primary Download PNG Button */}
            <button
              onClick={handleDownload}
              disabled={isGenerating}
              className="px-5 py-2 rounded-full bg-[#1a1a1a] text-[#fdfdfc] dark:bg-[#ededed] dark:text-[#121212] hover:opacity-90 transition-opacity flex items-center gap-2 uppercase tracking-wider font-medium disabled:opacity-50"
            >
              {downloadSuccess ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Download className="w-3.5 h-3.5" />}
              <span>{isGenerating ? 'Inihahanda...' : downloadSuccess ? 'Na-download!' : 'I-download ang Kard'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PoemCardModal = QuoteModal;
