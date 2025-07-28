import { OrderPorts } from './order.ports';
import { CreateOrderDto, UpdateOrderDto } from './dto/order-input.dto';
import { OrderOutputDto } from './dto/order-output.dto';

export class OrderUseCases {
  constructor(private readonly orderPorts: OrderPorts) {}

  async createOrder(orderData: CreateOrderDto): Promise<OrderOutputDto> {
    // Validate required fields
    if (!orderData.customerFname || !orderData.customerLname || !orderData.customerPhone || 
        !orderData.wilaya || !orderData.commune || !orderData.detailedAddress) {
      throw new Error('All customer information fields are required');
    }

    if (!orderData.customerId || orderData.customerId <= 0) {
      throw new Error('Valid customer ID is required');
    }

    // Validate items
    if (!orderData.items || orderData.items.length === 0) {
      throw new Error('At least one item is required');
    }

    // Validate each item
    for (const item of orderData.items) {
      if (!item.productId || item.productId <= 0) {
        throw new Error('Valid product ID is required for each item');
      }
      if (!item.quantity || item.quantity <= 0) {
        throw new Error('Valid quantity is required for each item');
      }
      if (!item.unitPrice || item.unitPrice <= 0) {
        throw new Error('Valid unit price is required for each item');
      }
    }

    // Validate total price
    const calculatedTotal = orderData.items.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);

    if (Math.abs(calculatedTotal - orderData.totalPrice) > 0.01) {
      throw new Error('Total price does not match calculated total');
    }

    // Order status flow:
    // PENDING: When order is first created
    // ACCEPTED: When order is accepted and products are being prepared
    // DELIVERED: When order is completed and delivered (archived)
    
    return await this.orderPorts.createOrder(orderData);
  }

  async getAllOrders(): Promise<OrderOutputDto[]> {
    return await this.orderPorts.getAllOrders();
  }

  async getOrderById(id: number): Promise<OrderOutputDto> {
    if (!id || id <= 0) {
      throw new Error('Valid order ID is required');
    }

    const order = await this.orderPorts.getOrderById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  }

  async getOrdersByCustomerId(customerId: number): Promise<OrderOutputDto[]> {
    if (!customerId || customerId <= 0) {
      throw new Error('Valid customer ID is required');
    }

    return await this.orderPorts.getOrdersByCustomerId(customerId);
  }

  async updateOrder(id: number, orderData: UpdateOrderDto): Promise<OrderOutputDto> {
    if (!id || id <= 0) {
      throw new Error('Valid order ID is required');
    }

    if (orderData.totalPrice !== undefined && orderData.totalPrice <= 0) {
      throw new Error('Total price must be greater than 0');
    }

    const updatedOrder = await this.orderPorts.updateOrder(id, orderData);
    if (!updatedOrder) {
      throw new Error('Order not found');
    }

    return updatedOrder;
  }

  async deleteOrder(id: number): Promise<boolean> {
    if (!id || id <= 0) {
      throw new Error('Valid order ID is required');
    }

    const deleted = await this.orderPorts.deleteOrder(id);
    if (!deleted) {
      throw new Error('Order not found or could not be deleted');
    }

    return deleted;
  }
} 