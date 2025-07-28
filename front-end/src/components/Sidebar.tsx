"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const customerRoutes = [
  { name: "Produits", path: "/all-products" },
  { name: "Mon panier", path: "/cart" },
  { name: "Mes commandes", path: "/my-orders" },
];

const adminRoutes = [
  { name: "Gestion Produits", path: "/gestion-produits" },
  { name: "Gestion Commandes", path: "/gestion-commandes" },
  { name: "Gestion Utilisateurs", path: "/gestion-utilisateurs" },
];

interface SidebarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export default function Sidebar({ sidebarOpen = true, setSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showLogout, setShowLogout] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserRole(userData.role);
    }
  }, []);

  const handleLogout = () => setShowLogout(true);
  const confirmLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowLogout(false);
    router.push('/login');
  };
  const cancelLogout = () => setShowLogout(false);

  const routes = userRole === "ADMIN" ? adminRoutes : customerRoutes;

  return (
    <>
      {/* Hamburger icon (always visible, fixed in top left) */}
      {!sidebarOpen && setSidebarOpen && (
        <button
          className="fixed top-4 left-4 z-50 bg-white rounded-full p-2 shadow"
          onClick={() => setSidebarOpen(true)}
          aria-label="Ouvrir le menu"
        >
          <MenuIcon fontSize="medium" style={{ color: "#050EAD" }}/>
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white text-gray-700 p-4 flex flex-col justify-between shadow-sm border-r border-gray-300
          z-40 transition-transform duration-200
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{ minHeight: "100vh" }}
      >
        {/* Close icon (always visible in sidebar header) */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#050EAD]">
            {userRole === "ADMIN" ? "Admin Dashboard" : "MyCondor"}
          </h2>
          {setSidebarOpen && (
            <button
              className="text-gray-700"
              onClick={() => setSidebarOpen(false)}
              aria-label="Fermer le menu"
            >
              <CloseIcon fontSize="medium" />
            </button>
          )}
        </div>

        <ul className="space-y-1 flex-1">
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
                  onClick={() => setSidebarOpen && setSidebarOpen(true)} // close on nav
                >
                  {route.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 text-left text-sm bg-gray-100 rounded-lg transition-colors text-gray-700 hover:bg-[#FF6767] hover:text-white mt-10"
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

      {/* Overlay when sidebar is open (click to close) */}
      {sidebarOpen && setSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
          style={{ cursor: "pointer" }}
        />
      )}
    </>
  );
}
