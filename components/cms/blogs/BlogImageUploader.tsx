"use client";

import { ChangeEvent, useRef, useState } from "react";
import { ImagePlus, Loader2, RefreshCw, Trash2, Upload } from "lucide-react";

import { uploadImage, type UploadedMedia } from "@/services/media.service";

interface BlogImageUploaderProps {
  images: UploadedMedia[];
  cardImageIndex: number;
  onImagesChange: (images: UploadedMedia[]) => void;
  onCardImageChange: (index: number) => void;
}

export default function BlogImageUploader({
  images,
  cardImageIndex,
  onImagesChange,
  onCardImageChange,
}: BlogImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);

    // Allow selecting the same file again later.
    event.target.value = "";

    if (!files.length) return;

    const availableSlots = 2 - images.length;
    const filesToUpload = files.slice(0, availableSlots);

    if (!filesToUpload.length) return;

    try {
      setUploading(true);
      setError("");

      // If two files are selected, upload them simultaneously.
      const uploadedImages = await Promise.all(
        filesToUpload.map((file) => uploadImage(file, "blogs")),
      );

      onImagesChange([...images, ...uploadedImages]);
    } catch (error) {
      console.error("BLOG IMAGE UPLOAD ERROR:", error);

      setError(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    const updatedImages = images.filter(
      (_, imageIndex) => imageIndex !== index,
    );

    onImagesChange(updatedImages);

    // With zero/one image, index 0 is always the card image.
    if (updatedImages.length <= 1) {
      onCardImageChange(0);
      return;
    }

    if (index < cardImageIndex) {
      onCardImageChange(cardImageIndex - 1);
    } else if (index === cardImageIndex) {
      onCardImageChange(0);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        disabled={uploading || images.length >= 2}
        onChange={handleFileChange}
        className="hidden"
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {images.map((image, index) => {
          const isCardImage = images.length === 1 || cardImageIndex === index;

          return (
            <div
              key={image.publicId}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <div className="relative h-52 bg-zinc-100">
                <img
                  src={image.url}
                  alt={`Blog upload ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => handleRemove(index)}
                  title="Remove image"
                  className="absolute right-2 top-2 cursor-pointer flex h-8 w-8 items-center justify-center rounded-lg bg-white/95 text-zinc-600 shadow-sm transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>

                <div className="absolute bottom-2 left-2 rounded-md bg-black/70 px-2 py-1 text-xs font-medium text-white">
                  Image {index + 1}
                </div>
              </div>

              <div className="p-4">
                {images.length === 1 ? (
                  <div className="rounded-lg bg-zinc-50 px-3 py-2">
                    <p className="text-xs font-medium text-zinc-700">
                      Card image + Blog image
                    </p>

                    <p className="mt-1 text-xs text-zinc-500">
                      Upload another image if you want them to be different.
                    </p>
                  </div>
                ) : (
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="radio"
                      name="blog-card-image"
                      checked={isCardImage}
                      onChange={() => onCardImageChange(index)}
                      className="mt-0.5 h-4 w-4"
                    />

                    <div>
                      <p className="text-sm font-medium text-zinc-800">
                        {isCardImage ? "Card image" : "Blog image"}
                      </p>

                      <p className="mt-0.5 text-xs text-zinc-500">
                        {isCardImage
                          ? "Shown on blog cards and listings."
                          : "Shown inside the blog page."}
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          );
        })}

        {images.length < 2 && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex min-h-52 flex-col items-center justify-center rounded-xl cursor-pointer border border-dashed border-zinc-300 bg-zinc-50 p-6 text-center transition hover:border-zinc-400 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {uploading ? (
              <>
                <Loader2 size={24} className="animate-spin text-zinc-500" />

                <p className="mt-3 text-sm font-medium text-zinc-700">
                  Uploading...
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  Please don't close this window.
                </p>
              </>
            ) : (
              <>
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 bg-white">
                  {images.length === 0 ? (
                    <ImagePlus size={20} className="text-zinc-500" />
                  ) : (
                    <Upload size={20} className="text-zinc-500" />
                  )}
                </div>

                <p className="mt-3 text-sm font-medium text-zinc-700">
                  {images.length === 0 ? "Upload image" : "Upload second image"}
                </p>

                <p className="mt-1 text-xs text-zinc-500">
                  JPG, PNG or WebP · Max 100 MB
                </p>
              </>
            )}
          </button>
        )}
      </div>

      {images.length === 2 && (
        <p className="text-xs text-zinc-500">
          Select the image to use on blog cards. The other image will
          automatically be used inside the blog.
        </p>
      )}

      {error && (
        <div className="flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2">
          <p className="text-sm text-red-700">{error}</p>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex shrink-0 items-center gap-1.5 text-xs font-medium text-red-700 hover:text-red-900"
          >
            <RefreshCw size={13} />
            Try again
          </button>
        </div>
      )}
    </div>
  );
}
