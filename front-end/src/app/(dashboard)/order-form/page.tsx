"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

interface OrderFormData {
  firstName: string;
  lastName: string;
  phone: string;
  wilaya: string;
  commune: string;
  postalCode: string;
  address: string;
}

interface OrderData {
  customerId: number;
  items: {
    productId: number;
    quantity: number;
    unitPrice: number;
  }[];
  totalPrice: number;
}

// Liste statique des wilayas algériennes
const WILAYAS = [
  { id: "1", name: "Adrar" },
  { id: "2", name: "Chlef" },
  { id: "3", name: "Laghouat" },
  { id: "4", name: "Oum El Bouaghi" },
  { id: "5", name: "Batna" },
  { id: "6", name: "Béjaïa" },
  { id: "7", name: "Biskra" },
  { id: "8", name: "Béchar" },
  { id: "9", name: "Blida" },
  { id: "10", name: "Bouira" },
  { id: "11", name: "Tamanrasset" },
  { id: "12", name: "Tébessa" },
  { id: "13", name: "Tlemcen" },
  { id: "14", name: "Tiaret" },
  { id: "15", name: "Tizi Ouzou" },
  { id: "16", name: "Alger" },
  { id: "17", name: "Djelfa" },
  { id: "18", name: "Jijel" },
  { id: "19", name: "Sétif" },
  { id: "20", name: "Saïda" },
  { id: "21", name: "Skikda" },
  { id: "22", name: "Sidi Bel Abbès" },
  { id: "23", name: "Annaba" },
  { id: "24", name: "Guelma" },
  { id: "25", name: "Constantine" },
  { id: "26", name: "Médéa" },
  { id: "27", name: "Mostaganem" },
  { id: "28", name: "M'Sila" },
  { id: "29", name: "Mascara" },
  { id: "30", name: "Ouargla" },
  { id: "31", name: "Oran" },
  { id: "32", name: "El Bayadh" },
  { id: "33", name: "Illizi" },
  { id: "34", name: "Bordj Bou Arréridj" },
  { id: "35", name: "Boumerdès" },
  { id: "36", name: "El Tarf" },
  { id: "37", name: "Tindouf" },
  { id: "38", name: "Tissemsilt" },
  { id: "39", name: "El Oued" },
  { id: "40", name: "Khenchela" },
  { id: "41", name: "Souk Ahras" },
  { id: "42", name: "Tipaza" },
  { id: "43", name: "Mila" },
  { id: "44", name: "Aïn Defla" },
  { id: "45", name: "Naâma" },
  { id: "46", name: "Aïn Témouchent" },
  { id: "47", name: "Ghardaïa" },
  { id: "48", name: "Relizane" },
  { id: "49", name: "Timimoun" },
  { id: "50", name: "Bordj Badji Mokhtar" },
  { id: "51", name: "Ouled Djellal" },
  { id: "52", name: "Béni Abbès" },
  { id: "53", name: "In Salah" },
  { id: "54", name: "In Guezzam" },
  { id: "55", name: "Touggourt" },
  { id: "56", name: "Djanet" },
  { id: "57", name: "El M'Ghair" },
  { id: "58", name: "El Meniaa" }
];

