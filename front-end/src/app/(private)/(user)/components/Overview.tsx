interface OverviewProps {
  description?: string;
}

export default function Overview({ description }: OverviewProps) {
  return (
    <>
      <h3 className="title-h3">Sobre o Evento</h3>
      <p className="text-gray-600 leading-relaxed whitespace-pre-line">
        {description ?? "Sem descrição disponível."}
      </p>
    </>
  );
}