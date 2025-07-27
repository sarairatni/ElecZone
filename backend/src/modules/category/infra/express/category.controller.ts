import { Request, Response } from "express";
import { CategoryUseCases } from "../../app/usecases";
import { CategoryInputDTO } from "../../app/dto/category-input.dto";

export class CategoryController {
  constructor(private readonly categoryUseCases: CategoryUseCases) {}

  create = async (req: Request, res: Response) => {
    try {
      const data: CategoryInputDTO = req.body;
      const created = await this.categoryUseCases.createCategory(data);
      res.status(201).json(created);
    } catch (error: any) {
      if (error.code === "P2002") {
        return res.status(409).json({ error: "Category name must be unique" });
      }
      console.error("Erreur création catégorie:", error);
      res.status(500).json({ error: "Failed to create category" });
    }
  };

  findById = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const category = await this.categoryUseCases.getCategoryById(id);
      if (!category)
        return res.status(404).json({ error: "Category not found" });
      res.json(category);
    } catch (error) {
      res.status(500).json({ error: "Failed to get category" });
    }
  };

  findAll = async (_: Request, res: Response) => {
    try {
      console.log('GET /categories about ot be  called');
      const categories = await this.categoryUseCases.getAllCategories();
      console.log('GET /categories has been called');
      res.json(categories);
    } catch (error) {
      console.error('Error in GET /categories:', error);
      res.status(500).json({ error: "Failed to get categories" });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      const data = req.body;
      const updated = await this.categoryUseCases.updateCategory(id, data);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update category" });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const id = Number(req.params.id);
      await this.categoryUseCases.deleteCategory(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  };

  getProductsByCategory = async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.id);

    if (isNaN(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    try {
      const products = await this.categoryUseCases.findProducts(categoryId);
      res.status(200).json(products);
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ error: "Failed to fetch products by category" });
    }
  };
}
