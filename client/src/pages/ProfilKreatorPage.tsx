import { useCallback, useEffect, useMemo, useState } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Camera,
  Check,
  ChevronDown,
  CircleDot,
  Code2,
  Eye,
  FolderOpen,
  Globe2,
  Heart,
  LayoutDashboard,
  Link2,
  LoaderCircle,
  LogOut,
  MapPin,
  Palette,
  User,
  UserPlus,
  Users,
  XCircle,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "admin" | "creator";
  profile_photo_url?: string | null;
};

type AuthResponse = {
  success: boolean;
  message: string;
  data?: AuthUser;
};

type CreatorLinks = {
  portfolio: string | null;
  github: string | null;
  linkedin: string | null;
  instagram: string | null;
  behance: string | null;
  dribbble: string | null;
};

type CreatorStats = {
  projects: number;
  followers: number;
  likes: number;
  views: number;
};

type CreatorDetail = {
  id: number;
  name: string;
  slug: string;
  expertise: string;
  bio: string;
  location: string;
  profile_photo: string | null;
  profile_photo_url: string | null;
  links: CreatorLinks;
  stats: CreatorStats;
};

type CreatorWork = {
  id: number;

  category: {
    id: number;
    name: string;
    slug: string;
  } | null;

  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  thumbnail_url: string | null;
  project_url: string | null;
  likes_count: number;
  views_count: number;
  created_at: string;
  updated_at: string;
};

type CreatorDetailResponse = {
  success: boolean;
  message: string;
  data?: {
    creator: CreatorDetail;
    works: CreatorWork[];
  };
};

type FollowListResponse = {
  success: boolean;
  message: string;
  data?: {
    creator_ids: number[];
  };
};

type FollowActionResponse = {
  success: boolean;
  message: string;
  data?: {
    creator_id: number;
    following: boolean;
    followers_count: number;
  };
};

type ActiveTab = "works" | "reviews" | "popular" | "about";

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

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("id-ID").format(value);
};

const tabItems: Array<{
  value: ActiveTab;
  label: string;
}> = [
  {
    value: "works",
    label: "Karya",
  },
  {
    value: "reviews",
    label: "Review",
  },
  {
    value: "popular",
    label: "Populer",
  },
  {
    value: "about",
    label: "Tentang",
  },
];

