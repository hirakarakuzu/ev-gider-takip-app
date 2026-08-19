import { useMemo } from "react";
import { useApp } from "../../context/AppContext";
import DateRangeFilter, { presetToRange } from "../UI/DateRangeFilter";
import SummaryCards from "./SummaryCards";
import MemberStatsGrid from "./MemberStatsGrid";
import MemberComparisonChart from "../Charts/MemberComparisonChart";
import CategoryPieChart from "../Charts/CategoryPieChart";
import MonthlyBarChart from "../Charts/MonthlyBarChart";
import TypeDonut from "../Charts/TypeDonut";
import { RecentExpenses, UnpaidDebts } from "./SidePanels";
import {
  filterExpenses,
  computeMemberStats,
  simplifyDebts,
  sumBy,
  totalOf,
  categoryBreakdown,
  monthlyBreakdown,
} from "../../services/expenseService";

export default function Dashboard({ dateFilter, onDateFilterChange }) {
  const { state, allCategories } = useApp();
  const { members, expenses, settlements } = state;

  const filtered = useMemo(
    () => filterExpenses(expenses, { startDate: dateFilter.startDate, endDate: dateFilter.endDate }),
    [expenses, dateFilter]
  );

  const monthRange = presetToRange("month");
  const thisMonthExpenses = useMemo(
    () => filterExpenses(expenses, monthRange),
    [expenses]
  );

  const memberStats = useMemo(() => computeMemberStats(members.filter((m) => m.active), filtered, settlements), [members, filtered, settlements]);
  const unpaidTransactions = useMemo(() => simplifyDebts(memberStats), [memberStats]);

  const summary = {
    total: totalOf(filtered),
    thisMonth: totalOf(thisMonthExpenses),
    ortak: sumBy(filtered, "ortak"),
    kisisel: sumBy(filtered, "kisisel"),
    borc: memberStats.filter((s) => s.netBalance < 0).reduce((a, s) => a - s.netBalance, 0),
    alacak: memberStats.filter((s) => s.netBalance > 0).reduce((a, s) => a + s.netBalance, 0),
  };

  const comparisonData = memberStats.map((s) => ({ name: s.name, Ödediği: s.ortakPaid, Payı: s.ownShare }));
  const catData = categoryBreakdown(filtered, allCategories);
  const monthlyData = monthlyBreakdown(expenses);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-bold text-ink-900">Panel</h1>
        <DateRangeFilter
          preset={dateFilter.preset}
          onPresetChange={(preset) => {
            const range = presetToRange(preset);
            onDateFilterChange({ preset, ...(range || { startDate: dateFilter.startDate, endDate: dateFilter.endDate }) });
          }}
          startDate={dateFilter.startDate}
          endDate={dateFilter.endDate}
          onCustomChange={(range) => onDateFilterChange({ ...dateFilter, ...range })}
        />
      </div>

      <SummaryCards values={summary} />

      <MemberStatsGrid stats={memberStats} />

      <div className="grid lg:grid-cols-2 gap-4">
        <MemberComparisonChart data={comparisonData} />
        <CategoryPieChart data={catData} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <MonthlyBarChart data={monthlyData} />
        </div>
        <TypeDonut ortak={summary.ortak} kisisel={summary.kisisel} />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <RecentExpenses expenses={filtered} categories={allCategories} members={members} />
        <UnpaidDebts transactions={unpaidTransactions} />
      </div>
    </div>
  );
}
