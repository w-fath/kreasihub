import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CheckCircle,
  Clock,
  ExternalLink,
  Eye,
  ImageOff,
  LoaderCircle,
  RefreshCw,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { AdminSection } from "../components/AdminSection";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type WorkStatus = "pending" | "approved" | "rejected";
type StatusFilter = "all" | WorkStatus;

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
  created_at: string;
  updated_at: string;
  creator_name: string;
  creator_email: string;
  category_name: string;
  category_slug: string;
};

type WorksResponse = {
  success: boolean;
  message: string;
  data?: Work[];
};

type StatusResponse = {
  success: boolean;
  message: string;
};

const statusOptions: Record<
  WorkStatus,
  {
    label: string;
    className: string;
    icon: typeof Clock;
  }
> = {
  pending: {
    label: "Menunggu Review",
    className: "bg-amber-50 text-amber-600",
    icon: Clock,
  },
  approved: {
    label: "Disetujui",
    className: "bg-emerald-50 text-emerald-600",
    icon: CheckCircle,
  },
  rejected: {
    label: "Ditolak",
    className: "bg-rose-50 text-rose-600",
    icon: XCircle,
  },
};

function StatusBadge({ status }: { status: WorkStatus }) {
  const selectedStatus = statusOptions[status];
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

function formatDate(dateValue: string) {
  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function KaryaPage() {
  const navigate = useNavigate();

  const [works, setWorks] = useState<Work[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [rejectWork, setRejectWork] = useState<Work | null>(null);
  const [rejectionNote, setRejectionNote] = useState("");

  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("kreasihub_token");
    localStorage.removeItem("kreasihub_user");

    navigate("/login", { replace: true });
  }, [navigate]);

  const getWorks = useCallback(async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/admin/works`, {
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
      console.error("Get admin works error:", requestError);

      setWorks([]);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    void getWorks();
  }, [getWorks]);

  const filteredWorks = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return works.filter((work) => {
      const matchesSearch =
        !keyword ||
        work.title.toLowerCase().includes(keyword) ||
        work.creator_name.toLowerCase().includes(keyword) ||
        work.creator_email.toLowerCase().includes(keyword) ||
        work.category_name.toLowerCase().includes(keyword) ||
        work.description.toLowerCase().includes(keyword);

      const matchesStatus =
        statusFilter === "all" || work.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, works]);

  const totalPending = works.filter((work) => work.status === "pending").length;

  const totalApproved = works.filter(
    (work) => work.status === "approved",
  ).length;

  const totalRejected = works.filter(
    (work) => work.status === "rejected",
  ).length;

  const updateWorkStatus = async (
    work: Work,
    status: "approved" | "rejected",
    rejectionNoteValue = "",
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
            rejection_note: rejectionNoteValue,
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

      await getWorks();
    } catch (requestError) {
      console.error("Update work status error:", requestError);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setProcessingId(null);
    }
  };

  const handleApprove = async (work: Work) => {
    if (work.status === "approved") {
      return;
    }

    const confirmed = window.confirm(
      `Setujui karya "${work.title}" milik ${work.creator_name}?`,
    );

    if (!confirmed) {
      return;
    }

    await updateWorkStatus(work, "approved");
  };

  const openRejectModal = (work: Work) => {
    setRejectWork(work);
    setRejectionNote(work.rejection_note || "");
    setError(null);
  };

  const handleRejectSubmit = async () => {
    if (!rejectWork) {
      return;
    }

    const note = rejectionNote.trim();

    if (!note) {
      setError("Alasan penolakan wajib diisi.");
      return;
    }

    await updateWorkStatus(rejectWork, "rejected", note);
  };

  return (
    <AdminSection
      title="Manajemen Karya"
      description="Lihat, tinjau, setujui, dan tolak karya kreator."
    >
      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
          <p className="text-sm font-medium text-rose-600">{error}</p>

          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-500 transition hover:text-rose-700"
            aria-label="Tutup pesan kesalahan"
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
            className="text-emerald-500 transition hover:text-emerald-700"
            aria-label="Tutup pesan berhasil"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            statusFilter === "all"
              ? "border-blue-200 bg-blue-50"
              : "border-gray-100 bg-white hover:bg-gray-50"
          }`}
        >
          <p className="text-xs font-medium text-gray-400">Semua Karya</p>
          <p className="mt-1 text-xl font-bold text-gray-800">{works.length}</p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("pending")}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            statusFilter === "pending"
              ? "border-amber-200 bg-amber-50"
              : "border-gray-100 bg-white hover:bg-gray-50"
          }`}
        >
          <p className="text-xs font-medium text-gray-400">Menunggu</p>
          <p className="mt-1 text-xl font-bold text-amber-600">
            {totalPending}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("approved")}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            statusFilter === "approved"
              ? "border-emerald-200 bg-emerald-50"
              : "border-gray-100 bg-white hover:bg-gray-50"
          }`}
        >
          <p className="text-xs font-medium text-gray-400">Disetujui</p>
          <p className="mt-1 text-xl font-bold text-emerald-600">
            {totalApproved}
          </p>
        </button>

        <button
          type="button"
          onClick={() => setStatusFilter("rejected")}
          className={`rounded-xl border px-4 py-3 text-left transition ${
            statusFilter === "rejected"
              ? "border-rose-200 bg-rose-50"
              : "border-gray-100 bg-white hover:bg-gray-50"
          }`}
        >
          <p className="text-xs font-medium text-gray-400">Ditolak</p>
          <p className="mt-1 text-xl font-bold text-rose-600">
            {totalRejected}
          </p>
        </button>
      </div>

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
              placeholder="Cari judul, kreator, email, atau kategori..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as StatusFilter)
            }
            className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Review</option>
            <option value="approved">Disetujui</option>
            <option value="rejected">Ditolak</option>
          </select>
        </div>

        <button
          type="button"
          onClick={() => void getWorks()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Muat Ulang
        </button>
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
          <ImageOff size={32} className="text-gray-300" />

          <h3 className="mt-4 font-semibold text-gray-600">Belum ada karya</h3>

          <p className="mt-1 text-sm text-gray-400">
            Karya yang ditambahkan oleh creator akan muncul di halaman ini.
          </p>
        </div>
      ) : filteredWorks.length === 0 ? (
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
              setStatusFilter("all");
            }}
            className="mt-4 text-sm font-semibold text-blue-600 hover:underline"
          >
            Hapus filter
          </button>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm text-gray-500">
            Menampilkan{" "}
            <span className="font-semibold text-gray-700">
              {filteredWorks.length}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-gray-700">{works.length}</span>{" "}
            karya
          </p>

          <div className="space-y-4">
            {filteredWorks.map((work) => (
              <article
                key={work.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/20 lg:flex-row lg:items-center"
              >
                <img
                  src={work.thumbnail_url}
                  alt={work.title}
                  className="h-48 w-full rounded-xl bg-gray-100 object-cover sm:h-40 lg:h-24 lg:w-32"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-bold text-gray-800">
                      {work.title}
                    </h3>

                    <StatusBadge status={work.status} />
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    {work.creator_name} · {work.category_name}
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    {work.creator_email}
                  </p>

                  <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
                    {work.description}
                  </p>

                  <p className="mt-2 text-xs text-gray-400">
                    Dikirim {formatDate(work.created_at)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2 lg:flex-col lg:items-stretch">
                  <button
                    type="button"
                    onClick={() => setSelectedWork(work)}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-blue-600"
                  >
                    <Eye size={15} />
                    Lihat
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleApprove(work)}
                    disabled={
                      processingId === work.id || work.status === "approved"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-600 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {processingId === work.id ? (
                      <LoaderCircle size={15} className="animate-spin" />
                    ) : (
                      <CheckCircle size={15} />
                    )}
                    Setujui
                  </button>

                  <button
                    type="button"
                    onClick={() => openRejectModal(work)}
                    disabled={
                      processingId === work.id || work.status === "rejected"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-100 bg-rose-50 px-3 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <XCircle size={15} />
                    Tolak
                  </button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}

      {selectedWork && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-8">
          <div className="max-h-full w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-100 bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Detail Karya
                </h2>

                <p className="text-sm text-gray-400">
                  Periksa karya dan informasi creator.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedWork(null)}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <img
                src={selectedWork.thumbnail_url}
                alt={selectedWork.title}
                className="max-h-[500px] w-full rounded-2xl bg-gray-100 object-contain"
              />

              <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {selectedWork.title}
                  </h3>

                  <p className="mt-1 text-sm font-semibold text-blue-600">
                    {selectedWork.category_name}
                  </p>
                </div>

                <StatusBadge status={selectedWork.status} />
              </div>

              <div className="mt-5 rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-semibold text-gray-800">
                  {selectedWork.creator_name}
                </p>

                <p className="mt-1 text-xs text-gray-400">
                  {selectedWork.creator_email}
                </p>
              </div>

              <div className="mt-5">
                <h4 className="text-sm font-semibold text-gray-700">
                  Deskripsi
                </h4>

                <p className="mt-2 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {selectedWork.description}
                </p>
              </div>

              {selectedWork.project_url && (
                <a
                  href={selectedWork.project_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline"
                >
                  <ExternalLink size={16} />
                  Buka tautan project
                </a>
              )}

              {selectedWork.status === "rejected" &&
                selectedWork.rejection_note && (
                  <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50 p-4">
                    <p className="text-sm font-semibold text-rose-600">
                      Alasan Penolakan
                    </p>

                    <p className="mt-2 whitespace-pre-line text-sm leading-6 text-rose-500">
                      {selectedWork.rejection_note}
                    </p>
                  </div>
                )}

              <div className="mt-6 flex flex-col justify-end gap-3 border-t border-gray-100 pt-5 sm:flex-row">
                {selectedWork.status !== "rejected" && (
                  <button
                    type="button"
                    onClick={() => {
                      openRejectModal(selectedWork);
                      setSelectedWork(null);
                    }}
                    className="rounded-xl border border-rose-200 px-5 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                  >
                    Tolak Karya
                  </button>
                )}

                {selectedWork.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => void handleApprove(selectedWork)}
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Setujui Karya
                  </button>
                )}
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
                onClick={() => {
                  setRejectWork(null);
                  setRejectionNote("");
                }}
                className="text-gray-400 transition hover:text-gray-700"
              >
                <X size={19} />
              </button>
            </div>

            <div className="mt-5 rounded-xl bg-gray-50 p-4">
              <p className="text-sm font-semibold text-gray-800">
                {rejectWork.title}
              </p>

              <p className="mt-1 text-xs text-gray-400">
                {rejectWork.creator_name} · {rejectWork.category_name}
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
              placeholder="Jelaskan bagian yang perlu diperbaiki oleh creator..."
              className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-rose-400 focus:ring-4 focus:ring-rose-50"
            />

            <p className="mt-1 text-right text-xs text-gray-400">
              {rejectionNote.length}/1000
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setRejectWork(null);
                  setRejectionNote("");
                }}
                disabled={processingId === rejectWork.id}
                className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>

              <button
                type="button"
                onClick={() => void handleRejectSubmit()}
                disabled={
                  processingId === rejectWork.id || !rejectionNote.trim()
                }
                className="flex items-center gap-2 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-rose-400"
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
    </AdminSection>
  );
}
