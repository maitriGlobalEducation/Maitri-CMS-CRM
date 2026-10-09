"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Props {
  number: string;
  title: string;
  description: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export default function HomepageSectionCard({
  number,
  title,
  description,
  defaultOpen = false,
  children,
}: Props) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
        className="flex w-full cursor-pointer items-center gap-4 px-5 py-4 text-left transition hover:bg-zinc-50"
      >
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-sm font-semibold text-white">
          {number}
        </span>

        <span className="min-w-0 flex-1">
          <span className="block font-semibold text-zinc-900">{title}</span>
          <span className="mt-1 block text-sm text-zinc-500">
            {description}
          </span>
        </span>

        {isOpen ? (
          <ChevronUp className="h-5 w-5 shrink-0 text-zinc-500" />
        ) : (
          <ChevronDown className="h-5 w-5 shrink-0 text-zinc-500" />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-zinc-200 bg-zinc-50/50 p-4 sm:p-6">
          {children}
        </div>
      )}
    </section>
  );
}
