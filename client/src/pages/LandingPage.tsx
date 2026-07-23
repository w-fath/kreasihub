import React from 'react';
import { Button } from '../components/ui/Button';
import { ChevronDown, SlidersHorizontal } from 'lucide-react';

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

const mockImages = [
  'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1634152962476-4b8a00e1915c?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1507608616759-54f48f0af0ee?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1523895665936-7bfe172b757d?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1000&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1000&auto=format&fit=crop',
];

export function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans text-neutral-dark flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-12">
          <a href="/" className="text-3xl font-black italic tracking-tighter uppercase text-black hover:opacity-80">ETCH</a>
          <nav className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-sm font-bold hover:text-gray-600 transition-colors">Jelajahi</a>
            <a href="#" className="text-sm font-bold hover:text-gray-600 transition-colors">Kreator</a>
            <a href="#" className="text-sm font-bold hover:text-gray-600 transition-colors">Komunitas</a>
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <a href="/register" className="text-sm font-bold hover:text-gray-600 transition-colors">Daftar</a>
          <a href="/login">
            <Button className="bg-black text-white hover:bg-gray-800 rounded-lg px-6 py-2 h-10 font-bold border border-black">
              Masuk
            </Button>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto mt-20 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-6 uppercase">
          TEMUKAN INSPIRASI TEMUKAN KREATOR
        </h1>
        <p className="text-lg text-gray-700 mb-10 font-medium">
          Jelajahi ribuan karya desain dari kreator terbaik Indonesia.
        </p>

        <div className="relative max-w-3xl mx-auto flex items-center">
          <input
            type="text"
            placeholder="Cari desain/kreator yang anda suka"
            className="w-full h-14 pl-6 pr-32 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm font-medium placeholder:text-gray-400"
          />
          <button className="absolute right-2 top-2 bottom-2 bg-black text-white px-8 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors">
            Cari
          </button>
        </div>
      </section>

      {/* Filters */}
      <section className="w-full max-w-7xl mx-auto mt-20 px-8 flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <button className="px-6 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors">Semua Karya</button>
          <button className="px-6 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors">Web Design</button>
          <button className="px-6 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors">Dashboard</button>
          <button className="px-6 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors">Logo</button>
          <button className="px-6 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors">3D</button>
          <button className="px-6 py-2 rounded-full border border-gray-200 text-sm font-bold hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <span>Lainnya</span>
            <ChevronDown size={16} />
          </button>
        </div>
        <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
          <SlidersHorizontal size={18} />
        </button>
      </section>

      {/* Grid Gallery */}
      <section className="w-full max-w-7xl mx-auto mt-10 px-8 pb-20">
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {mockImages.map((src, index) => (
            <div key={index} className="break-inside-avoid relative group cursor-pointer">
              <img 
                src={src} 
                alt={`Artwork ${index + 1}`} 
                className="w-full h-auto rounded-[20px] object-cover transition-transform duration-300 group-hover:scale-[1.02]"
              />
              <div className="absolute bottom-4 left-4">
                <img 
                  src="https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop" 
                  alt="Creator Avatar" 
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <button className="px-10 py-3 rounded-full border border-gray-300 text-sm font-bold hover:bg-gray-50 transition-colors">
            Memuat
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-8 py-10 mt-auto flex flex-col md:flex-row items-center justify-between border-t border-gray-100">
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
