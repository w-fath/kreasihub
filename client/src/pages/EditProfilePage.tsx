import React, { useState, useRef } from 'react';

// ─── Icons ────────────────────────────────────────────────────
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

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
  </svg>
);

// ─── Types ────────────────────────────────────────────────────
type SidebarSection = 'general' | 'password' | 'kontak' | 'sosial';

interface FormData {
  namaDepan: string;
  namaBelakang: string;
  headline: string;
  bio: string;
  lokasi: string;
  kota: string;
  websiteUrl: string;
  keahlian: string;
}

// ─── Input Component ──────────────────────────────────────────
const InputField = ({
  label, id, value, onChange, placeholder = '', type = 'text',
}: {
  label: string; id: string; value: string;
  onChange: (v: string) => void; placeholder?: string; type?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-xs font-semibold text-gray-700">{label}</label>
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full h-10 px-3 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-300 bg-white"
    />
  </div>
);

// ─── Section: General ─────────────────────────────────────────
function GeneralSection() {
  const [form, setForm] = useState<FormData>({
    namaDepan: '', namaBelakang: '', headline: '', bio: '',
    lokasi: '', kota: '', websiteUrl: '', keahlian: '',
  });
  const [avatarSrc, setAvatarSrc] = useState(
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200&auto=format&fit=crop'
  );
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof FormData) => (val: string) => setForm((f) => ({ ...f, [key]: val }));

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAvatarSrc(URL.createObjectURL(file));
  };

  return (
    <div>
      <h2 className="text-lg font-black uppercase tracking-wide text-gray-900 mb-6">Umum</h2>

      {/* Avatar */}
      <div className="flex justify-center mb-8">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden ring-2 ring-gray-200">
            <img src={avatarSrc} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            title="Ubah foto"
          >
            <CameraIcon />
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
        </div>
      </div>

      {/* Form */}
      <div className="space-y-5">
        {/* Nama */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Nama Depan" id="nama-depan" value={form.namaDepan} onChange={set('namaDepan')} />
          <InputField label="Nama Belakang" id="nama-belakang" value={form.namaBelakang} onChange={set('namaBelakang')} />
        </div>

        {/* Headline */}
        <InputField label="Headline" id="headline" value={form.headline} onChange={set('headline')} placeholder="UI/UX Designer | Web Design" />

        {/* Bio */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="bio" className="text-xs font-semibold text-gray-700">Bio</label>
            <span className="text-xs text-gray-400">{form.bio.length}/1000</span>
          </div>
          <textarea
            id="bio"
            rows={7}
            maxLength={1000}
            value={form.bio}
            onChange={(e) => set('bio')(e.target.value)}
            placeholder="Ceritakan tentang dirimu..."
            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 placeholder:text-gray-300 resize-none bg-white"
          />
        </div>

        {/* Lokasi + Kota */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField label="Lokasi" id="lokasi" value={form.lokasi} onChange={set('lokasi')} placeholder="Jakarta" />
          <InputField label="Kota" id="kota" value={form.kota} onChange={set('kota')} placeholder="DKI Jakarta" />
        </div>

        {/* Website */}
        <InputField label="Website URL" id="website-url" value={form.websiteUrl} onChange={set('websiteUrl')} placeholder="https://www.yoursite.com" type="url" />

        {/* Keahlian */}
        <InputField label="Keahlian" id="keahlian" value={form.keahlian} onChange={set('keahlian')} placeholder="UI, UX, Web Design, Prototyping..." />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
        <button
          id="batal-simpan-btn"
          className="px-6 py-2.5 rounded-full border border-red-400 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors"
        >
          Batal Simpan
        </button>
        <button
          id="simpan-perubahan-btn"
          className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors"
        >
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

// ─── Section: Ubah Password ───────────────────────────────────
function PasswordSection() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <h2 className="text-lg font-black uppercase tracking-wide text-gray-900 mb-6">Ubah Password</h2>
      <div className="space-y-5 max-w-md">
        <InputField label="Password Saat Ini" id="current-pass" value={form.current} onChange={set('current')} type="password" />
        <InputField label="Password Baru" id="new-pass" value={form.newPass} onChange={set('newPass')} type="password" />
        <InputField label="Konfirmasi Password Baru" id="confirm-pass" value={form.confirm} onChange={set('confirm')} type="password" />
      </div>
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
        <button className="px-6 py-2.5 rounded-full border border-red-400 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors">
          Batal Simpan
        </button>
        <button className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors">
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

// ─── Section: Info Kontak ─────────────────────────────────────
function KontakSection() {
  const [form, setForm] = useState({ email: '', phone: '', whatsapp: '' });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <h2 className="text-lg font-black uppercase tracking-wide text-gray-900 mb-6">Info Kontak</h2>
      <div className="space-y-5 max-w-md">
        <InputField label="Email" id="email" value={form.email} onChange={set('email')} type="email" placeholder="johndoe@gmail.com" />
        <InputField label="Nomor Telepon" id="phone" value={form.phone} onChange={set('phone')} placeholder="+62 812 3456 7890" />
        <InputField label="WhatsApp" id="whatsapp" value={form.whatsapp} onChange={set('whatsapp')} placeholder="+62 812 3456 7890" />
      </div>
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
        <button className="px-6 py-2.5 rounded-full border border-red-400 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors">
          Batal Simpan
        </button>
        <button className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors">
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

// ─── Section: Social Media ────────────────────────────────────
function SosialSection() {
  const [form, setForm] = useState({
    instagram: '', twitter: '', facebook: '', linkedin: '', github: '', behance: '',
  });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div>
      <h2 className="text-lg font-black uppercase tracking-wide text-gray-900 mb-6">Social Media</h2>
      <div className="space-y-5 max-w-md">
        <InputField label="Instagram" id="instagram" value={form.instagram} onChange={set('instagram')} placeholder="https://instagram.com/username" />
        <InputField label="X / Twitter" id="twitter" value={form.twitter} onChange={set('twitter')} placeholder="https://x.com/username" />
        <InputField label="Facebook" id="facebook" value={form.facebook} onChange={set('facebook')} placeholder="https://facebook.com/username" />
        <InputField label="LinkedIn" id="linkedin" value={form.linkedin} onChange={set('linkedin')} placeholder="https://linkedin.com/in/username" />
        <InputField label="GitHub" id="github" value={form.github} onChange={set('github')} placeholder="https://github.com/username" />
        <InputField label="Behance" id="behance" value={form.behance} onChange={set('behance')} placeholder="https://behance.net/username" />
      </div>
      <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-100">
        <button className="px-6 py-2.5 rounded-full border border-red-400 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors">
          Batal Simpan
        </button>
        <button className="px-6 py-2.5 rounded-full bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors">
          Simpan Perubahan
        </button>
      </div>
    </div>
  );
}

// ─── Sidebar Nav Item ─────────────────────────────────────────
const SidebarItem = ({
  label, active, onClick,
}: {
  label: string; active: boolean; onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`w-full text-left text-xs font-bold py-2 border-b border-gray-100 transition-colors ${
      active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-700'
    }`}
  >
    {label}
  </button>
);

// ─── Main Page ────────────────────────────────────────────────
export function EditProfilePage() {
  const [activeSection, setActiveSection] = useState<SidebarSection>('general');

  const renderSection = () => {
    switch (activeSection) {
      case 'general':  return <GeneralSection />;
      case 'password': return <PasswordSection />;
      case 'kontak':   return <KontakSection />;
      case 'sosial':   return <SosialSection />;
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 flex flex-col">

      {/* ── Header ── */}
      <header className="w-full border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-10">
            <a href="/" className="text-2xl font-black italic tracking-tighter uppercase text-black hover:opacity-80">
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
        </div>
      </header>

      {/* ── Body ── */}
      <div className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-8 py-10 flex gap-8">

        {/* Sidebar */}
        <aside className="w-44 shrink-0">
          <h1 className="text-base font-black uppercase tracking-wide text-gray-900 mb-5">
            Edit Profil
          </h1>
          <nav className="flex flex-col">
            <SidebarItem label="GENERAL"      active={activeSection === 'general'}  onClick={() => setActiveSection('general')} />
            <SidebarItem label="UBAH PASSWORD" active={activeSection === 'password'} onClick={() => setActiveSection('password')} />
            <SidebarItem label="INFO KONTAK"   active={activeSection === 'kontak'}   onClick={() => setActiveSection('kontak')} />
            <SidebarItem label="SOCIAL MEDIA"  active={activeSection === 'sosial'}   onClick={() => setActiveSection('sosial')} />
          </nav>
        </aside>

        {/* Main content card */}
        <main className="flex-1">
          <div className="border border-gray-200 rounded-2xl p-8 bg-white shadow-sm">
            {renderSection()}
          </div>
        </main>
      </div>

      {/* ── Footer ── */}
      <footer className="w-full border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase text-black">ETCH</h2>
          <div className="flex items-center space-x-10">
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
        </div>
      </footer>
    </div>
  );
}
