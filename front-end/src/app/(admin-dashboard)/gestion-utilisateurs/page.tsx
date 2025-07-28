"use client";

export default function GestionUtilisateurs() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
                <p className="text-gray-600 mt-2">Gérez les comptes utilisateurs, les rôles et les permissions.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Liste des Utilisateurs</h2>
                    <button className="bg-[#050EAD] text-white px-4 py-2 rounded-lg hover:bg-[#050EAD]/80 transition-colors">
                        + Ajouter un Utilisateur
                    </button>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                    <p>Fonctionnalité en cours de développement...</p>
                    <p className="text-sm mt-2">Ici vous pourrez voir, ajouter, modifier et supprimer des utilisateurs</p>
                </div>
            </div>
        </div>
    );
} 