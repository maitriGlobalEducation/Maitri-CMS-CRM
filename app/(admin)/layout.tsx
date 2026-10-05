import AdminSidebar from "@/components/layout/AdminSidebar";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-zinc-50">
      <AdminSidebar />

      <main className="ml-64 min-h-screen">
        <div className="mx-auto max-w-[1560px] p-8">{children}</div>
      </main>
    </div>
  );
}
