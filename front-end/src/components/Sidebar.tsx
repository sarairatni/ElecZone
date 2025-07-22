"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const routes = [
  { name: "Products", path: "/all-products" },
  { name: "My cart", path: "/mycart" },
  { name: "Categories", path: "/categories" },
  { name: "Profile", path: "/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-white text-gray-700 min-h-screen p-4 flex flex-col justify-between shadow-sm rounded-tr-2xl">
      <div>
        <h2 className="text-xl font-bold mb-6 text-orange-500">MyCondor</h2>

        <ul className="space-y-1">
          {routes.map((route) => {
            const isActive = pathname === route.path;
            return (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className={`block text-sm px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-orange-500 text-white"
                      : "text-gray-700 hover:bg-orange-500 hover:text-white"
                  }`}
                >
                  {route.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <button className="mt-10 w-full px-3 py-2 text-left text-xs bg-gray-100 rounded-lg transition-colors text-gray-700 hover:bg-orange-500 hover:text-white">
        Logout
      </button>
    </div>
  );
}
