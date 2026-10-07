"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { Testimonial } from "@/types/testimonial";
import TestimonialForm from "./TestimonialForm";

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);

  const [testimonialToDelete, setTestimonialToDelete] =
    useState<Testimonial | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);

  const [deleteError, setDeleteError] = useState("");

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/cms/testimonials");

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Failed to fetch testimonials");
      }

      setTestimonials(result.data);
    } catch (error) {
      console.error("FETCH TESTIMONIALS ERROR:", error);

      toast.error("Failed to fetch testimonials");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const handleAddTestimonial = () => {
    setSelectedTestimonial(null);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleEditTestimonial = (testimonial: Testimonial) => {
    setSelectedTestimonial(testimonial);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleFormSuccess = async () => {
    setSelectedTestimonial(null);

    await fetchTestimonials();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDeleteTestimonial = async () => {
    if (!testimonialToDelete || isDeleting) {
      return;
    }

    try {
      setIsDeleting(true);
      setDeleteError("");

      const response = await fetch(
        `/api/cms/testimonials/${testimonialToDelete._id}`,
        {
          method: "DELETE",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Failed to delete testimonial");
      }

      toast.success("Testimonial deleted successfully");

      setTestimonialToDelete(null);

      await fetchTestimonials();
    } catch (error) {
      console.error("DELETE TESTIMONIAL ERROR:", error);

      const message =
        error instanceof Error ? error.message : "Failed to delete testimonial";

      setDeleteError(message);
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-10">
      {/* FORM */}
      <section>
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-950">
              {selectedTestimonial ? "Edit Testimonial" : "Add Testimonial"}
            </h1>

            <p className="mt-1 text-sm text-zinc-500">
              {selectedTestimonial
                ? "Update the testimonial details and save your changes."
                : "Add a student testimonial to the website."}
            </p>
          </div>

          {selectedTestimonial && (
            <button
              type="button"
              onClick={handleAddTestimonial}
              className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
            >
              <Plus size={16} />
              Add New Testimonial
            </button>
          )}
        </div>

        <TestimonialForm
          testimonial={selectedTestimonial}
          onCancel={handleAddTestimonial}
          onSuccess={handleFormSuccess}
        />
      </section>

      {/* LIST */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-zinc-950">
              Testimonials
            </h2>

            <p className="mt-1 text-sm text-zinc-500">
              Manage student testimonials.
            </p>
          </div>

          {!selectedTestimonial && (
            <span className="text-sm text-zinc-500">
              {testimonials.length}{" "}
              {testimonials.length === 1 ? "testimonial" : "testimonials"}
            </span>
          )}
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          {isLoading ? (
            <div className="p-8 text-center text-sm text-zinc-500">
              Loading testimonials...
            </div>
          ) : testimonials.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-zinc-500">
                No testimonials have been created yet.
              </p>

              <button
                type="button"
                onClick={handleAddTestimonial}
                className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                <Plus size={16} />
                Add Your First Testimonial
              </button>
            </div>
          ) : (
            <table className="w-full">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Student
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Course
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    University
                  </th>

                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Date
                  </th>

                  <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-zinc-500">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {testimonials.map((testimonial) => (
                  <tr
                    key={testimonial._id}
                    className="transition hover:bg-zinc-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {testimonial.image ? (
                          <img
                            src={testimonial.image.url}
                            alt={testimonial.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-xs text-zinc-400">
                            N/A
                          </div>
                        )}

                        <div className="min-w-0">
                          <p className="truncate font-medium text-zinc-900">
                            {testimonial.name}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-600">
                      {testimonial.course}
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-600">
                      {testimonial.university}
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-500">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEditTestimonial(testimonial)}
                          title="Edit testimonial"
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError("");
                            setTestimonialToDelete(testimonial);
                          }}
                          title="Delete testimonial"
                          className="inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>

      {/* DELETE CONFIRMATION */}
      {testimonialToDelete && (
        <div
          onClick={() => {
            if (isDeleting) return;

            setTestimonialToDelete(null);
            setDeleteError("");
          }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <h3 className="text-lg font-semibold text-zinc-950">
              Delete testimonial?
            </h3>

            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Are you sure you want to delete{" "}
              <span className="font-medium text-zinc-800">
                "{testimonialToDelete.name}"
              </span>
              ? This action cannot be undone.
            </p>

            {deleteError && (
              <p className="mt-3 text-sm text-red-600">{deleteError}</p>
            )}

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setTestimonialToDelete(null);
                  setDeleteError("");
                }}
                className="cursor-pointer rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteTestimonial}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