export function ProfilKreatorPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const [profileOpen, setProfileOpen] = useState(false);

  const [creator, setCreator] = useState<CreatorDetail | null>(null);

  const [works, setWorks] = useState<CreatorWork[]>([]);

  const [activeTab, setActiveTab] = useState<ActiveTab>("works");

  const [following, setFollowing] = useState(false);

  const [followLoading, setFollowLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);

  const dashboardPath =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/creator";

  const ownProfile = Boolean(user && creator && user.id === creator.id);

  const creatorInitial = creator?.name?.trim().charAt(0).toUpperCase() || "C";

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  const coverUrl =
    works.find((work) => work.thumbnail_url)?.thumbnail_url || null;

  const popularWorks = useMemo(() => {
    return [...works].sort((first, second) => {
      if (second.likes_count !== first.likes_count) {
        return second.likes_count - first.likes_count;
      }

      return second.views_count - first.views_count;
    });
  }, [works]);

  const verifyAuthentication = useCallback(async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      setUser(null);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as AuthResponse;

      if (!response.ok || !result.success || !result.data) {
        localStorage.removeItem("kreasihub_token");

        localStorage.removeItem("kreasihub_user");

        setUser(null);
        return;
      }

      const storedUser = getStoredUser();

      const updatedUser: AuthUser = {
        ...(storedUser ?? {}),
        ...result.data,

        profile_photo_url: storedUser?.profile_photo_url || null,
      };

      localStorage.setItem("kreasihub_user", JSON.stringify(updatedUser));

      setUser(updatedUser);
    } catch (requestError) {
      console.error("Verify authentication error:", requestError);
    }
  }, []);

  const loadCreator = useCallback(async () => {
    if (!slug) {
      setError("Slug kreator tidak ditemukan.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/api/public/creators/${encodeURIComponent(slug)}`,
        {
          headers: {
            Accept: "application/json",
          },
        },
      );

      const result = (await response.json()) as CreatorDetailResponse;

      if (!response.ok || !result.success || !result.data) {
        setError(result.message || "Profil kreator gagal diambil.");

        return;
      }

      setCreator(result.data.creator);
      setWorks(result.data.works);
    } catch (requestError) {
      console.error("Load creator detail error:", requestError);

      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  const loadFollowingStatus = useCallback(async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token || !creator) {
      setFollowing(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/creator-follows`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as FollowListResponse;

      if (!response.ok || !result.success || !result.data) {
        return;
      }

      setFollowing(result.data.creator_ids.includes(creator.id));
    } catch (requestError) {
      console.error("Load follow status error:", requestError);
    }
  }, [creator]);

  useEffect(() => {
    void verifyAuthentication();
    void loadCreator();
  }, [verifyAuthentication, loadCreator]);

  useEffect(() => {
    void loadFollowingStatus();
  }, [loadFollowingStatus]);

  const handleFollow = async () => {
    if (!creator) {
      return;
    }

    const token = localStorage.getItem("kreasihub_token");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (ownProfile) {
      setMessage("Kamu tidak dapat mengikuti akun sendiri.");

      return;
    }

    try {
      setFollowLoading(true);
      setMessage(null);

      const response = await fetch(
        `${API_URL}/api/creator-follows/${creator.id}`,
        {
          method: following ? "DELETE" : "POST",

          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = (await response.json()) as FollowActionResponse;

      if (response.status === 401) {
        localStorage.removeItem("kreasihub_token");

        localStorage.removeItem("kreasihub_user");

        navigate("/login");
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setMessage(result.message || "Status mengikuti gagal diperbarui.");

        return;
      }

      setFollowing(result.data.following);

      setCreator((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,

          stats: {
            ...current.stats,

            followers: result.data?.followers_count ?? current.stats.followers,
          },
        };
      });

      setMessage(result.message);
    } catch (requestError) {
      console.error("Follow creator error:", requestError);

      setMessage("Tidak dapat terhubung ke server.");
    } finally {
      setFollowLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kreasihub_token");

    localStorage.removeItem("kreasihub_user");

    setUser(null);
    setProfileOpen(false);
    navigate("/", { replace: true });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-3 text-sm font-semibold text-gray-400">
          <LoaderCircle size={22} className="animate-spin" />
          Memuat profil kreator...
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <XCircle size={48} className="text-rose-500" />

        <h1 className="mt-5 text-2xl font-black text-gray-900">
          Profil kreator tidak ditemukan
        </h1>

        <p className="mt-2 text-sm text-gray-500">{error}</p>

        <Link
          to="/kreator"
          className="mt-6 rounded-full bg-black px-7 py-3 text-sm font-bold text-white"
        >
          Kembali ke Kreator
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-gray-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8">
        <div className="flex items-center gap-10">
          <Link
            to="/"
            className="text-3xl font-black italic uppercase tracking-tighter"
          >
            ETCH
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/"
              className="text-sm font-bold text-gray-400 hover:text-black"
            >
              Jelajahi
            </Link>

            <Link to="/kreator" className="text-sm font-bold text-black">
              Kreator
            </Link>

            <Link
              to="/komunitas"
              className="text-sm font-bold text-gray-400 transition hover:text-black"
            >
              Komunitas
            </Link>
          </nav>
        </div>

        {!user ? (
          <div className="flex items-center gap-5">
            <Link to="/register" className="text-sm font-bold">
              Daftar
            </Link>

            <Link
              to="/login"
              className="rounded-lg bg-black px-6 py-3 text-sm font-bold text-white"
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
              className="flex items-center gap-3 rounded-full border border-gray-200 px-3 py-2"
            >
              {user.profile_photo_url ? (
                <img
                  src={user.profile_photo_url}
                  alt={user.name}
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  {userInitial}
                </div>
              )}

              <div className="hidden text-left sm:block">
                <p className="max-w-36 truncate text-sm font-bold">
                  {user.name}
                </p>

                <p className="text-[10px] capitalize text-gray-400">
                  {user.role}
                </p>
              </div>

              <ChevronDown
                size={15}
                className={profileOpen ? "rotate-180" : ""}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-full z-50 w-64 pt-2">
                <div className="rounded-2xl border bg-white p-2 shadow-xl">
                  <Link
                    to={dashboardPath}
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold hover:bg-gray-50"
                  >
                    <LayoutDashboard size={18} />
                    Masuk ke Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-rose-500 hover:bg-rose-50"
                  >
                    <LogOut size={18} />
                    Keluar
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-20 md:px-8">
        <section
          className="relative h-52 overflow-hidden rounded-3xl bg-gradient-to-r from-stone-200 via-amber-100 to-stone-300 md:h-64"
          style={
            coverUrl
              ? {
                  backgroundImage: `linear-gradient(rgba(0,0,0,.15), rgba(0,0,0,.2)), url("${coverUrl}")`,
                  backgroundPosition: "center",
                  backgroundSize: "cover",
                }
              : undefined
          }
        />

        <section className="relative -mt-16 px-4 md:px-8">
          <div className="flex flex-col gap-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
              {creator.profile_photo_url ? (
                <img
                  src={creator.profile_photo_url}
                  alt={creator.name}
                  className="h-28 w-28 rounded-full border-4 border-white bg-gray-100 object-cover shadow"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-black text-4xl font-black text-white shadow">
                  {creatorInitial}
                </div>
              )}

              <div className="pb-2">
                <h1 className="text-2xl font-black md:text-3xl">
                  {creator.name}
                </h1>

                <p className="mt-1 font-semibold text-blue-600">
                  {creator.expertise || "Kreator"}
                </p>

                <p className="mt-2 flex items-center gap-1 text-sm text-gray-400">
                  <MapPin size={15} />
                  {creator.location || "Indonesia"}
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:items-end">
              <div className="grid grid-cols-3 gap-8">
                <ProfileStat value={creator.stats.projects} label="Karya" />

                <ProfileStat value={creator.stats.followers} label="Pengikut" />

                <ProfileStat value={creator.stats.likes} label="Suka" />
              </div>

              {ownProfile ? (
                <Link
                  to="/dashboard/creator/profil"
                  className="rounded-xl bg-black px-7 py-3 text-center text-sm font-bold text-white"
                >
                  Edit Profil
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => void handleFollow()}
                  disabled={followLoading}
                  className={`flex items-center justify-center gap-2 rounded-xl px-7 py-3 text-sm font-bold transition disabled:opacity-60 ${
                    following
                      ? "border border-gray-300 bg-white text-gray-700"
                      : "bg-black text-white"
                  }`}
                >
                  {followLoading ? (
                    <LoaderCircle size={17} className="animate-spin" />
                  ) : following ? (
                    <Check size={17} />
                  ) : (
                    <UserPlus size={17} />
                  )}

                  {followLoading
                    ? "Memproses..."
                    : following
                      ? "Mengikuti"
                      : "Ikuti"}
                </button>
              )}
            </div>
          </div>
        </section>

        {message && (
          <div className="mx-4 mt-5 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600 md:mx-8">
            {message}
          </div>
        )}

        <nav className="mt-8 flex flex-wrap gap-2 border-b border-gray-100 px-4 md:px-8">
          {tabItems.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setActiveTab(tab.value)}
              className={`border-b-2 px-5 py-4 text-sm font-bold transition ${
                activeTab === tab.value
                  ? "border-black text-black"
                  : "border-transparent text-gray-400 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="px-4 pt-8 md:px-8">
          {activeTab === "works" && <WorkGrid works={works} />}

          {activeTab === "popular" && <WorkGrid works={popularWorks} />}

          {activeTab === "reviews" && (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50 text-center">
              <User size={40} className="text-gray-300" />

              <h2 className="mt-4 font-bold">Belum ada review</h2>

              <p className="mt-2 text-sm text-gray-400">
                Review kreator akan tampil pada bagian ini.
              </p>
            </div>
          )}

          {activeTab === "about" && <AboutCreator creator={creator} />}
        </section>
      </main>

      <footer className="mx-auto flex w-full max-w-7xl items-center justify-between border-t px-8 py-10">
        <h2 className="text-3xl font-black italic">ETCH</h2>

        <p className="text-xs text-gray-400">© 2026 ETCH</p>
      </footer>
    </div>
  );
}

function ProfileStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-black">{formatNumber(value)}</p>

      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
        {label}
      </p>
    </div>
  );
}

function WorkGrid({ works }: { works: CreatorWork[] }) {
  if (works.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50">
        <FolderOpen size={42} className="text-gray-300" />

        <p className="mt-4 text-sm font-semibold text-gray-400">
          Belum ada karya publik.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {works.map((work) => (
        <Link
          key={work.id}
          to={`/karya/${work.slug}`}
          className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
        >
          {work.thumbnail_url ? (
            <div className="overflow-hidden">
              <img
                src={work.thumbnail_url}
                alt={work.title}
                className="h-64 w-full object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
          ) : (
            <div className="flex h-64 items-center justify-center bg-gray-100">
              <FolderOpen size={42} className="text-gray-300" />
            </div>
          )}

          <div className="p-5">
            {work.category?.name && (
              <p className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {work.category.name}
              </p>
            )}

            <h3 className="mt-2 text-lg font-black">{work.title}</h3>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-gray-500">
              {work.description || "Tidak ada deskripsi."}
            </p>

            <div className="mt-4 flex items-center gap-4 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Heart size={14} />
                {work.likes_count}
              </span>

              <span className="flex items-center gap-1">
                <Eye size={14} />
                {work.views_count}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

function AboutCreator({ creator }: { creator: CreatorDetail }) {
  const links: Array<{
    label: string;
    url: string | null;
    icon: LucideIcon;
  }> = [
    {
      label: "Portofolio",
      url: creator.links.portfolio,
      icon: Globe2,
    },
    {
      label: "GitHub",
      url: creator.links.github,
      icon: Code2,
    },
    {
      label: "LinkedIn",
      url: creator.links.linkedin,
      icon: Link2,
    },
    {
      label: "Instagram",
      url: creator.links.instagram,
      icon: Camera,
    },
    {
      label: "Behance",
      url: creator.links.behance,
      icon: Palette,
    },
    {
      label: "Dribbble",
      url: creator.links.dribbble,
      icon: CircleDot,
    },
  ];

  const availableLinks = links.filter((link) => link.url);

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      <div>
        <h2 className="text-xl font-black">Bio</h2>

        <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
          {creator.bio || "Kreator belum menambahkan bio."}
        </p>

        <h2 className="mt-10 text-xl font-black">Keahlian</h2>

        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-gray-200 px-4 py-2 text-sm font-semibold">
            {creator.expertise || "Kreator"}
          </span>
        </div>
      </div>

      <aside className="space-y-6">
        <div className="rounded-3xl border border-gray-100 p-6">
          <h3 className="font-black">Informasi</h3>

          <p className="mt-4 flex items-center gap-2 text-sm text-gray-500">
            <MapPin size={16} />
            {creator.location || "Indonesia"}
          </p>

          <p className="mt-3 flex items-center gap-2 text-sm text-gray-500">
            <Users size={16} />
            {formatNumber(creator.stats.followers)} pengikut
          </p>
        </div>

        <div className="rounded-3xl border border-gray-100 p-6">
          <h3 className="font-black">Tautan Profesional</h3>

          {availableLinks.length > 0 ? (
            <div className="mt-4 space-y-2">
              {availableLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.label}
                    href={link.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:text-black"
                  >
                    <Icon size={17} />
                    {link.label}
                  </a>
                );
              })}
            </div>
          ) : (
            <p className="mt-4 text-sm text-gray-400">
              Belum ada tautan profesional.
            </p>
          )}
        </div>
      </aside>
    </div>
  );
}
