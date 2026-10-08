"use client";

import { ImagePlus, Loader2, Trash2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

import { uploadImage } from "@/services/media.service";

interface EventImage {
  url: string;
  publicId: string;
}

interface EventImageUploaderProps {
  images: EventImage[];
  cardImageIndex: number;
  onImagesChange: (images: EventImage[]) => void;
  onCardImageIndexChange: (index: number) => void;
}

export default function EventImageUploader({
  images,
  cardImageIndex,
  onImagesChange,
  onCardImageIndexChange,
}: EventImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleSelectFiles = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) return;

    if (images.length + files.length > 2) {
      toast.error("You can upload a maximum of 2 images.");
      event.target.value = "";
      return;
    }

    try {
      setIsUploading(true);

      const uploadedImages = await Promise.all(
        files.map((file) => uploadImage(file, "events")),
      );

      const nextImages = [...images, ...uploadedImages];

      onImagesChange(nextImages);

      if (nextImages.length === 1) {
        onCardImageIndexChange(0);
      }
    } catch (error) {
      console.error("EVENT IMAGE UPLOAD ERROR:", error);

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

  const handleRemove = (index: number) => {
    const nextImages = images.filter((_, imageIndex) => imageIndex !== index);

    onImagesChange(nextImages);

    if (nextImages.length <= 1) {
      onCardImageIndexChange(0);
      return;
    }

    if (index === cardImageIndex) {
      onCardImageIndexChange(0);
    } else if (index < cardImageIndex) {
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
        onChange={handleSelectFiles}
        className="hidden"
      />

      {images.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2">
          {images.map((image, index) => (
            <div
              key={image.publicId}
              className="overflow-hidden rounded-xl border border-zinc-200"
            >
              <div className="relative aspect-video bg-zinc-100">
                <img
                  src={image.url}
                  alt={`Event image ${index + 1}`}
                  className="h-full w-full object-cover"
                />

                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute right-3 top-3 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-white/90 text-zinc-600 shadow-sm transition hover:bg-white hover:text-red-600"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between gap-3 p-3">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="radio"
                    name="event-card-image"
                    checked={cardImageIndex === index}
                    onChange={() => onCardImageIndexChange(index)}
                  />
                  Card Image
                </label>

                <span className="text-xs text-zinc-400">Image {index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {images.length < 2 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 text-sm text-zinc-500 transition hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <ImagePlus className="h-5 w-5" />
              {images.length === 0
                ? "Upload event image"
                : "Upload second image"}
            </>
          )}
        </button>
      )}

      <p className="text-xs text-zinc-400">
        JPG, PNG or WebP. Maximum 10MB per image. You can upload up to 2 images.
      </p>
    </div>
  );
}
