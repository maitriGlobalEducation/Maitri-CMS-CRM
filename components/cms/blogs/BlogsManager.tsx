"use client";

import { useCallback, useEffect, useState } from "react";
import { FileText, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";

import BlogModal from "./BlogModal";
import type { Blog } from "@/types/blog";
import { toast } from "react-toastify";

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState<Blog | null>(null);

  const [blogToDelete, setBlogToDelete] = useState<Blog | null>(null);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchBlogs = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/cms/blogs", {
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Failed to fetch blogs");
      }

      setBlogs(result.data);
    } catch (error) {
      console.error("FETCH BLOGS ERROR:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleDeleteBlog = async () => {
    if (!blogToDelete || isDeleting) return;

    try {
      setIsDeleting(true);
      setDeleteError("");

      const response = await fetch(`/api/cms/blogs/${blogToDelete._id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message ?? "Failed to delete blog");
      }

      toast.success("Blog deleted successfully");

      setBlogToDelete(null);

      await fetchBlogs();
    } catch (error) {
      console.error("DELETE BLOG ERROR:", error);

      const message =
        error instanceof Error ? error.message : "Failed to delete blog";

      setDeleteError(message);
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [fetchBlogs]);

  const handleAddBlog = () => {
    setSelectedBlog(null);
    setIsModalOpen(true);
  };

  const handleEditBlog = (blog: Blog) => {
    setSelectedBlog(blog);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedBlog(null);
  };

  return (
    <>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleAddBlog}
          className="flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          <Plus size={17} />
          Add Blog
        </button>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-zinc-200 bg-white">
        {isLoading ? (
          <div className="flex min-h-64 items-center justify-center">
            <div className="flex items-center gap-2 text-sm text-zinc-500">
              <Loader2 size={18} className="animate-spin" />
              Loading blogs...
            </div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center p-6 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-100">
              <FileText size={20} className="text-zinc-500" />
            </div>

            <p className="mt-3 text-sm font-medium text-zinc-900">
              No blogs yet
            </p>

            <p className="mt-1 text-xs text-zinc-500">
              Create your first blog to get started.
            </p>

            <button
              type="button"
              onClick={handleAddBlog}
              className="mt-4 text-sm font-medium text-zinc-900 underline underline-offset-4"
            >
              Add Blog
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b border-zinc-200 bg-zinc-50">
                <tr>
                  <TableHeading>Blog</TableHeading>
                  <TableHeading>Category</TableHeading>
                  <TableHeading>Status</TableHeading>
                  <TableHeading>Created</TableHeading>

                  <th className="w-20 px-5 py-3" />
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {blogs.map((blog) => (
                  <tr key={blog._id} className="transition hover:bg-zinc-50">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {blog.cardImage?.url ? (
                          <img
                            src={blog.cardImage.url}
                            alt=""
                            className="h-12 w-16 shrink-0 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-16 shrink-0 items-center justify-center rounded-lg bg-zinc-100">
                            <FileText size={17} className="text-zinc-400" />
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="max-w-md truncate text-sm font-medium text-zinc-900">
                              {blog.title}
                            </p>

                            {blog.featured && (
                              <Star
                                size={14}
                                className="shrink-0 fill-amber-400 text-amber-400"
                              />
                            )}
                          </div>

                          <p className="mt-1 text-xs text-zinc-500">
                            /{blog.slug}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-sm text-zinc-600">
                      {blog.category}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={blog.status} />
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-sm text-zinc-500">
                      {formatDate(blog.createdAt)}
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          type="button"
                          onClick={() => handleEditBlog(blog)}
                          title="Edit blog"
                          className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setDeleteError("");
                            setBlogToDelete(blog);
                          }}
                          title="Delete blog"
                          className="inline-flex cursor-pointer h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BlogModal
        open={isModalOpen}
        blog={selectedBlog}
        onClose={handleCloseModal}
        onSuccess={() => {
          handleCloseModal();
          fetchBlogs();
        }}
      />

      {blogToDelete && (
        <div
          onClick={() => {
            if (isDeleting) return;

            setBlogToDelete(null);
            setDeleteError("");
          }}
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50">
              <Trash2 size={20} className="text-red-600" />
            </div>

            <h2 className="mt-4 text-lg font-semibold text-zinc-900">
              Delete blog?
            </h2>

            <p className="mt-2 text-sm leading-6 text-zinc-600">
              Are you sure you want to delete{" "}
              <span className="font-medium text-zinc-900">
                {blogToDelete.title}
              </span>
              ? This action cannot be undone.
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              The blog and its uploaded images will be permanently deleted.
            </p>

            {deleteError && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {deleteError}
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => {
                  setBlogToDelete(null);
                  setDeleteError("");
                }}
                className="rounded-lg cursor-pointer border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteBlog}
                className="inline-flex cursor-pointer min-w-28 items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function TableHeading({ children }: { children: React.ReactNode }) {
  return (
    <th className="px-5 py-3 text-left text-xs font-medium uppercase tracking-wide text-zinc-500">
      {children}
    </th>
  );
}

function StatusBadge({ status }: { status: Blog["status"] }) {
  const isPublished = status === "published";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
        isPublished
          ? "bg-emerald-100 text-emerald-500 border border-emerald-500"
          : "bg-amber-100 text-amber-500 border border-amber-500"
      }`}
    >
      {isPublished ? "Published" : "Draft"}
    </span>
  );
}

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
