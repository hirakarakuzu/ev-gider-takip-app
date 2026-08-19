import * as Icons from "lucide-react";
import { Card, Badge, EmptyState } from "../UI/Primitives";
import { formatTL, formatDate, initials, avatarColor } from "../../utils/formatters";

export function RecentExpenses({ expenses, categories, members }) {
  const recent = [...expenses].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 6);
  const memberName = (id) => members.find((m) => m.id === id)?.name || "—";
  const category = (id) => categories.find((c) => c.id === id);

  return (
    <Card className="p-5">
      <h3 className="font-display font-semibold text-ink-900 mb-3">Son Harcamalar</h3>
      {recent.length === 0 ? (
        <EmptyState icon={Icons.Receipt} title="Henüz harcama yok" description="İlk harcamanızı ekleyerek başlayın." />
      ) : (
        <ul className="divide-y divide-slate-100">
          {recent.map((e) => {
            const cat = category(e.categoryId);
            const Icon = Icons[cat?.icon] || Icons.Tag;
            return (
              <li key={e.id} className="py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-900 truncate">{cat?.label} · {memberName(e.memberId)}</p>
                  <p className="text-xs text-ink-700/50">{formatDate(e.date)}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-sm font-semibold num text-ink-900">{formatTL(e.amount)}</p>
                  <Badge tone={e.type === "ortak" ? "brand" : "slate"}>{e.type === "ortak" ? "Ortak" : "Kişisel"}</Badge>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export function UnpaidDebts({ transactions, onSettle }) {
  return (
    <Card className="p-5">
      <h3 className="font-display font-semibold text-ink-900 mb-3">Ödenmemiş Borçlar</h3>
      {transactions.length === 0 ? (
        <EmptyState icon={Icons.CheckCircle2} title="Herkes eşit" description="Şu anda bekleyen bir borç yok." />
      ) : (
        <ul className="space-y-2.5">
          {transactions.map((t, i) => (
            <li key={i} className="flex items-center justify-between gap-3 bg-slate-50 rounded-lg px-3.5 py-3">
              <div className="flex items-center gap-2 min-w-0 text-sm">
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0" style={{ background: avatarColor(t.fromMemberId) }}>
                  {initials(t.fromName)}
                </span>
                <span className="font-medium text-ink-900 truncate">{t.fromName}</span>
                <Icons.ArrowRight size={14} className="text-ink-700/40 shrink-0" />
                <span className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-semibold shrink-0" style={{ background: avatarColor(t.toMemberId) }}>
                  {initials(t.toName)}
                </span>
                <span className="font-medium text-ink-900 truncate">{t.toName}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-semibold num text-coral-600 text-sm">{formatTL(t.amount)}</span>
                {onSettle && (
                  <button
                    onClick={() => onSettle(t)}
                    className="text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1.5 rounded-md"
                  >
                    Ödendi
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
