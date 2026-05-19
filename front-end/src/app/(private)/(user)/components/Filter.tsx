'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:8080"
const TODAY = new Date().toISOString().split("T")[0]
const MAX_PRICE = 500

type Category = {
  id: number
  title: string
  description: string
}

type FilterState = {
  categories: number[]
  date: string
  maxPrice: number
}

interface FilterProps {
  onApply?: (filters: FilterState) => void
}

export default function Filter({ onApply }: FilterProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [date, setDate] = useState("")
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [isLoading, setIsLoading] = useState(true)

  // Buscar categorias do backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true)
        const res = await fetch(`${BACKEND_URL}/categories`)
        if (!res.ok) throw new Error("Erro ao buscar categorias")
        const data: Category[] = await res.json()
        setCategories(data)
        console.log("Categorias carregadas:", data)
      } catch (err) {
        console.error("Erro ao buscar categorias:", err)
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [])

  const toggleCategory = (catId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
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
          {isLoading ? (
            <p className="text-sm text-muted-foreground animate-pulse">Carregando categorias...</p>
          ) : categories.length > 0 ? (
            categories.map((cat) => (
              <label key={cat.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(cat.id)}
                  onChange={() => toggleCategory(cat.id)}
                  className="w-4 h-4 accent-(--blue) cursor-pointer"
                />
                <span className="body">{cat.title}</span>
              </label>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Nenhuma categoria disponível</p>
          )}
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