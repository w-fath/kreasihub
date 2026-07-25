import { Mail, Save, User } from "lucide-react";
import { CreatorSection } from "../components/CreatorSection";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

const getStoredUser = (): AuthUser | null => {
  const storedUser = localStorage.getItem("kreasihub_user");

  if (!storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
};

export function ProfilPage() {
  const user = getStoredUser();
  const initial = user?.name?.trim().charAt(0).toUpperCase() || "C";

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  return (
    <CreatorSection
      title="Profil Kreator"
      description="Lengkapi identitas yang akan ditampilkan pada halaman portofoliomu."
    >
      <form className="max-w-3xl space-y-6" onSubmit={handleSubmit}>
        <div className="flex items-center gap-5 rounded-2xl bg-gray-50 p-5">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-2xl font-bold text-white">
            {initial}
          </div>

          <div>
            <h3 className="font-bold text-gray-800">
              {user?.name || "Creator"}
            </h3>
            <p className="mt-1 text-sm text-gray-400">{user?.email}</p>

            <button
              type="button"
              className="mt-3 text-sm font-semibold text-blue-600 hover:underline"
            >
              Ubah Foto Profil
            </button>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Nama Lengkap
          </label>

          <div className="relative">
            <User
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              defaultValue={user?.name || ""}
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Email
          </label>

          <div className="relative">
            <Mail
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="email"
              defaultValue={user?.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-4 text-sm text-gray-500 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Keahlian
          </label>

          <input
            type="text"
            placeholder="Contoh: UI/UX Designer, Frontend Developer"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Bio
          </label>

          <textarea
            rows={5}
            placeholder="Ceritakan tentang dirimu..."
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Lokasi
          </label>

          <input
            type="text"
            placeholder="Contoh: Surabaya, Indonesia"
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-blue-400"
          />
        </div>

        <div className="flex justify-end border-t border-gray-100 pt-6">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Save size={17} />
            Simpan Profil
          </button>
        </div>
      </form>
    </CreatorSection>
  );
}
