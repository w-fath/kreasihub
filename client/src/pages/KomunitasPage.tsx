import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowRight,
  CalendarDays,
  ChevronDown,
  Clock,
  LayoutDashboard,
  LogOut,
  MapPin,
  MessageCircle,
  Search,
  Sparkles,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "creator";
  profile_photo?: string | null;
  profile_photo_url?: string | null;
};

type AuthResponse = {
  success: boolean;
  message: string;
  data?: AuthUser;
};

type Discussion = {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  expertise: string;
  replies: number;
  likes: number;
  time: string;
  featured: boolean;
};

type CommunityEvent = {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: string;
};

const categories = [
  "Semua",
  "Web Development",
  "UI/UX",
  "Kolaborasi",
  "Karier",
];

const discussions: Discussion[] = [
  {
    id: 1,
    title: "Bagaimana cara membangun portofolio web yang menarik?",
    excerpt:
      "Diskusi tentang penyusunan studi kasus, pemilihan karya terbaik, dan cara menampilkan proses pengembangan project.",
    category: "Web Development",
    author: "Rizky Pratama",
    expertise: "Frontend Developer",
    replies: 18,
    likes: 42,
    time: "2 jam lalu",
    featured: true,
  },
  {
    id: 2,
    title: "Mencari partner untuk project aplikasi UMKM",
    excerpt:
      "Saya sedang mencari UI/UX designer dan frontend developer untuk mengembangkan prototype aplikasi UMKM.",
    category: "Kolaborasi",
    author: "Nadia Putri",
    expertise: "Product Designer",
    replies: 12,
    likes: 27,
    time: "4 jam lalu",
    featured: true,
  },
  {
    id: 3,
    title: "Tips membuat desain dashboard yang tidak membingungkan",
    excerpt:
      "Bagaimana menentukan prioritas informasi, struktur navigasi, dan visualisasi data agar mudah dipahami pengguna?",
    category: "UI/UX",
    author: "Dimas Saputra",
    expertise: "UI/UX Designer",
    replies: 9,
    likes: 31,
    time: "Kemarin",
    featured: false,
  },
  {
    id: 4,
    title: "Persiapan wawancara kerja untuk junior developer",
    excerpt:
      "Bagikan pengalaman dan materi apa saja yang perlu dipelajari sebelum mengikuti wawancara teknis.",
    category: "Karier",
    author: "Alya Ramadhani",
    expertise: "Web Developer",
    replies: 24,
    likes: 56,
    time: "Kemarin",
    featured: false,
  },
  {
    id: 5,
    title: "Lebih baik menggunakan React atau Vue untuk project pertama?",
    excerpt:
      "Perbandingan dari sisi kurva belajar, kebutuhan project, ekosistem, dan peluang kerja untuk pemula.",
    category: "Web Development",
    author: "Bima Arya",
    expertise: "Backend Developer",
    replies: 30,
    likes: 64,
    time: "2 hari lalu",
    featured: false,
  },
  {
    id: 6,
    title: "Minta masukan untuk desain landing page portofolio",
    excerpt:
      "Saya baru menyelesaikan rancangan landing page dan membutuhkan masukan terkait tipografi serta konsistensi layout.",
    category: "UI/UX",
    author: "Salsa Amalia",
    expertise: "Graphic Designer",
    replies: 15,
    likes: 38,
    time: "3 hari lalu",
    featured: false,
  },
];

const communityEvents: CommunityEvent[] = [
  {
    id: 1,
    title: "Portfolio Review Session",
    date: "02 Agustus 2026",
    time: "19.00 WIB",
    location: "Online Meeting",
    description: "Sesi berbagi dan evaluasi portofolio bersama kreator lain.",
    type: "Review",
  },
  {
    id: 2,
    title: "Ngobrol Santai Frontend Developer",
    date: "08 Agustus 2026",
    time: "20.00 WIB",
    location: "Online Meeting",
    description:
      "Diskusi santai seputar React, UI implementation, dan pengalaman project.",
    type: "Diskusi",
  },
  {
    id: 3,
    title: "Creative Collaboration Day",
    date: "15 Agustus 2026",
    time: "09.00 WIB",
    location: "Surabaya",
    description:
      "Temukan partner dan ide baru untuk membangun project kreatif bersama.",
    type: "Kolaborasi",
  },
];

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

