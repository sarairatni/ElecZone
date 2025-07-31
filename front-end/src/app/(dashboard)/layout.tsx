'use client'
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import CustomerGuard from "@/components/CustomerGuard";
import "@/app/globals.css";
import { useState } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  return (
    <CustomerGuard>
      <div className="relative min-h-screen">
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <div
          className={`flex flex-col transition-all duration-200 ${sidebarOpen ? "md:ml-64" : "md:ml-0"}`}
        >
          <Navbar />
          <main className="flex-1 bg-gray-50 overflow-auto">{children}</main>
        </div>
      </div>
    </CustomerGuard>
  );
}
