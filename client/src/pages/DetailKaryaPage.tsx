import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  ChevronDown,
  ExternalLink,
  Eye,
  FolderOpen,
  Heart,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  MapPin,
  User,
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

type WorkCategory = {
  id: number | null;
  name: string;
  slug: string;
};

type WorkCreator = {
  id: number;
  name: string;
  slug: string;
  expertise: string;
  location: string;
  profile_photo: string | null;
  profile_photo_url: string | null;
};

type WorkDetail = {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  thumbnail_url: string | null;
  project_url: string | null;
  likes_count: number;
  views_count: number;
  category: WorkCategory | null;
  creator: WorkCreator;
  created_at: string;
  updated_at: string;
};

type RelatedWork = {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  thumbnail_url: string | null;
  likes_count: number;
  views_count: number;

  category: {
    name: string;
    slug: string;
  } | null;

  created_at: string;
};

type WorkDetailResponse = {
  success: boolean;
  message: string;

  data?: {
    work: WorkDetail;
    related_works: RelatedWork[];
  };
};

type WorkViewResponse = {
  success: boolean;
  message: string;

  data?: {
    work_id: number;
    views_count: number;
  };
};

type WorkLikeResponse = {
  success: boolean;
  message: string;

  data?: {
    work_id: number;
    liked: boolean;
    likes_count: number;
  };
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

const formatNumber = (value: number) => {
  return new Intl.NumberFormat("id-ID").format(value);
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export function DetailKaryaPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const [profileOpen, setProfileOpen] = useState(false);

  const [work, setWork] = useState<WorkDetail | null>(null);

  const [relatedWorks, setRelatedWorks] = useState<RelatedWork[]>([]);

  const [liked, setLiked] = useState(false);

  const [likeLoading, setLikeLoading] = useState(false);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);

  const dashboardPath =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/creator";

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  const creatorInitial =
    work?.creator.name?.trim().charAt(0).toUpperCase() || "C";

  const verifyAuthentication = useCallback(async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      setUser(null);
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

        setUser(null);
        return;
      }

      const storedUser = getStoredUser();

      const updatedUser: AuthUser = {
        ...(storedUser ?? {}),
        ...result.data,

        profile_photo_url:
          storedUser?.profile_photo_url ||
          result.data.profile_photo_url ||
          null,
      };

      localStorage.setItem("kreasihub_user", JSON.stringify(updatedUser));

      setUser(updatedUser);
    } catch (requestError) {
      console.error("Verify authentication error:", requestError);
    }
  }, []);

  const loadWork = useCallback(async () => {
    if (!slug) {
      setError("Slug karya tidak ditemukan.");

      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `${API_URL}/api/public/works/${encodeURIComponent(slug)}`,
        {
          method: "GET",

          headers: {
            Accept: "application/json",
          },
        },
      );

      const result = (await response.json()) as WorkDetailResponse;

      if (!response.ok || !result.success || !result.data) {
        setWork(null);
        setRelatedWorks([]);

        setError(result.message || "Detail karya gagal diambil.");

        return;
      }

      setWork(result.data.work);

      setRelatedWorks(result.data.related_works);
    } catch (requestError) {
      console.error("Load work detail error:", requestError);

      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    void verifyAuthentication();
  }, [verifyAuthentication]);

  useEffect(() => {
    void loadWork();
  }, [loadWork]);

  useEffect(() => {
    if (!work) {
      return;
    }

    const storageKey = `kreasihub_viewed_work_${work.id}`;

    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    sessionStorage.setItem(storageKey, "1");

    const registerView = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/public/works/${encodeURIComponent(work.slug)}/view`,
          {
            method: "POST",

            headers: {
              Accept: "application/json",
            },
          },
        );

        const result = (await response.json()) as WorkViewResponse;

        if (!response.ok || !result.success || !result.data) {
          sessionStorage.removeItem(storageKey);

          return;
        }

        setWork((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            views_count: result.data?.views_count ?? current.views_count,
          };
        });
      } catch (requestError) {
        console.error("Register work view error:", requestError);

        sessionStorage.removeItem(storageKey);
      }
    };

    void registerView();
  }, [work?.id, work?.slug]);

  useEffect(() => {
    if (!work || !user) {
      setLiked(false);
      return;
    }

    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      setLiked(false);
      return;
    }

    const loadLikeStatus = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/work-likes/${work.id}/status`,
          {
            method: "GET",

            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );

        const result = (await response.json()) as WorkLikeResponse;

        if (response.status === 401) {
          localStorage.removeItem("kreasihub_token");

          localStorage.removeItem("kreasihub_user");

          setUser(null);
          setLiked(false);
          return;
        }

        if (!response.ok || !result.success || !result.data) {
          return;
        }

        setLiked(result.data.liked);

        setWork((current) => {
          if (!current) {
            return current;
          }

          return {
            ...current,

            likes_count: result.data?.likes_count ?? current.likes_count,
          };
        });
      } catch (requestError) {
        console.error("Load like status error:", requestError);
      }
    };

    void loadLikeStatus();
  }, [work?.id, user?.id]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setMessage(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [message]);

  const handleLike = async () => {
    if (!work) {
      return;
    }

    const token = localStorage.getItem("kreasihub_token");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    try {
      setLikeLoading(true);
      setMessage(null);

      const response = await fetch(`${API_URL}/api/work-likes/${work.id}`, {
        method: liked ? "DELETE" : "POST",

        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as WorkLikeResponse;

      if (response.status === 401) {
        localStorage.removeItem("kreasihub_token");

        localStorage.removeItem("kreasihub_user");

        setUser(null);
        navigate("/login");

        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setMessage(result.message || "Status suka gagal diperbarui.");

        return;
      }

      setLiked(result.data.liked);

      setWork((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,

          likes_count: result.data?.likes_count ?? current.likes_count,
        };
      });

      setMessage(result.message);
    } catch (requestError) {
      console.error("Update work like error:", requestError);

      setMessage("Tidak dapat terhubung ke server.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("kreasihub_token");

    localStorage.removeItem("kreasihub_user");

    setUser(null);
    setLiked(false);
    setProfileOpen(false);

    navigate("/", {
      replace: true,
    });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="flex items-center gap-3 text-sm font-semibold text-gray-400">
          <LoaderCircle size={22} className="animate-spin" />
          Memuat detail karya...
        </div>
      </div>
    );
  }

  if (error || !work) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <XCircle size={48} className="text-rose-500" />

        <h1 className="mt-5 text-2xl font-black text-gray-900">
          Karya tidak ditemukan
        </h1>

        <p className="mt-2 text-sm text-gray-500">{error}</p>

        <Link
          to="/"
          className="mt-6 rounded-full bg-black px-7 py-3 text-sm font-bold text-white"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8 md:py-6">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            to="/"
            className="text-3xl font-black italic uppercase tracking-tighter text-black transition hover:opacity-80"
          >
            ETCH
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link to="/" className="text-sm font-bold text-black">
              Jelajahi
            </Link>

            <Link
              to="/kreator"
              className="text-sm font-bold text-gray-400 transition hover:text-black"
            >
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
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              to="/register"
              className="text-sm font-bold transition hover:text-gray-600"
            >
              Daftar
            </Link>

            <Link
              to="/login"
              className="flex h-10 items-center rounded-lg bg-black px-6 text-sm font-bold text-white transition hover:bg-gray-800"
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
                  className="h-9 w-9 rounded-full object-cover"
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

      <main className="mx-auto w-full max-w-7xl flex-1 px-5 pb-20 md:px-8">
        <Link
          to="/"
          className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-black"
        >
          <ArrowLeft size={17} />
          Kembali ke Jelajahi
        </Link>

        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.5fr)_minmax(340px,0.7fr)]">
          <div className="overflow-hidden rounded-[28px] bg-gray-100">
            {work.thumbnail_url ? (
              <img
                src={work.thumbnail_url}
                alt={work.title}
                className="h-auto max-h-[760px] min-h-80 w-full object-contain"
              />
            ) : (
              <div className="flex min-h-[520px] items-center justify-center">
                <FolderOpen size={56} className="text-gray-300" />
              </div>
            )}
          </div>

          <aside className="self-start lg:sticky lg:top-6">
            {work.category && (
              <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-wider text-blue-600">
                {work.category.name}
              </span>
            )}

            <h1 className="mt-5 text-3xl font-black leading-tight md:text-4xl">
              {work.title}
            </h1>

            <div className="mt-6 flex items-center gap-4">
              <Link
                to={`/kreator/${work.creator.slug}`}
                className="flex min-w-0 items-center gap-3"
              >
                {work.creator.profile_photo_url ? (
                  <img
                    src={work.creator.profile_photo_url}
                    alt={work.creator.name}
                    className="h-12 w-12 flex-shrink-0 rounded-full bg-gray-100 object-cover"
                  />
                ) : (
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-black font-bold text-white">
                    {creatorInitial}
                  </div>
                )}

                <div className="min-w-0">
                  <p className="truncate text-sm font-bold transition hover:text-blue-600">
                    {work.creator.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-gray-400">
                    {work.creator.expertise || "Kreator"}
                  </p>
                </div>
              </Link>
            </div>

            {work.creator.location && (
              <p className="mt-4 flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={15} />
                {work.creator.location}
              </p>
            )}

            <div className="mt-7 flex items-center gap-6 border-y border-gray-100 py-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Heart size={17} />
                {formatNumber(work.likes_count)} suka
              </div>

              <div className="flex items-center gap-2 text-sm font-semibold text-gray-600">
                <Eye size={17} />
                {formatNumber(work.views_count)} dilihat
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <button
                type="button"
                onClick={() => void handleLike()}
                disabled={likeLoading}
                className={`flex h-12 flex-1 items-center justify-center gap-2 rounded-xl text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                  liked
                    ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {likeLoading ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : liked ? (
                  <Check size={17} />
                ) : (
                  <Heart size={17} />
                )}

                {likeLoading ? "Memproses..." : liked ? "Disukai" : "Suka"}
              </button>

              {work.project_url && (
                <a
                  href={work.project_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-300 bg-white px-5 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
                >
                  Kunjungi Proyek
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            {message && (
              <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600">
                {message}
              </div>
            )}

            <div className="mt-8">
              <h2 className="text-lg font-black">Tentang Karya</h2>

              <p className="mt-4 whitespace-pre-line text-sm leading-7 text-gray-600">
                {work.description || "Belum ada deskripsi karya."}
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2 border-t border-gray-100 pt-5 text-xs text-gray-400">
              <CalendarDays size={15} />
              Dipublikasikan {formatDate(work.created_at)}
            </div>
          </aside>
        </section>

        <section className="mt-20 border-t border-gray-100 pt-12">
          <div className="flex items-end justify-between gap-5">
            <div>
              <h2 className="text-2xl font-black">Karya Lainnya</h2>

              <p className="mt-2 text-sm text-gray-500">
                Karya lain dari {work.creator.name}.
              </p>
            </div>

            <Link
              to={`/kreator/${work.creator.slug}`}
              className="hidden text-sm font-bold text-blue-600 hover:underline sm:block"
            >
              Lihat Profil Kreator
            </Link>
          </div>

          {relatedWorks.length > 0 ? (
            <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedWorks.map((relatedWork) => (
                <Link
                  key={relatedWork.id}
                  to={`/karya/${relatedWork.slug}`}
                  className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                >
                  {relatedWork.thumbnail_url ? (
                    <img
                      src={relatedWork.thumbnail_url}
                      alt={relatedWork.title}
                      className="h-56 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-56 items-center justify-center bg-gray-100">
                      <FolderOpen size={38} className="text-gray-300" />
                    </div>
                  )}

                  <div className="p-5">
                    {relatedWork.category && (
                      <p className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        {relatedWork.category.name}
                      </p>
                    )}

                    <h3 className="mt-2 line-clamp-2 font-black">
                      {relatedWork.title}
                    </h3>

                    <div className="mt-4 flex gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Heart size={13} />

                        {relatedWork.likes_count}
                      </span>

                      <span className="flex items-center gap-1">
                        <Eye size={13} />

                        {relatedWork.views_count}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-8 flex min-h-48 flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-gray-50">
              <FolderOpen size={38} className="text-gray-300" />

              <p className="mt-3 text-sm text-gray-400">
                Belum ada karya lainnya.
              </p>
            </div>
          )}
        </section>
      </main>

      <footer className="mx-auto mt-auto flex w-full max-w-7xl items-center justify-between border-t border-gray-100 px-5 py-10 md:px-8">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">
          ETCH
        </h2>

        <p className="text-xs text-gray-400">© 2026 ETCH</p>
      </footer>
    </div>
  );
}
