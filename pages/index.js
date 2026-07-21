import { useState, useEffect, useMemo } from "react";
import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { auth, db, googleProvider } from "../lib/firebase";
import Sidebar from "../components/Sidebar";
import DashboardView from "../components/DashboardView";
import TransactionsView from "../components/TransactionsView";
import BudgetView from "../components/BudgetView";
import ReportsView from "../components/ReportsView";
import SettingsView from "../components/SettingsView";
import AddTransactionModal from "../components/AddTransactionModal";

export default function Home() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [view, setView] = useState("dashboard");
  const [showAdd, setShowAdd] = useState(false);
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "transactions"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setTransactions(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "budgets"), (snap) => {
      const map = {};
      snap.docs.forEach((d) => {
        map[d.id] = d.data().limit;
      });
      setBudgets(map);
    });
    return () => unsub();
  }, [user]);

  const contributors = useMemo(() => Array.from(new Set(transactions.map((t) => t.userName).filter(Boolean))), [transactions]);

  async function handleLogin() {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (e) {
      setLoginError("Gagal masuk dengan Google. Coba lagi.");
    }
  }

  async function handleLogout() {
    await signOut(auth);
  }

  if (authLoading) {
    return <div className="loading-screen">membuka buku kas…</div>;
  }

  if (!user) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <div className="login-eyebrow">Buku Kas Bersama</div>
          <h1 className="login-title">Kelola keuangan bersama, secara real-time.</h1>
          <p className="login-sub">
            Masuk dengan akun Google untuk mencatat pemasukan &amp; pengeluaran, mengatur
            anggaran, dan melihat laporan bersama tim atau keluarga Anda.
          </p>
          <button className="google-btn" onClick={handleLogin}>
            Masuk dengan Google
          </button>
          {loginError && <div className="error-text">{loginError}</div>}
          <div className="login-feature-list">
            <div className="login-feature">
              <span className="login-feature-dot" /> Dashboard dengan grafik tren & kategori
            </div>
            <div className="login-feature">
              <span className="login-feature-dot" /> Anggaran per kategori dengan peringatan batas
            </div>
            <div className="login-feature">
              <span className="login-feature-dot" /> Laporan &amp; ekspor CSV
            </div>
            <div className="login-feature">
              <span className="login-feature-dot" /> Sinkron real-time untuk banyak pengguna
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <Sidebar active={view} onNavigate={setView} user={user} onLogout={handleLogout} />
      <main className="main">
        {view === "dashboard" && <DashboardView transactions={transactions} userName={user.displayName || user.email} />}
        {view === "transactions" && <TransactionsView transactions={transactions} onAddClick={() => setShowAdd(true)} />}
        {view === "budget" && <BudgetView transactions={transactions} budgets={budgets} />}
        {view === "reports" && <ReportsView transactions={transactions} />}
        {view === "settings" && (
          <SettingsView user={user} onLogout={handleLogout} contributorsCount={contributors.length || 1} txCount={transactions.length} />
        )}
      </main>

      {view !== "transactions" && (
        <button
          className="btn btn-primary"
          onClick={() => setShowAdd(true)}
          style={{ position: "fixed", bottom: 24, right: 24, borderRadius: 999, padding: "13px 22px", boxShadow: "0 8px 20px rgba(28,29,34,0.18)" }}
        >
          + Tambah Transaksi
        </button>
      )}

      {showAdd && <AddTransactionModal user={user} onClose={() => setShowAdd(false)} />}
    </div>
  );
}
