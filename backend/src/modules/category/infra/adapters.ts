import { PrismaClient } from "@prisma/client";
import { CategoryPort } from "../app/category.ports";
import { CategoryInputDTO } from "../app/dto/category-input.dto";
import { CategoryOutputDTO } from "../app/dto/category-output.dto";
import { ProductOutputDTO } from "../../product/app/dto/product-output.dto";

export class CategoryAdapter implements CategoryPort {
  private prisma = new PrismaClient();

  async create(data: CategoryInputDTO): Promise<CategoryOutputDTO> {
    const category = await this.prisma.category.create({
      data: {
        Name: data.Name,
      },
    });

    return this.toOutputDTO(category);
  }

  async findById(id: number): Promise<CategoryOutputDTO | null> {
    const category = await this.prisma.category.findUnique({
      where: { CategoryID: id },
    });

    return category ? this.toOutputDTO(category) : null;
  }

  async findAll(): Promise<CategoryOutputDTO[]> {
    const categories = await this.prisma.category.findMany();
    return categories.map(this.toOutputDTO);
  }

  async update(
    id: number,
    data: Partial<CategoryInputDTO>
  ): Promise<CategoryOutputDTO> {
    const updated = await this.prisma.category.update({
      where: { CategoryID: id },
      data: {
        Name: data.Name,
      },
    });

    return this.toOutputDTO(updated);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.category.delete({
      where: { CategoryID: id },
    });
  }

async findProducts(categoryId: number): Promise<ProductOutputDTO[]> {
    return await this.prisma.product.findMany({
      where: {
        CategoryID: categoryId,
      },
    });
  }



  //----------------------------------
  private toOutputDTO(category: any): CategoryOutputDTO {
    return {
      CategoryID: category.CategoryID,
      Name: category.Name,
      CreatedAt: category.createdAt,
      UpdatedAt: category.updatedAt,
    };
  }
}
