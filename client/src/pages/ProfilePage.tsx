import React, { useState } from 'react';

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

const mockPosts = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=600&auto=format&fit=crop',
];

type Tab = 'Posting' | 'Review' | 'Popular' | 'Tentang';

export function ProfilePage() {
  const [activeTab, setActiveTab] = useState<Tab>('Posting');

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">
      {/* Header */}
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
        <div className="flex items-center space-x-6">
          <a href="/register" className="text-sm font-bold hover:text-gray-600 transition-colors">Daftar</a>
          <a href="/login">
            <button className="bg-black text-white hover:bg-gray-800 rounded-lg px-6 py-2 h-10 font-bold border border-black text-sm transition-colors">
              Masuk
            </button>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8">

        {/* Cover Photo */}
        <div className="relative w-full h-48 sm:h-56 rounded-2xl overflow-hidden bg-gray-200">
          <img
            src="https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop"
            alt="Cover Photo"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Avatar - overlapping cover */}
        <div className="relative -mt-14 ml-6 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden bg-gray-100 shadow-md">
            <img
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop"
              alt="John Doe Avatar"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Profile Info Row */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 px-2">
          {/* Left: Name, role, location, link */}
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

          {/* Right: Stats + Edit button */}
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
            <button
              id="edit-profile-btn"
              className="bg-black text-white text-xs font-bold px-5 py-2 rounded-full hover:bg-gray-800 transition-colors"
            >
              EDIT PROFILE
            </button>
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
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6 pb-20">
          {activeTab === 'Posting' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {/* Upload CTA Card */}
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

              {/* Empty post placeholders */}
              {mockPosts.slice(0, 2).map((src, i) => (
                <div
                  key={i}
                  className="border border-gray-100 rounded-xl overflow-hidden min-h-[180px] bg-gray-50 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <img
                    src={src}
                    alt={`Post ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
              ))}

              {/* Second row empty cards */}
              {mockPosts.slice(2, 5).map((src, i) => (
                <div
                  key={i + 3}
                  className="border border-gray-100 rounded-xl overflow-hidden min-h-[180px] bg-gray-50 hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <img
                    src={src}
                    alt={`Post ${i + 4}`}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'Review' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-400 text-sm font-medium">Belum ada ulasan</p>
            </div>
          )}

          {activeTab === 'Popular' && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-gray-400 text-sm font-medium">Belum ada konten populer</p>
            </div>
          )}

          {activeTab === 'Tentang' && (
            <div className="max-w-xl py-8">
              <h2 className="text-lg font-black mb-4">Tentang John Doe</h2>
              <p className="text-sm text-gray-600 leading-relaxed">
                UI/UX Designer dan Web Developer berbasis di Jakarta, Indonesia. Berpengalaman dalam menciptakan
                antarmuka yang intuitif dan pengalaman pengguna yang bermakna.
              </p>
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <LocationIcon />
                  <span>Jakarta, Indonesia</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <LinkIcon />
                  <a href="https://www.JDworld.com" className="text-blue-600 hover:underline">
                    www.JDworld.com
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
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
