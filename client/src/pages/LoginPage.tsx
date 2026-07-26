import { useState, type FormEvent } from "react";
import { Lock, Mail } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;

  data?: {
    id: number;
    name: string;
    email: string;
    role: "admin" | "creator";
    status?: string;
  };
}

const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 48 48"
    className="h-5 w-5"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.238-2.657-.611-3.917z"
    />

    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
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
    className="h-4 w-4"
    fill="currentColor"
  >
    <path d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z" />
  </svg>
);

const XIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    className="h-4 w-4"
    fill="currentColor"
  >
    <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8L200.7 275.5 26.8 48H172.4L272.9 180.9 389.2 48zM364.4 421.8h39.1L151.1 88h-42L364.4 421.8z" />
  </svg>
);

export function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setSuccess(null);

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail || !password) {
      setError("Email dan password wajib diisi.");

      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },

        body: JSON.stringify({
          email: normalizedEmail,
          password,
        }),
      });

      const result = (await response.json()) as LoginResponse;

      if (!response.ok || !result.success || !result.token || !result.data) {
        setError(result.message || "Login gagal dilakukan.");

        return;
      }

      localStorage.setItem("kreasihub_token", result.token);

      localStorage.setItem("kreasihub_user", JSON.stringify(result.data));

      setSuccess(result.message || "Login berhasil.");

      window.setTimeout(() => {
        if (result.data?.role === "admin") {
          navigate("/dashboard/admin", {
            replace: true,
          });

          return;
        }

        if (result.data?.role === "creator") {
          navigate("/dashboard/creator", {
            replace: true,
          });

          return;
        }

        localStorage.removeItem("kreasihub_token");

        localStorage.removeItem("kreasihub_user");

        setSuccess(null);

        setError("Role pengguna tidak dikenali.");
      }, 700);
    } catch (requestError) {
      console.error("Login request error:", requestError);

      setError(
        "Tidak dapat terhubung ke server. Pastikan backend sedang berjalan.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleUnavailableFeature = (feature: string) => {
    setSuccess(null);

    setError(`${feature} belum tersedia.`);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white font-sans text-gray-900">
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 md:px-8 md:py-6">
        <div className="flex items-center gap-8 lg:gap-12">
          <Link
            to="/"
            className="text-3xl font-black italic uppercase tracking-tighter text-black transition hover:opacity-75"
          >
            ETCH
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/"
              className="text-sm font-bold text-gray-500 transition hover:text-black"
            >
              Jelajahi
            </Link>

            <Link
              to="/kreator"
              className="text-sm font-bold text-gray-500 transition hover:text-black"
            >
              Kreator
            </Link>

            <Link
              to="/#komunitas"
              className="text-sm font-bold text-gray-500 transition hover:text-black"
            >
              Komunitas
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <Link
            to="/register"
            className="text-sm font-bold text-gray-600 transition hover:text-black"
          >
            Daftar
          </Link>

          <Link
            to="/login"
            className="flex h-10 items-center rounded-lg border border-black bg-black px-6 text-sm font-bold text-white transition hover:bg-gray-800"
          >
            Masuk
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-[24px] border border-gray-200 bg-white p-7 shadow-[7px_7px_0px_0px_rgba(229,231,235,0.9)] sm:p-10">
            <div className="mb-8 flex flex-col items-center">
              <h1 className="text-3xl font-black tracking-wide text-black">
                MASUK
              </h1>

              <p className="mt-3 text-center text-sm leading-6 text-gray-500">
                Masuk untuk mengelola karya dan menemukan kreator favoritmu.
              </p>

              {error && (
                <div className="mt-5 w-full rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-center text-sm font-medium text-rose-600">
                  {error}
                </div>
              )}

              {success && (
                <div className="mt-5 w-full rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-center text-sm font-medium text-emerald-600">
                  {success}
                </div>
              )}
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <Input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Masukkan email"
                autoComplete="email"
                disabled={loading}
                leftIcon={
                  <Mail size={18} className="text-black" strokeWidth={2.4} />
                }
                className="h-12 rounded-full border-gray-300 font-medium placeholder:font-medium placeholder:text-gray-400 focus:border-black focus:ring-black/10"
              />

              <Input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan password"
                autoComplete="current-password"
                disabled={loading}
                leftIcon={
                  <Lock size={18} className="text-black" strokeWidth={2.4} />
                }
                className="h-12 rounded-full border-gray-300 font-medium placeholder:font-medium placeholder:text-gray-400 focus:border-black focus:ring-black/10"
              />

              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={() =>
                    handleUnavailableFeature("Fitur lupa password")
                  }
                  className="text-xs font-bold text-gray-400 transition hover:text-black"
                >
                  Lupa Password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-12 w-full rounded-full border border-black bg-black text-base font-bold text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Memproses..." : "Masuk"}
              </Button>
            </form>

            <div className="mt-8 text-center">
              <p className="mb-4 text-xs font-bold text-gray-400">
                atau masuk dengan
              </p>

              <div className="mb-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  aria-label="Masuk menggunakan Google"
                  onClick={() => handleUnavailableFeature("Login Google")}
                  className="flex h-10 w-16 items-center justify-center rounded-lg border border-gray-200 bg-white transition hover:border-gray-300 hover:bg-gray-50"
                >
                  <GoogleIcon />
                </button>

                <button
                  type="button"
                  aria-label="Masuk menggunakan Facebook"
                  onClick={() => handleUnavailableFeature("Login Facebook")}
                  className="flex h-10 w-16 items-center justify-center rounded-lg border border-gray-200 bg-white text-black transition hover:border-black hover:bg-gray-50"
                >
                  <FacebookIcon />
                </button>

                <button
                  type="button"
                  aria-label="Masuk menggunakan X"
                  onClick={() => handleUnavailableFeature("Login X")}
                  className="flex h-10 w-16 items-center justify-center rounded-lg border border-black bg-black text-white transition hover:bg-gray-800"
                >
                  <XIcon />
                </button>
              </div>

              <p className="text-xs font-bold text-gray-400">
                Belum memiliki akun?{" "}
                <Link
                  to="/register"
                  className="text-black transition hover:text-gray-600 hover:underline"
                >
                  Daftar
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
