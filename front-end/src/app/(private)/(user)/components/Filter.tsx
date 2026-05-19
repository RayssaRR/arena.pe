'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const CATEGORIES = ["Esportes", "Shows", "Tours", "E-Sports"]
const TODAY = new Date().toISOString().split("T")[0]
const MAX_PRICE = 500

type FilterState = {
  categories: string[]
  date: string
  maxPrice: number
}

interface FilterProps {
  onApply?: (filters: FilterState) => void
}

export default function Filter({ onApply }: FilterProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [date, setDate] = useState("")
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)

  const toggleCategory = (cat: string) => {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    )
  }

  const handleApply = () => {
    onApply?.({ categories: selectedCategories, date, maxPrice })
  }

  return (
    <article className="border-2 rounded-sm p-7 space-y-7 shadow-xl">
      <h3 className="title-h3">Filtros</h3>

      {/* CATEGORIA */}
      <div className="space-y-2">
        <h4 className="body-md font-bold">Categoria</h4>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat} className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
                className="w-4 h-4 accent-(--blue) cursor-pointer"
              />
              <span className="body">{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* DATA */}
      <div className="space-y-2">
        <h4 className="body-md font-bold">Data</h4>
        <Input
          type="date"
          value={date}
          min={TODAY}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {/* FAIXA DE PREÇO */}
      <div className="space-y-2">
        <h4 className="body-md font-bold">Faixa de Preço</h4>
        <input
          type="range"
          min={0}
          max={MAX_PRICE}
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-(--blue) cursor-pointer"
        />
        <div className="flex justify-between">
          <p className="body">R$ 0,00</p>
          <p className="body">R$ {maxPrice.toFixed(2).replace(".", ",")}</p>
        </div>
      </div>

      <Button
        onClick={handleApply}
        className="bg-(--blue) px-10 py-5 cursor-pointer w-full"
      >
        Aplicar
      </Button>
    </article>
  )
}