export default function OrderForm() {
  const router = useRouter();
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState<OrderFormData | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<OrderFormData>();

  // Récupérer les données du panier et auto-remplir les champs
  useEffect(() => {
    // Récupérer les données du panier
    const storedOrderData = localStorage.getItem('orderData');
    if (storedOrderData) {
      try {
        const parsedOrderData = JSON.parse(storedOrderData);
        setOrderData(parsedOrderData);
      } catch (error) {
        console.error('Erreur lors du parsing des données de commande:', error);
        setError('Erreur lors du chargement des données du panier');
      }
    } else {
      setError('Aucune donnée de panier trouvée');
    }

    // Auto-remplir les champs utilisateur
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.fname) {
          setValue('firstName', userData.fname);
        }
        if (userData.lastname) {
          setValue('lastName', userData.lastname);
        }
      } catch (error) {
        console.error('Erreur lors du parsing des données utilisateur:', error);
      }
    }
  }, [setValue]);

  const onSubmit = (data: OrderFormData) => {
    setFormData(data);
    setShowConfirmation(true);
  };

  const confirmOrder = async () => {
    if (!orderData || !formData) {
      setError('Données de commande manquantes');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Préparer les données pour l'API
      const orderPayload = {
        customerId: orderData.customerId,
        customerFname: formData.firstName,
        customerLname: formData.lastName,
        customerPhone: formData.phone,
        wilaya: WILAYAS.find(w => w.id === formData.wilaya)?.name || formData.wilaya,
        commune: formData.commune,
        postalCode: formData.postalCode || undefined,
        detailedAddress: formData.address,
        items: orderData.items,
        totalPrice: orderData.totalPrice
      };

      console.log('Envoi de la commande:', orderPayload);

      // Envoyer la commande au backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(orderPayload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la création de la commande');
      }

      const result = await response.json();
      console.log('Commande créée avec succès:', result);

      // Vider le panier de l'utilisateur
      try {
        const clearCartResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cartproducts/customer/${orderData.customerId}/all`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (clearCartResponse.ok) {
          console.log('Panier vidé avec succès');
        } else {
          console.error('Erreur lors du vidage du panier');
        }
      } catch (clearCartError) {
        console.error('Erreur lors du vidage du panier:', clearCartError);
      }

      // Nettoyer localStorage
      localStorage.removeItem('orderData');

      // Rediriger vers une page de confirmation ou le panier
      router.push('/cart');
      
    } catch (err: any) {
      setError(err.message);
      console.error('Erreur lors de la création de la commande:', err);
    } finally {
      setLoading(false);
      setShowConfirmation(false);
    }
  };

  const cancelOrder = () => {
    setShowConfirmation(false);
    setFormData(null);
  };

  // Afficher l'erreur si pas de données de panier
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-lg mb-4">{error}</p>
          <button
            onClick={() => router.push('/cart')}
            className="bg-[#ff6767] text-white px-4 py-2 rounded-lg hover:bg-[#ff6767]/80"
          >
            Retour au panier
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Titre */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Formulaire de commande</h1>
          {orderData && (
            <p className="text-gray-600 mt-2">
              Total de la commande: {orderData.totalPrice.toLocaleString('ar-DZ')} DA
            </p>
          )}
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Section 1: Informations du client */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Informations du client
              </h2>
              
              <div className="space-y-4">
                {/* Prénom */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom *
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    {...register("firstName", { 
                      required: "Le prénom est requis" 
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-xs ${
                      errors.firstName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Entrez votre prénom"
                  />
                  {errors.firstName && (
                    <p className="mt-1 text-xs text-red-600">{errors.firstName.message}</p>
                  )}
                </div>

                {/* Nom */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom *
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    {...register("lastName", { 
                      required: "Le nom est requis" 
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-xs ${
                      errors.lastName ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Entrez votre nom"
                  />
                  {errors.lastName && (
                    <p className="mt-1 text-xs text-red-600">{errors.lastName.message}</p>
                  )}
                </div>

                {/* Téléphone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                    Numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    {...register("phone", { 
                      required: "Le numéro de téléphone est requis",
                      pattern: {
                        value: /^[0-9]{10}$/,
                        message: "Le numéro doit contenir exactement 10 chiffres"
                      },
                      validate: {
                        validPhone: (value) => {
                          if (!value) return true; // La validation required s'en charge
                          const phoneRegex = /^(05|06|07)[0-9]{8}$/;
                          return phoneRegex.test(value) || "Le numéro doit commencer par 05, 06 ou 07";
                        }
                      }
                    })}
                    onKeyPress={(e) => {
                      // Permettre seulement les chiffres
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    maxLength={10}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-xs ${
                      errors.phone ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0550123456"
                  />
                  {errors.phone && (
                    <p className="mt-1 text-xs text-red-600">{errors.phone.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: Adresse du client */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Adresse du client
              </h2>
              
              <div className="space-y-4">
                {/* Wilaya */}
                <div>
                  <label htmlFor="wilaya" className="block text-sm font-medium text-gray-700 mb-2">
                    Wilaya *
                  </label>
                  <select
                    id="wilaya"
                    {...register("wilaya", { 
                      required: "La wilaya est requise" 
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-xs ${
                      errors.wilaya ? "border-red-500" : "border-gray-300"
                    }`}
                  >
                    <option value="" className="text-gray-500">
                      Sélectionnez une wilaya
                    </option>
                    {WILAYAS.map((wilaya) => (
                      <option key={wilaya.id} value={wilaya.id} className="text-gray-900">
                        {wilaya.name}
                      </option>
                    ))}
                  </select>
                  {errors.wilaya && (
                    <p className="mt-1 text-xs text-red-600">{errors.wilaya.message}</p>
                  )}
                </div>

                {/* Commune */}
                <div>
                  <label htmlFor="commune" className="block text-sm font-medium text-gray-700 mb-2">
                    Commune *
                  </label>
                  <input
                    type="text"
                    id="commune"
                    {...register("commune", { 
                      required: "La commune est requise" 
                    })}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-xs ${
                      errors.commune ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Entrez le nom de votre commune"
                  />
                  {errors.commune && (
                    <p className="mt-1 text-xs text-red-600">{errors.commune.message}</p>
                  )}
                </div>

                {/* Code postal */}
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Code postal
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    {...register("postalCode", { 
                      pattern: {
                        value: /^[0-9]{5}$/,
                        message: "Le code postal doit contenir 5 chiffres"
                      }
                    })}
                    onKeyPress={(e) => {
                      // Permettre seulement les chiffres
                      if (!/[0-9]/.test(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    maxLength={5}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-xs ${
                      errors.postalCode ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="16000"
                  />
                  {errors.postalCode && (
                    <p className="mt-1 text-xs text-red-600">{errors.postalCode.message}</p>
                  )}
                </div>

                {/* Adresse détaillée */}
                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Détail de l'adresse *
                  </label>
                  <textarea
                    id="address"
                    {...register("address", { 
                      required: "L'adresse détaillée est requise" 
                    })}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 text-xs ${
                      errors.address ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Rue, numéro, étage, références..."
                  />
                  {errors.address && (
                    <p className="mt-1 text-xs text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Bouton Suivant */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-[#ff6767] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#ff6767]/80 transition-colors"
            >
              Suivant
              <svg 
                className="w-5 h-5" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 5l7 7-7 7" 
                />
              </svg>
            </button>
          </div>
        </form>
      </div>

      {/* Popup de confirmation */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            {/* Header avec X */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Confirmer la commande</h3>
              <button
                onClick={cancelOrder}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenu */}
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-2">Récapitulatif de la commande</h4>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Client:</span>
                    <span>{formData?.firstName} {formData?.lastName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Téléphone:</span>
                    <span>{formData?.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Adresse:</span>
                    <span className="text-right">
                      {WILAYAS.find(w => w.id === formData?.wilaya)?.name}, {formData?.commune}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Produits:</span>
                    <span>{orderData?.items.length} article(s)</span>
                  </div>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-[#00D886]">
                    {orderData?.totalPrice.toLocaleString('ar-DZ')} DA
                  </span>
                </div>
              </div>

              {/* Message de confirmation */}
              <p className="text-sm text-gray-600 text-center">
                Êtes-vous sûr de vouloir confirmer cette commande ?
              </p>
            </div>

            {/* Boutons */}
            <div className="flex gap-3 mt-6">
              <button
                onClick={cancelOrder}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmOrder}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#ff6767] text-white rounded-lg hover:bg-[#ff6767]/80 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Envoi en cours...
                  </>
                ) : (
                  'Confirmer'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
