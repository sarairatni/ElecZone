// src/modules/product/infra/express/product.controller.ts

import { Request, Response } from "express";
import { ProductUseCases } from "../../../app/usecases";
import { ProductInputDTO } from "../../../app/dto/product-input.dto";

export class ProductController {
  constructor(private readonly productUseCases: ProductUseCases) {}

  create = async (req: Request, res: Response) => {
    try {
      const data: ProductInputDTO = req.body;
      const created = await this.productUseCases.createProduct(data);
      res.status(201).json(created);
    } catch (error) {
      res.status(500).json({ error: "Failed to create product" });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const product = await this.productUseCases.getProductById(id);
      if (!product) return res.status(404).json({ error: "Product not found" });
      res.json(product);
    } catch (error) {
      res.status(500).json({ error: "Failed to get product" });
    }
  };

  findAll = async (_: Request, res: Response) => {
    try {
      const products = await this.productUseCases.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: "Failed to get products" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updated = await this.productUseCases.updateProduct(id, data);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update product" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.productUseCases.deleteProduct(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete product" });
    }
  };
}
