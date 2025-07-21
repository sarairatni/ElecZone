import { CategoryInputDTO } from "./dto/category-input.dto";
import { CategoryOutputDTO } from "./dto/category-output.dto";
import { ProductOutputDTO } from "../../product/app/dto/product-output.dto";
export interface CategoryPort {
  create(input: CategoryInputDTO): Promise<CategoryOutputDTO>;
  findAll(): Promise<CategoryOutputDTO[]>;
  findById(id: number): Promise<CategoryOutputDTO | null>;
  update(
    id: number,
    input: Partial<CategoryInputDTO>
  ): Promise<CategoryOutputDTO>;
  delete(id: number): Promise<void>;
  findProducts(categoryId: number): Promise<ProductOutputDTO[]>;
}
