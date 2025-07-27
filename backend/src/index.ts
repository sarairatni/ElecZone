import express from "express";
import productRoutes from "./modules/product/infra/express/routes/product.routes";
import categoryRoutes from "./modules/category/infra/express/category.routes";
import userRoutes from "./modules/user/infra/express/user.routes";
import cartProductRouter from "./modules/cartproduct/infra/express/cartproduct.routes";
import cors from "cors";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
const app = express();

dotenv.config({ debug: true});
const coreOptions = {
  origin: ["http://localhost:5000", "http://localhost:3000"],
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  // allowedHeaders: "Content-Type, Authorization",
  // exposedHeaders: "Content-Type, Authorization",
  // credentials: true,
  // maxAge: 3600,
};

app.use(express.json());
app.use(cors());
app.use("/", userRoutes);
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use('/cartproducts', cartProductRouter);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Global error handler:', err.stack || err);
  res.status(500).json({ error: 'Internal Server Error', details: err.message });
});

app.get('/test-log', (req, res) => {
  console.log("TEST LOG ROUTE");
  res.send("ok");
});

app.listen(5001, () => {
  console.log("Server is running on port 5001");
});
