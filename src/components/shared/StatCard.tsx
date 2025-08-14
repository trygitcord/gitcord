import Link from "next/link";

interface StatCardProps {
  icon: React.ReactNode;
  count: number;
  label: string;
  link?: string;
}

export function StatCard({ icon, count, label, link }: StatCardProps) {
  return (
    <div className="w-full h-full bg-neutral-50 rounded-xl col-span-1 px-4 sm:px-6 py-4 dark:bg-neutral-900 flex flex-row md:flex-col justify-start gap-4 md:gap-0">
      <div className="flex items-center justify-between md:w-full">
        <div className="bg-neutral-100 rounded-lg p-2 dark:bg-neutral-800">
          {icon}
        </div>
        {link && (
          <div className="border-2 border-neutral-100 rounded-lg px-3 sm:px-4 py-1.5 hover:cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all duration-300 dark:border-neutral-800">
            <Link href={link} className="w-full h-full">
              <p className="text-neutral-700 text-xs sm:text-sm dark:text-neutral-300">
                View Details
              </p>
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-col md:pt-3 sm:pt-4">
        <div>
          <p className="text-neutral-800 text-lg sm:text-xl font-medium dark:text-neutral-200">
            {count}
          </p>
        </div>
        <div>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
