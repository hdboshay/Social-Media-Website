CREATE DATABASE project_db;
USE project_db;

CREATE TABLE comments (
    CommentID integer PRIMARY KEY AUTO_INCREMENT,
    UserID integer NOT NULL,
    PostID integer NOT NULL,
    CommentContent VARCHAR(255) NOT NULL
);

INSERT INTO comments (UserID, PostID, CommentContent)
VALUES
(1, 2, "comment from user 1"),
(2, 2, "comment from user 2"),
(3, 1, "comment from user 3");