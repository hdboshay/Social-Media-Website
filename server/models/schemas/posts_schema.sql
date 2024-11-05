CREATE DATABASE project_db;
USE project_db;

CREATE TABLE posts (
    PostID integer PRIMARY KEY AUTO_INCREMENT,
    UserID integer NOT NULL,
    PostContent VARCHAR(255) NOT NULL,
    ImageURL VARCHAR(255),
    Created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO posts (UserID, PostContent, ImageURL)
VALUES
(1, "post from user 1", "https://picsum.photos/id/235/200/300"),
(2, "post from user 2", "https://picsum.photos/id/236/200/300"),
(3, "post from user 3", "https://picsum.photos/id/237/200/300");