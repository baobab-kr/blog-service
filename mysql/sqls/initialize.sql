DROP DATABASE IF EXISTS blog;

CREATE DATABASE blog;
USE blog;

CREATE TABLE USER (
  id INTEGER AUTO_INCREMENT,
  userid VARCHAR(15),
  username VARCHAR(10),
  email VARCHAR(30),
  password VARCHAR(15),
  role INTEGER,
  description VARCHAR(200),
  avatar_image VARCHAR(20),
  token VARCHAR(200),
  expire_time VARCHAR(10),
  PRIMARY KEY(id)
)