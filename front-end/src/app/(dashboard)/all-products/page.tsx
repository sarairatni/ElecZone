"use client";

import { useEffect, useState } from "react";
import NavCategory from "./NavCategory";
import ProductCard from "./ProductCard";

interface Category {
  CategoryID: number;
  Name: string;
}

interface Product {
  ProductID: number;
  Name: string;
  Price: number;
  ImgUrl?: string;
  CategoryID: number;
}

export default function AllProducts() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/categories`
        );
        const data = await res.json();
        setCategories([{ CategoryID: -1, Name: "All Products" }, ...data]);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products when category changes
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const url =
          selectedCategory === "all"
            ? `${process.env.NEXT_PUBLIC_API_URL}/products`
            : `${process.env.NEXT_PUBLIC_API_URL}/categories/${selectedCategory}/products`;

        const res = await fetch(url);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  return (
    <div className="space-y-4 p-6 bg-white">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Products</h1>
      {/* Category navigation */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => {
          const id = cat.CategoryID === -1 ? "all" : cat.CategoryID.toString();
          return (
            <NavCategory
              key={id}
              category={{ id, name: cat.Name }}
              selected={selectedCategory === id}
              onClick={() => setSelectedCategory(id)}
            />
          );
        })}
      </div>

      {/* Info header */}

      {selectedCategory !== "all" && (
      <div>
          <h2 className="text-base font-semibold text-gray-800 mb-2">
            {categories.find((c) => c.CategoryID.toString() === selectedCategory)?.Name}
        </h2>
      </div>
      )}

      {/* Products Grid */}
      <div className="flex flex-wrap gap-4 max-h-[600px] overflow-y-auto">
        {loading ? (
          <div className="w-full flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Chargement des produits...</p>
            </div>
          </div>
        ) : products.length > 0 ? (
          products.map((p) => (
            <ProductCard
              key={p.ProductID}
              id={p.ProductID.toString()}
              name={p.Name}
              price={p.Price}
              imgUrl={p.ImgUrl}
            />
          ))
        ) : (
          <p className="text-gray-500 italic">No products to display.</p>
        )}
      </div>
    </div>
  );
}
