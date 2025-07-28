"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imgUrl?: string;
}

export default function ProductCard({ id, name, price, imgUrl }: ProductCardProps) {
  const router = useRouter();
  const validImgUrl = "/4mckb1h2.png";

  const handleRedirect = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/shared/401");
      return;
    }
    router.push(`/product-details/${id}`);
  };

  return (
    <div className="w-40 bg-white rounded-xl p-3 shadow-md flex flex-col justify-between mb-2 border border-gray-200">
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
        <h3 className="mt-2 text-xs font-semibold text-gray-700 text-center">{name}</h3>
        <p className="text-[#00D886] text-xs font-bold text-center">
          {price.toFixed(2)} DA
        </p>
      </div>

      <button
        className="mt-2 w-full text-xs rounded-lg bg-[#FF6767] text-white py-1 hover:bg-[#E8988A] transition-colors"
        onClick={handleRedirect}
      >
        Add to cart
      </button>
    </div>
  );
}
