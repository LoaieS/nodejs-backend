-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 02, 2025 at 07:08 PM
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
(1, 'Roguelike Chess Tactic', 'An overview of the top tactics to use in Sharanj.', 'In-depth explanation of how to combine chess strategies with roguelike elements to outmaneuver your foes in Sharanj. Detailed examples follow. This article also covers tactical movements and common pitfalls to avoid during gameplay, offering valuable insights for both new and experienced players.', 'Loaie', 'Strategy', '/images/1729481724512.jpg', '2025-02-28 18:17:47', '2025-03-02 17:43:05'),
(2, 'Beginner’s Guide to Sharanj', 'All you need to know to start playing Sharanj today.', 'From basic movement to special abilities, learn everything you need to begin your journey in the Sharanj universe. Here’s what you should know...', 'Arnold', 'Help', '/images/1740936930480.jpg', '2025-02-28 16:17:47', '2025-03-02 17:35:30'),
(3, 'Advanced Builds and Deck', 'How to customize your hero and deck for advanced play.', 'For experienced players seeking an extra challenge, we explore advanced hero builds and deck synergies to conquer the toughest dungeons. Detailed analysis and expert advice are provided, ensuring you can optimize your strategy and create powerful combinations for advanced play.', 'Loaie', 'Discussion', '/images/1740936517642.jpg', '2025-02-28 18:17:47', '2025-03-02 17:50:55'),
(20, 'Welcome to Sharanj: The Ultimate Chess Adventure', 'Introduces the game and invites players to share their first impressions.', 'Welcome to the official forum for Sharanj – a groundbreaking blend of roguelike challenges, deckbuilding mechanics, and chess strategy!\r\n\r\nIn Sharanj, every match is a unique adventure where the classic game of chess is infused with unpredictability and tactical depth. Whether you\'re a seasoned strategist or new to the genre, join the conversation and share your first impressions, questions, and tips.\r\n\r\nLet\'s build a community that thrives on creativity and strategy!', 'admin', 'Discussion', '/images/1740937117830.jpg', '2025-03-02 17:38:37', '2025-03-02 17:38:37'),
(21, 'Mastering Deckbuilding in Sharanj', 'A deep dive into deckbuilding tactics to enhance your gameplay.', 'Deckbuilding is a core aspect of Sharanj. In this article, we’ll explore advanced tactics to help you build a powerful deck that complements your chess strategies.\r\n\r\nLearn which cards best suit aggressive plays versus defensive maneuvers, how to combine abilities for synergy, and tips on adjusting your deck on the fly when the game throws you unexpected challenges.\r\n\r\nShare your strategies and discuss what works best for you in the ever-evolving battles of Sharanj!', 'Tareq', 'Strategy', '/images/1740937185311.jpg', '2025-03-02 17:39:45', '2025-03-02 17:54:51');

-- --------------------------------------------------------

--
-- Table structure for table `contact_messages`
--

CREATE TABLE `contact_messages` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `message` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `contact_messages`
--

INSERT INTO `contact_messages` (`id`, `name`, `email`, `message`) VALUES
(1, 'Loaie', 'loaie.sh@hotmail.co.il', 'Please help me be able to login to your website!! Stam...');

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
(8, 'admin', 'admin@gmail.com', '$2b$10$e9u65zPfmf.lqbBvHtqw/OJPWAO.H1f4Bh31zNJMQhN1x6lpufxzK', 'admin'),
(12, 'Arnoldinho', 'potato4@gmail.com', '$2b$10$vsZa4P9agOows8mgMBi0B.VXUN4WdmM0Riltt7qVXirT8zy8SJCLm', 'user'),
(13, 'newUser', 'newUser@gmail.com', '$2b$10$mPnYKiqals4xocVUOio/jOfg8eOqJXCzfE4NGpeEAvf5Iu0rlhrAS', 'user');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `articles`
--
ALTER TABLE `articles`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `contact_messages`
--
ALTER TABLE `contact_messages`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `contact_messages`
--
ALTER TABLE `contact_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
