"use client";

import { useRef, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  ImagePlus,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

import type { HomepageImage, HomepageLocationsContent } from "@/types/homepage";
import { uploadImage } from "@/services/media.service";

interface Props {
  content: HomepageLocationsContent;
  isVisible: boolean;
  onChange: (content: HomepageLocationsContent) => void;
  onVisibilityChange: (visible: boolean) => void;
}

export default function HomepageLocationsForm({
  content,
  isVisible,
  onChange,
  onVisibilityChange,
}: Props) {
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [expandedCountry, setExpandedCountry] = useState<number | null>(null);

  const updateCountry = (
    index: number,
    updates: Partial<HomepageLocationsContent["countries"][number]>,
  ) => {
    onChange({
      ...content,
      countries: content.countries.map((country, i) =>
        i === index ? { ...country, ...updates } : country,
      ),
    });
  };

  const handleImageUpload = async (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setUploadingIndex(index);

      const image = await uploadImage(file, "homepage");

      updateCountry(index, { image });

      toast.success("Country image uploaded successfully.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload country image.",
      );
    } finally {
      setUploadingIndex(null);

      const input = inputRefs.current[index];

      if (input) input.value = "";
    }
  };

  const addCountry = () => {
    onChange({
      ...content,
      countries: [
        ...content.countries,
        {
          countryName: "",
          image: null,
        },
      ],
    });
  };

  const removeCountry = (index: number) => {
    onChange({
      ...content,
      countries: content.countries.filter((_, i) => i !== index),
    });
  };

  const inputStyles =
    "h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400";

  return (
    <section className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex items-center justify-between rounded-lg border border-zinc-200 p-4">
        <div>
          <p className="text-sm font-medium text-zinc-900">
            Show Locations Section
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            Control whether this section appears on the homepage.
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={isVisible}
          aria-label="Show Universities Section"
          onClick={() => onVisibilityChange(!isVisible)}
          className={`relative flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 ${
            isVisible ? "bg-zinc-900" : "bg-zinc-300"
          }`}
        >
          <span
            className={`pointer-events-none absolute left-0.5 size-5 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out ${
              isVisible ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {/* Section heading */}
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-zinc-700">
          Section Heading
        </label>

        <textarea
          rows={2}
          value={content.heading}
          onChange={(event) =>
            onChange({ ...content, heading: event.target.value })
          }
          placeholder="Study in Prestigious Locations"
          className="w-full rounded-lg border border-zinc-200 p-3 text-sm outline-none transition focus:border-zinc-400"
        />
      </div>

      {/* Underlined CTA */}
      <div className="grid gap-4 rounded-lg border border-zinc-200 p-4 md:grid-cols-2">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700">
            CTA Text
          </label>

          <input
            value={content.cta.label}
            onChange={(event) =>
              onChange({
                ...content,
                cta: { ...content.cta, label: event.target.value },
              })
            }
            placeholder="Find out our school"
            className={inputStyles}
          />
        </div>

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-zinc-700">
            CTA Destination URL
          </label>

          <input
            value={content.cta.url}
            onChange={(event) =>
              onChange({
                ...content,
                cta: { ...content.cta, url: event.target.value },
              })
            }
            placeholder="/universities"
            className={inputStyles}
          />
        </div>

        <p className="text-xs text-zinc-400 md:col-span-2">
          The public homepage will display this CTA as an underlined link.
        </p>
      </div>

      {/* Country cards */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-zinc-900">
              Country Cards
            </h3>
            <p className="mt-1 text-xs text-zinc-500">
              Each card has a country name and an image.
            </p>
          </div>

          <button
            type="button"
            onClick={addCountry}
            className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <Plus className="h-4 w-4" />
            Add Country
          </button>
        </div>
        {content.countries.length === 0 && (
          <div className="rounded-lg border border-dashed border-zinc-300 px-4 py-10 text-center">
            <p className="text-sm text-zinc-500">No country cards added yet.</p>
            <p className="mt-1 text-xs text-zinc-400">
              Add your first country to get started.
            </p>
          </div>
        )}
        {content.countries.map((country, index) => {
          const isExpanded = expandedCountry === index;

          return (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white transition-colors"
            >
              {/* Collapsed card header */}
              <div className="flex items-center gap-3 p-3 sm:p-4">
                <button
                  type="button"
                  onClick={() => setExpandedCountry(isExpanded ? null : index)}
                  aria-expanded={isExpanded}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                >
                  {country.image?.url ? (
                    <img
                      src={country.image.url}
                      alt={country.countryName || "Country"}
                      className="size-14 shrink-0 rounded-lg border border-zinc-200 object-cover"
                    />
                  ) : (
                    <div className="flex size-14 shrink-0 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50">
                      <ImagePlus className="size-5 text-zinc-400" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-zinc-900">
                      {country.countryName.trim() || `Country ${index + 1}`}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {country.image ? "Image uploaded" : "No image uploaded"}
                    </p>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="size-4 shrink-0 text-zinc-500" />
                  ) : (
                    <ChevronDown className="size-4 shrink-0 text-zinc-500" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    removeCountry(index);

                    if (expandedCountry === index) {
                      setExpandedCountry(null);
                    } else if (
                      expandedCountry !== null &&
                      expandedCountry > index
                    ) {
                      setExpandedCountry(expandedCountry - 1);
                    }
                  }}
                  disabled={uploadingIndex === index}
                  className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-lg px-2 py-2 text-sm text-red-600 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Trash2 className="size-4" />
                  <span className="hidden sm:inline">Remove</span>
                </button>
              </div>

              {/* Expanded editing fields */}
              {isExpanded && (
                <div className="space-y-5 border-t border-zinc-100 bg-zinc-50/50 p-4">
                  <div className="space-y-1.5">
                    <label className="block text-sm font-medium text-zinc-700">
                      Country Name
                    </label>

                    <input
                      value={country.countryName}
                      onChange={(event) =>
                        updateCountry(index, {
                          countryName: event.target.value,
                        })
                      }
                      placeholder="e.g. UK"
                      className={inputStyles}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-zinc-700">
                      Country Image
                    </label>

                    {country.image?.url && (
                      <div className="space-y-2">
                        <img
                          src={country.image.url}
                          alt={country.countryName || "Country"}
                          className="h-auto w-full max-w-sm rounded-lg border border-zinc-200 object-cover"
                        />

                        <p className="truncate text-xs text-zinc-500">
                          {country.image.publicId}
                        </p>
                      </div>
                    )}

                    <input
                      ref={(element) => {
                        inputRefs.current[index] = element;
                      }}
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      disabled={uploadingIndex !== null}
                      onChange={(event) => handleImageUpload(index, event)}
                      className="hidden"
                    />

                    <button
                      type="button"
                      onClick={() => inputRefs.current[index]?.click()}
                      disabled={uploadingIndex !== null}
                      className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {uploadingIndex === index ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <ImagePlus className="size-4" />
                      )}

                      {uploadingIndex === index
                        ? "Uploading..."
                        : country.image
                          ? "Replace Image"
                          : "Upload Image"}
                    </button>

                    {country.image && (
                      <button
                        type="button"
                        onClick={() => updateCountry(index, { image: null })}
                        disabled={uploadingIndex === index}
                        className="ml-3 cursor-pointer text-sm text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
