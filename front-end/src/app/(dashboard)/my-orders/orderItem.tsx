import React from "react";

interface OrderItemProps {
  item: {
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
  };
}

const OrderItem: React.FC<OrderItemProps> = ({ item }) => {
  return (
    <div className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
      <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
        {item.product.ImgUrl ? (
          <img
            src={item.product.ImgUrl}
            alt={item.product.Name}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <h5 className="font-medium text-gray-900">{item.product.Name}</h5>
        <p className="text-sm text-gray-600">{item.product.Description}</p>
      </div>
      <div className="text-right">
        <p className="text-sm text-gray-600">Qté: {item.quantity}</p>
        <p className="font-medium text-gray-900">{item.totalPrice.toLocaleString('ar-DZ')} DA</p>
      </div>
    </div>
  );
};

export default OrderItem;
