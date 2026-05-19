'use client'

const CATEGORIES = [
  "Todos os Eventos",
  "Esportes",
  "Shows",
  "Tours",
  "E-Sports",
]

interface CategoryProps {
  value: string;
  onChange: (category: string) => void;
}

export default function CategorySelect({ value, onChange }: CategoryProps) {
  return (
    <article className="border-2 rounded-sm p-4 shadow-xl space-y-1">
      <h3 className="title-h3 mb-3">Categorias</h3>

      {CATEGORIES.map((label) => (
        <button
          key={label}
          type="button"
          onClick={() => onChange(label)}
          className={`flex items-center w-full px-4 py-2.5 rounded-md text-left transition-colors cursor-pointer
            ${value === label ? "bg-(--blue)" : "hover:bg-muted"}`}
        >
          <span className={`body ${value === label ? "!text-white" : "text-foreground"}`}>
            {label}
          </span>
        </button>
      ))}
    </article>
  )
}