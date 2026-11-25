export type TranslationLocale = "hi" | "pa";

export type PhotoCaptionFields = {
  alt?: string;
  title?: string;
  location?: string;
  date?: string;
  description?: string;
};

export type PhotoCaptionTranslation = PhotoCaptionFields;

export type PhotoCaptionTranslations = Partial<
  Record<TranslationLocale, PhotoCaptionTranslation>
>;
