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
  return [...EXPENSE_CATEGORIES, ...INCOME_CATEGOR
