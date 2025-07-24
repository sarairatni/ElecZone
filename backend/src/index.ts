import express from "express";
import productRoutes from "./modules/product/infra/express/routes/product.routes";
import categoryRoutes from "./modules/category/infra/express/category.routes";
import userRoutes from "./modules/user/infra/express/user.routes";
import cartProductRouter from "./modules/cartproduct/infra/express/cartproduct.routes";
import cors from "cors";

const app = express();
import dotenv from "dotenv";
dotenv.config();

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

app.listen(5000, () => {
  console.log("Server is running on port 5000");
});
