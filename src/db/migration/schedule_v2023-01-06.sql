-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jan 06, 2023 at 06:00 AM
-- Server version: 10.4.21-MariaDB
-- PHP Version: 8.0.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `schedule`
--

-- --------------------------------------------------------

--
-- Table structure for table `reservation`
--

CREATE TABLE `reservation` (
  `id` bigint(20) NOT NULL,
  `targetDate` date NOT NULL,
  `startTime` time NOT NULL,
  `endTime` time NOT NULL,
  `vehicleTypeId` bigint(20) NOT NULL,
  `teacherId` bigint(20) NOT NULL,
  `status` int(11) NOT NULL,
  `reason` text DEFAULT NULL,
  `createdBy` bigint(20) NOT NULL,
  `updatedBy` bigint(20) DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedDate` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `reservation`
--

INSERT INTO `reservation` (`id`, `targetDate`, `startTime`, `endTime`, `vehicleTypeId`, `teacherId`, `status`, `reason`, `createdBy`, `updatedBy`, `createdDate`, `updatedDate`) VALUES
(25, '2023-01-05', '10:00:00', '12:00:00', 2, 9, 1, NULL, 9, NULL, '2023-01-05 04:21:56', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `role`
--

CREATE TABLE `role` (
  `id` bigint(20) NOT NULL,
  `code` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `role`
--

INSERT INTO `role` (`id`, `code`, `name`) VALUES
(1, '1', 'admin'),
(2, '2', 'teacher'),
(3, '3', 'student'),
(4, '4', 'teacher vip');

-- --------------------------------------------------------

--
-- Table structure for table `student_teacher`
--

CREATE TABLE `student_teacher` (
  `studentId` bigint(11) NOT NULL,
  `teacherId` bigint(11) NOT NULL,
  `createdBy` bigint(20) NOT NULL,
  `updatedBy` bigint(20) DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedDate` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id` bigint(20) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `fullname` varchar(255) NOT NULL,
  `phone` varchar(255) NOT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `createdBy` bigint(20) DEFAULT NULL,
  `updatedBy` bigint(20) DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedDate` timestamp NULL DEFAULT NULL,
  `status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id`, `username`, `password`, `fullname`, `phone`, `nickname`, `email`, `createdBy`, `updatedBy`, `createdDate`, `updatedDate`, `status`) VALUES
(9, 'admin', '$2b$10$T1cfw8AVTEMftySZek1EteugtbdVIqjQ8tUHQ4iMl2nvBHea.qdBq', 'admin', '0987795761', 'TonDuong', '', NULL, NULL, '2023-01-05 03:41:28', NULL, 1),
(11, 'teacher', '$2b$10$Nt0OeAhrMr5p2XwlGIIBO.7zLOhtBii0WPzewyrlCgFPsXAxi7ClC', 'Duong Tan Ton', '0987795761', NULL, NULL, 9, NULL, '2023-01-06 11:44:24', NULL, 1),
(12, 'student', '$2b$10$VBerx8NnxZSjvVk0HbkOzetTLkbY1t5b8PPGS8OdvXm42Yor5hwBa', 'Nguyen Van Ha', '0987795761', NULL, NULL, 9, NULL, '2023-01-06 11:54:26', NULL, 1);

-- --------------------------------------------------------

--
-- Table structure for table `user_role`
--

CREATE TABLE `user_role` (
  `roleId` bigint(20) NOT NULL,
  `userId` bigint(20) NOT NULL,
  `createdBy` bigint(20) NOT NULL,
  `updatedBy` bigint(20) DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedDate` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `user_role`
--

INSERT INTO `user_role` (`roleId`, `userId`, `createdBy`, `updatedBy`, `createdDate`, `updatedDate`) VALUES
(1, 9, 9, NULL, '2023-01-06 03:47:41', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `vehicle_type`
--

CREATE TABLE `vehicle_type` (
  `id` bigint(20) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `createdBy` bigint(20) NOT NULL,
  `updatedBy` bigint(20) DEFAULT NULL,
  `createdDate` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedDate` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `vehicle_type`
--

INSERT INTO `vehicle_type` (`id`, `name`, `description`, `createdBy`, `updatedBy`, `createdDate`, `updatedDate`) VALUES
(2, 'Toyota', NULL, 9, NULL, '2023-01-05 04:00:25', NULL),
(3, 'Chevrolet', NULL, 9, NULL, '2023-01-05 04:00:39', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reservation`
--
ALTER TABLE `reservation`
  ADD PRIMARY KEY (`id`),
  ADD KEY `vehicleTypeId` (`vehicleTypeId`),
  ADD KEY `teacherId` (`teacherId`,`createdBy`,`updatedBy`),
  ADD KEY `updatedBy` (`updatedBy`),
  ADD KEY `createdBy` (`createdBy`);

--
-- Indexes for table `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `student_teacher`
--
ALTER TABLE `student_teacher`
  ADD PRIMARY KEY (`studentId`,`teacherId`),
  ADD KEY `teacherId` (`teacherId`),
  ADD KEY `studentId` (`studentId`),
  ADD KEY `createdBy` (`createdBy`,`updatedBy`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD KEY `createdBy` (`createdBy`,`updatedBy`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `user_role`
--
ALTER TABLE `user_role`
  ADD PRIMARY KEY (`roleId`,`userId`),
  ADD KEY `roleId` (`roleId`,`userId`),
  ADD KEY `userId` (`userId`),
  ADD KEY `createdBy` (`createdBy`,`updatedBy`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- Indexes for table `vehicle_type`
--
ALTER TABLE `vehicle_type`
  ADD PRIMARY KEY (`id`),
  ADD KEY `createdBy` (`createdBy`,`updatedBy`),
  ADD KEY `updatedBy` (`updatedBy`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reservation`
--
ALTER TABLE `reservation`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `role`
--
ALTER TABLE `role`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `user`
--
ALTER TABLE `user`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `vehicle_type`
--
ALTER TABLE `vehicle_type`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reservation`
--
ALTER TABLE `reservation`
  ADD CONSTRAINT `reservation_ibfk_1` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `reservation_ibfk_2` FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `reservation_ibfk_3` FOREIGN KEY (`vehicleTypeId`) REFERENCES `vehicle_type` (`id`),
  ADD CONSTRAINT `reservation_ibfk_4` FOREIGN KEY (`teacherId`) REFERENCES `user` (`id`);

--
-- Constraints for table `student_teacher`
--
ALTER TABLE `student_teacher`
  ADD CONSTRAINT `student_teacher_ibfk_1` FOREIGN KEY (`studentId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `student_teacher_ibfk_2` FOREIGN KEY (`teacherId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `student_teacher_ibfk_3` FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `student_teacher_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`id`);

--
-- Constraints for table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `user_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`id`);

--
-- Constraints for table `user_role`
--
ALTER TABLE `user_role`
  ADD CONSTRAINT `user_role_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `user_role_ibfk_2` FOREIGN KEY (`roleId`) REFERENCES `role` (`id`),
  ADD CONSTRAINT `user_role_ibfk_3` FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `user_role_ibfk_4` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`id`);

--
-- Constraints for table `vehicle_type`
--
ALTER TABLE `vehicle_type`
  ADD CONSTRAINT `vehicle_type_ibfk_1` FOREIGN KEY (`createdBy`) REFERENCES `user` (`id`),
  ADD CONSTRAINT `vehicle_type_ibfk_2` FOREIGN KEY (`updatedBy`) REFERENCES `user` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
