import { Header } from "@/components/Header";
import Link from "next/link";

const GALERIA = [
  { src: "/ArenaPernambuco.jpg", alt: "Arena Pernambuco vista interna" },
  { src: "/ArenaPernambuco.jpg", alt: "Arena Pernambuco arquibancada" },
  { src: "/ArenaPernambuco.jpg", alt: "Arena Pernambuco campo" },
  { src: "/ArenaPernambuco.jpg", alt: "Arena Pernambuco noturna" },
];

const REDES = [
  {
    label: "Instagram",
    handle: "@arenapernambuco",
    href: "https://instagram.com/arenapernambuco",
    color: "bg-pink-50 text-pink-600 border-pink-200",
  },
  {
    label: "Twitter / X",
    handle: "@arenapernambuco",
    href: "https://twitter.com/arenapernambuco",
    color: "bg-sky-50 text-sky-600 border-sky-200",
  },
  {
    label: "YouTube",
    handle: "Arena Pernambuco",
    href: "https://youtube.com/arenapernambuco",
    color: "bg-red-50 text-red-600 border-red-200",
  },
];

const TIMELINE = [
  { ano: "2010", texto: "Início das obras da Arena Pernambuco em São Lourenço da Mata." },
  { ano: "2013", texto: "Inauguração oficial com o jogo Santa Cruz x Sport, em maio de 2013." },
  { ano: "2014", texto: "Sede de 4 jogos da Copa do Mundo FIFA, incluindo França x Honduras." },
  { ano: "2016", texto: "Recebe jogos das Olimpíadas do Rio de Janeiro." },
  { ano: "2023", texto: "Reformas e expansão dos serviços para eventos culturais e shows." },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <Header />

      <main>

        {/* Hero */}
        <section
          className="relative h-[70vh] flex flex-col items-center justify-center text-center px-8 overflow-hidden"
          style={{
            backgroundImage: "url('/ArenaPernambuco2.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center bottom",
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 space-y-3">
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest">Conheça a nossa casa</p>
            <h1 className="title-h1 text-white">Arena Pernambuco</h1>
            <p className="text-white/80 max-w-xl mx-auto">
              Um dos estádios mais modernos do Brasil, palco de grandes momentos do esporte e da cultura nordestina.
            </p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-8 py-16 space-y-20">

          {/* Curiosidades */}
          <section>
            <h2 className="title-h2 mb-8 text-center">Números que impressionam</h2>
            <div className="grid grid-cols-4 gap-5">

            </div>
          </section>

          {/* História */}
          <section className="grid grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="title-h2">Nossa História</h2>
              <p className="body text-gray-600">
                A Arena Pernambuco nasceu com o sonho de transformar o Nordeste em referência no esporte e entretenimento mundial. Construída para a Copa do Mundo FIFA 2014, o estádio rapidamente se tornou o coração da torcida pernambucana.
              </p>
              <p className="body text-gray-600">
                Com capacidade para mais de 46 mil pessoas, a arena recebeu jogos históricos, shows internacionais e eventos que marcaram gerações. Cada evento realizado aqui é uma nova página na história do estado.
              </p>
              <p className="body text-gray-600">
                Hoje, a Arena Pernambuco é muito mais do que um estádio — é um símbolo de orgulho regional e um espaço que une pernambucanos de todas as regiões em torno da paixão pelo esporte e pela cultura.
              </p>
            </div>
            <div
              className="h-72 rounded-2xl overflow-hidden shadow-lg"
              style={{
                backgroundImage: "url('/ArenaPernambuco5.jpg')",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
          </section>

          {/* Timeline */}
          <section>
            <h2 className="title-h2 mb-8 text-center">Linha do Tempo</h2>
            <div className="relative border-l-2 border-gray-200 pl-8 space-y-8">
              {TIMELINE.map(({ ano, texto }) => (
                <div key={ano} className="relative">
                  <span className="absolute -left-[41px] w-4 h-4 rounded-full bg-(--blue) border-2 border-white shadow" />
                  <p className="text-(--blue) font-bold text-sm mb-1">{ano}</p>
                  <p className="body text-gray-600">{texto}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Galeria */}
          <section>
            <h2 className="title-h2 mb-8 text-center">Galeria</h2>
            <div className="grid grid-cols-2 gap-4">
              {GALERIA.map(({ src, alt }, i) => (
                <div
                  key={i}
                  className={`rounded-2xl overflow-hidden shadow-sm ${i === 0 ? "row-span-2 h-96" : "h-44"}`}
                  style={{
                    backgroundImage: `url('/ArenaPernambuco6.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                  aria-label={alt}
                />
              ))}
            </div>
          </section>

          {/* Redes sociais */}
          <section>
            <h2 className="title-h2 mb-2 text-center">Siga a Arena</h2>
            <p className="body text-gray-500 text-center mb-8">Fique por dentro de tudo que acontece na Arena Pernambuco.</p>
            <div className="grid grid-cols-3 gap-5">
              
            </div>
          </section>

          {/* CTA */}
          <section className="bg-(--blue) rounded-3xl p-12 text-center text-white space-y-4">
            <h2 className="title-h2 text-white">Pronto para viver a experiência?</h2>
            <p className="text-white/80">Garanta seu ingresso e faça parte dos próximos momentos históricos da Arena Pernambuco.</p>
            <Link
              href="/event-discover"
              className="inline-block bg-white text-(--blue) font-bold px-8 py-3 rounded-xl hover:bg-white/90 transition"
            >
              Ver Eventos
            </Link>
          </section>

        </div>
      </main>
    </div>
  );
}