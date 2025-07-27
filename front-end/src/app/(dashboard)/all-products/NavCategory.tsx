import React from "react";

interface Category {
  id: string;
  name: string;
}

interface NavCategoryProps {
  category: Category;
  selected: boolean;
  onClick: () => void;
}

export default function NavCategory({
  category,
  selected,
  onClick,
}: NavCategoryProps) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-2 border rounded-full text-xs font-medium mr-2 mb-2
        ${selected ? "bg-[#320A6B] text-white" : "bg-white text-[#320A6B]"}
        border-[#320A6B] transition`}
    >
      {category.name}
    </button>
  );
}
