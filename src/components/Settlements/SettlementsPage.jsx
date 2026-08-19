import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button, Badge, EmptyState } from "../UI/Primitives";
import { formatTL, formatDate, initials, avatarColor } from "../../utils/formatters";
import { computeMemberStats, simplifyDebts } from "../../services/expenseService";

export default function SettlementsPage() {
  const { state, addSettlement } = useApp();
  const { members, expenses, settlements } = state;
  const [confirming, setConfirming] = useState(null);

  const memberStats = useMemo(
    () => computeMemberStats(members.filter((m) => m.active), expenses, settlements),
    [members, expenses, settlements]
  );
  const transactions = useMemo(() => simplifyDebts(memberStats), [memberStats]);

  const memberName = (id) => members.find((m) => m.id === id)?.name || "—";

  const handleConfirmSettle = () => {
    if (!confirming) return;
    addSettlement(confirming.fromMemberId, confirming.toMemberId, confirming.amount);
    setConfirming(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-xl font-bold text-ink-900">Borç / Alacak</h1>

      <div className="grid lg:grid-cols-3 gap-3">
        {memberStats.map((s) => {
          const isCredit = s.netBalance > 0.004;
          const isDebt = s.netBalance < -0.004;
          return (
            <Card key={s.memberId} className="p-4 flex items-center gap-3">
              <span className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0" style={{ background: avatarColor(s.memberId) }}>
                {initials(s.name)}
              </span>
              <div className="min-w-0">
                <p className="font-medium text-ink-900 truncate">{s.name}</p>
                <p className={`text-sm num font-semibold ${isCredit ? "text-mint-600" : isDebt ? "text-coral-600" : "text-ink-700/50"}`}>
                  {isCredit ? `+${formatTL(s.netBalance)} alacaklı` : isDebt ? `-${formatTL(Math.abs(s.netBalance))} borçlu` : "Borcu/alacağı yok"}
                </p>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-ink-900 mb-1">Önerilen Ödemeler</h3>
        <p className="text-sm text-ink-700/60 mb-4">En az sayıda transferle tüm hesaplar kapatılacak şekilde hesaplanmıştır.</p>
        {transactions.length === 0 ? (
          <EmptyState icon={Icons.CheckCircle2} title="Herkes eşit" description="Şu anda kimsenin kimseye borcu yok." />
        ) : (
          <ul className="space-y-2.5">
            {transactions.map((t, i) => (
              <li key={i} className="flex items-center justify-between gap-3 bg-slate-50 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-ink-900">{t.fromName}</span>
                  <Icons.ArrowRight size={14} className="text-ink-700/40" />
                  <span className="font-medium text-ink-900">{t.toName}</span>
                  <span className="text-ink-700/50">'ye ödemeli</span>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-semibold num text-ink-900">{formatTL(t.amount)}</span>
                  <Button size="sm" onClick={() => setConfirming(t)}>Ödendi</Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-ink-900 mb-4">Ödeme Geçmişi</h3>
        {settlements.length === 0 ? (
          <p className="text-sm text-ink-700/50 py-6 text-center">Henüz kaydedilmiş bir ödeme yok.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {settlements.map((p) => (
              <li key={p.id} className="py-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-ink-900">{memberName(p.fromMemberId)}</span>
                  <Icons.ArrowRight size={13} className="text-ink-700/40" />
                  <span className="font-medium text-ink-900">{memberName(p.toMemberId)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-ink-700/50 text-xs">{formatDate(p.date)}</span>
                  <span className="num font-semibold text-ink-900">{formatTL(p.amount)}</span>
                  <Badge tone="mint">Ödendi</Badge>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {confirming && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setConfirming(null)} />
          <Card className="relative max-w-sm w-full p-5">
            <h3 className="font-display font-semibold text-ink-900 mb-1.5">Ödemeyi onayla</h3>
            <p className="text-sm text-ink-700/70 mb-4">
              <strong>{confirming.fromName}</strong>, <strong>{confirming.toName}</strong>'ye <strong>{formatTL(confirming.amount)}</strong> ödedi olarak işaretlenecek.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirming(null)}>Vazgeç</Button>
              <Button onClick={handleConfirmSettle}>Onayla</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
