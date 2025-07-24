import { CartProductRepositoryPort } from './cartproduct.ports';
import { CartProductInputDTO } from './dto/cartproduct-input.dto';
import { CartProductOutputDTO } from './dto/cartproduct-output.dto';

export class CartProductUseCases {
  constructor(private repository: CartProductRepositoryPort) {}

  async create(input: CartProductInputDTO): Promise<CartProductOutputDTO> {
    return this.repository.create(input);
  }

  async delete(id: number): Promise<void> {
    return this.repository.delete(id);
  }

  async getAll(): Promise<CartProductOutputDTO[]> {
    return this.repository.getAll();
  }

  async getById(id: number): Promise<CartProductOutputDTO | null> {
    return this.repository.getById(id);
  }
}
