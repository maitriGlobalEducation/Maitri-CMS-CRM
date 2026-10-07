"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

import { uploadImage, type UploadedMedia } from "@/services/media.service";

interface TestimonialImageUploaderProps {
  image: UploadedMedia | null;
  onImageChange: (image: UploadedMedia | null) => void;
}

export default function TestimonialImageUploader({
  image,
  onImageChange,
}: TestimonialImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isUploading, setIsUploading] = useState(false);

  const [uploadError, setUploadError] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setIsUploading(true);
      setUploadError("");

      const uploadedImage = await uploadImage(file, "testimonials");

      onImageChange(uploadedImage);
    } catch (error) {
      console.error("TESTIMONIAL IMAGE UPLOAD ERROR:", error);

      const message =
        error instanceof Error ? error.message : "Failed to upload image";

      setUploadError(message);
    } finally {
      setIsUploading(false);

      // Allow selecting the same file again
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  };

  const handleRemove = () => {
    onImageChange(null);
    setUploadError("");
  };

  return (
    <div className="space-y-4">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileChange}
        className="hidden"
      />

      {!image ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isUploading}
          className="flex h-48 w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 bg-zinc-50 transition hover:border-zinc-300 hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <ImagePlus size={28} className="text-zinc-400" />

          <p className="mt-3 text-sm font-medium text-zinc-700">
            {isUploading ? "Uploading..." : "Upload student image"}
          </p>

          <p className="mt-1 text-xs text-zinc-400">
            JPG, PNG or WebP · Max 10 MB
          </p>
        </button>
      ) : (
        <div className="relative w-fit">
          <img
            src={image.url}
            alt="Testimonial"
            className="h-48 w-48 rounded-xl border border-zinc-200 object-cover"
          />

          <button
            type="button"
            onClick={handleRemove}
            className="absolute right-2 top-2 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
            title="Remove image"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {uploadError && <p className="text-sm text-red-600">{uploadError}</p>}
    </div>
  );
}
