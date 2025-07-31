export interface RegisterUserDTO {
  fname: string;
  lastname: string;
  email: string;
  password: string;
  role?: "ADMIN" | "COSTUMER";
}
export interface EditUserInputDTO{
  fname: string;
  lastname: string;
  email: string;
  role?: "ADMIN" | "COSTUMER";
}

export interface EditUserOutputDTO{
  fname: string;
  lastname: string;
  email: string;
  role?: "ADMIN" | "COSTUMER";
  updatedAt: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}
export interface UserOutputDTO {
  id: number;
  fname: string;
  lname: string;
  email: string;
  role: 'ADMIN' | 'COSTUMER';
  createdAt: string; 
}