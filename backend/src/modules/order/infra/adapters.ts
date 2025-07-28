import { PrismaClient } from '@prisma/client';
import { OrderPorts } from '../app/order.ports';
import { CreateOrderDto, UpdateOrderDto } from '../app/dto/order-input.dto';
import { OrderOutputDto, OrderItemDto } from '../app/dto/order-output.dto';

// Helper function pour mapper les OrderItems
const mapOrderItems = (items: any[]): OrderItemDto[] => {
  return items.map(item => ({
    id: item.id,
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    totalPrice: item.totalPrice,
    product: {
      ProductID: item.Product.ProductID,
      Name: item.Product.Name,
      Description: item.Product.Description,
      Price: item.Product.Price,
      ImgUrl: item.Product.ImgUrl
    }
  }));
};

export class OrderAdapters implements OrderPorts {
  private prisma = new PrismaClient();

  async createOrder(orderData: CreateOrderDto): Promise<OrderOutputDto> {
    // 1. Créer la commande
    const order = await this.prisma.order.create({
      data: {
        customerFname: orderData.customerFname,
        customerLname: orderData.customerLname,
        customerPhone: orderData.customerPhone,
        customerId: orderData.customerId,
        wilaya: orderData.wilaya,
        commune: orderData.commune,
        postalCode: orderData.postalCode,
        detailedAddress: orderData.detailedAddress,
        totalPrice: orderData.totalPrice,
        status: 'PENDING'
      },
      include: {
        User: {
          select: {
            id: true,
            fname: true,
            lastname: true,
            email: true
          }
        }
      }
    });

    // 2. Grouper les produits identiques et additionner leurs quantités
    const groupedItems = orderData.items.reduce((acc, item) => {
      const existingItem = acc.find(groupedItem => groupedItem.productId === item.productId);
      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.totalPrice = existingItem.quantity * existingItem.unitPrice;
      } else {
        acc.push({
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.quantity * item.unitPrice
        });
      }
      return acc;
    }, [] as any[]);

    // 3. Créer les OrderItems pour chaque produit groupé
    const orderItems = await Promise.all(
      groupedItems.map(item => 
        this.prisma.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice
          },
          include: { Product: true }
        })
      )
    );

    // 3. Formater la réponse
    return {
      id: order.id,
      customerFname: order.customerFname,
      customerLname: order.customerLname,
      customerPhone: order.customerPhone,
      customerId: order.customerId,
      wilaya: order.wilaya,
      commune: order.commune,
      postalCode: order.postalCode || undefined,
      detailedAddress: order.detailedAddress,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: mapOrderItems(orderItems),
      user: order.User
    };
  }

  async getAllOrders(): Promise<OrderOutputDto[]> {
    const orders = await this.prisma.order.findMany({
      include: {
        User: {
          select: {
            id: true,
            fname: true,
            lastname: true,
            email: true
          }
        },
        OrderItems: {
          include: { Product: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return orders.map(order => ({
      id: order.id,
      customerFname: order.customerFname,
      customerLname: order.customerLname,
      customerPhone: order.customerPhone,
      customerId: order.customerId,
      wilaya: order.wilaya,
      commune: order.commune,
      postalCode: order.postalCode || undefined,
      detailedAddress: order.detailedAddress,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: mapOrderItems(order.OrderItems),
      user: order.User
    }));
  }

  async getOrderById(id: number): Promise<OrderOutputDto | null> {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        User: {
          select: {
            id: true,
            fname: true,
            lastname: true,
            email: true
          }
        },
        OrderItems: {
          include: { Product: true }
        }
      }
    });

    if (!order) return null;

    return {
      id: order.id,
      customerFname: order.customerFname,
      customerLname: order.customerLname,
      customerPhone: order.customerPhone,
      customerId: order.customerId,
      wilaya: order.wilaya,
      commune: order.commune,
      postalCode: order.postalCode || undefined,
      detailedAddress: order.detailedAddress,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: mapOrderItems(order.OrderItems),
      user: order.User
    };
  }

  async getOrdersByCustomerId(customerId: number): Promise<OrderOutputDto[]> {
    const orders = await this.prisma.order.findMany({
      where: { customerId },
      include: {
        User: {
          select: {
            id: true,
            fname: true,
            lastname: true,
            email: true
          }
        },
        OrderItems: {
          include: { Product: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return orders.map(order => ({
      id: order.id,
      customerFname: order.customerFname,
      customerLname: order.customerLname,
      customerPhone: order.customerPhone,
      customerId: order.customerId,
      wilaya: order.wilaya,
      commune: order.commune,
      postalCode: order.postalCode || undefined,
      detailedAddress: order.detailedAddress,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: mapOrderItems(order.OrderItems),
      user: order.User
    }));
  }

  async updateOrder(id: number, orderData: UpdateOrderDto): Promise<OrderOutputDto | null> {
    const order = await this.prisma.order.update({
      where: { id },
      data: orderData,
      include: {
        User: {
          select: {
            id: true,
            fname: true,
            lastname: true,
            email: true
          }
        },
        OrderItems: {
          include: { Product: true }
        }
      }
    });

    return {
      id: order.id,
      customerFname: order.customerFname,
      customerLname: order.customerLname,
      customerPhone: order.customerPhone,
      customerId: order.customerId,
      wilaya: order.wilaya,
      commune: order.commune,
      postalCode: order.postalCode || undefined,
      detailedAddress: order.detailedAddress,
      totalPrice: order.totalPrice,
      status: order.status,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      orderItems: mapOrderItems(order.OrderItems),
      user: order.User
    };
  }

  async deleteOrder(id: number): Promise<boolean> {
    try {
      await this.prisma.order.delete({
        where: { id }
      });
      return true;
    } catch (error) {
      return false;
    }
  }
}