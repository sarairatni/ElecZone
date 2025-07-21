import { UserPort } from "../app//user.ports";
import { RegisterUserDTO, LoginDTO } from "../app/dto/user.dto";
import prisma from "../../../config/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export class PrismaUserRepo implements UserPort {
  async register(data: RegisterUserDTO) {
    const hashedPsw = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        fname: data.fname,
        lastname: data.lastname,
        email: data.email,
        hashedPsw,
        role: data.role || "COSTUMER",
      },
    });
    return { id: user.id, email: user.email };
  }

  async login(data: LoginDTO) {
    const user = await prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error("Invalid credentials");

    const isValid = await bcrypt.compare(data.password, user.hashedPsw);
    if (!isValid) throw new Error("Invalid credentials");

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: "1d" }
    );

    return { token };
  }

  async getById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }
}
