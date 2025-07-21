import express from "express";
import productRoutes from "./modules/product/infra/express/routes/product.routes";
import categoryRoutes from "./modules/category/infra/express/category.routes";
import userRoutes from "./modules/user/infra/express/user.routes";
const app = express();
import dotenv from "dotenv";
dotenv.config();

app.use(express.json());

app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/", userRoutes);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
