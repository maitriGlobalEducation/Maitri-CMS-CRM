"use client";

import { useEffect, useState } from "react";
import { ImagePlus } from "lucide-react";
import { University, UniversityStatus } from "@/types/university";

interface UniversityFormProps {
  university: University | null;
  onCancel: () => void;
}

interface UniversityFormData {
  name: string;
  slug: string;
  country: string;
  city: string;
  shortDescription: string;
  description: string;
  logoUrl: string;
  coverImageUrl: string;
  featured: boolean;
  status: UniversityStatus;
}

const initialFormData: UniversityFormData = {
  name: "",
  slug: "",
  country: "",
  city: "",
  shortDescription: "",
  description: "",
  logoUrl: "",
  coverImageUrl: "",
  featured: false,
  status: "draft",
};

export default function UniversityForm({
  university,
  onCancel,
}: UniversityFormProps) {
  const [formData, setFormData] = useState<UniversityFormData>(initialFormData);

  useEffect(() => {
    if (university) {
      setFormData({
        name: university.name,
        slug: university.slug,
        country: university.country,
        city: university.city,
        shortDescription: university.shortDescription,
        description: university.description,
        logoUrl: university.logoUrl,
        coverImageUrl: university.coverImageUrl,
        featured: university.featured,
        status: university.status,
      });

      return;
    }

    setFormData(initialFormData);
  }, [university]);

  const updateField = <K extends keyof UniversityFormData>(
    field: K,
    value: UniversityFormData[K],
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,

      // Auto-generate only while adding.
      slug: university ? prev.slug : generateSlug(value),
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // MongoDB/API will replace this later.
    console.log("University form:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-8 p-6">
        {/* Basic Information */}
        <FormSection
          title="Basic information"
          description="General information used throughout the website."
        >
          <div className="grid grid-cols-2 gap-5">
            <FormField label="University name" required>
              <input
                required
                value={formData.name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="e.g. Domus Academy"
                className={inputStyles}
              />
            </FormField>

            <FormField label="Slug" required>
              <input
                required
                value={formData.slug}
                onChange={(e) =>
                  updateField("slug", generateSlug(e.target.value))
                }
                placeholder="domus-academy"
                className={inputStyles}
              />
            </FormField>

            <FormField label="Country" required>
              <input
                required
                value={formData.country}
                onChange={(e) => updateField("country", e.target.value)}
                placeholder="Italy"
                className={inputStyles}
              />
            </FormField>

            <FormField label="City">
              <input
                value={formData.city}
                onChange={(e) => updateField("city", e.target.value)}
                placeholder="Milan"
                className={inputStyles}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Content */}
        <FormSection
          title="Content"
          description="Content visitors will see on the university page."
        >
          <div className="space-y-5">
            <FormField
              label="Short description"
              description="Used on university cards and previews."
              required
            >
              <textarea
                required
                rows={3}
                maxLength={250}
                value={formData.shortDescription}
                onChange={(e) =>
                  updateField("shortDescription", e.target.value)
                }
                placeholder="Write a short introduction..."
                className={`${inputStyles} resize-none`}
              />

              <p className="mt-1 text-right text-xs text-zinc-400">
                {formData.shortDescription.length}/250
              </p>
            </FormField>

            <FormField label="Description" required>
              <textarea
                required
                rows={7}
                value={formData.description}
                onChange={(e) => updateField("description", e.target.value)}
                placeholder="Write the complete university description..."
                className={`${inputStyles} resize-y`}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Media */}
        <FormSection
          title="Media"
          description="University branding and page imagery."
        >
          <div className="grid grid-cols-2 gap-5">
            <MediaPlaceholder label="University logo" />
            <MediaPlaceholder label="Cover image" />
          </div>

          <p className="mt-3 text-xs text-zinc-400">
            Upload functionality will be connected when Cloudinary is
            configured.
          </p>
        </FormSection>

        {/* Publishing */}
        <FormSection
          title="Publishing"
          description="Control how this university appears on the website."
        >
          <div className="flex flex-col gap-5 max-w-90">
            <FormField label="Status">
              <select
                value={formData.status}
                onChange={(e) =>
                  updateField("status", e.target.value as UniversityStatus)
                }
                className={inputStyles}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </FormField>

            <div className="flex items-end">
              <label className="flex w-full cursor-pointer items-center justify-between rounded-lg border border-zinc-200 px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-zinc-800">
                    Featured university
                  </p>

                  <p className="mt-0.5 text-xs text-zinc-500">
                    Highlight this university on the website.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => updateField("featured", e.target.checked)}
                  className="h-4 w-4"
                />
              </label>
            </div>
          </div>
        </FormSection>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 flex justify-end gap-3 border-t border-zinc-200 bg-white px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          {university ? "Save Changes" : "Add University"}
        </button>
      </div>
    </form>
  );
}

function FormSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
        <p className="mt-0.5 text-xs text-zinc-500">{description}</p>
      </div>

      {children}
    </section>
  );
}

function FormField({
  label,
  description,
  required,
  children,
}: {
  label: string;
  description?: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-700">
        {label}

        {required && <span className="ml-1 text-red-500">*</span>}
      </span>

      {description && (
        <span className="mb-2 block text-xs text-zinc-500">{description}</span>
      )}

      {children}
    </label>
  );
}

function MediaPlaceholder({ label }: { label: string }) {
  return (
    <div>
      <p className="mb-1.5 text-sm font-medium text-zinc-700">{label}</p>

      <div className="flex h-36 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-zinc-50">
        <div className="text-center">
          <ImagePlus className="mx-auto text-zinc-400" size={24} />

          <p className="mt-2 text-xs text-zinc-500">Upload coming soon</p>
        </div>
      </div>
    </div>
  );
}

const inputStyles =
  "w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-zinc-400 focus:ring-2 focus:ring-zinc-100";
