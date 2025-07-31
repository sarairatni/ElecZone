"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepo = void 0;
const db_1 = __importDefault(require("../../../config/db"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class PrismaUserRepo {
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const hashedPsw = yield bcryptjs_1.default.hash(data.password, 10);
            const user = yield db_1.default.user.create({
                data: {
                    fname: data.fname,
                    lastname: data.lastname,
                    email: data.email,
                    hashedPsw,
                    role: data.role || "COSTUMER",
                },
            });
            return { id: user.id, email: user.email };
        });
    }
    login(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Récupération de l'utilisateur
                const user = yield db_1.default.user.findUnique({
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
                const isValid = yield bcryptjs_1.default.compare(data.password, user.hashedPsw);
                if (!isValid) {
                    console.warn(`Login failed: invalid password for email (${data.email})`);
                    throw new Error("Invalid credentials");
                }
                // Génération du token
                const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
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
            }
            catch (error) {
                console.error("Login error:", error);
                throw new Error("Login failed. Please check your credentials.");
            }
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.user.findUnique({ where: { id } });
        });
    }
    toOutputDTO(user) {
        return {
            id: user.id,
            fname: user.fname,
            lname: user.lastname,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        };
    }
    findAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield db_1.default.user.findMany({});
            return users.map(this.toOutputDTO);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield db_1.default.user.delete({
                where: { id: id },
            });
        });
    }
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const updated = yield db_1.default.user.update({
                where: { id: id },
                data: {
                    fname: data.fname,
                    lastname: data.lastname,
                    email: data.email,
                    role: data.role,
                },
            });
            return {
                fname: updated.fname,
                lastname: updated.lastname,
                email: updated.email,
                role: updated.role,
                updatedAt: updated.updatedAt.toISOString(),
            };
        });
    }
}
exports.PrismaUserRepo = PrismaUserRepo;
