"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import {
  isLanguage,
  translate,
  type Language,
} from "@/lib/translations";

const STORAGE_KEY = "portfolio-language";
let currentLanguage: Language = "en";
let storageInitialized = false;
const listeners = new Set<() => void>();

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function getLanguageSnapshot(): Language {
  if (!storageInitialized) {
    storageInitialized = true;
    try {
      const savedLanguage = window.localStorage.getItem(STORAGE_KEY);
      if (savedLanguage && isLanguage(savedLanguage)) {
        currentLanguage = savedLanguage;
      }
    } catch (error) {
      console.error("Could not read the saved site language.", error);
    }
  }
  return currentLanguage;
}

function getServerLanguageSnapshot(): Language {
  return "en";
}

function subscribeToLanguage(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export default function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(
    subscribeToLanguage,
    getLanguageSnapshot,
    getServerLanguageSnapshot,
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = useCallback((nextLanguage: Language) => {
    currentLanguage = nextLanguage;
    storageInitialized = true;
    try {
      window.localStorage.setItem(STORAGE_KEY, nextLanguage);
    } catch (error) {
      console.error("Could not save the selected site language.", error);
    }
    listeners.forEach((listener) => listener());
  }, []);

  const t = useCallback(
    (text: string) => translate(text, language),
    [language],
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider.");
  }
  return context;
}
