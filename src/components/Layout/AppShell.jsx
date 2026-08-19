import { LayoutDashboard, Receipt, HandCoins, Users, Home, Plus } from "lucide-react";
import { useApp } from "../../context/AppContext";

const NAV = [
  { id: "dashboard", label: "Panel", icon: LayoutDashboard },
  { id: "expenses", label: "Giderler", icon: Receipt },
  { id: "settlements", label: "Borç / Alacak", icon: HandCoins },
  { id: "household", label: "Ev Yönetimi", icon: Users },
];

export default function AppShell({ active, onNavigate, onAddExpense, children }) {
  const { state } = useApp();

  return (
    <div className="min-h-screen bg-slate-50 pb-20 md:pb-0">
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center shrink-0">
              <Home size={18} />
            </div>
            <div className="min-w-0">
              <p className="font-display font-semibold text-ink-900 leading-tight truncate">{state.household.name}</p>
              <p className="text-xs text-ink-700/50 leading-tight">{state.members.filter((m) => m.active).length} kişi</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1 bg-slate-100 rounded-xl p-1">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => onNavigate(n.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active === n.id ? "bg-white text-brand-700 shadow-sm" : "text-ink-700/70 hover:text-ink-900"
                }`}
              >
                <n.icon size={16} /> {n.label}
              </button>
            ))}
          </nav>

          <button
            onClick={onAddExpense}
            className="hidden sm:inline-flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium shadow-sm shrink-0"
          >
            <Plus size={16} /> Harcama Ekle
          </button>
          <button
            onClick={onAddExpense}
            aria-label="Harcama Ekle"
            className="sm:hidden inline-flex items-center justify-center bg-brand-600 text-white w-10 h-10 rounded-lg shrink-0"
          >
            <Plus size={18} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6">{children}</main>

      <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-slate-200 flex items-stretch">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => onNavigate(n.id)}
            className={`flex-1 flex flex-col items-center justify-center gap-0.5 py-2.5 text-[11px] font-medium ${
              active === n.id ? "text-brand-700" : "text-ink-700/50"
            }`}
          >
            <n.icon size={19} />
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
