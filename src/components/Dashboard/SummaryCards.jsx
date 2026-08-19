import { Wallet, CalendarDays, Users2, User, HandCoins, PiggyBank } from "lucide-react";
import { Card } from "../UI/Primitives";
import { formatTL } from "../../utils/formatters";

const CARDS = [
  { key: "total", label: "Toplam Gider", icon: Wallet, tone: "brand" },
  { key: "thisMonth", label: "Bu Ayki Gider", icon: CalendarDays, tone: "brand" },
  { key: "ortak", label: "Ortak Gider", icon: Users2, tone: "mint" },
  { key: "kisisel", label: "Kişisel Gider", icon: User, tone: "slate" },
  { key: "borc", label: "Toplam Borç", icon: HandCoins, tone: "coral" },
  { key: "alacak", label: "Toplam Alacak", icon: PiggyBank, tone: "mint" },
];

const toneClasses = {
  brand: "bg-brand-50 text-brand-600",
  mint: "bg-emerald-50 text-mint-600",
  coral: "bg-red-50 text-coral-600",
  slate: "bg-slate-100 text-ink-700",
};

export default function SummaryCards({ values }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
      {CARDS.map((c) => (
        <Card key={c.key} className="p-4">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${toneClasses[c.tone]}`}>
            <c.icon size={17} />
          </div>
          <p className="text-xs text-ink-700/60 mb-0.5">{c.label}</p>
          <p className="font-display font-bold text-lg text-ink-900 num truncate">{formatTL(values[c.key] || 0)}</p>
        </Card>
      ))}
    </div>
  );
}
