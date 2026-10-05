"use client";

import { University } from "@/types/university";
import { X } from "lucide-react";
import UniversityForm from "./UniversityForm";

interface UniversityModalProps {
  open: boolean;
  university: University | null;
  onClose: () => void;
}

export default function UniversityModal({
  open,
  university,
  onClose,
}: UniversityModalProps) {
  if (!open) return null;

  const isEditing = university !== null;

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
      <div className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 bg-white px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-zinc-950">
              {isEditing ? "Edit University" : "Add University"}
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              {isEditing
                ? "Update university information."
                : "Add a new university to the website."}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-950"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form will go here */}
        <div className="p-6">
          <p className="text-sm text-zinc-500">University form coming next.</p>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex justify-end gap-3 border-t border-zinc-200 bg-white px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            Cancel
          </button>

          <button
            type="button"
            className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            {isEditing ? "Save Changes" : "Add University"}
          </button>
        </div>
        <UniversityForm university={university} onCancel={onClose} />
      </div>
    </div>
  );
}
