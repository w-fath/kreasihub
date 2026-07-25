import { useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Tag,
  Trash2,
  X,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminSection } from "../components/AdminSection";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Category = {
  id: number;
  name: string;
  slug: string;
  total: number;
  created_at: string;
  updated_at: string;
};

type CategoriesResponse = {
  success: boolean;
  message: string;
  data?: Category[];
};

type CategoryResponse = {
  success: boolean;
  message: string;
  data?: Category;
};

export function KategoriPage() {
  const navigate = useNavigate();

  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUnauthorized = () => {
    localStorage.removeItem("kreasihub_token");
    localStorage.removeItem("kreasihub_user");

    navigate("/login", { replace: true });
  };

  const getCategories = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/categories`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = (await response.json()) as CategoriesResponse;

      if (!response.ok || !result.success || !result.data) {
        setError(result.message || "Data kategori gagal diambil.");
        return;
      }

      setCategories(result.data);
    } catch (requestError) {
      console.error("Get categories error:", requestError);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void getCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword) {
      return categories;
    }

    return categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(keyword) ||
        category.slug.toLowerCase().includes(keyword)
      );
    });
  }, [categories, search]);

  const openCreateModal = () => {
    setSelectedCategory(null);
    setCategoryName("");
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setCategoryName(category.name);
    setError(null);
    setSuccess(null);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) {
      return;
    }

    setModalOpen(false);
    setSelectedCategory(null);
    setCategoryName("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const name = categoryName.trim();
    const token = localStorage.getItem("kreasihub_token");

    setError(null);
    setSuccess(null);

    if (!token) {
      handleUnauthorized();
      return;
    }

    if (!name) {
      setError("Nama kategori wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      const endpoint = selectedCategory
        ? `${API_URL}/api/categories/${selectedCategory.id}`
        : `${API_URL}/api/categories`;

      const response = await fetch(endpoint, {
        method: selectedCategory ? "PUT" : "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      const result = (await response.json()) as CategoryResponse;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError("Kamu tidak memiliki akses untuk mengelola kategori.");
        return;
      }

      if (!response.ok || !result.success) {
        setError(result.message || "Kategori gagal disimpan.");
        return;
      }

      setSuccess(result.message);
      setModalOpen(false);
      setSelectedCategory(null);
      setCategoryName("");

      await getCategories();
    } catch (requestError) {
      console.error("Save category error:", requestError);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (category: Category) => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus kategori "${category.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(category.id);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_URL}/api/categories/${category.id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as CategoryResponse;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError("Kamu tidak memiliki akses untuk menghapus kategori.");
        return;
      }

      if (!response.ok || !result.success) {
        setError(result.message || "Kategori gagal dihapus.");
        return;
      }

      setSuccess(result.message);
      await getCategories();
    } catch (requestError) {
      console.error("Delete category error:", requestError);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminSection
      title="Kategori Karya"
      description="Kelola kategori yang digunakan pada portofolio kreator."
    >
      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
          <p className="text-sm font-medium text-rose-600">{error}</p>

          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-500 hover:text-rose-700"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-600">{success}</p>

          <button
            type="button"
            onClick={() => setSuccess(null)}
            className="text-emerald-500 hover:text-emerald-700"
          >
            <X size={17} />
          </button>
        </div>
      )}

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
            placeholder="Cari kategori..."
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400"
          />
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={17} />
          Tambah Kategori
        </button>
      </div>

      {loading ? (
        <div className="flex min-h-64 items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
            <LoaderCircle size={20} className="animate-spin" />
            Memuat kategori...
          </div>
        </div>
      ) : (
        <>
          <div className="mb-4">
            <p className="text-sm text-gray-500">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700">
                {filteredCategories.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-gray-700">
                {categories.length}
              </span>{" "}
              kategori
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredCategories.map((category) => (
              <div
                key={category.id}
                className="flex items-center gap-4 rounded-xl border border-gray-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/30"
              >
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-500">
                  <Tag size={20} />
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-semibold text-gray-800">
                    {category.name}
                  </h3>

                  <p className="truncate text-xs text-gray-400">
                    {category.slug}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {category.total} karya
                  </p>
                </div>

                <div className="flex flex-shrink-0 items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEditModal(category)}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-blue-600 transition hover:bg-blue-100"
                    aria-label={`Edit kategori ${category.name}`}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDelete(category)}
                    disabled={deletingId === category.id}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-rose-500 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label={`Hapus kategori ${category.name}`}
                  >
                    {deletingId === category.id ? (
                      <LoaderCircle size={16} className="animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCategories.length === 0 && (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
              <Tag size={30} className="text-gray-300" />

              <h3 className="mt-4 font-semibold text-gray-600">
                Kategori tidak ditemukan
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Tambahkan kategori baru atau gunakan kata pencarian lainnya.
              </p>
            </div>
          )}
        </>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  {selectedCategory ? "Edit Kategori" : "Tambah Kategori"}
                </h2>

                <p className="mt-1 text-sm text-gray-400">
                  {selectedCategory
                    ? "Perbarui nama kategori karya."
                    : "Masukkan nama kategori karya baru."}
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="category-name"
                  className="mb-2 block text-sm font-semibold text-gray-700"
                >
                  Nama Kategori
                </label>

                <input
                  id="category-name"
                  type="text"
                  value={categoryName}
                  onChange={(event) => setCategoryName(event.target.value)}
                  placeholder="Contoh: Web Design"
                  maxLength={100}
                  autoFocus
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
                />

                <div className="mt-1 flex justify-end">
                  <p className="text-xs text-gray-400">
                    {categoryName.length}/100
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
                >
                  {saving && (
                    <LoaderCircle size={16} className="animate-spin" />
                  )}

                  {saving
                    ? "Menyimpan..."
                    : selectedCategory
                      ? "Simpan Perubahan"
                      : "Tambah Kategori"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminSection>
  );
}
