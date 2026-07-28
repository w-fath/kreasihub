import { useCallback, useEffect, useState, type FormEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Eye,
  FolderOpen,
  Heart,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  MapPin,
  Search,
  User,
  UserPlus,
  Users,
  XCircle,
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

type CreatorWork = {
  id: number;
  category_id: number | null;
  title: string;
  slug: string;
  description: string;
  thumbnail: string | null;
  thumbnail_url: string | null;
  project_url: string | null;
  likes_count: number;
  views_count: number;
  created_at: string;
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

type PublicCreator = {
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
  works: CreatorWork[];
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_previous_page: boolean;
  has_next_page: boolean;
};

type PublicCreatorsResponse = {
  success: boolean;
  message: string;
  data?: {
    creators: PublicCreator[];

    filters: {
      search: string;
      expertise: string;
    };

    pagination: Pagination;
  };
};

type ExpertiseItem = {
  name: string;
  creators_count: number;
};

type ExpertiseResponse = {
  success: boolean;
  message: string;
  data?: {
    featured: ExpertiseItem[];
    others: ExpertiseItem[];
    total: number;
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

const initialPagination: Pagination = {
  page: 1,
  limit: 8,
  total: 0,
  total_pages: 0,
  has_previous_page: false,
  has_next_page: false,
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

export function KreatorPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const [profileOpen, setProfileOpen] = useState(false);

  const [creators, setCreators] = useState<PublicCreator[]>([]);

  const [featuredExpertises, setFeaturedExpertises] = useState<ExpertiseItem[]>(
    [],
  );

  const [otherExpertises, setOtherExpertises] = useState<ExpertiseItem[]>([]);

  const [otherOpen, setOtherOpen] = useState(false);

  const [pagination, setPagination] = useState<Pagination>(initialPagination);

  const [followingIds, setFollowingIds] = useState<Set<number>>(
    () => new Set(),
  );

  const [followLoadingIds, setFollowLoadingIds] = useState<Set<number>>(
    () => new Set(),
  );

  const [searchInput, setSearchInput] = useState("");

  const [activeSearch, setActiveSearch] = useState("");

  const [activeExpertise, setActiveExpertise] = useState("");

  const [page, setPage] = useState(1);

  const [loading, setLoading] = useState(true);

  const [loadingExpertises, setLoadingExpertises] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const [followMessage, setFollowMessage] = useState<string | null>(null);

  const dashboardPath =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/creator";

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  const activeExpertiseIsOther = otherExpertises.some(
    (item) => item.name === activeExpertise,
  );

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

        profile_photo: storedUser?.profile_photo || null,

        profile_photo_url: storedUser?.profile_photo_url || null,
      };

      localStorage.setItem("kreasihub_user", JSON.stringify(updatedUser));

      setUser(updatedUser);
    } catch (requestError) {
      console.error("Verify authentication error:", requestError);
    }
  }, []);

  const loadExpertises = useCallback(async () => {
    try {
      setLoadingExpertises(true);

      const response = await fetch(`${API_URL}/api/public/creator-expertises`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = (await response.json()) as ExpertiseResponse;

      if (!response.ok || !result.success || !result.data) {
        setFeaturedExpertises([]);
        setOtherExpertises([]);
        return;
      }

      setFeaturedExpertises(result.data.featured);

      setOtherExpertises(result.data.others);
    } catch (requestError) {
      console.error("Load creator expertises error:", requestError);

      setFeaturedExpertises([]);
      setOtherExpertises([]);
    } finally {
      setLoadingExpertises(false);
    }
  }, []);

  const loadCreators = useCallback(
    async (requestedPage: number, search: string, expertise: string) => {
      try {
        setLoading(true);
        setError(null);

        const query = new URLSearchParams({
          page: String(requestedPage),
          limit: "8",
        });

        if (search) {
          query.set("search", search);
        }

        if (expertise) {
          query.set("expertise", expertise);
        }

        const response = await fetch(
          `${API_URL}/api/public/creators?${query.toString()}`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          },
        );

        const result = (await response.json()) as PublicCreatorsResponse;

        if (!response.ok || !result.success || !result.data) {
          setCreators([]);
          setPagination(initialPagination);

          setError(result.message || "Daftar kreator gagal diambil.");

          return;
        }

        setCreators(result.data.creators);

        setPagination(result.data.pagination);
      } catch (requestError) {
        console.error("Load public creators error:", requestError);

        setCreators([]);
        setPagination(initialPagination);

        setError("Tidak dapat terhubung ke server.");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const loadFollowingCreators = useCallback(async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      setFollowingIds(new Set());
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/creator-follows`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as FollowListResponse;

      if (!response.ok || !result.success || !result.data) {
        setFollowingIds(new Set());
        return;
      }

      setFollowingIds(new Set(result.data.creator_ids));
    } catch (requestError) {
      console.error("Load followed creators error:", requestError);

      setFollowingIds(new Set());
    }
  }, []);

  useEffect(() => {
    void verifyAuthentication();
    void loadExpertises();
  }, [verifyAuthentication, loadExpertises]);

  useEffect(() => {
    void loadCreators(page, activeSearch, activeExpertise);
  }, [page, activeSearch, activeExpertise, loadCreators]);

  useEffect(() => {
    if (user) {
      void loadFollowingCreators();
    } else {
      setFollowingIds(new Set());
    }
  }, [user, loadFollowingCreators]);

  useEffect(() => {
    if (!followMessage) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setFollowMessage(null);
    }, 3000);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [followMessage]);

  const handleLogout = () => {
    localStorage.removeItem("kreasihub_token");

    localStorage.removeItem("kreasihub_user");

    setUser(null);
    setProfileOpen(false);
    setFollowingIds(new Set());

    navigate("/", {
      replace: true,
    });
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setPage(1);

    setActiveSearch(searchInput.trim());
  };

  const handleExpertiseFilter = (expertise: string) => {
    setPage(1);
    setActiveExpertise(expertise);
    setOtherOpen(false);
  };

  const handleFollow = async (creator: PublicCreator) => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.id === creator.id) {
      setFollowMessage("Kamu tidak dapat mengikuti akun sendiri.");

      return;
    }

    const currentlyFollowing = followingIds.has(creator.id);

    setFollowLoadingIds((current) => {
      const updated = new Set(current);

      updated.add(creator.id);

      return updated;
    });

    setFollowMessage(null);

    try {
      const response = await fetch(
        `${API_URL}/api/creator-follows/${creator.id}`,
        {
          method: currentlyFollowing ? "DELETE" : "POST",

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

        setUser(null);
        navigate("/login");

        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setFollowMessage(
          result.message || "Status mengikuti gagal diperbarui.",
        );

        return;
      }

      setFollowingIds((current) => {
        const updated = new Set(current);

        if (result.data?.following) {
          updated.add(creator.id);
        } else {
          updated.delete(creator.id);
        }

        return updated;
      });

      setCreators((current) =>
        current.map((item) => {
          if (item.id !== creator.id) {
            return item;
          }

          return {
            ...item,

            stats: {
              ...item.stats,

              followers: result.data?.followers_count ?? item.stats.followers,
            },
          };
        }),
      );

      setFollowMessage(result.message);
    } catch (requestError) {
      console.error("Update creator follow error:", requestError);

      setFollowMessage("Tidak dapat terhubung ke server.");
    } finally {
      setFollowLoadingIds((current) => {
        const updated = new Set(current);

        updated.delete(creator.id);

        return updated;
      });
    }
  };

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
            <Link
              to="/"
              className="text-sm font-bold text-gray-400 transition hover:text-black"
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
                  className="h-9 w-9 rounded-full bg-gray-100 object-cover"
                />
              ) : (
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
                  {userInitial}
                </div>
              )}

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
                className={`text-gray-500 transition ${
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

      <section className="mx-auto mt-12 w-full max-w-4xl px-5 text-center md:mt-16">
        <h1 className="mb-6 text-4xl font-black uppercase tracking-tight md:text-5xl">
          Temukan Inspirasi Temukan Kreator
        </h1>

        <p className="mb-10 text-base font-medium text-gray-600 md:text-lg">
          Jelajahi karya dan profil kreator terbaik dari berbagai bidang
          kreatif.
        </p>

        <form
          onSubmit={handleSearch}
          className="relative mx-auto flex max-w-3xl items-center"
        >
          <Search size={19} className="absolute left-5 text-gray-400" />

          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Cari nama, keahlian, atau lokasi kreator"
            className="h-14 w-full rounded-full border border-gray-300 pl-14 pr-28 text-sm font-medium outline-none placeholder:text-gray-400 focus:border-gray-400 focus:ring-4 focus:ring-gray-100 sm:pr-36"
          />

          <button
            type="submit"
            className="absolute bottom-2 right-2 top-2 rounded-full bg-black px-6 text-sm font-bold text-white transition hover:bg-gray-800 sm:px-8"
          >
            Cari
          </button>
        </form>
      </section>

      <section className="mx-auto mt-12 w-full max-w-7xl px-5 md:mt-16 md:px-8">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => handleExpertiseFilter("")}
            className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
              !activeExpertise
                ? "border-black bg-black text-white"
                : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Semua Kreator
          </button>

          {loadingExpertises ? (
            <div className="flex items-center gap-2 px-3 text-sm text-gray-400">
              <LoaderCircle size={16} className="animate-spin" />
              Memuat keahlian...
            </div>
          ) : (
            <>
              {featuredExpertises.map((expertise) => (
                <button
                  key={expertise.name}
                  type="button"
                  onClick={() => handleExpertiseFilter(expertise.name)}
                  className={`rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                    activeExpertise === expertise.name
                      ? "border-black bg-black text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  {expertise.name}
                </button>
              ))}

              {otherExpertises.length > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setOtherOpen((current) => !current)}
                    className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold transition ${
                      activeExpertiseIsOther
                        ? "border-black bg-black text-white"
                        : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <span>
                      {activeExpertiseIsOther ? activeExpertise : "Lainnya"}
                    </span>

                    <ChevronDown
                      size={15}
                      className={`transition ${otherOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {otherOpen && (
                    <div className="absolute left-0 top-full z-40 mt-2 min-w-56 overflow-hidden rounded-2xl border border-gray-100 bg-white p-2 shadow-xl">
                      {otherExpertises.map((expertise) => (
                        <button
                          key={expertise.name}
                          type="button"
                          onClick={() => handleExpertiseFilter(expertise.name)}
                          className={`flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3 text-left text-sm font-semibold transition ${
                            activeExpertise === expertise.name
                              ? "bg-black text-white"
                              : "text-gray-600 hover:bg-gray-50"
                          }`}
                        >
                          <span>{expertise.name}</span>

                          <span className="text-xs opacity-60">
                            {expertise.creators_count}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="mt-6 flex flex-col justify-between gap-3 border-b border-gray-100 pb-4 sm:flex-row sm:items-center">
          <p className="text-sm text-gray-500">
            {loading
              ? "Memuat kreator..."
              : `${formatNumber(pagination.total)} kreator ditemukan`}
          </p>

          {(activeSearch || activeExpertise) && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                setActiveSearch("");
                setActiveExpertise("");
                setPage(1);
              }}
              className="text-left text-sm font-semibold text-blue-600 hover:underline"
            >
              Hapus pencarian dan filter
            </button>
          )}
        </div>

        {followMessage && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-600">
            {followMessage}
          </div>
        )}
      </section>

      <section className="mx-auto mt-8 w-full max-w-7xl flex-1 px-5 pb-20 md:px-8">
        {error && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-rose-100 bg-rose-50 px-6 text-center">
            <XCircle size={38} className="text-rose-500" />

            <h2 className="mt-4 text-lg font-bold text-rose-700">
              Daftar kreator gagal dimuat
            </h2>

            <p className="mt-2 text-sm text-rose-500">{error}</p>

            <button
              type="button"
              onClick={() =>
                void loadCreators(page, activeSearch, activeExpertise)
              }
              className="mt-5 rounded-full bg-rose-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-rose-700"
            >
              Coba Lagi
            </button>
          </div>
        )}

        {!error && loading && (
          <div className="flex min-h-80 items-center justify-center">
            <div className="flex items-center gap-3 text-sm font-semibold text-gray-400">
              <LoaderCircle size={22} className="animate-spin" />
              Memuat daftar kreator...
            </div>
          </div>
        )}

        {!error && !loading && creators.length === 0 && (
          <div className="flex min-h-80 flex-col items-center justify-center rounded-3xl border border-gray-100 bg-gray-50 px-6 text-center">
            <User size={42} className="text-gray-300" />

            <h2 className="mt-4 text-lg font-bold text-gray-800">
              Kreator tidak ditemukan
            </h2>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-400">
              Belum ada kreator yang sesuai dengan pencarian atau filter yang
              dipilih.
            </p>
          </div>
        )}

        {!error && !loading && creators.length > 0 && (
          <div className="space-y-7">
            {creators.map((creator) => {
              const creatorInitial =
                creator.name.trim().charAt(0).toUpperCase() || "C";

              const following = followingIds.has(creator.id);

              const followLoading = followLoadingIds.has(creator.id);

              const ownAccount = user?.id === creator.id;

              return (
                <article
                  key={creator.id}
                  className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md md:flex-row md:p-6"
                >
                  <div className="flex w-full flex-shrink-0 flex-col md:w-72">
                    <div className="flex items-center gap-4">
                      {creator.profile_photo_url ? (
                        <img
                          src={creator.profile_photo_url}
                          alt={creator.name}
                          className="h-16 w-16 flex-shrink-0 rounded-full border border-gray-100 bg-gray-100 object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-xl font-bold text-white">
                          {creatorInitial}
                        </div>
                      )}

                      <div className="min-w-0">
                        <Link
                          to={`/kreator/${creator.slug}`}
                          className="block truncate text-lg font-bold text-gray-900 transition hover:text-blue-600"
                        >
                          {creator.name}
                        </Link>

                        <p className="mt-1 truncate text-sm font-medium text-blue-600">
                          {creator.expertise || "Kreator"}
                        </p>

                        <div className="mt-1 flex items-center text-xs text-gray-400">
                          <MapPin size={13} className="mr-1 flex-shrink-0" />

                          <span className="truncate">
                            {creator.location || "Indonesia"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-3 divide-x divide-gray-100 rounded-2xl bg-gray-50 py-4">
                      <CreatorStat
                        icon={FolderOpen}
                        value={creator.stats.projects}
                        label="Karya"
                      />

                      <CreatorStat
                        icon={Users}
                        value={creator.stats.followers}
                        label="Pengikut"
                      />

                      <CreatorStat
                        icon={Heart}
                        value={creator.stats.likes}
                        label="Suka"
                      />
                    </div>

                    <div className="mt-6 flex gap-3">
                      {ownAccount ? (
                        <Link
                          to={`/kreator/${creator.slug}`}
                          className="flex h-11 flex-1 items-center justify-center rounded-xl bg-black px-4 text-sm font-bold text-white transition hover:bg-gray-800"
                        >
                          Profil Saya
                        </Link>
                      ) : (
                        <button
                          type="button"
                          disabled={followLoading}
                          onClick={() => void handleFollow(creator)}
                          className={`flex h-11 flex-1 items-center justify-center gap-2 rounded-xl px-4 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${
                            following
                              ? "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                              : "bg-black text-white hover:bg-gray-800"
                          }`}
                        >
                          {followLoading ? (
                            <LoaderCircle size={16} className="animate-spin" />
                          ) : following ? (
                            <Check size={16} />
                          ) : (
                            <UserPlus size={16} />
                          )}

                          {followLoading
                            ? "Memproses..."
                            : following
                              ? "Mengikuti"
                              : "Ikuti"}
                        </button>
                      )}

                      <Link
                        to={`/kreator/${creator.slug}`}
                        className="flex h-11 items-center justify-center rounded-xl border border-gray-200 px-4 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                      >
                        Profil
                      </Link>
                    </div>
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="grid min-h-52 grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {creator.works.map((work) => (
                        <Link
                          key={work.id}
                          to={`/karya/${work.slug}`}
                          className="group relative min-h-52 overflow-hidden rounded-2xl bg-gray-100"
                        >
                          {work.thumbnail_url ? (
                            <img
                              src={work.thumbnail_url}
                              alt={work.title}
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full min-h-52 items-center justify-center">
                              <FolderOpen size={35} className="text-gray-300" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                            <h3 className="line-clamp-2 text-sm font-bold">
                              {work.title}
                            </h3>

                            <div className="mt-2 flex items-center gap-3 text-[11px] text-white/80">
                              <span className="flex items-center gap-1">
                                <Heart size={12} />
                                {work.likes_count}
                              </span>

                              <span className="flex items-center gap-1">
                                <Eye size={12} />
                                {work.views_count}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}

                      {creator.works.length === 0 && (
                        <div className="col-span-full flex min-h-52 items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-gray-50">
                          <p className="text-sm text-gray-400">
                            Belum ada karya publik.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!error && !loading && pagination.total_pages > 1 && (
          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-gray-100 pt-8 sm:flex-row">
            <p className="text-sm text-gray-400">
              Halaman{" "}
              <strong className="text-gray-700">{pagination.page}</strong> dari{" "}
              <strong className="text-gray-700">
                {pagination.total_pages}
              </strong>
            </p>

            <div className="flex items-center gap-3">
              <button
                type="button"
                disabled={!pagination.has_previous_page}
                onClick={() => setPage((current) => Math.max(1, current - 1))}
                className="flex items-center gap-2 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Sebelumnya
              </button>

              <button
                type="button"
                disabled={!pagination.has_next_page}
                onClick={() => setPage((current) => current + 1)}
                className="flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Berikutnya
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </section>

      <footer className="mx-auto mt-auto flex w-full max-w-7xl flex-col items-center justify-between border-t border-gray-100 px-5 py-10 md:flex-row md:px-8">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-black">
          ETCH
        </h2>

        <div className="my-6 flex items-center gap-8 text-sm font-bold md:my-0 md:gap-12">
          <a href="#" className="transition hover:text-gray-500">
            Tentang
          </a>

          <a href="#" className="transition hover:text-gray-500">
            Karir
          </a>

          <a href="#" className="transition hover:text-gray-500">
            Bantuan
          </a>
        </div>

        <p className="text-xs text-gray-400">© 2026 ETCH</p>
      </footer>
    </div>
  );
}

type CreatorStatProps = {
  icon: LucideIcon;
  value: number;
  label: string;
};

function CreatorStat({ icon: Icon, value, label }: CreatorStatProps) {
  return (
    <div className="px-2 text-center">
      <div className="flex items-center justify-center gap-1.5">
        <Icon size={13} className="text-gray-400" />

        <span className="text-sm font-bold text-gray-800">
          {formatNumber(value)}
        </span>
      </div>

      <p className="mt-1 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
        {label}
      </p>
    </div>
  );
}
