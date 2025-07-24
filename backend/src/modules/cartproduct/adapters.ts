import { PrismaClient } from '@prisma/client';
import { CartProductRepositoryPort } from './app/cartproduct.ports';
import { CartProductInputDTO } from './app/dto/cartproduct-input.dto';
import { CartProductOutputDTO } from './app/dto/cartproduct-output.dto';

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
}
