import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  ArrowLeft,
  ImagePlus,
  Link2,
  LoaderCircle,
  RefreshCw,
  Save,
  Upload,
  X,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { CreatorSection } from "../components/CreatorSection";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type CategoriesResponse = {
  success: boolean;
  message: string;
  data?: Category[];
};

type WorkResponse = {
  success: boolean;
  message: string;
  data?: {
    id: number;
    title: string;
    slug: string;
    status: string;
    thumbnail_url: string;
  };
};

type WorkFormData = {
  title: string;
  categoryId: string;
  description: string;
  projectUrl: string;
};

const initialFormData: WorkFormData = {
  title: "",
  categoryId: "",
  description: "",
  projectUrl: "",
};

export function TambahKaryaPage() {
  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [formData, setFormData] = useState<WorkFormData>(initialFormData);

  const [categories, setCategories] = useState<Category[]>([]);

  const [loadingCategories, setLoadingCategories] = useState(true);

  const [categoryError, setCategoryError] = useState<string | null>(null);

  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [message, setMessage] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const handleUnauthorized = () => {
    localStorage.removeItem("kreasihub_token");
    localStorage.removeItem("kreasihub_user");

    navigate("/login", {
      replace: true,
    });
  };

  const getCategories = async () => {
    try {
      setLoadingCategories(true);
      setCategoryError(null);

      const response = await fetch(`${API_URL}/api/categories`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const result = (await response.json()) as CategoriesResponse;

      if (!response.ok || !result.success || !result.data) {
        setCategories([]);
        setCategoryError(result.message || "Kategori karya gagal diambil.");
        return;
      }

      setCategories(result.data);
    } catch (requestError) {
      console.error("Get categories error:", requestError);

      setCategories([]);
      setCategoryError("Tidak dapat terhubung ke server kategori.");
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    void getCategories();
  }, []);

  useEffect(() => {
    return () => {
      if (thumbnailPreview) {
        URL.revokeObjectURL(thumbnailPreview);
      }
    };
  }, [thumbnailPreview]);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setError(null);
    setMessage(null);
  };

  const handleThumbnailChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];

    const maximumSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      setError("Thumbnail harus menggunakan format PNG, JPG, JPEG, atau WEBP.");

      event.target.value = "";
      return;
    }

    if (file.size > maximumSize) {
      setError("Ukuran thumbnail maksimal 5 MB.");

      event.target.value = "";
      return;
    }

    setThumbnail(file);
    setThumbnailPreview(URL.createObjectURL(file));
    setError(null);
    setMessage(null);
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setThumbnail(null);
    setThumbnailPreview(null);
    setError(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError(null);
    setMessage(null);

    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    if (!formData.title.trim()) {
      setError("Judul karya wajib diisi.");
      return;
    }

    if (formData.title.trim().length < 3) {
      setError("Judul karya minimal 3 karakter.");
      return;
    }

    if (!formData.categoryId) {
      setError("Kategori karya wajib dipilih.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Deskripsi karya wajib diisi.");
      return;
    }

    if (formData.description.trim().length < 10) {
      setError("Deskripsi karya minimal 10 karakter.");
      return;
    }

    if (!thumbnail) {
      setError("Thumbnail karya wajib dipilih.");
      return;
    }

    if (
      formData.projectUrl &&
      !formData.projectUrl.startsWith("http://") &&
      !formData.projectUrl.startsWith("https://")
    ) {
      setError("Tautan project harus diawali dengan http:// atau https://.");
      return;
    }

    try {
      setSubmitting(true);

      const requestData = new FormData();

      requestData.append("title", formData.title.trim());

      requestData.append("category_id", formData.categoryId);

      requestData.append("description", formData.description.trim());

      requestData.append("project_url", formData.projectUrl.trim());

      requestData.append("thumbnail", thumbnail);

      const response = await fetch(`${API_URL}/api/creator/works`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: requestData,
      });

      const result = (await response.json()) as WorkResponse;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError("Kamu tidak memiliki akses untuk menambahkan karya.");
        return;
      }

      if (!response.ok || !result.success) {
        setError(result.message || "Karya gagal disimpan.");
        return;
      }

      setFormData(initialFormData);
      setThumbnail(null);
      setThumbnailPreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setMessage(result.message || "Karya berhasil ditambahkan.");
    } catch (submitError) {
      console.error("Submit work error:", submitError);

      setError("Tidak dapat terhubung ke server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <CreatorSection
      title="Tambah Karya"
      description="Tambahkan karya baru ke dalam portofolio digitalmu."
    >
      <Link
        to="/dashboard/creator/karya"
        className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-gray-500 transition hover:text-blue-600"
      >
        <ArrowLeft size={17} />
        Kembali ke Karya Saya
      </Link>

      {error && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3">
          <p className="text-sm font-medium text-rose-600">{error}</p>

          <button
            type="button"
            onClick={() => setError(null)}
            className="text-rose-500 hover:text-rose-700"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {message && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-600">{message}</p>

          <button
            type="button"
            onClick={() => setMessage(null)}
            className="text-emerald-500 hover:text-emerald-700"
          >
            <X size={17} />
          </button>
        </div>
      )}

      <form
        className="w-full max-w-none space-y-6"
        onSubmit={handleSubmit}
        noValidate
      >
        <div>
          <label
            htmlFor="title"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Judul Karya <span className="text-rose-500">*</span>
          </label>

          <input
            id="title"
            name="title"
            type="text"
            value={formData.title}
            onChange={handleChange}
            placeholder="Contoh: Desain Website Coffee Shop"
            maxLength={150}
            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />

          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Gunakan judul yang singkat dan menggambarkan karya.
            </p>

            <p className="text-xs text-gray-400">{formData.title.length}/150</p>
          </div>
        </div>

        <div>
          <label
            htmlFor="categoryId"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Kategori <span className="text-rose-500">*</span>
          </label>

          <div className="relative">
            <select
              id="categoryId"
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              disabled={loadingCategories || categories.length === 0}
              className="w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 py-3 pr-12 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400"
            >
              {loadingCategories ? (
                <option value="">Memuat kategori...</option>
              ) : categories.length === 0 ? (
                <option value="">Kategori belum tersedia</option>
              ) : (
                <>
                  <option value="">Pilih kategori karya</option>

                  {categories.map((category) => (
                    <option key={category.id} value={String(category.id)}>
                      {category.name}
                    </option>
                  ))}
                </>
              )}
            </select>

            {loadingCategories && (
              <LoaderCircle
                size={18}
                className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
              />
            )}
          </div>

          {categoryError && (
            <div className="mt-2 flex items-center gap-3">
              <p className="text-xs font-medium text-rose-500">
                {categoryError}
              </p>

              <button
                type="button"
                onClick={() => void getCategories()}
                disabled={loadingCategories}
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline disabled:opacity-50"
              >
                <RefreshCw
                  size={13}
                  className={loadingCategories ? "animate-spin" : ""}
                />
                Coba Lagi
              </button>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="description"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Deskripsi <span className="text-rose-500">*</span>
          </label>

          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={7}
            placeholder="Jelaskan konsep, proses pembuatan, teknologi, dan tujuan dari karya ini..."
            maxLength={2000}
            className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
          />

          <div className="mt-1 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Deskripsikan karya agar mudah dipahami.
            </p>

            <p className="text-xs text-gray-400">
              {formData.description.length}/2000
            </p>
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-gray-700">
            Thumbnail Karya <span className="text-rose-500">*</span>
          </label>

          {!thumbnailPreview ? (
            <label className="flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center transition hover:border-blue-400 hover:bg-blue-50/30">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-blue-500 shadow-sm">
                <ImagePlus size={27} />
              </div>

              <p className="mt-4 text-sm font-semibold text-gray-700">
                Klik untuk memilih thumbnail
              </p>

              <p className="mt-1 text-xs text-gray-400">
                PNG, JPG, JPEG, atau WEBP maksimal 5 MB
              </p>

              <div className="mt-4 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white">
                <Upload size={16} />
                Pilih Gambar
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleThumbnailChange}
                className="hidden"
              />
            </label>
          ) : (
            <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-gray-100">
              <img
                src={thumbnailPreview}
                alt="Preview thumbnail karya"
                className="max-h-[500px] min-h-64 w-full object-contain"
              />

              <button
                type="button"
                onClick={removeThumbnail}
                className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black"
              >
                <X size={18} />
              </button>

              <div className="border-t border-gray-200 bg-white px-4 py-3">
                <p className="truncate text-sm font-semibold text-gray-700">
                  {thumbnail?.name}
                </p>

                <p className="mt-0.5 text-xs text-gray-400">
                  {thumbnail
                    ? `${(thumbnail.size / 1024 / 1024).toFixed(2)} MB`
                    : ""}
                </p>
              </div>
            </div>
          )}
        </div>

        <div>
          <label
            htmlFor="projectUrl"
            className="mb-2 block text-sm font-semibold text-gray-700"
          >
            Tautan Project
          </label>

          <div className="relative">
            <Link2
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              id="projectUrl"
              name="projectUrl"
              type="url"
              value={formData.projectUrl}
              onChange={handleChange}
              placeholder="https://github.com/username/project"
              className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-gray-400 focus:border-blue-400 focus:ring-4 focus:ring-blue-50"
            />
          </div>

          <p className="mt-1 text-xs text-gray-400">
            Opsional. Masukkan tautan website, GitHub, Figma, Behance, atau
            project lainnya.
          </p>
        </div>

        <div className="flex flex-col-reverse justify-end gap-3 border-t border-gray-100 pt-6 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setMessage(null);
            }}
            disabled={submitting}
            className="rounded-xl border border-gray-200 px-5 py-3 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-60"
          >
            Reset Form
          </button>

          <button
            type="submit"
            disabled={
              submitting || loadingCategories || categories.length === 0
            }
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {submitting ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}

            {submitting ? "Menyimpan..." : "Simpan Karya"}
          </button>
        </div>
      </form>
    </CreatorSection>
  );
}
