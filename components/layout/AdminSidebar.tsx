"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  PanelsTopLeft,
  GraduationCap,
  BookOpen,
  Globe2,
  BadgePercent,
  Newspaper,
  CalendarDays,
  MessageSquareQuote,
  Home,
  Users,
  Settings,
} from "lucide-react";

const cmsItems = [
  {
    label: "Overview",
    href: "/cms",
    icon: PanelsTopLeft,
  },
  {
    label: "Blogs",
    href: "/cms/blogs",
    icon: Newspaper,
  },
  {
    label: "Universities",
    href: "/cms/universities",
    icon: GraduationCap,
  },
  {
    label: "Courses",
    href: "/cms/courses",
    icon: BookOpen,
  },
  {
    label: "Countries",
    href: "/cms/countries",
    icon: Globe2,
  },
  {
    label: "Scholarships",
    href: "/cms/scholarships",
    icon: BadgePercent,
  },
  {
    label: "Events",
    href: "/cms/events",
    icon: CalendarDays,
  },
  {
    label: "Testimonials",
    href: "/cms/testimonials",
    icon: MessageSquareQuote,
  },
  {
    label: "Homepage",
    href: "/cms/homepage",
    icon: Home,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/cms") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-zinc-200 bg-white">
      <div className="h-16 border-b border-zinc-200 px-6 py-2">
        <div>
          <p className="text-lg font-semibold text-zinc-900">Maitri</p>
          <p className="text-xs text-zinc-500">Admin Portal</p>
        </div>
      </div>

      <div className="h-[calc(100vh-64px)] overflow-y-auto px-3 py-5">
        {/* <Link
          href="/"
          className={`mb-6 flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
            pathname === "/"
              ? "bg-zinc-100 font-medium text-zinc-950"
              : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
          }`}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link> */}

        <div>
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
            CMS
          </p>

          <nav className="space-y-1">
            {cmsItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                    active
                      ? "bg-zinc-200 font-medium"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-7">
          <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-zinc-400">
            CRM
          </p>

          <div className="flex cursor-not-allowed items-center justify-between rounded-lg px-3 py-2 text-sm text-zinc-400">
            <div className="flex items-center gap-3">
              <Users size={18} />
              CRM
            </div>

            <span className="text-[10px] uppercase">Soon</span>
          </div>
        </div>

        <div className="mt-7">
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-50 hover:text-zinc-950"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </div>
    </aside>
  );
}
