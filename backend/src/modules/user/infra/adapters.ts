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
    try {
      // Récupération de l'utilisateur
      const user = await prisma.user.findUnique({
        where: { email: data.email },
        select: {
          id: true,
          email: true,
          hashedPsw: true,
          role: true,
          fname: true,
          lastname: true
        }
      });
  
      if (!user) {
        console.warn(`Login failed: email not found (${data.email})`);
        throw new Error("Invalid credentials");
      }
  
      // Vérification du mot de passe
      const isValid = await bcrypt.compare(data.password, user.hashedPsw);
      if (!isValid) {
        console.warn(`Login failed: invalid password for email (${data.email})`);
        throw new Error("Invalid credentials");
      }
  
      // Génération du token
      const token = jwt.sign(
        { userId: user.id, role: user.role },
        process.env.JWT_SECRET!,
        { expiresIn: "1d" }
      );
  
      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          fname: user.fname,
          lastname: user.lastname,
          role: user.role
        }
      };
  
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed. Please check your credentials.");
    }
  }
  async getById(id: number) {
    return prisma.user.findUnique({ where: { id } });
  }
}
