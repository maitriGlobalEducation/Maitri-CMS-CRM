export type BlogStatus = "draft" | "published";

export interface BlogImage {
  url: string;
  publicId: string;
}

export interface Blog {
  _id: string;

  title: string;
  slug: string;
  category: string;

  cardImage: BlogImage | null;
  contentImage: BlogImage | null;

  // Tiptap rich-text JSON
  content: Record<string, unknown>;

  status: BlogStatus;
  featured: boolean;

  publishedAt: string | null;

  createdAt: string;
  updatedAt: string;
}
