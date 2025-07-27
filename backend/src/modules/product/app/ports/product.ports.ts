import { ProductInputDTO } from "../dto/product-input.dto";
import { ProductOutputDTO } from "../dto/product-output.dto";

export interface ProductPort {
  create(data: ProductInputDTO): Promise<ProductOutputDTO>;
  findById(id: number): Promise<ProductOutputDTO | null>;
  findAll(): Promise<ProductOutputDTO[]>;
  delete(id: number): Promise<void>;
  update(id: number, data: Partial<ProductInputDTO>): Promise<ProductOutputDTO>;
  getCategoryByProductId(id: number): Promise<{ CategoryID: number, Name: string } | null>;
}
