"use client";

import { useLanguage } from "./LanguageProvider";

export default function LocalizedText({
  text,
  values,
}: {
  text: string;
  values?: Record<string, string | number>;
}) {
  const { t } = useLanguage();
  let translated = t(text);
  for (const [key, value] of Object.entries(values ?? {})) {
    translated = translated.replaceAll(`{${key}}`, String(value));
  }
  return translated;
}
