import { useState, useMemo } from "react";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, catInfo, formatRupiah, formatDate } from "../lib/categories";
import { Icon } from "./Icon";

export default function TransactionsView({ transactions, onAddClick }) {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("semua");
  const [catFilter, setCatFilter] = useState("semua");

  const cats = typeFilter === "income" ? INCOME_CATEGORIES : typeFilter === "expense" ? EXPENSE_CATEGORIES : [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];

  const filtered = useMemo(() => {
    return transactions
      .filter((t) => (typeFilter === "semua" ? true : t.type === typeFilter))
      .filter((t) => (catFilter === "semua" ? true : t.category === catFilter))
      .filter((t) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (t.note || "").toLowerCase().includes(q) || catInfo(t.category).label.toLowerCase().includes(q) || (t.userName || "").toLowerCase().includes(q);
      })
      .sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  }, [transactions, search, typeFilter, catFilter]);

  async function handleDelete(id) {
    try {
      await deleteDoc(doc(db, "transactions", id));
    } catch (e) {}
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-eyebrow">Semua Catatan</div>
          <h1 className="page-title">Transaksi</h1>
          <div className="page-sub">{filtered.length} dari {transactions.length} transaksi ditampilkan</div>
        </div>
        <button className="btn btn-primary" onClick={onAddClick}>
          <Icon.Plus /> Tambah Transaksi
        </button>
      </div>

      <div className="card">
        <div className="tx-toolbar">
          <input
            className="field-input"
            placeholder="Cari catatan, kategori, atau nama…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: 200 }}
          />
          <select
            className="field-select"
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setCatFilter("semua");
            }}
          >
            <option value="semua">Semua Jenis</option>
            <option value="expense">Pengeluaran</option>
            <option value="income">Pemasukan</option>
          </select>
          <select className="field-select" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
            <option value="semua">Semua Kategori</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-mark">—</div>
            Tidak ada transaksi yang cocok. Coba ubah pencarian atau filter.
          </div>
        ) : (
          filtered.map((t) => {
            const c = catInfo(t.category);
            return (
              <div key={t.id} className="tx-row">
                <div className="tx-icon" style={{ background: c.color + "1A", color: c.color }}>
                  {c.label.slice(0, 1)}
                </div>
                <div className="tx-main">
                  <div className="tx-top">
                    <span className="tx-note">{t.note || c.label}</span>
                    <span className={`tx-amount ${t.type}`}>
                      {t.type === "income" ? "+" : "-"}
                      {formatRupiah(t.amount)}
                    </span>
                  </div>
                  <div className="tx-meta">
                    {formatDate(t.date)} · {c.label} · dicatat oleh {t.userName}
                  </div>
                </div>
                <button className="tx-delete" onClick={() => handleDelete(t.id)} title="Hapus">
                  ×
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
              }
