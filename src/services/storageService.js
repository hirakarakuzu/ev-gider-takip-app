// storageService
// Bugün localStorage kullanır. İleride Firebase/Supabase gibi bir backend'e
// geçilmek istendiğinde sadece bu dosyadaki fonksiyonların içi değişir;
// uygulamanın geri kalanı bu arayüzü çağırmaya devam eder.

const STORAGE_KEY = "ev-gider-takip:v1";

const emptyState = () => ({
  household: {
    id: "household-1",
    name: "",
    createdAt: new Date().toISOString(),
  },
  members: [], // { id, name, active, joinedAt }
  categories: [], // kullanıcı tanımlı ek kategoriler
  expenses: [], // { id, memberId, categoryId, amount, date, note, type: 'ortak'|'kisisel', memberCountAtCreation, status: 'ödendi'|'bekliyor' }
  settlements: [], // { id, fromMemberId, toMemberId, amount, date, note }
});

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw);
    return { ...emptyState(), ...parsed };
  } catch (err) {
    console.error("Veri okunamadı:", err);
    return emptyState();
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
  } catch (err) {
    console.error("Veri kaydedilemedi:", err);
    return false;
  }
}

export function clearState() {
  localStorage.removeItem(STORAGE_KEY);
}

export { emptyState };
