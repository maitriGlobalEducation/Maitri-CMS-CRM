"use client";

import { X } from "lucide-react";
import { Blog } from "@/types/blog";
import BlogForm from "./BlogForm";

interface BlogModalProps {
  open: boolean;
  blog: Blog | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function BlogModal({
  open,
  blog,
  onClose,
  onSuccess,
}: BlogModalProps) {
  if (!open) return null;

  const isEditing = blog !== null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-black/40"
      />

      {/* Modal */}
      <div className="relative z-10 max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              {isEditing ? "Edit Blog" : "Add Blog"}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {isEditing
                ? "Update the article and publishing information."
                : "Create a new article for the Maitri website."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition cursor-pointer hover:bg-zinc-200 hover:text-zinc-950"
          >
            <X size={20} />
          </button>
        </div>

        <BlogForm blog={blog} onCancel={onClose} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
