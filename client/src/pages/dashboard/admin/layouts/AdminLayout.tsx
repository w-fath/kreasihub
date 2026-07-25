import type { LucideIcon } from "lucide-react";
import {
  Flag,
  Image as ImageIcon,
  LayoutDashboard,
  LogOut,
  Settings,
  Tag,
  User,
  Users,
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
    path: "/dashboard/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Pengguna",
    path: "/dashboard/admin/pengguna",
    icon: Users,
  },
  {
    label: "Karya",
    path: "/dashboard/admin/karya",
    icon: ImageIcon,
  },
  {
    label: "Kategori",
    path: "/dashboard/admin/kategori",
    icon: Tag,
  },
  {
    label: "Laporan",
    path: "/dashboard/admin/laporan",
    icon: Flag,
  },
  {
    label: "Pengaturan",
    path: "/dashboard/admin/pengaturan",
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

export function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = getStoredUser();

  const currentMenu =
    navItems.find((item) => {
      if (item.end) {
        return location.pathname === item.path;
      }

      return location.pathname.startsWith(item.path);
    })?.label || "Dashboard";

  const currentDate = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const handleLogout = () => {
    localStorage.removeItem("kreasihub_token");
    localStorage.removeItem("kreasihub_user");

    navigate("/login", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-[#F5F6FA] font-sans">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 z-30 flex min-h-screen w-56 flex-col border-r border-gray-100 bg-white px-3 py-6 shadow-sm">
        <div className="mb-8 px-3">
          <NavLink
            to="/"
            className="text-2xl font-black italic uppercase tracking-tighter text-gray-900"
          >
            ETCH
          </NavLink>
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
                  `group flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 ${
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

        <div className="mt-4 border-t border-gray-100 pt-4">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-gray-500 transition-all hover:bg-rose-50 hover:text-rose-600"
          >
            <LogOut size={18} className="text-gray-400" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-56 flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-gray-100 bg-white px-8 py-4 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{currentMenu}</h1>
            <p className="mt-0.5 text-xs text-gray-400">{currentDate}</p>
          </div>

          <button
            type="button"
            className="flex items-center gap-3 rounded-full border border-gray-200 bg-gray-50 px-4 py-2 transition-colors hover:bg-gray-100"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-400 to-blue-500">
              <User size={16} className="text-white" />
            </div>

            <div className="text-left">
              <p className="text-sm font-semibold text-gray-700">
                {user?.name || "Admin"}
              </p>
              <p className="text-[10px] font-medium uppercase tracking-wide text-gray-400">
                {user?.role || "admin"}
              </p>
            </div>
          </button>
        </header>

        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
