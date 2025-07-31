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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
class UserController {
    constructor(useCases) {
        this.useCases = useCases;
        this.register = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this.useCases.register(req.body);
                res.status(201).json(user);
            }
            catch (err) {
                res.status(400).json({ error: err.message });
            }
        });
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.useCases.login(req.body);
                res.json(result);
            }
            catch (err) {
                res.status(401).json({ error: err.message });
            }
        });
        this.findAll = (_, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield this.useCases.getAllUsers();
                res.json(users);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to get all users" });
            }
        });
        this.delete = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                yield this.useCases.deleteUser(id);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to delete user" });
            }
        });
        this.update = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = Number(req.params.id);
                const data = req.body;
                const updated = yield this.useCases.updateUser(id, data);
                res.json(updated);
            }
            catch (error) {
                res.status(500).json({ error: "Failed to update user" });
            }
        });
    }
}
exports.UserController = UserController;
