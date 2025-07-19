import { PrismaClient } from "@prisma/client";
import { ProductPort } from "../app/ports/product.ports";
import { ProductInputDTO } from "../app/dto/product-input.dto";
import { ProductOutputDTO } from "../app/dto/product-output.dto";

export class PrismaProductAdapter implements ProductPort {
  private prisma = new PrismaClient();

  async create(data: ProductInputDTO): Promise<ProductOutputDTO> {
    const product = await this.prisma.product.create({
      data: {
        Name: data.Name,
        Price: data.Price,
        CategoryID: data.CategoryID,
        ImgUrl: data.ImgUrl,
      },
    });

    return this.toOutputDTO(product);
  }

  async findById(id: number): Promise<ProductOutputDTO | null> {
    const product = await this.prisma.product.findUnique({
      where: { ProductID: id },
    });

    return product ? this.toOutputDTO(product) : null;
  }

  async findAll(): Promise<ProductOutputDTO[]> {
    const products = await this.prisma.product.findMany();
    return products.map(this.toOutputDTO);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.product.delete({
      where: { ProductID: id },
    });
  }

  async update(
    id: number,
    data: Partial<ProductInputDTO>
  ): Promise<ProductOutputDTO> {
    const updated = await this.prisma.product.update({
      where: { ProductID: id },
      data: {
        Name: data.Name,
        Price: data.Price,
        CategoryID: data.CategoryID,
        ImgUrl: data.ImgUrl,
      },
    });

    return this.toOutputDTO(updated);
  }

  // 🔁 Mapper from Prisma model to Output DTO
  private toOutputDTO(product: any): ProductOutputDTO {
    return {
      ProductID: product.ProductID,
      Name: product.Name,
      Price: product.Price,
      CategoryID: product.CategoryID,
      ImgUrl: product.ImgUrl,
    };
  }
}
