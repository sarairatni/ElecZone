import { RegisterUserDTO, LoginDTO, UserOutputDTO,EditUserInputDTO,EditUserOutputDTO } from "./dto/user.dto";
import { UserPort } from "./user.ports";

export class UserUseCases {
  constructor(private repo: UserPort) {}

  async register(input: RegisterUserDTO) {
    return this.repo.register(input);
  }

 async login(data: LoginDTO){
return this.repo.login(data);
};

  async getById(id: number) {
    return this.repo.getById(id);
  }
  async getAllUsers(): Promise<UserOutputDTO[]> {
    return await this.repo.findAll();
  }

async deleteUser(id: number){
  return this.repo.delete(id);
}

async updateUser(id: number, data: Partial<EditUserInputDTO>): Promise<EditUserOutputDTO> {
  return await this.repo.update(id, data);
}
}
