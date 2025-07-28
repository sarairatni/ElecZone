"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { name: "Products", path: "/all-products" },
  { name: "My cart", path: "/cart" },
  // { name: "Categories", path: "/all-products" },
  // { name: "Profile", path: "/all-products" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white text-gray-700 min-h-screen p-4 flex flex-col justify-between shadow-sm border-r border-gray-300">
      <div>
        <h2 className="text-xl font-bold mb-6 text-[#050EAD]">MyCondor</h2>

        <ul className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.path;
            return (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className={`block text-sm px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#050ead] text-white"
                      : "text-gray-700 hover:bg-[#050ead]/60 hover:text-white"
                  }`}
                >
                  {route.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <button className="mt-10 w-full px-3 py-2 text-left text-sm bg-gray-100 rounded-lg transition-colors text-gray-700 hover:bg-[#FF6767] hover:text-white">
        Logout
      </button>
    </div>
  );
}
