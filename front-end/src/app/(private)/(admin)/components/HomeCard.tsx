import { LucideIcon } from "lucide-react";

interface HomeCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  description: string;
  trend?: string;
}

export default function HomeCard({ icon: Icon, label, value, description, trend = "+12%" }: HomeCardProps) {
  return (
    <article className="h-60 w-150 flex flex-col gap-3 p-5 border-2 rounded-2xl">
      <div className="flex items-center justify-between">
        <span className="bg-(--blue) p-2 rounded-sm">
          <Icon color="white" />
        </span>
        <span>
          <p className="text-(--green-dark) inline bg-(--green-light) rounded-2xl p-1">{trend}</p>
        </span>
      </div>

      <h4 className="subtitle">{label}</h4>
      <p className="title-h2">{value}</p>
      <p>{description}</p>
    </article>
  );
}