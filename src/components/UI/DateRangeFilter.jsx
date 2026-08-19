import { Calendar } from "lucide-react";
import { todayISO, startOfWeekISO, startOfMonthISO, endOfMonthISO } from "../../utils/formatters";

const PRESETS = [
  { id: "today", label: "Bugün" },
  { id: "week", label: "Bu Hafta" },
  { id: "month", label: "Bu Ay" },
  { id: "lastMonth", label: "Geçen Ay" },
  { id: "all", label: "Tümü" },
  { id: "custom", label: "Özel" },
];

export function presetToRange(presetId) {
  switch (presetId) {
    case "today":
      return { startDate: todayISO(), endDate: todayISO() };
    case "week":
      return { startDate: startOfWeekISO(), endDate: todayISO() };
    case "month":
      return { startDate: startOfMonthISO(), endDate: endOfMonthISO() };
    case "lastMonth":
      return { startDate: startOfMonthISO(-1), endDate: endOfMonthISO(-1) };
    case "all":
      return { startDate: "", endDate: "" };
    default:
      return null;
  }
}

export default function DateRangeFilter({ preset, onPresetChange, startDate, endDate, onCustomChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            onClick={() => onPresetChange(p.id)}
            className={`px-3 py-1.5 text-sm rounded-md font-medium transition-colors ${
              preset === p.id ? "bg-white text-brand-700 shadow-sm" : "text-ink-700/70 hover:text-ink-900"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>
      {preset === "custom" && (
        <div className="flex items-center gap-2 text-sm">
          <Calendar size={16} className="text-ink-700/50" />
          <input
            type="date"
            value={startDate}
            onChange={(e) => onCustomChange({ startDate: e.target.value, endDate })}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
          <span className="text-ink-700/50">–</span>
          <input
            type="date"
            value={endDate}
            onChange={(e) => onCustomChange({ startDate, endDate: e.target.value })}
            className="rounded-lg border border-slate-300 px-2 py-1.5 text-sm"
          />
        </div>
      )}
    </div>
  );
}
