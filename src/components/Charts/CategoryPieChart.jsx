import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { Card } from "../UI/Primitives";
import { formatTL } from "../../utils/formatters";

export default function CategoryPieChart({ data }) {
  return (
    <Card className="p-5">
      <h3 className="font-display font-semibold text-ink-900 mb-4">Kategori Bazlı Gider Dağılımı</h3>
      {data.length === 0 ? (
        <p className="text-sm text-ink-700/50 py-10 text-center">Henüz veri yok.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={data} dataKey="total" nameKey="label" innerRadius={55} outerRadius={85} paddingAngle={2}>
              {data.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(v) => formatTL(v)} contentStyle={{ borderRadius: 10, border: "1px solid #E1E6F0", fontSize: 13 }} />
            <Legend wrapperStyle={{ fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
