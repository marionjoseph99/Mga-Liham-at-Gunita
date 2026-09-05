export interface Poem {
  id: string;
  title: string;
  meta: string;
  year: number;
  locationOrContext: string;
  content: string;
  stanzas: string[];
  theme: 'lungsod' | 'pamahiin' | 'pangungulila' | 'katatagan';
  themeLabel: string;
  estimatedReadTime: string;
  reflection?: string;
}

export type ThemeMode = 'papel' | 'gabi' | 'sepia';

export type ViewMode = 'sinupan' | 'pahina';

export interface GlossaryTerm {
  word: string;
  meaning: string;
  context: string;
}
