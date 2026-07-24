import React, { useState } from "react";
import { User, Mail, Lock } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
}

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="w-5 h-5"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.238-2.657-.611-3.917z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.238-2.657-.611-3.917z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 320 512"
    className="w-5 h-5"
    fill="#1877F2"
  >
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="w-4 h-4"
    fill="currentColor"
  >
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
  </svg>
);

export function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    const normalizedName = name.trim();
    const normalizedEmail = email.trim().toLowerCase();

    if (
      !normalizedName ||
      !normalizedEmail ||
      !password ||
      !passwordConfirmation
    ) {
      setError("Semua data wajib diisi.");
      return;
    }

    if (normalizedName.length < 3) {
      setError("Nama minimal terdiri dari 3 karakter.");
      return;
    }

    if (password.length < 8) {
      setError("Password minimal terdiri dari 8 karakter.");
      return;
    }

    if (password !== passwordConfirmation) {
      setError("Konfirmasi password tidak sesuai.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: normalizedName,
          email: normalizedEmail,
          password,
          passwordConfirmation,
        }),
      });

      const result = (await response.json()) as RegisterResponse;

      if (!response.ok || !result.success) {
        setError(result.message || "Registrasi gagal dilakukan.");
        return;
      }

      setSuccess(result.message || "Registrasi berhasil.");

      setName("");
      setEmail("");
      setPassword("");
      setPasswordConfirmation("");

      window.setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch (requestError) {
      console.error("Register request error:", requestError);
      setError(
        "Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-dark flex flex-col">
      {/* Header */}
      <header className="w-full flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center space-x-12">
          <a
            href="/"
            className="text-3xl font-black italic tracking-tighter uppercase text-black hover:opacity-80"
          >
            ETCH
          </a>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#"
              className="text-sm font-bold hover:text-gray-600 transition-colors"
            >
              Jelajahi
            </a>
            <a
              href="#"
              className="text-sm font-bold hover:text-gray-600 transition-colors"
            >
              Kreator
            </a>
            <a
              href="#"
              className="text-sm font-bold hover:text-gray-600 transition-colors"
            >
              Komunitas
            </a>
          </nav>
        </div>

        <div className="flex items-center space-x-6">
          <a
            href="/register"
            className="text-sm font-bold hover:text-gray-600 transition-colors"
          >
            Daftar
          </a>

          <a href="/login">
            <Button className="bg-black text-white hover:bg-gray-800 rounded-lg px-6 py-2 h-10 font-bold border border-black">
              Masuk
            </Button>
          </a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-[20px] border border-gray-200 shadow-[6px_6px_0px_0px_rgba(220,220,220,0.5)] p-10">
            <div className="flex flex-col items-center mb-8">
              <h2 className="text-3xl font-bold tracking-wide">DAFTAR</h2>

              {error && (
                <p className="text-red-600 text-sm mt-4 font-medium text-center">
                  {error}
                </p>
              )}
              {success && (
                <p className="text-green-600 text-sm mt-4 font-medium text-center">
                  {success}
                </p>
              )}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Masukkan nama lengkap"
                autoComplete="name"
                disabled={loading}
                leftIcon={
                  <User size={18} className="text-black" strokeWidth={2.5} />
                }
                className="rounded-full border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-medium h-12"
              />

              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Masukkan email"
                autoComplete="email"
                disabled={loading}
                leftIcon={
                  <Mail size={18} className="text-black" strokeWidth={2.5} />
                }
                className="rounded-full border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-medium h-12"
              />

              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan password"
                autoComplete="new-password"
                disabled={loading}
                leftIcon={
                  <Lock size={18} className="text-black" strokeWidth={2.5} />
                }
                className="rounded-full border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-medium h-12"
              />

              <Input
                type="password"
                value={passwordConfirmation}
                onChange={(event) =>
                  setPasswordConfirmation(event.target.value)
                }
                placeholder="Konfirmasi password"
                autoComplete="new-password"
                disabled={loading}
                leftIcon={
                  <Lock size={18} className="text-black" strokeWidth={2.5} />
                }
                className="rounded-full border-gray-300 font-medium placeholder:text-gray-400 placeholder:font-medium h-12"
              />

              <Button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-black text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60 h-12 font-bold text-lg mt-6"
              >
                {loading ? "Mendaftarkan..." : "Daftar"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="text-xs font-bold text-gray-400 mb-4">
                atau masuk dengan
              </p>

              <div className="flex items-center justify-center space-x-4 mb-8">
                <button
                  type="button"
                  aria-label="Daftar menggunakan Google"
                  className="flex items-center justify-center w-16 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <GoogleIcon />
                </button>

                <button
                  type="button"
                  aria-label="Daftar menggunakan Facebook"
                  className="flex items-center justify-center w-16 h-10 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FacebookIcon />
                </button>

                <button
                  type="button"
                  aria-label="Daftar menggunakan X"
                  className="flex items-center justify-center w-16 h-10 border border-gray-200 rounded-lg hover:bg-gray-800 transition-colors bg-black text-white"
                >
                  <XIcon />
                </button>
              </div>

              <p className="text-xs font-bold text-gray-400">
                Sudah memiliki akun?{" "}
                <a href="/login" className="text-gray-500 hover:text-gray-700">
                  Masuk
                </a>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
