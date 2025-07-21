import { RegisterUserDTO, LoginDTO } from "./dto/user.dto";
import { UserPort } from "./user.ports";

export class UserUseCases {
  constructor(private readonly repo: UserPort) {}

  async register(input: RegisterUserDTO) {
    return this.repo.register(input);
  }

  async login(input: LoginDTO) {
    return this.repo.login(input);
  }

  async getById(id: number) {
    return this.repo.getById(id);
  }
}
