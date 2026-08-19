import { useState } from "react";
import { Home, Plus, X, ArrowRight, Users } from "lucide-react";
import { useApp } from "../../context/AppContext";
import { Card, Button, Field, inputClass } from "../UI/Primitives";

export default function HouseholdSetup() {
  const { setHouseholdName, addMember, state } = useApp();
  const [name, setName] = useState(state.household.name || "");
  const [people, setPeople] = useState([""]);
  const [error, setError] = useState("");

  const updatePerson = (idx, value) => {
    setPeople((p) => p.map((x, i) => (i === idx ? value : x)));
  };
  const addPersonField = () => setPeople((p) => [...p, ""]);
  const removePersonField = (idx) => setPeople((p) => p.filter((_, i) => i !== idx));

  const handleSubmit = (e) => {
    e.preventDefault();
    const cleanNames = people.map((p) => p.trim()).filter(Boolean);
    if (!name.trim()) return setError("Ev/oda için bir isim girin.");
    if (cleanNames.length < 1) return setError("En az bir kişi ekleyin.");
    const unique = new Set(cleanNames.map((n) => n.toLocaleLowerCase("tr-TR")));
    if (unique.size !== cleanNames.length) return setError("Aynı isimde iki kişi olamaz.");

    setHouseholdName(name.trim());
    cleanNames.forEach((n) => addMember(n));
    setError("");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-7">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 text-white flex items-center justify-center mx-auto mb-4 shadow-pop">
            <Home size={26} />
          </div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Ev / Oda Grubu Oluştur</h1>
          <p className="text-ink-700/70 text-sm mt-1.5">Ortak giderlerinizi paylaşacağınız grubu kurun.</p>
        </div>

        <Card className="p-6">
          <form onSubmit={handleSubmit}>
            <Field label="Ev / Oda Adı">
              <input
                className={inputClass}
                placeholder="Örn. Üniversite Evi"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>

            <Field label="Ev Arkadaşları">
              <div className="space-y-2">
                {people.map((p, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      className={inputClass}
                      placeholder={`Kişi ${idx + 1} adı`}
                      value={p}
                      onChange={(e) => updatePerson(idx, e.target.value)}
                    />
                    {people.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePersonField(idx)}
                        className="p-2.5 rounded-lg hover:bg-slate-100 text-ink-700/60 shrink-0"
                        aria-label="Kişiyi kaldır"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addPersonField}
                className="mt-2.5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-600 hover:text-brand-700"
              >
                <Plus size={16} /> Kişi ekle
              </button>
            </Field>

            {error && <p className="text-sm text-coral-600 mb-3">{error}</p>}

            <Button type="submit" className="w-full mt-2" size="lg">
              Devam Et <ArrowRight size={18} />
            </Button>
          </form>
        </Card>

        <div className="flex items-center gap-2 justify-center mt-5 text-xs text-ink-700/50">
          <Users size={14} /> 2, 3, 4 veya daha fazla kişilik gruplar desteklenir.
        </div>
      </div>
    </div>
  );
}
