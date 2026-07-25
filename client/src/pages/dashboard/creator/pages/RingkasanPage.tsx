import { CheckCircle, Clock, Eye, FolderOpen, Heart, Plus } from "lucide-react";
import { Link } from "react-router-dom";

const stats = [
  {
    id: "total-karya",
    label: "Total Karya",
    value: "0",
    icon: <FolderOpen size={19} className="text-blue-500" />,
    background: "from-blue-50 to-white",
    border: "border-blue-100",
  },
  {
    id: "dipublikasikan",
    label: "Dipublikasikan",
    value: "0",
    icon: <CheckCircle size={19} className="text-emerald-500" />,
    background: "from-emerald-50 to-white",
    border: "border-emerald-100",
  },
  {
    id: "menunggu-review",
    label: "Menunggu Review",
    value: "0",
    icon: <Clock size={19} className="text-amber-500" />,
    background: "from-amber-50 to-white",
    border: "border-amber-100",
  },
  {
    id: "total-tayangan",
    label: "Total Tayangan",
    value: "0",
    icon: <Eye size={19} className="text-violet-500" />,
    background: "from-violet-50 to-white",
    border: "border-violet-100",
  },
];

export function RingkasanPage() {
  const storedUser = localStorage.getItem("kreasihub_user");

  let creatorName = "Creator";

  try {
    const user = storedUser ? JSON.parse(storedUser) : null;
    creatorName = user?.name || "Creator";
  } catch {
    creatorName = "Creator";
  }

  return (
    <div className="space-y-8">
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 p-8 text-white shadow-sm">
        <div className="flex items-center justify-between gap-6">
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
            className="flex flex-shrink-0 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-blue-600 shadow-sm transition hover:bg-blue-50"
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
              {stat.value}
            </p>
            <p className="mt-1 text-xs text-gray-400">
              Data akan diperbarui otomatis
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
                Daftar karya yang terakhir ditambahkan
              </p>
            </div>

            <Link
              to="/dashboard/creator/karya"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              Lihat Semua
            </Link>
          </div>

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
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm lg:col-span-2">
          <h3 className="font-bold text-gray-800">Performa Portofolio</h3>
          <p className="mt-1 text-xs text-gray-400">
            Ringkasan interaksi terhadap karyamu
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

              <span className="text-xl font-bold text-gray-800">0</span>
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

              <span className="text-xl font-bold text-gray-800">0</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
