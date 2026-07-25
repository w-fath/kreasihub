import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Image,
  Tag,
  Flag,
  Settings,
  LogOut,
  User,
  Clock,
  ChevronRight,
  TrendingUp,
  CheckCircle,
  XCircle,
  Eye,
} from 'lucide-react';

// ─── Types ───────────────────────────────────────────────────────────────────
type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
};

// ─── Sidebar Nav Items ────────────────────────────────────────────────────────
const navItems: NavItem[] = [
  { id: 'ringkasan',  label: 'Ringkasan',  icon: <LayoutDashboard size={18} /> },
  { id: 'pengguna',   label: 'Pengguna',   icon: <Users size={18} /> },
  { id: 'karya',      label: 'Karya',      icon: <Image size={18} /> },
  { id: 'kategori',   label: 'Kategori',   icon: <Tag size={18} /> },
  { id: 'laporan',    label: 'Laporan',    icon: <Flag size={18} /> },
  { id: 'pengaturan', label: 'Pengaturan', icon: <Settings size={18} /> },
];

// ─── Stat Cards Data ──────────────────────────────────────────────────────────
const stats = [
  {
    id: 'total-pengguna',
    label: 'Total Pengguna',
    value: '786',
    icon: <Users size={18} className="text-blue-500" />,
    trend: '+12%',
    trendUp: true,
    bg: 'from-blue-50 to-white',
    border: 'border-blue-100',
    badge: 'bg-blue-100 text-blue-700',
  },
  {
    id: 'karya-diupload',
    label: 'Karya diupload',
    value: '1.102',
    icon: <Image size={18} className="text-violet-500" />,
    trend: '+8%',
    trendUp: true,
    bg: 'from-violet-50 to-white',
    border: 'border-violet-100',
    badge: 'bg-violet-100 text-violet-700',
  },
  {
    id: 'menunggu-review',
    label: 'Menunggu Review',
    value: '5',
    icon: <Clock size={18} className="text-amber-500" />,
    trend: '-2',
    trendUp: false,
    bg: 'from-amber-50 to-white',
    border: 'border-amber-100',
    badge: 'bg-amber-100 text-amber-700',
  },
  {
    id: 'laporan',
    label: 'Laporan',
    value: '3',
    icon: <Flag size={18} className="text-rose-500" />,
    trend: '+1',
    trendUp: false,
    bg: 'from-rose-50 to-white',
    border: 'border-rose-100',
    badge: 'bg-rose-100 text-rose-700',
  },
];

// ─── Recent Activity Data ─────────────────────────────────────────────────────
const recentActivity = [
  { id: 1, user: 'Rina Kartika',   action: 'mengupload karya baru',   time: '2 menit lalu',  status: 'pending',  avatar: 'RK' },
  { id: 2, user: 'Budi Santoso',   action: 'mendaftar sebagai kreator', time: '15 menit lalu', status: 'approved', avatar: 'BS' },
  { id: 3, user: 'Dewi Lestari',   action: 'melaporkan konten',        time: '1 jam lalu',    status: 'pending',  avatar: 'DL' },
  { id: 4, user: 'Ahmad Fauzi',    action: 'mengupload karya baru',   time: '2 jam lalu',    status: 'approved', avatar: 'AF' },
  { id: 5, user: 'Sari Indah',     action: 'melaporkan konten',        time: '3 jam lalu',    status: 'rejected', avatar: 'SI' },
];

// ─── Recent Karya Data ────────────────────────────────────────────────────────
const pendingKarya = [
  { id: 1, title: 'UI Kit Modern App', creator: 'Rina Kartika',  category: 'Web Design',  time: '2 menit lalu' },
  { id: 2, title: 'Logo Startup X',    creator: 'Ahmad Fauzi',   category: 'Logo',         time: '5 jam lalu'  },
  { id: 3, title: '3D Character Art',  creator: 'Budi Santoso',  category: '3D',           time: '1 hari lalu' },
];

