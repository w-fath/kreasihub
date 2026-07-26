import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  FolderOpen,
  Heart,
  LoaderCircle,
  Plus,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CreatorSection } from "../components/CreatorSection";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type WorkStatus = "pending" | "approved" | "rejected";

type Work = {
  id: number;
  user_id: number;
  category_id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  thumbnail_url: string;
  project_url: string | null;
  status: WorkStatus;
  rejection_note: string | null;
  views_count: number;
  likes_count: number;
  category_name: string;
  category_slug: string;
  created_at: string;
  updated_at: string;
};

type WorksResponse = {
  success: boolean;
  message: string;
  data?: Work[];
};

function StatusBadge({ status }: { status: WorkStatus }) {
  const statusData = {
    pending: {
      label: "Menunggu Review",
      icon: Clock,
      className: "bg-amber-50 text-amber-600",
    },
    approved: {
      label: "Dipublikasikan",
      icon: CheckCircle,
      className: "bg-emerald-50 text-emerald-600",
    },
    rejected: {
      label: "Ditolak",
      icon: XCircle,
      className: "bg-rose-50 text-rose-600",
    },
  };

  const selectedStatus = statusData[status];
  const Icon = selectedStatus.icon;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${selectedStatus.className}`}
    >
      <Icon size={13} />
      {selectedStatus.label}
    </span>
  );
}

export function KaryaSayaPage() {
  const navigate = useNavigate();

  const [works, setWorks] = useState<Work[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("semua");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUnauthorized = () => {
    localStorage.removeItem("kreasihub_token");
    localStorage.removeItem("kreasihub_user");

    navigate("/login", { replace: true });
  };

  const getWorks = async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/creator/works`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as WorksResponse;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError("Kamu tidak memiliki akses untuk melihat data karya.");
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setWorks([]);
        setError(result.message || "Data karya gagal diambil.");
        return;
      }

      setWorks(result.data);
    } catch (requestError) {
      console.error("Get creator works error:", requestError);

      setWorks([]);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void getWorks();
  }, []);

  const filteredWorks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return works.filter((work) => {
      const matchesSearch =
        !keyword ||
        work.title.toLowerCase().includes(keyword) ||
        work.description.toLowerCase().includes(keyword) ||
        work.category_name.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "semua" || work.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, works]);

  return (
    <CreatorSection
      title="Karya Saya"
      description="Kelola seluruh karya dan portofolio yang telah kamu tambahkan."
    >
      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
          <p className="text-sm font-medium text-rose-600">{error}</p>

          <button
            type="button"
            onClick={() => void getWorks()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:underline"
          >
            <RefreshCw size={15} />
            Coba Lagi
          </button>
        </div>
      )}

      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div className="flex w-full flex-col gap-3 sm:flex-row lg:max-w-2xl">
          <div className="relative w-full">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari judul, deskripsi, atau kategori..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          >
            <option value="semua">Semua Status</option>
            <option value="pending">Menunggu Review</option>
            <option value="approved">Dipublikasikan</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        <Link
          to="/dashboard/creator/karya/tambah"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={17} />
          Tambah Karya
        </Link>
      </div>

      {loading ? (
        <div className="flex min-h-72 items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
            <LoaderCircle size={21} className="animate-spin" />
            Memuat data karya...
          </div>
        </div>
      ) : works.length === 0 ? (
        <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
            <FolderOpen size={28} />
          </div>

          <h3 className="mt-4 text-lg font-semibold text-gray-700">
            Belum ada karya
          </h3>

          <p className="mt-1 max-w-md text-sm leading-6 text-gray-400">
            Karya yang sudah ditambahkan akan muncul di halaman ini beserta
            status review dan publikasinya.
          </p>

          <Link
            to="/dashboard/creator/karya/tambah"
            className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={17} />
            Tambahkan Karya Pertama
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-5 flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Menampilkan{" "}
              <span className="font-semibold text-gray-700">
                {filteredWorks.length}
              </span>{" "}
              dari{" "}
              <span className="font-semibold text-gray-700">
                {works.length}
              </span>{" "}
              karya
            </p>

            <button
              type="button"
              onClick={() => void getWorks()}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:underline"
            >
              <RefreshCw size={15} />
              Muat Ulang
            </button>
          </div>

          {filteredWorks.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredWorks.map((work) => (
                <article
                  key={work.id}
                  className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img
                      src={work.thumbnail_url}
                      alt={work.title}
                      className="h-full w-full object-cover transition duration-300 hover:scale-105"
                    />

                    <div className="absolute left-3 top-3">
                      <StatusBadge status={work.status} />
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <h3 className="truncate text-base font-bold text-gray-800">
                          {work.title}
                        </h3>

                        <p className="mt-1 text-xs font-semibold text-blue-600">
                          {work.category_name}
                        </p>
                      </div>

                      {work.project_url && (
                        <a
                          href={work.project_url}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-gray-50 text-gray-500 transition hover:bg-blue-50 hover:text-blue-600"
                          aria-label={`Buka project ${work.title}`}
                        >
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-500">
                      {work.description}
                    </p>

                    {work.status === "rejected" && work.rejection_note && (
                      <div className="mt-4 rounded-xl border border-rose-100 bg-rose-50 px-3 py-2.5">
                        <p className="text-xs font-semibold text-rose-600">
                          Alasan penolakan
                        </p>

                        <p className="mt-1 text-xs leading-5 text-rose-500">
                          {work.rejection_note}
                        </p>
                      </div>
                    )}

                    <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span className="inline-flex items-center gap-1">
                          <Eye size={14} />
                          {work.views_count}
                        </span>

                        <span className="inline-flex items-center gap-1">
                          <Heart size={14} />
                          {work.likes_count}
                        </span>
                      </div>

                      <p className="text-xs text-gray-400">
                        {new Intl.DateTimeFormat("id-ID", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        }).format(new Date(work.created_at))}
                      </p>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
              <Search size={30} className="text-gray-300" />

              <h3 className="mt-4 font-semibold text-gray-600">
                Karya tidak ditemukan
              </h3>

              <p className="mt-1 text-sm text-gray-400">
                Gunakan kata pencarian atau filter status lainnya.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setStatusFilter("semua");
                }}
                className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
              >
                Hapus filter
              </button>
            </div>
          )}
        </>
      )}
    </CreatorSection>
  );
}
