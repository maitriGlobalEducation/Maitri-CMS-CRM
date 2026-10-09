"use client";

import type { HomepageAdmissionsContent } from "@/types/homepage";

interface Props {
  content: HomepageAdmissionsContent;
  isVisible: boolean;
  onChange: (content: HomepageAdmissionsContent) => void;
  onVisibilityChange: (visible: boolean) => void;
}

const navigationLabels = [
  "Online Admission",
  "Entry Requirements",
  "Scholarships",
];

export default function HomepageAdmissionsForm({
  content,
  isVisible,
  onChange,
  onVisibilityChange,
}: Props) {
  const updateContent = (updates: Partial<HomepageAdmissionsContent>) => {
    onChange({ ...content, ...updates });
  };

  const updateNavigationLink = (
    index: number,
    field: "label" | "url",
    value: string,
  ) => {
    updateContent({
      navigationLinks: content.navigationLinks.map((link, i) =>
        i === index ? { ...link, [field]: value } : link,
      ),
    });
  };

  const inputStyles =
    "h-11 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none transition focus:border-zinc-400";

  return (
    <section className="space-y-6 rounded-xl border border-zinc-200 bg-white p-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">
            Admissions & Scholarship
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            Manage the section heading and three navigation links.
          </p>
        </div>

        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            checked={isVisible}
            onChange={(event) => onVisibilityChange(event.target.checked)}
            className="accent-zinc-900"
          />
          Visible
        </label>
      </div>

      {/* Fixed navigation */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-zinc-900">
            Section Heading
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            The three navigation buttons remain fixed in number.
          </p>
        </div>

        <input
          value={content.heading}
          onChange={(event) => updateContent({ heading: event.target.value })}
          placeholder="Admissions & Scholarship"
          className={inputStyles}
        />

        {navigationLabels.map((defaultLabel, index) => {
          const link = content.navigationLinks[index] ?? {
            label: "",
            url: "",
          };

          return (
            <div
              key={index}
              className="grid gap-4 rounded-lg border border-zinc-200 p-4 md:grid-cols-2"
            >
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-700">
                  Button {index + 1} — Label
                </label>

                <input
                  value={link.label}
                  onChange={(event) =>
                    updateNavigationLink(index, "label", event.target.value)
                  }
                  placeholder={defaultLabel}
                  className={inputStyles}
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-zinc-700">
                  Destination URL
                </label>

                <input
                  value={link.url}
                  onChange={(event) =>
                    updateNavigationLink(index, "url", event.target.value)
                  }
                  placeholder="/admissions"
                  className={inputStyles}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
