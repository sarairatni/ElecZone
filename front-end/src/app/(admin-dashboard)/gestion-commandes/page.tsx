"use client";

import OrderTable from './OrderTable'; 

export default function GestionCommandes() {
    return (
        <div className="p-6 h-screen">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Commandes</h1>
            </div>
            <OrderTable />
        </div>
    );
}