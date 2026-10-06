import mongoose, { Schema } from "mongoose";

const BlogImageSchema = new Schema(
  {
    url: {
      type: String,
      required: true,
    },

    publicId: {
      type: String,
      required: true,
    },
  },
  {
    _id: false,
  },
);

const BlogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    cardImage: {
      type: BlogImageSchema,
      default: null,
    },

    contentImage: {
      type: BlogImageSchema,
      default: null,
    },

    content: {
      type: Schema.Types.Mixed,
      required: true,
    },

    // SEO
    metaTitle: {
      type: String,
      default: "",
      trim: true,
    },

    metaDescription: {
      type: String,
      default: "",
      trim: true,
    },

    metaKeywords: {
      type: [String],
      default: [],
    },

    focusKeyword: {
      type: String,
      default: "",
      trim: true,
    },

    // CTA
    ctaText: {
      type: String,
      default: "",
      trim: true,
    },

    ctaLink: {
      type: String,
      default: "",
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },

    featured: {
      type: Boolean,
      default: false,
    },

    publishedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

const Blog = mongoose.models.Blog || mongoose.model("Blog", BlogSchema);

export default Blog;
