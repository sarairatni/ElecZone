import { CategoryPort } from "./category.ports";
import {
  CategoryInputDTO,
} from "./dto/category-input.dto";

export class CategoryUseCases {
  constructor(private readonly repo: CategoryPort) {}

  async createCategory(input: CategoryInputDTO) {
    return this.repo.create(input);
  }

  async getAllCategories() {
    return this.repo.findAll();
  }

  async getCategoryById(id: number) {
    return this.repo.findById(id);
  }

 async updateCategory(id: number, input: Partial<CategoryInputDTO>) {
  return this.repo.update(id, input);
}

  async deleteCategory(id: number) {
    return this.repo.delete(id);
  }
  async findProducts(categoryId: number) {
    return this.repo.findProducts(categoryId);
  }
}
