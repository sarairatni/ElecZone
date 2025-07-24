import { CartProductInputDTO } from './dto/cartproduct-input.dto';
import { CartProductOutputDTO } from './dto/cartproduct-output.dto';

export interface CartProductRepositoryPort {
  create(input: CartProductInputDTO): Promise<CartProductOutputDTO>;
  delete(id: number): Promise<void>;
  getAll(): Promise<CartProductOutputDTO[]>;
  getById(id: number): Promise<CartProductOutputDTO | null>;
}
