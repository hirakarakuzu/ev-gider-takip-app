import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { loadState, saveState } from "../services/storageService";
import { DEFAULT_CATEGORIES } from "../data/defaultCategories";

const AppContext = createContext(null);

const uid = () => (crypto.randomUUID ? crypto.randomUUID() : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`);

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    const s = loadState();
    if (!s.members || s.members.length === 0) {
      // İlk açılış: örnek olmayan, boş ama kullanılabilir bir durum kur
      s.members = s.members || [];
    }
    return s;
  });

  useEffect(() => {
    saveState(state);
  }, [state]);

  const allCategories = useMemo(() => [...DEFAULT_CATEGORIES, ...state.categories], [state.categories]);

  const activeMembers = useMemo(() => state.members.filter((m) => m.active), [state.members]);

  // ---- Household ----
  const setHouseholdName = useCallback((name) => {
    setState((s) => ({ ...s, household: { ...s.household, name } }));
  }, []);

  // ---- Members ----
  const addMember = useCallback((name) => {
    const trimmed = name.trim();
    if (!trimmed) return { ok: false, error: "İsim boş olamaz." };
    setState((s) => {
      const exists = s.members.some((m) => m.active && m.name.toLocaleLowerCase("tr-TR") === trimmed.toLocaleLowerCase("tr-TR"));
      if (exists) return s;
      return {
        ...s,
        members: [...s.members, { id: uid(), name: trimmed, active: true, joinedAt: new Date().toISOString() }],
      };
    });
    return { ok: true };
  }, []);

  const removeMember = useCallback((memberId) => {
    // Geçmiş giderlerin bütünlüğünü korumak için üye silinmez, pasif hale getirilir.
    setState((s) => ({
      ...s,
      members: s.members.map((m) => (m.id === memberId ? { ...m, active: false } : m)),
    }));
  }, []);

  const reactivateMember = useCallback((memberId) => {
    setState((s) => ({
      ...s,
      members: s.members.map((m) => (m.id === memberId ? { ...m, active: true } : m)),
    }));
  }, []);

  // ---- Categories ----
  const addCategory = useCallback((label) => {
    const trimmed = label.trim();
    if (!trimmed) return;
    setState((s) => ({
      ...s,
      categories: [
        ...s.categories,
        { id: `custom-${uid()}`, label: trimmed, icon: "Tag", color: "#3468D9", custom: true },
      ],
    }));
  }, []);

  // ---- Expenses ----
  const addExpense = useCallback(
    (payload) => {
      const { memberId, categoryId, amount, date, note, type, status } = payload;
      if (!memberId || !categoryId || !amount || !date) return { ok: false, error: "Zorunlu alanlar eksik." };
      setState((s) => {
        const splitMemberIds = type === "ortak" ? s.members.filter((m) => m.active).map((m) => m.id) : [];
        const expense = {
          id: uid(),
          memberId,
          categoryId,
          amount: Number(amount),
          date,
          note: note || "",
          type,
          splitMemberIds,
          status: type === "ortak" ? status || "bekliyor" : "—",
          createdAt: new Date().toISOString(),
        };
        return { ...s, expenses: [expense, ...s.expenses] };
      });
      return { ok: true };
    },
    []
  );

  const updateExpense = useCallback((id, patch) => {
    setState((s) => ({
      ...s,
      expenses: s.expenses.map((e) => (e.id === id ? { ...e, ...patch, amount: patch.amount !== undefined ? Number(patch.amount) : e.amount } : e)),
    }));
  }, []);

  const deleteExpense = useCallback((id) => {
    setState((s) => ({ ...s, expenses: s.expenses.filter((e) => e.id !== id) }));
  }, []);

  const toggleExpenseStatus = useCallback((id) => {
    setState((s) => ({
      ...s,
      expenses: s.expenses.map((e) =>
        e.id === id ? { ...e, status: e.status === "ödendi" ? "bekliyor" : "ödendi" } : e
      ),
    }));
  }, []);

  // ---- Settlements (ödemeler) ----
  const addSettlement = useCallback((fromMemberId, toMemberId, amount, note = "") => {
    setState((s) => ({
      ...s,
      settlements: [
        { id: uid(), fromMemberId, toMemberId, amount: Number(amount), date: new Date().toISOString(), note },
        ...s.settlements,
      ],
    }));
  }, []);

  const value = {
    state,
    allCategories,
    activeMembers,
    setHouseholdName,
    addMember,
    removeMember,
    reactivateMember,
    addCategory,
    addExpense,
    updateExpense,
    deleteExpense,
    toggleExpenseStatus,
    addSettlement,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp, AppProvider içinde kullanılmalı.");
  return ctx;
}
