import React, { useState } from 'react';

const BellIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
  </svg>
);

const UserCircleIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" className="w-4 h-4" fill="currentColor">
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"/>
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" className="w-3.5 h-3.5" fill="currentColor">
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" className="w-4 h-4" fill="currentColor">
    <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"/>
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
  </svg>
);

const LinkIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
  </svg>
);

const UploadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="17 8 12 3 7 8"/>
    <line x1="12" y1="3" x2="12" y2="15"/>
  </svg>
);

const StarIcon = ({ filled, half = false }: { filled: boolean; half?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill={filled ? '#FACC15' : half ? 'url(#half)' : 'none'} stroke={filled || half ? '#FACC15' : '#D1D5DB'} strokeWidth="1.5">
    {half && (
      <defs>
        <linearGradient id="half">
          <stop offset="50%" stopColor="#FACC15" />
          <stop offset="50%" stopColor="transparent" />
        </linearGradient>
      </defs>
    )}
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"/>
  </svg>
);

const ThumbUpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z"/>
    <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
  </svg>
);

// ─── Mock Data ────────────────────────────────────────────────
const mockPosts = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop',
];

const mockPopular = [
  'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523895665936-7bfe172b757d?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=600&auto=format&fit=crop',
];

interface Review {
  id: number;
  name: string;
  avatar: string;
  role: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
  projectTitle: string;
}

const mockReviews: Review[] = [
  {
    id: 1,
    name: 'Sari Dewi',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    role: 'Product Manager',
    rating: 5,
    date: '12 Juli 2026',
    comment: 'John adalah desainer yang sangat berbakat! Hasil kerjanya melampaui ekspektasi saya. UI yang dia rancang sangat intuitif dan estetis. Komunikasinya juga sangat baik selama proses pengerjaan. Sangat direkomendasikan!',
    helpfulCount: 18,
    projectTitle: 'Dashboard Analytics App',
  },
  {
    id: 2,
    name: 'Budi Santoso',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
    role: 'Startup Founder',
    rating: 4,
    date: '3 Juni 2026',
    comment: 'Kerja sama yang sangat menyenangkan. John memahami kebutuhan bisnis saya dengan cepat dan menghasilkan desain yang sesuai dengan brand kami. Hanya sedikit revisi yang diperlukan.',
    helpfulCount: 11,
    projectTitle: 'Landing Page Redesign',
  },
  {
    id: 3,
    name: 'Anisa Rahmawati',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&auto=format&fit=crop',
    role: 'UX Researcher',
    rating: 5,
    date: '20 Mei 2026',
    comment: 'Kolaborasi yang luar biasa! John tidak hanya fokus pada visual tapi juga memperhatikan aspek usability dan aksesibilitas. Hasilnya benar-benar berkualitas tinggi.',
    helpfulCount: 24,
    projectTitle: 'Mobile App UI Kit',
  },
  {
    id: 4,
    name: 'Rizky Pratama',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
    role: 'Developer',
    rating: 4,
    date: '8 April 2026',
    comment: 'John memberikan desain yang rapi dan mudah di-implement. File Figma-nya sangat terorganisir dengan komponen yang jelas. Proses handoff berjalan sangat smooth.',
    helpfulCount: 7,
    projectTitle: 'E-commerce Web Design',
  },
];

const ratingDistribution = [
  { star: 5, count: 38, pct: 76 },
  { star: 4, count: 9,  pct: 18 },
  { star: 3, count: 2,  pct: 4  },
  { star: 2, count: 1,  pct: 2  },
  { star: 1, count: 0,  pct: 0  },
];

const overallRating = 4.7;
const totalReviews = 50;

