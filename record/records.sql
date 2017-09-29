-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: 2017-04-09 14:10:11
-- 服务器版本： 5.7.14
-- PHP Version: 7.0.10

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `record`
--

-- --------------------------------------------------------

--
-- 表的结构 `records`
--

CREATE TABLE `records` (
  `id` int(11) NOT NULL,
  `webchat` varchar(15) COLLATE utf8_unicode_ci NOT NULL,
  `remark` text COLLATE utf8_unicode_ci COMMENT 'å¤‡æ³¨',
  `record_path` varchar(255) COLLATE utf8_unicode_ci NOT NULL COMMENT 'ç›¸å¯¹è·¯å¾„ï¼ˆæ–‡ä»¶åï¼‰ä¸Šä¼ æ—¶é—´+ä¸€ä¸ªéšæœºæ•°',
  `uploadtime` int(11) NOT NULL COMMENT 'å‘è¡¨æ—¶é—´/ä¸Šä¼ '
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
