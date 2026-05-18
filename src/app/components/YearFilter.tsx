import { Calendar, ChevronDown } from 'lucide-react';

interface YearFilterProps {
  selectedYear: number;
  onYearChange: (year: number) => void;
}

export function YearFilter({ selectedYear, onYearChange }: YearFilterProps) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2 text-gray-600">
        <Calendar className="w-5 h-5" />
        <span className="text-sm">Năm học:</span>
      </div>
      <div className="relative">
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent cursor-pointer hover:border-gray-400 transition-colors"
        >
          {years.map((year) => (
            <option key={year} value={year}>
              {year} - {year + 1}
            </option>
          ))}
        </select>
        <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
      </div>
    </div>
  );
}
