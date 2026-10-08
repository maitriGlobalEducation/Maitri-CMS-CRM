"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

import type { Scholarship, ScholarshipFormField } from "@/types/scholarship";

import ScholarshipImageUploader from "./ScholarshipImageUploader";
import ScholarshipApplicationFormBuilder from "./ScholarshipApplicationFormBuilder";
import BlogEditor from "@/components/cms/blogs/BlogEditor";

interface ScholarshipFormProps {
  scholarship: Scholarship | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  title: string;
  slug: string;
  deadline: string;
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
  deadline: "",

  content: {
    type: "doc",
    content: [
      {
        type: "paragraph",
      },
    ],
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
        title: scholarship.title,
        slug: scholarship.slug,
        deadline: scholarship.deadline ? scholarship.deadline.slice(0, 10) : "",

        content: scholarship.content,

        metaTitle: scholarship.metaTitle ?? "",
        metaDescription: scholarship.metaDescription ?? "",
        metaKeywords: scholarship.metaKeywords ?? [],
        focusKeyword: scholarship.focusKeyword ?? "",

        status: scholarship.status,
        applicationFields: scholarship.applicationForm?.fields ?? [],
      });

      setImages(uniqueImages);
      setCardImageIndex(loadedCardImageIndex >= 0 ? loadedCardImageIndex : 0);
      setSubmitError("");

      return;
    }

    setFormData(initialFormData);
    setImages([]);
    setCardImageIndex(0);
    setSubmitError("");
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

  const handleAddKeyword = () => {
    const keyword = metaKeywordsInput.trim();

    if (!keyword) return;

    setFormData((current) => ({
      ...current,
      metaKeywords: [...current.metaKeywords, keyword],
    }));

    setMetaKeywordsInput("");
  };

  const handleKeywordKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === ",") {
      event.preventDefault();
      handleAddKeyword();
    }
  };

  const removeKeyword = (index: number) => {
    setFormData((current) => ({
      ...current,
      metaKeywords: current.metaKeywords.filter((_, i) => i !== index),
    }));
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

      const payload = {
        title: formData.title,
        slug: formData.slug,
        deadline: formData.deadline || null,

        cardImage,
        contentImage,

        content: formData.content,

        applicationForm: {
          fields: formData.applicationFields,
        },

        metaTitle: formData.metaTitle,
        metaDescription: formData.metaDescription,
        metaKeywords: formData.metaKeywords,
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

              <div className="flex flex-wrap gap-2 rounded-lg border border-zinc-200 p-2 focus-within:border-zinc-400">
                {formData.metaKeywords.map((keyword, index) => (
                  <span
                    key={`${keyword}-${index}`}
                    className="flex items-center gap-1 rounded-md bg-zinc-100 px-2.5 py-1 text-xs text-zinc-700"
                  >
                    {keyword}

                    <button
                      type="button"
                      onClick={() => removeKeyword(index)}
                      className="cursor-pointer text-zinc-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}

                <input
                  type="text"
                  value={metaKeywordsInput}
                  onChange={(event) => setMetaKeywordsInput(event.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                  onBlur={handleAddKeyword}
                  placeholder={
                    formData.metaKeywords.length
                      ? "Add keyword..."
                      : "scholarship, study abroad, Italy scholarship"
                  }
                  className="min-w-50 flex-1 border-0 px-1 py-1 text-sm outline-none"
                />
              </div>

              <p className="mt-1.5 text-xs text-zinc-400">
                Press comma or leave the field to add a keyword.
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
