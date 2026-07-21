import { Icon } from "./Icon";

const MENU = [
  { id: "dashboard", label: "Dashboard", icon: Icon.Dashboard },
  { id: "transactions", label: "Transaksi", icon: Icon.Transactions },
  { id: "budget", label: "Anggaran", icon: Icon.Budget },
  { id: "reports", label: "Laporan", icon: Icon.Reports },
  { id: "settings", label: "Pengaturan", icon: Icon.Settings },
];

export default function Sidebar({ active, onNavigate, user, onLogout }) {
  const initials = (user.displayName || user.email || "?").slice(0, 1).toUpperCase();
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-mark">K</div>
        <div className="sidebar-brand-text">Buku Kas</div>
      </div>
      <nav className="sidebar-nav">
        {MENU.map((m) => {
          const IconComp = m.icon;
          return (
            <button
              key={m.id}
              className={`nav-item ${active === m.id ? "active" : ""}`}
              onClick={() => onNavigate(m.id)}
            >
              <IconComp />
              {m.label}
            </button>
          );
        })}
      </nav>
      <div className="sidebar-footer">
        <div className="user-chip">
          {user.photoURL ? (
            <img src={user.photoURL} alt="" className="user-avatar" referrerPolicy="no-referrer" />
          ) : (
            <div className="user-avatar-fallback">{initials}</div>
          )}
          <div style={{ minWidth: 0 }}>
            <div className="user-name">{user.displayName || "Pengguna"}</div>
            <div className="user-email">{user.email}</div>
          </div>
        </div>
        <button className="logout-btn" onClick={onLogout}>
          Keluar
        </button>
      </div>
    </aside>
  );
                                     }
          
