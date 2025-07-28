export interface OrderItemDto {
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

export interface OrderOutputDto {
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
  createdAt: Date;
  updatedAt: Date;
  orderItems: OrderItemDto[];
  user?: {
    id: number;
    fname: string;
    lastname: string;
    email: string;
  };
} 