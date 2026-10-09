import { NextResponse } from "next/server";
import Homepage from "@/models/Homepage";
import { connectDB } from "@/lib/mongodb";

export async function GET() {
  try {
    await connectDB();

    let homepage = await Homepage.findOne();

    if (!homepage) {
      homepage = await Homepage.create({
        hero: {},
        sections: [],
      });
    }

    return NextResponse.json({
      success: true,
      data: homepage,
    });
  } catch (error) {
    console.error("Failed to fetch homepage:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch homepage" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();

    const body = await request.json();
    const { hero, sections } = body;

    if (
      !hero ||
      typeof hero.heading !== "string" ||
      typeof hero.subtitle !== "string"
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid homepage data" },
        { status: 400 },
      );
    }

    if (
      !Number.isFinite(hero.overlayOpacity) ||
      hero.overlayOpacity < 0 ||
      hero.overlayOpacity > 100
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid overlay opacity" },
        { status: 400 },
      );
    }

    if (sections !== undefined && !Array.isArray(sections)) {
      return NextResponse.json(
        { success: false, message: "Invalid homepage sections" },
        { status: 400 },
      );
    }

    const video = hero.backgroundVideo;

    if (
      video !== null &&
      video !== undefined &&
      (typeof video.url !== "string" || typeof video.publicId !== "string")
    ) {
      return NextResponse.json(
        { success: false, message: "Invalid background video data" },
        { status: 400 },
      );
    }

    const update: Record<string, unknown> = {
      hero: {
        ...hero,
        backgroundVideo: video ?? null,
      },
    };

    if (sections !== undefined) {
      update.sections = sections;
    }

    let homepage = await Homepage.findOne();

    if (!homepage) {
      homepage = new Homepage(update);
    } else {
      homepage.set(update);
    }

    await homepage.save();

    return NextResponse.json({
      success: true,
      data: homepage,
      message: "Homepage saved successfully",
    });
  } catch (error) {
    console.error("Failed to save homepage:", error);

    return NextResponse.json(
      { success: false, message: "Failed to save homepage" },
      { status: 500 },
    );
  }
}
