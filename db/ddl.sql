CREATE DATABASE IF NOT EXISTS oak;

USE oak;

drop database oak;

CREATE TABLE IF NOT EXISTS user (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  username varchar(255) unique not null
);

CREATE TABLE IF NOT EXISTS object (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  parent varchar(255) not null,
  name varchar(255) not null,
  is_json boolean not null
);

CREATE TABLE IF NOT EXISTS json (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  content TEXT not null
);

CREATE TABLE IF NOT EXISTS object_json (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  object_id BIGINT UNSIGNED NOT NULL,
  json_id BIGINT UNSIGNED NOT NULL,
  version INT UNSIGNED NOT NULL,
  FOREIGN KEY (object_id) REFERENCES object(id),
  FOREIGN KEY (json_id) REFERENCES json(id)
);
