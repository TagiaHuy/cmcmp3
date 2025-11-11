import { useAuth } from "../context/AuthContext";

export default function useIsAdmin() {
  const { user } = useAuth();

  if (!user) return false;

  // ✅ Tạm cho phép admin theo email
  if (user.email === "admin@gmail.com") return true;

  const raw = (user.roles ?? user.authorities ?? [])
    .map(r => typeof r === "string" ? r : r?.name || r?.role || r?.authority || "");

  return raw.some(v => String(v).toUpperCase().includes("ADMIN"));
}
