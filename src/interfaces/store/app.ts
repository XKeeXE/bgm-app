export type Language = 'en' | 'es' | 'ja';

interface IApp {
  maxSaveTimer: number;
  setMaxSaveTimer: (n: number) => void;

  language: Language;
  setLanguage: (language: Language) => void;

  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
}

export default IApp;
