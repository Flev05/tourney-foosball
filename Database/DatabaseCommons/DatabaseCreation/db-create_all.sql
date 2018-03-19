-- Creates the database in thar order:
-- 1) creates the users
-- 2) creates the tablespaces data and index for every user
-- 3) creates the database for every user
-- 4) creates the schemas in each database 

\i user-create_all.sql

\i tablespace-create_all.sql 

\i db-create_all.sql

\i schema-create_all.sql



