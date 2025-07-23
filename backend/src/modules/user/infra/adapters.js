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
            const user = yield db_1.default.user.findUnique({ where: { email: data.email } });
            if (!user)
                throw new Error("Invalid credentials");
            const isValid = yield bcryptjs_1.default.compare(data.password, user.hashedPsw);
            if (!isValid)
                throw new Error("Invalid credentials");
            const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1d" });
            return { token };
        });
    }
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return db_1.default.user.findUnique({ where: { id } });
        });
    }
}
exports.PrismaUserRepo = PrismaUserRepo;
