import NextEventCard from "./components/NextEventCard";
import LastEventCard from "./components/LastEventCard";

export default function MyEvents(){
    return(
        <main className="p-8 min-h-screen">
        <header className="space-y-1">
          <h1 className="title-h1">
            Bem vido de volta, Emanoel !
          </h1>
          <p className="subtitle">
            Você tem 2 eventos programados para este mês. Pronto para curtir o espetáculo?
          </p>
        </header>

        <section>
            <h3 className="title-h3">Próximos Eventos</h3>
            <div className="grid grid-cols-2 gap-8">
              <NextEventCard/>
              <NextEventCard/>
            </div>
        </section>

        <section>
          <h3 className="title-h3">Últimos Eventos</h3>
          <LastEventCard/>
        </section>

        </main>
    )
}