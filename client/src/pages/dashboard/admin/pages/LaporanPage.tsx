import { AlertTriangle, CheckCircle, Eye } from "lucide-react";
import { AdminSection } from "../components/AdminSection";

const reports = [
  {
    id: 1,
    reporter: "Dewi Lestari",
    content: "UI Kit Modern App",
    reason: "Konten tidak sesuai kategori",
    status: "Menunggu",
  },
  {
    id: 2,
    reporter: "Sari Indah",
    content: "Logo Startup X",
    reason: "Diduga menggunakan karya orang lain",
    status: "Ditinjau",
  },
];

export function LaporanPage() {
  return (
    <AdminSection
      title="Laporan Konten"
      description="Tinjau laporan pengguna terhadap karya yang dipublikasikan."
    >
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center gap-4 rounded-xl border border-gray-100 p-4"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
              <AlertTriangle size={20} />
            </div>

            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{report.content}</h3>
              <p className="mt-1 text-sm text-gray-500">{report.reason}</p>
              <p className="mt-1 text-xs text-gray-400">
                Dilaporkan oleh {report.reporter}
              </p>
            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-600">
              {report.status}
            </span>

            <button type="button" className="text-gray-500 hover:text-blue-600">
              <Eye size={18} />
            </button>

            <button
              type="button"
              className="text-emerald-500 hover:text-emerald-700"
            >
              <CheckCircle size={18} />
            </button>
          </div>
        ))}
      </div>
    </AdminSection>
  );
}
