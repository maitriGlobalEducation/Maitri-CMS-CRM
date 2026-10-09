"use client";

import type { HomepageHero } from "@/types/homepage";
import { useRef, useState } from "react";
import { Loader2, Trash2, Upload } from "lucide-react";
import { toast } from "react-toastify";
import { uploadVideo } from "@/services/media.service";

interface Props {
  hero: HomepageHero;
  onChange: (hero: HomepageHero) => void;
}

export default function HomepageHeroForm({ hero, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleVideoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);

      const uploadedVideo = await uploadVideo(file);

      updateField("backgroundVideo", uploadedVideo);

      toast.success("Background video uploaded successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Video upload failed.",
      );
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const updateField = <K extends keyof HomepageHero>(
    field: K,
    value: HomepageHero[K],
  ) => {
    onChange({ ...hero, [field]: value });
  };

  const updateCTA = (
    key: "cta1" | "cta2",
    field: "label" | "url" | "enabled",
    value: string | boolean,
  ) => {
    onChange({
      ...hero,
      [key]: {
        ...hero[key],
        [field]: value,
      },
    });
  };

  const inputStyles =
    "h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400";

  return (
    <div className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Hero Section</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Configure the homepage banner and its call-to-action buttons.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={hero.isVisible}
            onChange={(e) => updateField("isVisible", e.target.checked)}
            className="accent-zinc-900"
          />
          Visible
        </label>
      </div>

      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-700">
          Background Video
        </label>

        {hero.backgroundVideo?.url && (
          <div className="space-y-3">
            <video
              src={hero.backgroundVideo.url}
              controls
              className="max-h-75 w-full rounded-lg bg-black object-contain"
            />

            <div className="flex items-center justify-between">
              <p className="truncate text-xs text-zinc-500">
                {hero.backgroundVideo.publicId}
              </p>

              <button
                type="button"
                onClick={() => updateField("backgroundVideo", null)}
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
          accept="video/mp4,video/webm,video/quicktime"
          onChange={handleVideoUpload}
          disabled={isUploading}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}

          {isUploading
            ? "Uploading video..."
            : hero.backgroundVideo
              ? "Replace Video"
              : "Upload Background Video"}
        </button>

        <p className="text-xs text-zinc-400">
          MP4, WebM or MOV. Maximum file size: 100 MB.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-700">
          Heading
        </label>
        <textarea
          value={hero.heading}
          onChange={(e) => updateField("heading", e.target.value)}
          rows={2}
          className="w-full rounded-lg border border-zinc-200 p-3 text-sm outline-none transition focus:border-zinc-400"
          placeholder="Enter hero heading"
        />
      </div>

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-700">
          Subtitle
        </label>
        <input
          type="text"
          value={hero.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
          className={inputStyles}
          placeholder="Enter hero subtitle"
        />
      </div>

      {(["cta1", "cta2"] as const).map((key, index) => (
        <div
          key={key}
          className="space-y-4 rounded-lg border border-zinc-200 p-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-zinc-900">
              CTA {index + 1}
            </h3>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-600">
              <input
                type="checkbox"
                checked={hero[key].enabled}
                onChange={(e) => updateCTA(key, "enabled", e.target.checked)}
                className="accent-zinc-900"
              />
              Enabled
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-700">
                Button text
              </label>
              <input
                value={hero[key].label}
                onChange={(e) => updateCTA(key, "label", e.target.value)}
                className={inputStyles}
                placeholder="Button label"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-700">
                Destination URL
              </label>
              <input
                value={hero[key].url}
                onChange={(e) => updateCTA(key, "url", e.target.value)}
                className={inputStyles}
                placeholder="/scholarships"
              />
            </div>
          </div>
        </div>
      ))}

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-zinc-700">
            Dark overlay
          </label>
          <span className="text-sm text-zinc-500">{hero.overlayOpacity}%</span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          value={hero.overlayOpacity}
          onChange={(e) =>
            updateField("overlayOpacity", Number(e.target.value))
          }
          className="w-full cursor-pointer accent-zinc-900"
        />
        <p className="text-xs text-zinc-400">
          Controls how dark the video background should appear.
        </p>
      </div>
    </div>
  );
}
