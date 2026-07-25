import type { LucideIcon } from "lucide-react";
import {
  FolderOpen,
  Home,
  LayoutDashboard,
  LogOut,
  Settings,
  User,
} from "lucide-react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";

type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: string;
};

type NavItem = {
  label: string;
  path: string;
  icon: LucideIcon;
  end?: boolean;
};

const navItems: NavItem[] = [
  {
    label: "Ringkasan",
    path: "/dashboard/creator",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Karya Saya",
    path: "/dashboard/creator/karya",
    icon: FolderOpen,
  },
  {
    label: "Profil",
    path: "/dashboard/creator/profil",
    icon: User,
  },
  {
    label: "Pengaturan",
    path: "/dashboard/creator/pengaturan",
    icon: Settings,
  },
];

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

export function CreatorLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();

  const currentMenu =
    navItems.find((item) => {
      if (item.end) {
        return location.pathname === item.path;
      }

      return location.pathname.startsWith(item.path);
    })?.label || "Dashboard Creator";

  const currentDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const userInitial = user?.name?.trim().charAt(0).toUpperCase() || "C";

  const handleLogout = () => {
    localStorage.removeItem("kreasihub_token");
    localStorage.removeItem("kreasihub_user");

    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#F5F6FA] font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex min-h-screen w-64 flex-col border-r border-gray-100 bg-white px-4 py-6 shadow-sm">
        <div className="mb-8 px-3">
          <NavLink
            to="/"
            className="text-2xl font-black italic uppercase tracking-tighter text-gray-900"
          >
            ETCH
          </NavLink>

          <p className="mt-1 text-xs font-medium text-gray-400">
            Creator Workspace
          </p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `group flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-150 ${
                    isActive
                      ? "bg-blue-50 text-blue-600"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-blue-500"
                          : "text-gray-400 transition-colors group-hover:text-gray-600"
                      }
                    />

                    <span>{item.label}</span>

                    {isActive && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-blue-500" />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-4 space-y-1 border-t border-gray-100 pt-4">
          <NavLink
            to="/"
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-gray-50 hover:text-gray-800"
          >
            <Home size={18} className="text-gray-400" />
            Halaman Utama
          </NavLink>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-gray-500 transition-all hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut size={18} className="text-gray-400" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white px-8 py-4 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{currentMenu}</h1>
            <p className="mt-0.5 text-xs text-gray-400">{currentDate}</p>
          </div>

          <NavLink
            to="/dashboard/creator/profil"
            className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 transition-colors hover:bg-gray-100"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-violet-500 text-sm font-bold text-white">
              {userInitial}
            </div>

            <div className="text-left">
              <p className="max-w-40 truncate text-sm font-semibold text-gray-700">
                {user?.name || "Creator"}
              </p>
              <p className="max-w-40 truncate text-[10px] text-gray-400">
                {user?.email || "creator@kreasihub.com"}
              </p>
            </div>
          </NavLink>
        </header>

        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
