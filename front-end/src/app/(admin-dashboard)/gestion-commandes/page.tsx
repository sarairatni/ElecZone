"use client";

export default function GestionCommandes() {
    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
                <p className="text-gray-600 mt-2">Gérez les commandes des clients, suivez les statuts et les livraisons.</p>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-gray-800">Liste des Commandes</h2>
                    <div className="flex gap-2">
                        <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                            <option>Tous les statuts</option>
                            <option>En attente</option>
                            <option>Acceptée</option>
                            <option>Livrée</option>
                        </select>
                    </div>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                    <p>Fonctionnalité en cours de développement...</p>
                    <p className="text-sm mt-2">Ici vous pourrez voir et gérer toutes les commandes</p>
                </div>
            </div>
        </div>
    );
} 