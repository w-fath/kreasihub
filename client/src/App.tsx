import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

import { KreatorPage } from "./pages/KreatorPage";
import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";

import { AdminLayout } from "./pages/dashboard/admin/layouts/AdminLayout";
import { KategoriPage } from "./pages/dashboard/admin/pages/KategoriPage";
import { KaryaPage } from "./pages/dashboard/admin/pages/KaryaPage";
import { LaporanPage } from "./pages/dashboard/admin/pages/LaporanPage";
import { PengaturanPage as AdminPengaturanPage } from "./pages/dashboard/admin/pages/PengaturanPage";
import { PenggunaPage } from "./pages/dashboard/admin/pages/PenggunaPage";
import { RingkasanPage as AdminRingkasanPage } from "./pages/dashboard/admin/pages/RingkasanPage";

import { CreatorLayout } from "./pages/dashboard/creator/layouts/CreatorLayout";
import { KaryaSayaPage } from "./pages/dashboard/creator/pages/KaryaSayaPage";
import { PengaturanPage as CreatorPengaturanPage } from "./pages/dashboard/creator/pages/PengaturanPage";
import { ProfilPage } from "./pages/dashboard/creator/pages/ProfilPage";
import { RingkasanPage as CreatorRingkasanPage } from "./pages/dashboard/creator/pages/RingkasanPage";
import { TambahKaryaPage } from "./pages/dashboard/creator/pages/TambahKaryaPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/kreator" element={<KreatorPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          path="/dashboard/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminRingkasanPage />} />
          <Route path="pengguna" element={<PenggunaPage />} />
          <Route path="karya" element={<KaryaPage />} />
          <Route path="kategori" element={<KategoriPage />} />
          <Route path="laporan" element={<LaporanPage />} />
          <Route path="pengaturan" element={<AdminPengaturanPage />} />
        </Route>

        <Route
          path="/dashboard/creator"
          element={
            <ProtectedRoute allowedRoles={["creator"]}>
              <CreatorLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<CreatorRingkasanPage />} />
          <Route path="karya" element={<KaryaSayaPage />} />
          <Route path="karya/tambah" element={<TambahKaryaPage />} />
          <Route path="profil" element={<ProfilPage />} />
          <Route path="pengaturan" element={<CreatorPengaturanPage />} />
        </Route>

        <Route path="*" element={<LandingPage />} />
      </Routes>
    </BrowserRouter>
  );
}
