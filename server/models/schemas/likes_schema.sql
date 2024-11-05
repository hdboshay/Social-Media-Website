CREATE DATABASE project_db;
USE project_db;

CREATE TABLE likes (
    LikeID integer PRIMARY KEY AUTO_INCREMENT,
    UserID integer NOT NULL,
    PostID integer NOT NULL
);

INSERT INTO likes (UserID, PostID)
VALUES
(1, 1),
(1, 5),
(2, 2),
(3, 1);