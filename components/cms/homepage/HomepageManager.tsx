"use client";

import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { toast } from "react-toastify";
import HomepageAboutForm from "./HomepageAboutForm";
import type { HomepageAboutContent, HomepageSection } from "@/types/homepage";
import type { Homepage } from "@/types/homepage";
import { getHomepage, updateHomepage } from "@/services/homepage.service";
import HomepageHeroForm from "./HomepageHeroForm";
import HomepageLocationsForm from "./HomepageLocationsForm";
import type { HomepageLocationsContent } from "@/types/homepage";
import HomepageAdmissionsForm from "./HomepageAdmissionsForm";
import type { HomepageAdmissionsContent } from "@/types/homepage";
import HomepageSectionCard from "./HomepageSectionCard";

const emptyAboutContent: HomepageAboutContent = {
  image: null,
  heading: "",
  description: "",
  cta: {
    label: "",
    url: "",
  },
};

const emptyLocationsContent: HomepageLocationsContent = {
  heading: "",
  cta: {
    label: "",
    url: "",
  },
  countries: [],
};

export default function HomepageManager() {
  const [homepage, setHomepage] = useState<Homepage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getHomepage()
      .then(setHomepage)
      .catch((error) => {
        console.error(error);
        toast.error("Failed to load homepage settings");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    if (!homepage) return;

    try {
      setIsSaving(true);

      const savedHomepage = await updateHomepage(homepage);
      setHomepage(savedHomepage);

      toast.success("Homepage saved successfully");

      // window.scrollTo({
      //   top: 0,
      //   behavior: "smooth",
      // });
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error ? error.message : "Failed to save homepage",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const aboutSection = homepage?.sections.find(
    (section) => section.type === "about",
  );

  const aboutContent = {
    ...emptyAboutContent,
    ...(aboutSection?.content as Partial<HomepageAboutContent> | undefined),
    cta: {
      ...emptyAboutContent.cta,
      ...(aboutSection?.content as Partial<HomepageAboutContent> | undefined)
        ?.cta,
    },
  };

  const updateAboutContent = (content: HomepageAboutContent) => {
    setHomepage((current) => {
      if (!current) return current;

      const existingSection = current.sections.find(
        (section) => section.type === "about",
      );

      const about: HomepageSection = {
        type: "about",
        isVisible: existingSection?.isVisible ?? false,
        order: existingSection?.order ?? 1,
        content: content as unknown as Record<string, unknown>,
      };

      return {
        ...current,
        sections: existingSection
          ? current.sections.map((section) =>
              section.type === "about" ? about : section,
            )
          : [...current.sections, about],
      };
    });
  };

  const locationsSection = homepage?.sections.find(
    (section) => section.type === "locations",
  );

  const locationsContent: HomepageLocationsContent = {
    ...emptyLocationsContent,
    ...(locationsSection?.content as
      | Partial<HomepageLocationsContent>
      | undefined),
    cta: {
      ...emptyLocationsContent.cta,
      ...(
        locationsSection?.content as
          | Partial<HomepageLocationsContent>
          | undefined
      )?.cta,
    },
    countries:
      (
        locationsSection?.content as
          | Partial<HomepageLocationsContent>
          | undefined
      )?.countries ?? [],
  };

  const updateLocationsContent = (content: HomepageLocationsContent) => {
    setHomepage((current) => {
      if (!current) return current;

      const existingSection = current.sections.find(
        (section) => section.type === "locations",
      );

      const locations: HomepageSection = {
        type: "locations",
        isVisible: existingSection?.isVisible ?? false,
        order: existingSection?.order ?? 2,
        content: content as unknown as Record<string, unknown>,
      };

      return {
        ...current,
        sections: existingSection
          ? current.sections.map((section) =>
              section.type === "locations" ? locations : section,
            )
          : [...current.sections, locations],
      };
    });
  };

  const updateLocationsVisibility = (isVisible: boolean) => {
    setHomepage((current) => {
      if (!current) return current;

      const existingSection = current.sections.find(
        (section) => section.type === "locations",
      );

      const locations: HomepageSection = {
        type: "locations",
        isVisible,
        order: existingSection?.order ?? 2,
        content:
          existingSection?.content ??
          (emptyLocationsContent as unknown as Record<string, unknown>),
      };

      return {
        ...current,
        sections: existingSection
          ? current.sections.map((section) =>
              section.type === "locations" ? locations : section,
            )
          : [...current.sections, locations],
      };
    });
  };

  const updateAboutVisibility = (isVisible: boolean) => {
    setHomepage((current) => {
      if (!current) return current;

      const existingSection = current.sections.find(
        (section) => section.type === "about",
      );

      const about: HomepageSection = {
        type: "about",
        isVisible,
        order: existingSection?.order ?? 1,
        content:
          existingSection?.content ??
          (emptyAboutContent as unknown as Record<string, unknown>),
      };

      return {
        ...current,
        sections: existingSection
          ? current.sections.map((section) =>
              section.type === "about" ? about : section,
            )
          : [...current.sections, about],
      };
    });
  };

  const emptyAdmissionsContent: HomepageAdmissionsContent = {
    heading: "",
    navigationLinks: [
      { label: "", url: "" },
      { label: "", url: "" },
      { label: "", url: "" },
    ],
  };

  const admissionsSection = homepage?.sections.find(
    (section) => section.type === "admissions",
  );

  const admissionsContent: HomepageAdmissionsContent = {
    ...emptyAdmissionsContent,
    ...(admissionsSection?.content as
      | Partial<HomepageAdmissionsContent>
      | undefined),
    navigationLinks: Array.from({ length: 3 }, (_, index) => ({
      ...emptyAdmissionsContent.navigationLinks[index],
      ...(
        admissionsSection?.content as
          | Partial<HomepageAdmissionsContent>
          | undefined
      )?.navigationLinks?.[index],
    })),
  };

  const updateAdmissionsContent = (content: HomepageAdmissionsContent) => {
    setHomepage((current) => {
      if (!current) return current;

      const existing = current.sections.find(
        (section) => section.type === "admissions",
      );

      const admissions: HomepageSection = {
        type: "admissions",
        isVisible: existing?.isVisible ?? false,
        order: existing?.order ?? 3,
        content: content as unknown as Record<string, unknown>,
      };

      return {
        ...current,
        sections: existing
          ? current.sections.map((section) =>
              section.type === "admissions" ? admissions : section,
            )
          : [...current.sections, admissions],
      };
    });
  };

  const updateAdmissionsVisibility = (isVisible: boolean) => {
    setHomepage((current) => {
      if (!current) return current;

      const existing = current.sections.find(
        (section) => section.type === "admissions",
      );

      const admissions: HomepageSection = {
        type: "admissions",
        isVisible,
        order: existing?.order ?? 3,
        content:
          existing?.content ??
          (emptyAdmissionsContent as unknown as Record<string, unknown>),
      };

      return {
        ...current,
        sections: existing
          ? current.sections.map((section) =>
              section.type === "admissions" ? admissions : section,
            )
          : [...current.sections, admissions],
      };
    });
  };

  if (isLoading) {
    return <p className="text-sm text-zinc-500">Loading homepage...</p>;
  }

  if (!homepage) {
    return (
      <p className="text-sm text-red-600">
        Could not load homepage settings. Please refresh and try again.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-zinc-200 bg-zinc-50/95 py-4 backdrop-blur-sm">
        <div>
          <h1 className="text-2xl font-semibold text-zinc-900">Homepage CMS</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage the homepage content section by section.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving}
          className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
      <div className="space-y-4">
        <HomepageSectionCard
          number="01"
          title="Hero Section"
          description="Background video, heading, subtitle and two CTAs"
          // defaultOpen
        >
          <HomepageHeroForm
            hero={homepage.hero}
            onChange={(hero) =>
              setHomepage((current) =>
                current ? { ...current, hero } : current,
              )
            }
          />
        </HomepageSectionCard>

        <HomepageSectionCard
          number="02"
          title="Who We Are & What We Do"
          description="Image, introduction and CTA"
        >
          <HomepageAboutForm
            content={aboutContent}
            isVisible={aboutSection?.isVisible ?? false}
            onChange={updateAboutContent}
            onVisibilityChange={updateAboutVisibility}
          />
        </HomepageSectionCard>

        <HomepageSectionCard
          number="03"
          title="Study in Prestigious Locations"
          description="Section heading, link and country image cards"
        >
          <HomepageLocationsForm
            content={locationsContent}
            isVisible={locationsSection?.isVisible ?? false}
            onChange={updateLocationsContent}
            onVisibilityChange={updateLocationsVisibility}
          />
        </HomepageSectionCard>

        {/* <HomepageSectionCard
          number="04"
          title="Admissions & Scholarship"
          description="Section heading and three navigation links"
        >
          <HomepageAdmissionsForm
            content={admissionsContent}
            isVisible={admissionsSection?.isVisible ?? false}
            onChange={updateAdmissionsContent}
            onVisibilityChange={updateAdmissionsVisibility}
          />
        </HomepageSectionCard> */}
      </div>

      <div className="rounded-xl border border-dashed border-zinc-300 p-6">
        <h2 className="text-sm font-semibold text-zinc-900">
          More homepage sections
        </h2>
        <p className="mt-1 text-sm text-zinc-500">
          We'll add the next sections here as we work through your homepage.
        </p>
      </div>
    </div>
  );
}
