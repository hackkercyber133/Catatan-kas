export const EXPENSE_CATEGORIES = [
  { id: "makan", label: "Makan & Minum", color: "#C1443A" },
  { id: "transport", label: "Transportasi", color: "#C07C2E" },
  { id: "belanja", label: "Belanja", color: "#7A5CB0" },
  { id: "tagihan", label: "Tagihan", color: "#2E6F9E" },
  { id: "hiburan", label: "Hiburan", color: "#B0862E" },
  { id: "kesehatan", label: "Kesehatan", color: "#3E9E8A" },
  { id: "pendidikan", label: "Pendidikan", color: "#5B7FBF" },
  { id: "lainnya", label: "Lainnya", color: "#75705E" },
];

export const INCOME_CATEGORIES = [
  { id: "gaji", label: "Gaji", color: "#2F8F5B" },
  { id: "bonus", label: "Bonus", color: "#3FA36B" },
  { id: "usaha", label: "Usaha", color: "#4FAE7E" },
  { id: "investasi", label: "Investasi", color: "#2E9E8F" },
  { id: "hadiah", label: "Hadiah", color: "#5CB088" },
  { id: "lainnya-in", label: "Lainnya", color: "#75705E" },
];

export function allCategories() {
  return [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES];
}

export function catInfo(id) {
  return allCategories().find((c) => c.id === id) || { id, label: id, color: "#75705E" };
}

export function formatRupiah(n) {
  const v = Number(n || 0);
  const sign = v < 0 ? "-" : "";
  return sign + "Rp " + Math.abs(v).toLocaleString("id-ID");
}

export function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function monthLabel(ym) {
  const [y, m] = ym.split("-");
  return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("id-ID", {
    month: "short",
    year: "2-digit",
  });
}

export function last6Months() {
  const arr = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    arr.push(d.toISOString().slice(0, 7));
  }
  return arr;
}
