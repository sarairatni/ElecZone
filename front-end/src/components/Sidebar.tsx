"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const routes = [
  { name: "Produits", path: "/all-products" },
  { name: "Mon panier", path: "/cart" },
  { name: "Mes commandes", path: "/my-orders" },
  // { name: "Profile", path: "/all-products" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    setShowLogout(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogout(false);
    router.push('/login');
  };

  const cancelLogout = () => {
    setShowLogout(false);
  };

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

      <button
        onClick={handleLogout}
        className="mt-10 w-full px-3 py-2 text-left text-sm bg-gray-100 rounded-lg transition-colors text-gray-700 hover:bg-[#FF6767] hover:text-white"
      >
        Logout
      </button>

      {/* Logout confirmation popup */}
      {showLogout && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirmer la déconnexion</h3>
              <button
                onClick={cancelLogout}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p className="text-gray-700 mb-6">Voulez-vous vraiment vous déconnecter ?</p>
            <div className="flex gap-3">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-[#ff6767] text-white rounded-lg hover:bg-[#ff6767]/80 transition-colors"
              >
                Se déconnecter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
