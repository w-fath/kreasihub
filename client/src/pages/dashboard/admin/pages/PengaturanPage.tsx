import { Save } from "lucide-react";
import { AdminSection } from "../components/AdminSection";

export function PengaturanPage() {
  return (
    <AdminSection
      title="Pengaturan"
      description="Kelola konfigurasi umum platform KreasiHub."
    >
      <form className="max-w-2xl space-y-5">
        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Nama Platform
          </label>

          <input
            type="text"
            defaultValue="KreasiHub"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Email Administrator
          </label>

          <input
            type="email"
            defaultValue="admin@kreasihub.com"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Deskripsi Platform
          </label>

          <textarea
            rows={4}
            defaultValue="Platform direktori kreatif dan portofolio digital."
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-400"
          />
        </div>

        <button
          type="submit"
          className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Save size={17} />
          Simpan Pengaturan
        </button>
      </form>
    </AdminSection>
  );
}
