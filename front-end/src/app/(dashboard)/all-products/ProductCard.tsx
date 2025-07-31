"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "../../../utils/supabaseClient"; 

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imgUrl?: string;
}

export default function ProductCard({ id, name, price, imgUrl }: ProductCardProps) {
  const router = useRouter();
  const [imageUrl, setImageUrl] = useState<string>("/photo.png");
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    const getImageUrl = async () => {
      if (!imgUrl || imgUrl.startsWith("http")) {
        setImageUrl(imgUrl || "/photo.png");
        setImageLoading(false);
        return;
      }
      try {
        const { data } = supabase.storage
          .from('products') 
          .getPublicUrl(imgUrl);

        if (data?.publicUrl) {
          setImageUrl(data.publicUrl);
        } else {
          setImageUrl("/photo.png");
        }
      } catch (error) {
        console.error('Error fetching image from Supabase:', error);
        setImageUrl("/photo.png");
      } finally {
        setImageLoading(false);
      }
    };

    getImageUrl();
  }, [imgUrl]);

  const handleRedirect = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/shared/401");
      return;
    }
    router.push(`/product-details/${id}`);
  };

  const handleImageError = () => {
    setImageUrl("/photo.png");
  };

  return (
    <div className="w-40 bg-white rounded-xl p-3 shadow-md flex flex-col justify-between mb-2 border border-gray-200">
      <div>
        <div className="flex justify-center">
          {imageLoading ? (
            <div className="w-[100px] h-[100px] bg-gray-200 rounded-md animate-pulse flex items-center justify-center">
              <span className="text-gray-400 text-xs">Loading...</span>
            </div>
          ) : (
            <Image
              src={imageUrl}
              alt={name}
              width={100}
              height={100}
              className="rounded-md object-cover"
              onError={handleImageError}
            />
          )}
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