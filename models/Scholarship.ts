import mongoose, { Schema } from "mongoose";

const ScholarshipImageSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

const ScholarshipFormFieldSchema = new Schema(
  {
    key: {
      type: String,
      required: true,
      trim: true,
    },

    label: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["text", "email", "phone", "select", "date", "checkbox"],
      required: true,
    },

    required: {
      type: Boolean,
      default: false,
    },

    options: {
      type: [String],
      default: undefined,
    },
  },
  { _id: false },
);

const ScholarshipApplicationFormSchema = new Schema(
  {
    fields: {
      type: [ScholarshipFormFieldSchema],
      default: [],
    },
  },
  { _id: false },
);

const ScholarshipSchema = new Schema(
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

    cardImage: {
      type: ScholarshipImageSchema,
      default: null,
    },

    contentImage: {
      type: ScholarshipImageSchema,
      default: null,
    },

    deadline: {
      type: Date,
      default: null,
    },

    content: {
      type: Schema.Types.Mixed,
      required: true,
    },

    applicationForm: {
      type: ScholarshipApplicationFormSchema,
      default: () => ({ fields: [] }),
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

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  { timestamps: true },
);

const Scholarship =
  mongoose.models.Scholarship ||
  mongoose.model("Scholarship", ScholarshipSchema);

export default Scholarship;
