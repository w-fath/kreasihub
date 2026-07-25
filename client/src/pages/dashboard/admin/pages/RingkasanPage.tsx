import {
  CheckCircle,
  Clock,
  Eye,
  Flag,
  Image as ImageIcon,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";

const stats = [
  {
    id: "total-pengguna",
    label: "Total Pengguna",
    value: "786",
    icon: <Users size={18} className="text-blue-500" />,
    trend: "+12%",
    trendUp: true,
    background: "from-blue-50 to-white",
    border: "border-blue-100",
  },
  {
    id: "karya-diupload",
    label: "Karya Diupload",
    value: "1.102",
    icon: <ImageIcon size={18} className="text-violet-500" />,
    trend: "+8%",
    trendUp: true,
    background: "from-violet-50 to-white",
    border: "border-violet-100",
  },
  {
    id: "menunggu-review",
    label: "Menunggu Review",
    value: "5",
    icon: <Clock size={18} className="text-amber-500" />,
    trend: "-2",
    trendUp: false,
    background: "from-amber-50 to-white",
    border: "border-amber-100",
  },
  {
    id: "laporan",
    label: "Laporan",
    value: "3",
    icon: <Flag size={18} className="text-rose-500" />,
    trend: "+1",
    trendUp: false,
    background: "from-rose-50 to-white",
    border: "border-rose-100",
  },
];

const recentActivity = [
  {
    id: 1,
    user: "Rina Kartika",
    action: "mengupload karya baru",
    time: "2 menit lalu",
    status: "pending",
    avatar: "RK",
  },
  {
    id: 2,
    user: "Budi Santoso",
    action: "mendaftar sebagai kreator",
    time: "15 menit lalu",
    status: "approved",
    avatar: "BS",
  },
  {
    id: 3,
    user: "Dewi Lestari",
    action: "melaporkan konten",
    time: "1 jam lalu",
    status: "pending",
    avatar: "DL",
  },
  {
    id: 4,
    user: "Ahmad Fauzi",
    action: "mengupload karya baru",
    time: "2 jam lalu",
    status: "approved",
    avatar: "AF",
  },
  {
    id: 5,
    user: "Sari Indah",
    action: "melaporkan konten",
    time: "3 jam lalu",
    status: "rejected",
    avatar: "SI",
  },
];

const pendingKarya = [
  {
    id: 1,
    title: "UI Kit Modern App",
    creator: "Rina Kartika",
    category: "Web Design",
    time: "2 menit lalu",
  },
  {
    id: 2,
    title: "Logo Startup X",
    creator: "Ahmad Fauzi",
    category: "Logo",
    time: "5 jam lalu",
  },
  {
    id: 3,
    title: "3D Character Art",
    creator: "Budi Santoso",
    category: "3D",
    time: "1 hari lalu",
  },
];

const avatarColors = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
];

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

function StatusBadge({ status }: { status: string }) {
  const statuses: Record<string, { label: string; className: string }> = {
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

  const selectedStatus = statuses[status] || statuses.pending;

  return (
    <span
      className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${selectedStatus.className}`}
    >
      {selectedStatus.label}
    </span>
  );
}

export function RingkasanPage() {
  return (
    <div className="space-y-8">
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
              {stat.value}
            </p>

            <div className="flex items-center gap-1.5">
              <TrendingUp
                size={13}
                className={stat.trendUp ? "text-emerald-500" : "text-rose-400"}
                style={{
                  transform: stat.trendUp ? "none" : "scaleY(-1)",
                }}
              />

              <span
                className={`text-xs font-semibold ${stat.trendUp ? "text-emerald-600" : "text-rose-500"}`}
              >
                {stat.trend}
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
              className="text-xs font-semibold text-blue-500 hover:underline"
            >
              Lihat Semua
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={activity.id} className="flex items-center gap-3">
                <AvatarPlaceholder
                  initials={activity.avatar}
                  color={avatarColors[index % avatarColors.length]}
                />

                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-800">
                    <span className="font-semibold">{activity.user}</span>{" "}
                    <span className="text-gray-500">{activity.action}</span>
                  </p>

                  <p className="mt-0.5 text-xs text-gray-400">
                    {activity.time}
                  </p>
                </div>

                <StatusBadge status={activity.status} />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h2 className="text-base font-bold text-gray-800">
              Menunggu Review
            </h2>

            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
              {pendingKarya.length}
            </span>
          </div>

          <div className="space-y-4">
            {pendingKarya.map((karya) => (
              <div
                key={karya.id}
                className="group rounded-xl border border-gray-100 p-3 transition-colors hover:border-blue-100 hover:bg-blue-50/30"
              >
                <div>
                  <p className="truncate text-sm font-semibold text-gray-800">
                    {karya.title}
                  </p>
                  <p className="mt-0.5 text-xs text-gray-400">
                    {karya.creator} · {karya.category}
                  </p>
                  <p className="text-xs text-gray-400">{karya.time}</p>
                </div>

                <div className="mt-3 flex items-center gap-3">
                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs font-medium text-gray-500 hover:text-blue-600"
                  >
                    <Eye size={13} />
                    Lihat
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs font-medium text-emerald-600 hover:text-emerald-700"
                  >
                    <CheckCircle size={13} />
                    Setujui
                  </button>

                  <button
                    type="button"
                    className="flex items-center gap-1 text-xs font-medium text-rose-500 hover:text-rose-600"
                  >
                    <XCircle size={13} />
                    Tolak
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
