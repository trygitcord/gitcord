import { PieChart } from "@/components/ui/pie-chart";

interface LanguagesPieChartProps {
  languages: { [key: string]: number };
}

const COLORS = [
  "#5BC898", // Gitcord green (primary)
  "#FF6B6B", // Coral red
  "#4ECDC4", // Turquoise
  "#FFD93D", // Yellow
  "#6C5CE7", // Purple
  "#FF8B94", // Pink
];

export function LanguagesPieChart({ languages }: LanguagesPieChartProps) {
  // Check if languages data is empty
  if (!languages || Object.keys(languages).length === 0) {
    return (
      <div className="bg-neutral-900 rounded-xl p-4">
        <h3 className="text-sm font-medium mb-4">Languages</h3>
        <div className="h-[160px] flex items-center justify-center">
          <p className="text-sm text-neutral-500">No language data available</p>
        </div>
      </div>
    );
  }

  // Calculate total bytes
  const totalBytes = Object.values(languages).reduce(
    (sum, bytes) => sum + bytes,
    0
  );

  // Transform data for the pie chart
  const data = Object.entries(languages).map(([name, bytes], index) => ({
    name,
    value: Number(((bytes / totalBytes) * 100).toFixed(1)),
    color: COLORS[index % COLORS.length],
  }));

  return (
    <div className="bg-neutral-900 rounded-xl p-4">
      <h3 className="text-sm font-medium mb-4">Languages</h3>
      <div className="h-[160px]">
        <PieChart data={data} />
      </div>
    </div>
  );
}
