import { RegisterUserDTO, LoginDTO, UserOutputDTO,EditUserInputDTO,EditUserOutputDTO } from "./dto/user.dto";

export interface UserPort {
  register(data: RegisterUserDTO): Promise<any>;
  login(data: LoginDTO): Promise<{ token: string, user: { id: number, email: string, fname: string, lastname: string, role: string } }>;
  getById(id: number): Promise<any>;
  findAll():Promise<UserOutputDTO[]>;
  delete(id: number): Promise<void>;
  update(id:number,data: Partial<EditUserInputDTO>): Promise<EditUserOutputDTO>
}
