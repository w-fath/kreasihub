# KreasiHub

KreasiHub adalah platform direktori kreatif dan portofolio digital yang digunakan untuk menampilkan, mengelola, dan mengeksplorasi karya para kreator.

Project ini dikembangkan sebagai tugas kelompok Program Magang Mandiri dan Studi Independen Bersertifikat (MSIB) pada Divisi Web Developer PT Vinix Seven Aurum.

## Tujuan Project

KreasiHub dikembangkan untuk:

- Menyediakan tempat bagi kreator untuk menampilkan karya dan portofolio digital.
- Memudahkan pengguna dalam menemukan karya berdasarkan kategori.
- Mendukung pengelolaan profil dan portofolio kreator.
- Menerapkan pengembangan frontend, backend, dan basis data dalam satu aplikasi web.

## Teknologi yang Digunakan

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Lucide React

### Backend

- Node.js
- Express.js
- MySQL
- MySQL2
- bcryptjs
- JSON Web Token
- dotenv
- CORS

## Fitur

Fitur yang telah dan sedang dikembangkan:

- Registrasi pengguna.
- Login menggunakan email dan password.
- Validasi data pengguna.
- Enkripsi password menggunakan bcryptjs.
- Autentikasi menggunakan JSON Web Token.
- Dashboard kreator.
- Pengelolaan profil kreator.
- Pengelolaan portofolio.
- Direktori karya kreatif.
- Pencarian dan kategori karya.

> Tombol login melalui Google, Facebook, dan X saat ini masih berupa tampilan antarmuka dan belum terhubung dengan layanan autentikasi.

## Struktur Project

```text
kreasihub/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   └── pages/
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── routes/
│   ├── .env.example
│   ├── app.js
│   └── package.json
│
└── README.md
```

## Persyaratan

Pastikan perangkat sudah memiliki:

- Node.js
- npm
- MySQL
- Laragon atau aplikasi server lokal lainnya
- Git
- Visual Studio Code

## Instalasi

### 1. Clone repository

```bash
git clone https://github.com/w-fath/kreasihub.git
cd kreasihub
```

### 2. Instal dependency frontend

```bash
cd client
npm install
```

### 3. Instal dependency backend

```bash
cd ../server
npm install
```

## Konfigurasi Frontend

Salin file contoh konfigurasi:

```bash
cp client/.env.example client/.env
```

Isi `client/.env`:

```env
VITE_API_URL=http://localhost:3000
```

## Konfigurasi Backend

Salin file contoh konfigurasi:

```bash
cp server/.env.example server/.env
```

Isi `server/.env`:

```env
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=kreasihub

JWT_SECRET=ganti_dengan_secret_acak
JWT_EXPIRES_IN=1d
```

Gunakan nilai `JWT_SECRET` yang berbeda pada setiap perangkat. Jangan mengunggah file `.env` ke repository.

## Konfigurasi Database

Buat database MySQL:

```sql
CREATE DATABASE kreasihub
CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;
```

Kemudian pilih database `kreasihub` dan buat tabel `users`:

```sql
CREATE TABLE users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('creator', 'admin') NOT NULL DEFAULT 'creator',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB
DEFAULT CHARACTER SET utf8mb4
COLLATE utf8mb4_general_ci;
```

## Menjalankan Project

Frontend dan backend dijalankan pada terminal yang berbeda.

### Menjalankan frontend

```bash
cd client
npm run dev
```

Frontend dapat dibuka melalui:

```text
http://localhost:5173
```

### Menjalankan backend

```bash
cd server
npm run dev
```

Backend berjalan melalui:

```text
http://localhost:3000
```

## Endpoint Autentikasi

### Register

```http
POST /api/auth/register
```

Contoh data:

```json
{
  "name": "Nama Pengguna",
  "email": "pengguna@example.com",
  "password": "password123",
  "passwordConfirmation": "password123"
}
```

### Login

```http
POST /api/auth/login
```

Contoh data:

```json
{
  "email": "pengguna@example.com",
  "password": "password123"
}
```

## Alur Pengembangan Git

Setiap fitur dikerjakan melalui branch terpisah.

Contoh:

```bash
git switch main
git pull origin main
git switch -c feature/nama-fitur
```

Setelah fitur selesai:

```bash
git add .
git commit -m "feat: implement nama fitur"
git push -u origin feature/nama-fitur
```

Kemudian buat Pull Request dari branch fitur menuju `main`.

## Tim Pengembang

| Nama | Tanggung Jawab |
|---|---|
| Rama | UI/UX |
| Ari Setia Hinanda | Frontend |
| Fathor Rozi | Backend |

## Status Project

Project masih dalam tahap pengembangan.

Beberapa fitur dan struktur basis data dapat berubah sesuai kebutuhan pengembangan dan hasil evaluasi kelompok.
