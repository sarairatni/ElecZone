"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import OrderItem from "./orderItem";
import OrderCard from "./OrderCard";

interface OrderItem {
  id: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    ProductID: number;
    Name: string;
    Description: string;
    Price: number;
    ImgUrl: string | null;
  };
}

interface Order {
  id: number;
  customerFname: string;
  customerLname: string;
  customerPhone: string;
  customerId: number;
  wilaya: string;
  commune: string;
  postalCode?: string;
  detailedAddress: string;
  totalPrice: number;
  status: 'PENDING' | 'ACCEPTED' | 'DELIVERED';
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
}

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const user = localStorage.getItem('user');
      if (!user) {
        setError('Utilisateur non connecté');
        return;
      }

      const userData = JSON.parse(user);
      const customerId = userData.id;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/customer/${customerId}`);
      
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des commandes');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur fetchOrders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = (order: Order) => {
    setOrderToCancel(order);
    setShowCancelConfirmation(true);
  };

  const confirmCancelOrder = async () => {
    if (!orderToCancel) return;

    setCancelling(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderToCancel.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'annulation de la commande');
      }

      // Mettre à jour la liste locale
      setOrders(prevOrders => prevOrders.filter(order => order.id !== orderToCancel.id));
      
      console.log('Commande annulée avec succès');
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur confirmCancelOrder:', err);
    } finally {
      setCancelling(false);
      setShowCancelConfirmation(false);
      setOrderToCancel(null);
    }
  };

  const cancelCancelOrder = () => {
    setShowCancelConfirmation(false);
    setOrderToCancel(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'ACCEPTED':
        return 'bg-blue-100 text-blue-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'En attente';
      case 'ACCEPTED':
        return 'Acceptée';
      case 'DELIVERED':
        return 'Livrée';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos commandes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push('/')}
            className="bg-[#ff6767] text-white px-4 py-2 rounded-lg hover:bg-[#ff6767]/80"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
          <p className="text-gray-600 mt-2">
            {orders.length} commande{orders.length > 1 ? 's' : ''} trouvée{orders.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Liste des commandes */}
        <div className="space-y-6">
          {orders.length > 0 ? (
            orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onOrderCancelled={(orderId) => setOrders(prev => prev.filter(o => o.id !== orderId))}
              />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg mb-4">Vous n'avez pas encore de commandes</p>
              <button
                onClick={() => router.push('/all-products')}
                className="bg-[#ff6767] text-white px-6 py-2 rounded-lg hover:bg-[#ff6767]/80 transition-colors"
              >
                Découvrir nos produits
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popup de confirmation d'annulation */}
      {showCancelConfirmation && orderToCancel && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {/* Header avec X */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Annuler la commande</h3>
              <button
                onClick={cancelCancelOrder}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenu */}
            <div className="space-y-4">
              <p className="text-gray-600">
                Êtes-vous sûr de vouloir annuler la commande #{orderToCancel.id} ?
              </p>
              <p className="text-sm text-gray-500">
                Cette action est irréversible.
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={cancelCancelOrder}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmCancelOrder}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {cancelling ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Annulation...
                  </>
                ) : (
                  'Confirmer l\'annulation'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
