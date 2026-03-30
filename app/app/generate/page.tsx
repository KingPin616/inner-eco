"use client";

import { FormEvent, useMemo, useState } from "react";
import QRCode from "qrcode";
import Link from "next/link";
import Image from "next/image";
import PageShell from "@/components/PageShell";
import { plantExists } from "@/utils/plants";
import { getPlantAbsoluteUrl, getPlantPath } from "@/utils/qr";

type FormState = {
  id: string;
  commonName: string;
  scientificName: string;
  age: string;
  description: string;
  imageUrl: string;
};

const initialState: FormState = {
  id: "",
  commonName: "",
  scientificName: "",
  age: "",
  description: "",
  imageUrl: "",
};

export default function GeneratePage() {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [qrImageData, setQrImageData] = useState("");
  const [targetUrl, setTargetUrl] = useState("");
  const [error, setError] = useState("");

  const duplicateId = useMemo(() => {
    if (!formState.id.trim()) {
      return false;
    }
    return plantExists(formState.id.trim());
  }, [formState.id]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const trimmedId = formState.id.trim();

    if (!trimmedId) {
      setError("Plant ID is required to generate a QR code.");
      setQrImageData("");
      return;
    }

    try {
      const origin = window.location.origin;
      const absoluteUrl = getPlantAbsoluteUrl(trimmedId, origin);
      const dataUrl = await QRCode.toDataURL(absoluteUrl, {
        width: 420,
        margin: 1,
        color: {
          dark: "#133d2a",
          light: "#f4f8ee",
        },
      });

      setTargetUrl(absoluteUrl);
      setQrImageData(dataUrl);
    } catch {
      setError("Could not generate QR code. Please verify the provided values.");
      setQrImageData("");
    }
  }

  const qrPathPreview = formState.id.trim() ? getPlantPath(formState.id) : "/plant/{id}";

  return (
    <PageShell>
      <header className="mb-5 animate-fade-up">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-emerald-900/15 bg-white/70 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-emerald-900 backdrop-blur-sm transition hover:bg-white"
        >
          Back
        </Link>
      </header>

      <section className="grid gap-4 md:grid-cols-2">
        <form
          className="animate-fade-up space-y-4 rounded-3xl border border-emerald-900/15 bg-white/90 p-5 shadow-[0_16px_44px_-24px_rgba(12,64,42,0.45)] [animation-delay:80ms]"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-display text-emerald-950">QR Builder</h1>
          <p className="text-sm text-emerald-900/75">
            Create a QR code that routes visitors to a plant profile page.
          </p>

          <label className="block text-sm font-semibold text-emerald-900" htmlFor="plant-id">
            Plant ID
          </label>
          <input
            id="plant-id"
            data-testid="plant-id"
            value={formState.id}
            onChange={(event) => setFormState((prev) => ({ ...prev, id: event.target.value }))}
            placeholder="example: oak-001"
            className="w-full rounded-xl border border-emerald-900/20 bg-emerald-50/50 px-3 py-2 text-sm outline-none ring-0 transition focus:border-emerald-700"
          />

          <label className="block text-sm font-semibold text-emerald-900" htmlFor="common-name">
            Common Name
          </label>
          <input
            id="common-name"
            value={formState.commonName}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, commonName: event.target.value }))
            }
            className="w-full rounded-xl border border-emerald-900/20 bg-emerald-50/50 px-3 py-2 text-sm outline-none transition focus:border-emerald-700"
          />

          <label className="block text-sm font-semibold text-emerald-900" htmlFor="scientific-name">
            Scientific Name
          </label>
          <input
            id="scientific-name"
            value={formState.scientificName}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, scientificName: event.target.value }))
            }
            className="w-full rounded-xl border border-emerald-900/20 bg-emerald-50/50 px-3 py-2 text-sm outline-none transition focus:border-emerald-700"
          />

          <label className="block text-sm font-semibold text-emerald-900" htmlFor="age">
            Age
          </label>
          <input
            id="age"
            value={formState.age}
            onChange={(event) => setFormState((prev) => ({ ...prev, age: event.target.value }))}
            className="w-full rounded-xl border border-emerald-900/20 bg-emerald-50/50 px-3 py-2 text-sm outline-none transition focus:border-emerald-700"
          />

          <label className="block text-sm font-semibold text-emerald-900" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            rows={3}
            value={formState.description}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, description: event.target.value }))
            }
            className="w-full rounded-xl border border-emerald-900/20 bg-emerald-50/50 px-3 py-2 text-sm outline-none transition focus:border-emerald-700"
          />

          <label className="block text-sm font-semibold text-emerald-900" htmlFor="image-url">
            Image URL
          </label>
          <input
            id="image-url"
            type="url"
            value={formState.imageUrl}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, imageUrl: event.target.value }))
            }
            className="w-full rounded-xl border border-emerald-900/20 bg-emerald-50/50 px-3 py-2 text-sm outline-none transition focus:border-emerald-700"
          />

          <button
            type="submit"
            data-testid="generate-qr"
            className="w-full rounded-full bg-emerald-900 px-4 py-3 text-sm font-bold uppercase tracking-[0.18em] text-emerald-50 transition hover:bg-emerald-950"
          >
            Generate QR
          </button>

          {duplicateId ? (
            <p className="rounded-xl border border-amber-900/25 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-900">
              Warning: this ID already exists in static data.
            </p>
          ) : null}

          {error ? (
            <p className="rounded-xl border border-rose-900/20 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-900">
              {error}
            </p>
          ) : null}
        </form>

        <aside className="animate-fade-up space-y-4 rounded-3xl border border-emerald-900/15 bg-white/90 p-5 shadow-[0_16px_44px_-24px_rgba(12,64,42,0.45)] [animation-delay:180ms]">
          <h2 className="text-2xl font-display text-emerald-950">Preview</h2>
          <p className="text-sm text-emerald-900/75">
            Target route: <span className="font-semibold text-emerald-950">{qrPathPreview}</span>
          </p>

          {qrImageData ? (
            <div className="space-y-3">
              <Image
                src={qrImageData}
                alt="Generated QR code"
                data-testid="qr-preview"
                width={420}
                height={420}
                unoptimized
                className="w-full max-w-xs rounded-2xl border border-emerald-900/15 bg-emerald-50 p-3"
              />
              <a
                href={qrImageData}
                download={`${formState.id.trim() || "plant"}-qr.png`}
                data-testid="download-qr"
                className="inline-flex rounded-full bg-emerald-800 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-emerald-50 transition hover:bg-emerald-900"
              >
                Download QR
              </a>
              <p className="text-xs break-all text-emerald-900/75">{targetUrl}</p>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-emerald-900/20 bg-emerald-50/55 p-8 text-center text-sm text-emerald-900/70">
              Generate a code to preview it here.
            </div>
          )}
        </aside>
      </section>
    </PageShell>
  );
}
