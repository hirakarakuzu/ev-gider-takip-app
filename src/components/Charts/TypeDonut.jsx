import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "../UI/Primitives";
import { formatTL } from "../../utils/formatters";

export default function TypeDonut({ ortak, kisisel }) {
  const data = [
    { name: "Ortak Gider", value: ortak, color: "#3468D9" },
    { name: "Kişisel Gider", value: kisisel, color: "#8FB6FF" },
  ];
  const total = ortak + kisisel;
  return (
    <Card className="p-5">
      <h3 className="font-display font-semibold text-ink-900 mb-4">Ortak / Kişisel Dağılımı</h3>
      {total === 0 ? (
        <p className="text-sm text-ink-700/50 py-10 text-center">Henüz veri yok.</p>
      ) : (
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                {data.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatTL(v)} contentStyle={{ borderRadius: 10, border: "1px solid #E1E6F0", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xs text-ink-700/50">Toplam</span>
            <span className="font-display font-bold text-ink-900 num">{formatTL(total)}</span>
          </div>
          <div className="flex items-center justify-center gap-4 mt-2">
            {data.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-ink-700/70">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} /> {d.name}
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
