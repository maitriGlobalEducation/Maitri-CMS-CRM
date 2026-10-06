import BlogsManager from "@/components/cms/blogs/BlogsManager";

export default function BlogsPage() {
  return (
    <div>
      {/* <div className="mb-8">
        <h1 className="text-2xl font-semibold text-zinc-950">Blogs</h1>

        <p className="mt-1 text-sm text-zinc-500">
          Create and manage articles published on the Maitri website.
        </p>
      </div> */}

      <BlogsManager />
    </div>
  );
}
