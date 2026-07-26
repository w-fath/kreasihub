import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import {
  Bell,
  CheckCircle,
  Eye,
  EyeOff,
  LoaderCircle,
  Lock,
  Save,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CreatorSection } from "../components/CreatorSection";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

type PasswordForm = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

type NotificationSettings = {
  review_notifications: boolean;
  portfolio_notifications: boolean;
};

type ApiResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};

const initialPasswordForm: PasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const initialNotificationSettings: NotificationSettings = {
  review_notifications: true,
  portfolio_notifications: true,
};

export function PengaturanPage() {
  const navigate = useNavigate();

  const [passwordForm, setPasswordForm] =
    useState<PasswordForm>(initialPasswordForm);

  const [notifications, setNotifications] = useState<NotificationSettings>(
    initialNotificationSettings,
  );

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loadingNotifications, setLoadingNotifications] = useState(true);

  const [savingPassword, setSavingPassword] = useState(false);

  const [savingNotifications, setSavingNotifications] = useState(false);

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const [notificationError, setNotificationError] = useState<string | null>(
    null,
  );

  const [notificationSuccess, setNotificationSuccess] = useState<string | null>(
    null,
  );

  const handleUnauthorized = useCallback(() => {
    localStorage.removeItem("kreasihub_token");
    localStorage.removeItem("kreasihub_user");
    navigate("/login", { replace: true });
  }, [navigate]);

  const loadNotificationSettings = useCallback(async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setLoadingNotifications(true);
      setNotificationError(null);

      const response = await fetch(
        `${API_URL}/api/creator/settings/notifications`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const result =
        (await response.json()) as ApiResponse<NotificationSettings>;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setNotificationError(
          "Kamu tidak memiliki akses ke pengaturan creator.",
        );
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setNotificationError(
          result.message || "Preferensi notifikasi gagal diambil.",
        );
        return;
      }

      setNotifications(result.data);
    } catch (requestError) {
      console.error("Load notification settings error:", requestError);

      setNotificationError("Tidak dapat terhubung ke server.");
    } finally {
      setLoadingNotifications(false);
    }
  }, [handleUnauthorized]);

  useEffect(() => {
    void loadNotificationSettings();
  }, [loadNotificationSettings]);

  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    setPasswordForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }));

    setPasswordError(null);
    setPasswordSuccess(null);
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    if (!passwordForm.currentPassword) {
      setPasswordError("Password saat ini wajib diisi.");
      return;
    }

    if (passwordForm.newPassword.length < 8) {
      setPasswordError("Password baru minimal 8 karakter.");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("Konfirmasi password baru tidak sama.");
      return;
    }

    try {
      setSavingPassword(true);
      setPasswordError(null);
      setPasswordSuccess(null);

      const response = await fetch(`${API_URL}/api/creator/settings/password`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current_password: passwordForm.currentPassword,
          new_password: passwordForm.newPassword,
          confirm_password: passwordForm.confirmPassword,
        }),
      });

      const result = (await response.json()) as ApiResponse;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setPasswordError("Kamu tidak memiliki akses untuk mengubah password.");
        return;
      }

      if (!response.ok || !result.success) {
        setPasswordError(result.message || "Password gagal diperbarui.");
        return;
      }

      setPasswordForm(initialPasswordForm);
      setPasswordSuccess(result.message);
    } catch (requestError) {
      console.error("Update creator password error:", requestError);

      setPasswordError("Tidak dapat terhubung ke server.");
    } finally {
      setSavingPassword(false);
    }
  };

  const handleNotificationSubmit = async () => {
    const token = localStorage.getItem("kreasihub_token");

    if (!token) {
      handleUnauthorized();
      return;
    }

    try {
      setSavingNotifications(true);
      setNotificationError(null);
      setNotificationSuccess(null);

      const response = await fetch(
        `${API_URL}/api/creator/settings/notifications`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(notifications),
        },
      );

      const result =
        (await response.json()) as ApiResponse<NotificationSettings>;

      if (response.status === 401) {
        handleUnauthorized();
        return;
      }

      if (response.status === 403) {
        setNotificationError(
          "Kamu tidak memiliki akses untuk menyimpan pengaturan.",
        );
        return;
      }

      if (!response.ok || !result.success || !result.data) {
        setNotificationError(
          result.message || "Preferensi notifikasi gagal disimpan.",
        );
        return;
      }

      setNotifications(result.data);
      setNotificationSuccess(result.message);
    } catch (requestError) {
      console.error("Update notification settings error:", requestError);

      setNotificationError("Tidak dapat terhubung ke server.");
    } finally {
      setSavingNotifications(false);
    }
  };

  return (
    <CreatorSection
      title="Pengaturan Akun"
      description="Kelola keamanan dan preferensi akun kreatormu."
    >
      <div className="w-full max-w-3xl space-y-8">
        <form className="space-y-5" onSubmit={handlePasswordSubmit}>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <ShieldCheck size={21} />
            </div>

            <div>
              <h3 className="font-bold text-gray-800">Ubah Password</h3>

              <p className="mt-1 text-sm text-gray-400">
                Gunakan password yang kuat dan tidak mudah ditebak.
              </p>
            </div>
          </div>

          {passwordError && (
            <div className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              <XCircle size={18} />
              {passwordError}
            </div>
          )}

          {passwordSuccess && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
              <CheckCircle size={18} />
              {passwordSuccess}
            </div>
          )}

          <PasswordInput
            id="current-password"
            label="Password Saat Ini"
            name="currentPassword"
            value={passwordForm.currentPassword}
            placeholder="Masukkan password saat ini"
            visible={showCurrentPassword}
            onToggleVisibility={() => setShowCurrentPassword((value) => !value)}
            onChange={handlePasswordChange}
            disabled={savingPassword}
          />

          <PasswordInput
            id="new-password"
            label="Password Baru"
            name="newPassword"
            value={passwordForm.newPassword}
            placeholder="Minimal 8 karakter"
            visible={showNewPassword}
            onToggleVisibility={() => setShowNewPassword((value) => !value)}
            onChange={handlePasswordChange}
            disabled={savingPassword}
          />

          <PasswordInput
            id="confirm-password"
            label="Konfirmasi Password Baru"
            name="confirmPassword"
            value={passwordForm.confirmPassword}
            placeholder="Ulangi password baru"
            visible={showConfirmPassword}
            onToggleVisibility={() => setShowConfirmPassword((value) => !value)}
            onChange={handlePasswordChange}
            disabled={savingPassword}
          />

          <button
            type="submit"
            disabled={savingPassword}
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {savingPassword ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <Save size={17} />
            )}

            {savingPassword ? "Menyimpan..." : "Simpan Password"}
          </button>
        </form>

        <div className="border-t border-gray-100 pt-8">
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <Bell size={21} />
            </div>

            <div>
              <h3 className="font-bold text-gray-800">Notifikasi</h3>

              <p className="mt-1 text-sm text-gray-400">
                Atur pemberitahuan yang ingin diterima.
              </p>
            </div>
          </div>

          {notificationError && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600">
              <XCircle size={18} />
              {notificationError}
            </div>
          )}

          {notificationSuccess && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
              <CheckCircle size={18} />
              {notificationSuccess}
            </div>
          )}

          {loadingNotifications ? (
            <div className="flex min-h-40 items-center justify-center">
              <div className="flex items-center gap-3 text-sm text-gray-400">
                <LoaderCircle size={19} className="animate-spin" />
                Memuat preferensi notifikasi...
              </div>
            </div>
          ) : (
            <>
              <div className="mt-5 space-y-4">
                <NotificationOption
                  title="Status review karya"
                  description="Notifikasi ketika karya disetujui atau ditolak."
                  checked={notifications.review_notifications}
                  disabled={savingNotifications}
                  onChange={(checked) =>
                    setNotifications((current) => ({
                      ...current,
                      review_notifications: checked,
                    }))
                  }
                />

                <NotificationOption
                  title="Aktivitas portofolio"
                  description="Notifikasi saat karya dilihat atau disukai."
                  checked={notifications.portfolio_notifications}
                  disabled={savingNotifications}
                  onChange={(checked) =>
                    setNotifications((current) => ({
                      ...current,
                      portfolio_notifications: checked,
                    }))
                  }
                />
              </div>

              <button
                type="button"
                onClick={() => void handleNotificationSubmit()}
                disabled={savingNotifications}
                className="mt-5 flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {savingNotifications ? (
                  <LoaderCircle size={17} className="animate-spin" />
                ) : (
                  <Save size={17} />
                )}

                {savingNotifications ? "Menyimpan..." : "Simpan Preferensi"}
              </button>
            </>
          )}
        </div>
      </div>
    </CreatorSection>
  );
}

