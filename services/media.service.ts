export interface UploadedMedia {
  url: string;
  publicId: string;
}

interface SignatureResponse {
  success: boolean;
  data: {
    signature: string;
    timestamp: number;
    folder: string;
    cloudName: string;
    apiKey: string;
  };
  message?: string;
}

interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  width: number;
  height: number;
  format: string;
  bytes: number;
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export type MediaType =
  | "blogs"
  | "scholarships"
  | "countries"
  | "events"
  | "testimonials"
  | "homepage";

export async function uploadImage(
  file: File,
  type: MediaType,
): Promise<UploadedMedia> {
  validateImage(file);

  // 1. Get a short-lived signature from our server.
  const signResponse = await fetch("/api/cms/media/sign", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      type,
    }),
  });

  const signResult: SignatureResponse = await signResponse.json();

  if (!signResponse.ok || !signResult.success) {
    throw new Error(signResult.message ?? "Failed to prepare image upload");
  }

  const { signature, timestamp, folder, cloudName, apiKey } = signResult.data;

  // 2. Build Cloudinary upload payload.
  const formData = new FormData();

  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  // 3. Upload directly from the browser to Cloudinary.
  const uploadResponse = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  const result: CloudinaryUploadResponse = await uploadResponse.json();

  if (!uploadResponse.ok) {
    throw new Error("Failed to upload image");
  }

  return {
    url: result.secure_url,
    publicId: result.public_id,
  };
}

function validateImage(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG and WebP images are allowed");
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error("Image must be smaller than 10 MB");
  }
}
