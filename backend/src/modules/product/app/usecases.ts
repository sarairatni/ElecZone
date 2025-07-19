import { ProductPort } from "./ports/product.ports";
import { ProductInputDTO } from "./dto/product-input.dto";
import { ProductOutputDTO } from "./dto/product-output.dto";

export class ProductUseCases {
  constructor(private readonly productPort: ProductPort) {}

  async createProduct(data: ProductInputDTO): Promise<ProductOutputDTO> {
    return await this.productPort.create(data);
  }

  async getProductById(id: number): Promise<ProductOutputDTO | null> {
    return await this.productPort.findById(id);
  }

  async getAllProducts(): Promise<ProductOutputDTO[]> {
    return await this.productPort.findAll();
  }

  async deleteProduct(id: number): Promise<void> {
    await this.productPort.delete(id);
  }

  async updateProduct(id: number, data: Partial<ProductInputDTO>): Promise<ProductOutputDTO> {
    return await this.productPort.update(id, data);
  }
}