export function KomunitasPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const [profileOpen, setProfileOpen] = useState(false);

  const [searchInput, setSearchInput] = useState("");

  const [activeSearch, setActiveSearch] = useState("");

  const [activeCategory, setActiveCategory] = useState("Semua");

  const dashboardPath =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/creator";

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

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

        const storedUser = getStoredUser();

        const updatedUser: AuthUser = {
          ...(storedUser ?? {}),
          ...result.data,

          profile_photo: storedUser?.profile_photo || null,

          profile_photo_url:
            storedUser?.profile_photo_url ||
            result.data.profile_photo_url ||
            null,
        };

        localStorage.setItem("kreasihub_user", JSON.stringify(updatedUser));

        if (componentActive) {
          setUser(updatedUser);
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

  const filteredDiscussions = useMemo(() => {
    const normalizedSearch = activeSearch.trim().toLowerCase();

    return discussions.filter((discussion) => {
      const categoryMatches =
        activeCategory === "Semua" || discussion.category === activeCategory;

      const searchMatches =
        !normalizedSearch ||
        discussion.title.toLowerCase().includes(normalizedSearch) ||
        discussion.excerpt.toLowerCase().includes(normalizedSearch) ||
        discussion.author.toLowerCase().includes(normalizedSearch);

      return categoryMatches && searchMatches;
    });
  }, [activeCategory, activeSearch]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setActiveSearch(searchInput.trim());
  };

  const handleLogout = () => {
    localStorage.removeItem("kreasihub_token");

    localStorage.removeItem("kreasihub_user");

    setUser(null);
    setProfileOpen(false);

    navigate("/", {
      replace: true,
    });
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8 md:py-6">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            to="/"
            className="text-3xl font-black italic uppercase tracking-tighter text-black transition hover:opacity-75"
          >
            ETCH
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/"
              className="text-sm font-bold text-gray-400 transition hover:text-black"
            >
              Jelajahi
            </Link>

            <Link
              to="/kreator"
              className="text-sm font-bold text-gray-400 transition hover:text-black"
            >
              Kreator
            </Link>

            <Link to="/komunitas" className="text-sm font-bold text-black">
              Komunitas
            </Link>
          </nav>
        </div>

        {!user ? (
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/register"
              className="text-sm font-bold text-gray-600 transition hover:text-black"
            >
              Daftar
            </Link>

            <Link
              to="/login"
              className="flex h-10 items-center rounded-lg border border-black bg-black px-6 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              Masuk
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
              {user.profile_photo_url ? (
                <img
                  src={user.profile_photo_url}
                  alt={user.name}
                  className="h-9 w-9 rounded-full bg-gray-100 object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  {userInitial}
                </div>
              )}

              <div className="hidden text-left sm:block">
                <p className="max-w-40 truncate text-sm font-bold">
                  {user.name}
                </p>

                <p className="text-[10px] capitalize text-gray-400">
                  {user.role}
                </p>
              </div>

              <ChevronDown
                size={15}
                className={`transition ${profileOpen ? "rotate-180" : ""}`}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full z-50 w-64 pt-2">
                <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-xl">
                  <div className="border-b border-gray-100 px-4 py-4">
                    <p className="truncate text-sm font-bold">{user.name}</p>

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
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-500 transition hover:bg-rose-50"
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

      <main className="flex-1">
        <section className="mx-auto mt-10 w-full max-w-7xl px-5 md:mt-14 md:px-8">
          <div className="overflow-hidden rounded-[32px] bg-black px-6 py-14 text-white md:px-14 md:py-20">
            <div className="grid items-center gap-12 lg:grid-cols-[1fr_420px]">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-widest text-white/70">
                  <Sparkles size={14} />
                  Ruang Kreatif
                </div>

                <h1 className="mt-6 max-w-3xl text-4xl font-black uppercase leading-tight tracking-tight md:text-6xl">
                  Bertemu, Berdiskusi, dan Berkarya Bersama
                </h1>

                <p className="mt-6 max-w-2xl text-sm leading-7 text-white/60 md:text-base">
                  Ruang sederhana untuk berbagi pengalaman, menemukan inspirasi,
                  dan membangun kolaborasi bersama kreator lain.
                </p>

                <div className="mt-9 flex flex-wrap gap-3">
                  <a
                    href="#diskusi"
                    className="flex h-12 items-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-black transition hover:bg-gray-200"
                  >
                    Lihat Diskusi
                    <ArrowRight size={16} />
                  </a>

                  <Link
                    to="/kreator"
                    className="flex h-12 items-center rounded-full border border-white/30 px-7 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    Temukan Kreator
                  </Link>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <CommunityBenefit
                  icon={MessageCircle}
                  title="Diskusi"
                  description="Berbagi pengetahuan dan pengalaman."
                />

                <CommunityBenefit
                  icon={Users}
                  title="Kolaborasi"
                  description="Temukan partner untuk project baru."
                />

                <CommunityBenefit
                  icon={CalendarDays}
                  title="Event"
                  description="Ikuti kegiatan kreatif bersama."
                />
              </div>
            </div>
          </div>
        </section>

        <section
          id="diskusi"
          className="mx-auto mt-16 w-full max-w-7xl px-5 md:px-8"
        >
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
                Forum Komunitas
              </p>

              <h2 className="mt-3 text-3xl font-black uppercase tracking-tight">
                Diskusi Terbaru
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Temukan topik seputar pengembangan web, desain, karier, dan
                kolaborasi.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="relative flex w-full max-w-md items-center"
            >
              <Search size={17} className="absolute left-4 text-gray-400" />

              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Cari diskusi"
                className="h-12 w-full rounded-full border border-gray-200 pl-11 pr-24 text-sm outline-none transition focus:border-black focus:ring-4 focus:ring-gray-100"
              />

              <button
                type="submit"
                className="absolute bottom-1.5 right-1.5 top-1.5 rounded-full bg-black px-5 text-xs font-bold text-white transition hover:bg-gray-800"
              >
                Cari
              </button>
            </form>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                  activeCategory === category
                    ? "border-black bg-black text-white"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {filteredDiscussions.map((discussion) => (
              <article
                key={discussion.id}
                className="rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-gray-500">
                    {discussion.category}
                  </span>

                  {discussion.featured && (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-500">
                      <TrendingUp size={14} />
                      Populer
                    </span>
                  )}
                </div>

                <h3 className="mt-5 text-xl font-black leading-7">
                  {discussion.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-500">
                  {discussion.excerpt}
                </p>

                <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-5">
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-black text-xs font-bold text-white">
                      {discussion.author.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold">
                        {discussion.author}
                      </p>

                      <p className="truncate text-xs text-gray-400">
                        {discussion.expertise}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-semibold text-gray-400">
                    <span className="flex items-center gap-1">
                      <MessageCircle size={14} />

                      {discussion.replies}
                    </span>

                    <span>{discussion.time}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {filteredDiscussions.length === 0 && (
            <div className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 text-center">
              <Search size={40} className="text-gray-300" />

              <h3 className="mt-4 font-bold">Diskusi tidak ditemukan</h3>

              <p className="mt-2 text-sm text-gray-400">
                Coba gunakan kata kunci atau kategori lainnya.
              </p>
            </div>
          )}
        </section>

        <section className="mx-auto mt-20 w-full max-w-7xl px-5 md:px-8">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.25em] text-gray-400">
              Agenda
            </p>

            <h2 className="mt-3 text-3xl font-black uppercase tracking-tight">
              Event Komunitas
            </h2>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {communityEvents.map((event) => (
              <article
                key={event.id}
                className="overflow-hidden rounded-3xl border border-gray-200 bg-white"
              >
                <div className="bg-black p-6 text-white">
                  <span className="rounded-full border border-white/20 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white/70">
                    {event.type}
                  </span>

                  <h3 className="mt-5 text-xl font-black">{event.title}</h3>
                </div>

                <div className="p-6">
                  <p className="text-sm leading-6 text-gray-500">
                    {event.description}
                  </p>

                  <div className="mt-6 space-y-3 text-sm font-semibold text-gray-600">
                    <p className="flex items-center gap-3">
                      <CalendarDays size={17} />

                      {event.date}
                    </p>

                    <p className="flex items-center gap-3">
                      <Clock size={17} />

                      {event.time}
                    </p>

                    <p className="flex items-center gap-3">
                      <MapPin size={17} />

                      {event.location}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto my-20 w-full max-w-7xl px-5 md:px-8">
          <div className="flex flex-col items-center justify-between gap-8 rounded-[32px] bg-gray-100 px-7 py-12 text-center md:flex-row md:px-12 md:text-left">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight">
                Mulai Berkarya Bersama
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Buat profil kreator, publikasikan karya, dan temukan peluang
                kolaborasi.
              </p>
            </div>

            <Link
              to={user ? dashboardPath : "/register"}
              className="flex h-12 flex-shrink-0 items-center gap-2 rounded-full bg-black px-7 text-sm font-bold text-white transition hover:bg-gray-800"
            >
              {user ? "Masuk Dashboard" : "Gabung Sekarang"}

              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <footer className="mx-auto mt-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 border-t border-gray-100 px-5 py-10 md:flex-row md:px-8">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">
          ETCH
        </h2>

        <div className="flex items-center gap-8 text-sm font-bold">
          <Link to="/" className="transition hover:text-gray-500">
            Jelajahi
          </Link>

          <Link to="/kreator" className="transition hover:text-gray-500">
            Kreator
          </Link>

          <Link to="/komunitas" className="transition hover:text-gray-500">
            Komunitas
          </Link>
        </div>

        <p className="text-xs text-gray-400">© 2026 ETCH</p>
      </footer>
    </div>
  );
}

function CommunityBenefit({
  icon: Icon,
  title,
  description,
}: {
  icon: typeof Users;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black">
        <Icon size={18} />
      </div>

      <h3 className="mt-4 font-black">{title}</h3>

      <p className="mt-2 text-xs leading-5 text-white/50">{description}</p>
    </div>
  );
}
