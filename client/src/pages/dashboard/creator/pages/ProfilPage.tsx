import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Camera,
  CheckCircle,
  CircleDot,
  Code2,
  Globe2,
  Link2,
  LoaderCircle,
  Mail,
  MapPin,
  Palette,
  Save,
  User,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreatorSection } from "../components/CreatorSection";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type CreatorProfile = {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  slug: string;
  expertise: string;
  bio: string;
  location: string;
  portfolio_url: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  behance_url: string;
  dribbble_url: string;
  profile_photo: string | null;
  profile_photo_url: string | null;
  created_at: string;
  updated_at: string;
};

type ProfileResponse = {
  success: boolean;
  message: string;
  data?: CreatorProfile;
};

type ProfileForm = {
  name: string;
  expertise: string;
  bio: string;
  location: string;
  portfolio_url: string;
  github_url: string;
  linkedin_url: string;
  instagram_url: string;
  behance_url: string;
  dribbble_url: string;
};

type LinkFieldName =
  | "portfolio_url"
  | "github_url"
  | "linkedin_url"
  | "instagram_url"
  | "behance_url"
  | "dribbble_url";

type LinkField = {
  name: LinkFieldName;
  label: string;
  placeholder: string;
  icon: LucideIcon;
};

const initialForm: ProfileForm = {
  name: "",
  expertise: "",
  bio: "",
  location: "",
  portfolio_url: "",
  github_url: "",
  linkedin_url: "",
  instagram_url: "",
  behance_url: "",
  dribbble_url: "",
};

const linkFields: LinkField[] = [
  {
    name: "portfolio_url",
    label: "Website atau Portofolio",
    placeholder: "https://portofolio-kamu.com",
    icon: Globe2,
  },
  {
    name: "github_url",
    label: "GitHub",
    placeholder: "https://github.com/username",
    icon: Code2,
  },
  {
    name: "linkedin_url",
    label: "LinkedIn",
    placeholder: "https://linkedin.com/in/username",
    icon: Link2,
  },
  {
    name: "instagram_url",
    label: "Instagram",
    placeholder: "https://instagram.com/username",
    icon: Camera,
  },
  {
    name: "behance_url",
    label: "Behance",
    placeholder: "https://behance.net/username",
    icon: Palette,
  },
  {
    name: "dribbble_url",
    label: "Dribbble",
    placeholder: "https://dribbble.com/username",
    icon: CircleDot,
  },
];

const profileToForm = (profile: CreatorProfile): ProfileForm => ({
  name: profile.name || "",
  expertise: profile.expertise || "",
  bio: profile.bio || "",
  location: profile.location || "",
  portfolio_url: profile.portfolio_url || "",
  github_url: profile.github_url || "",
  linkedin_url: profile.linkedin_url || "",
  instagram_url: profile.instagram_url || "",
  behance_url: profile.behance_url || "",
  dribbble_url: profile.dribbble_url || "",
});

const isValidOptionalUrl = (value: string) => {
  if (!value) {
    return true;
  }

  try {
    const parsedUrl = new URL(value);

    return parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
  } catch {
    return false;
  }
};

const dispatchPhotoToHeader = (photoUrl: string | null) => {
  window.dispatchEvent(
    new CustomEvent("kreasihub-profile-photo-preview", {
      detail: photoUrl,
    }),
  );
};

const updateStoredUser = (updatedProfile: CreatorProfile) => {
  const storedUser = localStorage.getItem("kreasihub_user");

  let currentUser: Record<string, unknown> = {};

  try {
    currentUser = storedUser ? JSON.parse(storedUser) : {};
  } catch {
    currentUser = {};
  }

  const updatedUser = {
    ...currentUser,
    id: updatedProfile.id,
    name: updatedProfile.name,
    email: updatedProfile.email,
    role: updatedProfile.role,
    status: updatedProfile.status,
    slug: updatedProfile.slug,
    expertise: updatedProfile.expertise,
    portfolio_url: updatedProfile.portfolio_url,
    github_url: updatedProfile.github_url,
    linkedin_url: updatedProfile.linkedin_url,
    instagram_url: updatedProfile.instagram_url,
    behance_url: updatedProfile.behance_url,
    dribbble_url: updatedProfile.dribbble_url,
    profile_photo: updatedProfile.profile_photo,
    profile_photo_url: updatedProfile.profile_photo_url,
  };

  localStorage.setItem("kreasihub_user", JSON.stringify(updatedUser));

  window.dispatchEvent(
    new CustomEvent("kreasihub-user-updated", {
      detail: updatedUser,
    }),
  );
};

