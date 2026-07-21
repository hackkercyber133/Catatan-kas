import { useMemo } from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import { EXPENSE_CATEGORIES, catInfo, formatRupiah, last6Months, monthLabel } from "../lib/categories";
import { Icon } from "./Icon";

export default function ReportsView({ transactions }) {
  const trendData = useMemo(() => {
    const months = last6Months();
    let runningBalance = 0;
    const priorMonths = transactions.filter((t) => !months.includes((t.date || "").slice(0, 7)) && (t.date || "").slice(0, 7) < months[0]);
    runningBalance = priorMonths.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0);

    return months.map((m) => {
      const txs = transactions.filter((t) => (t.date || "").slice(0, 7) === m);
      const income = txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0);
      const expense = txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0);
      runningBalance += income - expense;
      return { month: monthLabel(m), Saldo: runningBalance };
    });
  }, [transactions]);

  const categoryTotals = useMemo(() => {
    const map = {};
    for (const t of transactions) {
      if (t.type !== "expense") continue;
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
    return EXPENSE_CATEGORIES.map((c) => ({ ...c, total: map[c.id] || 0 })).sort((a, b) => b.total - a.total);
  }, [transactions]);

  const maxCat = Math.max(1, ...categoryTotals.map((c) => c.total));

  function exportCSV() {
    const header = ["Tanggal", "Jenis", "Kategori", "Jumlah", "Catatan", "Dicatat Oleh"];
    const rows = transactions
      .slice()
      .sort((a, b) => (a.date || "").localeCompare(b.date || ""))
      .map((t) => [
        t.date,
        t.type === "income" ? "Pemasukan" : "Pengeluaran",
        catInfo(t.category).label,
        t.amount,
        (t.note || "").replace(/,/g, ";"),
        t.userName || "",
      ]);
    const csv = [header, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `laporan-keuangan-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-eyebrow">Analisis</div>
          <h1 className="page-title">Laporan</h1>
          <div className="page-sub">Lihat tren saldo dan unduh seluruh riwayat transaksi.</div>
        </div>
        <button className="btn btn-outline" onClick={exportCSV}>
          <Icon.Download /> Ekspor CSV
        </button>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Tren Saldo 6 Bulan Terakhir</div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E4E0D3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9B9784" }} axisLine={{ stroke: "#E4E0D3" }} tickLine={false} />
            <YAxis tick={{ fontSize: 10, fill: "#9B9784" }} axisLine={false} tickLine={false} width={40} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
            <Tooltip formatter={(v) => formatRupiah(v)} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E4E0D3" }} />
            <Line type="monotone" dataKey="Saldo" stroke="#26543E" strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card">
        <div className="card-title">Total Pengeluaran per Kategori (Sepanjang Waktu)</div>
        {categoryTotals.map((c) => (
          <div key={c.id} style={{ marginBottom: 12 }}>
            <div className="legend-row" style={{ justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span className="legend-dot" style={{ background: c.color }} />
                {c.label}
              </span>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--ink)" }}>{formatRupiah(c.total)}</span>
            </div>
            <div className="budget-track">
              <div className="budget-fill" style={{ width: `${(c.total / maxCat) * 100}%`, background: c.color }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
