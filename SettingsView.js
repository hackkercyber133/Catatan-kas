export default function SettingsView({ user, onLogout, contributorsCount, txCount }) {
  return (
    <div>
      <div className="topbar">
        <div>
          <div className="page-eyebrow">Akun</div>
          <h1 className="page-title">Pengaturan</h1>
          <div className="page-sub">Kelola profil dan lihat info penggunaan buku kas bersama.</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="card-title">Profil</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          {user.photoURL ? (
            <img src={user.photoURL} alt="" style={{ width: 56, height: 56, borderRadius: "50%" }} referrerPolicy="no-referrer" />
          ) : (
            <div className="user-avatar-fallback" style={{ width: 56, height: 56, fontSize: 20 }}>
              {(user.displayName || user.email || "?").slice(0, 1).toUpperCase()}
            </div>
          )}
          <div>
            <div style={{ fontSize: 15, fontWeight: 600 }}>{user.displayName || "Pengguna"}</div>
            <div style={{ fontSize: 13, color: "var(--muted)" }}>{user.email}</div>
          </div>
        </div>
      </div>

      <div className="stat-grid" style={{ marginBottom: 16 }}>
        <div className="stat-card">
          <div className="stat-label">Total Transaksi Bersama</div>
          <div className="stat-value">{txCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Pencatat Aktif</div>
          <div className="stat-value">{contributorsCount}</div>
        </div>
      </div>

      <div className="card">
        <div className="card-title">Sesi</div>
        <p style={{ fontSize: 13, color: "var(--ink-soft)", marginTop: 0, marginBottom: 16 }}>
          Buku kas ini dibagikan ke semua orang yang masuk dengan akun Google melalui tautan
          aplikasi ini. Keluar untuk mengganti akun.
        </p>
        <button className="btn btn-outline" onClick={onLogout}>
          Keluar dari Akun
        </button>
      </div>
    </div>
  );
}