type PasswordInputProps = {
  id: string;
  label: string;
  name: keyof PasswordForm;
  value: string;
  placeholder: string;
  visible: boolean;
  disabled: boolean;
  onToggleVisibility: () => void;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

function PasswordInput({
  id,
  label,
  name,
  value,
  placeholder,
  visible,
  disabled,
  onToggleVisibility,
  onChange,
}: PasswordInputProps) {
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        {label}
      </label>

      <div className="relative">
        <Lock
          size={17}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          id={id}
          type={visible ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          autoComplete={
            name === "currentPassword" ? "current-password" : "new-password"
          }
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-200 py-3 pl-11 pr-12 text-sm outline-none transition focus:border-blue-400 focus:ring-4 focus:ring-blue-50 disabled:bg-gray-50"
        />

        <button
          type="button"
          onClick={onToggleVisibility}
          disabled={disabled}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 transition hover:text-gray-700"
          aria-label={visible ? "Sembunyikan password" : "Tampilkan password"}
        >
          {visible ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </div>
    </div>
  );
}

type NotificationOptionProps = {
  title: string;
  description: string;
  checked: boolean;
  disabled: boolean;
  onChange: (checked: boolean) => void;
};

function NotificationOption({
  title,
  description,
  checked,
  disabled,
  onChange,
}: NotificationOptionProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-5 rounded-xl border border-gray-100 p-4 transition hover:border-blue-100 hover:bg-blue-50/20">
      <div>
        <p className="text-sm font-semibold text-gray-700">{title}</p>

        <p className="mt-1 text-xs leading-5 text-gray-400">{description}</p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange(event.target.checked)}
        className="h-5 w-5 flex-shrink-0 accent-blue-600"
      />
    </label>
  );
}
