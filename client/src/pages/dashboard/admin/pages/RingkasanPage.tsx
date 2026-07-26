import { useEffect, useState } from "react";
import {
  CheckCircle,
  Clock,
  Eye,
  Flag,
  Image as ImageIcon,
  LoaderCircle,
  RefreshCw,
  TrendingUp,
  Users,
  X,
  XCircle,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type WorkStatus = "pending" | "approved" | "rejected";

type AdminSummary = {
  total_users: number;
  total_works: number;
  pending_works: number;
  total_reports: number;

  users_this_month: number;
  users_last_month: number;

  works_this_month: number;
  works_last_month: number;

  pending_this_month: number;
  pending_last_month: number;
};

type RecentActivity = {
  id: string;
  user: string;
  action: string;
  activity_time: string;
  status: WorkStatus;
};

type PendingWork = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  thumbnail_url: string;
  project_url: string | null;
  status: WorkStatus;
  created_at: string;
  creator_name: string;
  creator_email: string;
  category_name: string;
};

type AdminDashboardResponse = {
  success: boolean;
  message: string;
  data?: {
    summary: AdminSummary;
    recent_activity: RecentActivity[];
    pending_works: PendingWork[];
  };
};

type StatusResponse = {
  success: boolean;
  message: string;
};

const initialSummary: AdminSummary = {
  total_users: 0,
  total_works: 0,
  pending_works: 0,
  total_reports: 0,

  users_this_month: 0,
  users_last_month: 0,

  works_this_month: 0,
  works_last_month: 0,

  pending_this_month: 0,
  pending_last_month: 0,
};

const avatarColors = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

function formatRelativeTime(dateValue: string) {
  const date = new Date(dateValue);
  const difference = Date.now() - date.getTime();

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) {
    return "baru saja";
  }

  if (minutes < 60) {
    return `${minutes} menit lalu`;
  }

  if (hours < 24) {
    return `${hours} jam lalu`;
  }

  if (days < 7) {
    return `${days} hari lalu`;
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getTrend(current: number, previous: number) {
  if (previous === 0) {
    return {
      label: current > 0 ? `+${current}` : "0",
      trendUp: current >= 0,
    };
  }

  const percentage = Math.round(((current - previous) / previous) * 100);

  return {
    label: `${percentage >= 0 ? "+" : ""}${percentage}%`,
    trendUp: percentage >= 0,
  };
}

function AvatarPlaceholder({
  initials,
  color,
}: {
  initials: string;
  color: string;
}) {
  return (
    <div
      className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white ${color}`}
    >
      {initials}
    </div>
  );
}

function StatusBadge({ status }: { status: WorkStatus }) {
  const statuses = {
    pending: {
      label: "Menunggu",
      className: "bg-amber-100 text-amber-700",
    },
    approved: {
      label: "Disetujui",
      className: "bg-emerald-100 text-emerald-700",
    },
    rejected: {
      label: "Ditolak",
      className: "bg-rose-100 text-rose-700",
    },
  };

  const selectedStatus = statuses[status];

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${selectedStatus.className}`}
    >
      {selectedStatus.label}
    </span>
  );
}

