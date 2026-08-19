import { useState } from "react";
import { useApp } from "./context/AppContext";
import HouseholdSetup from "./components/Household/HouseholdSetup";
import AppShell from "./components/Layout/AppShell";
import Dashboard from "./components/Dashboard/Dashboard";
import ExpensesPage from "./components/ExpenseTable/ExpensesPage";
import SettlementsPage from "./components/Settlements/SettlementsPage";
import HouseholdPage from "./components/Household/HouseholdPage";
import ExpenseFormModal from "./components/ExpenseForm/ExpenseFormModal";
import { presetToRange } from "./components/UI/DateRangeFilter";

export default function App() {
  const { state } = useApp();
  const [tab, setTab] = useState("dashboard");
  const [dateFilter, setDateFilter] = useState({ preset: "month", ...presetToRange("month") });
  const [formOpen, setFormOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const isOnboarded = !!state.household.name && state.members.length > 0;

  if (!isOnboarded) {
    return <HouseholdSetup />;
  }

  const openAdd = () => {
    setEditingExpense(null);
    setFormOpen(true);
  };
  const openEdit = (expense) => {
    setEditingExpense(expense);
    setFormOpen(true);
  };

  return (
    <AppShell active={tab} onNavigate={setTab} onAddExpense={openAdd}>
      {tab === "dashboard" && <Dashboard dateFilter={dateFilter} onDateFilterChange={setDateFilter} />}
      {tab === "expenses" && (
        <ExpensesPage dateFilter={dateFilter} onDateFilterChange={setDateFilter} onEdit={openEdit} onAdd={openAdd} />
      )}
      {tab === "settlements" && <SettlementsPage />}
      {tab === "household" && <HouseholdPage />}

      <ExpenseFormModal open={formOpen} onClose={() => setFormOpen(false)} editingExpense={editingExpense} />
    </AppShell>
  );
}
