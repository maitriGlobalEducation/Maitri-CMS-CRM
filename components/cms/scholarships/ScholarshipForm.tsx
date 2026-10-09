"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "react-toastify";

import ScholarshipImageUploader from "./ScholarshipImageUploader";
import ScholarshipApplicationFormBuilder from "./ScholarshipApplicationFormBuilder";
import BlogEditor from "@/components/cms/blogs/BlogEditor";

import type {
  Scholarship,
  ScholarshipFormField,
  ScholarshipImage,
} from "@/types/scholarship";

import { uploadImage } from "@/services/media.service";

interface ScholarshipFormProps {
  scholarship: Scholarship | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  slug: string;
  description: string;
  amount: string;
  deadline: string;
  ctaLabel: string;
  ctaUrl: string;
  content: Record<string, unknown>;

  metaTitle: string;
  metaDescription: string;
  metaKeywords: string[];
  focusKeyword: string;

  status: "draft" | "published";
  applicationFields: ScholarshipFormField[];
}

const initialFormData: FormData = {
  title: "",
  slug: "",
  description: "",
  amount: "",
  deadline: "",
  ctaLabel: "Learn More",
  ctaUrl: "",

  content: {
    type: "doc",
    content: [{ type: "paragraph" }],
  },

  metaTitle: "",
  metaDescription: "",
  metaKeywords: [],
  focusKeyword: "",

  status: "draft",
  applicationFields: [],
};

