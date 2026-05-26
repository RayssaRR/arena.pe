import { Header } from "@/components/Header";
import Link from "next/link";
import { Star, MessageCircle, Play } from "lucide-react";

const GALERIA = [
  { src: "/ArenaPernambuco.jpg", alt: "Arena Pernambuco vista interna" },
  { src: "/ArenaPernambuco.jpg", alt: "Arena Pernambuco arquibancada" },
  { src: "/ArenaPernambuco.jpg", alt: "Arena Pernambuco campo" },
  { src: "/ArenaPernambuco.jpg", alt: "Arena Pernambuco noturna" },
];

const REDES = [
  { label: "Instagram", handle: "@arenapernambuco", href: "https://instagram.com/arenapernambuco", color: "bg-pink-50 text-pink-600 border-pink-200", icon: Star },
  { label: "Twitter / X", handle: "@arenapernambuco", href: "https://twitter.com/arenapernambuco", color: "bg-sky-50 text-sky-600 border-sky-200", icon: MessageCircle },
  { label: "YouTube", handle: "Arena Pernambuco", href: "https://youtube.com/arenapernambuco", color: "bg-red-50 text-red-600 border-red-200", icon: Play },
];

const NUMEROS = [
  { valor: "57.721", label: "Maior público da história", detalhe: "Encerramento do Centenário da Assembleia de Deus em PE — 20 de outubro de 2018. O maior evento já realizado na arena." },
  { valor: "44.300", label: "Capacidade para futebol", detalhe: "Assentos individuais e numerados seguindo o padrão FIFA. Para shows e eventos no gramado, a capacidade chega a 63.000 pessoas." },
  { valor: "5 jogos", label: "Copa do Mundo FIFA 2014", detalhe: "Costa do Marfim 2×1 Japão · Costa Rica 1×0 Itália · México 3×1 Croácia · Alemanha 1×0 EUA · França 0×0 Equador (fase de grupos)." },
  { valor: "R$ 532mi", label: "Investimento na construção", detalhe: "Obra iniciada em outubro de 2010 e concluída em maio de 2013. Projetada pelo Escritório Fernandes Arquitetos, responsável também pela Arena do Grêmio e do novo Maracanã." },
  { valor: "+10 anos", label: "De história e entretenimento", detalhe: "Inaugurada em 22 de maio de 2013 com Náutico x Sporting (Portugal). Desde então, palco de futebol, shows, festivais, feiras e eventos religiosos." },
  { valor: "4.700", label: "Vagas de estacionamento", detalhe: "800 vagas cobertas e 3.900 descobertas. O público pode ser disperso em apenas 8 minutos graças à estrutura com 13 escadas rolantes, 8 elevadores e 4 rampas." },
  { valor: "Padrão FIFA", label: "Tecnologia e infraestrutura", detalhe: "Telões de LED em alta resolução, câmeras panorâmicas 360°, iluminação e sonorização internacionais, e sistema de aquecimento solar com tecnologia Bosch Buderus." },
  { valor: "33 anos", label: "Concessão pública", detalhe: "Construída via Parceria Público-Privada (PPP) entre o Governo de Pernambuco e o Consórcio Arena de Pernambuco. Hoje gerida diretamente pelo Governo do Estado." },
];

const TIMELINE = [
  { ano: "2010", titulo: "Início das Obras", texto: "As obras da Arena Pernambuco começaram em outubro de 2010, com o objetivo de construir um dos estádios mais modernos do Brasil para a Copa do Mundo FIFA 2014." },
  { ano: "2013", titulo: "Inauguração Oficial", texto: "A Arena Pernambuco foi inaugurada em 22 de maio de 2013 no amistoso entre Náutico e Sporting (Portugal), marcando o início de uma nova era para grandes eventos esportivos em Pernambuco." },
  { ano: "2013", titulo: "Copa das Confederações FIFA", texto: "O estádio recebeu partidas históricas da Copa das Confederações FIFA 2013, incluindo Espanha 2×1 Uruguai, Itália 4×3 Japão e Uruguai 8×0 Taiti." },
  { ano: "2014", titulo: "Copa do Mundo FIFA", texto: "A Arena Pernambuco sediou cinco jogos da Copa do Mundo FIFA 2014, incluindo Alemanha 1×0 EUA e Costa Rica 1×0 Itália, recebendo milhares de torcedores do mundo inteiro." },
  { ano: "2016", titulo: "Gestão Pública", texto: "O Governo de Pernambuco assumiu a gestão direta da arena após rescisão do contrato com a Odebrecht, garantindo a continuidade das operações e eventos." },
  { ano: "2018", titulo: "Recorde de Público", texto: "Em outubro de 2018, a Arena bateu seu recorde histórico de público: 57.721 pessoas no encerramento do Centenário da Assembleia de Deus em Pernambuco." },
  { ano: "Atualidade", titulo: "Referência em Entretenimento", texto: "Hoje, a Arena Pernambuco é palco de grandes experiências esportivas, culturais e musicais, conectando milhares de pessoas todos os anos com mais de 25 espaços para eventos." },
];

