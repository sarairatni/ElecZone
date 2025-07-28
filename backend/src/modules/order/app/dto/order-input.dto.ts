export interface OrderItemInputDto {
  productId: number;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderDto {
  // Informations client
  customerId: number;
  customerFname: string;
  customerLname: string;
  customerPhone: string;
  wilaya: string;
  commune: string;
  postalCode?: string;
  detailedAddress: string;
  
  // Liste des produits commandés
  items: OrderItemInputDto[];
  
  // Prix total calculé côté frontend
  totalPrice: number;
}

export interface UpdateOrderDto {
  customerFname?: string;
  customerLname?: string;
  customerPhone?: string;
  wilaya?: string;
  commune?: string;
  postalCode?: string;
  detailedAddress?: string;
  totalPrice?: number;
  status?: 'PENDING' | 'ACCEPTED' | 'DELIVERED';
} 