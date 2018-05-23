-- Creates a database in function of received parameters

CREATE DATABASE :DB_NAME
  	WITH OWNER = :DB_USERNAME
       	ENCODING = 'UTF8'
       	TABLESPACE = :DEFAULT_TS
       	CONNECTION LIMIT = -1;