export function RingkasanPage() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState<AdminSummary>(initialSummary);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [pendingWorks, setPendingWorks] = useState<PendingWork[]>([]);

  const [selectedWork, setSelectedWork] = useState<PendingWork | null>(null);
  const [rejectWork, setRejectWork] = useState<PendingWork | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUnauthorized = () => {
    localStorage.removeItem("kreasihub_token");
    localStorage.removeItem("kreasihub_user");
    navigate("/login", { replace: true });
  };

  const getDashboardSummary = async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/admin/dashboard/summary`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as AdminDashboardResponse;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError("Kamu tidak memiliki akses ke dashboard admin.");
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setError(result.message || "Ringkasan dashboard gagal diambil.");
        return;
      }

      setSummary(result.data.summary);
      setRecentActivity(result.data.recent_activity);
      setPendingWorks(result.data.pending_works);
    } catch (requestError) {
      console.error("Get admin dashboard summary error:", requestError);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void getDashboardSummary();
  }, []);

  const updateWorkStatus = async (
    work: PendingWork,
    status: "approved" | "rejected",
    note = "",
  ) => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setProcessingId(work.id);
      setError(null);
      setSuccess(null);

      const response = await fetch(
        `${API_URL}/api/admin/works/${work.id}/status`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status,
            rejection_note: note,
          }),
        },
      );

      const result = (await response.json()) as StatusResponse;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError("Kamu tidak memiliki akses untuk mengubah status karya.");
        return;
      }

      if (!response.ok || !result.success) {
        setError(result.message || "Status karya gagal diperbarui.");
        return;
      }

      setSuccess(result.message);
      setSelectedWork(null);
      setRejectWork(null);
      setRejectionNote("");

      await getDashboardSummary();
    } catch (requestError) {
      console.error("Update work status error:", requestError);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleApprove = async (work: PendingWork) => {
    const confirmed = window.confirm(
      `Setujui karya "${work.title}" milik ${work.creator_name}?`,
    );

    if (!confirmed) {
      return;
    }

    await updateWorkStatus(work, "approved");
  };

  const handleRejectSubmit = async () => {
    if (!rejectWork) {
      return;
    }

    if (!rejectionNote.trim()) {
      setError("Alasan penolakan wajib diisi.");
      return;
    }

    await updateWorkStatus(rejectWork, "rejected", rejectionNote.trim());
  };

  const userTrend = getTrend(
    summary.users_this_month,
    summary.users_last_month,
  );

  const workTrend = getTrend(
    summary.works_this_month,
    summary.works_last_month,
  );

  const pendingTrend = getTrend(
    summary.pending_this_month,
    summary.pending_last_month,
  );

  const stats = [
    {
      id: "total-pengguna",
      label: "Total Pengguna",
      value: summary.total_users,
      icon: <Users size={18} className="text-blue-500" />,
      trend: userTrend.label,
      trendUp: userTrend.trendUp,
      background: "from-blue-50 to-white",
      border: "border-blue-100",
    },
    {
      id: "karya-diupload",
      label: "Karya Diupload",
      value: summary.total_works,
      icon: <ImageIcon size={18} className="text-violet-500" />,
      trend: workTrend.label,
      trendUp: workTrend.trendUp,
      background: "from-violet-50 to-white",
      border: "border-violet-100",
    },
    {
      id: "menunggu-review",
      label: "Menunggu Review",
      value: summary.pending_works,
      icon: <Clock size={18} className="text-amber-500" />,
      trend: pendingTrend.label,
      trendUp: pendingTrend.trendUp,
      background: "from-amber-50 to-white",
      border: "border-amber-100",
    },
    {
      id: "laporan",
      label: "Laporan",
      value: summary.total_reports,
      icon: <Flag size={18} className="text-rose-500" />,
      trend: "0",
      trendUp: true,
      background: "from-rose-50 to-white",
      border: "border-rose-100",
    },
  ];

  return (
    <div className="space-y-8">
      {error && (
        <div className="flex items-center justify-between gap-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
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
        <div className="flex items-center justify-between gap-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
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

      <section className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`flex flex-col gap-3 rounded-2xl border bg-gradient-to-br p-5 shadow-sm transition-shadow hover:shadow-md ${stat.background} ${stat.border}`}
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-gray-500">
                {stat.label}
              </span>

              <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 bg-white shadow-sm">
                {stat.icon}
              </div>
            </div>

            <p className="text-3xl font-extrabold tracking-tight text-gray-900">
              {loading ? "..." : stat.value.toLocaleString("id-ID")}
            </p>

            <div className="flex items-center gap-1.5">
              <TrendingUp
                size={13}
                className={stat.trendUp ? "text-emerald-500" : "text-rose-400"}
                style={{ transform: stat.trendUp ? "none" : "scaleY(-1)" }}
              />

              <span
                className={`text-xs font-semibold ${stat.trendUp ? "text-emerald-600" : "text-rose-500"}`}
              >
                {loading ? "..." : stat.trend}
              </span>

              <span className="text-xs text-gray-400">dari bulan lalu</span>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-3">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">
              Aktivitas Terbaru
            </h2>

            <button
              type="button"
              onClick={() => void getDashboardSummary()}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:underline"
            >
              <RefreshCw size={14} />
              Muat Ulang
            </button>
          </div>

          {loading ? (
            <div className="flex min-h-52 items-center justify-center">
              <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
                <LoaderCircle size={20} className="animate-spin" />
                Memuat aktivitas...
              </div>
            </div>
          ) : recentActivity.length === 0 ? (
            <div className="flex min-h-52 items-center justify-center">
              <p className="text-sm text-gray-400">
                Belum ada aktivitas terbaru.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={activity.id} className="flex items-center gap-3">
                  <AvatarPlaceholder
                    initials={getInitials(activity.user)}
                    color={avatarColors[index % avatarColors.length]}
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-gray-800">
                      <span className="font-semibold">{activity.user}</span>{" "}
                      <span className="text-gray-500">{activity.action}</span>
                    </p>

                    <p className="mt-0.5 text-xs text-gray-400">
                      {formatRelativeTime(activity.activity_time)}
                    </p>
                  </div>

                  <StatusBadge status={activity.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">
              Menunggu Review
            </h2>

            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
              {summary.pending_works}
            </span>
          </div>

          {loading ? (
            <div className="flex min-h-52 items-center justify-center">
              <LoaderCircle size={20} className="animate-spin text-gray-400" />
            </div>
          ) : pendingWorks.length === 0 ? (
            <div className="flex min-h-52 flex-col items-center justify-center text-center">
              <CheckCircle size={30} className="text-emerald-400" />

              <p className="mt-3 text-sm font-semibold text-gray-600">
                Semua karya sudah ditinjau
              </p>

              <p className="mt-1 text-xs text-gray-400">
                Tidak ada karya yang menunggu review.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingWorks.map((work) => (
                <div
                  key={work.id}
                  className="group rounded-xl border border-gray-100 p-3 transition-colors hover:border-blue-100 hover:bg-blue-50/30"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={work.thumbnail_url}
                      alt={work.title}
                      className="h-14 w-16 flex-shrink-0 rounded-lg object-cover"
                    />

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-800">
                        {work.title}
                      </p>

                      <p className="mt-0.5 truncate text-xs text-gray-400">
                        {work.creator_name} · {work.category_name}
                      </p>

                      <p className="text-xs text-gray-400">
                        {formatRelativeTime(work.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedWork(work)}
                      className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-600"
                    >
                      <Eye size={13} />
                      Lihat
                    </button>

                    <button
                      type="button"
                      onClick={() => void handleApprove(work)}
                      disabled={processingId === work.id}
                      className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700 disabled:opacity-50"
                    >
                      <CheckCircle size={13} />
                      Setujui
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setRejectWork(work);
                        setRejectionNote("");
                      }}
                      disabled={processingId === work.id}
                      className="flex items-center gap-1 text-xs font-medium text-rose-500 hover:text-rose-600 disabled:opacity-50"
                    >
                      <XCircle size={13} />
                      Tolak
                    </button>
                  </div>
                </div>
              ))}

              <Link
                to="/dashboard/admin/karya"
                className="block text-center text-xs font-semibold text-blue-600 hover:underline"
              >
                Lihat semua karya
              </Link>
            </div>
          )}
        </div>
      </section>

      {selectedWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="max-h-full w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Detail Karya
                </h2>
                <p className="text-sm text-gray-400">
                  Periksa karya sebelum memberikan keputusan.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWork(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <img
                src={selectedWork.thumbnail_url}
                alt={selectedWork.title}
                className="max-h-[420px] w-full rounded-2xl bg-gray-100 object-contain"
              />

              <h3 className="mt-5 text-xl font-bold text-gray-900">
                {selectedWork.title}
              </h3>

              <p className="mt-1 text-sm font-semibold text-blue-600">
                {selectedWork.category_name}
              </p>

              <div className="mt-4 rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-700">
                  {selectedWork.creator_name}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  {selectedWork.creator_email}
                </p>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
                {selectedWork.description}
              </p>

              {selectedWork.project_url && (
                <a
                  href={selectedWork.project_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:underline"
                >
                  Buka tautan project
                </a>
              )}

              <div className="mt-6 flex justify-end gap-3 border-t border-gray-100 pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setRejectWork(selectedWork);
                    setSelectedWork(null);
                    setRejectionNote("");
                  }}
                  className="rounded-xl border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                >
                  Tolak
                </button>

                <button
                  type="button"
                  onClick={() => void handleApprove(selectedWork)}
                  className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                >
                  Setujui Karya
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {rejectWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Tolak Karya</h2>
                <p className="mt-1 text-sm text-gray-400">
                  Berikan alasan penolakan untuk creator.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setRejectWork(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-800">
                {rejectWork.title}
              </p>
              <p className="mt-1 text-xs text-gray-400">
                {rejectWork.creator_name}
              </p>
            </div>

            <label
              htmlFor="rejection-note"
              className="mb-2 mt-5 block text-sm font-semibold text-gray-700"
            >
              Alasan Penolakan
            </label>

            <textarea
              id="rejection-note"
              value={rejectionNote}
              onChange={(event) => setRejectionNote(event.target.value)}
              rows={5}
              maxLength={1000}
              placeholder="Jelaskan bagian yang perlu diperbaiki..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-rose-400 focus:ring-4 focus:ring-rose-50"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {rejectionNote.length}/1000
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setRejectWork(null)}
                disabled={processingId === rejectWork.id}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => void handleRejectSubmit()}
                disabled={processingId === rejectWork.id}
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:bg-rose-400"
              >
                {processingId === rejectWork.id && (
                  <LoaderCircle size={16} className="animate-spin" />
                )}
                Tolak Karya
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
