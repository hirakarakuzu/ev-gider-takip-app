import { useEffect, useMemo, useState } from "react";
import * as Icons from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Modal, Button, Field, inputClass } from "../UI/Primitives";
import { todayISO } from "../../utils/formatters";
import { calculateSplit } from "../../services/expenseService";

const emptyForm = {
  memberId: "",
  categoryId: "",
  amount: "",
  date: todayISO(),
  note: "",
  type: "ortak",
};

export default function ExpenseFormModal({ open, onClose, editingExpense }) {
  const { activeMembers, allCategories, addExpense, updateExpense, addCategory } = useApp();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [showNewCategory, setShowNewCategory] = useState(false);

  useEffect(() => {
    if (open) {
      if (editingExpense) {
        setForm({
          memberId: editingExpense.memberId,
          categoryId: editingExpense.categoryId,
          amount: editingExpense.amount,
          date: editingExpense.date,
          note: editingExpense.note,
          type: editingExpense.type,
        });
      } else {
        setForm({ ...emptyForm, memberId: activeMembers[0]?.id || "" });
      }
      setError("");
      setShowNewCategory(false);
      setNewCategory("");
    }
  }, [open, editingExpense, activeMembers]);

  const splitPreview = useMemo(() => {
    if (form.type !== "ortak" || !form.amount || activeMembers.length === 0) return null;
    const ids = activeMembers.map((m) => m.id);
    const shares = calculateSplit(Number(form.amount), ids);
    const perPerson = shares[ids[0]] ?? 0;
    return { count: ids.length, perPerson };
  }, [form.type, form.amount, activeMembers]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.memberId) return setError("Harcamayı yapan kişiyi seçin.");
    if (!form.categoryId) return setError("Bir kategori seçin.");
    if (!form.amount || Number(form.amount) <= 0) return setError("Geçerli bir tutar girin.");
    if (!form.date) return setError("Tarih seçin.");

    if (editingExpense) {
      updateExpense(editingExpense.id, form);
    } else {
      const res = addExpense(form);
      if (!res.ok) return setError(res.error);
    }
    onClose();
  };

  const handleAddCategory = () => {
    if (!newCategory.trim()) return;
    addCategory(newCategory);
    setNewCategory("");
    setShowNewCategory(false);
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={editingExpense ? "Harcamayı Düzenle" : "Harcama Ekle"}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>İptal</Button>
          <Button onClick={handleSubmit}>{editingExpense ? "Kaydet" : "Harcamayı Kaydet"}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <Field label="1. Kişi">
          <div className="grid grid-cols-3 gap-2">
            {activeMembers.map((m) => (
              <button
                type="button"
                key={m.id}
                onClick={() => setForm((f) => ({ ...f, memberId: m.id }))}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors truncate ${
                  form.memberId === m.id ? "bg-brand-600 text-white border-brand-600" : "border-slate-300 text-ink-700 hover:bg-slate-50"
                }`}
              >
                {m.name}
              </button>
            ))}
          </div>
        </Field>

        <Field label="2. Kategori">
          <div className="flex flex-wrap gap-2">
            {allCategories.map((c) => {
              const Icon = Icons[c.icon] || Icons.Tag;
              const selected = form.categoryId === c.id;
              return (
                <button
                  type="button"
                  key={c.id}
                  onClick={() => setForm((f) => ({ ...f, categoryId: c.id }))}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    selected ? "bg-brand-50 border-brand-500 text-brand-700" : "border-slate-300 text-ink-700 hover:bg-slate-50"
                  }`}
                >
                  <Icon size={14} /> {c.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => setShowNewCategory((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-slate-300 text-ink-700/60 hover:bg-slate-50"
            >
              <Icons.Plus size={14} /> Yeni
            </button>
          </div>
          {showNewCategory && (
            <div className="flex gap-2 mt-2">
              <input
                className={inputClass}
                placeholder="Yeni kategori adı"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
              />
              <Button type="button" variant="secondary" onClick={handleAddCategory}>Ekle</Button>
            </div>
          )}
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="3. Tutar (TL)">
            <input
              type="number"
              min="0"
              step="0.01"
              className={inputClass}
              placeholder="0.00"
              value={form.amount}
              onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
            />
          </Field>
          <Field label="4. Tarih">
            <input
              type="date"
              className={inputClass}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </Field>
        </div>

        <Field label="Açıklama (isteğe bağlı)">
          <input
            className={inputClass}
            placeholder="Örn. Ağustos ayı elektrik faturası"
            value={form.note}
            onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          />
        </Field>

        <Field label="5. Gider Tipi">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: "ortak" }))}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                form.type === "ortak" ? "bg-brand-600 text-white border-brand-600" : "border-slate-300 text-ink-700 hover:bg-slate-50"
              }`}
            >
              Ortak Gider
            </button>
            <button
              type="button"
              onClick={() => setForm((f) => ({ ...f, type: "kisisel" }))}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                form.type === "kisisel" ? "bg-brand-600 text-white border-brand-600" : "border-slate-300 text-ink-700 hover:bg-slate-50"
              }`}
            >
              Kişisel Gider
            </button>
          </div>
        </Field>

        {splitPreview && (
          <div className="rounded-lg bg-brand-50 border border-brand-100 px-3.5 py-2.5 text-sm text-brand-700 mb-2">
            <strong>{splitPreview.count} kişi</strong> arasında bölünecek. Kişi başı: <strong className="num">{splitPreview.perPerson.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL</strong>
          </div>
        )}

        {error && <p className="text-sm text-coral-600 mt-1">{error}</p>}
      </form>
    </Modal>
  );
}
