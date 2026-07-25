import { CheckCircle, Eye, Search, XCircle } from "lucide-react";
import { AdminSection } from "../components/AdminSection";

const karyaList = [
  {
    id: 1,
    title: "UI Kit Modern App",
    creator: "Rina Kartika",
    category: "Web Design",
    status: "Menunggu",
  },
  {
    id: 2,
    title: "Logo Startup X",
    creator: "Ahmad Fauzi",
    category: "Logo",
    status: "Disetujui",
  },
  {
    id: 3,
    title: "3D Character Art",
    creator: "Budi Santoso",
    category: "3D",
    status: "Ditolak",
  },
];

export function KaryaPage() {
  return (
    <AdminSection
      title="Manajemen Karya"
      description="Lihat, tinjau, setujui, dan tolak karya kreator."
    >
      <div className="relative mb-6 w-full max-w-sm">
        <Search
          size={17}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          placeholder="Cari karya..."
          className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-400"
        />
      </div>

      <div className="space-y-4">
        {karyaList.map((karya) => (
          <div
            key={karya.id}
            className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
          >
            <div>
              <h3 className="font-semibold text-gray-800">{karya.title}</h3>
              <p className="mt-1 text-sm text-gray-500">
                {karya.creator} · {karya.category}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                {karya.status}
              </span>

              <button
                type="button"
                className="text-gray-500 hover:text-blue-600"
              >
                <Eye size={18} />
              </button>

              <button
                type="button"
                className="text-emerald-500 hover:text-emerald-700"
              >
                <CheckCircle size={18} />
              </button>

              <button
                type="button"
                className="text-rose-500 hover:text-rose-700"
              >
                <XCircle size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </AdminSection>
  );
}
