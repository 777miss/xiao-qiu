/*
 Navicat Premium Data Transfer

 Source Server         : database
 Source Server Type    : MySQL
 Source Server Version : 80026
 Source Host           : localhost:3306
 Source Schema         : xiaoqiu_alpha

 Target Server Type    : MySQL
 Target Server Version : 80026
 File Encoding         : 65001

 Date: 24/10/2022 00:00:00
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for groups_config
-- ----------------------------
DROP TABLE IF EXISTS `groups_config`;
CREATE TABLE `groups_config`  (
  `group_id` int(0) NOT NULL,
  `config` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`group_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_0900_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for suggestions
-- ----------------------------
DROP TABLE IF EXISTS `suggestions`;
CREATE TABLE `suggestions`  (
  `user_id` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  `suggestion` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for switch_commands
-- ----------------------------
DROP TABLE IF EXISTS `switch_commands`;
CREATE TABLE `switch_commands`  (
  `group_id` int(0) NOT NULL DEFAULT 0,
  `commands` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  PRIMARY KEY (`group_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_packsack
-- ----------------------------
DROP TABLE IF EXISTS `user_packsack`;
CREATE TABLE `user_packsack`  (
  `group_id` int(0) NOT NULL,
  `whole_user_id` text CHARACTER SET utf8 COLLATE utf8_general_ci NULL,
  PRIMARY KEY (`group_id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
