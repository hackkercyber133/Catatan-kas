import { useState, useMemo } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { EXPENSE_CATEGORIES, formatRupiah } from "../lib/categories";

export default function BudgetView({ transactions, budgets }) {
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState("");
  const [saving, setSaving] = useState(false);

  const ym = new Date().toISOString().slice(0, 7);
  const monthExpense = useMemo(() => transactions.filter((t) => t.type === "expense" && (t.date || "").slice(0, 7) === ym), [transactions, ym]);

  const spentByCategory = useMemo(() => {
    const map = {};
    for (const t of monthExpense) map[t.category] = (map[t.category] || 0) + t.amount;
    return map;
  }, [monthExpense]);

  function startEdit(id) {
    setEditingId(id);
    setDraft(budgets[id] ? String(budgets[id]) : "");
  }

  async function saveBudget(id) {
    setSaving(true);
    try {
      await setDoc(doc(db, "budgets", id), { category: id, limit: Number(draft) || 0 });
    } catch (e) {}
    setSaving(false);
    setEditingId(null);
  }

  const totalBudget = useMemo(() => Object.values(budgets).reduce((s, v) => s + (v || 0), 0), [budgets]);
  const totalSpent = useMemo(() => Object.values(spentByCategory).reduce((s, v) => s + v, 0), [spentByCategory]);

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-eyebrow">Kelola Batas Pengeluaran</div>
          <h1 className="page-title">Anggaran</h1>
          <div className="page-sub">Tetapkan batas bulanan per kategori dan pantau progresnya.</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Total Anggaran Bulan Ini</div>
          <div className="stat-value">{formatRupiah(totalBudget)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Total Terpakai</div>
          <div className="stat-value expense">{formatRupiah(totalSpent)}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Anggaran per Kategori</div>
        {EXPENSE_CATEGORIES.map((c) => {
          const limit = budgets[c.id] || 0;
          const spent = spentByCategory[c.id] || 0;
          const pct = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;
          const over = limit > 0 && spent > limit;
          return (
            <div key={c.id} className="budget-row">
              <div className="budget-head">
                <span className="budget-cat">{c.label}</span>
                <span className="budget-figures">
                  <strong style={{ color: over ? "var(--expense)" : "var(--ink)" }}>{formatRupiah(spent)}</strong>
                  {" "}/ {limit > 0 ? formatRupiah(limit) : "belum diatur"}
                </span>
              </div>
              <div className="budget-track">
                <div
                  className="budget-fill"
                  style={{ width: `${pct}%`, background: over ? "var(--expense)" : c.color }}
                />
              </div>
              {editingId === c.id ? (
                <div className="budget-edit">
                  <input
                    className="field-input"
                    type="number"
                    placeholder="Contoh: 500000"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    autoFocus
                  />
                  <button className="btn btn-primary btn-sm" disabled={saving} onClick={() => saveBudget(c.id)}>
                    Simpan
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => setEditingId(null)}>
                    Batal
                  </button>
                </div>
              ) : (
                <button className="btn btn-outline btn-sm" style={{ marginTop: 8 }} onClick={() => startEdit(c.id)}>
                  {limit > 0 ? "Ubah anggaran" : "Atur anggaran"}
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
