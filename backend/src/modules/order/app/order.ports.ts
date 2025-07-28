import { CreateOrderDto, UpdateOrderDto } from './dto/order-input.dto';
import { OrderOutputDto } from './dto/order-output.dto';

export interface OrderPorts {
  createOrder(orderData: CreateOrderDto): Promise<OrderOutputDto>;
  getAllOrders(): Promise<OrderOutputDto[]>;
  getOrderById(id: number): Promise<OrderOutputDto | null>;
  getOrdersByCustomerId(customerId: number): Promise<OrderOutputDto[]>;
  updateOrder(id: number, orderData: UpdateOrderDto): Promise<OrderOutputDto | null>;
  deleteOrder(id: number): Promise<boolean>;
} 