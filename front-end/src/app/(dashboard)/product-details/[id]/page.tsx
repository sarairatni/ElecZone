"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import React from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imgUrl?: string;
  category: { name: string };
}

const MAX_QUANTITY = 10;

export default function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params) as { id: string };
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product");
        const data = await res.json();
        console.log("Frontend API response:", data)
        const mappedProduct = {
          id: data.ProductID,
          name: data.Name,
          description:"Experience the next level of innovation with the all-new Google Pixel 8 Pro. Featuring a stunning 6.7-inch OLED display, lightning-fast performance, and an advanced triple-lens camera system, this smartphone is designed to capture every moment in brilliant detail. With all-day battery life, seamless integration with your favorite apps, and a sleek, modern design, the Pixel 8 Pro is the perfect companion for work, play, and everything in between.",
          price: Number(data.Price),
          imgUrl: data.ImgUrl,
          category: { name: data.CategoryName || "" },
        };
        setProduct(mappedProduct);
      } catch (err) {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQuantityChange = (delta: number) => {
    setQuantity((q) => Math.max(1, Math.min(MAX_QUANTITY, q + delta)));
  };

  const handleAddToCart = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    console.log(user);
    const customerId = user.id;
    if (!customerId) {
      alert("You must be logged in to add to cart.");
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cartproducts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product?.id,
          customerId,
          quantity,
        }),
      });
      if (!res.ok) throw new Error("Failed to add to cart");
      router.push("/cart");
    } catch (err) {
      alert("Failed to add to cart.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!product) return <div>Product not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <div className="text-xs mb-6 text-gray-500">
        Categories &gt; {product.category?.name || "Unknown Category"}
      </div>
      <div className="flex flex-col md:flex-row gap-10 md:gap-16 items-start">
        {/* Right: Product Image */}
        <div className="md:order-2 flex-1 flex flex-col items-center justify-start w-full md:w-auto">
          <div className="bg-white rounded-xl shadow-md p-4 flex items-center justify-center w-full md:w-[350px] h-[350px]">
            <Image
              src={ "/4mckb1h2.png"}
              alt={ "Product Image"}
              width={300}
              height={300}
              className="rounded-lg object-cover max-h-[300px] max-w-full"
            />
          </div>
        </div>
        {/* Left: Product Details */}
        <div className="flex-1 flex flex-col gap-6 w-full">
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="text-base text-gray-700 mb-2 text-left whitespace-pre-line">{product.description}</div>
          <div className="text-xl font-semibold mt-2 mb-2">
            Total Price: <span className="text-green-600">{(product.price * quantity).toFixed(2)} DA</span>
          </div>
          {/* Quantity Selector */}
          <div className="flex flex-col items-start gap-2">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 bg-gray-200 rounded text-2xl font-bold hover:bg-gray-300 transition"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity === 1}
              >
                -
              </button>
              <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
              <button
                className="px-4 py-2 bg-gray-200 rounded text-2xl font-bold hover:bg-gray-300 transition"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity === MAX_QUANTITY}
              >
                +
              </button>
            </div>
            <div className="text-xs text-gray-400 mt-1">Max: {MAX_QUANTITY}</div>
          </div>
          <button
            className="mt-6 w-full rounded-lg bg-orange-500 text-white py-3 hover:bg-orange-600 text-lg font-semibold shadow"
            onClick={handleAddToCart}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
} 