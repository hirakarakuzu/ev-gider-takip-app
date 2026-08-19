import { useState } from "react";
import * as Icons from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button, Field, inputClass, Badge } from "../UI/Primitives";
import { initials, avatarColor } from "../../utils/formatters";

export default function HouseholdPage() {
  const { state, setHouseholdName, addMember, removeMember, reactivateMember } = useApp();
  const [name, setName] = useState(state.household.name);
  const [newMember, setNewMember] = useState("");
  const [error, setError] = useState("");
  const [removeTarget, setRemoveTarget] = useState(null);

  const activeMembers = state.members.filter((m) => m.active);
  const inactiveMembers = state.members.filter((m) => !m.active);

  const handleSaveName = () => {
    if (!name.trim()) return setError("Ev adı boş olamaz.");
    setHouseholdName(name.trim());
    setError("");
  };

  const handleAddMember = () => {
    const res = addMember(newMember);
    if (!res.ok) return setError(res.error);
    setNewMember("");
    setError("");
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-xl font-bold text-ink-900">Ev Yönetimi</h1>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-ink-900 mb-3">Ev / Oda Bilgisi</h3>
        <Field label="Ev / Oda Adı">
          <div className="flex gap-2">
            <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
            <Button variant="secondary" onClick={handleSaveName}>Kaydet</Button>
          </div>
        </Field>
        <p className="text-sm text-ink-700/60">{activeMembers.length} aktif kişi bu evde ortak giderleri paylaşıyor.</p>
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-ink-900 mb-3">Ev Arkadaşı Ekle</h3>
        <div className="flex gap-2">
          <input
            className={inputClass}
            placeholder="Yeni kişinin adı"
            value={newMember}
            onChange={(e) => setNewMember(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddMember()}
          />
          <Button onClick={handleAddMember}><Icons.Plus size={16} /> Ekle</Button>
        </div>
        {error && <p className="text-sm text-coral-600 mt-2">{error}</p>}
        <p className="text-xs text-ink-700/50 mt-2.5">
          Yeni eklenen kişi, bundan sonra oluşturulacak ortak giderlere dahil edilir. Geçmiş giderlerin bölüşümü değişmez.
        </p>
      </Card>

      <Card className="p-5">
        <h3 className="font-display font-semibold text-ink-900 mb-3">Aktif Kişiler</h3>
        <ul className="divide-y divide-slate-100">
          {activeMembers.map((m) => (
            <li key={m.id} className="py-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold" style={{ background: avatarColor(m.id) }}>
                  {initials(m.name)}
                </span>
                <span className="font-medium text-ink-900">{m.name}</span>
              </div>
              {activeMembers.length > 1 && (
                <button
                  onClick={() => setRemoveTarget(m)}
                  className="text-xs font-medium text-coral-600 hover:text-coral-700 bg-red-50 hover:bg-red-100 px-2.5 py-1.5 rounded-md"
                >
                  Çıkar
                </button>
              )}
            </li>
          ))}
        </ul>
      </Card>

      {inactiveMembers.length > 0 && (
        <Card className="p-5">
          <h3 className="font-display font-semibold text-ink-900 mb-3">Ayrılmış Kişiler</h3>
          <ul className="divide-y divide-slate-100">
            {inactiveMembers.map((m) => (
              <li key={m.id} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-semibold opacity-50" style={{ background: avatarColor(m.id) }}>
                    {initials(m.name)}
                  </span>
                  <span className="font-medium text-ink-700/60">{m.name}</span>
                  <Badge tone="slate">Pasif</Badge>
                </div>
                <button
                  onClick={() => reactivateMember(m.id)}
                  className="text-xs font-medium text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-2.5 py-1.5 rounded-md"
                >
                  Tekrar Ekle
                </button>
              </li>
            ))}
          </ul>
        </Card>
      )}

      {removeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-ink-900/40" onClick={() => setRemoveTarget(null)} />
          <Card className="relative max-w-sm w-full p-5">
            <h3 className="font-display font-semibold text-ink-900 mb-1.5">{removeTarget.name} evden çıkarılsın mı?</h3>
            <p className="text-sm text-ink-700/70 mb-4">
              Geçmiş giderleri ve hesaplamaları korunur; sadece bundan sonraki yeni ortak giderlere dahil edilmez. İstediğiniz zaman tekrar ekleyebilirsiniz.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setRemoveTarget(null)}>Vazgeç</Button>
              <Button variant="danger" onClick={() => { removeMember(removeTarget.id); setRemoveTarget(null); }}>Çıkar</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
