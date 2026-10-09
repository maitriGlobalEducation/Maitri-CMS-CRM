"use client";

import { useRef, useState } from "react";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import type { HomepageAboutContent, HomepageImage } from "@/types/homepage";
import { uploadImage } from "@/services/media.service";

interface Props {
  content: HomepageAboutContent;
  isVisible: boolean;
  onChange: (content: HomepageAboutContent) => void;
  onVisibilityChange: (visible: boolean) => void;
}

export default function HomepageAboutForm({
  content,
  isVisible,
  onChange,
  onVisibilityChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const updateField = <K extends keyof HomepageAboutContent>(
    field: K,
    value: HomepageAboutContent[K],
  ) => {
    onChange({ ...content, [field]: value });
  };

  const updateCTA = (field: "label" | "url", value: string) => {
    onChange({
      ...content,
      cta: {
        ...content.cta,
        [field]: value,
      },
    });
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);

      const image = await uploadImage(file, "homepage");

      updateField("image", image as HomepageImage);

      toast.success("About section image uploaded.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload image.",
      );
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  return (
    <section className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Who We Are & What We Do
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Manage the image, introduction and CTA below the Hero section.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(event) => onVisibilityChange(event.target.checked)}
            className="accent-zinc-900"
          />
          Visible
        </label>
      </div>

      {/* Image */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-700">
          Section Image
        </label>

        {content.image?.url && (
          <div className="space-y-2">
            <img
              src={content.image.url}
              alt={content.heading || "About section"}
              className="max-h-75 w-full rounded-lg border border-zinc-200 object-contain"
            />

            <div className="flex items-center justify-between gap-3">
              <p className="truncate text-xs text-zinc-500">
                {content.image.publicId}
              </p>

              <button
                type="button"
                onClick={() => updateField("image", null)}
                className="inline-flex cursor-pointer items-center gap-1.5 text-sm text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </button>
            </div>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageUpload}
          disabled={isUploading}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <ImagePlus className="h-4 w-4" />
          )}

          {isUploading
            ? "Uploading image..."
            : content.image
              ? "Replace Image"
              : "Upload Image"}
        </button>
      </div>

      {/* Heading */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-700">
          Heading
        </label>

        <input
          value={content.heading}
          onChange={(event) => updateField("heading", event.target.value)}
          placeholder="Who We Are & What We Do"
          className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400"
        />
      </div>

      {/* Description */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-700">
          Description
        </label>

        <textarea
          value={content.description}
          onChange={(event) => updateField("description", event.target.value)}
          rows={4}
          placeholder="Enter your introduction..."
          className="w-full rounded-lg border border-zinc-200 p-3 text-sm outline-none transition focus:border-zinc-400"
        />
      </div>

      {/* CTA */}
      <div className="space-y-4 rounded-lg border border-zinc-200 p-4">
        <h3 className="text-sm font-semibold text-zinc-900">
          Call-to-action button
        </h3>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-700">
              Button text
            </label>

            <input
              value={content.cta.label}
              onChange={(event) => updateCTA("label", event.target.value)}
              placeholder="More"
              className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-zinc-700">
              Destination URL
            </label>

            <input
              value={content.cta.url}
              onChange={(event) => updateCTA("url", event.target.value)}
              placeholder="/about"
              className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
