-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Waktu pembuatan: 28 Jul 2026 pada 17.01
-- Versi server: 8.0.30
-- Versi PHP: 8.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Basis data: `kreasihub`
--

-- --------------------------------------------------------

--
-- Struktur dari tabel `categories`
--

CREATE TABLE `categories` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(120) COLLATE utf8mb4_general_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `created_at`, `updated_at`) VALUES
(1, 'Web Design', 'web-design', '2026-07-25 15:15:34', '2026-07-25 15:15:34'),
(2, 'Logo', 'logo', '2026-07-25 15:15:34', '2026-07-25 15:15:34'),
(3, 'Ilustrasi', 'ilustrasi', '2026-07-25 15:15:34', '2026-07-25 15:15:34'),
(4, '3Ds', '3ds', '2026-07-25 15:15:34', '2026-07-25 15:21:40'),
(5, 'UI/UX Design', 'ui-ux-design', '2026-07-25 15:15:34', '2026-07-25 15:15:34'),
(6, 'Desain Grafis', 'desain-grafis', '2026-07-25 15:15:34', '2026-07-25 15:15:34'),
(7, 'Fotografi', 'fotografi', '2026-07-25 15:15:34', '2026-07-25 15:15:34'),
(8, 'Mobile App', 'mobile-app', '2026-07-25 15:15:34', '2026-07-25 15:15:34'),
(9, 'Code', 'code', '2026-07-25 15:20:29', '2026-07-25 15:20:29');

-- --------------------------------------------------------

--
-- Struktur dari tabel `creator_follows`
--

