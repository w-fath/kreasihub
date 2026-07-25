import { Lock, Save } from "lucide-react";
import { CreatorSection } from "../components/CreatorSection";

export function PengaturanPage() {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <CreatorSection
      title="Pengaturan Akun"
      description="Kelola keamanan dan preferensi akun kreatormu."
    >
      <div className="max-w-3xl space-y-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <h3 className="font-bold text-gray-800">Ubah Password</h3>
            <p className="mt-1 text-sm text-gray-400">
              Gunakan password yang kuat dan tidak mudah ditebak.
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password Lama
            </label>

            <div className="relative">
              <Lock
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                placeholder="Masukkan password lama"
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Password Baru
            </label>

            <div className="relative">
              <Lock
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                placeholder="Minimal 8 karakter"
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Konfirmasi Password Baru
            </label>

            <div className="relative">
              <Lock
                size={17}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="password"
                placeholder="Ulangi password baru"
                className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400"
              />
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Save size={17} />
            Simpan Password
          </button>
        </form>

        <div className="border-t border-gray-100 pt-8">
          <h3 className="font-bold text-gray-800">Notifikasi</h3>
          <p className="mt-1 text-sm text-gray-400">
            Atur pemberitahuan yang ingin diterima.
          </p>

          <div className="mt-5 space-y-4">
            <label className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Status review karya
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Notifikasi ketika karya disetujui atau ditolak.
                </p>
              </div>

              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 accent-blue-600"
              />
            </label>

            <label className="flex items-center justify-between rounded-xl border border-gray-100 p-4">
              <div>
                <p className="text-sm font-semibold text-gray-700">
                  Aktivitas portofolio
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  Notifikasi saat karya dilihat atau disukai.
                </p>
              </div>

              <input
                type="checkbox"
                defaultChecked
                className="h-5 w-5 accent-blue-600"
              />
            </label>
          </div>
        </div>
      </div>
    </CreatorSection>
  );
}
