CREATE TABLE IF NOT EXISTS `cafeteria` (`id` INTEGER NOT NULL , `name` VARCHAR(255) NOT NULL, `image_path` VARCHAR(255), PRIMARY KEY (`id`)) ENGINE=InnoDB;
CREATE TABLE IF NOT EXISTS `corners` (`cafeteria_id` INTEGER NOT NULL, `id` INTEGER NOT NULL , `name` VARCHAR(255), PRIMARY KEY (`id`)) ENGINE=InnoDB;

INSERT INTO cafeteria VALUES (1, "복지회관 학생식당", "res/images/cafeteria-1.jpg");
INSERT INTO cafeteria VALUES (2, "카페테리아", "res/images/cafeteria-2.jpg");
INSERT INTO cafeteria VALUES (3, "사범대식당", "res/images/cafeteria-3.jpg");
INSERT INTO cafeteria VALUES (4, "생활관 기숙사식당", "res/images/cafeteria-4.jpg");
INSERT INTO cafeteria VALUES (5, "교직원식당", "res/images/cafeteria-5.jpg");

INSERT INTO corners VALUES (1, 1, "1코너 점심(앞쪽)");
INSERT INTO corners VALUES (1, 2, "1코너 저녁(앞쪽)");
INSERT INTO corners VALUES (1, 3, "2-1코너 점심(앞쪽)");
INSERT INTO corners VALUES (1, 4, "2-2코너 저녁(앞쪽)");
INSERT INTO corners VALUES (1, 5, "2-2코너 점심(앞쪽)");
INSERT INTO corners VALUES (1, 6, "3코너(앞쪽)");
INSERT INTO corners VALUES (1, 7, "4코너(뒤쪽)");
INSERT INTO corners VALUES (1, 8, "5코너(뒤쪽)");

INSERT INTO corners VALUES (2, 9, "점심");
INSERT INTO corners VALUES (2, 10, "A코너(저녁)");
INSERT INTO corners VALUES (2, 11, "B코너");

INSERT INTO corners VALUES (3, 12, "점심");
INSERT INTO corners VALUES (3, 13, "저녁");

INSERT INTO corners VALUES (4, 14, "아침");
INSERT INTO corners VALUES (4, 15, "점심");
INSERT INTO corners VALUES (4, 16, "저녁");

INSERT INTO corners VALUES (5, 17, "점심");
INSERT INTO corners VALUES (5, 18, "저녁");
