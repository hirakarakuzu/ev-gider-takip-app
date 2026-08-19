import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList } from "recharts";
import { Card } from "../UI/Primitives";
import { formatTL } from "../../utils/formatters";

export default function MemberComparisonChart({ data }) {
  return (
    <Card className="p-5">
      <h3 className="font-display font-semibold text-ink-900 mb-4">Kişi Bazlı Harcama Karşılaştırması</h3>
      {data.length === 0 ? (
        <p className="text-sm text-ink-700/50 py-10 text-center">Henüz veri yok.</p>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E1E6F0" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6B7A99" }} axisLine={{ stroke: "#E1E6F0" }} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#6B7A99" }} axisLine={false} tickLine={false} width={40} />
            <Tooltip formatter={(v) => formatTL(v)} contentStyle={{ borderRadius: 10, border: "1px solid #E1E6F0", fontSize: 13 }} />
            <Bar dataKey="Ödediği" fill="#3468D9" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Payı" fill="#B7D0FF" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}
