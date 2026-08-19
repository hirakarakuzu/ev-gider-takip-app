import { Card } from "../UI/Primitives";
import { formatTL, initials, avatarColor } from "../../utils/formatters";

export default function MemberStatsGrid({ stats }) {
  return (
    <div>
      <h3 className="font-display font-semibold text-ink-900 mb-3">Kişi Bazlı Durum</h3>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {stats.map((s) => {
          const isCredit = s.netBalance > 0.004;
          const isDebt = s.netBalance < -0.004;
          return (
            <Card key={s.memberId} className="p-4">
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold shrink-0"
                  style={{ background: avatarColor(s.memberId) }}
                >
                  {initials(s.name)}
                </span>
                <p className="font-display font-semibold text-ink-900 truncate">{s.name}</p>
              </div>
              <dl className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <dt className="text-ink-700/60">Toplam ödediği</dt>
                  <dd className="num font-medium text-ink-900">{formatTL(s.totalPaid)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-ink-700/60">Ortak gider payı</dt>
                  <dd className="num font-medium text-ink-900">{formatTL(s.ownShare)}</dd>
                </div>
                <div className="flex justify-between pt-1.5 mt-1.5 border-t border-slate-100">
                  <dt className="text-ink-700/60">{isCredit ? "Alacağı" : isDebt ? "Borcu" : "Durum"}</dt>
                  <dd className={`num font-semibold ${isCredit ? "text-mint-600" : isDebt ? "text-coral-600" : "text-ink-700/60"}`}>
                    {isCredit || isDebt ? formatTL(Math.abs(s.netBalance)) : "Eşit"}
                  </dd>
                </div>
              </dl>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
