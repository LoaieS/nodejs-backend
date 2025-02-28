-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 28, 2025 at 09:15 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `backend_db`
--
CREATE DATABASE IF NOT EXISTS `backend_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `backend_db`;

-- --------------------------------------------------------

--
-- Table structure for table `articles`
--

CREATE TABLE `articles` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `content` text DEFAULT NULL,
  `author` varchar(255) NOT NULL,
  `type` enum('Help','Strategy','Discussion') NOT NULL DEFAULT 'Discussion',
  `image_path` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `articles`
--

INSERT INTO `articles` (`id`, `title`, `description`, `content`, `author`, `type`, `image_path`, `created_at`, `updated_at`) VALUES
(1, 'Roguelike Chess Tactics', 'An overview of the top tactics to use in Sharanj.', 'In-depth explanation of how to combine chess strategies with roguelike elements to outmaneuver your foes in Sharanj. Detailed examples follow. This article also covers tactical movements and common pitfalls to avoid during gameplay, offering valuable insights for both new and experienced players.', 'Tareq', 'Strategy', 'https://chessmood.sfo3.cdn.digitaloceanspaces.com/chessmood/images/articles/826/1690107709_64bcff3d98c9a.webp', '2025-02-28 18:17:47', '2025-02-28 18:17:47'),
(2, 'Advanced Builds and Decks', 'How to customize your hero and deck for advanced play.', 'For experienced players seeking an extra challenge, we explore advanced hero builds and deck synergies to conquer the toughest dungeons. Detailed analysis and expert advice are provided, ensuring you can optimize your strategy and create powerful combinations for advanced play.', 'Arnold', 'Discussion', 'https://minireview.io/common/uploads/cache/review/1-900-506-219ba0cf99911662027337044c60dcdf.webp', '2025-02-28 16:17:47', '2025-02-28 19:50:40'),
(3, 'Advanced Builds and Decks', 'How to customize your hero and deck for advanced play.', 'For experienced players seeking an extra challenge, we explore advanced hero builds and deck synergies to conquer the toughest dungeons. Detailed analysis and expert advice are provided, ensuring you can optimize your strategy and create powerful combinations for advanced play.', 'Loaie', 'Discussion', 'https://minireview.io/common/uploads/cache/review/1-900-506-219ba0cf99911662027337044c60dcdf.webp', '2025-02-28 18:17:47', '2025-02-28 19:45:02');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('user','admin') NOT NULL DEFAULT 'user'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `password`, `role`) VALUES
(1, 'Loaie', 'potato1@gmail.com', '$2b$10$op2ry9pu65NYVR.3uS6l8eEciZv1zEqrVMVTtAwwaeFwozlLpIQFC', 'user'),
(6, 'Tareq', 'potato2@gmail.com', '$2b$10$uLUXFdzMK/46L0Vg9PTAdeBgzCpxGFg5oTxFw8R9fUrXbM7hO7aO6', 'user'),
(7, 'Arnold', 'potato3@gmail.com', '$2b$10$AI/ZF/uV0l7MZ3avlVf3DOBBMaMtyZwtOVrDO9j4vJZQJF.jO33Zq', 'admin'),
(8, 'admin', 'admin@gmail.com', '$2b$10$e9u65zPfmf.lqbBvHtqw/OJPWAO.H1f4Bh31zNJMQhN1x6lpufxzK', 'admin');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `articles`
--
ALTER TABLE `articles`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
