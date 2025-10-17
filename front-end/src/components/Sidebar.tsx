"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import LogoutIcon from "@mui/icons-material/Logout";

// Import Heroicons
import {
  ShoppingBagIcon,
  ShoppingCartIcon,
  ClipboardDocumentListIcon,
  CubeIcon,
  DocumentTextIcon,
  UserGroupIcon,
  BellIcon,
  CogIcon,
} from "@heroicons/react/24/solid";

const customerRoutes = [
  {
    name: "Produits",
    path: "/all-products",
    icon: ShoppingBagIcon,
  },
  {
    name: "Mon panier",
    path: "/cart",
    icon: ShoppingCartIcon,
  },
  {
    name: "Mes commandes",
    path: "/my-orders",
    icon: ClipboardDocumentListIcon,
  },
];

const adminRoutes = [
  {
    name: "Gestion Produits",
    path: "/gestion-produits",
    icon: CubeIcon,
  },
  {
    name: "Gestion Commandes",
    path: "/gestion-commandes",
    icon: DocumentTextIcon,
  },
  {
    name: "Gestion Utilisateurs",
    path: "/gestion-utilisateurs",
    icon: UserGroupIcon,
  },
];

const commonRoutes = [
  {
    name: "Notifications",
    path: "/notifications",
    icon: BellIcon,
  },
  {
    name: "Paramètres",
    path: "/parametres",
    icon: CogIcon,
  },
];

interface SidebarProps {
  sidebarOpen?: boolean;
  setSidebarOpen?: (open: boolean) => void;
}

export default function Sidebar({
  sidebarOpen = true,
  setSidebarOpen,
}: SidebarProps) {
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
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setShowLogout(false);
    router.push("/login");
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
          <MenuIcon fontSize="medium" style={{ color: "#050EAD" }} />
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
          <div className="flex items-center">
            <Image
              src="/ElecZone logo.png"
              alt="ElecZone Logo"
              width={140}
              height={40}
              className="object-contain"
            />
          </div>
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
            const IconComponent = route.icon;

            return (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#050ead] text-white"
                      : "text-gray-700 hover:bg-[#050ead]/60 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen && setSidebarOpen(true)}
                >
                  <IconComponent
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                  />
                  <span>{route.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Notifications et Paramètres */}
        <ul className="space-y-1 mb-4">
          {commonRoutes.map((route) => {
            const isActive = pathname === route.path;
            const IconComponent = route.icon;

            return (
              <li key={route.path}>
                <Link
                  href={route.path}
                  className={`flex items-center gap-3 text-sm px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-[#050ead] text-white"
                      : "text-gray-700 hover:bg-[#050ead]/60 hover:text-white"
                  }`}
                  onClick={() => setSidebarOpen && setSidebarOpen(true)}
                >
                  <IconComponent
                    className={`w-5 h-5 ${
                      isActive ? "text-white" : "text-gray-700"
                    }`}
                  />
                  <span>{route.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm bg-gray-100 rounded-lg transition-colors text-gray-700 hover:bg-[#FF6767] hover:text-white"
        >
          <LogoutIcon sx={{ fontSize: 20 }} />
          <span>Logout</span>
        </button>

        {/* Logout confirmation popup */}
        <Dialog
          open={showLogout}
          onClose={cancelLogout}
          maxWidth="xs"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              py: 2,
              minHeight: 280,
            },
          }}
        >
          <DialogTitle
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              fontSize: 28,
              fontWeight: 700,
              color: "black",
              pb: 0,
              pt: 2,
            }}
          >
            <LogoutIcon sx={{ color: "#050EAD", fontSize: 40, mr: 1 }} />
            <span style={{ fontWeight: 700, fontSize: 28, color: "black" }}>
              Logout
            </span>
          </DialogTitle>
          <DialogContent
            sx={{
              fontSize: 16,
              color: "text.primary",
              pt: 2,
              pb: 3,
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            Voulez-vous vraiment vous déconnecter ?
          </DialogContent>
          <DialogActions
            sx={{
              flexDirection: { xs: "column", sm: "row" },
              gap: 1.5,
              pb: 3,
              px: 3,
              justifyContent: "center",
            }}
          >
            <Button
              onClick={cancelLogout}
              variant="outlined"
              sx={{
                width: { xs: "100%", sm: "auto" },
                fontWeight: 600,
                color: "#050EAD",
                borderColor: "#050EAD",
                "&:hover": { borderColor: "#050EAD", bgcolor: "#f0f4ff" },
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={confirmLogout}
              variant="contained"
              sx={{
                bgcolor: "#FF6767",
                color: "#fff",
                width: { xs: "100%", sm: "auto" },
                fontWeight: 600,
                "&:hover": { bgcolor: "#ff4c4c" },
              }}
            >
              Se déconnecter
            </Button>
          </DialogActions>
        </Dialog>
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