export default function ScholarshipForm({
  scholarship,
  onSuccess,
  onCancel,
}: ScholarshipFormProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  const [images, setImages] = useState<{ url: string; publicId: string }[]>([]);

  const [cardImageIndex, setCardImageIndex] = useState(0);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const [metaKeywordsInput, setMetaKeywordsInput] = useState("");

  const [logo, setLogo] = useState<ScholarshipImage | null>(null);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(scholarship);

  useEffect(() => {
    if (scholarship) {
      const loadedImages = [
        scholarship.cardImage,
        scholarship.contentImage,
      ].filter(Boolean) as {
        url: string;
        publicId: string;
      }[];

      const uniqueImages = loadedImages.filter(
        (image, index, array) =>
          array.findIndex((item) => item.publicId === image.publicId) === index,
      );

      const loadedCardImageIndex =
        scholarship.cardImage && uniqueImages.length
          ? uniqueImages.findIndex(
              (image) => image.publicId === scholarship.cardImage?.publicId,
            )
          : 0;

      setFormData({
        title: scholarship.title ?? "",
        slug: scholarship.slug ?? "",
        description: scholarship.description ?? "",
        amount: scholarship.amount ?? "",
        deadline: scholarship.deadline ? scholarship.deadline.slice(0, 10) : "",
        ctaLabel: scholarship.ctaLabel ?? "Learn More",
        ctaUrl: scholarship.ctaUrl ?? "",

        content: scholarship.content,

        metaTitle: scholarship.metaTitle ?? "",
        metaDescription: scholarship.metaDescription ?? "",
        metaKeywords: scholarship.metaKeywords ?? [],
        focusKeyword: scholarship.focusKeyword ?? "",

        status: scholarship.status,
        applicationFields: scholarship.applicationForm?.fields ?? [],
      });

      setLogo(scholarship.logo ?? null);
      setMetaKeywordsInput((scholarship.metaKeywords ?? []).join(", "));
      setImages(uniqueImages);
      setCardImageIndex(loadedCardImageIndex >= 0 ? loadedCardImageIndex : 0);
      setSubmitError("");

      return;
    }

    setFormData(initialFormData);
    setMetaKeywordsInput("");
    setImages([]);
    setCardImageIndex(0);
    setSubmitError("");
    setLogo(null);
  }, [scholarship]);

  const contentImageIndex = useMemo(() => {
    if (images.length < 2) return 0;

    return cardImageIndex === 0 ? 1 : 0;
  }, [images.length, cardImageIndex]);

  const handleTitleChange = (value: string) => {
    setFormData((current) => ({
      ...current,
      title: value,
      slug: current.slug
        ? current.slug
        : value
            .toLowerCase()
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, ""),
    }));
  };

  const handleLogoUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsUploadingLogo(true);

      const uploadedLogo = await uploadImage(file, "scholarships");
      setLogo(uploadedLogo);
    } catch (error) {
      console.error("SCHOLARSHIP LOGO UPLOAD ERROR:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to upload institute logo",
      );
    } finally {
      setIsUploadingLogo(false);

      if (logoInputRef.current) {
        logoInputRef.current.value = "";
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      setSubmitError("");

      const cardImage = images.length > 0 ? images[cardImageIndex] : null;

      const contentImage =
        images.length > 1 ? images[contentImageIndex] : (images[0] ?? null);

      const metaKeywords = [
        ...new Set(
          metaKeywordsInput
            .split(",")
            .map((keyword) => keyword.trim())
            .filter(Boolean)
            .map((keyword) => keyword.toLowerCase()),
        ),
      ];

      const payload = {
        title: formData.title,
        slug: formData.slug,
        description: formData.description,
        amount: formData.amount.trim() || null,
        logo,

        deadline: formData.deadline || null,

        cardImage,
        contentImage,

        content: formData.content,

        applicationForm: {
          fields: formData.applicationFields,
        },

        ctaLabel: formData.ctaLabel,
        ctaUrl: formData.ctaUrl,

        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords,
        focusKeyword: formData.focusKeyword,

        status: formData.status,
      };

      const url = isEditing
        ? `/api/cms/scholarships/${scholarship!._id}`
        : "/api/cms/scholarships";

      const method = isEditing ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ??
            (isEditing
              ? "Failed to update scholarship"
              : "Failed to create scholarship"),
        );
      }

      toast.success(
        isEditing
          ? "Scholarship updated successfully"
          : "Scholarship created successfully",
      );

      setFormData(initialFormData);
      setImages([]);
      setLogo(null);
      onSuccess();
    } catch (error) {
      console.error(
        isEditing ? "UPDATE SCHOLARSHIP ERROR:" : "CREATE SCHOLARSHIP ERROR:",
        error,
      );

      const message =
        error instanceof Error
          ? error.message
          : isEditing
            ? "Failed to update scholarship"
            : "Failed to create scholarship";

      setSubmitError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-zinc-200 bg-white"
    >
      <div className="space-y-8 p-6">
        {/* Basic Information */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-zinc-900">
              Basic Information
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Add the main scholarship details.
            </p>
          </div>

          <div className="grid gap-5">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Scholarship Title
              </label>

              <input
                type="text"
                value={formData.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                placeholder="e.g. Istituto Marangoni Personalized Scholarships"
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400"
                required
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Short Description
              </label>
              <textarea
                value={formData.description}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    description: event.target.value,
                  }))
                }
                placeholder="Briefly describe this scholarship..."
                rows={3}
                className="w-full resize-y rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400"
              />
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Slug
                </label>

                <input
                  type="text"
                  value={formData.slug}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      slug: event.target.value,
                    }))
                  }
                  placeholder="scholarship-slug"
                  className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                  Application Deadline
                </label>

                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(event) =>
                    setFormData((current) => ({
                      ...current,
                      deadline: event.target.value,
                    }))
                  }
                  className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Scholarship Amount
              </label>
              <input
                type="text"
                value={formData.amount}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    amount: event.target.value,
                  }))
                }
                placeholder="e.g. €15,000 or 100% Tuition Fee Waiver"
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400"
              />
              <p className="mt-1.5 text-xs text-zinc-400">
                Include the currency or describe the funding amount.
              </p>
            </div>
          </div>
        </section>

        {/* Images */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-zinc-900">
              Scholarship Images
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Upload one image to use everywhere, or two images to control the
              card and detail-page images separately.
            </p>
          </div>

          <ScholarshipImageUploader
            images={images}
            cardImageIndex={cardImageIndex}
            onImagesChange={setImages}
            onCardImageIndexChange={setCardImageIndex}
          />
        </section>

        {/* Institute Logo */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-zinc-900">
              Institute Logo
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Upload the logo of the university or institute providing this
              scholarship.
            </p>
          </div>

          <input
            ref={logoInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleLogoUpload}
            className="hidden"
          />

          {logo ? (
            <div className="flex items-center gap-4 rounded-xl border border-zinc-200 p-4">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-zinc-100 bg-white p-2">
                <img
                  src={logo.url}
                  alt="Institute logo"
                  className="max-h-full max-w-full object-contain"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-zinc-800">
                  Institute logo uploaded
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  This logo is stored separately from the scholarship images.
                </p>

                <div className="mt-3 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => logoInputRef.current?.click()}
                    disabled={isUploadingLogo}
                    className="cursor-pointer text-sm font-medium text-zinc-700 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isUploadingLogo ? "Uploading..." : "Replace logo"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setLogo(null)}
                    disabled={isUploadingLogo}
                    className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Remove logo
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={isUploadingLogo}
              className="flex h-36 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition hover:border-zinc-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="text-sm font-medium text-zinc-700">
                {isUploadingLogo
                  ? "Uploading logo..."
                  : "Upload institute logo"}
              </span>
              <span className="mt-1 text-xs text-zinc-400">
                JPG, PNG or WebP
              </span>
            </button>
          )}
        </section>

        {/* Content */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-zinc-900">
              Scholarship Content
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Write the scholarship details, eligibility, benefits and other
              information.
            </p>
          </div>

          <div className="overflow-hidden rounded-xl border border-zinc-200">
            <BlogEditor
              content={formData.content}
              onChange={(content) =>
                setFormData((current) => ({
                  ...current,
                  content,
                }))
              }
            />
          </div>
        </section>

        {/* Call to Action */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-zinc-900">
              Call to Action
            </h2>
            <p className="mt-1 text-sm text-zinc-500">
              Configure the button shown for this scholarship.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Button Label
              </label>
              <input
                type="text"
                value={formData.ctaLabel}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    ctaLabel: event.target.value,
                  }))
                }
                placeholder="Learn More"
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Destination URL
              </label>
              <input
                type="text"
                value={formData.ctaUrl}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    ctaUrl: event.target.value,
                  }))
                }
                placeholder="/scholarships/example or https://..."
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </div>
          </div>
        </section>

        {/* Application Form */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-zinc-900">
              Application Form
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Configure the fields students will see when applying for this
              scholarship.
            </p>
          </div>

          <ScholarshipApplicationFormBuilder
            fields={formData.applicationFields}
            onChange={(applicationFields) =>
              setFormData((current) => ({
                ...current,
                applicationFields,
              }))
            }
          />
        </section>

        {/* SEO */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-zinc-900">SEO</h2>

            <p className="mt-1 text-sm text-zinc-500">
              Configure the search engine metadata for this scholarship page.
            </p>
          </div>

          <div className="space-y-5">
            {/* Meta Title */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Meta Title
              </label>

              <input
                type="text"
                value={formData.metaTitle}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    metaTitle: event.target.value,
                  }))
                }
                placeholder="Scholarship Name | Maitri Global Education"
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </div>

            {/* Meta Description */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Meta Description
              </label>

              <textarea
                value={formData.metaDescription}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    metaDescription: event.target.value,
                  }))
                }
                rows={4}
                placeholder="Write a short description of this scholarship..."
                className="w-full resize-none rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400"
              />
            </div>

            {/* Meta Keywords */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Meta Keywords
              </label>

              <textarea
                value={metaKeywordsInput}
                onChange={(event) => setMetaKeywordsInput(event.target.value)}
                placeholder="scholarship, study abroad, Italy scholarship, university funding"
                rows={3}
                className="w-full resize-y rounded-lg border border-zinc-200 px-3 py-2.5 text-sm outline-none transition focus:border-zinc-400"
              />

              <p className="mt-1.5 text-xs text-zinc-400">
                Enter or paste multiple keywords separated by commas.
              </p>
            </div>

            {/* Focus Keyword */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                Focus Keyword
              </label>

              <input
                type="text"
                value={formData.focusKeyword}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    focusKeyword: event.target.value,
                  }))
                }
                placeholder="Italy scholarship"
                className="h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400"
              />
            </div>
          </div>
        </section>

        {/* Publishing */}
        <section>
          <div className="mb-5">
            <h2 className="text-base font-semibold text-zinc-900">
              Publishing
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Control whether this scholarship is visible publicly.
            </p>
          </div>

          <div className="flex flex-wrap gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
              <input
                type="radio"
                name="scholarship-status"
                value="draft"
                checked={formData.status === "draft"}
                onChange={() =>
                  setFormData((current) => ({
                    ...current,
                    status: "draft",
                  }))
                }
              />
              Draft
            </label>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
              <input
                type="radio"
                name="scholarship-status"
                value="published"
                checked={formData.status === "published"}
                onChange={() =>
                  setFormData((current) => ({
                    ...current,
                    status: "published",
                  }))
                }
              />
              Published
            </label>
          </div>
        </section>

        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {submitError}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 rounded-b-xl border-t border-zinc-200 bg-white px-6 py-4">
        {scholarship && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="h-10 rounded-lg border border-zinc-200 px-4 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel Edit
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-10 cursor-pointer rounded-lg bg-zinc-900 px-5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSubmitting
            ? "Saving..."
            : scholarship
              ? "Save Changes"
              : "Create Scholarship"}
        </button>
      </div>
    </form>
  );
}
