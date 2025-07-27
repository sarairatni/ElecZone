import { PrismaClient } from '@prisma/client';
import { CartProductRepositoryPort } from '../app/cartproduct.ports';
import { CartProductInputDTO } from '../app/dto/cartproduct-input.dto';
import { CartProductOutputDTO } from '../app/dto/cartproduct-output.dto';

const prisma = new PrismaClient();

export class CartProductPrismaAdapter implements CartProductRepositoryPort {
  async create(input: CartProductInputDTO): Promise<CartProductOutputDTO> {
    const cartProduct = await prisma.cartProduct.create({
      data: {
        productId: input.productId,
        customerId: input.customerId,
        quantity: input.quantity,
      },
    });
    return cartProduct;
  }

  async delete(id: number): Promise<void> {
    await prisma.cartProduct.delete({ where: { id } });
  }

  async getAll(): Promise<CartProductOutputDTO[]> {
    return prisma.cartProduct.findMany();
  }

  async getById(id: number): Promise<CartProductOutputDTO | null> {
    return prisma.cartProduct.findUnique({ where: { id } });
  }

  async getByCustomerId(customerId: number): Promise<CartProductOutputDTO[]> {
    return prisma.cartProduct.findMany({
      where: { customerId },
      include: {
        Product: true,
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
  }

  async updateQuantity(id: number, quantity: number): Promise<CartProductOutputDTO> {
    return prisma.cartProduct.update({
      where: { id },
      data: { quantity },
      include: {
        Product: true,
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
  }
}
