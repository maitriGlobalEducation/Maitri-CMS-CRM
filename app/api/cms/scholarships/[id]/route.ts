import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

import { connectDB } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import Scholarship from "@/models/Scholarship";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid scholarship ID",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const scholarship = await Scholarship.findById(id).lean();

    if (!scholarship) {
      return NextResponse.json(
        {
          success: false,
          message: "Scholarship not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: scholarship,
    });
  } catch (error) {
    console.error("GET SCHOLARSHIP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch scholarship",
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid scholarship ID",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const body = await request.json();

    const {
      title,
      slug,
      cardImage,
      contentImage,
      deadline,
      content,
      applicationForm,
      metaTitle,
      metaDescription,
      metaKeywords,
      focusKeyword,
      status,
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Title is required",
        },
        { status: 400 },
      );
    }

    if (!slug?.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug is required",
        },
        { status: 400 },
      );
    }

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          message: "Scholarship content is required",
        },
        { status: 400 },
      );
    }

    const normalizedSlug = slug.trim().toLowerCase();

    const existingScholarship = await Scholarship.findOne({
      slug: normalizedSlug,
      _id: { $ne: id },
    });

    if (existingScholarship) {
      return NextResponse.json(
        {
          success: false,
          message: "A scholarship with this slug already exists",
        },
        { status: 409 },
      );
    }

    const scholarship = await Scholarship.findByIdAndUpdate(
      id,
      {
        title: title.trim(),
        slug: normalizedSlug,
        cardImage: cardImage ?? null,
        contentImage: contentImage ?? null,
        deadline: deadline ? new Date(deadline) : null,
        content,
        applicationForm: applicationForm ?? { fields: [] },
        status: status ?? "draft",
        metaTitle: metaTitle ?? "",
        metaDescription: metaDescription ?? "",
        metaKeywords: metaKeywords ?? [],
        focusKeyword: focusKeyword ?? "",
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!scholarship) {
      return NextResponse.json(
        {
          success: false,
          message: "Scholarship not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: scholarship,
    });
  } catch (error) {
    console.error("UPDATE SCHOLARSHIP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update scholarship",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid scholarship ID",
        },
        { status: 400 },
      );
    }

    await connectDB();

    const scholarship = await Scholarship.findById(id);

    if (!scholarship) {
      return NextResponse.json(
        {
          success: false,
          message: "Scholarship not found",
        },
        { status: 404 },
      );
    }

    const publicIds = [
      scholarship.cardImage?.publicId,
      scholarship.contentImage?.publicId,
    ].filter(Boolean);

    const uniquePublicIds = [...new Set(publicIds)];

    for (const publicId of uniquePublicIds) {
      try {
        await cloudinary.uploader.destroy(publicId, {
          resource_type: "image",
        });
      } catch (error) {
        console.error(`FAILED TO DELETE CLOUDINARY IMAGE: ${publicId}`, error);
      }
    }

    await scholarship.deleteOne();

    return NextResponse.json({
      success: true,
      message: "Scholarship deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SCHOLARSHIP ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to delete scholarship",
      },
      { status: 500 },
    );
  }
}
