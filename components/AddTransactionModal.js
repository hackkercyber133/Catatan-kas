import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../lib/firebase";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, todayISO } from "../lib/categories";

export default function AddTransactionModal({ user, onClose }) {
  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(EXPENSE_CATEGORIES[0].id);
  const [note, setNote] = useState("");
  const [date, setDate] = useState(todayISO());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const cats = type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  function switchType(t) {
    setType(t);
    setCategory(t === "expense" ? EXPENSE_CATEGORIES[0].id : INCOME_CATEGORIES[0].id);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const num = Number(amount);
    if (!num || num <= 0) {
      setError("Masukkan jumlah yang valid.");
      return;
    }
    setSaving(true);
    try {
      await addDoc(collection(db, "transactions"), {
        type,
        amount: num,
        category,
        note: note.trim(),
        date,
        userId: user.uid,
        userName: user.displayName || user.email,
        createdAt: serverTimestamp(),
      });
      onClose();
    } catch (err) {
      setError("Gagal menyimpan. Coba lagi.");
    }
    setSaving(false);
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        <div className="modal-head">
          <div className="card-title" style={{ marginBottom: 0 }}>
            Tambah Transaksi
          </div>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="field-label" style={{ marginTop: 18 }}>
          JENIS
        </div>
        <div className="type-toggle">
          <button
            type="button"
            className={type === "expense" ? "active expense" : ""}
            onClick={() => switchType("expense")}
          >
            Pengeluaran
          </button>
          <button
            type="button"
            className={type === "income" ? "active income" : ""}
            onClick={() => switchType("income")}
          >
            Pemasukan
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label className="field-label">JUMLAH (RP)</label>
          <input
            className="field-input"
            type="number"
            inputMode="numeric"
            placeholder="50000"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />

          <label className="field-label">KATEGORI</label>
          <div className="chip-grid">
            {cats.map((c) => (
              <button
                type="button"
                key={c.id}
                onClick={() => setCategory(c.id)}
                className="chip"
                style={{
                  borderColor: category === c.id ? c.color : "var(--border)",
                  background: category === c.id ? c.color + "1A" : "transparent",
                  color: category === c.id ? c.color : "var(--ink-soft)",
                }}
              >
                {c.label}
              </button>
            ))}
          </div>

          <label className="field-label">TANGGAL</label>
          <input className="field-input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <label className="field-label">CATATAN (OPSIONAL)</label>
          <input
            className="field-input"
            placeholder="misal: makan siang tim"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />

          {error && <div className="error-text">{error}</div>}

          <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: "100%", marginTop: 20, justifyContent: "center" }}>
            {saving ? "Menyimpan…" : "Simpan Transaksi"}
          </button>
        </form>
      </div>
    </div>
  );
}
