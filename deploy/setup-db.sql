CREATE TABLE IF NOT EXISTS `cafeteria` (`id` INTEGER NOT NULL , `name` VARCHAR(255) NOT NULL, `image_path` VARCHAR(255), PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `corners` (`id` INTEGER NOT NULL , `name` VARCHAR(255), `cafeteria_id` INTEGER, PRIMARY KEY (`id`), FOREIGN KEY (`cafeteria_id`) REFERENCES `cafeteria` (`id`) ON DELETE SET NULL ON UPDATE CASCADE) ENGINE=InnoDB DEFAULT CHARSET=utf8;
CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER NOT NULL , `token` VARCHAR(255), `barcode` VARCHAR(255), `last_login` DATETIME, `last_logout` DATETIME, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8;

INSERT INTO cafeteria VALUES (1, "복지회관 학생식당", "res/images/cafeteria-1.jpg");
INSERT INTO cafeteria VALUES (2, "카페테리아", "res/images/cafeteria-2.jpg");
INSERT INTO cafeteria VALUES (3, "사범대식당", "res/images/cafeteria-3.jpg");
INSERT INTO cafeteria VALUES (4, "생활관 기숙사식당", "res/images/cafeteria-4.jpg");
INSERT INTO cafeteria VALUES (5, "교직원식당", "res/images/cafeteria-5.jpg");

INSERT INTO corners VALUES (1, "1코너 점심(앞쪽)", 1);
INSERT INTO corners VALUES (2, "1코너 저녁(앞쪽)", 1);
INSERT INTO corners VALUES (3, "2-1코너 점심(앞쪽)", 1);
INSERT INTO corners VALUES (4, "2-2코너 저녁(앞쪽)", 1);
INSERT INTO corners VALUES (5, "2-2코너 점심(앞쪽)", 1);
INSERT INTO corners VALUES (6, "3코너(앞쪽)", 1);
INSERT INTO corners VALUES (7, "4코너(뒤쪽)", 1);
INSERT INTO corners VALUES (8, "5코너(뒤쪽)", 1);

INSERT INTO corners VALUES (9, "점심", 2);
INSERT INTO corners VALUES (10, "A코너(저녁)", 2);
INSERT INTO corners VALUES (11, "B코너", 2);

INSERT INTO corners VALUES (12, "점심", 3);
INSERT INTO corners VALUES (13, "저녁", 3);

INSERT INTO corners VALUES (14, "아침", 4);
INSERT INTO corners VALUES (15, "점심", 4);
INSERT INTO corners VALUES (16, "저녁", 4);

INSERT INTO corners VALUES (17, "점심", 5);
INSERT INTO corners VALUES (18, "저녁", 5);
