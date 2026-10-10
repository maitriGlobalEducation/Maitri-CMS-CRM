import mongoose, { Schema, type Model } from "mongoose";

const UniversityImageSchema = new Schema(
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
  { _id: false },
);

const UniversitySchema = new Schema(
  {
    name: {
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
    country: {
      type: String,
      required: true,
      trim: true,
    },

    logo: {
      type: UniversityImageSchema,
      default: null,
    },

    reportLabel: {
      type: String,
      default: "Report",
      trim: true,
    },
    reportYear: {
      type: String,
      default: "",
      trim: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },

    ctaLabel: {
      type: String,
      default: "Go to University Page",
      trim: true,
    },
    ctaUrl: {
      type: String,
      required: true,
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  },
);

const University: Model<unknown> =
  (mongoose.models.University as Model<unknown>) ||
  mongoose.model("University", UniversitySchema);

export default University;
