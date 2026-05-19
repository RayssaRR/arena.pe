"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch?: (value: string) => void;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  placeholder = "Procure por shows, partidas de futebol...",
}: SearchBarProps) {
  const [value, setValue] = useState("");

  function handleSearch() {
    onSearch?.(value);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") handleSearch();
  }

  return (
    <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-3 shadow-sm w-full max-w-2xl mx-auto">
      <Search className="w-5 h-5 text-gray-400 shrink-0" />
      <input
        type="text"
        placeholder={placeholder}
        className="flex-1 text-sm outline-none text-gray-700 placeholder:text-gray-400 bg-transparent"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button
        onClick={handleSearch}
        className="bg-(--blue) hover:bg-(--blue-hover) text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors cursor-pointer"
      >
        Pesquisar
      </button>
    </div>
  );
}