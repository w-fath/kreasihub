import { FolderOpen, Plus, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { CreatorSection } from "../components/CreatorSection";

export function KaryaSayaPage() {
  return (
    <CreatorSection
      title="Karya Saya"
      description="Kelola seluruh karya dan portofolio yang telah kamu tambahkan."
    >
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="relative w-full max-w-sm">
          <Search
            size={17}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            placeholder="Cari karya..."
            className="w-full rounded-xl border border-gray-200 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-400"
          />
        </div>

        <Link
          to="/dashboard/creator/karya/tambah"
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={17} />
          Tambah Karya
        </Link>
      </div>

      <div className="flex min-h-72 flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
          <FolderOpen size={28} />
        </div>

        <h3 className="mt-4 text-lg font-semibold text-gray-700">
          Belum ada karya
        </h3>
        <p className="mt-1 max-w-md text-sm leading-6 text-gray-400">
          Karya yang sudah ditambahkan akan muncul di halaman ini beserta status
          review dan publikasinya.
        </p>

        <Link
          to="/dashboard/creator/karya/tambah"
          className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={17} />
          Tambahkan Karya Pertama
        </Link>
      </div>
    </CreatorSection>
  );
}
