import React, { useState } from "react";
import { useRouter } from "next/navigation";
import OrderItem from "./OrderItem";

interface OrderItemType {
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
  orderItems: OrderItemType[];
}

interface OrderCardProps {
  order: Order;
  onOrderCancelled?: (orderId: number) => void;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, onOrderCancelled }) => {
  const router = useRouter();
  const [showCancelConfirmation, setShowCancelConfirmation] = useState(false);
  const [cancelling, setCancelling] = useState(false);

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

  const handleCancelOrder = () => {
    setShowCancelConfirmation(true);
  };

  const confirmCancelOrder = async () => {
    setCancelling(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error("Erreur lors de l'annulation de la commande");
      }
      if (onOrderCancelled) onOrderCancelled(order.id);
    } catch (err) {
      alert("Erreur lors de l'annulation de la commande");
    } finally {
      setCancelling(false);
      setShowCancelConfirmation(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
      {/* Header de la commande */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Commande #{order.id}
            </h3>
            <p className="text-sm text-gray-600">
              {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
              {getStatusText(order.status)}
            </span>
            {order.status === 'PENDING' && (
              <button
                onClick={handleCancelOrder}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors"
              >
                Annuler
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Détails de la commande */}
      <div className="p-6">
        {/* Informations client */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Informations client</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Nom:</span> {order.customerFname} {order.customerLname}</p>
              <p><span className="font-medium">Téléphone:</span> {order.customerPhone}</p>
            </div>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Adresse de livraison</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>{order.wilaya}, {order.commune}</p>
              <p>{order.detailedAddress}</p>
              {order.postalCode && <p>Code postal: {order.postalCode}</p>}
            </div>
          </div>
        </div>

        {/* Produits commandés */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Produits commandés</h4>
          <div className="space-y-3">
            {order.orderItems.map((item) => (
              <OrderItem key={item.id} item={item} />
            ))}
          </div>
        </div>

        {/* Total */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-gray-900">Total de la commande:</span>
            <span className="text-xl font-bold text-[#00D886]">
              {order.totalPrice.toLocaleString('ar-DZ')} DA
            </span>
          </div>
        </div>
      </div>

      {/* Popup de confirmation d'annulation */}
      {showCancelConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {/* Header avec X */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Annuler la commande</h3>
              <button
                onClick={() => setShowCancelConfirmation(false)}
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
                Êtes-vous sûr de vouloir annuler la commande #{order.id} ?
              </p>
              <p className="text-sm text-gray-500">
                Cette action est irréversible.
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowCancelConfirmation(false)}
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
                  "Confirmer l'annulation"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderCard; 