import { RegisterUserDTO, LoginDTO } from "./dto/user.dto";
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
}
