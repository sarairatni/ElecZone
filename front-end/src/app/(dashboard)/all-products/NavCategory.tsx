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
      className={`px-3 py-1 border rounded-full text-xs font-medium mr-1 mb-1
        ${selected ? "bg-[#050EAD] text-white" : "bg-white text-[#050EAD]"}
        border-[#320A6B] transition`}
    >
      {category.name}
    </button>
  );
}
