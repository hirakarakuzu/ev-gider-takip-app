// expenseService
// Uygulamanın tüm para hesaplama mantığı burada toplanır.
// Component'ler asla kendi başına bölüşüm/borç hesabı yapmaz; hep bu fonksiyonları çağırır.
// Bu sayede hesaplama mantığı frontend'e sabitlenmez, tek yerden yönetilir ve test edilebilir.

const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

/**
 * Bir ortak gideri, oluşturulduğu andaki ev sakinleri arasında böler.
 * Kuruş bazlı yuvarlama farkını ödeyen kişiye değil, listedeki ilk kişilere
 * 0.01'er TL olarak dağıtır; böylece toplam her zaman tam tutara eşit kalır.
 */
export function calculateSplit(amount, splitMemberIds) {
  const n = splitMemberIds.length;
  if (n === 0) return {};
  const base = Math.floor((amount / n) * 100) / 100;
  const totalBase = round2(base * n);
  let remainder = round2(amount - totalBase); // kuruş farkı, örn. 0.02
  const remainderSteps = Math.round(remainder * 100); // kaç kişiye 0.01 fazladan verilecek

  const shares = {};
  splitMemberIds.forEach((id, idx) => {
    const extra = idx < remainderSteps ? 0.01 : 0;
    shares[id] = round2(base + extra);
  });
  return shares;
}

/** Bir giderin, verilen üye için kişi başı payını döner (kişisel giderde tüm tutar). */
export function getMemberShareForExpense(expense, memberId) {
  if (expense.type === "kisisel") {
    return expense.memberId === memberId ? expense.amount : 0;
  }
  const shares = calculateSplit(expense.amount, expense.splitMemberIds || []);
  return shares[memberId] || 0;
}

export function isWithinRange(dateStr, startDate, endDate) {
  if (!startDate && !endDate) return true;
  const d = new Date(dateStr);
  if (startDate && d < new Date(startDate)) return false;
  if (endDate && d > new Date(endDate + "T23:59:59")) return false;
  return true;
}

export function filterExpenses(expenses, { startDate, endDate, memberId, categoryId, type, search } = {}) {
  return expenses.filter((e) => {
    if (!isWithinRange(e.date, startDate, endDate)) return false;
    if (memberId && e.memberId !== memberId) return false;
    if (categoryId && e.categoryId !== categoryId) return false;
    if (type && e.type !== type) return false;
    if (search) {
      const q = search.toLocaleLowerCase("tr-TR");
      const hay = `${e.note || ""}`.toLocaleLowerCase("tr-TR");
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/**
 * Her üye için: toplam ödediği, ortak gider payı, kişisel harcaması ve net bakiyesini hesaplar.
 * Net bakiye = Ödediği ortak gider - Kendi ortak gider payı (+ ödeme/settlement etkisi)
 */
export function computeMemberStats(members, expenses, settlements = []) {
  const stats = {};
  members.forEach((m) => {
    stats[m.id] = {
      memberId: m.id,
      name: m.name,
      totalPaid: 0, // ortak + kişisel, ödediği toplam
      ortakPaid: 0, // ödediği ortak gider toplamı
      ownShare: 0, // ortak giderlerdeki kendi payı toplamı
      personalTotal: 0, // kişisel harcamaları
      rawBalance: 0, // ortakPaid - ownShare (settlement öncesi)
      netBalance: 0, // settlement sonrası
    };
  });

  expenses.forEach((e) => {
    const payer = stats[e.memberId];
    if (payer) {
      payer.totalPaid = round2(payer.totalPaid + e.amount);
      if (e.type === "ortak") payer.ortakPaid = round2(payer.ortakPaid + e.amount);
      if (e.type === "kisisel") payer.personalTotal = round2(payer.personalTotal + e.amount);
    }
    if (e.type === "ortak") {
      const shares = calculateSplit(e.amount, e.splitMemberIds || []);
      Object.entries(shares).forEach(([memberId, share]) => {
        if (stats[memberId]) stats[memberId].ownShare = round2(stats[memberId].ownShare + share);
      });
    }
  });

  Object.values(stats).forEach((s) => {
    s.rawBalance = round2(s.ortakPaid - s.ownShare);
    s.netBalance = s.rawBalance;
  });

  settlements.forEach((p) => {
    if (stats[p.fromMemberId]) stats[p.fromMemberId].netBalance = round2(stats[p.fromMemberId].netBalance + p.amount);
    if (stats[p.toMemberId]) stats[p.toMemberId].netBalance = round2(stats[p.toMemberId].netBalance - p.amount);
  });

  return Object.values(stats);
}

/**
 * Borç/alacak netleştirme algoritması: en büyük borçlu ile en büyük alacaklıyı
 * eşleştirerek toplam ödeme sayısını minimize eder (greedy "settle up").
 */
export function simplifyDebts(memberStats) {
  const creditors = [];
  const debtors = [];
  memberStats.forEach((s) => {
    if (s.netBalance > 0.004) creditors.push({ id: s.memberId, name: s.name, amount: s.netBalance });
    else if (s.netBalance < -0.004) debtors.push({ id: s.memberId, name: s.name, amount: -s.netBalance });
  });

  creditors.sort((a, b) => b.amount - a.amount);
  debtors.sort((a, b) => b.amount - a.amount);

  const transactions = [];
  let ci = 0, di = 0;
  while (ci < creditors.length && di < debtors.length) {
    const c = creditors[ci];
    const d = debtors[di];
    const amount = round2(Math.min(c.amount, d.amount));
    if (amount > 0.004) {
      transactions.push({ fromMemberId: d.id, fromName: d.name, toMemberId: c.id, toName: c.name, amount });
    }
    c.amount = round2(c.amount - amount);
    d.amount = round2(d.amount - amount);
    if (c.amount <= 0.004) ci++;
    if (d.amount <= 0.004) di++;
  }
  return transactions;
}

export function sumBy(expenses, type) {
  return round2(expenses.filter((e) => e.type === type).reduce((acc, e) => acc + e.amount, 0));
}

export function totalOf(expenses) {
  return round2(expenses.reduce((acc, e) => acc + e.amount, 0));
}

export function categoryBreakdown(expenses, categories) {
  const map = {};
  expenses.forEach((e) => {
    map[e.categoryId] = round2((map[e.categoryId] || 0) + e.amount);
  });
  return Object.entries(map)
    .map(([categoryId, total]) => {
      const cat = categories.find((c) => c.id === categoryId);
      return { categoryId, label: cat?.label || categoryId, color: cat?.color || "#5C93F5", total };
    })
    .sort((a, b) => b.total - a.total);
}

export function monthlyBreakdown(expenses) {
  const map = {};
  expenses.forEach((e) => {
    const d = new Date(e.date);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    map[key] = round2((map[key] || 0) + e.amount);
  });
  return Object.entries(map)
    .sort(([a], [b]) => (a > b ? 1 : -1))
    .map(([key, total]) => ({ key, total }));
}

export { round2 };
