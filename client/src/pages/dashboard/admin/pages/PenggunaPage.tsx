import { useEffect, useMemo, useState } from "react";
import { Search, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminSection } from "../components/AdminSection";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type UserRole = "admin" | "creator";
type UserStatus = "aktif" | "nonaktif";

type UserData = {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  updated_at: string;
};

type UsersResponse = {
  success: boolean;
  message: string;
  data?: UserData[];
};

export function PenggunaPage() {
  const navigate = useNavigate();

  const [users, setUsers] = useState<UserData[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getUsers = async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/users`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as UsersResponse;

      if (response.status === 401) {
        localStorage.removeItem("kreasihub_token");
        localStorage.removeItem("kreasihub_user");

        navigate("/login", { replace: true });
        return;
      }

      if (response.status === 403) {
        setError("Kamu tidak memiliki akses untuk melihat data pengguna.");
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setError(result.message || "Data pengguna gagal diambil.");
        return;
      }

      setUsers(result.data);
    } catch (requestError) {
      console.error("Get users request error:", requestError);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void getUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return users;
    }

    return users.filter((user) => {
      return (
        user.name.toLowerCase().includes(keyword) ||
        user.email.toLowerCase().includes(keyword) ||
        user.role.toLowerCase().includes(keyword) ||
        user.status.toLowerCase().includes(keyword)
      );
    });
  }, [search, users]);

  return (
    <AdminSection
      title="Manajemen Pengguna"
      description="Kelola akun admin dan kreator yang terdaftar."
    >
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Cari nama, email, role, atau status..."
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400"
          />
        </div>

        <button
          type="button"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <UserPlus size={17} />
          Tambah Pengguna
        </button>
      </div>

      {error && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
          <p className="text-sm font-medium text-rose-600">{error}</p>

          <button
            type="button"
            onClick={() => void getUsers()}
            className="text-sm font-semibold text-rose-700 hover:underline"
          >
            Coba Lagi
          </button>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-52 items-center justify-center">
          <p className="text-sm font-medium text-gray-400">
            Memuat data pengguna...
          </p>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700">
                {filteredUsers.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-gray-700">
                {users.length}
              </span>{" "}
              pengguna
            </p>

            <button
              type="button"
              onClick={() => void getUsers()}
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Muat Ulang
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 text-left">
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">
                    Nama
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">
                    Email
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">
                    Role
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">
                    Status
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">
                    Tanggal Daftar
                  </th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-400">
                    Aksi
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-gray-50 transition-colors hover:bg-gray-50/60"
                  >
                    <td className="px-4 py-4">
                      <div>
                        <p className="text-sm font-semibold text-gray-800">
                          {user.name}
                        </p>
                        <p className="mt-0.5 text-xs text-gray-400">
                          ID: {user.id}
                        </p>
                      </div>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-500">
                      {user.email}
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          user.role === "admin"
                            ? "bg-violet-50 text-violet-600"
                            : "bg-blue-50 text-blue-600"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          user.status === "aktif"
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    <td className="px-4 py-4 text-sm text-gray-500">
                      {new Intl.DateTimeFormat("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(user.created_at))}
                    </td>

                    <td className="px-4 py-4">
                      <button
                        type="button"
                        className="text-sm font-semibold text-blue-600 hover:underline"
                      >
                        Detail
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center">
                      <p className="text-sm font-medium text-gray-500">
                        {search
                          ? "Pengguna yang dicari tidak ditemukan."
                          : "Belum ada data pengguna."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </AdminSection>
  );
}
