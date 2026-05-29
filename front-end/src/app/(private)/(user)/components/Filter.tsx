'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { getCategories, Category } from "@/lib/api"

const MAX_PRICE = 500

type FilterState = {
  categories: number[]
}

interface FilterProps {
  onApply?: (filters: FilterState) => void
}

export default function Filter({ onApply }: FilterProps) {
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategories, setSelectedCategories] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Buscar categorias do backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        setIsLoading(true)
        const data = await getCategories()
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
    onApply?.({ categories: selectedCategories })
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

      <Button
        onClick={handleApply}
        className="bg-(--blue) px-10 py-5 cursor-pointer w-full"
      >
        Aplicar
      </Button>
    </article>
  )
}