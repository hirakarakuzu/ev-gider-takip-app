import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Card } from "../UI/Primitives";
import { formatTL, monthLabel } from "../../utils/formatters";

export default function MonthlyBarChart({ data }) {
  const chartData = data.map((d) => ({ ...d, label: monthLabel(d.key) }));
  return (
    <Card className="p-5">
      <h3 className="font-display font-semibold text-ink-900 mb-4">Aylık Gider Trendi</h3>
      {chartData.length === 0 ? (
        <p className="text-sm text-ink-700/50 py-10 text-center">Henüz veri yok.</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3468D9" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#3468D9" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E6F0" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#6B7A99" }} axisLine={{ stroke: "#E1E6F0" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#6B7A99" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip formatter={(v) => formatTL(v)} contentStyle={{ borderRadius: 10, border: "1px solid #E1E6F0", fontSize: 13 }} />
            <Area type="monotone" dataKey="total" stroke="#3468D9" strokeWidth={2.5} fill="url(#fillTotal)" />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
