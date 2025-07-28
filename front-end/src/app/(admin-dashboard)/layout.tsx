import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AdminGuard from "@/components/AdminGuard";
import "@/app/globals.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <div className="flex h-screen w-full">
        <Sidebar />
        <div className="flex flex-col flex-1">
          <Navbar />
          <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}
