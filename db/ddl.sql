DROP DATABASE IF EXISTS oak;
CREATE DATABASE IF NOT EXISTS oak;

USE oak;

CREATE TABLE IF NOT EXISTS user
(
    id       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    username varchar(255) UNIQUE NOT NULL,
    password varchar(255)        NOT NULL
);

CREATE TABLE IF NOT EXISTS object
(
    id      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    parent  varchar(255) NOT NULL,
    name    varchar(255) NOT NULL,
    is_file boolean      NOT NULL
);

CREATE TABLE IF NOT EXISTS file
(
    id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    content      TEXT         NOT NULL,
    version      INT UNSIGNED NOT NULL,
    is_committed bool         NOT NULL
);

CREATE TABLE IF NOT EXISTS object_file
(
    id        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    object_id BIGINT UNSIGNED NOT NULL,
    file_id   BIGINT UNSIGNED NOT NULL,
    FOREIGN KEY (object_id) REFERENCES object (id),
    FOREIGN KEY (file_id) REFERENCES file (id)
);
