import { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  Eye,
  FolderOpen,
  Heart,
  LoaderCircle,
  Plus,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type WorkStatus = "pending" | "approved" | "rejected";

type CreatorSummary = {
  total_works: number;
  approved_works: number;
  pending_works: number;
  rejected_works: number;
  total_views: number;
  total_likes: number;
};

type RecentWork = {
  id: number;
  title: string;
  slug: string;
  thumbnail: string;
  thumbnail_url: string;
  project_url: string | null;
  status: WorkStatus;
  views_count: number;
  likes_count: number;
  category_name: string;
  created_at: string;
};

type SummaryResponse = {
  success: boolean;
  message: string;
  data?: {
    summary: CreatorSummary;
    recent_works: RecentWork[];
  };
};

const initialSummary: CreatorSummary = {
  total_works: 0,
  approved_works: 0,
  pending_works: 0,
  rejected_works: 0,
  total_views: 0,
  total_likes: 0,
};

function getCreatorName() {
  const storedUser = localStorage.getItem("kreasihub_user");

  if (!storedUser) {
    return "Creator";
  }

  try {
    const user = JSON.parse(storedUser);
    return user?.name || "Creator";
  } catch {
    return "Creator";
  }
}

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
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${selectedStatus.className}`}
    >
      <Icon size={12} />
      {selectedStatus.label}
    </span>
  );
}

export function RingkasanPage() {
  const navigate = useNavigate();
  const creatorName = getCreatorName();

  const [summary, setSummary] = useState<CreatorSummary>(initialSummary);
  const [recentWorks, setRecentWorks] = useState<RecentWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleUnauthorized = () => {
    localStorage.removeItem("kreasihub_token");
    localStorage.removeItem("kreasihub_user");
    navigate("/login", { replace: true });
  };

  const getSummary = async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/creator/works/summary`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as SummaryResponse;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError("Kamu tidak memiliki akses ke dashboard creator.");
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setError(result.message || "Ringkasan dashboard gagal diambil.");
        return;
      }

      setSummary(result.data.summary);
      setRecentWorks(result.data.recent_works);
    } catch (requestError) {
      console.error("Get creator summary error:", requestError);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void getSummary();
  }, []);

  const stats = [
    {
      id: "total-karya",
      label: "Total Karya",
      value: summary.total_works,
      icon: <FolderOpen size={19} className="text-blue-500" />,
      background: "from-blue-50 to-white",
      border: "border-blue-100",
    },
    {
      id: "dipublikasikan",
      label: "Dipublikasikan",
      value: summary.approved_works,
      icon: <CheckCircle size={19} className="text-emerald-500" />,
      background: "from-emerald-50 to-white",
      border: "border-emerald-100",
    },
    {
      id: "menunggu-review",
      label: "Menunggu Review",
      value: summary.pending_works,
      icon: <Clock size={19} className="text-amber-500" />,
      background: "from-amber-50 to-white",
      border: "border-amber-100",
    },
    {
      id: "total-tayangan",
      label: "Total Tayangan",
      value: summary.total_views,
      icon: <Eye size={19} className="text-violet-500" />,
      background: "from-violet-50 to-white",
      border: "border-violet-100",
    },
  ];

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
          <p className="text-sm font-medium text-rose-600">{error}</p>

          <button
            type="button"
            onClick={() => void getSummary()}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:underline"
          >
            <RefreshCw size={15} />
            Coba Lagi
          </button>
        </div>
      )}

      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 p-8 text-white shadow-sm">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="text-sm font-medium text-blue-100">
              Selamat datang kembali
            </p>

            <h2 className="mt-2 text-3xl font-bold">{creatorName}</h2>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100">
              Kelola karya, lengkapi profil kreator, dan tampilkan portofolio
              terbaikmu kepada pengguna KreasiHub.
            </p>
          </div>

          <Link
            to="/dashboard/creator/karya/tambah"
            className="flex flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-600 shadow-sm transition hover:bg-blue-50"
          >
            <Plus size={18} />
            Tambah Karya
          </Link>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition-shadow hover:shadow-md ${stat.background} ${stat.border}`}
          >
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-gray-500">
                {stat.label}
              </p>

              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-gray-100 bg-white shadow-sm">
                {stat.icon}
              </div>
            </div>

            <p className="mt-4 text-3xl font-extrabold text-gray-900">
              {loading ? "..." : stat.value.toLocaleString("id-ID")}
            </p>

            <p className="mt-1 text-xs text-gray-400">
              {loading ? "Memuat data..." : "Data berasal dari database"}
            </p>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-800">Karya Terbaru</h3>
              <p className="mt-1 text-xs text-gray-400">
                Maksimal empat karya yang terakhir ditambahkan
              </p>
            </div>

            <Link
              to="/dashboard/creator/karya"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

          {loading ? (
            <div className="flex min-h-52 items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
                <LoaderCircle size={21} className="animate-spin" />
                Memuat karya terbaru...
              </div>
            </div>
          ) : recentWorks.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-500">
                <FolderOpen size={25} />
              </div>

              <h4 className="mt-4 font-semibold text-gray-700">
                Belum ada karya
              </h4>

              <p className="mt-1 max-w-sm text-sm text-gray-400">
                Mulai tambahkan karya pertamamu untuk membangun portofolio
                digital.
              </p>

              <Link
                to="/dashboard/creator/karya/tambah"
                className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <Plus size={17} />
                Tambah Karya
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentWorks.map((work) => (
                <div
                  key={work.id}
                  className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/20 sm:flex-row sm:items-center"
                >
                  <img
                    src={work.thumbnail_url}
                    alt={work.title}
                    className="h-24 w-full rounded-xl object-cover sm:h-20 sm:w-28"
                  />

                  <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-bold text-gray-800">
                      {work.title}
                    </h4>

                    <p className="mt-1 text-xs font-semibold text-blue-600">
                      {work.category_name}
                    </p>

                    <div className="mt-2">
                      <StatusBadge status={work.status} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <span className="inline-flex items-center gap-1">
                        <Eye size={13} />
                        {work.views_count}
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Heart size={13} />
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
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-gray-800">Performa Portofolio</h3>

          <p className="mt-1 text-xs text-gray-400">
            Ringkasan interaksi terhadap seluruh karyamu
          </p>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-violet-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-violet-500 shadow-sm">
                  <Eye size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">
                    Tayangan
                  </p>
                  <p className="text-xs text-gray-400">Semua karya</p>
                </div>
              </div>

              <span className="text-xl font-bold text-gray-800">
                {loading ? "..." : summary.total_views.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-rose-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
                  <Heart size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">Disukai</p>
                  <p className="text-xs text-gray-400">Semua karya</p>
                </div>
              </div>

              <span className="text-xl font-bold text-gray-800">
                {loading ? "..." : summary.total_likes.toLocaleString("id-ID")}
              </span>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-rose-50/60 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-rose-500 shadow-sm">
                  <XCircle size={18} />
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">Ditolak</p>
                  <p className="text-xs text-gray-400">Perlu diperbaiki</p>
                </div>
              </div>

              <span className="text-xl font-bold text-gray-800">
                {loading
                  ? "..."
                  : summary.rejected_works.toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
