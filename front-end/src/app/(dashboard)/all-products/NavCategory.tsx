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
        ${selected ? "bg-[#FF7B00] text-white" : "bg-white text-[#FF7B00]"}
        border-[#FF7B00] transition`}
    >
      {category.name}
    </button>
  );
}
