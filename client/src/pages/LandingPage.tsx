import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type FormEvent,
} from "react";
import {
  Check,
  ChevronDown,
  ExternalLink,
  Eye,
  FolderOpen,
  Heart,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Search,
  SlidersHorizontal,
  UserPlus,
  X,
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

type PublicWork = {
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

type PublicCategory = {
  id: number;
  name: string;
  slug: string;
  works_count: number;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_previous_page: boolean;
  has_next_page: boolean;
};

type PublicWorksResponse = {
  success: boolean;
  message: string;

  data?: {
    works: PublicWork[];
    categories: PublicCategory[];

    filters: {
      search: string;
      category: string;
      sort: "latest" | "popular";
    };

    pagination: Pagination;
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
  limit: 12,
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

export function LandingPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState<AuthUser | null>(() => getStoredUser());

  const [profileOpen, setProfileOpen] = useState(false);

  const [works, setWorks] = useState<PublicWork[]>([]);

  const [categories, setCategories] = useState<PublicCategory[]>([]);

  const [pagination, setPagination] = useState<Pagination>(initialPagination);

  const [searchInput, setSearchInput] = useState("");

  const [activeSearch, setActiveSearch] = useState("");

  const [activeCategory, setActiveCategory] = useState("");

  const [sortMode, setSortMode] = useState<"latest" | "popular">("latest");

  const [otherCategoryOpen, setOtherCategoryOpen] = useState(false);

  const [sortOpen, setSortOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [loadingMore, setLoadingMore] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [selectedWork, setSelectedWork] = useState<PublicWork | null>(null);

  const [liked, setLiked] = useState(false);

  const [likeLoading, setLikeLoading] = useState(false);

  const [followingIds, setFollowingIds] = useState<Set<number>>(
    () => new Set(),
  );

  const [followLoadingIds, setFollowLoadingIds] = useState<Set<number>>(
    () => new Set(),
  );

  const [message, setMessage] = useState<string | null>(null);

  const dashboardPath =
    user?.role === "admin" ? "/dashboard/admin" : "/dashboard/creator";

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "U";

  const featuredCategories = useMemo(
    () => categories.slice(0, 4),
    [categories],
  );

  const otherCategories = useMemo(() => categories.slice(4), [categories]);

  const activeCategoryInOthers = otherCategories.some(
    (category) => category.slug === activeCategory,
  );

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

        profile_photo: storedUser?.profile_photo || null,

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

  const loadFollowingCreators = useCallback(async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      setFollowingIds(new Set());
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
        setFollowingIds(new Set());
        return;
      }

      setFollowingIds(new Set(result.data.creator_ids));
    } catch (requestError) {
      console.error("Load followed creators error:", requestError);
    }
  }, []);

  const loadWorks = useCallback(
    async (requestedPage: number, append: boolean) => {
      try {
        if (append) {
          setLoadingMore(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const query = new URLSearchParams({
          page: String(requestedPage),
          limit: "12",
          sort: sortMode,
        });

        if (activeSearch) {
          query.set("search", activeSearch);
        }

        if (activeCategory) {
          query.set("category", activeCategory);
        }

        const response = await fetch(
          `${API_URL}/api/public/works?${query.toString()}`,
          {
            headers: {
              Accept: "application/json",
            },
          },
        );

        const result = (await response.json()) as PublicWorksResponse;

        if (!response.ok || !result.success || !result.data) {
          if (!append) {
            setWorks([]);
            setPagination(initialPagination);
          }

          setError(result.message || "Daftar karya gagal diambil.");

          return;
        }

        if (append) {
          setWorks((current) => {
            const workMap = new Map(current.map((work) => [work.id, work]));

            result.data?.works.forEach((work) => {
              workMap.set(work.id, work);
            });

            return Array.from(workMap.values());
          });
        } else {
          setWorks(result.data.works);
        }

        setCategories(result.data.categories);

        setPagination(result.data.pagination);
      } catch (requestError) {
        console.error("Load public works error:", requestError);

        if (!append) {
          setWorks([]);
          setPagination(initialPagination);
        }

        setError("Tidak dapat terhubung ke server.");
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [activeSearch, activeCategory, sortMode],
  );

  useEffect(() => {
    void verifyAuthentication();
  }, [verifyAuthentication]);

  useEffect(() => {
    void loadWorks(1, false);
  }, [loadWorks]);

  useEffect(() => {
    if (user) {
      void loadFollowingCreators();
    } else {
      setFollowingIds(new Set());
    }
  }, [user, loadFollowingCreators]);

  useEffect(() => {
    if (!selectedWork) {
      document.body.style.overflow = "";

      return;
    }

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setSelectedWork(null);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [selectedWork]);

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

  const updateWork = (workId: number, updates: Partial<PublicWork>) => {
    setWorks((current) =>
      current.map((work) =>
        work.id === workId
          ? {
              ...work,
              ...updates,
            }
          : work,
      ),
    );

    setSelectedWork((current) => {
      if (!current || current.id !== workId) {
        return current;
      }

      return {
        ...current,
        ...updates,
      };
    });
  };

  const loadWorkLikeStatus = async (workId: number) => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      setLiked(false);
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/work-likes/${workId}/status`,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = (await response.json()) as WorkLikeResponse;

      if (!response.ok || !result.success || !result.data) {
        setLiked(false);
        return;
      }

      setLiked(result.data.liked);

      updateWork(workId, {
        likes_count: result.data.likes_count,
      });
    } catch (requestError) {
      console.error("Load work like status error:", requestError);
    }
  };

  const registerWorkView = async (work: PublicWork) => {
    const storageKey = `kreasihub_viewed_work_${work.id}`;

    if (sessionStorage.getItem(storageKey)) {
      return;
    }

    sessionStorage.setItem(storageKey, "1");

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

      updateWork(work.id, {
        views_count: result.data.views_count,
      });
    } catch (requestError) {
      console.error("Register work view error:", requestError);

      sessionStorage.removeItem(storageKey);
    }
  };

  const openWorkModal = (work: PublicWork) => {
    setSelectedWork(work);
    setLiked(false);
    setMessage(null);

    void registerWorkView(work);
    void loadWorkLikeStatus(work.id);
  };

  const handleLike = async () => {
    if (!selectedWork) {
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

      const response = await fetch(
        `${API_URL}/api/work-likes/${selectedWork.id}`,
        {
          method: liked ? "DELETE" : "POST",

          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = (await response.json()) as WorkLikeResponse;

      if (!response.ok || !result.success || !result.data) {
        setMessage(result.message || "Status suka gagal diperbarui.");

        return;
      }

      setLiked(result.data.liked);

      updateWork(selectedWork.id, {
        likes_count: result.data.likes_count,
      });

      setMessage(result.message);
    } catch (requestError) {
      console.error("Update like error:", requestError);

      setMessage("Tidak dapat terhubung ke server.");
    } finally {
      setLikeLoading(false);
    }
  };

  const handleCreatorFollow = async (creatorId: number) => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.id === creatorId) {
      setMessage("Kamu tidak dapat mengikuti akun sendiri.");

      return;
    }

    const currentlyFollowing = followingIds.has(creatorId);

    setFollowLoadingIds((current) => {
      const updated = new Set(current);

      updated.add(creatorId);

      return updated;
    });

    try {
      const response = await fetch(
        `${API_URL}/api/creator-follows/${creatorId}`,
        {
          method: currentlyFollowing ? "DELETE" : "POST",

          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result = (await response.json()) as FollowActionResponse;

      if (!response.ok || !result.success || !result.data) {
        setMessage(result.message || "Status mengikuti gagal diperbarui.");

        return;
      }

      setFollowingIds((current) => {
        const updated = new Set(current);

        if (result.data?.following) {
          updated.add(creatorId);
        } else {
          updated.delete(creatorId);
        }

        return updated;
      });

      setMessage(result.message);
    } catch (requestError) {
      console.error("Update creator follow error:", requestError);

      setMessage("Tidak dapat terhubung ke server.");
    } finally {
      setFollowLoadingIds((current) => {
        const updated = new Set(current);

        updated.delete(creatorId);

        return updated;
      });
    }
  };

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setActiveSearch(searchInput.trim());
  };

  const handleCategory = (categorySlug: string) => {
    setActiveCategory(categorySlug);
    setOtherCategoryOpen(false);
  };

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

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8 md:py-6">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            to="/"
            className="text-3xl font-black italic uppercase tracking-tighter text-black"
          >
            ETCH
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#karya" className="text-sm font-bold text-black">
              Jelajahi
            </a>

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
                <p className="max-w-40 truncate text-sm font-bold">
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

      <section className="mx-auto mt-16 w-full max-w-4xl px-5 text-center">
        <h1 className="text-4xl font-black uppercase tracking-tight md:text-5xl">
          Temukan Inspirasi Temukan Kreator
        </h1>

        <p className="mt-5 text-base font-medium text-gray-600 md:text-lg">
          Jelajahi karya kreatif dari kreator terbaik Indonesia.
        </p>

        <form
          onSubmit={handleSearch}
          className="relative mx-auto mt-9 flex max-w-3xl items-center"
        >
          <Search size={18} className="absolute left-5 text-gray-400" />

          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Cari karya, kategori, atau kreator"
            className="h-14 w-full rounded-full border border-gray-300 pl-14 pr-28 text-sm outline-none focus:ring-4 focus:ring-gray-100"
          />

          <button
            type="submit"
            className="absolute bottom-2 right-2 top-2 rounded-full bg-black px-7 text-sm font-bold text-white"
          >
            Cari
          </button>
        </form>
      </section>

      <section className="mx-auto mt-16 flex w-full max-w-7xl items-center justify-between gap-5 px-5 md:px-8">
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => handleCategory("")}
            className={`rounded-full border px-5 py-2.5 text-sm font-bold ${
              !activeCategory
                ? "border-black bg-black text-white"
                : "border-gray-200"
            }`}
          >
            Semua Karya
          </button>

          {featuredCategories.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => handleCategory(category.slug)}
              className={`rounded-full border px-5 py-2.5 text-sm font-bold ${
                activeCategory === category.slug
                  ? "border-black bg-black text-white"
                  : "border-gray-200"
              }`}
            >
              {category.name}
            </button>
          ))}

          {otherCategories.length > 0 && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setOtherCategoryOpen((current) => !current)}
                className={`flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold ${
                  activeCategoryInOthers
                    ? "border-black bg-black text-white"
                    : "border-gray-200"
                }`}
              >
                {activeCategoryInOthers
                  ? otherCategories.find(
                      (category) => category.slug === activeCategory,
                    )?.name
                  : "Lainnya"}

                <ChevronDown size={15} />
              </button>

              {otherCategoryOpen && (
                <div className="absolute left-0 top-full z-40 mt-2 min-w-56 rounded-2xl border bg-white p-2 shadow-xl">
                  {otherCategories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleCategory(category.slug)}
                      className="flex w-full justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50"
                    >
                      <span>{category.name}</span>

                      <span className="text-xs text-gray-400">
                        {category.works_count}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setSortOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-200"
          >
            <SlidersHorizontal size={18} />
          </button>

          {sortOpen && (
            <div className="absolute right-0 top-full z-40 mt-2 w-44 rounded-2xl border bg-white p-2 shadow-xl">
              <button
                type="button"
                onClick={() => {
                  setSortMode("latest");
                  setSortOpen(false);
                }}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50"
              >
                Terbaru
              </button>

              <button
                type="button"
                onClick={() => {
                  setSortMode("popular");
                  setSortOpen(false);
                }}
                className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold hover:bg-gray-50"
              >
                Terpopuler
              </button>
            </div>
          )}
        </div>
      </section>

      <section
        id="karya"
        className="mx-auto mt-10 w-full max-w-7xl flex-1 px-5 pb-20 md:px-8"
      >
        {error && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl bg-rose-50">
            <XCircle size={42} className="text-rose-500" />

            <p className="mt-4 font-bold text-rose-600">{error}</p>
          </div>
        )}

        {!error && loading && (
          <div className="flex min-h-72 items-center justify-center">
            <LoaderCircle size={26} className="animate-spin text-gray-400" />
          </div>
        )}

        {!error && !loading && works.length === 0 && (
          <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl bg-gray-50">
            <FolderOpen size={44} className="text-gray-300" />

            <p className="mt-4 font-semibold text-gray-400">
              Belum ada karya ditemukan.
            </p>
          </div>
        )}

        {!error && works.length > 0 && (
          <div className="columns-1 gap-6 sm:columns-2 md:columns-3 lg:columns-4">
            {works.map((work) => (
              <article
                key={work.id}
                className="group relative mb-6 break-inside-avoid overflow-hidden rounded-[20px] bg-gray-100"
              >
                <button
                  type="button"
                  onClick={() => openWorkModal(work)}
                  className="block w-full text-left"
                >
                  {work.thumbnail_url ? (
                    <img
                      src={work.thumbnail_url}
                      alt={work.title}
                      className="h-auto w-full transition duration-300 group-hover:scale-[1.02]"
                    />
                  ) : (
                    <div className="flex min-h-64 items-center justify-center">
                      <FolderOpen size={40} className="text-gray-300" />
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 transition group-hover:opacity-100" />

                  <div className="absolute inset-x-0 bottom-0 p-5 text-white opacity-0 transition group-hover:opacity-100">
                    <h2 className="line-clamp-2 font-bold">{work.title}</h2>
                  </div>
                </button>

                <Link
                  to={`/kreator/${work.creator.slug}`}
                  title={`Lihat profil ${work.creator.name}`}
                  className="absolute bottom-4 left-4 z-20"
                >
                  {work.creator.profile_photo_url ? (
                    <img
                      src={work.creator.profile_photo_url}
                      alt={work.creator.name}
                      className="h-9 w-9 rounded-full border-2 border-white bg-gray-100 object-cover shadow"
                    />
                  ) : (
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-black text-xs font-bold text-white shadow">
                      {work.creator.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                </Link>
              </article>
            ))}
          </div>
        )}

        {!error && pagination.has_next_page && (
          <div className="mt-14 flex justify-center">
            <button
              type="button"
              disabled={loadingMore}
              onClick={() => void loadWorks(pagination.page + 1, true)}
              className="flex items-center gap-2 rounded-full border border-gray-300 px-9 py-3 text-sm font-bold disabled:opacity-60"
            >
              {loadingMore && (
                <LoaderCircle size={16} className="animate-spin" />
              )}

              {loadingMore ? "Memuat..." : "Muat Lagi"}
            </button>
          </div>
        )}
      </section>

      <footer className="mx-auto mt-auto flex w-full max-w-7xl items-center justify-between border-t border-gray-100 px-5 py-10 md:px-8">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter">
          ETCH
        </h2>

        <p className="text-xs text-gray-400">© 2026 ETCH</p>
      </footer>

      {selectedWork && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-3 backdrop-blur-sm md:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedWork(null);
            }
          }}
        >
          <div className="relative max-h-[94vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedWork(null)}
              className="absolute right-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg"
            >
              <X size={20} />
            </button>

            <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
              <div className="flex min-h-[420px] items-center justify-center bg-gray-100 p-6 lg:min-h-[680px]">
                {selectedWork.thumbnail_url ? (
                  <img
                    src={selectedWork.thumbnail_url}
                    alt={selectedWork.title}
                    className="max-h-[650px] w-full object-contain"
                  />
                ) : (
                  <FolderOpen size={60} className="text-gray-300" />
                )}
              </div>

              <div className="p-6 md:p-9">
                <div className="flex items-center justify-between gap-4">
                  <Link
                    to={`/kreator/${selectedWork.creator.slug}`}
                    onClick={() => setSelectedWork(null)}
                    className="flex min-w-0 items-center gap-3"
                  >
                    {selectedWork.creator.profile_photo_url ? (
                      <img
                        src={selectedWork.creator.profile_photo_url}
                        alt={selectedWork.creator.name}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-black font-bold text-white">
                        {selectedWork.creator.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold hover:text-blue-600">
                        {selectedWork.creator.name}
                      </p>

                      <p className="truncate text-xs text-gray-400">
                        {selectedWork.creator.expertise || "Kreator"}
                      </p>
                    </div>
                  </Link>

                  {user?.id === selectedWork.creator.id ? (
                    <Link
                      to={`/kreator/${selectedWork.creator.slug}`}
                      onClick={() => setSelectedWork(null)}
                      className="rounded-full bg-black px-5 py-2 text-xs font-bold text-white"
                    >
                      Profil Saya
                    </Link>
                  ) : (
                    <button
                      type="button"
                      disabled={followLoadingIds.has(selectedWork.creator.id)}
                      onClick={() =>
                        void handleCreatorFollow(selectedWork.creator.id)
                      }
                      className={`flex items-center gap-2 rounded-full px-5 py-2 text-xs font-bold ${
                        followingIds.has(selectedWork.creator.id)
                          ? "border border-gray-300 bg-white"
                          : "bg-black text-white"
                      }`}
                    >
                      {followingIds.has(selectedWork.creator.id) ? (
                        <Check size={14} />
                      ) : (
                        <UserPlus size={14} />
                      )}

                      {followingIds.has(selectedWork.creator.id)
                        ? "Mengikuti"
                        : "Ikuti"}
                    </button>
                  )}
                </div>

                {selectedWork.category && (
                  <p className="mt-9 text-xs font-black uppercase tracking-widest text-blue-600">
                    {selectedWork.category.name}
                  </p>
                )}

                <h2 className="mt-3 text-3xl font-black uppercase leading-tight">
                  {selectedWork.title}
                </h2>

                <p className="mt-5 whitespace-pre-line text-sm leading-7 text-gray-600">
                  {selectedWork.description || "Belum ada deskripsi karya."}
                </p>

                <div className="mt-7 flex items-center gap-6 border-y border-gray-100 py-5 text-sm font-semibold text-gray-500">
                  <span className="flex items-center gap-2">
                    <Heart size={17} />

                    {formatNumber(selectedWork.likes_count)}
                  </span>

                  <span className="flex items-center gap-2">
                    <Eye size={17} />

                    {formatNumber(selectedWork.views_count)}
                  </span>
                </div>

                <div className="mt-7 flex flex-wrap gap-2">
                  {selectedWork.category && (
                    <span className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold">
                      #{selectedWork.category.name}
                    </span>
                  )}

                  {selectedWork.creator.expertise && (
                    <span className="rounded-full border border-gray-200 px-4 py-2 text-xs font-semibold">
                      #{selectedWork.creator.expertise}
                    </span>
                  )}
                </div>

                <div className="mt-8 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    disabled={likeLoading}
                    onClick={() => void handleLike()}
                    className={`flex h-12 items-center justify-center gap-2 rounded-xl text-sm font-bold ${
                      liked
                        ? "border border-gray-300 bg-white"
                        : "bg-black text-white"
                    }`}
                  >
                    {likeLoading ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : liked ? (
                      <Check size={17} />
                    ) : (
                      <Heart size={17} />
                    )}

                    {liked ? "Disukai" : "Suka"}
                  </button>

                  <Link
                    to={`/karya/${selectedWork.slug}`}
                    onClick={() => setSelectedWork(null)}
                    className="flex h-12 items-center justify-center rounded-xl border border-gray-300 text-sm font-bold"
                  >
                    Lihat Detail Lengkap
                  </Link>
                </div>

                {selectedWork.project_url && (
                  <a
                    href={selectedWork.project_url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 flex h-12 items-center justify-center gap-2 rounded-xl border border-gray-300 text-sm font-bold"
                  >
                    Kunjungi Proyek
                    <ExternalLink size={16} />
                  </a>
                )}

                {message && (
                  <div className="mt-5 rounded-xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-600">
                    {message}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