// ─── Sub-components ───────────────────────────────────────────
function StarRow({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <StarIcon key={s} filled={s <= Math.floor(rating)} half={s === Math.ceil(rating) && rating % 1 >= 0.5} />
      ))}
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const [liked, setLiked] = useState(false);

  return (
    <div className="border border-gray-100 rounded-2xl p-5 hover:shadow-sm transition-shadow bg-white">
      {/* Reviewer header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <img
            src={review.avatar}
            alt={review.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-gray-100"
          />
          <div>
            <p className="text-sm font-bold text-gray-900">{review.name}</p>
            <p className="text-xs text-gray-500">{review.role}</p>
          </div>
        </div>
        <span className="text-xs text-gray-400">{review.date}</span>
      </div>

      {/* Stars & project */}
      <div className="flex items-center gap-2 mb-2">
        <StarRow rating={review.rating} />
        <span className="text-xs text-gray-400 font-medium">untuk</span>
        <span className="text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-full">
          {review.projectTitle}
        </span>
      </div>

      {/* Comment */}
      <p className="text-sm text-gray-600 leading-relaxed mb-4">{review.comment}</p>

      {/* Helpful */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setLiked((v) => !v)}
          className={`flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
            liked
              ? 'bg-black text-white border-black'
              : 'text-gray-500 border-gray-200 hover:border-gray-400'
          }`}
        >
          <ThumbUpIcon />
          <span>Membantu ({liked ? review.helpfulCount + 1 : review.helpfulCount})</span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────
type Tab = 'Posting' | 'Review' | 'Popular' | 'Tentang';

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('Posting');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {/* ── Header ── */}
      <header className="w-full flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center space-x-10">
          <a href="/" className="text-3xl font-black italic tracking-tighter uppercase text-black hover:opacity-80">
            ETCH
          </a>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-bold hover:text-gray-600 transition-colors">Jelajahi</a>
            <a href="#" className="text-sm font-bold hover:text-gray-600 transition-colors">Kreator</a>
            <a href="#" className="text-sm font-bold hover:text-gray-600 transition-colors">Komunitas</a>
          </nav>
        </div>
        <div className="flex items-center space-x-3">
          <button
            id="notif-btn"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors relative"
            title="Notifikasi"
          >
            <BellIcon />
            {/* Unread dot */}
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
          </button>
          <button
            id="user-menu-btn"
            className="w-9 h-9 flex items-center justify-center rounded-full border border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"
            title="Akun"
          >
            <UserCircleIcon />
          </button>
        </div>
      </header>

      {/* ── Main Content ── */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8">

        {/* Cover Photo */}
        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-gray-200">
          <img
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop"
            alt="Cover Photo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Avatar */}
        <div className="relative -mt-14 ml-6 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
              alt="John Doe Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile Info */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 px-2">
          <div>
            <h1 className="text-2xl font-black text-gray-900">John Doe</h1>
            <p className="text-sm text-blue-600 font-semibold mt-0.5">UI/UX | Web Design</p>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-2">
              <LocationIcon />
              <span>Jakarta, Indonesia</span>
            </div>
            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
              <LinkIcon />
              <a href="https://www.JDworld.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors">
                www.JDworld.com
              </a>
            </div>
          </div>

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-8">
              <div className="text-center">
                <p className="text-xl font-black text-gray-900">223</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Pengikut</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-gray-900">76</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Suka</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-black text-gray-900">3</p>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Projek</p>
              </div>
            </div>
            <a href="/profile/edit">
              <button
                id="edit-profile-btn"
                className="bg-black text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                EDIT PROFILE
              </button>
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-6 px-2 border-b border-gray-200">
          <div className="flex items-center gap-1">
            {(['Posting', 'Review', 'Popular', 'Tentang'] as Tab[]).map((tab) => (
              <button
                key={tab}
                id={`tab-${tab.toLowerCase()}`}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-bold rounded-t-md transition-colors ${
                  activeTab === tab
                    ? 'bg-black text-white'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab}
                {tab === 'Review' && (
                  <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab ? 'bg-white text-black' : 'bg-gray-100 text-gray-600'}`}>
                    {totalReviews}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab Content ── */}
        <div className="mt-6 pb-20">

          {/* POSTING TAB */}
          {activeTab === 'Posting' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center text-center min-h-[180px] bg-gray-50 hover:bg-gray-100 transition-colors">
                <UploadIcon />
                <h3 className="text-sm font-bold text-gray-800 mt-3">Unggah karya pertamamu</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                  Dapatkan masukan, pandangan, dan apresiasi, dan berkembang dalam komunitas
                </p>
                <button
                  id="upload-btn"
                  className="mt-4 bg-black text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Unggah
                </button>
              </div>
              {mockPosts.map((src, i) => (
                <div key={i} className="border border-gray-100 rounded-xl overflow-hidden min-h-[180px] bg-gray-50 hover:shadow-md transition-shadow cursor-pointer group">
                  <img src={src} alt={`Post ${i + 1}`} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                </div>
              ))}
            </div>
          )}

          {/* REVIEW TAB */}
          {activeTab === 'Review' && (
            <div className="space-y-8">

              {/* Rating Summary Card */}
              <div className="border border-gray-100 rounded-2xl p-6 bg-gray-50">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">

                  {/* Big score */}
                  <div className="flex flex-col items-center text-center shrink-0">
                    <p className="text-6xl font-black text-gray-900 leading-none">{overallRating}</p>
                    <div className="mt-2">
                      <StarRow rating={overallRating} />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{totalReviews} ulasan</p>
                  </div>

                  {/* Divider */}
                  <div className="hidden sm:block w-px self-stretch bg-gray-200" />

                  {/* Distribution bars */}
                  <div className="flex-1 w-full space-y-2">
                    {ratingDistribution.map(({ star, count, pct }) => (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-gray-600 w-4 text-right">{star}</span>
                        <StarIcon filled={true} />
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 w-6">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA button */}
                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-end">
                  <button
                    id="write-review-btn"
                    className="bg-black text-white text-xs font-bold px-6 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
                  >
                    + Tulis Ulasan
                  </button>
                </div>
              </div>

              {/* Sort/Filter bar */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-700">Semua Ulasan <span className="text-gray-400 font-normal">({totalReviews})</span></p>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">Urutkan:</span>
                  <select className="text-xs font-semibold border border-gray-200 rounded-full px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-gray-200 cursor-pointer">
                    <option>Terbaru</option>
                    <option>Rating tertinggi</option>
                    <option>Rating terendah</option>
                    <option>Paling membantu</option>
                  </select>
                </div>
              </div>

              {/* Review Cards */}
              <div className="space-y-4">
                {mockReviews.map((review) => (
                  <ReviewCard key={review.id} review={review} />
                ))}
              </div>

              {/* Load more */}
              <div className="flex justify-center pt-4">
                <button className="px-8 py-2.5 rounded-full border border-gray-300 text-sm font-bold hover:bg-gray-50 transition-colors">
                  Tampilkan lebih banyak
                </button>
              </div>
            </div>
          )}

          {/* POPULAR TAB */}
          {activeTab === 'Popular' && (
            <div>
              <p className="text-sm text-gray-500 mb-4">Karya dengan keterlibatan tertinggi</p>
              <div className="columns-1 sm:columns-2 md:columns-3 gap-4 space-y-4">
                {mockPopular.map((src, i) => (
                  <div key={i} className="break-inside-avoid border border-gray-100 rounded-xl overflow-hidden bg-gray-50 hover:shadow-md transition-shadow cursor-pointer group">
                    <img src={src} alt={`Popular ${i + 1}`} className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-300" />
                    <div className="p-3 flex items-center justify-between">
                      <p className="text-xs font-bold text-gray-700 truncate">Karya #{i + 1}</p>
                      <span className="flex items-center gap-1 text-xs text-gray-500">
                        <StarIcon filled={true} />
                        {(4.2 + i * 0.1).toFixed(1)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TENTANG TAB */}
          {activeTab === 'Tentang' && (
            <div className="py-6 flex flex-col md:flex-row gap-8">

              {/* ── Left Column ── */}
              <div className="flex-1 space-y-8">

                {/* Bio */}
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-4">Bio</h2>
                  <blockquote className="text-sm text-gray-700 leading-relaxed italic border-l-2 border-gray-200 pl-4 mb-5">
                    "Saya adalah IT Profesional &amp; Web Designer dengan 5+ tahun pengalaman.
                    Latar belakang Ilmu Komputer membantu saya menjembatani desain estetis
                    dengan kelayakan teknis. Fokus saya adalah menciptakan UI/UX yang
                    responsif, mudah diakses, dan sejalan dengan target bisnis."
                  </blockquote>
                  <ul className="space-y-2.5 text-sm text-gray-600">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span><strong className="text-gray-800">Pendidikan:</strong> S1 Ilmu Komputer. Memiliki dasar kuat tentang arsitektur web dan logika pemrograman.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span><strong className="text-gray-800">Pengalaman:</strong> Berawal dari Frontend Developer, lalu fokus ke ranah UI/UX Design karena ketertarikan pada interaksi dan psikologi pengguna.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span><strong className="text-gray-800">Peran Utama:</strong> Menjadi jembatan komunikasi antara tim bisnis (klien) dan tim teknis (developer).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span><strong className="text-gray-800">Figma &amp; Adobe XD:</strong> Alat utama untuk membuat wireframe, desain antarmuka, dan prototyping interaktif.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span><strong className="text-gray-800">Adobe Photoshop &amp; Illustrator:</strong> Untuk manipulasi gambar dan pembuatan aset vektor atau ikon kustom.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span><strong className="text-gray-800">Webflow &amp; WordPress:</strong> CMS untuk membangun website secara visual dengan cepat.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span><strong className="text-gray-800">Visual Studio Code (VS Code):</strong> Editor teks untuk merapikan struktur kode dasar (HTML, CSS) sebelum diserahkan ke developer.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span><strong className="text-gray-800">Design Thinking:</strong> Pendekatan desain yang fokus pada empati dan pemecahan masalah pengguna yang sebenarnya.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span><strong className="text-gray-800">Mobile-First Approach:</strong> Merancang tampilan untuk layar smartphone terlebih dahulu, baru kemudian diadaptasi ke ukuran desktop yang lebih besar.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span><strong className="text-gray-800">Agile:</strong> Bekerja iteratif dalam tim lintas divisi untuk mengeksekusi dan merevisi desain secara cepat dan berkelanjutan.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
                      <span><strong className="text-gray-800">Atomic Design:</strong> Membuat sistem desain (seperti sistem tombol, warna, dan font) agar tampilan website konsisten dari awal hingga akhir.</span>
                    </li>
                  </ul>
                </div>

                {/* Keahlian */}
                <div>
                  <h2 className="text-xl font-black text-gray-900 mb-4">Keahlian</h2>
                  <div className="flex flex-wrap gap-2">
                    {['WEB DESIGN', 'PROTOTIPE', 'UI', 'UX', 'WEB FLOW'].map((skill) => (
                      <span
                        key={skill}
                        className="px-4 py-1.5 border border-gray-300 rounded-full text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Right Column ── */}
              <div className="w-full md:w-56 shrink-0 space-y-6">

                {/* Info Kontak */}
                <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50">
                  <h3 className="text-sm font-black text-gray-900 mb-3">Info Kontak</h3>
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      {/* Email icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="4" width="20" height="16" rx="2"/>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                      </svg>
                      <span>johndoe@gmail.com</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-600">
                      {/* Phone icon */}
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 shrink-0 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                      </svg>
                      <span>+62 1234 5678</span>
                    </div>
                  </div>
                </div>

                {/* Sosial Media */}
                <div className="border border-gray-100 rounded-2xl p-5 bg-gray-50">
                  <h3 className="text-sm font-black text-gray-900 mb-3">Sosial Media</h3>
                  <div className="flex flex-wrap gap-2">
                    {/* Facebook */}
                    <a href="#" className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" title="Facebook">
                      <FacebookIcon />
                    </a>
                    {/* Instagram */}
                    <a href="#" className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" title="Instagram">
                      <InstagramIcon />
                    </a>
                    {/* GitHub */}
                    <a href="#" className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" title="GitHub">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                      </svg>
                    </a>
                    {/* LinkedIn */}
                    <a href="#" className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" title="LinkedIn">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </a>
                    {/* X (Twitter) */}
                    <a href="#" className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors" title="X / Twitter">
                      <XIcon />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full max-w-7xl mx-auto px-8 py-10 flex flex-col md:flex-row items-center justify-between border-t border-gray-100">
        <div className="mb-6 md:mb-0">
          <h2 className="text-3xl font-black italic tracking-tighter uppercase text-black">ETCH</h2>
        </div>
        <div className="flex items-center space-x-12 mb-6 md:mb-0">
          <a href="#" className="text-sm font-bold hover:text-gray-600 transition-colors">Tentang</a>
          <a href="#" className="text-sm font-bold hover:text-gray-600 transition-colors">Karir</a>
          <a href="#" className="text-sm font-bold hover:text-gray-600 transition-colors">Bantuan</a>
        </div>
        <div className="flex items-center space-x-4">
          <a href="#" className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
            <FacebookIcon />
          </a>
          <a href="#" className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
            <XIcon />
          </a>
          <a href="#" className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
            <InstagramIcon />
          </a>
        </div>
      </footer>
    </div>
  );
}
