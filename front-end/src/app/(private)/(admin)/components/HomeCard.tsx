import { LucideIcon } from "lucide-react";

interface HomeCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description: string;
}

export default function HomeCard({ icon: Icon, label, value, description }: HomeCardProps) {
  return (
    <article className="h-fit w-150 flex flex-col gap-3 p-5 border-2 rounded-2xl">
      <div className="flex items-center gap-3">
        <span className="bg-(--blue) p-2 rounded-sm">
          <Icon color="white" />
        </span>
          <h4 className="subtitle">{label}</h4>
      </div>

      <p className="title-h2">{value}</p>
      <p className="text-sm text-gray-500">{description}</p>
    </article>
  );
}