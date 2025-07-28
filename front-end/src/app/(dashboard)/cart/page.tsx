"use client";

import { useEffect, useState } from "react";
import CartItem from "./CartItem";
import { useRouter } from "next/navigation";

interface CartProduct {
  id: number;
  productId: number;
  customerId: number;
  quantity: number;
  Product: {
    ProductID: number;
    Name: string;
    Price: number;
    Description?: string;
    ImgUrl?: string;
  };
  User: {
    id: number;
    fname: string;
    lastname: string;
    email: string;
  };
}

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartProduct[]>([]);
  const [userid, setUserid] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
   
    const storedUser= localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const userId = user.id;
      setUserid(userId);
      fetchCartProducts(userId);
    } else {
      setLoading(false);
      setError("Utilisateur non connecté");
    }
  }, []);

  const fetchCartProducts = async (customerId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Token non trouvé");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cartproducts/customer/${customerId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la récupération du panier');
      }

      const data = await res.json();
      console.log("Fetch productcards result : ",data);
      setCartItems(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur fetchCartProducts:', err);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalPrice = () => {
    const total = cartItems.reduce((total, item) => {
      const price = item.Product?.Price || 0;
      const itemTotal = price * item.quantity;
      return total + itemTotal;
    }, 0);

    return total;
  };

  const deleteCartItem = async (cartItemId: number) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Token non trouvé");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cartproducts/${cartItemId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la suppression du produit');
      }

      // Supprimer l'élément de la liste locale
      setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
      
      console.log("Produit supprimé du panier avec succès");
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur deleteCartItem:', err);
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    try {
      const token = localStorage.getItem("token");
      
      if (!token) {
        setError("Token non trouvé");
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cartproducts/${cartItemId}/quantity`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (!res.ok) {
        throw new Error('Erreur lors de la mise à jour de la quantité');
      }

      const updatedItem = await res.json();

      // Mettre à jour l'élément dans la liste locale
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === cartItemId 
            ? { ...item, quantity: newQuantity }
            : item
        )
      );
      
      console.log("Quantité mise à jour avec succès");
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur updateQuantity:', err);
    }
  };

  const handleCheckout = () => {
    // Préparer les données pour order-form
    const orderData = {
      customerId: userid,
      items: cartItems.map(item => ({
        productId: item.Product.ProductID,
        quantity: item.quantity,
        unitPrice: item.Product.Price
      })),
      totalPrice: calculateTotalPrice()
    };
    
    // Sauvegarder dans localStorage
    localStorage.setItem('orderData', JSON.stringify(orderData));
    
    router.push('/order-form');
    console.log("Passer la commande...");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement du panier...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre et nombre de produits */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Panier</h1>
          <p className="text-gray-600">
            {cartItems.length} produit{cartItems.length > 1 ? 's' : ''} dans ton panier
          </p>
        </div>

        {/* Contenu principal */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Section gauche - Liste des produits */}
          <div className="lg:col-span-2">
            <div className="space-y-4">
              {cartItems.length > 0 ? (
                cartItems.map((item) => (
                  <CartItem
                    key={item.id}
                    id={item.id}
                    productId={item.productId}
                    customerId={item.customerId}
                    quantity={item.quantity}
                    product={item.Product}
                    onDelete={deleteCartItem}
                    onUpdateQuantity={updateQuantity}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">Ton panier est vide</p>
                </div>
              )}
            </div>
          </div>

          {/* Section droite - Résumé des prix */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Prix total</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Sous-total</span>
                  <span>{totalPrice.toLocaleString('ar-DZ')} DA</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Livraison</span>
                  <span>Gratuit</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    <span className="text-[#00D886]">{totalPrice.toLocaleString('ar-DZ')} DA</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={cartItems.length === 0}
                className="w-full bg-[#FF6767] text-white py-3 px-4 rounded-lg font-semibold hover:bg-[#FF6767]/80 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
               
              >
                Passer une commande
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
