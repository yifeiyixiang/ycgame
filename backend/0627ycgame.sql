/*
 Navicat Premium Dump SQL

 Source Server         : 0627-养成游戏
 Source Server Type    : MySQL
 Source Server Version : 80024 (8.0.24)
 Source Host           : 175.27.169.247:3306
 Source Schema         : 0627ycgame

 Target Server Type    : MySQL
 Target Server Version : 80024 (8.0.24)
 File Encoding         : 65001

 Date: 20/01/2026 15:41:12
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for auth_group
-- ----------------------------
DROP TABLE IF EXISTS `auth_group`;
CREATE TABLE `auth_group`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_group
-- ----------------------------

-- ----------------------------
-- Table structure for auth_group_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_group_permissions`;
CREATE TABLE `auth_group_permissions`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_group_permissions_group_id_permission_id_0cd325b0_uniq`(`group_id` ASC, `permission_id` ASC) USING BTREE,
  INDEX `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm`(`permission_id` ASC) USING BTREE,
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_group_permissions
-- ----------------------------

-- ----------------------------
-- Table structure for auth_permission
-- ----------------------------
DROP TABLE IF EXISTS `auth_permission`;
CREATE TABLE `auth_permission`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_permission_content_type_id_codename_01ab375a_uniq`(`content_type_id` ASC, `codename` ASC) USING BTREE,
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 113 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_permission
-- ----------------------------
INSERT INTO `auth_permission` VALUES (1, 'Can add log entry', 1, 'add_logentry');
INSERT INTO `auth_permission` VALUES (2, 'Can change log entry', 1, 'change_logentry');
INSERT INTO `auth_permission` VALUES (3, 'Can delete log entry', 1, 'delete_logentry');
INSERT INTO `auth_permission` VALUES (4, 'Can view log entry', 1, 'view_logentry');
INSERT INTO `auth_permission` VALUES (5, 'Can add permission', 2, 'add_permission');
INSERT INTO `auth_permission` VALUES (6, 'Can change permission', 2, 'change_permission');
INSERT INTO `auth_permission` VALUES (7, 'Can delete permission', 2, 'delete_permission');
INSERT INTO `auth_permission` VALUES (8, 'Can view permission', 2, 'view_permission');
INSERT INTO `auth_permission` VALUES (9, 'Can add group', 3, 'add_group');
INSERT INTO `auth_permission` VALUES (10, 'Can change group', 3, 'change_group');
INSERT INTO `auth_permission` VALUES (11, 'Can delete group', 3, 'delete_group');
INSERT INTO `auth_permission` VALUES (12, 'Can view group', 3, 'view_group');
INSERT INTO `auth_permission` VALUES (13, 'Can add user', 4, 'add_user');
INSERT INTO `auth_permission` VALUES (14, 'Can change user', 4, 'change_user');
INSERT INTO `auth_permission` VALUES (15, 'Can delete user', 4, 'delete_user');
INSERT INTO `auth_permission` VALUES (16, 'Can view user', 4, 'view_user');
INSERT INTO `auth_permission` VALUES (17, 'Can add content type', 5, 'add_contenttype');
INSERT INTO `auth_permission` VALUES (18, 'Can change content type', 5, 'change_contenttype');
INSERT INTO `auth_permission` VALUES (19, 'Can delete content type', 5, 'delete_contenttype');
INSERT INTO `auth_permission` VALUES (20, 'Can view content type', 5, 'view_contenttype');
INSERT INTO `auth_permission` VALUES (21, 'Can add session', 6, 'add_session');
INSERT INTO `auth_permission` VALUES (22, 'Can change session', 6, 'change_session');
INSERT INTO `auth_permission` VALUES (23, 'Can delete session', 6, 'delete_session');
INSERT INTO `auth_permission` VALUES (24, 'Can view session', 6, 'view_session');
INSERT INTO `auth_permission` VALUES (25, 'Can add home upgrade', 7, 'add_homeupgrade');
INSERT INTO `auth_permission` VALUES (26, 'Can change home upgrade', 7, 'change_homeupgrade');
INSERT INTO `auth_permission` VALUES (27, 'Can delete home upgrade', 7, 'delete_homeupgrade');
INSERT INTO `auth_permission` VALUES (28, 'Can view home upgrade', 7, 'view_homeupgrade');
INSERT INTO `auth_permission` VALUES (29, 'Can add macro parameter', 8, 'add_macroparameter');
INSERT INTO `auth_permission` VALUES (30, 'Can change macro parameter', 8, 'change_macroparameter');
INSERT INTO `auth_permission` VALUES (31, 'Can delete macro parameter', 8, 'delete_macroparameter');
INSERT INTO `auth_permission` VALUES (32, 'Can view macro parameter', 8, 'view_macroparameter');
INSERT INTO `auth_permission` VALUES (33, 'Can add nest upgrade', 9, 'add_nestupgrade');
INSERT INTO `auth_permission` VALUES (34, 'Can change nest upgrade', 9, 'change_nestupgrade');
INSERT INTO `auth_permission` VALUES (35, 'Can delete nest upgrade', 9, 'delete_nestupgrade');
INSERT INTO `auth_permission` VALUES (36, 'Can view nest upgrade', 9, 'view_nestupgrade');
INSERT INTO `auth_permission` VALUES (37, 'Can add prop', 10, 'add_prop');
INSERT INTO `auth_permission` VALUES (38, 'Can change prop', 10, 'change_prop');
INSERT INTO `auth_permission` VALUES (39, 'Can delete prop', 10, 'delete_prop');
INSERT INTO `auth_permission` VALUES (40, 'Can view prop', 10, 'view_prop');
INSERT INTO `auth_permission` VALUES (41, 'Can add scene', 11, 'add_scene');
INSERT INTO `auth_permission` VALUES (42, 'Can change scene', 11, 'change_scene');
INSERT INTO `auth_permission` VALUES (43, 'Can delete scene', 11, 'delete_scene');
INSERT INTO `auth_permission` VALUES (44, 'Can view scene', 11, 'view_scene');
INSERT INTO `auth_permission` VALUES (45, 'Can add sign in config', 12, 'add_signinconfig');
INSERT INTO `auth_permission` VALUES (46, 'Can change sign in config', 12, 'change_signinconfig');
INSERT INTO `auth_permission` VALUES (47, 'Can delete sign in config', 12, 'delete_signinconfig');
INSERT INTO `auth_permission` VALUES (48, 'Can view sign in config', 12, 'view_signinconfig');
INSERT INTO `auth_permission` VALUES (49, 'Can add task', 13, 'add_task');
INSERT INTO `auth_permission` VALUES (50, 'Can change task', 13, 'change_task');
INSERT INTO `auth_permission` VALUES (51, 'Can delete task', 13, 'delete_task');
INSERT INTO `auth_permission` VALUES (52, 'Can view task', 13, 'view_task');
INSERT INTO `auth_permission` VALUES (53, 'Can add user', 14, 'add_user');
INSERT INTO `auth_permission` VALUES (54, 'Can change user', 14, 'change_user');
INSERT INTO `auth_permission` VALUES (55, 'Can delete user', 14, 'delete_user');
INSERT INTO `auth_permission` VALUES (56, 'Can view user', 14, 'view_user');
INSERT INTO `auth_permission` VALUES (57, 'Can add user pet', 15, 'add_userpet');
INSERT INTO `auth_permission` VALUES (58, 'Can change user pet', 15, 'change_userpet');
INSERT INTO `auth_permission` VALUES (59, 'Can delete user pet', 15, 'delete_userpet');
INSERT INTO `auth_permission` VALUES (60, 'Can view user pet', 15, 'view_userpet');
INSERT INTO `auth_permission` VALUES (61, 'Can add wheel config', 16, 'add_wheelconfig');
INSERT INTO `auth_permission` VALUES (62, 'Can change wheel config', 16, 'change_wheelconfig');
INSERT INTO `auth_permission` VALUES (63, 'Can delete wheel config', 16, 'delete_wheelconfig');
INSERT INTO `auth_permission` VALUES (64, 'Can view wheel config', 16, 'view_wheelconfig');
INSERT INTO `auth_permission` VALUES (65, 'Can add user task', 17, 'add_usertask');
INSERT INTO `auth_permission` VALUES (66, 'Can change user task', 17, 'change_usertask');
INSERT INTO `auth_permission` VALUES (67, 'Can delete user task', 17, 'delete_usertask');
INSERT INTO `auth_permission` VALUES (68, 'Can view user task', 17, 'view_usertask');
INSERT INTO `auth_permission` VALUES (69, 'Can add user scene', 18, 'add_userscene');
INSERT INTO `auth_permission` VALUES (70, 'Can change user scene', 18, 'change_userscene');
INSERT INTO `auth_permission` VALUES (71, 'Can delete user scene', 18, 'delete_userscene');
INSERT INTO `auth_permission` VALUES (72, 'Can view user scene', 18, 'view_userscene');
INSERT INTO `auth_permission` VALUES (73, 'Can add user prop', 19, 'add_userprop');
INSERT INTO `auth_permission` VALUES (74, 'Can change user prop', 19, 'change_userprop');
INSERT INTO `auth_permission` VALUES (75, 'Can delete user prop', 19, 'delete_userprop');
INSERT INTO `auth_permission` VALUES (76, 'Can view user prop', 19, 'view_userprop');
INSERT INTO `auth_permission` VALUES (77, 'Can add user nest', 20, 'add_usernest');
INSERT INTO `auth_permission` VALUES (78, 'Can change user nest', 20, 'change_usernest');
INSERT INTO `auth_permission` VALUES (79, 'Can delete user nest', 20, 'delete_usernest');
INSERT INTO `auth_permission` VALUES (80, 'Can view user nest', 20, 'view_usernest');
INSERT INTO `auth_permission` VALUES (81, 'Can add user home decoration', 21, 'add_userhomedecoration');
INSERT INTO `auth_permission` VALUES (82, 'Can change user home decoration', 21, 'change_userhomedecoration');
INSERT INTO `auth_permission` VALUES (83, 'Can delete user home decoration', 21, 'delete_userhomedecoration');
INSERT INTO `auth_permission` VALUES (84, 'Can view user home decoration', 21, 'view_userhomedecoration');
INSERT INTO `auth_permission` VALUES (85, 'Can add user pet clothing', 22, 'add_userpetclothing');
INSERT INTO `auth_permission` VALUES (86, 'Can change user pet clothing', 22, 'change_userpetclothing');
INSERT INTO `auth_permission` VALUES (87, 'Can delete user pet clothing', 22, 'delete_userpetclothing');
INSERT INTO `auth_permission` VALUES (88, 'Can view user pet clothing', 22, 'view_userpetclothing');
INSERT INTO `auth_permission` VALUES (89, 'Can add ad prop count', 23, 'add_adpropcount');
INSERT INTO `auth_permission` VALUES (90, 'Can change ad prop count', 23, 'change_adpropcount');
INSERT INTO `auth_permission` VALUES (91, 'Can delete ad prop count', 23, 'delete_adpropcount');
INSERT INTO `auth_permission` VALUES (92, 'Can view ad prop count', 23, 'view_adpropcount');
INSERT INTO `auth_permission` VALUES (93, 'Can add friend apply', 24, 'add_friendapply');
INSERT INTO `auth_permission` VALUES (94, 'Can change friend apply', 24, 'change_friendapply');
INSERT INTO `auth_permission` VALUES (95, 'Can delete friend apply', 24, 'delete_friendapply');
INSERT INTO `auth_permission` VALUES (96, 'Can view friend apply', 24, 'view_friendapply');
INSERT INTO `auth_permission` VALUES (97, 'Can add friend', 25, 'add_friend');
INSERT INTO `auth_permission` VALUES (98, 'Can change friend', 25, 'change_friend');
INSERT INTO `auth_permission` VALUES (99, 'Can delete friend', 25, 'delete_friend');
INSERT INTO `auth_permission` VALUES (100, 'Can view friend', 25, 'view_friend');
INSERT INTO `auth_permission` VALUES (101, 'Can add activity circle', 26, 'add_activitycircle');
INSERT INTO `auth_permission` VALUES (102, 'Can change activity circle', 26, 'change_activitycircle');
INSERT INTO `auth_permission` VALUES (103, 'Can delete activity circle', 26, 'delete_activitycircle');
INSERT INTO `auth_permission` VALUES (104, 'Can view activity circle', 26, 'view_activitycircle');
INSERT INTO `auth_permission` VALUES (105, 'Can add activity progress award', 27, 'add_activityprogressaward');
INSERT INTO `auth_permission` VALUES (106, 'Can change activity progress award', 27, 'change_activityprogressaward');
INSERT INTO `auth_permission` VALUES (107, 'Can delete activity progress award', 27, 'delete_activityprogressaward');
INSERT INTO `auth_permission` VALUES (108, 'Can view activity progress award', 27, 'view_activityprogressaward');
INSERT INTO `auth_permission` VALUES (109, 'Can add circle', 28, 'add_circle');
INSERT INTO `auth_permission` VALUES (110, 'Can change circle', 28, 'change_circle');
INSERT INTO `auth_permission` VALUES (111, 'Can delete circle', 28, 'delete_circle');
INSERT INTO `auth_permission` VALUES (112, 'Can view circle', 28, 'view_circle');

-- ----------------------------
-- Table structure for auth_user
-- ----------------------------
DROP TABLE IF EXISTS `auth_user`;
CREATE TABLE `auth_user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `password` varchar(128) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_login` datetime(6) NULL DEFAULT NULL,
  `is_superuser` tinyint(1) NOT NULL,
  `username` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `first_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `last_name` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(254) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `is_staff` tinyint(1) NOT NULL,
  `is_active` tinyint(1) NOT NULL,
  `date_joined` datetime(6) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_user
-- ----------------------------

-- ----------------------------
-- Table structure for auth_user_groups
-- ----------------------------
DROP TABLE IF EXISTS `auth_user_groups`;
CREATE TABLE `auth_user_groups`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `group_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_user_groups_user_id_group_id_94350c0c_uniq`(`user_id` ASC, `group_id` ASC) USING BTREE,
  INDEX `auth_user_groups_group_id_97559544_fk_auth_group_id`(`group_id` ASC) USING BTREE,
  CONSTRAINT `auth_user_groups_group_id_97559544_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_user_groups_user_id_6a12ed8b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_user_groups
-- ----------------------------

-- ----------------------------
-- Table structure for auth_user_user_permissions
-- ----------------------------
DROP TABLE IF EXISTS `auth_user_user_permissions`;
CREATE TABLE `auth_user_user_permissions`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `auth_user_user_permissions_user_id_permission_id_14a6b632_uniq`(`user_id` ASC, `permission_id` ASC) USING BTREE,
  INDEX `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm`(`permission_id` ASC) USING BTREE,
  CONSTRAINT `auth_user_user_permi_permission_id_1fbb5f2c_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `auth_user_user_permissions_user_id_a95ead1b_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of auth_user_user_permissions
-- ----------------------------

-- ----------------------------
-- Table structure for django_admin_log
-- ----------------------------
DROP TABLE IF EXISTS `django_admin_log`;
CREATE TABLE `django_admin_log`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `action_time` datetime(6) NOT NULL,
  `object_id` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `object_repr` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `action_flag` smallint UNSIGNED NOT NULL,
  `change_message` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `content_type_id` int NULL DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `django_admin_log_content_type_id_c4bce8eb_fk_django_co`(`content_type_id` ASC) USING BTREE,
  INDEX `django_admin_log_user_id_c564eba6_fk_auth_user_id`(`user_id` ASC) USING BTREE,
  CONSTRAINT `django_admin_log_content_type_id_c4bce8eb_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `django_admin_log_user_id_c564eba6_fk_auth_user_id` FOREIGN KEY (`user_id`) REFERENCES `auth_user` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_admin_log
-- ----------------------------

-- ----------------------------
-- Table structure for django_content_type
-- ----------------------------
DROP TABLE IF EXISTS `django_content_type`;
CREATE TABLE `django_content_type`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `model` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `django_content_type_app_label_model_76bd3d3b_uniq`(`app_label` ASC, `model` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 29 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_content_type
-- ----------------------------
INSERT INTO `django_content_type` VALUES (1, 'admin', 'logentry');
INSERT INTO `django_content_type` VALUES (3, 'auth', 'group');
INSERT INTO `django_content_type` VALUES (2, 'auth', 'permission');
INSERT INTO `django_content_type` VALUES (4, 'auth', 'user');
INSERT INTO `django_content_type` VALUES (5, 'contenttypes', 'contenttype');
INSERT INTO `django_content_type` VALUES (26, 'MainApp', 'activitycircle');
INSERT INTO `django_content_type` VALUES (27, 'MainApp', 'activityprogressaward');
INSERT INTO `django_content_type` VALUES (23, 'MainApp', 'adpropcount');
INSERT INTO `django_content_type` VALUES (28, 'MainApp', 'circle');
INSERT INTO `django_content_type` VALUES (25, 'MainApp', 'friend');
INSERT INTO `django_content_type` VALUES (24, 'MainApp', 'friendapply');
INSERT INTO `django_content_type` VALUES (7, 'MainApp', 'homeupgrade');
INSERT INTO `django_content_type` VALUES (8, 'MainApp', 'macroparameter');
INSERT INTO `django_content_type` VALUES (9, 'MainApp', 'nestupgrade');
INSERT INTO `django_content_type` VALUES (10, 'MainApp', 'prop');
INSERT INTO `django_content_type` VALUES (11, 'MainApp', 'scene');
INSERT INTO `django_content_type` VALUES (12, 'MainApp', 'signinconfig');
INSERT INTO `django_content_type` VALUES (13, 'MainApp', 'task');
INSERT INTO `django_content_type` VALUES (14, 'MainApp', 'user');
INSERT INTO `django_content_type` VALUES (21, 'MainApp', 'userhomedecoration');
INSERT INTO `django_content_type` VALUES (20, 'MainApp', 'usernest');
INSERT INTO `django_content_type` VALUES (15, 'MainApp', 'userpet');
INSERT INTO `django_content_type` VALUES (22, 'MainApp', 'userpetclothing');
INSERT INTO `django_content_type` VALUES (19, 'MainApp', 'userprop');
INSERT INTO `django_content_type` VALUES (18, 'MainApp', 'userscene');
INSERT INTO `django_content_type` VALUES (17, 'MainApp', 'usertask');
INSERT INTO `django_content_type` VALUES (16, 'MainApp', 'wheelconfig');
INSERT INTO `django_content_type` VALUES (6, 'sessions', 'session');

-- ----------------------------
-- Table structure for django_migrations
-- ----------------------------
DROP TABLE IF EXISTS `django_migrations`;
CREATE TABLE `django_migrations`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 44 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_migrations
-- ----------------------------
INSERT INTO `django_migrations` VALUES (1, 'MainApp', '0001_initial', '2025-11-05 17:05:33.492207');
INSERT INTO `django_migrations` VALUES (2, 'contenttypes', '0001_initial', '2025-11-05 17:05:33.575848');
INSERT INTO `django_migrations` VALUES (3, 'auth', '0001_initial', '2025-11-05 17:05:34.551856');
INSERT INTO `django_migrations` VALUES (4, 'admin', '0001_initial', '2025-11-05 17:05:34.819222');
INSERT INTO `django_migrations` VALUES (5, 'admin', '0002_logentry_remove_auto_add', '2025-11-05 17:05:34.840578');
INSERT INTO `django_migrations` VALUES (6, 'admin', '0003_logentry_add_action_flag_choices', '2025-11-05 17:05:34.885275');
INSERT INTO `django_migrations` VALUES (7, 'contenttypes', '0002_remove_content_type_name', '2025-11-05 17:05:35.154577');
INSERT INTO `django_migrations` VALUES (8, 'auth', '0002_alter_permission_name_max_length', '2025-11-05 17:05:35.276414');
INSERT INTO `django_migrations` VALUES (9, 'auth', '0003_alter_user_email_max_length', '2025-11-05 17:05:35.337919');
INSERT INTO `django_migrations` VALUES (10, 'auth', '0004_alter_user_username_opts', '2025-11-05 17:05:35.361854');
INSERT INTO `django_migrations` VALUES (11, 'auth', '0005_alter_user_last_login_null', '2025-11-05 17:05:35.464598');
INSERT INTO `django_migrations` VALUES (12, 'auth', '0006_require_contenttypes_0002', '2025-11-05 17:05:35.470540');
INSERT INTO `django_migrations` VALUES (13, 'auth', '0007_alter_validators_add_error_messages', '2025-11-05 17:05:35.491921');
INSERT INTO `django_migrations` VALUES (14, 'auth', '0008_alter_user_username_max_length', '2025-11-05 17:05:35.612055');
INSERT INTO `django_migrations` VALUES (15, 'auth', '0009_alter_user_last_name_max_length', '2025-11-05 17:05:35.731675');
INSERT INTO `django_migrations` VALUES (16, 'auth', '0010_alter_group_name_max_length', '2025-11-05 17:05:35.776426');
INSERT INTO `django_migrations` VALUES (17, 'auth', '0011_update_proxy_permissions', '2025-11-05 17:05:35.817041');
INSERT INTO `django_migrations` VALUES (18, 'auth', '0012_alter_user_first_name_max_length', '2025-11-05 17:05:35.939788');
INSERT INTO `django_migrations` VALUES (19, 'sessions', '0001_initial', '2025-11-05 17:05:36.023869');
INSERT INTO `django_migrations` VALUES (20, 'MainApp', '0002_alter_prop_score_alter_prop_sell_type_and_more', '2025-11-05 17:17:46.195103');
INSERT INTO `django_migrations` VALUES (21, 'MainApp', '0003_user_music_user_sound_userpet_fs_prop_id', '2025-11-05 19:29:25.339280');
INSERT INTO `django_migrations` VALUES (22, 'MainApp', '0004_alter_macroparameter_param_value_and_more', '2025-11-06 10:04:10.043995');
INSERT INTO `django_migrations` VALUES (23, 'MainApp', '0005_remove_wheelconfig_reward_wheelconfig_num_and_more', '2025-11-06 10:05:53.903406');
INSERT INTO `django_migrations` VALUES (24, 'MainApp', '0006_delete_userprop_user_coin_user_power', '2025-11-06 11:01:49.374837');
INSERT INTO `django_migrations` VALUES (25, 'MainApp', '0007_remove_user_coin_remove_user_power_userprop', '2025-11-06 11:12:34.601948');
INSERT INTO `django_migrations` VALUES (26, 'MainApp', '0008_userhomedecoration_userpetclothing_userpet_is_active', '2025-11-06 11:27:50.461487');
INSERT INTO `django_migrations` VALUES (27, 'MainApp', '0009_userpetclothing_score', '2025-11-06 11:53:08.601373');
INSERT INTO `django_migrations` VALUES (28, 'MainApp', '0010_userpetclothing_pet_id', '2025-11-06 15:38:39.938447');
INSERT INTO `django_migrations` VALUES (29, 'MainApp', '0011_remove_userpetclothing_pet_id', '2025-11-06 15:39:06.079994');
INSERT INTO `django_migrations` VALUES (30, 'MainApp', '0012_userpet_name', '2025-11-06 15:58:03.919496');
INSERT INTO `django_migrations` VALUES (31, 'MainApp', '0013_usertask_task_id', '2025-11-06 16:11:16.338011');
INSERT INTO `django_migrations` VALUES (32, 'MainApp', '0014_user_coin_ad_count_user_power_ad_count_and_more', '2025-11-06 19:20:03.117930');
INSERT INTO `django_migrations` VALUES (33, 'MainApp', '0015_adpropcount', '2025-11-07 10:35:55.414026');
INSERT INTO `django_migrations` VALUES (34, 'MainApp', '0016_prop_sell_need_level', '2025-11-07 10:43:57.748483');
INSERT INTO `django_migrations` VALUES (35, 'MainApp', '0017_remove_adpropcount_prop_type_adpropcount_store_type', '2025-11-08 09:48:53.158920');
INSERT INTO `django_migrations` VALUES (36, 'MainApp', '0018_alter_user_home_level_friendapply_friend', '2025-11-22 10:43:00.541377');
INSERT INTO `django_migrations` VALUES (37, 'MainApp', '0019_alter_userpet_fs_prop_id', '2025-12-17 10:48:10.765750');
INSERT INTO `django_migrations` VALUES (38, 'MainApp', '0020_alter_userpet_fs_prop_id', '2025-12-17 16:14:09.010716');
INSERT INTO `django_migrations` VALUES (39, 'MainApp', '0021_activitycircle_activityprogressaward', '2025-12-19 17:23:25.336172');
INSERT INTO `django_migrations` VALUES (40, 'MainApp', '0022_alter_activitycircle_table_comment_and_more', '2025-12-19 17:36:42.534666');
INSERT INTO `django_migrations` VALUES (41, 'MainApp', '0023_circle_alter_activitycircle_table_comment_and_more', '2025-12-19 17:36:42.782244');
INSERT INTO `django_migrations` VALUES (42, 'MainApp', '0024_user_activity_count_user_activity_progress', '2025-12-22 13:49:57.235198');
INSERT INTO `django_migrations` VALUES (43, 'MainApp', '0025_alter_user_activity_progress', '2025-12-23 15:09:46.283844');

-- ----------------------------
-- Table structure for django_session
-- ----------------------------
DROP TABLE IF EXISTS `django_session`;
CREATE TABLE `django_session`  (
  `session_key` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `session_data` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `expire_date` datetime(6) NOT NULL,
  PRIMARY KEY (`session_key`) USING BTREE,
  INDEX `django_session_expire_date_a5c62663`(`expire_date` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of django_session
-- ----------------------------

-- ----------------------------
-- Table structure for fa_admin
-- ----------------------------
DROP TABLE IF EXISTS `fa_admin`;
CREATE TABLE `fa_admin`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `username` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '用户名',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '昵称',
  `password` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '密码',
  `salt` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '密码盐',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '头像',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '电子邮箱',
  `mobile` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '手机号码',
  `loginfailure` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '失败次数',
  `logintime` bigint NULL DEFAULT NULL COMMENT '登录时间',
  `loginip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '登录IP',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `updatetime` bigint NULL DEFAULT NULL COMMENT '更新时间',
  `token` varchar(59) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT 'Session标识',
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'normal' COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '管理员表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_admin
-- ----------------------------
INSERT INTO `fa_admin` VALUES (1, 'admin', 'Admin', '434d315d397e2790ad81342c31d39088', 'a30525', '/assets/img/avatar.png', 'admin@admin.com', '', 0, 1768557964, '115.60.90.150', 1491635035, 1768557964, 'f5bb3137-1dd2-4126-8112-482af26291cd', 'normal');
INSERT INTO `fa_admin` VALUES (2, 'shanyan', 'Sshanyan', 'b96126834273230308931ef38760ce09', 'uxFZ3y', '/assets/img/avatar.png', '123@123.com', '13212341234', 0, NULL, NULL, 1767850408, 1767850408, '', 'normal');
INSERT INTO `fa_admin` VALUES (3, 'lujianyu', 'lujianyu', '6619c033836fb92125df19751c1a6310', 'gfWmsb', '/assets/img/avatar.png', 'lujianyu@126.com', '13212341235', 0, NULL, NULL, 1767850687, 1767852099, '', 'normal');
INSERT INTO `fa_admin` VALUES (4, 'chenzehao', 'chenzehao', '5be47b3a89f3bac8b72e7e1bd123a4c0', 'TOgt4V', '/assets/img/avatar.png', '1234@qq.com', '13212341236', 0, NULL, NULL, 1767850762, 1767850762, '', 'normal');

-- ----------------------------
-- Table structure for fa_admin_log
-- ----------------------------
DROP TABLE IF EXISTS `fa_admin_log`;
CREATE TABLE `fa_admin_log`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `admin_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '管理员ID',
  `username` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '管理员名字',
  `url` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '操作页面',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '日志标题',
  `content` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '内容',
  `ip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT 'IP',
  `useragent` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT 'User-Agent',
  `createtime` bigint NULL DEFAULT NULL COMMENT '操作时间',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `name`(`username` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 94 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '管理员日志表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_admin_log
-- ----------------------------
INSERT INTO `fa_admin_log` VALUES (1, 1, 'admin', '/vZMXPImedo.php/index/login', '登录', '{\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"v62w\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767838628);
INSERT INTO `fa_admin_log` VALUES (2, 1, 'admin', '/vZMXPImedo.php/addon/install', '插件管理', '{\"name\":\"command\",\"force\":\"0\",\"uid\":\"52535\",\"token\":\"***\",\"version\":\"1.1.3\",\"faversion\":\"1.6.1.20250430\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767838667);
INSERT INTO `fa_admin_log` VALUES (3, 1, 'admin', '/vZMXPImedo.php/addon/state', '插件管理 / 禁用启用', '{\"name\":\"command\",\"action\":\"enable\",\"force\":\"0\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767838668);
INSERT INTO `fa_admin_log` VALUES (4, 1, 'admin', '/vZMXPImedo.php/auth/rule/multi', '权限管理 / 菜单规则', '{\"action\":\"\",\"ids\":\"1\",\"params\":\"ismenu=0\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767838680);
INSERT INTO `fa_admin_log` VALUES (5, 1, 'admin', '/vZMXPImedo.php/auth/rule/multi', '权限管理 / 菜单规则', '{\"action\":\"\",\"ids\":\"2\",\"params\":\"ismenu=0\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767838682);
INSERT INTO `fa_admin_log` VALUES (6, 1, 'admin', '/vZMXPImedo.php/auth/rule/multi', '权限管理 / 菜单规则', '{\"action\":\"\",\"ids\":\"66\",\"params\":\"ismenu=0\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767838684);
INSERT INTO `fa_admin_log` VALUES (7, 1, 'admin', '/vZMXPImedo.php/auth/rule/multi', '权限管理 / 菜单规则', '{\"action\":\"\",\"ids\":\"4\",\"params\":\"ismenu=0\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767838686);
INSERT INTO `fa_admin_log` VALUES (8, 1, 'admin', '/vZMXPImedo.php/command/get_field_list', '在线命令管理', '{\"table\":\"auth_group\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841466);
INSERT INTO `fa_admin_log` VALUES (9, 1, 'admin', '/vZMXPImedo.php/command/get_field_list', '在线命令管理', '{\"table\":\"game_user\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841471);
INSERT INTO `fa_admin_log` VALUES (10, 1, 'admin', '/vZMXPImedo.php/command/command/action/command', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"0\",\"table\":\"game_user\",\"controller\":\"ss\\/user\",\"model\":\"ss\\/user\",\"fields\":[\"id\",\"nickname\",\"sign_in_days\",\"sign_time\",\"sign_status\",\"home_level\",\"created_time\",\"coin_ad_count\",\"power_ad_count\",\"activity_count\",\"activity_progress\",\"status\"],\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\",\"action\":\"command\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841498);
INSERT INTO `fa_admin_log` VALUES (11, 1, 'admin', '/vZMXPImedo.php/command/command/action/execute', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"0\",\"table\":\"game_user\",\"controller\":\"ss\\/user\",\"model\":\"ss\\/user\",\"fields\":[\"id\",\"nickname\",\"sign_in_days\",\"sign_time\",\"sign_status\",\"home_level\",\"created_time\",\"coin_ad_count\",\"power_ad_count\",\"activity_count\",\"activity_progress\",\"status\"],\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\",\"action\":\"execute\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841500);
INSERT INTO `fa_admin_log` VALUES (12, 1, 'admin', '/vZMXPImedo.php/command/get_field_list', '在线命令管理', '{\"table\":\"auth_group\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841505);
INSERT INTO `fa_admin_log` VALUES (13, 1, 'admin', '/vZMXPImedo.php/command/get_controller_list', '在线命令管理', '{\"q_word\":[\"\"],\"pageNumber\":\"1\",\"pageSize\":\"10\",\"andOr\":\"OR \",\"orderBy\":[[\"name\",\"ASC\"]],\"searchTable\":\"tbl\",\"showField\":\"name\",\"keyField\":\"id\",\"searchField\":[\"name\"],\"name\":\"\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841507);
INSERT INTO `fa_admin_log` VALUES (14, 1, 'admin', '/vZMXPImedo.php/command/get_controller_list', '在线命令管理', '{\"q_word\":[\"ss\"],\"pageNumber\":\"1\",\"pageSize\":\"10\",\"andOr\":\"OR \",\"orderBy\":[[\"name\",\"ASC\"]],\"searchTable\":\"tbl\",\"showField\":\"name\",\"keyField\":\"id\",\"searchField\":[\"name\"],\"name\":\"ss\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841509);
INSERT INTO `fa_admin_log` VALUES (15, 1, 'admin', '/vZMXPImedo.php/command/get_controller_list', '在线命令管理', '{\"q_word\":[\"\"],\"pageNumber\":\"1\",\"pageSize\":\"10\",\"andOr\":\"OR \",\"orderBy\":[[\"name\",\"ASC\"]],\"searchTable\":\"tbl\",\"showField\":\"name\",\"keyField\":\"id\",\"searchField\":[\"name\"],\"name\":\"\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841511);
INSERT INTO `fa_admin_log` VALUES (16, 1, 'admin', '/vZMXPImedo.php/command/command/action/command', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"0\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/User.php\",\"action\":\"command\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841513);
INSERT INTO `fa_admin_log` VALUES (17, 1, 'admin', '/vZMXPImedo.php/command/command/action/execute', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"0\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/User.php\",\"action\":\"execute\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841515);
INSERT INTO `fa_admin_log` VALUES (18, 1, 'admin', '/vZMXPImedo.php/auth/rule/edit/ids/93?dialog=1', '权限管理 / 菜单规则 / 编辑', '{\"dialog\":\"1\",\"__token__\":\"***\",\"row\":{\"ismenu\":\"1\",\"pid\":\"0\",\"name\":\"ss\",\"title\":\"游戏数据\",\"url\":\"\",\"icon\":\"fa fa-list\",\"condition\":\"\",\"menutype\":\"addtabs\",\"extend\":\"\",\"remark\":\"\",\"weigh\":\"0\",\"status\":\"normal\"},\"ids\":\"93\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841535);
INSERT INTO `fa_admin_log` VALUES (19, 1, 'admin', '/vZMXPImedo.php/command/execute/ids/2', '在线命令管理 / 再次执行命令', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"0\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/User.php\",\"ids\":\"2\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841742);
INSERT INTO `fa_admin_log` VALUES (20, 1, 'admin', '/vZMXPImedo.php/command/get_field_list', '在线命令管理', '{\"table\":\"auth_group\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841762);
INSERT INTO `fa_admin_log` VALUES (21, 1, 'admin', '/vZMXPImedo.php/command/get_field_list', '在线命令管理', '{\"table\":\"game_user\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841768);
INSERT INTO `fa_admin_log` VALUES (22, 1, 'admin', '/vZMXPImedo.php/command/command/action/command', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user\",\"controller\":\"ss\\/user\",\"model\":\"ss\\/user\",\"fields\":[\"id\",\"nickname\",\"sign_in_days\",\"sign_time\",\"sign_status\",\"home_level\",\"created_time\",\"coin_ad_count\",\"power_ad_count\",\"activity_count\",\"activity_progress\",\"status\"],\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\",\"action\":\"command\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841783);
INSERT INTO `fa_admin_log` VALUES (23, 1, 'admin', '/vZMXPImedo.php/command/command/action/execute', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user\",\"controller\":\"ss\\/user\",\"model\":\"ss\\/user\",\"fields\":[\"id\",\"nickname\",\"sign_in_days\",\"sign_time\",\"sign_status\",\"home_level\",\"created_time\",\"coin_ad_count\",\"power_ad_count\",\"activity_count\",\"activity_progress\",\"status\"],\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\",\"action\":\"execute\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841785);
INSERT INTO `fa_admin_log` VALUES (24, 1, 'admin', '/vZMXPImedo.php/command/get_field_list', '在线命令管理', '{\"table\":\"auth_group\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841811);
INSERT INTO `fa_admin_log` VALUES (25, 1, 'admin', '/vZMXPImedo.php/command/get_controller_list', '在线命令管理', '{\"q_word\":[\"\"],\"pageNumber\":\"1\",\"pageSize\":\"10\",\"andOr\":\"OR \",\"orderBy\":[[\"name\",\"ASC\"]],\"searchTable\":\"tbl\",\"showField\":\"name\",\"keyField\":\"id\",\"searchField\":[\"name\"],\"name\":\"\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841813);
INSERT INTO `fa_admin_log` VALUES (26, 1, 'admin', '/vZMXPImedo.php/command/get_controller_list', '在线命令管理', '{\"q_word\":[\"ss\"],\"pageNumber\":\"1\",\"pageSize\":\"10\",\"andOr\":\"OR \",\"orderBy\":[[\"name\",\"ASC\"]],\"searchTable\":\"tbl\",\"showField\":\"name\",\"keyField\":\"id\",\"searchField\":[\"name\"],\"name\":\"ss\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841815);
INSERT INTO `fa_admin_log` VALUES (27, 1, 'admin', '/vZMXPImedo.php/command/get_controller_list', '在线命令管理', '{\"q_word\":[\"\"],\"pageNumber\":\"1\",\"pageSize\":\"10\",\"andOr\":\"OR \",\"orderBy\":[[\"name\",\"ASC\"]],\"searchTable\":\"tbl\",\"showField\":\"name\",\"keyField\":\"id\",\"searchField\":[\"name\"],\"name\":\"\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841816);
INSERT INTO `fa_admin_log` VALUES (28, 1, 'admin', '/vZMXPImedo.php/command/command/action/command', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"1\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/User.php\",\"action\":\"command\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841819);
INSERT INTO `fa_admin_log` VALUES (29, 1, 'admin', '/vZMXPImedo.php/command/command/action/execute', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"1\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/User.php\",\"action\":\"execute\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841822);
INSERT INTO `fa_admin_log` VALUES (30, 1, 'admin', '/vZMXPImedo.php/command/execute/ids/4', '在线命令管理 / 再次执行命令', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user\",\"controller\":\"ss\\/user\",\"model\":\"ss\\/user\",\"fields\":[\"id\",\"nickname\",\"sign_in_days\",\"sign_time\",\"sign_status\",\"home_level\",\"created_time\",\"coin_ad_count\",\"power_ad_count\",\"activity_count\",\"activity_progress\",\"status\"],\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\",\"ids\":\"4\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841925);
INSERT INTO `fa_admin_log` VALUES (31, 1, 'admin', '/vZMXPImedo.php/command/execute/ids/6', '在线命令管理 / 再次执行命令', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user\",\"controller\":\"ss\\/user\",\"model\":\"ss\\/user\",\"fields\":[\"id\",\"nickname\",\"sign_in_days\",\"sign_time\",\"sign_status\",\"home_level\",\"created_time\",\"coin_ad_count\",\"power_ad_count\",\"activity_count\",\"activity_progress\",\"status\"],\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\",\"ids\":\"6\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841930);
INSERT INTO `fa_admin_log` VALUES (32, 1, 'admin', '/vZMXPImedo.php/command/execute/ids/5', '在线命令管理 / 再次执行命令', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"1\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/User.php\",\"ids\":\"5\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841939);
INSERT INTO `fa_admin_log` VALUES (33, 1, 'admin', '/vZMXPImedo.php/ss/user/edit/ids/17?dialog=1', '游戏数据 / 用户管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"openid\":\"101101\",\"userid\":\"00000117\",\"token\":\"***\",\"nickname\":\"测试用户12134\",\"avatar\":\"https:\\/\\/thirdwx.qlogo.cn\\/mmopen\\/vi_32\\/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0\\/132\",\"sign_in_days\":\"0\",\"sign_time\":\"\",\"sign_status\":\"0\",\"home_level\":\"100\",\"created_time\":\"2026-01-08 10:35:58\",\"music\":\"0.5\",\"sound\":\"0.5\",\"coin_ad_count\":\"1\",\"power_ad_count\":\"0\",\"activity_count\":\"0\",\"activity_progress\":\"1\",\"status\":\"0\"},\"ids\":\"17\"}', '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767841964);
INSERT INTO `fa_admin_log` VALUES (34, 0, 'Unknown', '/vZMXPImedo.php/index/login', '', '{\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"rwen\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767842767);
INSERT INTO `fa_admin_log` VALUES (35, 0, 'Unknown', '/vZMXPImedo.php/index/login', '', '{\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"fwv4\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767842773);
INSERT INTO `fa_admin_log` VALUES (36, 1, 'admin', '/vZMXPImedo.php/index/login', '登录', '{\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"wtpc\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767842778);
INSERT INTO `fa_admin_log` VALUES (37, 1, 'admin', '/vZMXPImedo.php/command/get_field_list', '在线命令管理', '{\"table\":\"auth_group\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767843292);
INSERT INTO `fa_admin_log` VALUES (38, 1, 'admin', '/vZMXPImedo.php/command/get_field_list', '在线命令管理', '{\"table\":\"game_user_pet\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767843295);
INSERT INTO `fa_admin_log` VALUES (39, 1, 'admin', '/vZMXPImedo.php/command/command/action/command', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user_pet\",\"controller\":\"ss\\/userpet\",\"model\":\"ss\\/userpet\",\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\",\"action\":\"command\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767843321);
INSERT INTO `fa_admin_log` VALUES (40, 1, 'admin', '/vZMXPImedo.php/command/command/action/execute', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user_pet\",\"controller\":\"ss\\/userpet\",\"model\":\"ss\\/userpet\",\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\",\"action\":\"execute\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767843322);
INSERT INTO `fa_admin_log` VALUES (41, 1, 'admin', '/vZMXPImedo.php/command/get_field_list', '在线命令管理', '{\"table\":\"auth_group\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767843326);
INSERT INTO `fa_admin_log` VALUES (42, 1, 'admin', '/vZMXPImedo.php/command/get_controller_list', '在线命令管理', '{\"q_word\":[\"\"],\"pageNumber\":\"1\",\"pageSize\":\"10\",\"andOr\":\"OR \",\"orderBy\":[[\"name\",\"ASC\"]],\"searchTable\":\"tbl\",\"showField\":\"name\",\"keyField\":\"id\",\"searchField\":[\"name\"],\"name\":\"\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767843328);
INSERT INTO `fa_admin_log` VALUES (43, 1, 'admin', '/vZMXPImedo.php/command/get_controller_list', '在线命令管理', '{\"q_word\":[\"ss\"],\"pageNumber\":\"1\",\"pageSize\":\"10\",\"andOr\":\"OR \",\"orderBy\":[[\"name\",\"ASC\"]],\"searchTable\":\"tbl\",\"showField\":\"name\",\"keyField\":\"id\",\"searchField\":[\"name\"],\"name\":\"ss\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767843329);
INSERT INTO `fa_admin_log` VALUES (44, 1, 'admin', '/vZMXPImedo.php/command/get_controller_list', '在线命令管理', '{\"q_word\":[\"\"],\"pageNumber\":\"1\",\"pageSize\":\"10\",\"andOr\":\"OR \",\"orderBy\":[[\"name\",\"ASC\"]],\"searchTable\":\"tbl\",\"showField\":\"name\",\"keyField\":\"id\",\"searchField\":[\"name\"],\"name\":\"\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767843331);
INSERT INTO `fa_admin_log` VALUES (45, 1, 'admin', '/vZMXPImedo.php/command/command/action/command', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"1\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/Userpet.php\",\"action\":\"command\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767843332);
INSERT INTO `fa_admin_log` VALUES (46, 1, 'admin', '/vZMXPImedo.php/command/command/action/execute', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"1\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/Userpet.php\",\"action\":\"execute\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767843333);
INSERT INTO `fa_admin_log` VALUES (47, 1, 'admin', '/vZMXPImedo.php/auth/rule/multi', '权限管理 / 菜单规则', '{\"action\":\"\",\"ids\":\"85\",\"params\":\"ismenu=0\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767843463);
INSERT INTO `fa_admin_log` VALUES (48, 1, 'admin', '/vZMXPImedo.php/index/login', '登录', '{\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"pb2t\",\"keeplogin\":\"1\"}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.67(0x1800432b) NetType/4G Language/zh_CN', 1767850249);
INSERT INTO `fa_admin_log` VALUES (49, 1, 'admin', '/vZMXPImedo.php/auth/admin/add?dialog=1', '权限管理 / 管理员管理 / 添加', '{\"dialog\":\"1\",\"__token__\":\"***\",\"group\":[\"1\"],\"row\":{\"username\":\"shanyan\",\"email\":\"123@123.com\",\"mobile\":\"13212341234\",\"nickname\":\"Sshanyan\",\"password\":\"***\",\"status\":\"normal\"}}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.67(0x1800432b) NetType/4G Language/zh_CN', 1767850408);
INSERT INTO `fa_admin_log` VALUES (50, 0, 'Unknown', '/vZMXPImedo.php/index/login?url=/vZMXPImedo.php/auth/admin?ref=addtabs', '登录', '{\"url\":\"\\/vZMXPImedo.php\\/auth\\/admin?ref=addtabs\",\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"qxxg\",\"keeplogin\":\"1\"}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767850619);
INSERT INTO `fa_admin_log` VALUES (51, 1, 'admin', '/vZMXPImedo.php/index/login?url=/vZMXPImedo.php/auth/admin?ref=addtabs', '登录', '{\"url\":\"\\/vZMXPImedo.php\\/auth\\/admin?ref=addtabs\",\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"nygx\",\"keeplogin\":\"1\"}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767850644);
INSERT INTO `fa_admin_log` VALUES (52, 1, 'admin', '/vZMXPImedo.php/auth/admin/add?dialog=1', '权限管理 / 管理员管理 / 添加', '{\"dialog\":\"1\",\"__token__\":\"***\",\"group\":[\"1\"],\"row\":{\"username\":\"lujianyu\",\"email\":\"lujianyu@126.com\",\"mobile\":\"13212341234\",\"nickname\":\"lujianyu\",\"password\":\"***\",\"status\":\"normal\"}}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767850682);
INSERT INTO `fa_admin_log` VALUES (53, 1, 'admin', '/vZMXPImedo.php/auth/admin/add?dialog=1', '权限管理 / 管理员管理 / 添加', '{\"dialog\":\"1\",\"__token__\":\"***\",\"group\":[\"1\"],\"row\":{\"username\":\"lujianyu\",\"email\":\"lujianyu@126.com\",\"mobile\":\"13212341235\",\"nickname\":\"lujianyu\",\"password\":\"***\",\"status\":\"normal\"}}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767850687);
INSERT INTO `fa_admin_log` VALUES (54, 1, 'admin', '/vZMXPImedo.php/ss/user/edit/ids/21?dialog=1', '游戏数据 / 用户管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"openid\":\"1119\",\"userid\":\"00000121\",\"token\":\"***\",\"nickname\":\"测试用户40574\",\"avatar\":\"https:\\/\\/thirdwx.qlogo.cn\\/mmopen\\/vi_32\\/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0\\/132\",\"sign_in_days\":\"0\",\"sign_time\":\"\",\"sign_status\":\"0\",\"home_level\":\"2\",\"created_time\":\"2026-01-08 11:32:34\",\"music\":\"0.5\",\"sound\":\"0.5\",\"coin_ad_count\":\"1\",\"power_ad_count\":\"0\",\"activity_count\":\"0\",\"activity_progress\":\"1\",\"status\":\"0\"},\"ids\":\"21\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767850699);
INSERT INTO `fa_admin_log` VALUES (55, 1, 'admin', '/vZMXPImedo.php/auth/admin/add?dialog=1', '权限管理 / 管理员管理 / 添加', '{\"dialog\":\"1\",\"__token__\":\"***\",\"group\":[\"1\"],\"row\":{\"username\":\"chenzehao\",\"email\":\"1234@qq.com\",\"mobile\":\"13212341236\",\"nickname\":\"chenzehao\",\"password\":\"***\",\"status\":\"normal\"}}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767850762);
INSERT INTO `fa_admin_log` VALUES (56, 1, 'admin', '/vZMXPImedo.php/ss/user/edit/ids/19?dialog=1', '游戏数据 / 用户管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"openid\":\"222\",\"userid\":\"00000119\",\"avatar\":\"https:\\/\\/thirdwx.qlogo.cn\\/mmopen\\/vi_32\\/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0\\/132\",\"sign_in_days\":\"0\",\"created_time\":\"2026-01-08 11:19:23\",\"coin_ad_count\":\"0\",\"power_ad_count\":\"0\",\"activity_count\":\"0\",\"activity_progress\":\"1\",\"status\":\"0\"},\"ids\":\"19\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767852049);
INSERT INTO `fa_admin_log` VALUES (57, 1, 'admin', '/vZMXPImedo.php/ss/user/edit/ids/19?dialog=1', '游戏数据 / 用户管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"openid\":\"222\",\"userid\":\"00000119\",\"avatar\":\"https:\\/\\/thirdwx.qlogo.cn\\/mmopen\\/vi_32\\/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0\\/132\",\"sign_in_days\":\"0\",\"created_time\":\"2026-01-08 11:19:23\",\"coin_ad_count\":\"0\",\"power_ad_count\":\"-1\",\"activity_count\":\"0\",\"activity_progress\":\"1\",\"status\":\"1\"},\"ids\":\"19\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767852055);
INSERT INTO `fa_admin_log` VALUES (58, 1, 'admin', '/vZMXPImedo.php/auth/admin/edit/ids/3?dialog=1', '权限管理 / 管理员管理 / 编辑', '{\"dialog\":\"1\",\"__token__\":\"***\",\"group\":[\"1\"],\"row\":{\"username\":\"lujianyu\",\"email\":\"lujianyu@126.com\",\"mobile\":\"13212341235\",\"nickname\":\"lujianyu\",\"password\":\"***\",\"loginfailure\":\"0\",\"status\":\"normal\"},\"ids\":\"3\"}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767852068);
INSERT INTO `fa_admin_log` VALUES (59, 1, 'admin', '/vZMXPImedo.php/auth/admin/edit/ids/3?dialog=1', '权限管理 / 管理员管理 / 编辑', '{\"dialog\":\"1\",\"__token__\":\"***\",\"group\":[\"1\"],\"row\":{\"username\":\"lujianyu\",\"email\":\"lujianyu@126.com\",\"mobile\":\"13212341235\",\"nickname\":\"lujianyu\",\"password\":\"***\",\"loginfailure\":\"0\",\"status\":\"normal\"},\"ids\":\"3\"}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767852086);
INSERT INTO `fa_admin_log` VALUES (60, 1, 'admin', '/vZMXPImedo.php/auth/admin/edit/ids/3?dialog=1', '权限管理 / 管理员管理 / 编辑', '{\"dialog\":\"1\",\"__token__\":\"***\",\"group\":[\"1\"],\"row\":{\"username\":\"lujianyu\",\"email\":\"lujianyu@126.com\",\"mobile\":\"13212341235\",\"nickname\":\"lujianyu\",\"password\":\"***\",\"loginfailure\":\"0\",\"status\":\"normal\"},\"ids\":\"3\"}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767852099);
INSERT INTO `fa_admin_log` VALUES (61, 1, 'admin', '/vZMXPImedo.php/ss/user/edit/ids/21?dialog=1', '游戏数据 / 用户管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"openid\":\"1119\",\"userid\":\"00000121\",\"avatar\":\"https:\\/\\/thirdwx.qlogo.cn\\/mmopen\\/vi_32\\/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0\\/132\",\"sign_in_days\":\"0\",\"created_time\":\"2026-01-08 11:32:34\",\"coin_ad_count\":\"0\",\"power_ad_count\":\"0\",\"activity_count\":\"0\",\"activity_progress\":\"1\",\"status\":\"1\"},\"ids\":\"21\"}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767852253);
INSERT INTO `fa_admin_log` VALUES (62, 1, 'admin', '/vZMXPImedo.php/ajax/upload', '', '{\"category\":\"\"}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767852433);
INSERT INTO `fa_admin_log` VALUES (63, 1, 'admin', '/vZMXPImedo.php/ss/user/add?dialog=1', '游戏数据 / 用户管理 / 添加', '{\"dialog\":\"1\",\"row\":{\"openid\":\"1234566\",\"userid\":\"yiran\",\"token\":\"***\",\"nickname\":\"yiran\",\"avatar\":\"\\/uploads\\/20260108\\/14f51a412371dccbf8d6df11eb14815d.png\",\"sign_in_days\":\"1\",\"sign_time\":\"2026-01-08\",\"sign_status\":\"\",\"home_level\":\"0\",\"created_time\":\"2026-01-08 14:06:27\",\"music\":\"1\",\"sound\":\"1\",\"coin_ad_count\":\"1\",\"power_ad_count\":\"1\",\"activity_count\":\"1\",\"activity_progress\":\"0\",\"status\":\"0\"}}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767852483);
INSERT INTO `fa_admin_log` VALUES (64, 1, 'admin', '/vZMXPImedo.php/ss/user/edit/ids/22?dialog=1', '游戏数据 / 用户管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"openid\":\"1234566\",\"userid\":\"yiran\",\"avatar\":\"\\/uploads\\/20260108\\/14f51a412371dccbf8d6df11eb14815d.png\",\"sign_in_days\":\"1\",\"created_time\":\"2026-01-08 14:06:27\",\"coin_ad_count\":\"1\",\"power_ad_count\":\"1\",\"activity_count\":\"1\",\"activity_progress\":\"0\",\"status\":\"0\"},\"ids\":\"22\"}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767852633);
INSERT INTO `fa_admin_log` VALUES (65, 1, 'admin', '/vZMXPImedo.php/ajax/upload', '', '{\"category\":\"\"}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767852679);
INSERT INTO `fa_admin_log` VALUES (66, 1, 'admin', '/vZMXPImedo.php/index/login', '登录', '{\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"SBR2\",\"keeplogin\":\"1\"}', '122.96.33.43', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1767852686);
INSERT INTO `fa_admin_log` VALUES (67, 1, 'admin', '/vZMXPImedo.php/ss/user/add?dialog=1', '游戏数据 / 用户管理 / 添加', '{\"dialog\":\"1\",\"row\":{\"openid\":\"12345678\",\"userid\":\"12345678\",\"token\":\"***\",\"nickname\":\"shanyan\",\"avatar\":\"\\/uploads\\/20260108\\/14f51a412371dccbf8d6df11eb14815d.png\",\"sign_in_days\":\"1\",\"sign_time\":\"2026-01-08\",\"sign_status\":\"1\",\"home_level\":\"1\",\"created_time\":\"2026-01-08 14:10:43\",\"music\":\"1\",\"sound\":\"1\",\"coin_ad_count\":\"1\",\"power_ad_count\":\"1\",\"activity_count\":\"1\",\"activity_progress\":\"1\",\"status\":\"1\"}}', '153.35.127.152', 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.1 Mobile/15E148 Safari/604.1', 1767852701);
INSERT INTO `fa_admin_log` VALUES (68, 1, 'admin', '/vZMXPImedo.php/ss/user/edit/ids/21?dialog=1', '游戏数据 / 用户管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"openid\":\"1119\",\"userid\":\"00000121\",\"avatar\":\"https:\\/\\/thirdwx.qlogo.cn\\/mmopen\\/vi_32\\/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0\\/132\",\"sign_in_days\":\"0\",\"created_time\":\"2026-01-08 11:32:34\",\"coin_ad_count\":\"2\",\"power_ad_count\":\"0\",\"activity_count\":\"0\",\"activity_progress\":\"1\",\"status\":\"0\"},\"ids\":\"21\"}', '122.96.33.43', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1767852775);
INSERT INTO `fa_admin_log` VALUES (69, 1, 'admin', '/vZMXPImedo.php/ss/user/edit/ids/20?dialog=1', '游戏数据 / 用户管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"openid\":\"1011\",\"userid\":\"00000120\",\"avatar\":\"https:\\/\\/thirdwx.qlogo.cn\\/mmopen\\/vi_32\\/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0\\/132\",\"sign_in_days\":\"0\",\"created_time\":\"2026-01-08 11:22:29\",\"coin_ad_count\":\"0\",\"power_ad_count\":\"0\",\"activity_count\":\"0\",\"activity_progress\":\"1\",\"status\":\"0\"},\"ids\":\"20\"}', '122.96.33.43', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1767852780);
INSERT INTO `fa_admin_log` VALUES (70, 1, 'admin', '/vZMXPImedo.php/ss/user/edit/ids/23?dialog=1', '游戏数据 / 用户管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"openid\":\"12345678\",\"userid\":\"12345678\",\"avatar\":\"\\/uploads\\/20260108\\/14f51a412371dccbf8d6df11eb14815d.png\",\"sign_in_days\":\"1\",\"created_time\":\"2026-01-08 14:10:43\",\"coin_ad_count\":\"1\",\"power_ad_count\":\"1\",\"activity_count\":\"1\",\"activity_progress\":\"1\",\"status\":\"0\"},\"ids\":\"23\"}', '122.96.33.43', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1767852786);
INSERT INTO `fa_admin_log` VALUES (71, 1, 'admin', '/vZMXPImedo.php/ss/user/edit/ids/19?dialog=1', '游戏数据 / 用户管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"openid\":\"222\",\"userid\":\"00000119\",\"avatar\":\"https:\\/\\/thirdwx.qlogo.cn\\/mmopen\\/vi_32\\/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0\\/132\",\"sign_in_days\":\"0\",\"created_time\":\"2026-01-08 11:19:23\",\"coin_ad_count\":\"0\",\"power_ad_count\":\"-1\",\"activity_count\":\"0\",\"activity_progress\":\"1\",\"status\":\"0\"},\"ids\":\"19\"}', '122.96.33.43', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1767852791);
INSERT INTO `fa_admin_log` VALUES (72, 1, 'admin', '/vZMXPImedo.php/index/login', '登录', '{\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"LMEW\"}', '115.60.94.182', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767853079);
INSERT INTO `fa_admin_log` VALUES (73, 1, 'admin', '/vZMXPImedo.php/ss/user/edit/ids/21?dialog=1', '游戏数据 / 用户管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"openid\":\"1119\",\"userid\":\"00000121\",\"avatar\":\"https:\\/\\/thirdwx.qlogo.cn\\/mmopen\\/vi_32\\/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0\\/132\",\"sign_in_days\":\"0\",\"created_time\":\"2026-01-08 11:32:34\",\"coin_ad_count\":\"0\",\"power_ad_count\":\"0\",\"activity_count\":\"0\",\"activity_progress\":\"1\",\"status\":\"0\"},\"ids\":\"21\"}', '115.60.94.182', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767853108);
INSERT INTO `fa_admin_log` VALUES (74, 1, 'admin', '/vZMXPImedo.php/ss/user/edit/ids/20?dialog=1', '游戏数据 / 用户管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"openid\":\"1011\",\"userid\":\"00000120\",\"avatar\":\"https:\\/\\/thirdwx.qlogo.cn\\/mmopen\\/vi_32\\/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0\\/132\",\"sign_in_days\":\"0\",\"created_time\":\"2026-01-08 11:22:29.000000\",\"coin_ad_count\":\"0\",\"power_ad_count\":\"0\",\"activity_count\":\"0\",\"activity_progress\":\"1\",\"status\":\"0\"},\"ids\":\"20\"}', '122.96.33.43', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1767853351);
INSERT INTO `fa_admin_log` VALUES (75, 1, 'admin', '/vZMXPImedo.php/auth/rule/multi', '权限管理 / 菜单规则', '{\"action\":\"\",\"ids\":\"85\",\"params\":\"ismenu=1\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767859886);
INSERT INTO `fa_admin_log` VALUES (76, 1, 'admin', '/vZMXPImedo.php/command/get_field_list', '在线命令管理', '{\"table\":\"game_user_prop\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767859909);
INSERT INTO `fa_admin_log` VALUES (77, 1, 'admin', '/vZMXPImedo.php/command/command/action/command', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user_prop\",\"controller\":\"ss\\/userprop\",\"model\":\"ss\\/userprop\",\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\",\"action\":\"command\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767859928);
INSERT INTO `fa_admin_log` VALUES (78, 1, 'admin', '/vZMXPImedo.php/command/command/action/execute', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user_prop\",\"controller\":\"ss\\/userprop\",\"model\":\"ss\\/userprop\",\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\",\"action\":\"execute\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767859928);
INSERT INTO `fa_admin_log` VALUES (79, 1, 'admin', '/vZMXPImedo.php/command/get_field_list', '在线命令管理', '{\"table\":\"auth_group\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767859941);
INSERT INTO `fa_admin_log` VALUES (80, 1, 'admin', '/vZMXPImedo.php/command/get_controller_list', '在线命令管理', '{\"q_word\":[\"\"],\"pageNumber\":\"1\",\"pageSize\":\"10\",\"andOr\":\"OR \",\"orderBy\":[[\"name\",\"ASC\"]],\"searchTable\":\"tbl\",\"showField\":\"name\",\"keyField\":\"id\",\"searchField\":[\"name\"],\"name\":\"\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767859942);
INSERT INTO `fa_admin_log` VALUES (81, 1, 'admin', '/vZMXPImedo.php/command/get_controller_list', '在线命令管理', '{\"q_word\":[\"ss\"],\"pageNumber\":\"1\",\"pageSize\":\"10\",\"andOr\":\"OR \",\"orderBy\":[[\"name\",\"ASC\"]],\"searchTable\":\"tbl\",\"showField\":\"name\",\"keyField\":\"id\",\"searchField\":[\"name\"],\"name\":\"ss\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767859944);
INSERT INTO `fa_admin_log` VALUES (82, 1, 'admin', '/vZMXPImedo.php/command/get_controller_list', '在线命令管理', '{\"q_word\":[\"\"],\"pageNumber\":\"1\",\"pageSize\":\"10\",\"andOr\":\"OR \",\"orderBy\":[[\"name\",\"ASC\"]],\"searchTable\":\"tbl\",\"showField\":\"name\",\"keyField\":\"id\",\"searchField\":[\"name\"],\"name\":\"\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767859945);
INSERT INTO `fa_admin_log` VALUES (83, 1, 'admin', '/vZMXPImedo.php/command/command/action/command', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"1\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/Userprop.php\",\"action\":\"command\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767859947);
INSERT INTO `fa_admin_log` VALUES (84, 1, 'admin', '/vZMXPImedo.php/command/command/action/execute', '在线命令管理 / 生成并执行命令', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"1\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/Userprop.php\",\"action\":\"execute\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767859948);
INSERT INTO `fa_admin_log` VALUES (85, 1, 'admin', '/vZMXPImedo.php/auth/rule/multi', '权限管理 / 菜单规则', '{\"action\":\"\",\"ids\":\"85\",\"params\":\"ismenu=0\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767860038);
INSERT INTO `fa_admin_log` VALUES (86, 1, 'admin', '/vZMXPImedo.php/ss/userprop/edit/ids/152?dialog=1', '游戏数据 / 用户道具管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"prop_count\":\"200\"},\"ids\":\"152\"}', '115.60.94.182', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1767860390);
INSERT INTO `fa_admin_log` VALUES (87, 1, 'admin', '/vZMXPImedo.php/index/login?url=/vZMXPImedo.php/ss/userprop?ref=addtabs', '登录', '{\"url\":\"\\/vZMXPImedo.php\\/ss\\/userprop?ref=addtabs\",\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"ZBW2\",\"keeplogin\":\"1\"}', '116.147.252.141', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1767953157);
INSERT INTO `fa_admin_log` VALUES (88, 1, 'admin', '/vZMXPImedo.php/ss/userprop/edit/ids/122?dialog=1', '游戏数据 / 用户道具管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"prop_count\":\"500\"},\"ids\":\"122\"}', '116.147.252.141', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1767953247);
INSERT INTO `fa_admin_log` VALUES (89, 1, 'admin', '/vZMXPImedo.php/ss/userprop/edit/ids/121?dialog=1', '游戏数据 / 用户道具管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"prop_count\":\"5000\"},\"ids\":\"121\"}', '116.147.252.141', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1767953255);
INSERT INTO `fa_admin_log` VALUES (90, 1, 'admin', '/vZMXPImedo.php/ss/userprop/edit/ids/120?dialog=1', '游戏数据 / 用户道具管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"prop_count\":\"50000\"},\"ids\":\"120\"}', '116.147.252.141', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1767953261);
INSERT INTO `fa_admin_log` VALUES (91, 1, 'admin', '/vZMXPImedo.php/ss/userprop/edit/ids/122?dialog=1', '游戏数据 / 用户道具管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"prop_count\":\"50000\"},\"ids\":\"122\"}', '116.147.252.141', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1767953266);
INSERT INTO `fa_admin_log` VALUES (92, 1, 'admin', '/vZMXPImedo.php/ss/userprop/edit/ids/121?dialog=1', '游戏数据 / 用户道具管理 / 编辑', '{\"dialog\":\"1\",\"row\":{\"prop_count\":\"50000\"},\"ids\":\"121\"}', '116.147.252.141', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/142.0.0.0 Safari/537.36', 1767953271);
INSERT INTO `fa_admin_log` VALUES (93, 1, 'admin', '/vZMXPImedo.php/index/login', '登录', '{\"__token__\":\"***\",\"username\":\"admin\",\"password\":\"***\",\"captcha\":\"vu5m\"}', '115.60.90.150', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/143.0.0.0 Safari/537.36', 1768557964);

-- ----------------------------
-- Table structure for fa_area
-- ----------------------------
DROP TABLE IF EXISTS `fa_area`;
CREATE TABLE `fa_area`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `pid` int NULL DEFAULT NULL COMMENT '父id',
  `shortname` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '简称',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '名称',
  `mergename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '全称',
  `level` tinyint NULL DEFAULT NULL COMMENT '层级:1=省,2=市,3=区/县',
  `pinyin` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '拼音',
  `code` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '长途区号',
  `zip` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '邮编',
  `first` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '首字母',
  `lng` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '经度',
  `lat` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '纬度',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `pid`(`pid` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '地区表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_area
-- ----------------------------

-- ----------------------------
-- Table structure for fa_attachment
-- ----------------------------
DROP TABLE IF EXISTS `fa_attachment`;
CREATE TABLE `fa_attachment`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `category` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '类别',
  `admin_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '管理员ID',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '会员ID',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '物理路径',
  `imagewidth` int UNSIGNED NULL DEFAULT 0 COMMENT '宽度',
  `imageheight` int UNSIGNED NULL DEFAULT 0 COMMENT '高度',
  `imagetype` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '图片类型',
  `imageframes` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '图片帧数',
  `filename` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '文件名称',
  `filesize` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '文件大小',
  `mimetype` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT 'mime类型',
  `extparam` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '透传数据',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建日期',
  `updatetime` bigint NULL DEFAULT NULL COMMENT '更新时间',
  `uploadtime` bigint NULL DEFAULT NULL COMMENT '上传时间',
  `storage` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'local' COMMENT '存储位置',
  `sha1` varchar(40) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '文件 sha1编码',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '附件表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_attachment
-- ----------------------------
INSERT INTO `fa_attachment` VALUES (1, '', 1, 0, '/assets/img/qrcode.png', 150, 150, 'png', 0, 'qrcode.png', 21859, 'image/png', '', 1491635035, 1491635035, 1491635035, 'local', '17163603d0263e4838b9387ff2cd4877e8b018f6');
INSERT INTO `fa_attachment` VALUES (2, '', 1, 0, '/uploads/20260108/14f51a412371dccbf8d6df11eb14815d.png', 1320, 2868, 'png', 0, 'IMG_6165.png', 3510335, 'image/png', '', 1767852433, 1767852433, 1767852433, 'local', '891822755abb86176b607dacc56dbfb2fb474edd');

-- ----------------------------
-- Table structure for fa_auth_group
-- ----------------------------
DROP TABLE IF EXISTS `fa_auth_group`;
CREATE TABLE `fa_auth_group`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `pid` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '父组别',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '组名',
  `rules` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '规则ID',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `updatetime` bigint NULL DEFAULT NULL COMMENT '更新时间',
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '分组表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_auth_group
-- ----------------------------
INSERT INTO `fa_auth_group` VALUES (1, 0, 'Admin group', '*', 1491635035, 1491635035, 'normal');
INSERT INTO `fa_auth_group` VALUES (2, 1, 'Second group', '13,14,16,15,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,40,41,42,43,44,45,46,47,48,49,50,55,56,57,58,59,60,61,62,63,64,65,1,9,10,11,7,6,8,2,4,5', 1491635035, 1491635035, 'normal');
INSERT INTO `fa_auth_group` VALUES (3, 2, 'Third group', '1,4,9,10,11,13,14,15,16,17,40,41,42,43,44,45,46,47,48,49,50,55,56,57,58,59,60,61,62,63,64,65,5', 1491635035, 1491635035, 'normal');
INSERT INTO `fa_auth_group` VALUES (4, 1, 'Second group 2', '1,4,13,14,15,16,17,55,56,57,58,59,60,61,62,63,64,65', 1491635035, 1491635035, 'normal');
INSERT INTO `fa_auth_group` VALUES (5, 2, 'Third group 2', '1,2,6,7,8,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34', 1491635035, 1491635035, 'normal');

-- ----------------------------
-- Table structure for fa_auth_group_access
-- ----------------------------
DROP TABLE IF EXISTS `fa_auth_group_access`;
CREATE TABLE `fa_auth_group_access`  (
  `uid` int UNSIGNED NOT NULL COMMENT '会员ID',
  `group_id` int UNSIGNED NOT NULL COMMENT '级别ID',
  UNIQUE INDEX `uid_group_id`(`uid` ASC, `group_id` ASC) USING BTREE,
  INDEX `uid`(`uid` ASC) USING BTREE,
  INDEX `group_id`(`group_id` ASC) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '权限分组表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_auth_group_access
-- ----------------------------
INSERT INTO `fa_auth_group_access` VALUES (1, 1);
INSERT INTO `fa_auth_group_access` VALUES (2, 1);
INSERT INTO `fa_auth_group_access` VALUES (3, 1);
INSERT INTO `fa_auth_group_access` VALUES (4, 1);

-- ----------------------------
-- Table structure for fa_auth_rule
-- ----------------------------
DROP TABLE IF EXISTS `fa_auth_rule`;
CREATE TABLE `fa_auth_rule`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `type` enum('menu','file') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'file' COMMENT 'menu为菜单,file为权限节点',
  `pid` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '父ID',
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '规则名称',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '规则名称',
  `icon` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '图标',
  `url` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '规则URL',
  `condition` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '条件',
  `remark` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '备注',
  `ismenu` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '是否为菜单',
  `menutype` enum('addtabs','blank','dialog','ajax') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '菜单类型',
  `extend` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '扩展属性',
  `py` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '拼音首字母',
  `pinyin` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '拼音',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `updatetime` bigint NULL DEFAULT NULL COMMENT '更新时间',
  `weigh` int NOT NULL DEFAULT 0 COMMENT '权重',
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE,
  INDEX `pid`(`pid` ASC) USING BTREE,
  INDEX `weigh`(`weigh` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 112 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '节点表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_auth_rule
-- ----------------------------
INSERT INTO `fa_auth_rule` VALUES (1, 'file', 0, 'dashboard', 'Dashboard', 'fa fa-dashboard', '', '', 'Dashboard tips', 0, NULL, '', 'kzt', 'kongzhitai', 1491635035, 1767838680, 143, 'normal');
INSERT INTO `fa_auth_rule` VALUES (2, 'file', 0, 'general', 'General', 'fa fa-cogs', '', '', '', 0, NULL, '', 'cggl', 'changguiguanli', 1491635035, 1767838682, 137, 'normal');
INSERT INTO `fa_auth_rule` VALUES (3, 'file', 0, 'category', 'Category', 'fa fa-leaf', '', '', 'Category tips', 0, NULL, '', 'flgl', 'fenleiguanli', 1491635035, 1491635035, 119, 'normal');
INSERT INTO `fa_auth_rule` VALUES (4, 'file', 0, 'addon', 'Addon', 'fa fa-rocket', '', '', 'Addon tips', 0, NULL, '', 'cjgl', 'chajianguanli', 1491635035, 1767838686, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (5, 'file', 0, 'auth', 'Auth', 'fa fa-group', '', '', '', 1, NULL, '', 'qxgl', 'quanxianguanli', 1491635035, 1491635035, 99, 'normal');
INSERT INTO `fa_auth_rule` VALUES (6, 'file', 2, 'general/config', 'Config', 'fa fa-cog', '', '', 'Config tips', 1, NULL, '', 'xtpz', 'xitongpeizhi', 1491635035, 1491635035, 60, 'normal');
INSERT INTO `fa_auth_rule` VALUES (7, 'file', 2, 'general/attachment', 'Attachment', 'fa fa-file-image-o', '', '', 'Attachment tips', 1, NULL, '', 'fjgl', 'fujianguanli', 1491635035, 1491635035, 53, 'normal');
INSERT INTO `fa_auth_rule` VALUES (8, 'file', 2, 'general/profile', 'Profile', 'fa fa-user', '', '', '', 1, NULL, '', 'grzl', 'gerenziliao', 1491635035, 1491635035, 34, 'normal');
INSERT INTO `fa_auth_rule` VALUES (9, 'file', 5, 'auth/admin', 'Admin', 'fa fa-user', '', '', 'Admin tips', 1, NULL, '', 'glygl', 'guanliyuanguanli', 1491635035, 1491635035, 118, 'normal');
INSERT INTO `fa_auth_rule` VALUES (10, 'file', 5, 'auth/adminlog', 'Admin log', 'fa fa-list-alt', '', '', 'Admin log tips', 1, NULL, '', 'glyrz', 'guanliyuanrizhi', 1491635035, 1491635035, 113, 'normal');
INSERT INTO `fa_auth_rule` VALUES (11, 'file', 5, 'auth/group', 'Group', 'fa fa-group', '', '', 'Group tips', 1, NULL, '', 'jsz', 'juesezu', 1491635035, 1491635035, 109, 'normal');
INSERT INTO `fa_auth_rule` VALUES (12, 'file', 5, 'auth/rule', 'Rule', 'fa fa-bars', '', '', 'Rule tips', 1, NULL, '', 'cdgz', 'caidanguize', 1491635035, 1491635035, 104, 'normal');
INSERT INTO `fa_auth_rule` VALUES (13, 'file', 1, 'dashboard/index', 'View', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 136, 'normal');
INSERT INTO `fa_auth_rule` VALUES (14, 'file', 1, 'dashboard/add', 'Add', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 135, 'normal');
INSERT INTO `fa_auth_rule` VALUES (15, 'file', 1, 'dashboard/del', 'Delete', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 133, 'normal');
INSERT INTO `fa_auth_rule` VALUES (16, 'file', 1, 'dashboard/edit', 'Edit', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 134, 'normal');
INSERT INTO `fa_auth_rule` VALUES (17, 'file', 1, 'dashboard/multi', 'Multi', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 132, 'normal');
INSERT INTO `fa_auth_rule` VALUES (18, 'file', 6, 'general/config/index', 'View', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 52, 'normal');
INSERT INTO `fa_auth_rule` VALUES (19, 'file', 6, 'general/config/add', 'Add', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 51, 'normal');
INSERT INTO `fa_auth_rule` VALUES (20, 'file', 6, 'general/config/edit', 'Edit', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 50, 'normal');
INSERT INTO `fa_auth_rule` VALUES (21, 'file', 6, 'general/config/del', 'Delete', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 49, 'normal');
INSERT INTO `fa_auth_rule` VALUES (22, 'file', 6, 'general/config/multi', 'Multi', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 48, 'normal');
INSERT INTO `fa_auth_rule` VALUES (23, 'file', 7, 'general/attachment/index', 'View', 'fa fa-circle-o', '', '', 'Attachment tips', 0, NULL, '', '', '', 1491635035, 1491635035, 59, 'normal');
INSERT INTO `fa_auth_rule` VALUES (24, 'file', 7, 'general/attachment/select', 'Select attachment', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 58, 'normal');
INSERT INTO `fa_auth_rule` VALUES (25, 'file', 7, 'general/attachment/add', 'Add', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 57, 'normal');
INSERT INTO `fa_auth_rule` VALUES (26, 'file', 7, 'general/attachment/edit', 'Edit', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 56, 'normal');
INSERT INTO `fa_auth_rule` VALUES (27, 'file', 7, 'general/attachment/del', 'Delete', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 55, 'normal');
INSERT INTO `fa_auth_rule` VALUES (28, 'file', 7, 'general/attachment/multi', 'Multi', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 54, 'normal');
INSERT INTO `fa_auth_rule` VALUES (29, 'file', 8, 'general/profile/index', 'View', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 33, 'normal');
INSERT INTO `fa_auth_rule` VALUES (30, 'file', 8, 'general/profile/update', 'Update profile', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 32, 'normal');
INSERT INTO `fa_auth_rule` VALUES (31, 'file', 8, 'general/profile/add', 'Add', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 31, 'normal');
INSERT INTO `fa_auth_rule` VALUES (32, 'file', 8, 'general/profile/edit', 'Edit', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 30, 'normal');
INSERT INTO `fa_auth_rule` VALUES (33, 'file', 8, 'general/profile/del', 'Delete', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 29, 'normal');
INSERT INTO `fa_auth_rule` VALUES (34, 'file', 8, 'general/profile/multi', 'Multi', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 28, 'normal');
INSERT INTO `fa_auth_rule` VALUES (35, 'file', 3, 'category/index', 'View', 'fa fa-circle-o', '', '', 'Category tips', 0, NULL, '', '', '', 1491635035, 1491635035, 142, 'normal');
INSERT INTO `fa_auth_rule` VALUES (36, 'file', 3, 'category/add', 'Add', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 141, 'normal');
INSERT INTO `fa_auth_rule` VALUES (37, 'file', 3, 'category/edit', 'Edit', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 140, 'normal');
INSERT INTO `fa_auth_rule` VALUES (38, 'file', 3, 'category/del', 'Delete', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 139, 'normal');
INSERT INTO `fa_auth_rule` VALUES (39, 'file', 3, 'category/multi', 'Multi', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 138, 'normal');
INSERT INTO `fa_auth_rule` VALUES (40, 'file', 9, 'auth/admin/index', 'View', 'fa fa-circle-o', '', '', 'Admin tips', 0, NULL, '', '', '', 1491635035, 1491635035, 117, 'normal');
INSERT INTO `fa_auth_rule` VALUES (41, 'file', 9, 'auth/admin/add', 'Add', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 116, 'normal');
INSERT INTO `fa_auth_rule` VALUES (42, 'file', 9, 'auth/admin/edit', 'Edit', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 115, 'normal');
INSERT INTO `fa_auth_rule` VALUES (43, 'file', 9, 'auth/admin/del', 'Delete', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 114, 'normal');
INSERT INTO `fa_auth_rule` VALUES (44, 'file', 10, 'auth/adminlog/index', 'View', 'fa fa-circle-o', '', '', 'Admin log tips', 0, NULL, '', '', '', 1491635035, 1491635035, 112, 'normal');
INSERT INTO `fa_auth_rule` VALUES (45, 'file', 10, 'auth/adminlog/detail', 'Detail', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 111, 'normal');
INSERT INTO `fa_auth_rule` VALUES (46, 'file', 10, 'auth/adminlog/del', 'Delete', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 110, 'normal');
INSERT INTO `fa_auth_rule` VALUES (47, 'file', 11, 'auth/group/index', 'View', 'fa fa-circle-o', '', '', 'Group tips', 0, NULL, '', '', '', 1491635035, 1491635035, 108, 'normal');
INSERT INTO `fa_auth_rule` VALUES (48, 'file', 11, 'auth/group/add', 'Add', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 107, 'normal');
INSERT INTO `fa_auth_rule` VALUES (49, 'file', 11, 'auth/group/edit', 'Edit', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 106, 'normal');
INSERT INTO `fa_auth_rule` VALUES (50, 'file', 11, 'auth/group/del', 'Delete', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 105, 'normal');
INSERT INTO `fa_auth_rule` VALUES (51, 'file', 12, 'auth/rule/index', 'View', 'fa fa-circle-o', '', '', 'Rule tips', 0, NULL, '', '', '', 1491635035, 1491635035, 103, 'normal');
INSERT INTO `fa_auth_rule` VALUES (52, 'file', 12, 'auth/rule/add', 'Add', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 102, 'normal');
INSERT INTO `fa_auth_rule` VALUES (53, 'file', 12, 'auth/rule/edit', 'Edit', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 101, 'normal');
INSERT INTO `fa_auth_rule` VALUES (54, 'file', 12, 'auth/rule/del', 'Delete', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 100, 'normal');
INSERT INTO `fa_auth_rule` VALUES (55, 'file', 4, 'addon/index', 'View', 'fa fa-circle-o', '', '', 'Addon tips', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (56, 'file', 4, 'addon/add', 'Add', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (57, 'file', 4, 'addon/edit', 'Edit', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (58, 'file', 4, 'addon/del', 'Delete', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (59, 'file', 4, 'addon/downloaded', 'Local addon', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (60, 'file', 4, 'addon/state', 'Update state', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (63, 'file', 4, 'addon/config', 'Setting', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (64, 'file', 4, 'addon/refresh', 'Refresh', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (65, 'file', 4, 'addon/multi', 'Multi', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (66, 'file', 0, 'user', 'User', 'fa fa-user-circle', '', '', '', 0, NULL, '', 'hygl', 'huiyuanguanli', 1491635035, 1767838684, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (67, 'file', 66, 'user/user', 'User', 'fa fa-user', '', '', '', 1, NULL, '', 'hygl', 'huiyuanguanli', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (68, 'file', 67, 'user/user/index', 'View', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (69, 'file', 67, 'user/user/edit', 'Edit', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (70, 'file', 67, 'user/user/add', 'Add', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (71, 'file', 67, 'user/user/del', 'Del', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (72, 'file', 67, 'user/user/multi', 'Multi', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (73, 'file', 66, 'user/group', 'User group', 'fa fa-users', '', '', '', 1, NULL, '', 'hyfz', 'huiyuanfenzu', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (74, 'file', 73, 'user/group/add', 'Add', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (75, 'file', 73, 'user/group/edit', 'Edit', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (76, 'file', 73, 'user/group/index', 'View', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (77, 'file', 73, 'user/group/del', 'Del', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (78, 'file', 73, 'user/group/multi', 'Multi', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (79, 'file', 66, 'user/rule', 'User rule', 'fa fa-circle-o', '', '', '', 1, NULL, '', 'hygz', 'huiyuanguize', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (80, 'file', 79, 'user/rule/index', 'View', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (81, 'file', 79, 'user/rule/del', 'Del', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (82, 'file', 79, 'user/rule/add', 'Add', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (83, 'file', 79, 'user/rule/edit', 'Edit', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (84, 'file', 79, 'user/rule/multi', 'Multi', 'fa fa-circle-o', '', '', '', 0, NULL, '', '', '', 1491635035, 1491635035, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (85, 'file', 0, 'command', '在线命令管理', 'fa fa-terminal', '', '', '', 0, NULL, '', 'zxmlgl', 'zaixianminglingguanli', 1767838666, 1767860038, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (86, 'file', 85, 'command/index', '查看', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'zk', 'zhakan', 1767838666, 1767838666, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (87, 'file', 85, 'command/add', '添加', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'tj', 'tianjia', 1767838666, 1767838666, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (88, 'file', 85, 'command/detail', '详情', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'xq', 'xiangqing', 1767838666, 1767838666, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (89, 'file', 85, 'command/command', '生成并执行命令', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'scbzxml', 'shengchengbingzhixingmingling', 1767838666, 1767838666, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (90, 'file', 85, 'command/execute', '再次执行命令', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'zczxml', 'zaicizhixingmingling', 1767838666, 1767838666, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (91, 'file', 85, 'command/del', '删除', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'sc', 'shanchu', 1767838666, 1767838666, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (92, 'file', 85, 'command/multi', '批量更新', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'plgx', 'pilianggengxin', 1767838666, 1767838666, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (93, 'file', 0, 'ss', '游戏数据', 'fa fa-list', '', '', '', 1, 'addtabs', '', 'yxsj', 'youxishuju', 1767841515, 1767841535, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (94, 'file', 93, 'ss/user', '用户管理', 'fa fa-circle-o', '', '', '', 1, NULL, '', 'yhgl', 'yonghuguanli', 1767841515, 1767841515, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (95, 'file', 94, 'ss/user/index', '查看', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'zk', 'zhakan', 1767841515, 1767841938, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (96, 'file', 94, 'ss/user/add', '添加', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'tj', 'tianjia', 1767841515, 1767841939, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (97, 'file', 94, 'ss/user/edit', '编辑', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'bj', 'bianji', 1767841515, 1767841939, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (98, 'file', 94, 'ss/user/del', '删除', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'sc', 'shanchu', 1767841515, 1767841939, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (99, 'file', 94, 'ss/user/multi', '批量更新', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'plgx', 'pilianggengxin', 1767841515, 1767841939, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (100, 'file', 93, 'ss/userpet', '用户宠物管理', 'fa fa-circle-o', '', '', '', 1, NULL, '', 'yhcwgl', 'yonghuchongwuguanli', 1767843333, 1767843333, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (101, 'file', 100, 'ss/userpet/index', '查看', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'zk', 'zhakan', 1767843333, 1767843333, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (102, 'file', 100, 'ss/userpet/add', '添加', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'tj', 'tianjia', 1767843333, 1767843333, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (103, 'file', 100, 'ss/userpet/edit', '编辑', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'bj', 'bianji', 1767843333, 1767843333, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (104, 'file', 100, 'ss/userpet/del', '删除', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'sc', 'shanchu', 1767843333, 1767843333, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (105, 'file', 100, 'ss/userpet/multi', '批量更新', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'plgx', 'pilianggengxin', 1767843333, 1767843333, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (106, 'file', 93, 'ss/userprop', '用户道具管理', 'fa fa-circle-o', '', '', '', 1, NULL, '', 'yhdjgl', 'yonghudaojuguanli', 1767859948, 1767859948, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (107, 'file', 106, 'ss/userprop/index', '查看', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'zk', 'zhakan', 1767859948, 1767859948, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (108, 'file', 106, 'ss/userprop/add', '添加', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'tj', 'tianjia', 1767859948, 1767859948, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (109, 'file', 106, 'ss/userprop/edit', '编辑', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'bj', 'bianji', 1767859948, 1767859948, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (110, 'file', 106, 'ss/userprop/del', '删除', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'sc', 'shanchu', 1767859948, 1767859948, 0, 'normal');
INSERT INTO `fa_auth_rule` VALUES (111, 'file', 106, 'ss/userprop/multi', '批量更新', 'fa fa-circle-o', '', '', '', 0, NULL, '', 'plgx', 'pilianggengxin', 1767859948, 1767859948, 0, 'normal');

-- ----------------------------
-- Table structure for fa_category
-- ----------------------------
DROP TABLE IF EXISTS `fa_category`;
CREATE TABLE `fa_category`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `pid` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '父ID',
  `type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '栏目类型',
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `flag` set('hot','index','recommend') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '',
  `image` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '图片',
  `keywords` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '关键字',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '描述',
  `diyname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '自定义名称',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `updatetime` bigint NULL DEFAULT NULL COMMENT '更新时间',
  `weigh` int NOT NULL DEFAULT 0 COMMENT '权重',
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `weigh`(`weigh` ASC, `id` ASC) USING BTREE,
  INDEX `pid`(`pid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '分类表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_category
-- ----------------------------
INSERT INTO `fa_category` VALUES (1, 0, 'page', '官方新闻', 'news', 'recommend', '/assets/img/qrcode.png', '', '', 'news', 1491635035, 1491635035, 1, 'normal');
INSERT INTO `fa_category` VALUES (2, 0, 'page', '移动应用', 'mobileapp', 'hot', '/assets/img/qrcode.png', '', '', 'mobileapp', 1491635035, 1491635035, 2, 'normal');
INSERT INTO `fa_category` VALUES (3, 2, 'page', '微信公众号', 'wechatpublic', 'index', '/assets/img/qrcode.png', '', '', 'wechatpublic', 1491635035, 1491635035, 3, 'normal');
INSERT INTO `fa_category` VALUES (4, 2, 'page', 'Android开发', 'android', 'recommend', '/assets/img/qrcode.png', '', '', 'android', 1491635035, 1491635035, 4, 'normal');
INSERT INTO `fa_category` VALUES (5, 0, 'page', '软件产品', 'software', 'recommend', '/assets/img/qrcode.png', '', '', 'software', 1491635035, 1491635035, 5, 'normal');
INSERT INTO `fa_category` VALUES (6, 5, 'page', '网站建站', 'website', 'recommend', '/assets/img/qrcode.png', '', '', 'website', 1491635035, 1491635035, 6, 'normal');
INSERT INTO `fa_category` VALUES (7, 5, 'page', '企业管理软件', 'company', 'index', '/assets/img/qrcode.png', '', '', 'company', 1491635035, 1491635035, 7, 'normal');
INSERT INTO `fa_category` VALUES (8, 6, 'page', 'PC端', 'website-pc', 'recommend', '/assets/img/qrcode.png', '', '', 'website-pc', 1491635035, 1491635035, 8, 'normal');
INSERT INTO `fa_category` VALUES (9, 6, 'page', '移动端', 'website-mobile', 'recommend', '/assets/img/qrcode.png', '', '', 'website-mobile', 1491635035, 1491635035, 9, 'normal');
INSERT INTO `fa_category` VALUES (10, 7, 'page', 'CRM系统 ', 'company-crm', 'recommend', '/assets/img/qrcode.png', '', '', 'company-crm', 1491635035, 1491635035, 10, 'normal');
INSERT INTO `fa_category` VALUES (11, 7, 'page', 'SASS平台软件', 'company-sass', 'recommend', '/assets/img/qrcode.png', '', '', 'company-sass', 1491635035, 1491635035, 11, 'normal');
INSERT INTO `fa_category` VALUES (12, 0, 'test', '测试1', 'test1', 'recommend', '/assets/img/qrcode.png', '', '', 'test1', 1491635035, 1491635035, 12, 'normal');
INSERT INTO `fa_category` VALUES (13, 0, 'test', '测试2', 'test2', 'recommend', '/assets/img/qrcode.png', '', '', 'test2', 1491635035, 1491635035, 13, 'normal');

-- ----------------------------
-- Table structure for fa_command
-- ----------------------------
DROP TABLE IF EXISTS `fa_command`;
CREATE TABLE `fa_command`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '类型',
  `params` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '参数',
  `command` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '命令',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '返回结果',
  `executetime` bigint UNSIGNED NULL DEFAULT NULL COMMENT '执行时间',
  `createtime` bigint UNSIGNED NULL DEFAULT NULL COMMENT '创建时间',
  `updatetime` bigint UNSIGNED NULL DEFAULT NULL COMMENT '更新时间',
  `status` enum('successed','failured') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'failured' COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '在线命令表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_command
-- ----------------------------
INSERT INTO `fa_command` VALUES (1, 'crud', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"0\",\"table\":\"game_user\",\"controller\":\"ss\\/user\",\"model\":\"ss\\/user\",\"fields\":[\"id\",\"nickname\",\"sign_in_days\",\"sign_time\",\"sign_status\",\"home_level\",\"created_time\",\"coin_ad_count\",\"power_ad_count\",\"activity_count\",\"activity_progress\",\"status\"],\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\"}', 'php think crud --table=game_user --controller=ss/user --model=ss/user --fields=id,nickname,sign_in_days,sign_time,sign_status,home_level,created_time,coin_ad_count,power_ad_count,activity_count,activity_progress,status', 'Build Successed', 1767841500, 1767841500, 1767841500, 'successed');
INSERT INTO `fa_command` VALUES (2, 'menu', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"0\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/User.php\"}', 'php think menu --controller=ss/User', 'Build Successed!', 1767841514, 1767841514, 1767841515, 'successed');
INSERT INTO `fa_command` VALUES (3, 'menu', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"0\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/User.php\"}', 'php think menu --controller=ss/User', 'Build Successed!', 1767841741, 1767841741, 1767841742, 'successed');
INSERT INTO `fa_command` VALUES (4, 'crud', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user\",\"controller\":\"ss\\/user\",\"model\":\"ss\\/user\",\"fields\":[\"id\",\"nickname\",\"sign_in_days\",\"sign_time\",\"sign_status\",\"home_level\",\"created_time\",\"coin_ad_count\",\"power_ad_count\",\"activity_count\",\"activity_progress\",\"status\"],\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\"}', 'php think crud --force=1 --table=game_user --controller=ss/user --model=ss/user --fields=id,nickname,sign_in_days,sign_time,sign_status,home_level,created_time,coin_ad_count,power_ad_count,activity_count,activity_progress,status', 'Build Successed', 1767841785, 1767841785, 1767841785, 'successed');
INSERT INTO `fa_command` VALUES (5, 'menu', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"1\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/User.php\"}', 'php think menu --force=1 --controller=ss/User', 'Build Successed!', 1767841821, 1767841821, 1767841821, 'successed');
INSERT INTO `fa_command` VALUES (6, 'crud', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user\",\"controller\":\"ss\\/user\",\"model\":\"ss\\/user\",\"fields\":[\"id\",\"nickname\",\"sign_in_days\",\"sign_time\",\"sign_status\",\"home_level\",\"created_time\",\"coin_ad_count\",\"power_ad_count\",\"activity_count\",\"activity_progress\",\"status\"],\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\"}', 'php think crud --force=1 --table=game_user --controller=ss/user --model=ss/user --fields=id,nickname,sign_in_days,sign_time,sign_status,home_level,created_time,coin_ad_count,power_ad_count,activity_count,activity_progress,status', 'Build Successed', 1767841924, 1767841924, 1767841925, 'successed');
INSERT INTO `fa_command` VALUES (7, 'crud', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user\",\"controller\":\"ss\\/user\",\"model\":\"ss\\/user\",\"fields\":[\"id\",\"nickname\",\"sign_in_days\",\"sign_time\",\"sign_status\",\"home_level\",\"created_time\",\"coin_ad_count\",\"power_ad_count\",\"activity_count\",\"activity_progress\",\"status\"],\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\"}', 'php think crud --force=1 --table=game_user --controller=ss/user --model=ss/user --fields=id,nickname,sign_in_days,sign_time,sign_status,home_level,created_time,coin_ad_count,power_ad_count,activity_count,activity_progress,status', 'Build Successed', 1767841929, 1767841929, 1767841930, 'successed');
INSERT INTO `fa_command` VALUES (8, 'menu', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"1\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/User.php\"}', 'php think menu --force=1 --controller=ss/User', 'Build Successed!', 1767841938, 1767841938, 1767841939, 'successed');
INSERT INTO `fa_command` VALUES (9, 'crud', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user_pet\",\"controller\":\"ss\\/userpet\",\"model\":\"ss\\/userpet\",\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\"}', 'php think crud --force=1 --table=game_user_pet --controller=ss/userpet --model=ss/userpet', 'Build Successed', 1767843322, 1767843322, 1767843322, 'successed');
INSERT INTO `fa_command` VALUES (10, 'menu', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"1\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/Userpet.php\"}', 'php think menu --force=1 --controller=ss/Userpet', 'Build Successed!', 1767843333, 1767843333, 1767843333, 'successed');
INSERT INTO `fa_command` VALUES (11, 'crud', '{\"commandtype\":\"crud\",\"isrelation\":\"0\",\"local\":\"1\",\"delete\":\"0\",\"force\":\"1\",\"table\":\"game_user_prop\",\"controller\":\"ss\\/userprop\",\"model\":\"ss\\/userprop\",\"setcheckboxsuffix\":\"\",\"enumradiosuffix\":\"\",\"imagefield\":\"\",\"filefield\":\"\",\"intdatesuffix\":\"\",\"switchsuffix\":\"\",\"citysuffix\":\"\",\"selectpagesuffix\":\"\",\"selectpagessuffix\":\"\",\"ignorefields\":\"\",\"sortfield\":\"\",\"editorsuffix\":\"\",\"headingfilterfield\":\"\",\"tagsuffix\":\"\",\"jsonsuffix\":\"\",\"fixedcolumns\":\"\"}', 'php think crud --force=1 --table=game_user_prop --controller=ss/userprop --model=ss/userprop', 'Build Successed', 1767859928, 1767859928, 1767859928, 'successed');
INSERT INTO `fa_command` VALUES (12, 'menu', '{\"commandtype\":\"menu\",\"allcontroller\":\"0\",\"delete\":\"0\",\"force\":\"1\",\"controllerfile_text\":\"\",\"controllerfile\":\"ss\\/Userprop.php\"}', 'php think menu --force=1 --controller=ss/Userprop', 'Build Successed!', 1767859948, 1767859948, 1767859948, 'successed');

-- ----------------------------
-- Table structure for fa_config
-- ----------------------------
DROP TABLE IF EXISTS `fa_config`;
CREATE TABLE `fa_config`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '变量名',
  `group` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '分组',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '变量标题',
  `tip` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '变量描述',
  `type` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '类型:string,text,int,bool,array,datetime,date,file',
  `visible` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '可见条件',
  `value` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '变量值',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '变量字典数据',
  `rule` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '验证规则',
  `extend` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '扩展属性',
  `setting` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '配置',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `name`(`name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '系统配置' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_config
-- ----------------------------
INSERT INTO `fa_config` VALUES (1, 'name', 'basic', 'Site name', '请填写站点名称', 'string', '', '游戏后台', '', 'required', '', '');
INSERT INTO `fa_config` VALUES (2, 'beian', 'basic', 'Beian', '粤ICP备15000000号-1', 'string', '', '', '', '', '', '');
INSERT INTO `fa_config` VALUES (3, 'cdnurl', 'basic', 'Cdn url', '如果全站静态资源使用第三方云储存请配置该值', 'string', '', '', '', '', '', '');
INSERT INTO `fa_config` VALUES (4, 'version', 'basic', 'Version', '如果静态资源有变动请重新配置该值', 'string', '', '1.0.1', '', 'required', '', '');
INSERT INTO `fa_config` VALUES (5, 'timezone', 'basic', 'Timezone', '', 'string', '', 'Asia/Shanghai', '', 'required', '', '');
INSERT INTO `fa_config` VALUES (6, 'forbiddenip', 'basic', 'Forbidden ip', '一行一条记录', 'text', '', '', '', '', '', '');
INSERT INTO `fa_config` VALUES (7, 'languages', 'basic', 'Languages', '', 'array', '', '{\"backend\":\"zh-cn\",\"frontend\":\"zh-cn\"}', '', 'required', '', '');
INSERT INTO `fa_config` VALUES (8, 'fixedpage', 'basic', 'Fixed page', '请输入左侧菜单栏存在的链接', 'string', '', 'dashboard', '', 'required', '', '');
INSERT INTO `fa_config` VALUES (9, 'categorytype', 'dictionary', 'Category type', '', 'array', '', '{\"default\":\"Default\",\"page\":\"Page\",\"article\":\"Article\",\"test\":\"Test\"}', '', '', '', '');
INSERT INTO `fa_config` VALUES (10, 'configgroup', 'dictionary', 'Config group', '', 'array', '', '{\"basic\":\"Basic\",\"email\":\"Email\",\"dictionary\":\"Dictionary\",\"user\":\"User\",\"example\":\"Example\"}', '', '', '', '');
INSERT INTO `fa_config` VALUES (11, 'mail_type', 'email', 'Mail type', '选择邮件发送方式', 'select', '', '1', '[\"请选择\",\"SMTP\"]', '', '', '');
INSERT INTO `fa_config` VALUES (12, 'mail_smtp_host', 'email', 'Mail smtp host', '错误的配置发送邮件会导致服务器超时', 'string', '', 'smtp.qq.com', '', '', '', '');
INSERT INTO `fa_config` VALUES (13, 'mail_smtp_port', 'email', 'Mail smtp port', '(不加密默认25,SSL默认465,TLS默认587)', 'string', '', '465', '', '', '', '');
INSERT INTO `fa_config` VALUES (14, 'mail_smtp_user', 'email', 'Mail smtp user', '（填写完整用户名）', 'string', '', '', '', '', '', '');
INSERT INTO `fa_config` VALUES (15, 'mail_smtp_pass', 'email', 'Mail smtp password', '（填写您的密码或授权码）', 'password', '', '', '', '', '', '');
INSERT INTO `fa_config` VALUES (16, 'mail_verify_type', 'email', 'Mail vertify type', '（SMTP验证方式[推荐SSL]）', 'select', '', '2', '[\"无\",\"TLS\",\"SSL\"]', '', '', '');
INSERT INTO `fa_config` VALUES (17, 'mail_from', 'email', 'Mail from', '', 'string', '', '', '', '', '', '');
INSERT INTO `fa_config` VALUES (18, 'attachmentcategory', 'dictionary', 'Attachment category', '', 'array', '', '{\"category1\":\"Category1\",\"category2\":\"Category2\",\"custom\":\"Custom\"}', '', '', '', '');

-- ----------------------------
-- Table structure for fa_ems
-- ----------------------------
DROP TABLE IF EXISTS `fa_ems`;
CREATE TABLE `fa_ems`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `event` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '事件',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '邮箱',
  `code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '验证码',
  `times` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '验证次数',
  `ip` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT 'IP',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '邮箱验证码表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_ems
-- ----------------------------

-- ----------------------------
-- Table structure for fa_sms
-- ----------------------------
DROP TABLE IF EXISTS `fa_sms`;
CREATE TABLE `fa_sms`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `event` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '事件',
  `mobile` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '手机号',
  `code` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '验证码',
  `times` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '验证次数',
  `ip` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT 'IP',
  `createtime` bigint UNSIGNED NULL DEFAULT 0 COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '短信验证码表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_sms
-- ----------------------------

-- ----------------------------
-- Table structure for fa_test
-- ----------------------------
DROP TABLE IF EXISTS `fa_test`;
CREATE TABLE `fa_test`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `user_id` int NULL DEFAULT 0 COMMENT '会员ID',
  `admin_id` int NULL DEFAULT 0 COMMENT '管理员ID',
  `category_id` int UNSIGNED NULL DEFAULT 0 COMMENT '分类ID(单选)',
  `category_ids` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '分类ID(多选)',
  `tags` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '标签',
  `week` enum('monday','tuesday','wednesday') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '星期(单选):monday=星期一,tuesday=星期二,wednesday=星期三',
  `flag` set('hot','index','recommend') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '标志(多选):hot=热门,index=首页,recommend=推荐',
  `genderdata` enum('male','female') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'male' COMMENT '性别(单选):male=男,female=女',
  `hobbydata` set('music','reading','swimming') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '爱好(多选):music=音乐,reading=读书,swimming=游泳',
  `title` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '标题',
  `content` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '内容',
  `image` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '图片',
  `images` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '图片组',
  `attachfile` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '附件',
  `keywords` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '关键字',
  `description` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '描述',
  `city` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '省市',
  `array` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '数组:value=值',
  `json` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '配置:key=名称,value=值',
  `multiplejson` varchar(1500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '二维数组:title=标题,intro=介绍,author=作者,age=年龄',
  `price` decimal(10, 2) UNSIGNED NULL DEFAULT 0.00 COMMENT '价格',
  `views` int UNSIGNED NULL DEFAULT 0 COMMENT '点击',
  `workrange` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '时间区间',
  `startdate` date NULL DEFAULT NULL COMMENT '开始日期',
  `activitytime` datetime NULL DEFAULT NULL COMMENT '活动时间(datetime)',
  `year` year NULL DEFAULT NULL COMMENT '年',
  `times` time NULL DEFAULT NULL COMMENT '时间',
  `refreshtime` bigint NULL DEFAULT NULL COMMENT '刷新时间',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `updatetime` bigint NULL DEFAULT NULL COMMENT '更新时间',
  `deletetime` bigint NULL DEFAULT NULL COMMENT '删除时间',
  `weigh` int NULL DEFAULT 0 COMMENT '权重',
  `switch` tinyint(1) NULL DEFAULT 0 COMMENT '开关',
  `status` enum('normal','hidden') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT 'normal' COMMENT '状态',
  `state` enum('0','1','2') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '1' COMMENT '状态值:0=禁用,1=正常,2=推荐',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '测试表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_test
-- ----------------------------
INSERT INTO `fa_test` VALUES (1, 1, 1, 12, '12,13', '互联网,计算机', 'monday', 'hot,index', 'male', 'music,reading', '我是一篇测试文章', '<p>我是测试内容</p>', '/assets/img/avatar.png', '/assets/img/avatar.png,/assets/img/qrcode.png', '/assets/img/avatar.png', '关键字', '我是一篇测试文章描述，内容过多时将自动隐藏', '广西壮族自治区/百色市/平果县', '[\"a\",\"b\"]', '{\"a\":\"1\",\"b\":\"2\"}', '[{\"title\":\"标题一\",\"intro\":\"介绍一\",\"author\":\"小明\",\"age\":\"21\"}]', 0.00, 0, '2020-10-01 00:00:00 - 2021-10-31 23:59:59', '2017-07-10', '2017-07-10 18:24:45', 2017, '18:24:45', 1491635035, 1491635035, 1491635035, NULL, 0, 1, 'normal', '1');

-- ----------------------------
-- Table structure for fa_user
-- ----------------------------
DROP TABLE IF EXISTS `fa_user`;
CREATE TABLE `fa_user`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `group_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '组别ID',
  `username` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '用户名',
  `nickname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '昵称',
  `password` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '密码',
  `salt` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '密码盐',
  `email` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '电子邮箱',
  `mobile` varchar(11) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '手机号',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '头像',
  `level` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '等级',
  `gender` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '性别',
  `birthday` date NULL DEFAULT NULL COMMENT '生日',
  `bio` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '格言',
  `money` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '余额',
  `score` int NOT NULL DEFAULT 0 COMMENT '积分',
  `successions` int UNSIGNED NOT NULL DEFAULT 1 COMMENT '连续登录天数',
  `maxsuccessions` int UNSIGNED NOT NULL DEFAULT 1 COMMENT '最大连续登录天数',
  `prevtime` bigint NULL DEFAULT NULL COMMENT '上次登录时间',
  `logintime` bigint NULL DEFAULT NULL COMMENT '登录时间',
  `loginip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '登录IP',
  `loginfailure` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '失败次数',
  `loginfailuretime` bigint NULL DEFAULT NULL COMMENT '最后登录失败时间',
  `joinip` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '加入IP',
  `jointime` bigint NULL DEFAULT NULL COMMENT '加入时间',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `updatetime` bigint NULL DEFAULT NULL COMMENT '更新时间',
  `token` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT 'Token',
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '状态',
  `verification` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '验证',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `username`(`username` ASC) USING BTREE,
  INDEX `email`(`email` ASC) USING BTREE,
  INDEX `mobile`(`mobile` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '会员表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_user
-- ----------------------------
INSERT INTO `fa_user` VALUES (1, 1, 'admin', 'admin', '1f500b4911ad7e46efdf02a7012477b5', '7e6a01', 'admin@163.com', '13000000000', '/assets/img/avatar.png', 0, 0, '2017-04-08', '', 0.00, 0, 1, 1, 1491635035, 1491635035, '127.0.0.1', 0, 1491635035, '127.0.0.1', 1491635035, 0, 1491635035, '', 'normal', '');

-- ----------------------------
-- Table structure for fa_user_group
-- ----------------------------
DROP TABLE IF EXISTS `fa_user_group`;
CREATE TABLE `fa_user_group`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '组名',
  `rules` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT '权限节点',
  `createtime` bigint NULL DEFAULT NULL COMMENT '添加时间',
  `updatetime` bigint NULL DEFAULT NULL COMMENT '更新时间',
  `status` enum('normal','hidden') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '会员组表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_user_group
-- ----------------------------
INSERT INTO `fa_user_group` VALUES (1, '默认组', '1,2,3,4,5,6,7,8,9,10,11,12', 1491635035, 1491635035, 'normal');

-- ----------------------------
-- Table structure for fa_user_money_log
-- ----------------------------
DROP TABLE IF EXISTS `fa_user_money_log`;
CREATE TABLE `fa_user_money_log`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '会员ID',
  `money` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '变更余额',
  `before` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '变更前余额',
  `after` decimal(10, 2) NOT NULL DEFAULT 0.00 COMMENT '变更后余额',
  `memo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '备注',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '会员余额变动表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_user_money_log
-- ----------------------------

-- ----------------------------
-- Table structure for fa_user_rule
-- ----------------------------
DROP TABLE IF EXISTS `fa_user_rule`;
CREATE TABLE `fa_user_rule`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `pid` int NULL DEFAULT NULL COMMENT '父ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '名称',
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '标题',
  `remark` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '备注',
  `ismenu` tinyint(1) NULL DEFAULT NULL COMMENT '是否菜单',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `updatetime` bigint NULL DEFAULT NULL COMMENT '更新时间',
  `weigh` int NULL DEFAULT 0 COMMENT '权重',
  `status` enum('normal','hidden') CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '会员规则表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_user_rule
-- ----------------------------
INSERT INTO `fa_user_rule` VALUES (1, 0, 'index', 'Frontend', '', 1, 1491635035, 1491635035, 1, 'normal');
INSERT INTO `fa_user_rule` VALUES (2, 0, 'api', 'API Interface', '', 1, 1491635035, 1491635035, 2, 'normal');
INSERT INTO `fa_user_rule` VALUES (3, 1, 'user', 'User Module', '', 1, 1491635035, 1491635035, 12, 'normal');
INSERT INTO `fa_user_rule` VALUES (4, 2, 'user', 'User Module', '', 1, 1491635035, 1491635035, 11, 'normal');
INSERT INTO `fa_user_rule` VALUES (5, 3, 'index/user/login', 'Login', '', 0, 1491635035, 1491635035, 5, 'normal');
INSERT INTO `fa_user_rule` VALUES (6, 3, 'index/user/register', 'Register', '', 0, 1491635035, 1491635035, 7, 'normal');
INSERT INTO `fa_user_rule` VALUES (7, 3, 'index/user/index', 'User Center', '', 0, 1491635035, 1491635035, 9, 'normal');
INSERT INTO `fa_user_rule` VALUES (8, 3, 'index/user/profile', 'Profile', '', 0, 1491635035, 1491635035, 4, 'normal');
INSERT INTO `fa_user_rule` VALUES (9, 4, 'api/user/login', 'Login', '', 0, 1491635035, 1491635035, 6, 'normal');
INSERT INTO `fa_user_rule` VALUES (10, 4, 'api/user/register', 'Register', '', 0, 1491635035, 1491635035, 8, 'normal');
INSERT INTO `fa_user_rule` VALUES (11, 4, 'api/user/index', 'User Center', '', 0, 1491635035, 1491635035, 10, 'normal');
INSERT INTO `fa_user_rule` VALUES (12, 4, 'api/user/profile', 'Profile', '', 0, 1491635035, 1491635035, 3, 'normal');

-- ----------------------------
-- Table structure for fa_user_score_log
-- ----------------------------
DROP TABLE IF EXISTS `fa_user_score_log`;
CREATE TABLE `fa_user_score_log`  (
  `id` int UNSIGNED NOT NULL AUTO_INCREMENT,
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '会员ID',
  `score` int NOT NULL DEFAULT 0 COMMENT '变更积分',
  `before` int NOT NULL DEFAULT 0 COMMENT '变更前积分',
  `after` int NOT NULL DEFAULT 0 COMMENT '变更后积分',
  `memo` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '备注',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建时间',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '会员积分变动表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_user_score_log
-- ----------------------------

-- ----------------------------
-- Table structure for fa_user_token
-- ----------------------------
DROP TABLE IF EXISTS `fa_user_token`;
CREATE TABLE `fa_user_token`  (
  `token` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT 'Token',
  `user_id` int UNSIGNED NOT NULL DEFAULT 0 COMMENT '会员ID',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `expiretime` bigint NULL DEFAULT NULL COMMENT '过期时间',
  PRIMARY KEY (`token`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '会员Token表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_user_token
-- ----------------------------

-- ----------------------------
-- Table structure for fa_version
-- ----------------------------
DROP TABLE IF EXISTS `fa_version`;
CREATE TABLE `fa_version`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'ID',
  `oldversion` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '旧版本号',
  `newversion` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '新版本号',
  `packagesize` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '包大小',
  `content` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '升级内容',
  `downloadurl` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '下载地址',
  `enforce` tinyint UNSIGNED NOT NULL DEFAULT 0 COMMENT '强制更新',
  `createtime` bigint NULL DEFAULT NULL COMMENT '创建时间',
  `updatetime` bigint NULL DEFAULT NULL COMMENT '更新时间',
  `weigh` int NOT NULL DEFAULT 0 COMMENT '权重',
  `status` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT '' COMMENT '状态',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '版本表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of fa_version
-- ----------------------------

-- ----------------------------
-- Table structure for game_activity_circle
-- ----------------------------
DROP TABLE IF EXISTS `game_activity_circle`;
CREATE TABLE `game_activity_circle`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `circle_id` int NOT NULL COMMENT '活动圈 ID',
  `draw_gift` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '抽奖奖励',
  `draw_weight` int NOT NULL COMMENT '抽奖权重',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 45 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '活动奖表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_activity_circle
-- ----------------------------
INSERT INTO `game_activity_circle` VALUES (1, 1, '[[130001,1]]', 1000);
INSERT INTO `game_activity_circle` VALUES (2, 1, '[[130002,1]]', 1000);
INSERT INTO `game_activity_circle` VALUES (3, 1, '[[130003,1]]', 1000);
INSERT INTO `game_activity_circle` VALUES (4, 1, '[[130004,1]]', 500);
INSERT INTO `game_activity_circle` VALUES (5, 1, '[[130005,1]]', 500);
INSERT INTO `game_activity_circle` VALUES (6, 1, '[[101,100]]', 1000);
INSERT INTO `game_activity_circle` VALUES (7, 1, '[[101,200]]', 1000);
INSERT INTO `game_activity_circle` VALUES (8, 1, '[[101,500]]', 1000);
INSERT INTO `game_activity_circle` VALUES (9, 1, '[[103,5]]', 1000);
INSERT INTO `game_activity_circle` VALUES (10, 1, '[[103,10]]', 1000);
INSERT INTO `game_activity_circle` VALUES (11, 1, '[[103,15]]', 1000);
INSERT INTO `game_activity_circle` VALUES (12, 2, '[[130026,1]]', 1000);
INSERT INTO `game_activity_circle` VALUES (13, 2, '[[130027,1]]', 1000);
INSERT INTO `game_activity_circle` VALUES (14, 2, '[[130028,1]]', 1000);
INSERT INTO `game_activity_circle` VALUES (15, 2, '[[130029,1]]', 500);
INSERT INTO `game_activity_circle` VALUES (16, 2, '[[130030,1]]', 500);
INSERT INTO `game_activity_circle` VALUES (17, 2, '[[101,100]]', 1000);
INSERT INTO `game_activity_circle` VALUES (18, 2, '[[101,200]]', 1000);
INSERT INTO `game_activity_circle` VALUES (19, 2, '[[101,500]]', 1000);
INSERT INTO `game_activity_circle` VALUES (20, 2, '[[103,5]]', 1000);
INSERT INTO `game_activity_circle` VALUES (21, 2, '[[103,10]]', 1000);
INSERT INTO `game_activity_circle` VALUES (22, 2, '[[103,15]]', 1000);
INSERT INTO `game_activity_circle` VALUES (23, 3, '[[130006,1]]', 1000);
INSERT INTO `game_activity_circle` VALUES (24, 3, '[[130007,1]]', 1000);
INSERT INTO `game_activity_circle` VALUES (25, 3, '[[130008,1]]', 1000);
INSERT INTO `game_activity_circle` VALUES (26, 3, '[[130009,1]]', 500);
INSERT INTO `game_activity_circle` VALUES (27, 3, '[[130010,1]]', 500);
INSERT INTO `game_activity_circle` VALUES (28, 3, '[[101,100]]', 1000);
INSERT INTO `game_activity_circle` VALUES (29, 3, '[[101,200]]', 1000);
INSERT INTO `game_activity_circle` VALUES (30, 3, '[[101,500]]', 1000);
INSERT INTO `game_activity_circle` VALUES (31, 3, '[[103,5]]', 1000);
INSERT INTO `game_activity_circle` VALUES (32, 3, '[[103,10]]', 1000);
INSERT INTO `game_activity_circle` VALUES (33, 3, '[[103,15]]', 1000);
INSERT INTO `game_activity_circle` VALUES (34, 4, '[[130031,1]]', 1000);
INSERT INTO `game_activity_circle` VALUES (35, 4, '[[130032,1]]', 1000);
INSERT INTO `game_activity_circle` VALUES (36, 4, '[[130033,1]]', 1000);
INSERT INTO `game_activity_circle` VALUES (37, 4, '[[130034,1]]', 500);
INSERT INTO `game_activity_circle` VALUES (38, 4, '[[130035,1]]', 500);
INSERT INTO `game_activity_circle` VALUES (39, 4, '[[101,100]]', 1000);
INSERT INTO `game_activity_circle` VALUES (40, 4, '[[101,200]]', 1000);
INSERT INTO `game_activity_circle` VALUES (41, 4, '[[101,500]]', 1000);
INSERT INTO `game_activity_circle` VALUES (42, 4, '[[103,5]]', 1000);
INSERT INTO `game_activity_circle` VALUES (43, 4, '[[103,10]]', 1000);
INSERT INTO `game_activity_circle` VALUES (44, 4, '[[103,15]]', 1000);

-- ----------------------------
-- Table structure for game_activity_progress_award
-- ----------------------------
DROP TABLE IF EXISTS `game_activity_progress_award`;
CREATE TABLE `game_activity_progress_award`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `circle_id` int NOT NULL COMMENT '活动圈 ID',
  `progress` int NOT NULL COMMENT '活动进度',
  `task_gift` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '任务奖励',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 61 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '活动进度奖表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_activity_progress_award
-- ----------------------------
INSERT INTO `game_activity_progress_award` VALUES (1, 1, 1, '[[101,100]]');
INSERT INTO `game_activity_progress_award` VALUES (2, 1, 2, '[[101,200]]');
INSERT INTO `game_activity_progress_award` VALUES (3, 1, 3, '[[101,300]]');
INSERT INTO `game_activity_progress_award` VALUES (4, 1, 5, '[[101,400]]');
INSERT INTO `game_activity_progress_award` VALUES (5, 1, 8, '[[101,500]]');
INSERT INTO `game_activity_progress_award` VALUES (6, 1, 12, '[[101,600]]');
INSERT INTO `game_activity_progress_award` VALUES (7, 1, 16, '[[101,700]]');
INSERT INTO `game_activity_progress_award` VALUES (8, 1, 20, '[[101,800]]');
INSERT INTO `game_activity_progress_award` VALUES (9, 1, 24, '[[101,900]]');
INSERT INTO `game_activity_progress_award` VALUES (10, 1, 28, '[[101,1000]]');
INSERT INTO `game_activity_progress_award` VALUES (11, 1, 32, '[[101,1100]]');
INSERT INTO `game_activity_progress_award` VALUES (12, 1, 36, '[[101,1200]]');
INSERT INTO `game_activity_progress_award` VALUES (13, 1, 40, '[[101,1300]]');
INSERT INTO `game_activity_progress_award` VALUES (14, 1, 45, '[[101,1400]]');
INSERT INTO `game_activity_progress_award` VALUES (15, 1, 50, '[[101,1500]]');
INSERT INTO `game_activity_progress_award` VALUES (16, 2, 1, '[[103,5]]');
INSERT INTO `game_activity_progress_award` VALUES (17, 2, 2, '[[103,6]]');
INSERT INTO `game_activity_progress_award` VALUES (18, 2, 3, '[[103,7]]');
INSERT INTO `game_activity_progress_award` VALUES (19, 2, 5, '[[103,8]]');
INSERT INTO `game_activity_progress_award` VALUES (20, 2, 8, '[[103,9]]');
INSERT INTO `game_activity_progress_award` VALUES (21, 2, 12, '[[103,10]]');
INSERT INTO `game_activity_progress_award` VALUES (22, 2, 16, '[[103,11]]');
INSERT INTO `game_activity_progress_award` VALUES (23, 2, 20, '[[103,12]]');
INSERT INTO `game_activity_progress_award` VALUES (24, 2, 24, '[[103,13]]');
INSERT INTO `game_activity_progress_award` VALUES (25, 2, 28, '[[103,14]]');
INSERT INTO `game_activity_progress_award` VALUES (26, 2, 32, '[[103,15]]');
INSERT INTO `game_activity_progress_award` VALUES (27, 2, 36, '[[103,16]]');
INSERT INTO `game_activity_progress_award` VALUES (28, 2, 40, '[[103,17]]');
INSERT INTO `game_activity_progress_award` VALUES (29, 2, 45, '[[103,18]]');
INSERT INTO `game_activity_progress_award` VALUES (30, 2, 50, '[[103,20]]');
INSERT INTO `game_activity_progress_award` VALUES (31, 3, 1, '[[101,100]]');
INSERT INTO `game_activity_progress_award` VALUES (32, 3, 2, '[[101,200]]');
INSERT INTO `game_activity_progress_award` VALUES (33, 3, 3, '[[101,300]]');
INSERT INTO `game_activity_progress_award` VALUES (34, 3, 5, '[[101,400]]');
INSERT INTO `game_activity_progress_award` VALUES (35, 3, 8, '[[101,500]]');
INSERT INTO `game_activity_progress_award` VALUES (36, 3, 12, '[[101,600]]');
INSERT INTO `game_activity_progress_award` VALUES (37, 3, 16, '[[101,700]]');
INSERT INTO `game_activity_progress_award` VALUES (38, 3, 20, '[[101,800]]');
INSERT INTO `game_activity_progress_award` VALUES (39, 3, 24, '[[101,900]]');
INSERT INTO `game_activity_progress_award` VALUES (40, 3, 28, '[[101,1000]]');
INSERT INTO `game_activity_progress_award` VALUES (41, 3, 32, '[[101,1100]]');
INSERT INTO `game_activity_progress_award` VALUES (42, 3, 36, '[[101,1200]]');
INSERT INTO `game_activity_progress_award` VALUES (43, 3, 40, '[[101,1300]]');
INSERT INTO `game_activity_progress_award` VALUES (44, 3, 45, '[[101,1400]]');
INSERT INTO `game_activity_progress_award` VALUES (45, 3, 50, '[[101,1500]]');
INSERT INTO `game_activity_progress_award` VALUES (46, 4, 1, '[[103,5]]');
INSERT INTO `game_activity_progress_award` VALUES (47, 4, 2, '[[103,6]]');
INSERT INTO `game_activity_progress_award` VALUES (48, 4, 3, '[[103,7]]');
INSERT INTO `game_activity_progress_award` VALUES (49, 4, 5, '[[103,8]]');
INSERT INTO `game_activity_progress_award` VALUES (50, 4, 8, '[[103,9]]');
INSERT INTO `game_activity_progress_award` VALUES (51, 4, 12, '[[103,10]]');
INSERT INTO `game_activity_progress_award` VALUES (52, 4, 16, '[[103,11]]');
INSERT INTO `game_activity_progress_award` VALUES (53, 4, 20, '[[103,12]]');
INSERT INTO `game_activity_progress_award` VALUES (54, 4, 24, '[[103,13]]');
INSERT INTO `game_activity_progress_award` VALUES (55, 4, 28, '[[103,14]]');
INSERT INTO `game_activity_progress_award` VALUES (56, 4, 32, '[[103,15]]');
INSERT INTO `game_activity_progress_award` VALUES (57, 4, 36, '[[103,16]]');
INSERT INTO `game_activity_progress_award` VALUES (58, 4, 40, '[[103,17]]');
INSERT INTO `game_activity_progress_award` VALUES (59, 4, 45, '[[103,18]]');
INSERT INTO `game_activity_progress_award` VALUES (60, 4, 50, '[[103,20]]');

-- ----------------------------
-- Table structure for game_ad_prop_count
-- ----------------------------
DROP TABLE IF EXISTS `game_ad_prop_count`;
CREATE TABLE `game_ad_prop_count`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户 ID',
  `prop_id` int NOT NULL COMMENT '道具 ID',
  `ad_count` int NOT NULL COMMENT '广告次数',
  `store_type` int NOT NULL COMMENT '道具类型: 1-宠物 2-宠物道具 3-宠物服饰 4-家园装饰',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `game_ad_prop_count_user_id_prop_id_2790bfee_uniq`(`user_id` ASC, `prop_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '广告道具次数表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_ad_prop_count
-- ----------------------------
INSERT INTO `game_ad_prop_count` VALUES (1, 2, 110012, 1, 0);
INSERT INTO `game_ad_prop_count` VALUES (2, 3, 130003, 3, 3);
INSERT INTO `game_ad_prop_count` VALUES (3, 3, 140013, 1, 0);
INSERT INTO `game_ad_prop_count` VALUES (4, 7, 140016, 1, 0);
INSERT INTO `game_ad_prop_count` VALUES (5, 7, 140011, 1, 0);
INSERT INTO `game_ad_prop_count` VALUES (6, 7, 140012, 1, 0);
INSERT INTO `game_ad_prop_count` VALUES (7, 7, 120003, 1, 2);
INSERT INTO `game_ad_prop_count` VALUES (8, 7, 110015, 1, 1);
INSERT INTO `game_ad_prop_count` VALUES (9, 11, 130011, 0, 3);
INSERT INTO `game_ad_prop_count` VALUES (10, 26, 120003, 1, 2);

-- ----------------------------
-- Table structure for game_circle
-- ----------------------------
DROP TABLE IF EXISTS `game_circle`;
CREATE TABLE `game_circle`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `circle_id` int NOT NULL COMMENT '活动圈 ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '活动圈表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_circle
-- ----------------------------
INSERT INTO `game_circle` VALUES (1, 1);

-- ----------------------------
-- Table structure for game_friend
-- ----------------------------
DROP TABLE IF EXISTS `game_friend`;
CREATE TABLE `game_friend`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户 ID',
  `friend_id` int NOT NULL COMMENT '好友 ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `game_friend_user_id_friend_id_52891ae6_uniq`(`user_id` ASC, `friend_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '好友表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_friend
-- ----------------------------
INSERT INTO `game_friend` VALUES (6, 29, 26);
INSERT INTO `game_friend` VALUES (7, 31, 30);

-- ----------------------------
-- Table structure for game_friend_apply
-- ----------------------------
DROP TABLE IF EXISTS `game_friend_apply`;
CREATE TABLE `game_friend_apply`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户 ID',
  `friend_id` int NOT NULL COMMENT '好友 ID',
  `apply_time` datetime(6) NOT NULL COMMENT '申请时间',
  `is_accept` tinyint(1) NOT NULL COMMENT '是否同意',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `game_friend_apply_user_id_friend_id_5c0aa692_uniq`(`user_id` ASC, `friend_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '好友申请表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_friend_apply
-- ----------------------------

-- ----------------------------
-- Table structure for game_home_upgrade
-- ----------------------------
DROP TABLE IF EXISTS `game_home_upgrade`;
CREATE TABLE `game_home_upgrade`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `upgrade_cost` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '升级费用',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '家园升级表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_home_upgrade
-- ----------------------------
INSERT INTO `game_home_upgrade` VALUES (1, '[[100005,10]]');
INSERT INTO `game_home_upgrade` VALUES (2, '[[100005,20]]');
INSERT INTO `game_home_upgrade` VALUES (3, '[[100005,30]]');
INSERT INTO `game_home_upgrade` VALUES (4, '[[100005,40]]');
INSERT INTO `game_home_upgrade` VALUES (5, '[[100005,50]]');
INSERT INTO `game_home_upgrade` VALUES (6, '[[100005,60]]');
INSERT INTO `game_home_upgrade` VALUES (7, '[[100005,70]]');
INSERT INTO `game_home_upgrade` VALUES (8, '[[100005,80]]');
INSERT INTO `game_home_upgrade` VALUES (9, '[[100005,90]]');
INSERT INTO `game_home_upgrade` VALUES (10, '[[100005,100]]');

-- ----------------------------
-- Table structure for game_macro_parameter
-- ----------------------------
DROP TABLE IF EXISTS `game_macro_parameter`;
CREATE TABLE `game_macro_parameter`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `param_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '参数名称',
  `param_value` int NOT NULL COMMENT '参数值',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `param_name`(`param_name` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '宏参表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_macro_parameter
-- ----------------------------
INSERT INTO `game_macro_parameter` VALUES (1, '转盘开1次消耗', 300);
INSERT INTO `game_macro_parameter` VALUES (2, '改名字消耗', 300);
INSERT INTO `game_macro_parameter` VALUES (3, '看广告给金币数量', 300);
INSERT INTO `game_macro_parameter` VALUES (4, '看广告给金币每天次数', 5);
INSERT INTO `game_macro_parameter` VALUES (5, '看广告给体力数量', 5);
INSERT INTO `game_macro_parameter` VALUES (6, '看广告给体力每天次数', 5);
INSERT INTO `game_macro_parameter` VALUES (7, '家园中宠物心情度减少1点耗时·秒', 3600);
INSERT INTO `game_macro_parameter` VALUES (8, '家园中宠物饥饿度减少1点耗时·秒', 3600);
INSERT INTO `game_macro_parameter` VALUES (9, '家园中宠物清洁度减少1点耗时·秒', 3600);
INSERT INTO `game_macro_parameter` VALUES (10, '家园中宠物心情度达到百分比阀值回收宠物', 20);
INSERT INTO `game_macro_parameter` VALUES (11, '家园中宠物饥饿度达到百分比阀值回收宠物', 20);
INSERT INTO `game_macro_parameter` VALUES (12, '家园中宠物清洁度达到百分比阀值回收宠物', 20);
INSERT INTO `game_macro_parameter` VALUES (13, '未放置宠物饥饿度减少1点耗时·秒', 86400);
INSERT INTO `game_macro_parameter` VALUES (14, '未放置宠物清洁度减少1点耗时·秒', 86400);
INSERT INTO `game_macro_parameter` VALUES (15, '宠物饥饿度归零X天后自动删除', 7);
INSERT INTO `game_macro_parameter` VALUES (16, '宠物清洁度归零X天后自动删除', 7);
INSERT INTO `game_macro_parameter` VALUES (17, '宠物饥饿度达到百分比阀值不可放置家园', 20);
INSERT INTO `game_macro_parameter` VALUES (18, '宠物清洁度达到百分比阀值不可放置家园', 20);
INSERT INTO `game_macro_parameter` VALUES (19, '宠物改名消耗', 300);
INSERT INTO `game_macro_parameter` VALUES (20, '宠物饥饿度百分比阀值达到饥饿状态', 30);
INSERT INTO `game_macro_parameter` VALUES (21, '饥饿状态提示语', 1);
INSERT INTO `game_macro_parameter` VALUES (22, '宠物清洁度百分比阀值达到脏脏状态', 30);
INSERT INTO `game_macro_parameter` VALUES (23, '脏脏状态提示语', 2);
INSERT INTO `game_macro_parameter` VALUES (24, '好友数量上限', 50);
INSERT INTO `game_macro_parameter` VALUES (25, '宠物互动增加心情值', 5);

-- ----------------------------
-- Table structure for game_nest_upgrade
-- ----------------------------
DROP TABLE IF EXISTS `game_nest_upgrade`;
CREATE TABLE `game_nest_upgrade`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `nest_type` int NOT NULL COMMENT '窝类型: 1-猫窝 2-狗窝',
  `home_level` int NOT NULL COMMENT '家园等级',
  `upgrade_cost` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '升级费用',
  `pet_count` int NOT NULL COMMENT '宠物数量',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '窝升级表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_nest_upgrade
-- ----------------------------
INSERT INTO `game_nest_upgrade` VALUES (1, 1, 0, '[[101,100]]', 2);
INSERT INTO `game_nest_upgrade` VALUES (2, 1, 10, '[[101,200]]', 4);
INSERT INTO `game_nest_upgrade` VALUES (3, 1, 20, '[[101,300]]', 8);
INSERT INTO `game_nest_upgrade` VALUES (4, 1, 50, '[[101,400]]', 12);
INSERT INTO `game_nest_upgrade` VALUES (5, 1, 80, '[[101,500]]', 20);
INSERT INTO `game_nest_upgrade` VALUES (6, 2, 0, '[[101,600]]', 2);
INSERT INTO `game_nest_upgrade` VALUES (7, 2, 10, '[[101,700]]', 4);
INSERT INTO `game_nest_upgrade` VALUES (8, 2, 20, '[[101,800]]', 6);
INSERT INTO `game_nest_upgrade` VALUES (9, 2, 50, '[[101,900]]', 8);
INSERT INTO `game_nest_upgrade` VALUES (10, 2, 70, '[[101,1000]]', 16);

-- ----------------------------
-- Table structure for game_prop
-- ----------------------------
DROP TABLE IF EXISTS `game_prop`;
CREATE TABLE `game_prop`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `prop_id` int NOT NULL COMMENT '道具 ID',
  `prop_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '道具名称',
  `prop_type` int NOT NULL COMMENT '道具类型: 1-货币 2-宠物 3-消耗品 4-宠物服饰 5-家园装饰',
  `typeson` int NULL DEFAULT NULL COMMENT '道具子类型',
  `sonname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '道具子类型名称',
  `score` int NULL DEFAULT NULL,
  `use_item_effect` int NULL DEFAULT NULL,
  `levelGold` int NULL DEFAULT NULL COMMENT '道具出售价格',
  `store_type` int NULL DEFAULT NULL,
  `sell_type` int NULL DEFAULT NULL,
  `sell_type_value` int NULL DEFAULT NULL,
  `sell_need_level` int NULL DEFAULT NULL COMMENT '购买所需家园等级',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 134 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '道具表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_prop
-- ----------------------------
INSERT INTO `game_prop` VALUES (1, 101, '金币', 1, 0, '货币', 0, 0, 0, 0, 0, 0, 0);
INSERT INTO `game_prop` VALUES (2, 103, '体力', 1, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `game_prop` VALUES (3, 100001, '宠物心情值', 1, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `game_prop` VALUES (4, 100002, '宠物清洁度', 1, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `game_prop` VALUES (5, 100003, '宠物饥饿度', 1, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `game_prop` VALUES (6, 100004, '宠物评分', 1, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `game_prop` VALUES (7, 100005, '家园经验', 1, NULL, '', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `game_prop` VALUES (8, 110001, '金毛（深金）', 2, 1, '狗', 200, NULL, NULL, 1, 1, 50, 1);
INSERT INTO `game_prop` VALUES (9, 110002, '金毛（浅金）', 2, 1, '狗', 300, NULL, NULL, 1, 1, 100, 5);
INSERT INTO `game_prop` VALUES (10, 110003, '柴犬（黄）', 2, 1, '狗', 500, NULL, NULL, 1, 1, 150, 10);
INSERT INTO `game_prop` VALUES (11, 110004, '柴犬（黑）', 2, 1, '狗', 800, NULL, NULL, 1, 1, 200, 15);
INSERT INTO `game_prop` VALUES (12, 110005, '柴犬（白）', 2, 1, '狗', 1100, NULL, NULL, 1, 1, 250, 20);
INSERT INTO `game_prop` VALUES (13, 110006, '柯基（黄）', 2, 1, '狗', 1400, NULL, NULL, 1, 1, 300, 25);
INSERT INTO `game_prop` VALUES (14, 110007, '柯基（黑）', 2, 1, '狗', 1700, NULL, NULL, 1, 1, 350, 30);
INSERT INTO `game_prop` VALUES (15, 110008, '萨摩耶', 2, 1, '狗', 2000, NULL, NULL, 1, 1, 400, 35);
INSERT INTO `game_prop` VALUES (16, 110009, '边牧（黑）', 2, 1, '狗', 2300, NULL, NULL, 1, 1, 450, 40);
INSERT INTO `game_prop` VALUES (17, 110010, '边牧（棕）', 2, 1, '狗', 2600, NULL, NULL, 1, 1, 480, 43);
INSERT INTO `game_prop` VALUES (18, 110011, '边牧（陨石）', 2, 1, '狗', 2600, NULL, NULL, 1, 1, 500, 45);
INSERT INTO `game_prop` VALUES (19, 110012, '拉布拉多（黄）', 2, 1, '狗', 2900, NULL, NULL, 1, 1, 550, 50);
INSERT INTO `game_prop` VALUES (20, 110013, '拉布拉多（黑）', 2, 1, '狗', 3200, NULL, NULL, 1, 2, 2, 55);
INSERT INTO `game_prop` VALUES (21, 110014, '拉布拉多（白）', 2, 1, '狗', 3500, NULL, NULL, 1, 2, 3, 60);
INSERT INTO `game_prop` VALUES (22, 110015, '阿拉斯加', 2, 1, '狗', 3800, NULL, NULL, 1, 2, 5, 65);
INSERT INTO `game_prop` VALUES (23, 110016, '哈士奇', 2, 1, '狗', 4100, NULL, NULL, 1, 2, 10, 70);
INSERT INTO `game_prop` VALUES (24, 110017, '马尔济斯', 2, 1, '狗', 4400, NULL, NULL, 1, 2, 15, 75);
INSERT INTO `game_prop` VALUES (25, 110018, '泰迪（黄）', 2, 1, '狗', 4700, NULL, NULL, 1, 2, 20, 80);
INSERT INTO `game_prop` VALUES (26, 110019, '泰迪（白）', 2, 1, '狗', 5000, NULL, NULL, 1, 2, 25, 85);
INSERT INTO `game_prop` VALUES (27, 110020, '泰迪（黑）', 2, 1, '狗', 5300, NULL, NULL, 1, 2, 30, 90);
INSERT INTO `game_prop` VALUES (28, 110021, '布偶', 2, 2, '猫', 200, NULL, NULL, 1, 1, 50, 1);
INSERT INTO `game_prop` VALUES (29, 110022, '豹猫（白）', 2, 2, '猫', 300, NULL, NULL, 1, 1, 100, 5);
INSERT INTO `game_prop` VALUES (30, 110023, '豹猫（棕）', 2, 2, '猫', 500, NULL, NULL, 1, 1, 150, 10);
INSERT INTO `game_prop` VALUES (31, 110024, '渐层（金渐层）', 2, 2, '猫', 800, NULL, NULL, 1, 1, 200, 15);
INSERT INTO `game_prop` VALUES (32, 110025, '渐层（银渐层）', 2, 2, '猫', 1100, NULL, NULL, 1, 1, 250, 20);
INSERT INTO `game_prop` VALUES (33, 110026, '德文（白）', 2, 2, '猫', 1400, NULL, NULL, 1, 1, 300, 25);
INSERT INTO `game_prop` VALUES (34, 110027, '德文（黑）', 2, 2, '猫', 1700, NULL, NULL, 1, 1, 350, 30);
INSERT INTO `game_prop` VALUES (35, 110028, '德文（奶牛）', 2, 2, '猫', 2000, NULL, NULL, 1, 1, 400, 35);
INSERT INTO `game_prop` VALUES (36, 110029, '田园猫（黑）', 2, 2, '猫', 2300, NULL, NULL, 1, 1, 450, 40);
INSERT INTO `game_prop` VALUES (37, 110030, '田园猫（白）', 2, 2, '猫', 2600, NULL, NULL, 1, 1, 500, 45);
INSERT INTO `game_prop` VALUES (38, 110031, '田园猫（橘）', 2, 2, '猫', 2900, NULL, NULL, 1, 1, 550, 50);
INSERT INTO `game_prop` VALUES (39, 110032, '田园猫（奶牛）', 2, 2, '猫', 3200, NULL, NULL, 1, 2, 2, 55);
INSERT INTO `game_prop` VALUES (40, 110033, '田园猫（三花）', 2, 2, '猫', 3500, NULL, NULL, 1, 2, 3, 60);
INSERT INTO `game_prop` VALUES (41, 110034, '英短暹罗猫（黑）', 2, 2, '猫', 3800, NULL, NULL, 1, 2, 5, 65);
INSERT INTO `game_prop` VALUES (42, 110035, '英短暹罗猫（白）', 2, 2, '猫', 4100, NULL, NULL, 1, 2, 10, 70);
INSERT INTO `game_prop` VALUES (43, 120001, '普通狗粮', 3, 1, '饥饿度道具', NULL, 2, 10, 2, 1, 100, 1);
INSERT INTO `game_prop` VALUES (44, 120002, '大包狗粮', 3, 1, '饥饿度道具', NULL, 5, 20, 2, 1, 200, 5);
INSERT INTO `game_prop` VALUES (45, 120003, '洗澡巾', 3, 2, '清洁度道具', NULL, 5, 10, 2, 2, 5, 10);
INSERT INTO `game_prop` VALUES (46, 130001, '蓝纹领结', 4, 1, '1', 200, 0, 100, 3, 1, 100, 1);
INSERT INTO `game_prop` VALUES (47, 130002, '粉柔蝴蝶结', 4, 1, '1', 300, 0, 200, 3, 1, 200, 5);
INSERT INTO `game_prop` VALUES (48, 130003, '粉猫蝴蝶结', 4, 1, '1', 400, 0, 300, 3, 1, 300, 10);
INSERT INTO `game_prop` VALUES (49, 130004, '飘带蝴蝶结', 4, 1, '1', 500, 0, 400, 3, 1, 400, 15);
INSERT INTO `game_prop` VALUES (50, 130005, '艳红大蝴蝶结', 4, 1, '1', 600, 0, 500, 3, 1, 500, 20);
INSERT INTO `game_prop` VALUES (51, 130006, '暖橙围脖', 4, 1, '1', 700, 0, 600, 3, 1, 600, 25);
INSERT INTO `game_prop` VALUES (52, 130007, '蓝绳铃铛', 4, 1, '1', 800, 0, 700, 3, 1, 700, 30);
INSERT INTO `game_prop` VALUES (53, 130008, '派对尖帽', 4, 1, '2', 900, 0, 800, 3, 1, 800, 35);
INSERT INTO `game_prop` VALUES (54, 130009, '奶油甜筒帽', 4, 1, '2', 1000, 0, 900, 3, 1, 900, 40);
INSERT INTO `game_prop` VALUES (55, 130010, '圣诞红帽', 4, 1, '2', 1100, 0, 1000, 3, 1, 1000, 45);
INSERT INTO `game_prop` VALUES (56, 130011, '巫女尖帽', 4, 1, '2', 1200, 0, 1100, 3, 2, 1, 50);
INSERT INTO `game_prop` VALUES (57, 130012, '魔法星帽', 4, 1, '2', 1300, 0, 1200, 3, 2, 2, 55);
INSERT INTO `game_prop` VALUES (58, 130013, '花饰草帽', 4, 1, '2', 1400, 0, 1300, 3, 2, 3, 60);
INSERT INTO `game_prop` VALUES (59, 130014, '蓝调棒球帽', 4, 1, '2', 1500, 0, 1400, 3, 2, 4, 65);
INSERT INTO `game_prop` VALUES (60, 130015, '复古牛仔帽', 4, 1, '2', 1600, 0, 1500, 3, 2, 5, 70);
INSERT INTO `game_prop` VALUES (61, 130016, '俏耳红饰', 4, 1, '2', 1700, 0, 1600, 3, 2, 6, 75);
INSERT INTO `game_prop` VALUES (62, 130017, '金边项圈', 4, 1, '2', 1800, 0, 1700, 3, 2, 7, 80);
INSERT INTO `game_prop` VALUES (63, 130018, '红纹肚兜', 4, 1, '3', 1900, 0, 1800, 3, 2, 8, 80);
INSERT INTO `game_prop` VALUES (64, 130019, '蓝格领结', 4, 1, '3', 2000, 0, 1900, 3, 2, 9, 80);
INSERT INTO `game_prop` VALUES (65, 130020, '棕纹领结', 4, 1, '3', 2100, 0, 2000, 3, 2, 10, 80);
INSERT INTO `game_prop` VALUES (66, 130021, '灰调背包', 4, 1, '3', 2200, 0, 2100, 3, 2, 11, 80);
INSERT INTO `game_prop` VALUES (67, 130022, '紫绒背包', 4, 1, '3', 2300, 0, 2200, 3, 2, 12, 80);
INSERT INTO `game_prop` VALUES (68, 130023, '绿纹围兜', 4, 1, '3', 2400, 0, 2300, 3, 2, 13, 80);
INSERT INTO `game_prop` VALUES (69, 130024, '金纹围兜', 4, 1, '3', 2500, 0, 2400, 3, 2, 14, 80);
INSERT INTO `game_prop` VALUES (70, 130025, '肉肠小饰', 4, 1, '4', 2600, 0, 2500, 3, 2, 15, 80);
INSERT INTO `game_prop` VALUES (71, 130026, '星纹领结', 4, 2, '1', 200, 0, 100, 3, 1, 100, 1);
INSERT INTO `game_prop` VALUES (72, 130027, '红珠项圈', 4, 2, '1', 300, 0, 200, 3, 1, 200, 5);
INSERT INTO `game_prop` VALUES (73, 130028, '彩条围脖', 4, 2, '1', 400, 0, 300, 3, 1, 300, 10);
INSERT INTO `game_prop` VALUES (74, 130029, '蓝丝领结', 4, 2, '1', 500, 0, 400, 3, 1, 400, 1);
INSERT INTO `game_prop` VALUES (75, 130030, '紫羽肩饰', 4, 2, '1', 600, 0, 500, 3, 1, 500, 5);
INSERT INTO `game_prop` VALUES (76, 130031, '粉心蝴蝶结', 4, 2, '1', 700, 0, 600, 3, 1, 600, 10);
INSERT INTO `game_prop` VALUES (77, 130032, '绒球魔杖', 4, 2, '1', 800, 0, 700, 3, 1, 700, 15);
INSERT INTO `game_prop` VALUES (78, 130033, '瓜纹胸饰', 4, 2, '2', 900, 0, 800, 3, 1, 800, 20);
INSERT INTO `game_prop` VALUES (79, 130034, '蓝贝小帽', 4, 2, '2', 1000, 0, 900, 3, 1, 900, 25);
INSERT INTO `game_prop` VALUES (80, 130035, '蓝绒贝帽', 4, 2, '2', 1100, 0, 1000, 3, 1, 1000, 30);
INSERT INTO `game_prop` VALUES (81, 130036, '棕巧甜点', 4, 2, '2', 1200, 0, 1100, 3, 2, 1, 35);
INSERT INTO `game_prop` VALUES (82, 130037, '浅棕礼帽', 4, 2, '2', 1300, 0, 1200, 3, 2, 2, 40);
INSERT INTO `game_prop` VALUES (83, 130038, '深棕礼帽', 4, 2, '2', 1400, 0, 1300, 3, 2, 3, 45);
INSERT INTO `game_prop` VALUES (84, 130039, '黄纹圆帽', 4, 2, '2', 1500, 0, 1400, 3, 2, 4, 50);
INSERT INTO `game_prop` VALUES (85, 130040, '果饮挂饰', 4, 2, '2', 1600, 0, 1500, 3, 2, 5, 55);
INSERT INTO `game_prop` VALUES (86, 130041, '方盒小饰', 4, 2, '2', 1700, 0, 1600, 3, 2, 6, 60);
INSERT INTO `game_prop` VALUES (87, 130042, '金杖挂饰', 4, 2, '2', 1800, 0, 1700, 3, 2, 7, 65);
INSERT INTO `game_prop` VALUES (88, 130043, '棕白围脖', 4, 2, '3', 1900, 0, 1800, 3, 2, 8, 70);
INSERT INTO `game_prop` VALUES (89, 130044, '粉心围兜', 4, 2, '3', 2000, 0, 1900, 3, 2, 9, 75);
INSERT INTO `game_prop` VALUES (90, 130045, '绿纹围兜', 4, 2, '3', 2100, 0, 2000, 3, 2, 10, 80);
INSERT INTO `game_prop` VALUES (91, 130046, '紫星围兜', 4, 2, '3', 2200, 0, 2100, 3, 2, 11, 80);
INSERT INTO `game_prop` VALUES (92, 130047, '白纹围兜', 4, 2, '3', 2300, 0, 2200, 3, 2, 12, 80);
INSERT INTO `game_prop` VALUES (93, 130048, '蓝纹围兜', 4, 2, '3', 2400, 0, 2300, 3, 2, 13, 80);
INSERT INTO `game_prop` VALUES (94, 130049, '波点围兜', 4, 2, '3', 2500, 0, 2400, 3, 2, 14, 80);
INSERT INTO `game_prop` VALUES (95, 130050, '红纹围兜', 4, 2, '3', 2600, 0, 2500, 3, 2, 15, 80);
INSERT INTO `game_prop` VALUES (96, 140001, '中央喷泉', 5, 1, '室外装饰', NULL, NULL, 100, 4, 1, 100, 1);
INSERT INTO `game_prop` VALUES (97, 140002, '粉桐树', 5, 1, '室外装饰', NULL, NULL, 200, 4, 1, 200, 5);
INSERT INTO `game_prop` VALUES (98, 140003, '小熊坐垫', 5, 1, '室外装饰', NULL, NULL, 300, 4, 1, 300, 10);
INSERT INTO `game_prop` VALUES (99, 140004, '白桦树', 5, 1, '室外装饰', NULL, NULL, 400, 4, 1, 400, 15);
INSERT INTO `game_prop` VALUES (100, 140005, '狗狗帐篷', 5, 1, '室外装饰', NULL, NULL, 500, 4, 1, 500, 20);
INSERT INTO `game_prop` VALUES (101, 140006, '银杉树', 5, 1, '室外装饰', NULL, NULL, 600, 4, 1, 600, 25);
INSERT INTO `game_prop` VALUES (102, 140007, '紫帘秋千', 5, 1, '室外装饰', NULL, NULL, 700, 4, 1, 700, 30);
INSERT INTO `game_prop` VALUES (103, 140008, '金盏花', 5, 1, '室外装饰', NULL, NULL, 800, 4, 1, 800, 35);
INSERT INTO `game_prop` VALUES (104, 140009, '狗狗木凳', 5, 1, '室外装饰', NULL, NULL, 900, 4, 2, 5, 40);
INSERT INTO `game_prop` VALUES (105, 140010, '狗狗墙饰', 5, 1, '室外装饰', NULL, NULL, 1000, 4, 2, 6, 45);
INSERT INTO `game_prop` VALUES (106, 140011, '跷跷板', 5, 1, '室外装饰', NULL, NULL, 1100, 4, 2, 7, 50);
INSERT INTO `game_prop` VALUES (107, 140012, '莫奈睡莲', 5, 1, '室外装饰', NULL, NULL, 1200, 4, 2, 8, 55);
INSERT INTO `game_prop` VALUES (108, 140013, '宠物沙坑', 5, 1, '室外装饰', NULL, NULL, 1300, 4, 2, 9, 60);
INSERT INTO `game_prop` VALUES (109, 140014, '菠萝滑梯', 5, 1, '室外装饰', NULL, NULL, 1400, 4, 2, 10, 65);
INSERT INTO `game_prop` VALUES (110, 140015, '烧烤架', 5, 1, '室外装饰', NULL, NULL, 1500, 4, 2, 11, 70);
INSERT INTO `game_prop` VALUES (111, 140016, '小木屋', 5, 1, '室外装饰', NULL, NULL, 1600, 4, 2, 12, 75);
INSERT INTO `game_prop` VALUES (112, 141001, '消毒柜', 5, 2, '室内装饰', NULL, NULL, 100, 4, 1, 100, 1);
INSERT INTO `game_prop` VALUES (113, 141002, '猫咪挂像', 5, 2, '室内装饰', NULL, NULL, 200, 4, 1, 200, 5);
INSERT INTO `game_prop` VALUES (114, 141003, '橡木轮子', 5, 2, '室内装饰', NULL, NULL, 300, 4, 1, 300, 10);
INSERT INTO `game_prop` VALUES (115, 141004, '发财树', 5, 2, '室内装饰', NULL, NULL, 400, 4, 1, 400, 15);
INSERT INTO `game_prop` VALUES (116, 141005, '原木桌', 5, 2, '室内装饰', NULL, NULL, 500, 4, 1, 500, 20);
INSERT INTO `game_prop` VALUES (117, 141006, '壁灯', 5, 2, '室内装饰', NULL, NULL, 600, 4, 1, 600, 25);
INSERT INTO `game_prop` VALUES (118, 141007, '宠物小窝', 5, 2, '室内装饰', NULL, NULL, 700, 4, 1, 700, 30);
INSERT INTO `game_prop` VALUES (119, 141008, '小盆绿植', 5, 2, '室内装饰', NULL, NULL, 800, 4, 1, 800, 35);
INSERT INTO `game_prop` VALUES (120, 141009, '宠物衣柜', 5, 2, '室内装饰', NULL, NULL, 900, 4, 1, 900, 40);
INSERT INTO `game_prop` VALUES (121, 141010, '小狗餐盘', 5, 2, '室内装饰', NULL, NULL, 1000, 4, 1, 1000, 45);
INSERT INTO `game_prop` VALUES (122, 141011, '羊毛地垫', 5, 2, '室内装饰', NULL, NULL, 1100, 4, 1, 1100, 50);
INSERT INTO `game_prop` VALUES (123, 141012, '长沙发', 5, 2, '室内装饰', NULL, NULL, 1200, 4, 1, 1200, 55);
INSERT INTO `game_prop` VALUES (124, 141013, '大沙发', 5, 2, '室内装饰', NULL, NULL, 1300, 4, 1, 1300, 60);
INSERT INTO `game_prop` VALUES (125, 141014, '大玻璃', 5, 2, '室内装饰', NULL, NULL, 1400, 4, 2, 5, 10);
INSERT INTO `game_prop` VALUES (126, 141015, '积木台', 5, 2, '室内装饰', NULL, NULL, 1500, 4, 2, 10, 15);
INSERT INTO `game_prop` VALUES (127, 141016, '蓝色毛线球', 5, 2, '室内装饰', NULL, NULL, 1600, 4, 2, 15, 20);
INSERT INTO `game_prop` VALUES (128, 141017, '黄色毛线球', 5, 2, '室内装饰', NULL, NULL, 1700, 4, 2, 20, 25);
INSERT INTO `game_prop` VALUES (129, 141018, '宠物电视柜', 5, 2, '室内装饰', NULL, NULL, 1800, 4, 2, 25, 30);
INSERT INTO `game_prop` VALUES (130, 141019, '逗猫钓竿', 5, 2, '室内装饰', NULL, NULL, 1900, 4, 2, 30, 35);
INSERT INTO `game_prop` VALUES (131, 141020, '狗狗小凳', 5, 2, '室内装饰', NULL, NULL, 2000, 4, 2, 35, 40);
INSERT INTO `game_prop` VALUES (132, 141021, '狗狗水盆', 5, 2, '室内装饰', NULL, NULL, 2100, 4, 2, 40, 45);
INSERT INTO `game_prop` VALUES (133, 102, '钻石', 1, 0, '货币', 0, 0, 0, 0, 0, 0, 0);

-- ----------------------------
-- Table structure for game_scene
-- ----------------------------
DROP TABLE IF EXISTS `game_scene`;
CREATE TABLE `game_scene`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `scene_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '场景名称',
  `scene_type` int NOT NULL COMMENT '场景类型: 1-室外 2-室内',
  `home_level` int NOT NULL COMMENT '家园等级',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '场景表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_scene
-- ----------------------------
INSERT INTO `game_scene` VALUES (1, '院落', 1, 0);
INSERT INTO `game_scene` VALUES (2, '草丛', 1, 5);
INSERT INTO `game_scene` VALUES (3, '水池', 1, 10);
INSERT INTO `game_scene` VALUES (4, '花园', 1, 15);
INSERT INTO `game_scene` VALUES (5, '客厅', 2, 20);
INSERT INTO `game_scene` VALUES (6, '卧室', 2, 25);
INSERT INTO `game_scene` VALUES (7, '电脑屋', 2, 30);
INSERT INTO `game_scene` VALUES (8, '二楼', 2, 35);
INSERT INTO `game_scene` VALUES (9, '天台', 2, 40);

-- ----------------------------
-- Table structure for game_sign_in_config
-- ----------------------------
DROP TABLE IF EXISTS `game_sign_in_config`;
CREATE TABLE `game_sign_in_config`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `sign_in_reward` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '签到奖励',
  `sign_in_days` int NOT NULL COMMENT '签到天数',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '签到配置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_sign_in_config
-- ----------------------------
INSERT INTO `game_sign_in_config` VALUES (1, '[[101,100]]', 1);
INSERT INTO `game_sign_in_config` VALUES (2, '[[101,150]]', 2);
INSERT INTO `game_sign_in_config` VALUES (3, '[[101,200]]', 3);
INSERT INTO `game_sign_in_config` VALUES (4, '[[101,250]]', 4);
INSERT INTO `game_sign_in_config` VALUES (5, '[[101,300]]', 5);
INSERT INTO `game_sign_in_config` VALUES (6, '[[101,350]]', 6);
INSERT INTO `game_sign_in_config` VALUES (7, '[[101,400]]', 7);

-- ----------------------------
-- Table structure for game_task
-- ----------------------------
DROP TABLE IF EXISTS `game_task`;
CREATE TABLE `game_task`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `task_name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '任务名称',
  `task_type` int NOT NULL COMMENT '任务类型: 1-当日签到 2-观看X次广告 3-宠物互动X次',
  `done_count` int NOT NULL COMMENT '完成次数',
  `reward` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '奖励内容',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '任务表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_task
-- ----------------------------
INSERT INTO `game_task` VALUES (1, '当日签到', 1, 1, '[[101,100]]');
INSERT INTO `game_task` VALUES (2, '观看X次广告', 2, 5, '[[101,500]]');
INSERT INTO `game_task` VALUES (3, '宠物互动X次', 3, 5, '[[101,900]]');
INSERT INTO `game_task` VALUES (4, '观看X次广告', 2, 15, '[[101,1300]]');
INSERT INTO `game_task` VALUES (5, '宠物互动X次', 3, 15, '[[101,1700]]');

-- ----------------------------
-- Table structure for game_user
-- ----------------------------
DROP TABLE IF EXISTS `game_user`;
CREATE TABLE `game_user`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `openid` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '微信 ID',
  `userid` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '用户 ID',
  `token` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL COMMENT 'token',
  `nickname` varchar(30) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '姓名',
  `avatar` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '头像',
  `sign_in_days` int NOT NULL COMMENT '签到次数',
  `sign_time` date NULL DEFAULT NULL COMMENT '签到时间',
  `sign_status` int NOT NULL COMMENT '签到状态:0=未签到,1=已签到',
  `home_level` int NOT NULL COMMENT '家园等级',
  `created_time` datetime(6) NOT NULL COMMENT '创建时间',
  `music` double NOT NULL COMMENT '音乐音量',
  `sound` double NOT NULL COMMENT '音效音量',
  `coin_ad_count` int NOT NULL COMMENT '金币广告次数',
  `power_ad_count` int NOT NULL COMMENT '体力广告次数',
  `activity_count` int NOT NULL COMMENT '参与活动次数',
  `activity_progress` int NOT NULL COMMENT '活动进度',
  `status` int NULL DEFAULT NULL COMMENT '状态:0=重置,1=正常',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `openid`(`openid` ASC) USING BTREE,
  UNIQUE INDEX `userid`(`userid` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 33 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_user
-- ----------------------------
INSERT INTO `game_user` VALUES (19, '222', '00000119', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjE5LCJleHAiOiIxNzY4Mjc0MzYzIiwiaWF0IjoiMTc2Nzg0MjM2MyJ9.RZvoQahVn2WuKBAHV-sjEenS4XsxNmq0EIwmqkUnjGU', '测试用户24885', 'https://thirdwx.qlogo.cn/mmopen/vi_32/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0/132', 0, NULL, 0, 100, '2026-01-08 11:19:23.000000', 0.5, 0.5, 0, 0, 0, 1, 0);
INSERT INTO `game_user` VALUES (20, '1011', '00000120', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjIwLCJleHAiOiIxNzY5MjE4NTI0IiwiaWF0IjoiMTc2ODc4NjUyNCJ9.uHxEYCI6kDgPSC5vCkpnjSA3-JmavimroNZdCoReE5Y', '测试用户96482', 'https://thirdwx.qlogo.cn/mmopen/vi_32/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0/132', 0, NULL, 0, 1, '2026-01-08 11:22:29.000000', 0.5, 0.5, 0, 0, 0, 1, 1);
INSERT INTO `game_user` VALUES (21, '1119', '00000121', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjIxLCJleHAiOiIxNzY4Mjg1NDA4IiwiaWF0IjoiMTc2Nzg1MzQwOCJ9.ios77G-iS8AIEd-ZoUcVxl7Ja3a38hOKTXymeE_RkXU', '测试用户40574', 'https://thirdwx.qlogo.cn/mmopen/vi_32/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0/132', 0, NULL, 0, 1, '2026-01-08 11:32:34.000000', 0.5, 0.5, 0, 0, 0, 1, 1);
INSERT INTO `game_user` VALUES (22, '1234566', 'yiran', '123456', 'yiran', '/uploads/20260108/14f51a412371dccbf8d6df11eb14815d.png', 1, '2026-01-08', 0, 0, '2026-01-08 14:06:27.000000', 1, 1, 0, 0, 0, 1, 0);
INSERT INTO `game_user` VALUES (23, '12345678', '12345678', '12345678', 'shanyan', '/uploads/20260108/14f51a412371dccbf8d6df11eb14815d.png', 1, '2026-01-08', 0, 1, '2026-01-08 14:10:43.000000', 1, 1, 0, 0, 0, 1, 0);
INSERT INTO `game_user` VALUES (24, '1113', '00000124', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjI0LCJleHAiOiIxNzY5MTQ4ODc1IiwiaWF0IjoiMTc2ODcxNjg3NSJ9.NynHqw8Jfzd9Hg6TEA4ETA8pZ53rIUpiy0_2rP9x3bg', '测试用户2313', 'https://thirdwx.qlogo.cn/mmopen/vi_32/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0/132', 0, NULL, 0, 4, '2026-01-08 14:32:00.629585', 0.5, 0.5, 0, 0, 0, 1, 1);
INSERT INTO `game_user` VALUES (25, '1059', '00000125', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjI1LCJleHAiOiIxNzY4ODA4MjMzIiwiaWF0IjoiMTc2ODM3NjIzMyJ9.oHDFTX5xRB4ZO7vFRQtZbfkT6EP457qHo0j_F9bzMyE', '测试用户40235', 'https://thirdwx.qlogo.cn/mmopen/vi_32/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0/132', 1, '2026-01-14', 0, 1, '2026-01-08 14:40:45.961362', 0.5, 0.5, 0, 0, 0, 1, 1);
INSERT INTO `game_user` VALUES (26, '9998', '00000126', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjI2LCJleHAiOiIxNzY4OTg1ODI4IiwiaWF0IjoiMTc2ODU1MzgyOCJ9.wVKkhm4mKP6sDEY_f9r5PefobSPqpDQzmtByN_5OJ0k', '我是豌豆', 'https://thirdwx.qlogo.cn/mmopen/vi_32/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0/132', 2, '2026-01-10', 0, 24, '2026-01-08 14:47:46.633813', 0.5, 0.5, 0, 0, 0, 1, 1);
INSERT INTO `game_user` VALUES (27, '1012', '00000127', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjI3LCJleHAiOiIxNzY4MzA2MTY5IiwiaWF0IjoiMTc2Nzg3NDE2OSJ9.7CYe_KSxyxGgkcjlo64hrceQ1_spXT4LONXJiYeorvw', '测试用户38783', 'https://thirdwx.qlogo.cn/mmopen/vi_32/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0/132', 0, NULL, 0, 2, '2026-01-08 14:48:22.210590', 0.5, 0.5, 0, 0, 0, 1, 1);
INSERT INTO `game_user` VALUES (28, '1016', '00000128', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjI4LCJleHAiOiIxNzY4MzA2MTk5IiwiaWF0IjoiMTc2Nzg3NDE5OSJ9.myTKW1rK1LDuM15jcfnbMABCLFb0NfZnydLnqiJxcRo', '测试用户97645', 'https://thirdwx.qlogo.cn/mmopen/vi_32/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0/132', 0, NULL, 0, 15, '2026-01-08 14:59:43.966389', 0.5, 0.5, 0, 0, 0, 1, 1);
INSERT INTO `game_user` VALUES (29, '9999', '00000129', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjI5LCJleHAiOiIxNzY4NzMwMTkyIiwiaWF0IjoiMTc2ODI5ODE5MiJ9.8Pb3DctlY8V55h0NQ60u3YFdrnbbb3bBq7rZgryKcK0', '1', 'https://thirdwx.qlogo.cn/mmopen/vi_32/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0/132', 1, '2026-01-10', 0, 1, '2026-01-08 15:00:35.851143', 0.5, 0.5, 0, 0, 0, 1, 1);
INSERT INTO `game_user` VALUES (30, '8901', '00000130', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjMwLCJleHAiOiIxNzY4MjkwMjU0IiwiaWF0IjoiMTc2Nzg1ODI1NCJ9.Zn0J_KxlKfs3ffo2FaCgIGgkDW30e1NAzhpYvs8v3-I', '测试用户39560', 'https://thirdwx.qlogo.cn/mmopen/vi_32/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0/132', 0, NULL, 0, 1, '2026-01-08 15:44:14.631614', 0.5, 0.5, 0, 0, 0, 1, 1);
INSERT INTO `game_user` VALUES (31, '8902', '00000131', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjMxLCJleHAiOiIxNzY4MjkxNTI1IiwiaWF0IjoiMTc2Nzg1OTUyNSJ9.cumdK2U3bIpDDcbvo9XDVz9iTr7v_xf7pHBhkFoB6qw', '测试用户54021', 'https://thirdwx.qlogo.cn/mmopen/vi_32/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0/132', 0, NULL, 0, 1, '2026-01-08 15:44:19.973582', 0.5, 0.5, 0, 0, 0, 1, 1);
INSERT INTO `game_user` VALUES (32, '1115', '00000132', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOjMyLCJleHAiOiIxNzY4OTg1NzA1IiwiaWF0IjoiMTc2ODU1MzcwNSJ9.XMdbCFlflJjjHR3OlkZzEUencRs7zscxRImzIakTJJg', '测试用户25422', 'https://thirdwx.qlogo.cn/mmopen/vi_32/WnibPhIQtbvoocPOcyJtZOmJp1Mj2pmEUHfYPaMaN8nYqkKVAoT6NHtLLVicHDibicekEZvSa8T3IQwwnsr5UoN1Anwegt7cGPu97oMIcLEO5p0/132', 0, NULL, 0, 1, '2026-01-16 16:55:05.352423', 0.5, 0.5, 0, 0, 0, 1, 1);

-- ----------------------------
-- Table structure for game_user_home_decoration
-- ----------------------------
DROP TABLE IF EXISTS `game_user_home_decoration`;
CREATE TABLE `game_user_home_decoration`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户 ID',
  `prop_id` int NOT NULL COMMENT '家园装饰道具 ID',
  `is_active` tinyint(1) NOT NULL COMMENT '是否摆放',
  `position_x` double NOT NULL COMMENT '装饰位置 X 坐标',
  `position_y` double NOT NULL COMMENT '装饰位置 Y 坐标',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户家园装饰表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_user_home_decoration
-- ----------------------------
INSERT INTO `game_user_home_decoration` VALUES (27, 29, 140001, 1, -91.06542056074767, -165.0560747663551);
INSERT INTO `game_user_home_decoration` VALUES (28, 26, 140001, 1, 209.21984863281256, -144.9628993110705);
INSERT INTO `game_user_home_decoration` VALUES (29, 26, 140002, 1, 0, 0);
INSERT INTO `game_user_home_decoration` VALUES (30, 26, 140003, 1, -11.29218483213549, -317.09618768364834);
INSERT INTO `game_user_home_decoration` VALUES (31, 26, 140004, 1, -435.63468807079903, 366.7353890987333);
INSERT INTO `game_user_home_decoration` VALUES (32, 26, 140005, 1, -362.03510335803486, -107.18894623074164);
INSERT INTO `game_user_home_decoration` VALUES (33, 25, 140001, 1, -427.89215686274497, 3.9803921568626492);

-- ----------------------------
-- Table structure for game_user_nest
-- ----------------------------
DROP TABLE IF EXISTS `game_user_nest`;
CREATE TABLE `game_user_nest`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户 ID',
  `nest_type` int NOT NULL COMMENT '窝类型: 1-猫窝 2-狗窝',
  `nest_level` int NOT NULL COMMENT '窝等级',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `game_user_nest_user_id_nest_type_b3f7249c_uniq`(`user_id` ASC, `nest_type` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 61 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户窝表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_user_nest
-- ----------------------------
INSERT INTO `game_user_nest` VALUES (37, 19, 1, 0);
INSERT INTO `game_user_nest` VALUES (38, 19, 2, 0);
INSERT INTO `game_user_nest` VALUES (39, 20, 1, 1);
INSERT INTO `game_user_nest` VALUES (40, 20, 2, 1);
INSERT INTO `game_user_nest` VALUES (41, 21, 1, 1);
INSERT INTO `game_user_nest` VALUES (42, 21, 2, 1);
INSERT INTO `game_user_nest` VALUES (43, 24, 1, 0);
INSERT INTO `game_user_nest` VALUES (44, 24, 2, 0);
INSERT INTO `game_user_nest` VALUES (45, 25, 1, 0);
INSERT INTO `game_user_nest` VALUES (46, 25, 2, 0);
INSERT INTO `game_user_nest` VALUES (47, 26, 1, 0);
INSERT INTO `game_user_nest` VALUES (48, 26, 2, 0);
INSERT INTO `game_user_nest` VALUES (49, 27, 1, 0);
INSERT INTO `game_user_nest` VALUES (50, 27, 2, 0);
INSERT INTO `game_user_nest` VALUES (51, 28, 1, 0);
INSERT INTO `game_user_nest` VALUES (52, 28, 2, 0);
INSERT INTO `game_user_nest` VALUES (53, 29, 1, 0);
INSERT INTO `game_user_nest` VALUES (54, 29, 2, 0);
INSERT INTO `game_user_nest` VALUES (55, 30, 1, 0);
INSERT INTO `game_user_nest` VALUES (56, 30, 2, 0);
INSERT INTO `game_user_nest` VALUES (57, 31, 1, 0);
INSERT INTO `game_user_nest` VALUES (58, 31, 2, 0);
INSERT INTO `game_user_nest` VALUES (59, 32, 1, 0);
INSERT INTO `game_user_nest` VALUES (60, 32, 2, 0);

-- ----------------------------
-- Table structure for game_user_pet
-- ----------------------------
DROP TABLE IF EXISTS `game_user_pet`;
CREATE TABLE `game_user_pet`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户 ID',
  `prop_id` int NOT NULL COMMENT '宠物道具 ID',
  `mood_value` int NOT NULL COMMENT '心情值',
  `hunger_value` int NOT NULL COMMENT '饥饿值',
  `clean_value` int NOT NULL COMMENT '清洁值',
  `score` int NOT NULL COMMENT '宠物分值',
  `fs_prop_id` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL COMMENT '是否放置',
  `name` varchar(10) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL DEFAULT NULL COMMENT '宠物名称',
  `clean_0_days` int NOT NULL COMMENT '清洁值为0的天数',
  `hunger_0_days` int NOT NULL COMMENT '饥饿值为0的天数',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 106 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户宠物表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_user_pet
-- ----------------------------
INSERT INTO `game_user_pet` VALUES (89, 24, 110001, 20, 30, 8, 200, NULL, 0, '金毛（深金）', 0, 0);
INSERT INTO `game_user_pet` VALUES (90, 20, 110015, 100, 88, 88, 3800, NULL, 0, '阿拉斯加', 0, 0);
INSERT INTO `game_user_pet` VALUES (96, 26, 110021, 19, 32, 15, 200, NULL, 0, '布偶', 0, 0);
INSERT INTO `game_user_pet` VALUES (97, 26, 110022, 22, 16, 11, 300, NULL, 0, '豹猫（白）', 0, 0);
INSERT INTO `game_user_pet` VALUES (98, 26, 110024, 20, 11, 11, 800, NULL, 0, '渐层（金渐层）', 0, 0);
INSERT INTO `game_user_pet` VALUES (99, 26, 110025, 20, 11, 11, 1100, NULL, 0, '渐层（银渐层）', 0, 0);
INSERT INTO `game_user_pet` VALUES (100, 26, 110005, 20, 11, 11, 1100, NULL, 0, '柴犬（白）', 0, 0);
INSERT INTO `game_user_pet` VALUES (101, 26, 110001, 22, 11, 11, 200, NULL, 0, '金毛（深金）', 0, 0);
INSERT INTO `game_user_pet` VALUES (102, 26, 110002, 22, 11, 11, 300, NULL, 0, '金毛（浅金）', 0, 0);
INSERT INTO `game_user_pet` VALUES (103, 25, 110001, 23, 16, 14, 200, '50,', 0, '金毛（深金）', 0, 0);
INSERT INTO `game_user_pet` VALUES (104, 25, 110001, 100, 94, 94, 200, NULL, 0, '金毛（深金）', 0, 0);
INSERT INTO `game_user_pet` VALUES (105, 25, 110015, 20, 14, 14, 3800, '49,', 0, '阿拉斯加', 0, 0);

-- ----------------------------
-- Table structure for game_user_pet_clothing
-- ----------------------------
DROP TABLE IF EXISTS `game_user_pet_clothing`;
CREATE TABLE `game_user_pet_clothing`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户 ID',
  `prop_id` int NOT NULL COMMENT '宠物服饰道具 ID',
  `is_active` tinyint(1) NOT NULL COMMENT '是否穿戴',
  `score` int NOT NULL COMMENT '服饰分值',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 53 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户宠物服饰表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_user_pet_clothing
-- ----------------------------
INSERT INTO `game_user_pet_clothing` VALUES (46, 26, 130001, 1, 200);
INSERT INTO `game_user_pet_clothing` VALUES (47, 26, 130002, 1, 300);
INSERT INTO `game_user_pet_clothing` VALUES (48, 26, 130006, 0, 700);
INSERT INTO `game_user_pet_clothing` VALUES (49, 25, 130034, 1, 1000);
INSERT INTO `game_user_pet_clothing` VALUES (50, 25, 130033, 1, 900);
INSERT INTO `game_user_pet_clothing` VALUES (51, 25, 130001, 1, 200);
INSERT INTO `game_user_pet_clothing` VALUES (52, 25, 130035, 0, 1100);

-- ----------------------------
-- Table structure for game_user_prop
-- ----------------------------
DROP TABLE IF EXISTS `game_user_prop`;
CREATE TABLE `game_user_prop`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户 ID',
  `prop_id` int NOT NULL COMMENT '道具 ID',
  `prop_count` int NOT NULL COMMENT '道具数量',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `game_user_prop_user_id_prop_id_88ff4139_uniq`(`user_id` ASC, `prop_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 159 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户道具表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_user_prop
-- ----------------------------
INSERT INTO `game_user_prop` VALUES (86, 19, 120001, 0);
INSERT INTO `game_user_prop` VALUES (87, 19, 120002, 0);
INSERT INTO `game_user_prop` VALUES (88, 19, 120003, 0);
INSERT INTO `game_user_prop` VALUES (89, 19, 101, 0);
INSERT INTO `game_user_prop` VALUES (90, 19, 103, 0);
INSERT INTO `game_user_prop` VALUES (91, 19, 102, 0);
INSERT INTO `game_user_prop` VALUES (92, 20, 120001, 0);
INSERT INTO `game_user_prop` VALUES (93, 20, 120002, 0);
INSERT INTO `game_user_prop` VALUES (94, 20, 120003, 0);
INSERT INTO `game_user_prop` VALUES (95, 20, 101, 2930);
INSERT INTO `game_user_prop` VALUES (96, 20, 103, 76);
INSERT INTO `game_user_prop` VALUES (97, 20, 102, 100);
INSERT INTO `game_user_prop` VALUES (99, 21, 120002, 0);
INSERT INTO `game_user_prop` VALUES (100, 21, 120003, 0);
INSERT INTO `game_user_prop` VALUES (101, 21, 101, 1710);
INSERT INTO `game_user_prop` VALUES (102, 21, 103, 100);
INSERT INTO `game_user_prop` VALUES (103, 21, 102, 100);
INSERT INTO `game_user_prop` VALUES (104, 21, 120001, 0);
INSERT INTO `game_user_prop` VALUES (105, 24, 120001, 0);
INSERT INTO `game_user_prop` VALUES (106, 24, 120002, 0);
INSERT INTO `game_user_prop` VALUES (107, 24, 120003, 0);
INSERT INTO `game_user_prop` VALUES (108, 24, 101, 273);
INSERT INTO `game_user_prop` VALUES (109, 24, 102, 17);
INSERT INTO `game_user_prop` VALUES (110, 24, 103, 100);
INSERT INTO `game_user_prop` VALUES (111, 25, 120001, 0);
INSERT INTO `game_user_prop` VALUES (112, 25, 120002, 0);
INSERT INTO `game_user_prop` VALUES (113, 25, 120003, 0);
INSERT INTO `game_user_prop` VALUES (114, 25, 101, 1718);
INSERT INTO `game_user_prop` VALUES (115, 25, 102, 130);
INSERT INTO `game_user_prop` VALUES (116, 25, 103, 99869);
INSERT INTO `game_user_prop` VALUES (117, 26, 120001, 0);
INSERT INTO `game_user_prop` VALUES (118, 26, 120002, 0);
INSERT INTO `game_user_prop` VALUES (119, 26, 120003, 0);
INSERT INTO `game_user_prop` VALUES (120, 26, 101, 47883);
INSERT INTO `game_user_prop` VALUES (121, 26, 102, 49990);
INSERT INTO `game_user_prop` VALUES (122, 26, 103, 49225);
INSERT INTO `game_user_prop` VALUES (123, 27, 120001, 0);
INSERT INTO `game_user_prop` VALUES (124, 27, 120002, 0);
INSERT INTO `game_user_prop` VALUES (125, 27, 120003, 0);
INSERT INTO `game_user_prop` VALUES (126, 27, 101, 2000);
INSERT INTO `game_user_prop` VALUES (127, 27, 102, 99);
INSERT INTO `game_user_prop` VALUES (128, 27, 103, 99959);
INSERT INTO `game_user_prop` VALUES (129, 28, 120001, 0);
INSERT INTO `game_user_prop` VALUES (130, 28, 120002, 0);
INSERT INTO `game_user_prop` VALUES (131, 28, 120003, 0);
INSERT INTO `game_user_prop` VALUES (132, 28, 101, 2620);
INSERT INTO `game_user_prop` VALUES (133, 28, 102, 121);
INSERT INTO `game_user_prop` VALUES (134, 28, 103, 36);
INSERT INTO `game_user_prop` VALUES (135, 29, 120001, 1);
INSERT INTO `game_user_prop` VALUES (136, 29, 120002, 0);
INSERT INTO `game_user_prop` VALUES (137, 29, 120003, 0);
INSERT INTO `game_user_prop` VALUES (138, 29, 101, 1707);
INSERT INTO `game_user_prop` VALUES (139, 29, 102, 99);
INSERT INTO `game_user_prop` VALUES (140, 29, 103, 70);
INSERT INTO `game_user_prop` VALUES (141, 30, 120001, 0);
INSERT INTO `game_user_prop` VALUES (142, 30, 120002, 0);
INSERT INTO `game_user_prop` VALUES (143, 30, 120003, 0);
INSERT INTO `game_user_prop` VALUES (144, 30, 101, 2000);
INSERT INTO `game_user_prop` VALUES (145, 30, 102, 100);
INSERT INTO `game_user_prop` VALUES (146, 30, 103, 100);
INSERT INTO `game_user_prop` VALUES (147, 31, 120001, 0);
INSERT INTO `game_user_prop` VALUES (148, 31, 120002, 0);
INSERT INTO `game_user_prop` VALUES (149, 31, 120003, 0);
INSERT INTO `game_user_prop` VALUES (150, 31, 101, 2180);
INSERT INTO `game_user_prop` VALUES (151, 31, 102, 100);
INSERT INTO `game_user_prop` VALUES (152, 31, 103, 200);
INSERT INTO `game_user_prop` VALUES (153, 32, 120001, 0);
INSERT INTO `game_user_prop` VALUES (154, 32, 120002, 0);
INSERT INTO `game_user_prop` VALUES (155, 32, 120003, 0);
INSERT INTO `game_user_prop` VALUES (156, 32, 101, 2000);
INSERT INTO `game_user_prop` VALUES (157, 32, 102, 100);
INSERT INTO `game_user_prop` VALUES (158, 32, 103, 100);

-- ----------------------------
-- Table structure for game_user_scene
-- ----------------------------
DROP TABLE IF EXISTS `game_user_scene`;
CREATE TABLE `game_user_scene`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户 ID',
  `scene_id` int NOT NULL COMMENT '场景 ID',
  `is_active` tinyint(1) NOT NULL COMMENT '是否激活',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `game_user_scene_user_id_scene_id_63aa3e94_uniq`(`user_id` ASC, `scene_id` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 271 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户场景表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_user_scene
-- ----------------------------
INSERT INTO `game_user_scene` VALUES (163, 19, 1, 0);
INSERT INTO `game_user_scene` VALUES (164, 19, 2, 0);
INSERT INTO `game_user_scene` VALUES (165, 19, 3, 0);
INSERT INTO `game_user_scene` VALUES (166, 19, 4, 0);
INSERT INTO `game_user_scene` VALUES (167, 19, 5, 0);
INSERT INTO `game_user_scene` VALUES (168, 19, 6, 0);
INSERT INTO `game_user_scene` VALUES (169, 19, 7, 0);
INSERT INTO `game_user_scene` VALUES (170, 19, 8, 0);
INSERT INTO `game_user_scene` VALUES (171, 19, 9, 0);
INSERT INTO `game_user_scene` VALUES (172, 20, 1, 0);
INSERT INTO `game_user_scene` VALUES (173, 20, 2, 0);
INSERT INTO `game_user_scene` VALUES (174, 20, 3, 0);
INSERT INTO `game_user_scene` VALUES (175, 20, 4, 0);
INSERT INTO `game_user_scene` VALUES (176, 20, 5, 0);
INSERT INTO `game_user_scene` VALUES (177, 20, 6, 0);
INSERT INTO `game_user_scene` VALUES (178, 20, 7, 0);
INSERT INTO `game_user_scene` VALUES (179, 20, 8, 0);
INSERT INTO `game_user_scene` VALUES (180, 20, 9, 0);
INSERT INTO `game_user_scene` VALUES (181, 21, 1, 0);
INSERT INTO `game_user_scene` VALUES (182, 21, 2, 0);
INSERT INTO `game_user_scene` VALUES (183, 21, 3, 0);
INSERT INTO `game_user_scene` VALUES (184, 21, 4, 0);
INSERT INTO `game_user_scene` VALUES (185, 21, 5, 0);
INSERT INTO `game_user_scene` VALUES (186, 21, 6, 0);
INSERT INTO `game_user_scene` VALUES (187, 21, 7, 0);
INSERT INTO `game_user_scene` VALUES (188, 21, 8, 0);
INSERT INTO `game_user_scene` VALUES (189, 21, 9, 0);
INSERT INTO `game_user_scene` VALUES (190, 24, 1, 0);
INSERT INTO `game_user_scene` VALUES (191, 24, 2, 0);
INSERT INTO `game_user_scene` VALUES (192, 24, 3, 0);
INSERT INTO `game_user_scene` VALUES (193, 24, 4, 0);
INSERT INTO `game_user_scene` VALUES (194, 24, 5, 0);
INSERT INTO `game_user_scene` VALUES (195, 24, 6, 0);
INSERT INTO `game_user_scene` VALUES (196, 24, 7, 0);
INSERT INTO `game_user_scene` VALUES (197, 24, 8, 0);
INSERT INTO `game_user_scene` VALUES (198, 24, 9, 0);
INSERT INTO `game_user_scene` VALUES (199, 25, 1, 0);
INSERT INTO `game_user_scene` VALUES (200, 25, 2, 0);
INSERT INTO `game_user_scene` VALUES (201, 25, 3, 0);
INSERT INTO `game_user_scene` VALUES (202, 25, 4, 0);
INSERT INTO `game_user_scene` VALUES (203, 25, 5, 0);
INSERT INTO `game_user_scene` VALUES (204, 25, 6, 0);
INSERT INTO `game_user_scene` VALUES (205, 25, 7, 0);
INSERT INTO `game_user_scene` VALUES (206, 25, 8, 0);
INSERT INTO `game_user_scene` VALUES (207, 25, 9, 0);
INSERT INTO `game_user_scene` VALUES (208, 26, 1, 0);
INSERT INTO `game_user_scene` VALUES (209, 26, 2, 0);
INSERT INTO `game_user_scene` VALUES (210, 26, 3, 0);
INSERT INTO `game_user_scene` VALUES (211, 26, 4, 0);
INSERT INTO `game_user_scene` VALUES (212, 26, 5, 0);
INSERT INTO `game_user_scene` VALUES (213, 26, 6, 0);
INSERT INTO `game_user_scene` VALUES (214, 26, 7, 0);
INSERT INTO `game_user_scene` VALUES (215, 26, 8, 0);
INSERT INTO `game_user_scene` VALUES (216, 26, 9, 0);
INSERT INTO `game_user_scene` VALUES (217, 27, 1, 0);
INSERT INTO `game_user_scene` VALUES (218, 27, 2, 0);
INSERT INTO `game_user_scene` VALUES (219, 27, 3, 0);
INSERT INTO `game_user_scene` VALUES (220, 27, 4, 0);
INSERT INTO `game_user_scene` VALUES (221, 27, 5, 0);
INSERT INTO `game_user_scene` VALUES (222, 27, 6, 0);
INSERT INTO `game_user_scene` VALUES (223, 27, 7, 0);
INSERT INTO `game_user_scene` VALUES (224, 27, 8, 0);
INSERT INTO `game_user_scene` VALUES (225, 27, 9, 0);
INSERT INTO `game_user_scene` VALUES (226, 28, 1, 0);
INSERT INTO `game_user_scene` VALUES (227, 28, 2, 0);
INSERT INTO `game_user_scene` VALUES (228, 28, 3, 0);
INSERT INTO `game_user_scene` VALUES (229, 28, 4, 0);
INSERT INTO `game_user_scene` VALUES (230, 28, 5, 0);
INSERT INTO `game_user_scene` VALUES (231, 28, 6, 0);
INSERT INTO `game_user_scene` VALUES (232, 28, 7, 0);
INSERT INTO `game_user_scene` VALUES (233, 28, 8, 0);
INSERT INTO `game_user_scene` VALUES (234, 28, 9, 0);
INSERT INTO `game_user_scene` VALUES (235, 29, 1, 0);
INSERT INTO `game_user_scene` VALUES (236, 29, 2, 0);
INSERT INTO `game_user_scene` VALUES (237, 29, 3, 0);
INSERT INTO `game_user_scene` VALUES (238, 29, 4, 0);
INSERT INTO `game_user_scene` VALUES (239, 29, 5, 0);
INSERT INTO `game_user_scene` VALUES (240, 29, 6, 0);
INSERT INTO `game_user_scene` VALUES (241, 29, 7, 0);
INSERT INTO `game_user_scene` VALUES (242, 29, 8, 0);
INSERT INTO `game_user_scene` VALUES (243, 29, 9, 0);
INSERT INTO `game_user_scene` VALUES (244, 30, 1, 0);
INSERT INTO `game_user_scene` VALUES (245, 30, 2, 0);
INSERT INTO `game_user_scene` VALUES (246, 30, 3, 0);
INSERT INTO `game_user_scene` VALUES (247, 30, 4, 0);
INSERT INTO `game_user_scene` VALUES (248, 30, 5, 0);
INSERT INTO `game_user_scene` VALUES (249, 30, 6, 0);
INSERT INTO `game_user_scene` VALUES (250, 30, 7, 0);
INSERT INTO `game_user_scene` VALUES (251, 30, 8, 0);
INSERT INTO `game_user_scene` VALUES (252, 30, 9, 0);
INSERT INTO `game_user_scene` VALUES (253, 31, 1, 0);
INSERT INTO `game_user_scene` VALUES (254, 31, 2, 0);
INSERT INTO `game_user_scene` VALUES (255, 31, 3, 0);
INSERT INTO `game_user_scene` VALUES (256, 31, 4, 0);
INSERT INTO `game_user_scene` VALUES (257, 31, 5, 0);
INSERT INTO `game_user_scene` VALUES (258, 31, 6, 0);
INSERT INTO `game_user_scene` VALUES (259, 31, 7, 0);
INSERT INTO `game_user_scene` VALUES (260, 31, 8, 0);
INSERT INTO `game_user_scene` VALUES (261, 31, 9, 0);
INSERT INTO `game_user_scene` VALUES (262, 32, 1, 0);
INSERT INTO `game_user_scene` VALUES (263, 32, 2, 0);
INSERT INTO `game_user_scene` VALUES (264, 32, 3, 0);
INSERT INTO `game_user_scene` VALUES (265, 32, 4, 0);
INSERT INTO `game_user_scene` VALUES (266, 32, 5, 0);
INSERT INTO `game_user_scene` VALUES (267, 32, 6, 0);
INSERT INTO `game_user_scene` VALUES (268, 32, 7, 0);
INSERT INTO `game_user_scene` VALUES (269, 32, 8, 0);
INSERT INTO `game_user_scene` VALUES (270, 32, 9, 0);

-- ----------------------------
-- Table structure for game_user_task
-- ----------------------------
DROP TABLE IF EXISTS `game_user_task`;
CREATE TABLE `game_user_task`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL COMMENT '用户 ID',
  `task_type` int NOT NULL COMMENT '任务类型: 1-当日签到 2-观看X次广告 3-宠物互动X次',
  `done_count` int NOT NULL COMMENT '完成次数',
  `is_done` tinyint(1) NOT NULL COMMENT '是否完成',
  `task_id` int NOT NULL COMMENT '任务 ID',
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `game_user_task_user_id_task_type_6fd13348_uniq`(`user_id` ASC, `task_type` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 91 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '用户任务表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_user_task
-- ----------------------------
INSERT INTO `game_user_task` VALUES (55, 19, 1, 0, 0, 1);
INSERT INTO `game_user_task` VALUES (56, 19, 2, 0, 0, 2);
INSERT INTO `game_user_task` VALUES (57, 19, 3, 0, 0, 3);
INSERT INTO `game_user_task` VALUES (58, 20, 1, 0, 0, 1);
INSERT INTO `game_user_task` VALUES (59, 20, 2, 0, 0, 2);
INSERT INTO `game_user_task` VALUES (60, 20, 3, 0, 0, 3);
INSERT INTO `game_user_task` VALUES (61, 21, 1, 0, 0, 1);
INSERT INTO `game_user_task` VALUES (62, 21, 2, 0, 0, 2);
INSERT INTO `game_user_task` VALUES (63, 21, 3, 0, 0, 3);
INSERT INTO `game_user_task` VALUES (64, 24, 1, 0, 0, 1);
INSERT INTO `game_user_task` VALUES (65, 24, 2, 0, 0, 2);
INSERT INTO `game_user_task` VALUES (66, 24, 3, 0, 0, 3);
INSERT INTO `game_user_task` VALUES (67, 25, 1, 0, 0, 1);
INSERT INTO `game_user_task` VALUES (68, 25, 2, 0, 0, 2);
INSERT INTO `game_user_task` VALUES (69, 25, 3, 0, 0, 3);
INSERT INTO `game_user_task` VALUES (70, 26, 1, 0, 0, 1);
INSERT INTO `game_user_task` VALUES (71, 26, 2, 0, 0, 2);
INSERT INTO `game_user_task` VALUES (72, 26, 3, 0, 0, 3);
INSERT INTO `game_user_task` VALUES (73, 27, 1, 0, 0, 1);
INSERT INTO `game_user_task` VALUES (74, 27, 2, 0, 0, 2);
INSERT INTO `game_user_task` VALUES (75, 27, 3, 0, 0, 3);
INSERT INTO `game_user_task` VALUES (76, 28, 1, 0, 0, 1);
INSERT INTO `game_user_task` VALUES (77, 28, 2, 0, 0, 2);
INSERT INTO `game_user_task` VALUES (78, 28, 3, 0, 0, 3);
INSERT INTO `game_user_task` VALUES (79, 29, 1, 0, 0, 1);
INSERT INTO `game_user_task` VALUES (80, 29, 2, 0, 0, 2);
INSERT INTO `game_user_task` VALUES (81, 29, 3, 0, 0, 3);
INSERT INTO `game_user_task` VALUES (82, 30, 1, 0, 0, 1);
INSERT INTO `game_user_task` VALUES (83, 30, 2, 0, 0, 2);
INSERT INTO `game_user_task` VALUES (84, 30, 3, 0, 0, 3);
INSERT INTO `game_user_task` VALUES (85, 31, 1, 0, 0, 1);
INSERT INTO `game_user_task` VALUES (86, 31, 2, 0, 0, 2);
INSERT INTO `game_user_task` VALUES (87, 31, 3, 0, 0, 3);
INSERT INTO `game_user_task` VALUES (88, 32, 1, 0, 0, 1);
INSERT INTO `game_user_task` VALUES (89, 32, 2, 0, 0, 2);
INSERT INTO `game_user_task` VALUES (90, 32, 3, 0, 0, 3);

-- ----------------------------
-- Table structure for game_wheel_config
-- ----------------------------
DROP TABLE IF EXISTS `game_wheel_config`;
CREATE TABLE `game_wheel_config`  (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `weight` int NOT NULL COMMENT '权重',
  `num` int NOT NULL COMMENT '数量',
  `prop_id` int NOT NULL COMMENT '道具 ID',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci COMMENT = '转盘配置表' ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of game_wheel_config
-- ----------------------------
INSERT INTO `game_wheel_config` VALUES (1, 4000, 100, 101);
INSERT INTO `game_wheel_config` VALUES (2, 500, 1, 110001);
INSERT INTO `game_wheel_config` VALUES (3, 2900, 300, 101);
INSERT INTO `game_wheel_config` VALUES (4, 500, 1, 110002);
INSERT INTO `game_wheel_config` VALUES (5, 100, 30000, 101);
INSERT INTO `game_wheel_config` VALUES (6, 500, 1, 110015);
INSERT INTO `game_wheel_config` VALUES (7, 1000, 1000, 101);
INSERT INTO `game_wheel_config` VALUES (8, 500, 1, 110020);

SET FOREIGN_KEY_CHECKS = 1;
