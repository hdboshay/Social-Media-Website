CREATE DATABASE project_db;
USE project_db;

CREATE TABLE users (
    UserID integer PRIMARY KEY AUTO_INCREMENT,
    Username VARCHAR(255) UNIQUE KEY NOT NULL,
    UserPassword VARCHAR(255) NOT NULL,
    role VARCHAR(16) NOT NULL DEFAULT 'user',
    Created TIMESTAMP NOT NULL DEFAULT NOW()
);

INSERT INTO users (Username, UserPassword, role)
VALUES
("user1", "$2b$10$8sm/sFWe5CyAZ4WbW1wTxer4YBJOHitqke1z0B.OPgVhQVDZgJ0F2", "admin"),
("user2", "$2b$10$jl2TKmtpIlOnjUNlaZDfZOwUvIc8BEKlVbXkQBV/E3Zgm5.yjvkGu", "user"),
("user3", "$2b$10$5u.9yfe71istiNtC2Fa7D.PxBiar5ZpeKsKavgDgIrOiw0F0DG/UW", "user");