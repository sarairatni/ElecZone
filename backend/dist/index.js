"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_routes_1 = __importDefault(require("./modules/product/infra/express/routes/product.routes"));
const category_routes_1 = __importDefault(require("./modules/category/infra/express/category.routes"));
const user_routes_1 = __importDefault(require("./modules/user/infra/express/user.routes"));
const cartproduct_routes_1 = __importDefault(require("./modules/cartproduct/infra/express/cartproduct.routes"));
const order_routes_1 = __importDefault(require("./modules/order/infra/express/order.routes"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
dotenv_1.default.config({ debug: true });
const coreOptions = {
    origin: ["http://localhost:5001", "http://localhost:3000"],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    // allowedHeaders: "Content-Type, Authorization",
    // exposedHeaders: "Content-Type, Authorization",
    // credentials: true,
    // maxAge: 3600,
};
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use((0, cors_1.default)());
app.use("/products", product_routes_1.default);
app.use("/categories", category_routes_1.default);
app.use('/cartproducts', cartproduct_routes_1.default);
app.use('/orders', order_routes_1.default);
app.use("/users", user_routes_1.default);
app.use((err, req, res, next) => {
    console.error('Global error handler:', err.stack || err);
    res.status(500).json({ error: 'Internal Server Error', details: err.message });
});
app.listen(5001, () => {
    console.log("Server is running on port 5001");
});
