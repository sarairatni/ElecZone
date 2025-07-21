export interface RegisterUserDTO {
  fname: string;
  lastname: string;
  email: string;
  password: string;
  role?: "ADMIN" | "COSTUMER";
}

export interface LoginDTO {
  email: string;
  password: string;
}
