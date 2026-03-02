-- psql -d postgres -U postgres -f db-create-test/prod.sql
-- Creates the database in that order:
-- 1) creates the users
-- 2) creates the tablespaces data and index for every user
-- 3) creates the database for every user
-- 4) creates the schemas in each database 

-- Da richiamare solo se lanciato per primo e l'utente comune non esiste già

\i create_user.sql

\i create_tablespaces-test.sql 

\i create_db-test.sql

\i create_schema-tourney-test.sql
