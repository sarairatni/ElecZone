interface CartItemProps {
  id: number;
  productId: number;
  customerId: number;
  quantity: number;
  product: {
    ProductID: number;
    Name: string;
    Price: number;
    Description?: string;
    ImgUrl?: string;
  };
  onDelete: (cartItemId: number) => Promise<void>;
  onUpdateQuantity: (cartItemId: number, newQuantity: number) => Promise<void>;
}

export default function CartItem({ id, productId, customerId, quantity, product, onDelete, onUpdateQuantity }: CartItemProps) {
  // Protection contre les données manquantes
  console.log("🚨 CartItem product data:", product);
  const price = product.Price;
  const name = product?.Name || "Produit inconnu";
  const description = product?.Description;
  const image = "/4mckb1h2.png";
  // product?.ImgUrl ;

  const handleDelete = async () => {
    try {
      await onDelete(id);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const handleIncrement = async () => {
    try {
      await onUpdateQuantity(id, quantity + 1);
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation:', error);
    }
  };

  const handleDecrement = async () => {
    if (quantity > 1) {
      try {
        await onUpdateQuantity(id, quantity - 1);
      } catch (error) {
        console.error('Erreur lors de la décrémentation:', error);
      }
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 border-b border-gray-200">
      {/* Image du produit */}
      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
        {image ? (
          <img 
            src={image} 
            alt={name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <span className="text-gray-400 text-xs">Image</span>
        )}
      </div>

      {/* Informations du produit */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
        {description && (
          <p className="text-xs text-gray-600 mt-1 line-clamp-2">{description}</p>
        )}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
          <span className="text-base font-bold text-[#050EAD]">
            {price.toLocaleString('ar-DZ')} DA
          </span>
          <span className="text-sm text-gray-500">
            Quantité: {quantity}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto">
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDecrement}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold"
          >
            -
          </button>
          <span className="w-8 text-gray-700 text-center">{quantity}</span>
          <button 
            onClick={handleIncrement}
            className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-semibold"
          >
            +
          </button>
        </div>
        <button 
          onClick={handleDelete}
          className="text-red-500 hover:text-red-700 hover:underline text-xs"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
} 