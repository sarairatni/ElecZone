"use client";

import Image from "next/image";

interface ProductCardProps {
  name: string;
  price: number;
  imgUrl?: string;
}

export default function ProductCard({ name, price, imgUrl }: ProductCardProps) {
  const validImgUrl = "/product.png";

  return (
    <div className="w-40 bg-white rounded-xl p-3 shadow-md flex flex-col justify-between mb-2 ">
      <div>
        <div className="flex justify-center">
          <Image
            src={validImgUrl}
            alt={name}
            width={100}
            height={100}
            className="rounded-md object-cover"
          />
        </div>
        <h3 className="mt-2 text-xs font-semibold text-center">{name}</h3>
        <p className="text-green-600 text-xs font-bold text-center">
          {price.toFixed(2)} DA
        </p>
      </div>

      <button className="mt-2 w-full text-xs rounded-lg bg-orange-500 text-white py-1 hover:bg-orange-600">
        Add to cart
      </button>
    </div>
  );
}