export default function SobrePage() {
  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <Header />
      <main>

        <section
          className="relative h-[70vh] flex flex-col items-center justify-center text-center px-8 overflow-hidden"
          style={{ backgroundImage: "url('/ArenaPernambuco2.jpg')", backgroundSize: "cover", backgroundPosition: "center 45%" }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 space-y-3">
            <p className="text-white/70 text-sm font-medium uppercase tracking-widest">Conheça a nossa casa</p>
            <h1 className="title-h1 text-white">Arena Pernambuco</h1>
            <p className="text-white/80 max-w-xl mx-auto">Um dos estádios mais modernos do Brasil, palco de grandes momentos do esporte e da cultura nordestina.</p>
          </div>
        </section>

        <div className="max-w-5xl mx-auto px-8 py-16 space-y-20">

          <section>
            <h2 className="title-h2 mb-2 text-center">Números que impressionam</h2>
            <p className="body text-gray-500 text-center mb-8">Fatos e recordes que fazem da Arena Pernambuco um ícone do esporte e da cultura.</p>
            <div className="grid grid-cols-2 gap-5">
              {NUMEROS.map(({ valor, label, detalhe }) => (
                <div key={label} className="bg-white rounded-2xl border p-6 space-y-2 shadow-sm hover:shadow-md transition">
                  <p className="text-2xl font-bold text-(--blue)">{valor}</p>
                  <p className="font-semibold text-gray-800">{label}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{detalhe}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="grid grid-cols-2 gap-12 items-center">
            <div className="space-y-4">
              <h2 className="title-h2">Nossa História</h2>
              <p className="body text-gray-600">A Arena Pernambuco nasceu com o propósito de conectar paixão, inovação e grandes experiências. Inaugurada em 2013 para a Copa do Mundo FIFA 2014, tornou-se um dos estádios mais modernos do Brasil e um símbolo da evolução do esporte em Pernambuco.</p>
              <p className="body text-gray-600">Muito além do futebol, a Arena recebe shows, festivais, eventos culturais e experiências que movimentam milhares de pessoas todos os anos.</p>
              <p className="body text-gray-600">Com arquitetura moderna e estrutura multiuso, a Arena Pernambuco representa um espaço de encontro entre esporte, entretenimento e cultura.</p>
            </div>
            <div className="h-72 rounded-2xl overflow-hidden shadow-lg" style={{ backgroundImage: "url('/ArenaPernambuco5.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} />
          </section>

          <section>
            <h2 className="title-h2 mb-8 text-center">Linha do Tempo</h2>
            <div className="relative border-l-2 border-gray-200 pl-8 space-y-8">
              {TIMELINE.map(({ ano, titulo, texto }) => (
                <div key={ano + titulo} className="relative">
                  <span className="absolute -left-[41px] w-4 h-4 rounded-full bg-(--blue) border-2 border-white shadow" />
                  <p className="text-(--blue) font-bold text-sm mb-1">{ano} — {titulo}</p>
                  <p className="body text-gray-600">{texto}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="title-h2 mb-8 text-center">Galeria</h2>
            <div className="grid grid-cols-2 gap-4">
              {GALERIA.map(({ alt }, i) => (
                <div key={i} className={`rounded-2xl overflow-hidden shadow-sm ${i === 0 ? "row-span-2 h-96" : "h-44"}`} style={{ backgroundImage: "url('/ArenaPernambuco6.jpg')", backgroundSize: "cover", backgroundPosition: "center" }} aria-label={alt} />
              ))}
            </div>
          </section>

          <section>
            <h2 className="title-h2 mb-2 text-center">Siga a Arena</h2>
            <p className="body text-gray-500 text-center mb-8">Fique por dentro de tudo que acontece na Arena Pernambuco.</p>
            <div className="grid grid-cols-3 gap-5">
              {REDES.map((rede) => {
                const Icon = rede.icon;
                const linkClass = `flex items-center gap-4 border rounded-2xl p-5 transition hover:scale-[1.02] hover:shadow-md ${rede.color}`;
                return (
                  <a key={rede.label} href={rede.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    <Icon className="w-6 h-6 shrink-0" />
                    <div>
                      <p className="font-bold text-sm">{rede.label}</p>
                      <p className="text-xs opacity-75">{rede.handle}</p>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>

          <section className="bg-(--blue) rounded-3xl p-12 text-center text-white space-y-4">
            <h2 className="title-h2 text-white">Pronto para viver a experiência?</h2>
            <p className="text-white/80">Garanta seu ingresso e faça parte dos próximos momentos históricos da Arena Pernambuco.</p>
            <Link href="/event-discover" className="inline-block bg-white text-(--blue) font-bold px-8 py-3 rounded-xl hover:bg-white/90 transition">Ver Eventos</Link>
          </section>

        </div>
      </main>
    </div>
  );
}