export function ProfilPage() {
  const navigate = useNavigate();

  const photoInputRef = useRef<HTMLInputElement | null>(null);

  const temporaryPhotoUrlRef = useRef<string | null>(null);

  const savedPhotoUrlRef = useRef<string | null>(null);

  const [profile, setProfile] = useState<CreatorProfile | null>(null);

  const [formData, setFormData] = useState<ProfileForm>(initialForm);

  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);

  const [photoPreview, setPhotoPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState<string | null>(null);

  const [success, setSuccess] = useState<string | null>(null);

  const initial =
    formData.name.trim().charAt(0).toUpperCase() ||
    profile?.name?.trim().charAt(0).toUpperCase() ||
    "C";

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("kreasihub_token");
    localStorage.removeItem("kreasihub_user");

    navigate("/login", {
      replace: true,
    });
  }, [navigate]);

  const loadProfile = useCallback(async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`${API_URL}/api/creator/profile`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = (await response.json()) as ProfileResponse;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError("Kamu tidak memiliki akses ke profil creator.");
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setError(result.message || "Profil creator gagal diambil.");
        return;
      }

      const profileData = result.data;
      const savedPhotoUrl = profileData.profile_photo_url || null;

      setProfile(profileData);
      setFormData(profileToForm(profileData));

      savedPhotoUrlRef.current = savedPhotoUrl;

      setPhotoPreview(savedPhotoUrl || "");

      updateStoredUser(profileData);
      dispatchPhotoToHeader(savedPhotoUrl);
    } catch (requestError) {
      console.error("Get creator profile error:", requestError);

      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    return () => {
      if (temporaryPhotoUrlRef.current) {
        URL.revokeObjectURL(temporaryPhotoUrlRef.current);
      }

      dispatchPhotoToHeader(savedPhotoUrlRef.current);
    };
  }, []);

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setError(null);
    setSuccess(null);
  };

  const handlePhotoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    if (!allowedTypes.includes(file.type)) {
      setError("Foto profil harus berupa JPG, PNG, atau WebP.");

      event.target.value = "";
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      setError("Ukuran foto profil maksimal 3 MB.");

      event.target.value = "";
      return;
    }

    if (temporaryPhotoUrlRef.current) {
      URL.revokeObjectURL(temporaryPhotoUrlRef.current);
    }

    const temporaryUrl = URL.createObjectURL(file);

    temporaryPhotoUrlRef.current = temporaryUrl;

    setProfilePhoto(file);
    setPhotoPreview(temporaryUrl);

    dispatchPhotoToHeader(temporaryUrl);

    setError(null);
    setSuccess(null);
  };

  const validateForm = () => {
    const name = formData.name.trim();
    const expertise = formData.expertise.trim();
    const bio = formData.bio.trim();
    const location = formData.location.trim();

    if (!name) {
      return "Nama lengkap wajib diisi.";
    }

    if (name.length > 100) {
      return "Nama lengkap maksimal 100 karakter.";
    }

    if (expertise.length > 255) {
      return "Keahlian maksimal 255 karakter.";
    }

    if (bio.length > 3000) {
      return "Bio maksimal 3000 karakter.";
    }

    if (location.length > 150) {
      return "Alamat atau lokasi maksimal 150 karakter.";
    }

    for (const field of linkFields) {
      const value = formData[field.name].trim();

      if (value.length > 500) {
        return `${field.label} maksimal 500 karakter.`;
      }

      if (!isValidOptionalUrl(value)) {
        return `${field.label} harus menggunakan http:// atau https://.`;
      }
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    const validationError = validateForm();

    if (validationError) {
      setError(validationError);
      return;
    }

    const requestData = new FormData();

    requestData.append("name", formData.name.trim());

    requestData.append("expertise", formData.expertise.trim());

    requestData.append("bio", formData.bio.trim());

    requestData.append("location", formData.location.trim());

    requestData.append("portfolio_url", formData.portfolio_url.trim());

    requestData.append("github_url", formData.github_url.trim());

    requestData.append("linkedin_url", formData.linkedin_url.trim());

    requestData.append("instagram_url", formData.instagram_url.trim());

    requestData.append("behance_url", formData.behance_url.trim());

    requestData.append("dribbble_url", formData.dribbble_url.trim());

    if (profilePhoto) {
      requestData.append("profile_photo", profilePhoto);
    }

    try {
      setSaving(true);
      setError(null);
      setSuccess(null);

      const response = await fetch(`${API_URL}/api/creator/profile`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: requestData,
      });

      const result = (await response.json()) as ProfileResponse;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setError("Kamu tidak memiliki akses untuk memperbarui profil.");
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setError(result.message || "Profil creator gagal diperbarui.");
        return;
      }

      const updatedProfile = result.data;

      const updatedPhotoUrl = updatedProfile.profile_photo_url || null;

      if (temporaryPhotoUrlRef.current) {
        URL.revokeObjectURL(temporaryPhotoUrlRef.current);

        temporaryPhotoUrlRef.current = null;
      }

      setProfile(updatedProfile);
      setFormData(profileToForm(updatedProfile));

      savedPhotoUrlRef.current = updatedPhotoUrl;

      setPhotoPreview(updatedPhotoUrl || "");
      setProfilePhoto(null);

      if (photoInputRef.current) {
        photoInputRef.current.value = "";
      }

      updateStoredUser(updatedProfile);

      dispatchPhotoToHeader(updatedPhotoUrl);

      setSuccess(result.message);
    } catch (requestError) {
      console.error("Update creator profile error:", requestError);

      setError("Tidak dapat terhubung ke server.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <CreatorSection
      title="Profil Kreator"
      description="Lengkapi identitas, keahlian, dan tautan profesional yang akan ditampilkan pada halaman portofoliomu."
    >
      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
          <XCircle size={18} className="flex-shrink-0" />

          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
          <CheckCircle size={18} className="flex-shrink-0" />

          <span>{success}</span>
        </div>
      )}

      {loading ? (
        <div className="flex min-h-72 items-center justify-center">
          <div className="flex items-center gap-3 text-sm font-medium text-gray-400">
            <LoaderCircle size={21} className="animate-spin" />
            Memuat profil creator...
          </div>
        </div>
      ) : (
        <form className="w-full max-w-6xl" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="md:col-span-2">
              <div className="flex flex-col gap-5 rounded-2xl border border-gray-100 bg-gray-50 p-5 sm:flex-row sm:items-center">
                <div className="relative flex-shrink-0">
                  {photoPreview ? (
                    <img
                      src={photoPreview}
                      alt={formData.name || "Foto profil creator"}
                      className="h-24 w-24 rounded-full border-4 border-white bg-white object-cover shadow-sm"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-500 to-violet-500 text-3xl font-bold text-white shadow-sm">
                      {initial}
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={saving}
                    className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-600 text-white shadow-md transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label="Ubah foto profil"
                  >
                    <Camera size={16} />
                  </button>

                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                </div>

                <div className="min-w-0">
                  <h3 className="truncate text-lg font-bold text-gray-800">
                    {formData.name || "Creator"}
                  </h3>

                  <p className="mt-1 truncate text-sm text-gray-400">
                    {profile?.email || "-"}
                  </p>

                  {profile?.slug && (
                    <p className="mt-2 text-xs font-medium text-blue-600">
                      /kreator/{profile.slug}
                    </p>
                  )}

                  <button
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                    disabled={saving}
                    className="mt-3 text-sm font-semibold text-blue-600 hover:underline disabled:opacity-50"
                  >
                    Ubah Foto Profil
                  </button>

                  <p className="mt-1 text-xs text-gray-400">
                    JPG, PNG, atau WebP. Maksimal 3 MB.
                  </p>
                </div>
              </div>
            </div>

            <ProfileInput
              id="creator-name"
              label="Nama Lengkap"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              icon={User}
              placeholder="Masukkan nama lengkap"
              maxLength={100}
              required
              disabled={saving}
            />

            <ProfileInput
              id="creator-email"
              label="Email"
              value={profile?.email || ""}
              icon={Mail}
              type="email"
              disabled
              readOnly
              helperText="Email akun tidak dapat diubah dari halaman ini."
            />

            <ProfileInput
              id="creator-expertise"
              label="Keahlian"
              name="expertise"
              value={formData.expertise}
              onChange={handleInputChange}
              icon={Briefcase}
              placeholder="Contoh: UI/UX Designer, Frontend Developer"
              maxLength={255}
              disabled={saving}
            />

            <ProfileInput
              id="creator-location"
              label="Alamat atau Lokasi"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              icon={MapPin}
              placeholder="Contoh: Surabaya, Indonesia"
              maxLength={150}
              disabled={saving}
            />

            <div className="md:col-span-2">
              <label
                htmlFor="creator-bio"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Bio
              </label>

              <textarea
                id="creator-bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={5}
                maxLength={3000}
                disabled={saving}
                placeholder="Ceritakan tentang dirimu, pengalaman, dan bidang yang kamu tekuni..."
                className="w-full resize-none rounded-xl border border-gray-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:bg-gray-50"
              />

              <p className="mt-1 text-right text-xs text-gray-400">
                {formData.bio.length}/3000
              </p>
            </div>

            <div className="md:col-span-2">
              <div className="border-t border-gray-100 pt-6">
                <h3 className="font-bold text-gray-800">Tautan Profesional</h3>

                <p className="mt-1 text-sm text-gray-400">
                  Tambahkan tautan portofolio dan profil profesionalmu. Semua
                  tautan bersifat opsional.
                </p>
              </div>
            </div>

            {linkFields.map((field) => (
              <ProfileInput
                key={field.name}
                id={`creator-${field.name}`}
                label={field.label}
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                icon={field.icon}
                type="url"
                placeholder={field.placeholder}
                maxLength={500}
                disabled={saving}
                helperText="Gunakan alamat lengkap yang diawali https://"
              />
            ))}

            <div className="flex justify-end border-t border-gray-100 pt-6 md:col-span-2">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {saving ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}

                {saving ? "Menyimpan..." : "Simpan Profil"}
              </button>
            </div>
          </div>
        </form>
      )}
    </CreatorSection>
  );
}

