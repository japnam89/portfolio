"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import type {
  PhotoCaptionFields,
  PhotoCaptionTranslations,
  TranslationLocale,
} from "@/lib/content-types";

// Admin page to edit photo captions (title/alt/location/date/description).
// Lists photos from /api/photos and saves each via PUT /api/photos/[key]/meta,
// which is gated by the admin password (x-admin-password header, same as the
// blog admin). The password is remembered in sessionStorage.

type Caption = {
  alt: string;
  title?: string;
  location?: string;
  date?: string;
  description?: string;
  translations?: PhotoCaptionTranslations;
};

type Photo = { key: string; src: string; caption?: Caption };

function getAdminPwd(): string {
  return sessionStorage.getItem("admin_pwd") || "";
}

export default function AdminPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [savedKey, setSavedKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/photos", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setPhotos(d.photos ?? []);
        setLoaded(true);
      })
      .catch(() => {
        setError("Could not load photos.");
        setLoaded(true);
      });
  }, []);

  async function save(photo: Photo, draft: Caption) {
    let pwd = getAdminPwd();
    if (!pwd) {
      pwd = prompt("Admin password:") || "";
      if (!pwd) return;
      sessionStorage.setItem("admin_pwd", pwd);
    }
    const res = await fetch(
      `/api/photos/${encodeURIComponent(photo.key)}/meta`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json", "x-admin-password": pwd },
        body: JSON.stringify(draft),
      },
    );
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (res.status === 401) sessionStorage.removeItem("admin_pwd");
      setError(data.error || `Save failed (${res.status})`);
      return;
    }
    // Reflect the saved caption locally so the grid preview updates.
    setPhotos((prev) =>
      prev.map((p) => (p.key === photo.key ? { ...p, caption: data.caption } : p)),
    );
    setSavedKey(photo.key);
    setTimeout(() => setSavedKey(null), 1500);
    setError(null);
  }

  if (!loaded) return <p className="mx-auto max-w-3xl px-6 py-20">Loading…</p>;

  return (
    <section className="mx-auto max-w-3xl px-6 py-20">
      <div className="flex items-center justify-between">
        <h1 className="text-4xl font-bold tracking-tight">Edit photo captions</h1>
        <Link href="/admin/posts" className="text-sm text-zinc-500 hover:text-zinc-900">
          Blog admin →
        </Link>
      </div>
      <p className="mt-3 text-sm text-zinc-500">
        Captions are stored in the database and override the defaults. Leave a
        field blank to fall back to its default.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-8 space-y-8">
        {photos.length === 0 && (
          <p className="text-sm text-zinc-500">No photos found in storage.</p>
        )}
        {photos.map((photo) => (
          <PhotoEditor
            key={photo.key}
            photo={photo}
            justSaved={savedKey === photo.key}
            onSave={save}
          />
        ))}
      </div>
    </section>
  );
}

function PhotoEditor({
  photo,
  justSaved,
  onSave,
}: {
  photo: Photo;
  justSaved: boolean;
  onSave: (photo: Photo, draft: Caption) => void;
}) {
  const c = photo.caption;
  const [title, setTitle] = useState(c?.title ?? "");
  const [alt, setAlt] = useState(c?.alt ?? "");
  const [location, setLocation] = useState(c?.location ?? "");
  const [date, setDate] = useState(c?.date ?? "");
  const [description, setDescription] = useState(c?.description ?? "");
  const [translations, setTranslations] = useState<PhotoCaptionTranslations>(
    c?.translations ?? {},
  );
  const locales: Array<{ code: TranslationLocale; label: string }> = [
    { code: "hi", label: "Hindi" },
    { code: "pa", label: "Punjabi" },
  ];

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="flex gap-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo.src}
          alt={alt || photo.key}
          className="h-24 w-24 flex-shrink-0 rounded-lg object-cover"
        />
        <div className="flex-1 space-y-3">
          <Field label="Title (name shown)" value={title} onChange={setTitle} />
          <Field label="Alt text (a11y)" value={alt} onChange={setAlt} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Location" value={location} onChange={setLocation} />
            <Field label="Date" value={date} onChange={setDate} />
          </div>
          <label className="block text-sm font-medium text-zinc-700">
            Description (lightbox)
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
            />
          </label>
          {locales.map(({ code, label }) => (
            <fieldset key={code} className="space-y-3 rounded-xl border border-zinc-200 p-4">
              <legend className="px-1 text-sm font-semibold text-zinc-700">
                {label} translation
              </legend>
              <TranslatedCaptionFields
                locale={code}
                fields={translations[code] ?? {}}
                onChange={(field, value) =>
                  setTranslations((current) => ({
                    ...current,
                    [code]: { ...current[code], [field]: value },
                  }))
                }
              />
            </fieldset>
          ))}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onSave(photo, {
                title,
                alt,
                location,
                date,
                description,
                translations,
              })}
              className="rounded-md bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700"
            >
              Save
            </button>
            {justSaved && <span className="text-sm text-green-600">Saved ✓</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block text-sm font-medium text-zinc-700">
      {label}
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
      />
    </label>
  );
}

function TranslatedCaptionFields({
  locale,
  fields,
  onChange,
}: {
  locale: TranslationLocale;
  fields: PhotoCaptionFields;
  onChange: (field: keyof PhotoCaptionFields, value: string) => void;
}) {
  return (
    <>
      <Field
        label="Title"
        value={fields.title ?? ""}
        onChange={(value) => onChange("title", value)}
      />
      <Field
        label="Alt text"
        value={fields.alt ?? ""}
        onChange={(value) => onChange("alt", value)}
      />
      <div className="grid grid-cols-2 gap-3">
        <Field
          label="Location"
          value={fields.location ?? ""}
          onChange={(value) => onChange("location", value)}
        />
        <Field
          label="Date"
          value={fields.date ?? ""}
          onChange={(value) => onChange("date", value)}
        />
      </div>
      <label className="block text-sm font-medium text-zinc-700">
        Description
        <textarea
          value={fields.description ?? ""}
          onChange={(e) => onChange("description", e.target.value)}
          rows={3}
          lang={locale}
          className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm"
        />
      </label>
    </>
  );
}
