import { useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Badge, Button, EmptyState, inputClass } from "../UI/Primitives";
import DateRangeFilter, { presetToRange } from "../UI/DateRangeFilter";
import { formatTL, formatDate } from "../../utils/formatters";
import { filterExpenses, getMemberShareForExpense } from "../../services/expenseService";

export default function ExpensesPage({ dateFilter, onDateFilterChange, onEdit, onAdd }) {
  const { state, allCategories, deleteExpense, toggleExpenseStatus } = useApp();
  const { members, expenses } = state;

  const [search, setSearch] = useState("");
  const [memberId, setMemberId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [type, setType] = useState("");
  const [sortBy, setSortBy] = useState("date-desc");
  const [confirmDelete, setConfirmDelete] = useState(null);

  const memberName = (id) => members.find((m) => m.id === id)?.name || "—";
  const category = (id) => allCategories.find((c) => c.id === id);

  const filtered = useMemo(() => {
    let list = filterExpenses(expenses, {
      startDate: dateFilter.startDate,
      endDate: dateFilter.endDate,
      memberId: memberId || undefined,
      categoryId: categoryId || undefined,
      type: type || undefined,
      search,
    });
    list = [...list].sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return a.date < b.date ? -1 : 1;
        case "amount-desc":
          return b.amount - a.amount;
        case "amount-asc":
          return a.amount - b.amount;
        default:
          return a.date < b.date ? 1 : -1;
      }
    });
    return list;
  }, [expenses, dateFilter, memberId, categoryId, type, search, sortBy]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-xl font-bold text-ink-900">Giderler</h1>
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

      <Card className="p-4">
        <div className="flex flex-wrap gap-2.5">
          <div className="relative flex-1 min-w-[180px]">
            <Icons.Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-700/40" />
            <input
              className={`${inputClass} pl-9`}
              placeholder="Açıklamada ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className={`${inputClass} w-auto`} value={memberId} onChange={(e) => setMemberId(e.target.value)}>
            <option value="">Tüm Kişiler</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
          <select className={`${inputClass} w-auto`} value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
            <option value="">Tüm Kategoriler</option>
            {allCategories.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>
          <select className={`${inputClass} w-auto`} value={type} onChange={(e) => setType(e.target.value)}>
            <option value="">Ortak / Kişisel</option>
            <option value="ortak">Ortak Gider</option>
            <option value="kisisel">Kişisel Gider</option>
          </select>
          <select className={`${inputClass} w-auto`} value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="date-desc">Tarih (Yeni → Eski)</option>
            <option value="date-asc">Tarih (Eski → Yeni)</option>
            <option value="amount-desc">Tutar (Yüksek → Düşük)</option>
            <option value="amount-asc">Tutar (Düşük → Yüksek)</option>
          </select>
        </div>
      </Card>

      <Card className="overflow-hidden">
        {filtered.length === 0 ? (
          <EmptyState
            icon={Icons.Receipt}
            title="Gösterilecek gider yok"
            description="Filtreleri değiştirin veya yeni bir harcama ekleyin."
            action={<Button onClick={onAdd}><Icons.Plus size={16} /> Harcama Ekle</Button>}
          />
        ) : (
          <>
            {/* Masaüstü tablo */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-ink-700/50 border-b border-slate-100">
                    <th className="px-4 py-3 font-medium">Ev Arkadaşı</th>
                    <th className="px-4 py-3 font-medium">Kategori</th>
                    <th className="px-4 py-3 font-medium">Tutar</th>
                    <th className="px-4 py-3 font-medium">Tarih</th>
                    <th className="px-4 py-3 font-medium">Tip</th>
                    <th className="px-4 py-3 font-medium">Kişi Başı Pay</th>
                    <th className="px-4 py-3 font-medium">Durum</th>
                    <th className="px-4 py-3 font-medium text-right">İşlem</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filtered.map((e) => {
                    const cat = category(e.categoryId);
                    const share = e.type === "ortak" ? getMemberShareForExpense(e, e.memberId) : e.amount;
                    return (
                      <tr key={e.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 font-medium text-ink-900 whitespace-nowrap">{memberName(e.memberId)}</td>
                        <td className="px-4 py-3 text-ink-700 whitespace-nowrap">{cat?.label}</td>
                        <td className="px-4 py-3 num font-medium text-ink-900 whitespace-nowrap">{formatTL(e.amount)}</td>
                        <td className="px-4 py-3 text-ink-700/70 whitespace-nowrap">{formatDate(e.date)}</td>
                        <td className="px-4 py-3">
                          <Badge tone={e.type === "ortak" ? "brand" : "slate"}>{e.type === "ortak" ? "Ortak" : "Kişisel"}</Badge>
                        </td>
                        <td className="px-4 py-3 num text-ink-700/70 whitespace-nowrap">{e.type === "ortak" ? formatTL(share) : "—"}</td>
                        <td className="px-4 py-3">
                          {e.type === "ortak" ? (
                            <button onClick={() => toggleExpenseStatus(e.id)}>
                              <Badge tone={e.status === "ödendi" ? "mint" : "coral"}>{e.status === "ödendi" ? "Ödendi" : "Bekliyor"}</Badge>
                            </button>
                          ) : (
                            <span className="text-ink-700/40">—</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex justify-end gap-1">
                            <button onClick={() => onEdit(e)} className="p-1.5 rounded-md hover:bg-slate-100 text-ink-700/60" aria-label="Düzenle">
                              <Icons.Pencil size={15} />
                            </button>
                            <button onClick={() => setConfirmDelete(e)} className="p-1.5 rounded-md hover:bg-red-50 text-coral-500" aria-label="Sil">
                              <Icons.Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobil kart görünümü */}
            <div className="md:hidden divide-y divide-slate-100">
              {filtered.map((e) => {
                const cat = category(e.categoryId);
                return (
                  <div key={e.id} className="p-4">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <div>
                        <p className="font-medium text-ink-900">{memberName(e.memberId)} · {cat?.label}</p>
                        <p className="text-xs text-ink-700/50">{formatDate(e.date)}</p>
                      </div>
                      <p className="font-semibold num text-ink-900">{formatTL(e.amount)}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex gap-1.5">
                        <Badge tone={e.type === "ortak" ? "brand" : "slate"}>{e.type === "ortak" ? "Ortak" : "Kişisel"}</Badge>
                        {e.type === "ortak" && (
                          <button onClick={() => toggleExpenseStatus(e.id)}>
                            <Badge tone={e.status === "ödendi" ? "mint" : "coral"}>{e.status === "ödendi" ? "Ödendi" : "Bekliyor"}</Badge>
                          </button>
                        )}
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => onEdit(e)} className="p-1.5 rounded-md hover:bg-slate-100 text-ink-700/60"><Icons.Pencil size={15} /></button>
                        <button onClick={() => setConfirmDelete(e)} className="p-1.5 rounded-md hover:bg-red-50 text-coral-500"><Icons.Trash2 size={15} /></button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </Card>

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setConfirmDelete(null)} />
          <Card className="relative max-w-sm w-full p-5">
            <h3 className="font-display font-semibold text-ink-900 mb-1.5">Harcamayı sil</h3>
            <p className="text-sm text-ink-700/70 mb-4">Bu işlem geri alınamaz ve ilgili borç/alacak hesapları güncellenecek.</p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>Vazgeç</Button>
              <Button variant="danger" onClick={() => { deleteExpense(confirmDelete.id); setConfirmDelete(null); }}>Sil</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