type ProfileInputProps = {
  id: string;
  label: string;
  value: string;
  icon: LucideIcon;
  name?: keyof ProfileForm;
  type?: "text" | "email" | "url";
  placeholder?: string;
  maxLength?: number;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  helperText?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

function ProfileInput({
  id,
  label,
  name,
  value,
  icon: Icon,
  type = "text",
  placeholder,
  maxLength,
  required = false,
  disabled = false,
  readOnly = false,
  helperText,
  onChange,
}: ProfileInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}

        {required && <span className="ml-1 text-rose-500">*</span>}
      </label>

      <div className="relative">
        <Icon
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          id={id}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          required={required}
          disabled={disabled}
          readOnly={readOnly}
          className={`w-full rounded-xl border border-gray-200 py-3 pl-11 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 ${
            disabled
              ? "cursor-not-allowed bg-gray-50 text-gray-500"
              : "bg-white"
          }`}
        />
      </div>

      <div className="mt-1 flex items-start justify-between gap-4">
        {helperText ? (
          <p className="text-xs text-gray-400">{helperText}</p>
        ) : (
          <span />
        )}

        {typeof maxLength === "number" && name && (
          <p className="flex-shrink-0 text-xs text-gray-400">
            {value.length}/{maxLength}
          </p>
        )}
      </div>
    </div>
  );
}