CREATE TABLE `creator_follows` (
  `id` int UNSIGNED NOT NULL,
  `follower_user_id` int UNSIGNED NOT NULL,
  `creator_user_id` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `creator_follows`
--

INSERT INTO `creator_follows` (`id`, `follower_user_id`, `creator_user_id`, `created_at`) VALUES
(2, 3, 2, '2026-07-26 15:40:33');

-- --------------------------------------------------------

--
-- Struktur dari tabel `creator_profiles`
--

CREATE TABLE `creator_profiles` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `slug` varchar(140) COLLATE utf8mb4_general_ci NOT NULL,
  `expertise` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `bio` text COLLATE utf8mb4_general_ci,
  `location` varchar(150) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `portfolio_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `github_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `linkedin_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `instagram_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `behance_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `dribbble_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `profile_photo` varchar(255) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `creator_profiles`
--

INSERT INTO `creator_profiles` (`id`, `user_id`, `slug`, `expertise`, `bio`, `location`, `portfolio_url`, `github_url`, `linkedin_url`, `instagram_url`, `behance_url`, `dribbble_url`, `profile_photo`, `created_at`, `updated_at`) VALUES
(1, 2, 'creator-2', 'Web Developer', 'yaa gimana ya, ya ndak tahu... kok nanya saya!', 'Jauh Intinya', NULL, 'https://github.com/w-fath/kreasihub', NULL, NULL, NULL, NULL, '/uploads/profiles/profile-2-1785061190931-408982.png', '2026-07-26 09:08:11', '2026-07-26 10:42:32');

-- --------------------------------------------------------

--
-- Struktur dari tabel `creator_reviews`
--

CREATE TABLE `creator_reviews` (
  `id` int UNSIGNED NOT NULL,
  `creator_user_id` int UNSIGNED NOT NULL,
  `reviewer_user_id` int UNSIGNED NOT NULL,
  `rating` tinyint UNSIGNED NOT NULL,
  `review` text COLLATE utf8mb4_general_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struktur dari tabel `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(100) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` enum('creator','admin') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'creator',
  `status` enum('aktif','nonaktif') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'aktif',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `status`, `created_at`, `updated_at`) VALUES
(1, 'Fathor Rozi', 'fathorrozi.ac@gmail.com', '$2b$10$8oELW/EAjRXUF.RgriuqKOYiU0bTCT8pb5hkIkMSpeJ9.WZrrU.qC', 'admin', 'aktif', '2026-07-24 08:37:02', '2026-07-25 08:32:40'),
(2, 'Huhuuuuuuu', 'fathorrozi.com@gmail.com', '$2b$12$Reb2jnWAPeqIaAmeH2Kt2e2LJ4NT5kLkPDGJdjw.T1cRiI4f6o7bO', 'creator', 'aktif', '2026-07-24 09:25:40', '2026-07-26 10:27:07'),
(3, 'Rama', 'rama@gmail.com', '$2b$10$WLT3B4X6WtNij8PW3phttuoz30Iz5Ggfo3Fityrhlq9Z1xGZN4.le', 'creator', 'aktif', '2026-07-26 15:32:44', '2026-07-26 15:32:44');

-- --------------------------------------------------------

--
-- Struktur dari tabel `user_preferences`
--

CREATE TABLE `user_preferences` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `review_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `portfolio_notifications` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `user_preferences`
--

INSERT INTO `user_preferences` (`id`, `user_id`, `review_notifications`, `portfolio_notifications`, `created_at`, `updated_at`) VALUES
(1, 2, 1, 1, '2026-07-26 10:25:23', '2026-07-26 10:25:23');

-- --------------------------------------------------------

--
-- Struktur dari tabel `works`
--

CREATE TABLE `works` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `category_id` int UNSIGNED NOT NULL,
  `title` varchar(150) COLLATE utf8mb4_general_ci NOT NULL,
  `slug` varchar(190) COLLATE utf8mb4_general_ci NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `thumbnail` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `project_url` varchar(500) COLLATE utf8mb4_general_ci DEFAULT NULL,
  `status` enum('pending','approved','rejected') COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'pending',
  `rejection_note` text COLLATE utf8mb4_general_ci,
  `views_count` int UNSIGNED NOT NULL DEFAULT '0',
  `likes_count` int UNSIGNED NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `works`
--

INSERT INTO `works` (`id`, `user_id`, `category_id`, `title`, `slug`, `description`, `thumbnail`, `project_url`, `status`, `rejection_note`, `views_count`, `likes_count`, `created_at`, `updated_at`) VALUES
(1, 2, 6, 'QR Order System', 'qr-order-system', 'Melakukan pemesanan makan menggunakan QR di meja pada sebuat cafee atau restoran.', '/uploads/works/1785051668435-332974892.png', 'https://kitangoding.com', 'approved', NULL, 2, 1, '2026-07-26 07:41:08', '2026-07-27 19:43:14'),
(2, 2, 7, 'Huhu.. Laper bet aku', 'huhu-laper-bet-aku', 'Ayam geprek yang di murnikan menggunakan tulang dewa naga kuno sehingga dapat menghasilkan ayam geprek surgawi tingkat 7.', '/uploads/works/1785181594404-58466253.jfif', NULL, 'approved', NULL, 1, 0, '2026-07-27 19:46:34', '2026-07-27 19:47:34');

-- --------------------------------------------------------

--
-- Struktur dari tabel `work_likes`
--

CREATE TABLE `work_likes` (
  `id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `work_id` int UNSIGNED NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data untuk tabel `work_likes`
--

INSERT INTO `work_likes` (`id`, `user_id`, `work_id`, `created_at`) VALUES
(1, 3, 1, '2026-07-26 15:48:31');

--
-- Indeks untuk tabel yang dibuang
--

--
-- Indeks untuk tabel `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_category_name` (`name`),
  ADD UNIQUE KEY `unique_category_slug` (`slug`);

--
-- Indeks untuk tabel `creator_follows`
--
ALTER TABLE `creator_follows`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_creator_follow` (`follower_user_id`,`creator_user_id`),
  ADD KEY `index_creator_follows_creator` (`creator_user_id`);

--
-- Indeks untuk tabel `creator_profiles`
--
ALTER TABLE `creator_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_creator_profile_user` (`user_id`),
  ADD UNIQUE KEY `unique_creator_profile_slug` (`slug`);

--
-- Indeks untuk tabel `creator_reviews`
--
ALTER TABLE `creator_reviews`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_creator_reviewer` (`creator_user_id`,`reviewer_user_id`),
  ADD KEY `fk_creator_reviews_reviewer` (`reviewer_user_id`);

--
-- Indeks untuk tabel `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indeks untuk tabel `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_preference` (`user_id`);

--
-- Indeks untuk tabel `works`
--
ALTER TABLE `works`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `slug` (`slug`),
  ADD KEY `idx_works_user_id` (`user_id`),
  ADD KEY `idx_works_category_id` (`category_id`),
  ADD KEY `idx_works_status` (`status`),
  ADD KEY `idx_works_created_at` (`created_at`);

--
-- Indeks untuk tabel `work_likes`
--
ALTER TABLE `work_likes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_work_like` (`user_id`,`work_id`),
  ADD KEY `index_work_likes_work` (`work_id`);

--
-- AUTO_INCREMENT untuk tabel yang dibuang
--

--
-- AUTO_INCREMENT untuk tabel `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT untuk tabel `creator_follows`
--
ALTER TABLE `creator_follows`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `creator_profiles`
--
ALTER TABLE `creator_profiles`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `creator_reviews`
--
ALTER TABLE `creator_reviews`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT untuk tabel `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT untuk tabel `user_preferences`
--
ALTER TABLE `user_preferences`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT untuk tabel `works`
--
ALTER TABLE `works`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT untuk tabel `work_likes`
--
ALTER TABLE `work_likes`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Ketidakleluasaan untuk tabel pelimpahan (Dumped Tables)
--

--
-- Ketidakleluasaan untuk tabel `creator_follows`
--
ALTER TABLE `creator_follows`
  ADD CONSTRAINT `fk_creator_follows_creator` FOREIGN KEY (`creator_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_creator_follows_follower` FOREIGN KEY (`follower_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `creator_profiles`
--
ALTER TABLE `creator_profiles`
  ADD CONSTRAINT `fk_creator_profiles_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `creator_reviews`
--
ALTER TABLE `creator_reviews`
  ADD CONSTRAINT `fk_creator_reviews_creator` FOREIGN KEY (`creator_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_creator_reviews_reviewer` FOREIGN KEY (`reviewer_user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `user_preferences`
--
ALTER TABLE `user_preferences`
  ADD CONSTRAINT `fk_user_preferences_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `works`
--
ALTER TABLE `works`
  ADD CONSTRAINT `fk_works_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_works_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ketidakleluasaan untuk tabel `work_likes`
--
ALTER TABLE `work_likes`
  ADD CONSTRAINT `fk_work_likes_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_work_likes_work` FOREIGN KEY (`work_id`) REFERENCES `works` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
