import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  SlidersHorizontal,
  User,
} from "lucide-react";
import { Button } from "../components/ui/Button";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "creator";
};

type AuthResponse = {
  success: boolean;
  message: string;
  data?: AuthUser;
};

const getStoredUser = (): AuthUser | null => {
  const token = localStorage.getItem("kreasihub_token");
  const storedUser = localStorage.getItem("kreasihub_user");

  if (!token || !storedUser) {
    return null;
  }

  try {
    return JSON.parse(storedUser) as AuthUser;
  } catch {
    return null;
  }
};

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    className="h-4 w-4"
    fill="currentColor"
  >
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="h-3.5 w-3.5"
    fill="currentColor"
  >
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
  </svg>
);

const InstagramIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 448 512"
    className="h-4 w-4"
    fill="currentColor"
  >
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
  </svg>
);

const mockImages = [
  "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1523895665936-7bfe172b757d?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop",
];

export function LandingPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());
  const [profileOpen, setProfileOpen] = useState(false);

  const dashboardPath =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/creator";

  useEffect(() => {
    let componentActive = true;

    const verifyAuthentication = async () => {
      const token = localStorage.getItem("kreasihub_token");

      if (!token) {
        if (componentActive) {
          setUser(null);
        }

        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/auth/me`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = (await response.json()) as AuthResponse;

        if (!response.ok || !result.success || !result.data) {
          localStorage.removeItem("kreasihub_token");
          localStorage.removeItem("kreasihub_user");

          if (componentActive) {
            setUser(null);
          }

          return;
        }

        localStorage.setItem("kreasihub_user", JSON.stringify(result.data));

        if (componentActive) {
          setUser(result.data);
        }
      } catch (error) {
        console.error("Verify authentication error:", error);
      }
    };

    void verifyAuthentication();

    return () => {
      componentActive = false;
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("kreasihub_token");
    localStorage.removeItem("kreasihub_user");

    setUser(null);
    setProfileOpen(false);

    navigate("/", { replace: true });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-neutral-dark">
      {/* Header */}
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-8 py-6">
        <div className="flex items-center space-x-12">
          <Link
            to="/"
            className="text-3xl font-black italic uppercase tracking-tighter text-black hover:opacity-80"
          >
            ETCH
          </Link>

          <nav className="hidden items-center space-x-8 md:flex">
            <a
              href="#karya"
              className="text-sm font-bold transition-colors hover:text-gray-600"
            >
              Jelajahi
            </a>

            <a
              href="kreator"
              className="text-sm font-bold transition-colors hover:text-gray-600"
            >
              Kreator
            </a>

            <a
              href="#komunitas"
              className="text-sm font-bold transition-colors hover:text-gray-600"
            >
              Komunitas
            </a>
          </nav>
        </div>

        {!user ? (
          <div className="flex items-center space-x-6">
            <Link
              to="/register"
              className="text-sm font-bold transition-colors hover:text-gray-600"
            >
              Daftar
            </Link>

            <Link to="/login">
              <Button className="h-10 rounded-lg border border-black bg-black px-6 py-2 font-bold text-white hover:bg-gray-800">
                Masuk
              </Button>
            </Link>
          </div>
        ) : (
          <div
            className="relative"
            onMouseEnter={() => setProfileOpen(true)}
            onMouseLeave={() => setProfileOpen(false)}
          >
            <button
              type="button"
              onClick={() => setProfileOpen((current) => !current)}
              className="flex items-center gap-3 rounded-full border border-gray-200 bg-white px-3 py-2 transition hover:bg-gray-50"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-white">
                <User size={18} />
              </div>

              <div className="hidden text-left sm:block">
                <p className="max-w-40 truncate text-sm font-bold text-gray-800">
                  {user.name}
                </p>

                <p className="text-[11px] capitalize text-gray-400">
                  {user.role}
                </p>
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full z-50 w-64 pt-2">
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                  <div className="border-b border-gray-100 px-4 py-4">
                    <p className="truncate text-sm font-bold text-gray-800">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-400">
                      {user.email}
                    </p>
                  </div>

                  <div className="p-2">
                    <Link
                      to={dashboardPath}
                      onClick={() => setProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 hover:text-black"
                    >
                      <LayoutDashboard size={18} />
                      Masuk ke Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      <LogOut size={18} />
                      Keluar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="mx-auto mt-20 w-full max-w-4xl px-4 text-center">
        <h1 className="mb-6 text-4xl font-black uppercase tracking-tight md:text-5xl">
          Temukan Inspirasi Temukan Kreator
        </h1>

        <p className="mb-10 text-lg font-medium text-gray-700">
          Jelajahi ribuan karya desain dari kreator terbaik Indonesia.
        </p>

        <div className="relative mx-auto flex max-w-3xl items-center">
          <input
            type="text"
            placeholder="Cari desain/kreator yang Anda suka"
            className="h-14 w-full rounded-full border border-gray-300 pl-6 pr-32 text-sm font-medium outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-gray-200"
          />

          <button
            type="button"
            className="absolute bottom-2 right-2 top-2 rounded-full bg-black px-8 text-sm font-bold text-white transition-colors hover:bg-gray-800"
          >
            Cari
          </button>
        </div>
      </section>

      {/* Filters */}
      <section className="mx-auto mt-20 flex w-full max-w-7xl items-center justify-between px-8">
        <div className="flex flex-wrap items-center gap-3">
          {["Semua Karya", "Web Design", "Dashboard", "Logo", "3D"].map(
            (category) => (
              <button
                key={category}
                type="button"
                className="rounded-full border border-gray-200 px-6 py-2 text-sm font-bold transition-colors hover:bg-gray-50"
              >
                {category}
              </button>
            ),
          )}

          <button
            type="button"
            className="flex items-center space-x-2 rounded-full border border-gray-200 px-6 py-2 text-sm font-bold transition-colors hover:bg-gray-50"
          >
            <span>Lainnya</span>
            <ChevronDown size={16} />
          </button>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 transition-colors hover:bg-gray-50"
        >
          <SlidersHorizontal size={18} />
        </button>
      </section>

      {/* Grid Gallery */}
      <section id="karya" className="mx-auto mt-10 w-full max-w-7xl px-8 pb-20">
        <div className="columns-1 gap-6 space-y-6 sm:columns-2 md:columns-3 lg:columns-4">
          {mockImages.map((src, index) => (
            <div
              key={src}
              className="group relative cursor-pointer break-inside-avoid"
            >
              <img
                src={src}
                alt={`Artwork ${index + 1}`}
                className="h-auto w-full rounded-[20px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />

              <div className="absolute bottom-4 left-4">
                <img
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop"
                  alt="Creator Avatar"
                  className="h-8 w-8 rounded-full border-2 border-white object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button
            type="button"
            className="rounded-full border border-gray-300 px-10 py-3 text-sm font-bold transition-colors hover:bg-gray-50"
          >
            Memuat
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-auto flex w-full max-w-7xl flex-col items-center justify-between border-t border-gray-100 px-8 py-10 md:flex-row">
        <div className="mb-6 md:mb-0">
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-black">
            ETCH
          </h2>
        </div>

        <div className="mb-6 flex items-center space-x-12 md:mb-0">
          <a
            href="#"
            className="text-sm font-bold transition-colors hover:text-gray-600"
          >
            Tentang
          </a>

          <a
            href="#"
            className="text-sm font-bold transition-colors hover:text-gray-600"
          >
            Karir
          </a>

          <a
            href="#"
            className="text-sm font-bold transition-colors hover:text-gray-600"
          >
            Bantuan
          </a>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="#"
            aria-label="Facebook"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
          >
            <FacebookIcon />
          </a>

          <a
            href="#"
            aria-label="X"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
          >
            <XIcon />
          </a>

          <a
            href="#"
            aria-label="Instagram"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white transition-colors hover:bg-gray-800"
          >
            <InstagramIcon />
          </a>
        </div>
      </footer>
    </div>
  );
}
