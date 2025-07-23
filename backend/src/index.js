"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_routes_1 = __importDefault(require("./modules/product/infra/express/routes/product.routes"));
const category_routes_1 = __importDefault(require("./modules/category/infra/express/category.routes"));
const user_routes_1 = __importDefault(require("./modules/user/infra/express/user.routes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const coreOptions = {
    origin: ["http://localhost:5000", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // allowedHeaders: "Content-Type, Authorization",
    // exposedHeaders: "Content-Type, Authorization",
    // credentials: true,
    // maxAge: 3600,
};
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use("/", user_routes_1.default);
app.use("/products", product_routes_1.default);
app.use("/categories", category_routes_1.default);
app.listen(5000, () => {
    console.log("Server is running on port 5000");
});
