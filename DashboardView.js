import { useMemo } from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { EXPENSE_CATEGORIES, catInfo, formatRupiah, formatDate, last6Months, monthLabel } from "../lib/categories";

export default function DashboardView({ transactions, userName }) {
  const now = new Date();
  const ym = now.toISOString().slice(0, 7);

  const monthTx = useMemo(() => transactions.filter((t) => (t.date || "").slice(0, 7) === ym), [transactions, ym]);
  const incomeMonth = useMemo(() => monthTx.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0), [monthTx]);
  const expenseMonth = useMemo(() => monthTx.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0), [monthTx]);

  const balance = useMemo(
    () => transactions.reduce((s, t) => s + (t.type === "income" ? t.amount : -t.amount), 0),
    [transactions]
  );

  const pieData = useMemo(() => {
    const map = {};
    for (const t of monthTx) {
      if (t.type !== "expense") continue;
      map[t.category] = (map[t.category] || 0) + t.amount;
    }
    return Object.entries(map).map(([id, value]) => ({ id, value, ...catInfo(id) }));
  }, [monthTx]);

  const trendData = useMemo(() => {
    const months = last6Months();
    return months.map((m) => {
      const txs = transactions.filter((t) => (t.date || "").slice(0, 7) === m);
      return {
        month: monthLabel(m),
        Pemasukan: txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amount, 0),
        Pengeluaran: txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0),
      };
    });
  }, [transactions]);

  const recent = useMemo(
    () => [...transactions].sort((a, b) => (b.date || "").localeCompare(a.date || "")).slice(0, 6),
    [transactions]
  );

  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-eyebrow">Ringkasan</div>
          <h1 className="page-title">Dashboard</h1>
          <div className="page-sub">Halo {userName}, ini kondisi keuangan bersama bulan ini.</div>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="stat-label">Saldo Keseluruhan</div>
          <div className="stat-value">{formatRupiah(balance)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pemasukan Bulan Ini</div>
          <div className="stat-value income">{formatRupiah(incomeMonth)}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pengeluaran Bulan Ini</div>
          <div className="stat-value expense">{formatRupiah(expenseMonth)}</div>
        </div>
      </div>

      <div className="two-col">
        <div className="card">
          <div className="card-title">Tren 6 Bulan Terakhir</div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E4E0D3" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9B9784" }} axisLine={{ stroke: "#E4E0D3" }} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: "#9B9784" }} axisLine={false} tickLine={false} width={36} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
              <Tooltip formatter={(v) => formatRupiah(v)} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E4E0D3" }} />
              <Bar dataKey="Pemasukan" fill="#2F8F5B" radius={[3, 3, 0, 0]} />
              <Bar dataKey="Pengeluaran" fill="#B23B32" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div className="card-title">Pengeluaran per Kategori (Bulan Ini)</div>
          {pieData.length === 0 ? (
            <div className="empty-state" style={{ padding: "30px 10px" }}>
              <div className="empty-mark">—</div>
              Belum ada pengeluaran bulan ini.
            </div>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="label" innerRadius={45} outerRadius={72} paddingAngle={2}>
                    {pieData.map((d, i) => (
                      <Cell key={i} fill={d.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v) => formatRupiah(v)} contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E4E0D3" }} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ marginTop: 10 }}>
                {pieData.map((d) => (
                  <div key={d.id} className="legend-row">
                    <span className="legend-dot" style={{ background: d.color }} />
                    {d.label} · {formatRupiah(d.value)}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card">
        <div className="card-title">Transaksi Terbaru</div>
        {recent.length === 0 ? (
          <div className="empty-state">
            <div className="empty-mark">—</div>
            Belum ada transaksi. Tambahkan lewat halaman Transaksi.
          </div>
        ) : (
          recent.map((t) => {
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
                    {formatDate(t.date)} · {c.label} · {t.userName}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
