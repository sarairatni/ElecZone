"use client";
import { useRouter } from "next/navigation";

export default function Unauthorized401() {
  const router = useRouter();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
    <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
      <div className="mb-4 flex justify-center">
        <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12A9 9 0 113 12a9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-4">401 - Accès non autorisé</h2>
      <p className="text-gray-600 mb-6">Vous n'êtes pas connecté.<br />Veuillez vous connecter pour accéder à cette page.</p>
      <button
        onClick={() => router.push('/login')}
        className="bg-[#ff6767] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#ff6767]/80 transition-colors"
      >
        Se connecter
      </button>
    </div>
  </div>
  );
} 