// ─── Avatar Helper ────────────────────────────────────────────────────────────
const AvatarPlaceholder = ({ initials, color }: { initials: string; color: string }) => (
  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white ${color} flex-shrink-0`}>
    {initials}
  </div>
);

const avatarColors = [
  'bg-blue-500', 'bg-violet-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
];

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }: { status: string }) => {
  const map: Record<string, { label: string; className: string }> = {
    pending:  { label: 'Menunggu', className: 'bg-amber-100 text-amber-700' },
    approved: { label: 'Disetujui', className: 'bg-emerald-100 text-emerald-700' },
    rejected: { label: 'Ditolak',   className: 'bg-rose-100 text-rose-700' },
  };
  const s = map[status] ?? map['pending'];
  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${s.className}`}>
      {s.label}
    </span>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export function AdminDashboard() {
  const [activeNav, setActiveNav] = useState('ringkasan');

  return (
    <div className="flex min-h-screen bg-[#F5F6FA] font-sans">

      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="w-56 min-h-screen bg-white border-r border-gray-100 flex flex-col py-6 px-3 fixed top-0 left-0 z-30 shadow-sm">
        {/* Logo */}
        <div className="px-3 mb-8">
          <span className="text-2xl font-black italic tracking-tighter uppercase text-gray-900">ETCH</span>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 space-y-0.5">
          {navItems.map((item) => {
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => setActiveNav(item.id)}
                className={`
                  w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium
                  transition-all duration-150 group
                  ${isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}
              >
                <span className={`transition-colors ${isActive ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600'}`}>
                  {item.icon}
                </span>
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto text-blue-400" />}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="pt-4 border-t border-gray-100 mt-4">
          <button
            id="btn-logout"
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-500 hover:bg-rose-50 hover:text-rose-600 transition-all"
          >
            <LogOut size={18} className="text-gray-400" />
            Keluar
          </button>
        </div>
      </aside>

      {/* ── Main Content ────────────────────────────────────────────────── */}
      <main className="flex-1 ml-56 flex flex-col min-h-screen">

        {/* ── Top Bar ─────────────────────────────────────────────────── */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Selamat Datang di Dashboard</h1>
            <p className="text-xs text-gray-400 mt-0.5">Jumat, 25 Juli 2026</p>
          </div>
          {/* Admin Profile */}
          <button
            id="btn-admin-profile"
            className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-full px-4 py-2 hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-400 to-blue-500 flex items-center justify-center">
              <User size={16} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-700">Admin</span>
          </button>
        </header>

        {/* ── Dashboard Body ───────────────────────────────────────────── */}
        <div className="flex-1 p-8 space-y-8">

          {/* Stat Cards */}
          <section id="section-stats" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((stat) => (
              <div
                key={stat.id}
                id={`card-${stat.id}`}
                className={`bg-gradient-to-br ${stat.bg} border ${stat.border} rounded-2xl p-5 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-500">{stat.label}</span>
                  <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center border border-gray-100">
                    {stat.icon}
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</p>
                <div className="flex items-center gap-1.5">
                  <TrendingUp
                    size={13}
                    className={stat.trendUp ? 'text-emerald-500' : 'text-rose-400'}
                    style={{ transform: stat.trendUp ? 'none' : 'scaleY(-1)' }}
                  />
                  <span className={`text-xs font-semibold ${stat.trendUp ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {stat.trend}
                  </span>
                  <span className="text-xs text-gray-400">dari bulan lalu</span>
                </div>
              </div>
            ))}
          </section>

          {/* Bottom Row: Activity + Pending Review */}
          <section className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Recent Activity */}
            <div id="card-recent-activity" className="lg:col-span-3 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-800">Aktivitas Terbaru</h2>
                <button className="text-xs text-blue-500 font-semibold hover:underline">Lihat Semua</button>
              </div>
              <div className="space-y-4">
                {recentActivity.map((act, i) => (
                  <div key={act.id} className="flex items-center gap-3">
                    <AvatarPlaceholder initials={act.avatar} color={avatarColors[i % avatarColors.length]} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">
                        <span className="font-semibold">{act.user}</span>{' '}
                        <span className="text-gray-500">{act.action}</span>
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">{act.time}</p>
                    </div>
                    <StatusBadge status={act.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* Pending Review Karya */}
            <div id="card-pending-karya" className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-base font-bold text-gray-800">Menunggu Review</h2>
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2.5 py-0.5 rounded-full">
                  {pendingKarya.length}
                </span>
              </div>
              <div className="space-y-4">
                {pendingKarya.map((karya) => (
                  <div key={karya.id} className="p-3 rounded-xl border border-gray-100 hover:border-blue-100 hover:bg-blue-50/30 transition-colors group">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{karya.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{karya.creator} · {karya.category}</p>
                        <p className="text-xs text-gray-400">{karya.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        id={`btn-view-${karya.id}`}
                        className="flex items-center gap-1 text-xs text-gray-500 hover:text-blue-600 font-medium transition-colors"
                      >
                        <Eye size={13} /> Lihat
                      </button>
                      <button
                        id={`btn-approve-${karya.id}`}
                        className="flex items-center gap-1 text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                      >
                        <CheckCircle size={13} /> Setujui
                      </button>
                      <button
                        id={`btn-reject-${karya.id}`}
                        className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-medium transition-colors"
                      >
                        <XCircle size={13} /> Tolak
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>
        </div>
      </main>
    </div>
  );
}
