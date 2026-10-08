"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { uploadImage, type UploadedMedia } from "@/services/media.service";

interface ScholarshipImageUploaderProps {
  images: UploadedMedia[];
  cardImageIndex: number;
  onImagesChange: (images: UploadedMedia[]) => void;
  onCardImageIndexChange: (index: number) => void;
}

export default function ScholarshipImageUploader({
  images,
  cardImageIndex,
  onImagesChange,
  onCardImageIndexChange,
}: ScholarshipImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) return;

    if (images.length + files.length > 2) {
      setUploadError("You can upload a maximum of 2 images.");
      return;
    }

    try {
      setIsUploading(true);
      setUploadError("");

      const uploadedImages = await Promise.all(
        files.map((file) => uploadImage(file, "scholarships")),
      );

      const nextImages = [...images, ...uploadedImages];

      onImagesChange(nextImages);

      if (nextImages.length === 1) {
        onCardImageIndexChange(0);
      }
    } catch (error) {
      console.error("SCHOLARSHIP IMAGE UPLOAD ERROR:", error);

      setUploadError(
        error instanceof Error ? error.message : "Failed to upload image",
      );
    } finally {
      setIsUploading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = (index: number) => {
    const nextImages = images.filter((_, imageIndex) => imageIndex !== index);

    onImagesChange(nextImages);

    if (nextImages.length === 0) {
      onCardImageIndexChange(0);
      return;
    }

    if (cardImageIndex === index) {
      onCardImageIndexChange(0);
    } else if (cardImageIndex > index) {
      onCardImageIndexChange(cardImageIndex - 1);
    }
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        onChange={handleFileChange}
        className="hidden"
      />

      {images.length < 2 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex h-44 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition hover:border-zinc-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ImagePlus size={28} className="text-zinc-400" />

          <p className="mt-3 text-sm font-medium text-zinc-700">
            {isUploading ? "Uploading..." : "Upload scholarship image"}
          </p>

          <p className="mt-1 text-xs text-zinc-400">
            JPG, PNG or WebP · Max 10 MB · Up to 2 images
          </p>
        </button>
      )}

      {images.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {images.map((image, index) => (
            <div
              key={image.publicId}
              className="rounded-xl border border-zinc-200 bg-white p-3"
            >
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={image.url}
                  alt={`Scholarship image ${index + 1}`}
                  className="h-52 w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
                  title="Remove image"
                >
                  <X size={16} />
                </button>
              </div>

              {images.length > 1 ? (
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="radio"
                    name="scholarship-card-image"
                    checked={cardImageIndex === index}
                    onChange={() => onCardImageIndexChange(index)}
                  />
                  Use as card image
                </label>
              ) : (
                <p className="mt-3 text-xs text-zinc-500">
                  This image will be used for both the card and scholarship
                  page.
                </p>
              )}

              {images.length > 1 && cardImageIndex === index && (
                <p className="mt-1 text-xs text-zinc-400">
                  The other image will be used inside the scholarship page.
                </p>
              )}
            </div>
          ))}
        </div>
      )}

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
    </div>
  );
}
