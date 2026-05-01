import { Calendar } from "lucide-react";

export default function HomeCard() {
  return (
    <article className="h-60 w-150 flex flex-col gap-3 p-5 border-2 rounded-2xl">
        <div className="flex items-center justify-between">
            <span className="bg-(--blue) p-2 rounded-sm" >
                <Calendar color="white"/>
            </span>
            <span><p className="text-(--green-dark) inline bg-(--green-light) rounded-2xl p-1">+12%</p></span>
        </div>


      <h4 className="subtitle">Total de Eventos</h4>
      <p className="title-h2">24</p>
      <p>4 eventos acontecendo ao vivo neste momento</p>
    </article>
  );
}

