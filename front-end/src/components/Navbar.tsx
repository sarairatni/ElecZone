"use client";

import { useState, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Navbar() {
  const [userName, setUserName] = useState<string>("Utilisateur");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      const userData = JSON.parse(user);
      setUserName(userData.name || userData.email || "Utilisateur");
    }
  }, []);

  return (
    <div className="w-full h-16 bg-white border-b border-gray-300 flex items-center px-6 justify-between">
      {/* Left side */}
      <div>
        <span className="text-sm text-gray-500 hidden sm:block">
          Bienvenue, {userName}!
        </span>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">
        {/* Welcome message */}

        {/* Notification icon */}
        <button
          className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          aria-label="Notifications"
        >
          <BellIcon className="w-6 h-6 text-gray-700" />
          {/* Badge for unread notifications (optional) */}
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User profile image */}
        <div className="relative w-10 h-10 rounded-full overflow-hidden cursor-pointer hover:border-[#050EAD] transition-colors">
          <Image
            src="/user.png"
            alt="User profile"
            width={40}
            height={40}
            className="object-cover"
          />
        </div>
      </div>
    </div>
  );
}
